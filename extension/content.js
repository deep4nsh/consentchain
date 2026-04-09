/**
 * Sentinel Content Script
 * Detects partner portals and signals auto-unlock
 */

const PARTNER_MAP = {
  '/demo/hospital': 'apollo-health-demo',
  '/demo/bank': 'meta-finance-demo'
};

async function checkAndSignal() {
  const path = window.location.pathname;
  const orgId = PARTNER_MAP[path];
  
  if (!orgId) return;

  // 1. Alert the page that Sentinel is scanning
  window.postMessage({ type: 'CONSENT_CHALLENGE' }, '*');

  // 2. Get user address from extension storage
  const { userAddress } = await chrome.storage.local.get('userAddress');
  
  if (!userAddress) {
    console.log('Sentinel: No user address configured. Please set identity in extension popup.');
    return;
  }

  // 3. Request background verification
  chrome.runtime.sendMessage(
    { type: 'VERIFY_PAGE', userAddress, orgId },
    (response) => {
      if (response && response.verified) {
        console.log(`Sentinel: On-chain consent verified for ${orgId}. Unlocking...`);
        
        // 4. Signal the portal to auto-unlock
        window.postMessage({ 
          type: 'CONSENT_VERIFIED', 
          orgId,
          verifiedAt: new Date().toISOString()
        }, '*');

        // 5. Inject a subtle security badge
        injectBadge(true);
      } else {
        injectBadge(false);
      }
    }
  );
}

function injectBadge(verified) {
  const existing = document.getElementById('sentinel-badge');
  if (existing) existing.remove();

  const badge = document.createElement('div');
  badge.id = 'sentinel-badge';
  badge.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 20px;
    border-radius: 100px;
    background: ${verified ? 'rgba(16, 185, 129, 0.9)' : 'rgba(15, 23, 42, 0.9)'};
    backdrop-filter: blur(12px);
    color: white;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    display: flex;
    items-center;
    gap: 8px;
    z-index: 999999;
    border: 1px solid rgba(255,255,255,0.1);
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    cursor: default;
  `;

  badge.innerHTML = `
    <div style="width: 8px; h: 8px; border-radius: 50%; background: ${verified ? '#fff' : '#64748b'}; ${verified ? 'box-shadow: 0 0 10px #fff;' : ''}"></div>
    SENTINEL: ${verified ? 'SECURED' : 'LOCKED'}
  `;

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
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
