/**
 * Sentinel Content Script V2
 * Detects partner portals, performs secure handshakes, and enables interactive consent.
 */

// Partner detection is now dynamic via <meta name="consentchain-org-id" content="...">


let currentNonce = null;

async function checkAndSignal() {
  // Try to find the orgId and appId from meta tags
  const metaOrg = document.querySelector('meta[name="consentchain-org-id"]');
  const metaApp = document.querySelector('meta[name="consentchain-app-id"]');
  const orgId = metaOrg ? metaOrg.getAttribute('content') : null;
  const appId = metaApp ? metaApp.getAttribute('content') : null;
  
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

  // 4. Request background verification with specific App ID
  chrome.runtime.sendMessage(
    { type: 'VERIFY_PAGE', userAddress, orgId, appId },
    (response) => {
      const isVerified = response && response.verified;
      
      // 5. Signal the portal with standardized handshake
      window.postMessage({ 
        type: 'SENTINEL_HANDSHAKE', 
        orgId,
        appId,
        address: userAddress,
        verified: isVerified,
        nonce: currentNonce,
        source: 'sentinel-extension'
      }, '*');

      injectBadge(isVerified);
    }
  );
}

function injectBadge(verified, label = null) {
  const existing = document.getElementById('sentinel-badge');
  if (existing) existing.remove();

  const badge = document.createElement('div');
  badge.id = 'sentinel-badge';
  
    // V2 Styles: Premium Glassmorphism
    badge.style.cssText = `
        position: fixed;
        bottom: 32px;
        right: 32px;
        padding: 12px 20px;
        border-radius: 20px;
        background: ${verified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.6)'};
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        color: white;
        font-family: 'Outfit', -apple-system, system-ui, sans-serif;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999999;
        border: 1px solid ${verified ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.1)'};
        animation: premiumSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        user-select: none;
    `;

    badge.innerHTML = `
        <div style="width: 10px; height: 10px; border-radius: 50%; background: ${verified ? '#10b981' : '#f59e0b'}; ${verified ? 'box-shadow: 0 0 15px #10b981;' : 'box-shadow: 0 0 10px #f59e0b;'}"></div>
        <div style="display: flex; flex-direction: column;">
            <span style="font-size: 8px; opacity: 0.5; margin-bottom: -1px; font-weight: 800; letter-spacing: 0.2em;">SENTINEL</span>
            <span style="letter-spacing: 0.05em;">${label || (verified ? 'SECURED' : 'UNAUTHORIZED')}</span>
        </div>
        ${!verified ? `
            <div style="margin-left: 10px; padding: 4px 8px; background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; font-size: 9px; font-weight: 900; color: #f59e0b;">
                SYNC
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
    // Redirect to the central ConsentChain production vault
    const productionVault = 'https://consentchain-vert.vercel.app';
    
    if (!verified) {
        // Open the demo documentation/grant info if unauthorized
        window.open(`${productionVault}/dashboard`, '_blank');
    } else {
        // Open the dashboard vault
        window.open(`${productionVault}/dashboard`, '_blank');
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
        // Handshake established
    }
});
