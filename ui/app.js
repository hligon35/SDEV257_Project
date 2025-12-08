// UI module JS — controls nav between screens and basic keyboard interaction.

// NOTE TO API TEAM:
// When you fetch real movie data, create <article class="card"> elements
// using the same structure as the placeholders and push them into:
// originalTrendingCards OR originalUpcomingCards
// This keeps filtering + sorting working automatically.


const tabTrending = document.getElementById('tab-trending');
const tabComing = document.getElementById('tab-coming');
const screenTrending = document.getElementById('screen-trending');
const screenComing = document.getElementById('screen-coming');

function showScreen(targetTab, targetScreen) {
  [tabTrending, tabComing].forEach(t => t.setAttribute('aria-selected', 'false'));
  targetTab.setAttribute('aria-selected', 'true');

  [screenTrending, screenComing].forEach(s => {
    s.classList.add('hidden');
    s.setAttribute('aria-hidden', 'true');
  });

  targetScreen.classList.remove('hidden');
  targetScreen.setAttribute('aria-hidden', 'false');
}

tabTrending.addEventListener('click', () => {
  showScreen(tabTrending, screenTrending);
  refreshCurrentScreen();
});

tabComing.addEventListener('click', () => {
  showScreen(tabComing, screenComing);
  refreshCurrentScreen();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const current =
      tabTrending.getAttribute('aria-selected') === 'true'
        ? tabTrending
        : tabComing;
    const next = current === tabTrending ? tabComing : tabTrending;
    showScreen(next, next === tabTrending ? screenTrending : screenComing);
    next.focus();
    refreshCurrentScreen();
  }
});

showScreen(tabTrending, screenTrending);


// UI elements for filtering
const genreFilter = document.getElementById("genre-filter");
const popularityFilter = document.getElementById("popularity-filter");

// Containers where cards live
const trendingCardsContainer = document.querySelector("#trending-cards");
const upcomingCardsContainer = document.querySelector("#upcoming-cards");


const originalTrendingCards = Array.from(
  trendingCardsContainer.querySelectorAll(".card")
);

const originalUpcomingCards = Array.from(
  upcomingCardsContainer.querySelectorAll(".card")
);



// FILTER STATE
let currentGenre = "all";
let sortByPopularity = false;


// Extract rating for sorting from the meta text
function getCardRating(card) {
  const meta = card.querySelector(".meta");
  if (!meta) return 0;
  const match = meta.textContent.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}




// MAIN FILTER FUNCTION
// Filters and sorts cards based on dropdown + popularity button.
//
// note:
// This same filter logic will work automatically with API cards AS LONG AS
// the API person attaches this attribute to each movie card:
//
// data-genres="action,comedy,drama"

function applyFilters(container, originalList) {
  let cards = Array.from(originalList);
  let filtered = cards;

  // Filter by genre
  if (currentGenre !== "all") {
    filtered = filtered.filter(card => {
      const genres = card.dataset.genres
        .toLowerCase()
        .split(",")
        .map(g => g.trim());
      return genres.includes(currentGenre);
    });
  }

  // Sort by popularity 
  if (sortByPopularity) {
    filtered.sort((a, b) => getCardRating(b) - getCardRating(a));
  }

  // Re-render
  container.innerHTML = "";
  filtered.forEach(card => container.appendChild(card));
}


// Apply filters depending on which tab is shown

function refreshCurrentScreen() {
  const trendingVisible = !screenTrending.classList.contains("hidden");

  if (trendingVisible) {
    applyFilters(trendingCardsContainer, originalTrendingCards);
  } else {
    applyFilters(upcomingCardsContainer, originalUpcomingCards);
  }
}


// FILTER EVENTS

genreFilter.addEventListener("change", (e) => {
  currentGenre = e.target.value;
  refreshCurrentScreen();
});

popularityFilter.addEventListener("click", () => {
  sortByPopularity = !sortByPopularity;

  if (sortByPopularity) {
    popularityFilter.classList.add("is-active");
    popularityFilter.textContent = "Sort by Default";
  } else {
    popularityFilter.classList.remove("is-active");
    popularityFilter.textContent = "Sort by Popularity";
  }

  refreshCurrentScreen();
});
