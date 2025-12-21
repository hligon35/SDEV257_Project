const GENRE_TO_TMDB_IDS = {
	action: [28],
	comedy: [35],
	drama: [18],
	family: [10751],
	'sci-fi': [878],
	documentary: [99],
	kids: [16, 10751],
};

function normalizeLabel(label) {
	if (typeof label !== 'string') return '';
	return label
		.trim()
		.toLowerCase()
		// Normalize hyphen variants to plain
		.replace(/[\u2010\u2011\u2012\u2013\u2014]/g, '-');
}

function getItemGenreIds(item) {
	const raw = item && item.raw;
	if (!raw) return [];
	if (Array.isArray(raw.genre_ids)) return raw.genre_ids.filter(n => typeof n === 'number');
	if (Array.isArray(raw.genres)) {
		return raw.genres
			.map(g => (g && typeof g.id === 'number' ? g.id : null))
			.filter(n => typeof n === 'number');
	}
	return [];
}

export const SORT_OPTIONS = ['Top Rated', 'Lowest Rated', 'Newest', 'Oldest'];

export function filterByGenre(list, selectedGenre) {
	if (!Array.isArray(list)) return [];
	const normalized = normalizeLabel(selectedGenre);
	if (!normalized || normalized === 'all') return list;

	const genreIds = GENRE_TO_TMDB_IDS[normalized];
	if (!Array.isArray(genreIds) || genreIds.length === 0) return list;

	return list.filter((item) => {
		// Keep placeholders / unknown items
		if (!item || !item.raw) return true;
		const ids = getItemGenreIds(item);
		return ids.some(id => genreIds.includes(id));
	});
}

export function filterByRating(list, minRating) {
	if (!Array.isArray(list)) return [];
	if (minRating === undefined || minRating === null) return list;
	const normalized = normalizeLabel(String(minRating));
	if (!normalized || normalized === 'all') return list;

	const min = Number.parseFloat(normalized);
	if (Number.isNaN(min)) return list;

	return list.filter((item) => {
		// Keep placeholders / unknown items
		if (!item || !item.raw) return true;
		const vote = item.raw && typeof item.raw.vote_average === 'number' ? item.raw.vote_average : NaN;
		if (Number.isNaN(vote)) return true;
		return vote >= min;
	});
}

function getRatingValue(item) {
	if (item && item.raw && typeof item.raw.vote_average === 'number') return item.raw.vote_average;
	const meta = item && typeof item.meta === 'string' ? item.meta : '';
	const m = meta.match(/Rating:\s*([0-9]+(?:\.[0-9]+)?)/i);
	if (!m) return NaN;
	const v = Number.parseFloat(m[1]);
	return Number.isNaN(v) ? NaN : v;
}

export function sortByRating(list, descending = true) {
	if (!Array.isArray(list)) return [];
	const dir = descending ? -1 : 1;

	return list
		.map((item, idx) => ({ item, idx, rating: getRatingValue(item) }))
		.sort((a, b) => {
			const ar = Number.isNaN(a.rating) ? -Infinity : a.rating;
			const br = Number.isNaN(b.rating) ? -Infinity : b.rating;
			if (ar === br) return a.idx - b.idx;
			return dir * (ar - br);
		})
		.map(x => x.item);
}

function getReleaseTime(item) {
	const dateStr =
		(item && typeof item.releaseDate === 'string' && item.releaseDate) ||
		(item && item.raw && typeof item.raw.release_date === 'string' && item.raw.release_date) ||
		null;
	if (!dateStr) return NaN;
	const t = Date.parse(dateStr);
	return Number.isNaN(t) ? NaN : t;
}

export function sortByReleaseDate(list, newestFirst = true) {
	if (!Array.isArray(list)) return [];
	const dir = newestFirst ? -1 : 1;

	return list
		.map((item, idx) => ({ item, idx, t: getReleaseTime(item) }))
		.sort((a, b) => {
			const at = Number.isNaN(a.t) ? -Infinity : a.t;
			const bt = Number.isNaN(b.t) ? -Infinity : b.t;
			if (at === bt) return a.idx - b.idx;
			return dir * (at - bt);
		})
		.map(x => x.item);
}

export function sortByOption(list, option) {
	if (!Array.isArray(list)) return [];
	if (option === 'Top Rated') return sortByRating(list, true);
	if (option === 'Lowest Rated') return sortByRating(list, false);
	if (option === 'Newest') return sortByReleaseDate(list, true);
	if (option === 'Oldest') return sortByReleaseDate(list, false);
	return list;
}
