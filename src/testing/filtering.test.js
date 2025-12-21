import { filterByRating, sortByRating, sortByReleaseDate } from '../filtering';

describe('filtering helpers', () => {
  test('filterByRating keeps items with vote_average >= min', () => {
    const list = [
      { raw: { vote_average: 8.4 }, meta: 'Rating: 8.4 • 2025' },
      { raw: { vote_average: 6.9 }, meta: 'Rating: 6.9 • 2025' },
    ];
    expect(filterByRating(list, '8')).toHaveLength(1);
    expect(filterByRating(list, '8')[0].raw.vote_average).toBe(8.4);
  });

  test('sortByRating sorts descending by default', () => {
    const list = [
      { meta: 'Rating: 7.0 • 2024' },
      { meta: 'Rating: 8.2 • 2024' },
      { meta: 'Rating: 6.1 • 2024' },
    ];
    const out = sortByRating(list, true);
    expect(out.map(x => x.meta)).toEqual([
      'Rating: 8.2 • 2024',
      'Rating: 7.0 • 2024',
      'Rating: 6.1 • 2024',
    ]);
  });

  test('sortByReleaseDate sorts newest first', () => {
    const list = [
      { releaseDate: '2024-01-01' },
      { releaseDate: '2025-06-01' },
      { releaseDate: '2023-12-31' },
    ];
    const out = sortByReleaseDate(list, true);
    expect(out.map(x => x.releaseDate)).toEqual(['2025-06-01', '2024-01-01', '2023-12-31']);
  });
});
