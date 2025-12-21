const TMDB_API_KEY = 'bc06512466f98ac8010bb7b7466d27ba';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function buildUrl(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`TMDB request failed (${res.status}): ${text}`);
  }
  return res.json();
}

function formatRating(voteAverage) {
  if (typeof voteAverage !== 'number' || Number.isNaN(voteAverage)) return 'N/A';
  return voteAverage.toFixed(1);
}

function mapMovieToItem(movie) {
  const poster = movie && movie.poster_path ? `${TMDB_IMG_BASE_URL}${movie.poster_path}` : null;
  const releaseDate = movie && typeof movie.release_date === 'string' ? movie.release_date : null;
  return {
    title: (movie && (movie.title || movie.name)) || 'Untitled',
    meta: `Rating: ${formatRating(movie && movie.vote_average)}`,
    overview: (movie && movie.overview) || '',
    poster,
    releaseDate,
    raw: movie,
  };
}

export function getTrendingPlaceholders() {
  return Array.from({ length: 8 }).map((_, i) => ({
    title: `Trending Movie ${i + 1}`,
    meta: 'Rating: N/A',
    overview: 'Loading…',
    poster: null,
    releaseDate: null,
    raw: null,
  }));
}

export function getUpcomingPlaceholders() {
  return Array.from({ length: 8 }).map((_, i) => ({
    title: `Upcoming Movie ${i + 1}`,
    meta: 'Rating: N/A',
    overview: 'Loading…',
    poster: null,
    releaseDate: null,
    raw: null,
  }));
}

export async function fetchTrending(_opts = {}) {
  const url = buildUrl('/trending/movie/week');
  const data = await fetchJson(url);
  const results = (data && Array.isArray(data.results)) ? data.results : [];
  return results.map(mapMovieToItem);
}

export async function fetchUpcoming(opts = {}) {
  const region = opts && typeof opts.region === 'string' ? opts.region : undefined;
  const url = buildUrl('/movie/upcoming', { region });
  const data = await fetchJson(url);
  const results = (data && Array.isArray(data.results)) ? data.results : [];
  return results.map(mapMovieToItem);
}
