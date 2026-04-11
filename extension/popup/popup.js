const addressInput = document.getElementById('address');
const saveBtn = document.getElementById('save');
const msg = document.getElementById('msg');
const syncTime = document.getElementById('sync-time');
const balanceBadge = document.getElementById('balance-badge');

const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';

// Load existing state
chrome.storage.local.get(['userAddress', 'lastSync'], (data) => {
  if (data.userAddress) {
    addressInput.value = data.userAddress;
    updateBalance(data.userAddress);
  }
  if (data.lastSync) {
    syncTime.textContent = new Date(data.lastSync).toLocaleTimeString();
  }
});

// Fetch ALGO balance from public indexer/algod
async function updateBalance(address) {
    if (!address) return;
    try {
        const response = await fetch(`${ALGOD_SERVER}/v2/accounts/${address}`);
        if (!response.ok) throw new Error('Account not found');
        const data = await response.json();
        const algoAmount = (data.amount / 1_000_000).toFixed(2);
        balanceBadge.textContent = `${algoAmount} ALGO`;
        balanceBadge.style.color = '#10b981';
    } catch (error) {
        balanceBadge.textContent = 'Offline';
        balanceBadge.style.color = '#ef4444';
    }
}

// Save new address
saveBtn.addEventListener('click', () => {
  const address = addressInput.value.trim();
  const timestamp = new Date().toISOString();
  
  chrome.storage.local.set({ 
      userAddress: address,
      lastSync: timestamp
  }, () => {
    msg.classList.add('show');
    syncTime.textContent = new Date(timestamp).toLocaleTimeString();
    updateBalance(address);
    
    setTimeout(() => {
      msg.classList.remove('show');
    }, 2000);
  });
});
const activeSiteCard = document.getElementById('active-site-card');
const siteOrgIdText = document.getElementById('site-org-id');
const siteStatusText = document.getElementById('site-status-text');
const revokeBtn = document.getElementById('revoke-btn');

// ... existing state load logic ...

// Initialize site detection
detectCurrentSite();

async function detectCurrentSite() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) return;

        // Scan for org-id meta tag
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const meta = document.querySelector('meta[name="consentchain-org-id"]');
                return meta ? meta.getAttribute('content') : null;
            }
        });

        const orgId = results[0]?.result;
        if (orgId) {
            activeSiteCard.style.display = 'block';
            siteOrgIdText.textContent = orgId;
            checkSitePermission(orgId);
        }
    } catch (err) {
        console.error('Site detection failed:', err);
    }
}

async function checkSitePermission(orgId) {
    const { userAddress } = await chrome.storage.local.get('userAddress');
    if (!userAddress) return;

    try {
        const response = await fetch(`https://consentchain-vert.vercel.app/api/consents/${userAddress}`);
        const data = await response.json();
        
        if (data.success && data.consents) {
            const hasConsent = data.consents.some(c => c.organization_id === orgId && c.status === 'active');
            if (hasConsent) {
                siteStatusText.innerHTML = '<span style="color: #10b981;">● Authorized</span>: Site has active ledger access.';
                revokeBtn.style.display = 'block';
                revokeBtn.onclick = () => {
                    const dashboardUrl = `https://consentchain-vert.vercel.app/dashboard?revoke=${orgId}`;
                    chrome.tabs.create({ url: dashboardUrl });
                };
            } else {
                siteStatusText.innerHTML = '<span style="color: #64748b;">○ Unauthorized</span>: No active consent detected.';
                revokeBtn.style.display = 'none';
            }
        }
    } catch (err) {
        siteStatusText.textContent = 'Unable to verify permissions.';
    }
}
