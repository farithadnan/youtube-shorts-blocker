chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/welcome.html') });
  }

  // Set default state: enabled
  chrome.storage.sync.set({ shortsHiderEnabled: true });
});
