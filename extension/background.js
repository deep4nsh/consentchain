/**
 * Sentinel Background Service Worker
 * Handles on-chain verification and SDK simulation
 */

const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
// APP_ID is now dynamic via Partner Handshake

// Verification Logic (Directly querying Algorand for the demo)
async function verifyOnChain(userAddress, orgId, appId) {
  try {
    if (!userAddress || userAddress === 'undefined') {
      console.warn('Sentinel: No user address provided for verification.');
      return false;
    }

    // Build API URL with dynamic App ID discovery
    let apiUrl = `https://consentchain-vert.vercel.app/api/consents/${userAddress}`;
    if (appId) {
        apiUrl += `?app_id=${appId}`;
    }

    const response = await fetch(apiUrl);
    
    // Safety Check: Ensure we didn't get an HTML error page (Vercel 404/500)
    if (!response.ok) {
        console.error(`Sentinel API Error: ${response.status}`);
        return false;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        console.error('Sentinel API Error: Received non-JSON response');
        return false;
    }

    const data = await response.json();
    
    if (data.consents && Array.isArray(data.consents)) {
      const activeConsent = data.consents.find(c => c.organization_id === orgId && c.status === 'active');
      return !!activeConsent;
    }
    return false;
  } catch (error) {
    console.error('Sentinel verification error:', error);
    return false;
  }
}

// Listen for messages from official Dashboard (externally_connectable)
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.type === 'SYNC_ADDRESS') {
    const { address } = request;
    chrome.storage.local.set({ userAddress: address }, () => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Sentinel Synced',
        message: `Identity updated: ${address.substring(0, 10)}...`
      });
      sendResponse({ success: true });
    });
    return true;
  }
});

// Listen for messages from Content Scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'VERIFY_PAGE') {
    const { userAddress, orgId, appId } = request;
    
    verifyOnChain(userAddress, orgId, appId).then(isVerified => {
      sendResponse({ verified: isVerified });
    });
    
    return true; // Keep channel open for async response
  }

  if (request.type === 'SYNC_ADDRESS_INTERNAL') {
    const { address } = request;
    chrome.storage.local.set({ userAddress: address }, () => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Sentinel Universal Sync',
        message: `Identity updated: ${address.substring(0, 10)}...`
      });
      sendResponse({ success: true });
    });
    return true;
  }
});

// Broadcast address changes to all tabs
chrome.storage.onChanged.addListener((changes) => {
  if (changes.userAddress) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { 
          type: 'ADDRESS_UPDATED', 
          newAddress: changes.userAddress.newValue 
        });
      });
    });
  }
});
