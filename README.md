# Spotlight — Local Theater Companion

SDEV257 Hybrid Apps - Final Project - mobile app that shows what's trending and what's coming soon in local theaters. Here's a quick guide to help us stay organized.

Who works on what branch
- `module/ui-layout` and `module/testing` — UI, layouts, navigation, error handling and tests (Harold)
- `module/api-integration` — TMDB API stuff and data fetching (Trentyne)
- `module/filtering` — filters and sorting (Cailey)

Quick data shape we use (so everyone's on the same page):

```js
{
  title: movie.title,
  poster: movie.poster_path,
  rating: movie.vote_average,
  releaseDate: movie.release_date,
  overview: movie.overview
}
```