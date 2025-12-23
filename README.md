# Newmard

React + Tailwind (Vite) MVP for the Newmard PRD.

## Run (React)
- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Component Structure
- `src/components/Hero.jsx` + `src/components/WorldMap.jsx`
- `src/components/ContinentFilters.jsx`
- `src/components/CityGrid.jsx` + `src/components/CityCard.jsx`
- `src/components/CityDialog.jsx`
- `src/components/Footer.jsx`
- Data: `src/data/cities.js`

## Static Prototype (Legacy)
- The previous static prototype is kept in `static/index.html`.

## City Images (Unsplash)
- Create an Unsplash developer app and copy your Access Key to `UNSPLASH_ACCESS_KEY`.
- PowerShell (Windows): `$env:UNSPLASH_ACCESS_KEY="YOUR_KEY_HERE"`
- Download + wire images into `src/data/cities.js`: `npm run download:city-images -- --write-cities-data`
- Output folder: `public/images/city/`
- Attribution metadata: `public/images/city/unsplash-attribution.json`

### No API key?
Unsplash may block automated requests (401/503) without an API key. If that happens:
- Create a template file: `npm run download:city-images -- --init-sources-file scripts/city-image-sources.json`
- Fill `url` for each city (prefer `https://images.unsplash.com/...` with `auto=format&fit=crop&w=1600&q=80&fm=jpg`).
- Run: `npm run download:city-images -- --sources-file scripts/city-image-sources.json --delay-ms 2500 --require-all-sources --write-cities-data`
