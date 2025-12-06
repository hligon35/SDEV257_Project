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


// FILTERING + INTERACTIVITY MODULE



// === Grab filter UI elements ===
const genreFilter = document.getElementById("genre-filter");
const popularityFilter = document.getElementById("popularity-filter");

// Containers where cards live
const trendingCardsContainer = document.querySelector("#trending-cards") || screenTrending.querySelector(".cards");
const upcomingCardsContainer = document.querySelector("#upcoming-cards") || screenComing.querySelector(".cards");

// State tracking
let currentGenre = "all";
let sortByPopularity = false;


// === Helper: extract rating from Harold's HTML ===
function getCardRating(card) {
  const meta = card.querySelector(".meta");
  if (!meta) return 0;

  const match = meta.textContent.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}


// === Main filter function ===
function applyFilters(container) {
  const cards = Array.from(container.querySelectorAll(".card"));

  let filtered = cards;

  // Filter by genre using simple keyword matching
  if (currentGenre !== "all") {
    filtered = filtered.filter(card =>
      card.textContent.toLowerCase().includes(currentGenre.toLowerCase())
    );
  }

  // Sort by popularity using rating in Harold’s placeholder cards
  if (sortByPopularity) {
    filtered = filtered.sort((a, b) => getCardRating(b) - getCardRating(a));
  }

  // Re-render cards
  container.innerHTML = "";
  filtered.forEach(card => container.appendChild(card));
}


// === Apply filters to the currently visible screen ===
function refreshCurrentScreen() {
  const trendingVisible = !screenTrending.classList.contains("hidden");

  if (trendingVisible) {
    applyFilters(trendingCardsContainer);
  } else {
    applyFilters(upcomingCardsContainer);
  }
}


// === Event listeners for filters ===

// When user selects a genre
genreFilter.addEventListener("change", (e) => {
  currentGenre = e.target.value;
  refreshCurrentScreen();
});

// When user clicks "Sort by Popularity"
popularityFilter.addEventListener("click", () => {
  sortByPopularity = !sortByPopularity;

  // Toggle button appearance
  if (sortByPopularity) {
    popularityFilter.classList.add("is-active");
    popularityFilter.textContent = "Sort by Default";
  } else {
    popularityFilter.classList.remove("is-active");
    popularityFilter.textContent = "Sort by Popularity";
  }

  refreshCurrentScreen();
});


// === Reapply filters whenever the tab switches ===
tabTrending.addEventListener("click", () => refreshCurrentScreen());
tabComing.addEventListener("click", () => refreshCurrentScreen());


