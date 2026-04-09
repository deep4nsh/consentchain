/**
 * Sentinel Background Service Worker
 * Handles on-chain verification and SDK simulation
 */

const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const APP_ID = 721204057; // ConsentChain Smart Contract ID (Testnet)

// Verification Logic (Directly querying Algorand for the demo)
async function verifyOnChain(userAddress, orgId) {
  try {
    // 1. Convert userAddress and orgId to Box Name format
    // For the demo purpose, we'll perform a fetch to verify if the record exists
    // in the smart contract's Box storage or Local State.
    
    // Simulating SDK fetch from the main dashboard API for robustness in demo
    const response = await fetch(`http://localhost:3000/api/consents/${userAddress}`);
    const data = await response.json();
    
    if (data.consents) {
      const activeConsent = data.consents.find(c => c.org === orgId);
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
    const { userAddress, orgId } = request;
    
    verifyOnChain(userAddress, orgId).then(isVerified => {
      sendResponse({ verified: isVerified });
    });
    
    return true; // Keep channel open for async response
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
