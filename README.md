# Peak Burger — Frontend

A complete, frontend-only ordering website for Peak Burger, built with React, Vite, Tailwind CSS, React Router, Axios and SweetAlert2. Menu data, prices and structure come directly from the real Peak Burger menu.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## What's simulated locally

Everything runs on local data and `localStorage` — there is no backend yet:

- **Menu & categories** — `src/data/products.js`, `src/data/categories.js`, `src/data/offers.js`
- **Cart** — `src/context/CartContext.jsx` (key: `peakburger_cart`)
- **Favorites** — `src/context/FavoritesContext.jsx` (key: `peakburger_favorites`)
- **Auth** — `src/context/AuthContext.jsx` (key: `peakburger_user`, plus a hidden `peakburger_registered_users` list to simulate an accounts table)
- **Orders** — `src/services/orderService.js` (key: `peakburger_orders`)

## Two menu items need a quick check with the restaurant

Everything else was transcribed directly from the menu text you provided, but these two need confirming before launch:

- **Honey Yummy Sauce** (`صوص هاني يامي`) — no price was listed; it currently shows "Price TBD" and can't be added to the cart until a price is set in `src/data/products.js` (search for `honey-yummy-sauce`).
- **Product photos** — no menu photos were provided, so every item currently falls back to a placeholder image tile. Drop real photos into `src/assets/images/` (or anywhere in `public/images/products/`) and update each product's `image` path in `src/data/products.js`.

## Connecting the future Laravel backend

The service layer in `src/services/` (`authService.js`, `productService.js`, `categoryService.js`, `orderService.js`, `userService.js`) is the only place that needs to change. Each function already returns a Promise shaped like a real API response — swap the local-storage logic for an `api.get(...)` / `api.post(...)` call (see `src/services/api.js`, already wired to `VITE_API_URL`) and the rest of the app keeps working unchanged.

Copy `.env.example` to `.env` and set `VITE_API_URL` once the Laravel API is live.

Expected endpoints are listed in the project brief and mirrored in the comments above each service function (e.g. `POST /api/login`, `GET /api/products`, `POST /api/orders`, etc.).

## Bilingual / RTL

The site ships in English and Arabic (Egyptian dialect for UI copy). Use the language toggle in the navbar or Account → Settings. Arabic switches the whole page to RTL automatically.
