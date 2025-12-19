const API_KEY = 'PASTE_YOUR_TMDB_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTrendingMovies() {
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );
  const data = await res.json();
  return data.results || [];
}

export async function fetchUpcomingMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
  );
  const data = await res.json();
  return data.results || [];
}
