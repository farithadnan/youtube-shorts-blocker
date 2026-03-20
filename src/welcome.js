document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
});

document.getElementById('open-youtube').addEventListener('click', () => {
  window.open('https://www.youtube.com', '_blank');
});

function updateBadge(enabled) {
  const badge = document.getElementById('statusBadge');
  const badgeText = document.getElementById('badgeText');
  if (enabled) {
    badge.classList.add('active');
    badgeText.textContent = 'Active \u2014 blocking Shorts';
  } else {
    badge.classList.remove('active');
    badgeText.textContent = 'Disabled \u2014 Shorts are visible';
  }
}

chrome.storage.sync.get(['shortsHiderEnabled'], (result) => {
  updateBadge(result.shortsHiderEnabled !== false);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.shortsHiderEnabled) {
    updateBadge(changes.shortsHiderEnabled.newValue !== false);
  }
});
