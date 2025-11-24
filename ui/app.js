// UI module JS — controls nav between screens and basic keyboard interaction.

// Grab references to tabs and screens
const tabTrending = document.getElementById('tab-trending');
const tabComing = document.getElementById('tab-coming');
const screenTrending = document.getElementById('screen-trending');
const screenComing = document.getElementById('screen-coming');

function showScreen(targetTab, targetScreen) {
  // Update tab selected states for accessibility
  [tabTrending, tabComing].forEach(t => t.setAttribute('aria-selected','false'));
  targetTab.setAttribute('aria-selected','true');

  // Hide both screens, then show the target
  [screenTrending, screenComing].forEach(s => {
    s.classList.add('hidden');
    s.setAttribute('aria-hidden','true');
  });

  targetScreen.classList.remove('hidden');
  targetScreen.setAttribute('aria-hidden','false');
}

// Click handlers
tabTrending.addEventListener('click', () => showScreen(tabTrending, screenTrending));
tabComing.addEventListener('click', () => showScreen(tabComing, screenComing));

// Enable arrow key nav between tabs for keyboard users
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const current = tabTrending.getAttribute('aria-selected') === 'true' ? tabTrending : tabComing;
    const next = (current === tabTrending) ? tabComing : tabTrending;
    showScreen(next, (next === tabTrending) ? screenTrending : screenComing);
    next.focus();
  }
});

// Initial UI state: ensure Trending is visible
showScreen(tabTrending, screenTrending);
