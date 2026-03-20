const toggle = document.getElementById('toggle');
const statusPill = document.getElementById('statusPill');
const statusText = document.getElementById('statusText');

function setStatus(enabled) {
  toggle.checked = enabled;
  if (enabled) {
    statusPill.className = 'status-pill active';
    statusText.textContent = 'Shorts are hidden';
  } else {
    statusPill.className = 'status-pill';
    statusText.textContent = 'Shorts are visible';
  }
}

chrome.storage.sync.get(['shortsHiderEnabled'], (result) => {
  setStatus(result.shortsHiderEnabled !== false);
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ shortsHiderEnabled: enabled });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE', enabled }, () => {
        void chrome.runtime.lastError;
      });
    }
  });

  setStatus(enabled);
});

document.getElementById('helpBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('src/welcome.html') });
});

document.getElementById('openYtBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://www.youtube.com' });
});

document.getElementById('donateLink').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://ko-fi.com/farithadnan' });
});

const itemsToggle = document.getElementById('itemsToggle');
const itemsList = document.getElementById('itemsList');

itemsToggle.addEventListener('click', () => {
  const collapsed = itemsList.classList.toggle('collapsed');
  itemsToggle.classList.toggle('collapsed', collapsed);
});
