const addressInput = document.getElementById('address');
const saveBtn = document.getElementById('save');
const msg = document.getElementById('msg');

// Load existing address
chrome.storage.local.get('userAddress', (data) => {
  if (data.userAddress) {
    addressInput.value = data.userAddress;
  }
});

// Save new address
saveBtn.addEventListener('click', () => {
  const address = addressInput.value.trim();
  
  chrome.storage.local.set({ userAddress: address }, () => {
    // Show success message
    msg.classList.add('show');
    
    // Broadcast update to background script (which then updates tabs)
    // Actually, background.js already has a listener for storage changes.
    
    setTimeout(() => {
      msg.classList.remove('show');
    }, 2000);
  });
});
