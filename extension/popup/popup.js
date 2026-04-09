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
