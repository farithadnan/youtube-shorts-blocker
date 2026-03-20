// Shorts Blocker for YouTube - content.js

const SHORTS_SELECTORS = [
  // Home feed Shorts shelf
  'ytd-rich-shelf-renderer[is-shorts]',
  // Search results Shorts reel
  'ytd-reel-shelf-renderer',
  // Shorts tab on channel pages
  'tp-yt-paper-tab:has([tab-identifier="Shorts"])',
  // Individual Short cards in the feed
  'ytd-rich-item-renderer:has(a[href*="/shorts/"])',
  // Shorts in the "Up Next" sidebar
  'ytd-compact-video-renderer:has(a[href*="/shorts/"])',
  // "Shorts" filter chip in search
  'yt-chip-cloud-chip-renderer:has([title="Shorts"])',

  // ── LEFT SIDEBAR (expanded) ──
  'ytd-guide-entry-renderer:has(a[href="/shorts"])',
  'ytd-guide-entry-renderer:has(a[title="Shorts"])',
  'ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[href="/shorts"])',
  'ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[title="Shorts"])',

  // ── LEFT SIDEBAR (collapsed / mini) ──
  'ytd-mini-guide-entry-renderer:has(a[href="/shorts"])',
  'ytd-mini-guide-entry-renderer:has(a[title="Shorts"])',
];

const styleTag = document.createElement('style');
styleTag.id = 'shorts-blocker-style';
(document.head || document.documentElement).appendChild(styleTag);

let isEnabled = true;

function buildCSS() {
  return SHORTS_SELECTORS.join(',\n') + ' { display: none !important; }';
}

function applyHide() { styleTag.textContent = buildCSS(); }
function applyShow() { styleTag.textContent = ''; }

chrome.storage.sync.get(['shortsHiderEnabled'], (result) => {
  isEnabled = result.shortsHiderEnabled !== false;
  isEnabled ? applyHide() : applyShow();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE') {
    isEnabled = message.enabled;
    isEnabled ? applyHide() : applyShow();
  }
});

const observer = new MutationObserver(() => {
  if (isEnabled && styleTag.textContent === '') applyHide();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
