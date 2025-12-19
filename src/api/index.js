// src/api/index.js

const API_KEY = 'bc06512466f98ac8010bb7b7466d27ba';
const BASE_URL = 'https://api.themoviedb.org/3';

// Helper to fetch JSON
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('TMDB request failed');
  }
  return response.json();
}

// Trending movies (used for "Trending Now")
export async function fetchTrending() {
  const data = await fetchJSON(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );
  return data.results;
}

// Upcoming movies (used for "Coming Soon")
export async function fetchUpcoming() {
  const data = await fetchJSON(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
  );
  return data.results;
}

// Fetch movies by genre (used by filter buttons)
export async function fetchByGenre(genreId) {
  if (!genreId) {
    
    return fetchTrending();
  }

  const data = await fetchJSON(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
  );
  return data.results;
}

// Genre ID map (used by UI filters)
export const GENRE_IDS = {
  All: null,
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Horror: 27,
  Romance: 10749,
};
