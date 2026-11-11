# RideFinder — by Volt Studios

A responsive, GitHub Pages-ready electric-bike recommendation website. **This package is a recreated, editable source project based on the RideFinder specifications; it is not a verified export of the originally hosted chatgpt.site deployment.**

## Features

- 7-step electric-bike recommendation questionnaire
- 30-bike sample catalog, with text search, brand/type/budget filters, and sorting
- Match scores that consider budget, terrain, power, rider experience, size, bike category, and public-road intent
- Save bikes locally in your browser
- Select up to 3 bikes for a side-by-side comparison
- Download matches and saved bikes as CSV
- Luna Cycle and Ronster Rides catalog links where indicated, plus manufacturer and dealer-search links
- Responsive black-and-white styling with electric-blue accents, with Volt Studios logo
- No account, API key, database, or JavaScript framework needed

## Publish on GitHub Pages

1. Create a new GitHub repository, e.g. `ridefinder`.
2. Extract the ZIP. Upload **all** the files and folders from the `ridefinder-github` folder to the **root** of the repository. Do not upload only the ZIP.
3. In GitHub go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then click **Save**.
6. Your site will be accessible at `https://YOUR-USERNAME.github.io/ridefinder/` once GitHub has published it.

You can also open `index.html` in a browser to preview it locally. No installation needed.

## Project structure

```
index.html                  Main pages and UI containers
styles.css                  Responsive styles
js/bikes.js                 Model data and retailer URLs
js/app.js                   Matching, filters, favorites, export, compare
assets/volt-studios-logo.png  Volt Studios artwork
assets/favicon.svg          Browser icon
.gitignore                  Files Git should ignore
.nojekyll                   GitHub Pages static hosting helper
README.md                   This document
```

## Customize

- Change design in `styles.css`.
- Change site content in `index.html`.
- Add and edit models in `js/bikes.js`: the `add(...)` lines create each bike entry.
- Edit scoring in `rankBike` inside `js/app.js`.
- Replace the logo at `assets/volt-studios-logo.png` if desired.
- Check all prices, peak power, stock and seller availability before publication, particularly the approximate reference numbers in the sample catalog.
- Retailer buttons open the **category/catalog** page where applicable; they do **not** guarantee that a specific model is available or in stock.
- The dealer search is a Google Maps search, not a live inventory system. For reliable local stock availability, you would need a dealership inventory integration/backend.

## Important limits

**Street legality:** Street tires alone do not make an off-road e-moto legal on public roads. Local rules, registration, equipment, licensing, and age requirements all matter. The road-intent quiz filters out off-road-only bikes when public-road use is selected, but this is only a preliminary category filter — always check the exact vehicle and location.

**Catalog data:** The sample price/power references are approximate, not a product feed. The site is entirely client-side and cannot automatically refresh dealer inventory or market prices.

**Privacy:** Saved bike IDs are kept in the visitor's browser's localStorage, not on a server.

**Code visibility:** GitHub Pages is a static host; visitors can inspect HTML, CSS, and JavaScript sent to their browser. A private repository protects the repository from public browsing, but front-end assets served to visitors still cannot be hidden. Private APIs/algorithms require a separate server-side service.

## Relevant retailer and brand directories

- https://lunacycle.com/e-motos/
- https://ronsterrides.com/collections/e-moto
- https://www.eridepro.com/
- https://www.talaria.cn/

Built for Volt Studios. This repository is independent of the manufacturers and retailers shown.

## Licensing

No public license is included. You decide whether to keep this project private or publish it with a license. Publishing source files in a public GitHub repository exposes those files to visitors.
