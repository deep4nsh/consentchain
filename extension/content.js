/**
 * Sentinel Content Script V2
 * Detects partner portals, performs secure handshakes, and enables interactive consent.
 */

// Partner detection is now dynamic via <meta name="consentchain-org-id" content="...">


let currentNonce = null;

async function checkAndSignal() {
  // Try to find the orgId from a meta tag
  const metaTag = document.querySelector('meta[name="consentchain-org-id"]');
  const orgId = metaTag ? metaTag.getAttribute('content') : null;
  
  if (!orgId) return;

  // 1. Generate Nonce for secure handshake
  currentNonce = Math.random().toString(36).substring(2, 15);

  // 2. Alert the page with a challenge
  window.postMessage({ 
    type: 'CONSENT_CHALLENGE', 
    nonce: currentNonce,
    version: '2.0.0'
  }, '*');

  // 3. Get user address from extension storage
  const { userAddress } = await chrome.storage.local.get('userAddress');
  
  if (!userAddress) {
    injectBadge(false, 'No Identity');
    return;
  }

  // 4. Request background verification
  chrome.runtime.sendMessage(
    { type: 'VERIFY_PAGE', userAddress, orgId },
    (response) => {
      if (response && response.verified) {
        // 5. Signal the portal to auto-unlock with verified nonce
        window.postMessage({ 
          type: 'CONSENT_VERIFIED', 
          orgId,
          nonce: currentNonce,
          verifiedAt: new Date().toISOString()
        }, '*');

        injectBadge(true);
      } else {
        injectBadge(false);
      }
    }
  );
}

function injectBadge(verified, label = null) {
  const existing = document.getElementById('sentinel-badge');
  if (existing) existing.remove();

  const badge = document.createElement('div');
  badge.id = 'sentinel-badge';
  
  // V2 Styles: Interactive & Modern
  badge.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 10px 18px;
    border-radius: 16px;
    background: ${verified ? 'rgba(16, 185, 129, 0.95)' : 'rgba(15, 23, 42, 0.95)'};
    backdrop-filter: blur(16px);
    color: white;
    font-family: -apple-system, system-ui, sans-serif;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    box-shadow: 0 12px 32px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 999999;
    border: 1px solid rgba(255,255,255,0.1);
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
  `;

  badge.innerHTML = `
    <div style="width: 8px; height: 8px; border-radius: 50%; background: #fff; ${verified ? 'box-shadow: 0 0 10px #fff;' : 'opacity: 0.3;'}"></div>
    <div style="display: flex; flex-direction: column;">
        <span style="font-size: 9px; opacity: 0.7; margin-bottom: -1px;">SENTINEL V2</span>
        <span>${label || (verified ? 'SECURED' : 'UNAUTHORIZED')}</span>
    </div>
    ${!verified ? `
        <div style="margin-left: 10px; padding: 4px 8px; background: rgba(255,255,255,0.1); border-radius: 6px; font-size: 9px; hover:background: rgba(255,255,255,0.2);">
            REQUEST
        </div>
    ` : ''}
  `;

  badge.addEventListener('mouseenter', () => {
    badge.style.transform = 'translateY(-2px) scale(1.02)';
  });
  
  badge.addEventListener('mouseleave', () => {
    badge.style.transform = 'translateY(0) scale(1)';
  });

  badge.addEventListener('click', () => {
    // Dynamically determine the base URL (Vercel or localhost)
    const baseUrl = window.location.origin;
    
    if (!verified) {
        // Open the demo page to grant consent
        window.open(`${baseUrl}/demo`, '_blank');
    } else {
        // Open the dashboard
        window.open(`${baseUrl}/dashboard`, '_blank');
    }
  });

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(badge);
}

// Initial check
checkAndSignal();

// Listen for address updates from background
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'ADDRESS_UPDATED') {
    checkAndSignal();
  }
});

// Secure Handshake listener (Confirming the page is listening)
window.addEventListener('message', (event) => {
    if (event.data.type === 'CONSENT_ACK' && event.data.nonce === currentNonce) {
        console.log('Sentinel: Secure handshake established with partner site.');
    }
});
