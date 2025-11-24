# UI Module (module/ui-layout)

This folder contains the UI/UX for the Spotlight app.

What is included:
- `index.html` — two screens: "Trending Now" and "Coming Soon".
- `styles.css` — responsive Flexbox layout and small design system variables.
- `app.js` — simple navigation logic and keyboard accessibility.

Notes for Trentyne
- Api integration should select the `.cards` container and insert `<article class="card">` items that match the sample structure.

UI decisions:
- Semantic HTML (header, nav, main, section, article) for better accessibility.
- Buttons used in nav with `role="tab"` so we can control `aria-selected` and focus.
- Cards are a flex container so items wrap nicely on small screens.
