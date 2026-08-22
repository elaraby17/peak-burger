# Peak Burger — Admin Dashboard Addon

This is **not a new project**. It's a set of files that extend your existing
Peak Burger React app with an `/admin` dashboard, built entirely on your
current architecture (React Router, Context, the `services/` + `data/`
layer, Tailwind theme, SweetAlert2). No backend, no second app, no second
router.

## How to merge this into your project

1. Copy the `src/` folder from this addon **into your existing project's
   `src/` folder**, letting files merge (don't delete your existing files).
2. These files **replace** existing files — they contain your original code
   plus the admin-related additions:
   - `src/utils/storage.js` — added new `STORAGE_KEYS` for admin data.
   - `src/data/offers.js` — same offers, extended with `oldPrice`,
     `offerPrice`, `includedProductIds`, `startDate`/`endDate`, `active`.
   - `src/services/productService.js` — same public API you already use
     (`getAll`, `getById`, `getByCategory`, `getPopular`, `search`) plus new
     admin methods (`create`, `update`, `remove`, `toggleActive`,
     `getAllAdmin`). Behavior for the customer site is unchanged.
   - `src/services/categoryService.js` — same, plus admin CRUD.
   - `src/services/orderService.js` — same, plus `updateStatus`,
     `getAllAdmin`, `getDashboardStats`.
   - `src/routes/AppRoutes.jsx` — your existing customer routes are
     untouched; admin routes were added below them.
   - `src/main.jsx` — added `<AdminAuthProvider>` alongside your existing
     providers.
   - `package.json` — added `recharts` (used for the dashboard charts).
     If your project already customized this file further, just add
     `"recharts": "^2.15.0"` to `dependencies` by hand instead of
     overwriting.
3. Everything else is **new** files only (nothing to merge, just add):
   `src/data/*Store.js`, `src/data/sauces.js`, `coupons.js`, `branches.js`,
   `reviews.js`, `payments.js`, `orderStatusHistory.js`, `adminUsers.js`,
   `src/services/{size,sauce,offer,coupon,branch,review,payment,
   orderStatusHistory,adminAuth,customer}Service.js`,
   `src/context/AdminAuthContext.jsx`, `src/routes/Admin*Route.jsx`,
   `src/layouts/AdminLayout.jsx`, `src/components/admin/*`,
   `src/pages/Admin/**`.
4. Run `npm install` (pulls in `recharts`), then `npm run dev`.
5. Visit `/admin/login` — demo credentials: **admin@peakburger.com /
   admin123** (see `src/data/adminUsers.js`).

## How the shared data actually works

Every admin-editable entity has a matching **`*.js` seed file** (your
original static data, e.g. `products.js`) plus a **`*Store.js`** file that
wraps it in `localStorage` (via the new `src/data/store.js` helper). The
first time a store is read it's seeded from the static array; after that,
reads/writes go through `localStorage` — exactly the same pattern your
`CartContext`/`FavoritesContext`/`orderService` already use.

`productService` and `categoryService` were pointed at these stores instead
of the raw static arrays, so:

```
Admin edits a product  →  productService.update()  →  productsStore (localStorage)
Customer menu loads    →  productService.getAll()   →  same productsStore
```

**One thing to finish by hand:** a few customer pages still import
`products`/`categories` directly from the static data files instead of
going through the service (`Menu/index.jsx`, `Product/index.jsx`,
`Home/Categories.jsx`, `Home/FeaturedBurger.jsx`, `Account/Favorites.jsx`).
That's unchanged behavior from before — they'll keep working exactly as
they do today, they just won't reflect admin edits made *during the same
session* until you swap those static imports for
`productService.getAll()` / `categoryService.getAll()` the same way
`Home/PopularProducts.jsx` already does. It's a small, mechanical change
(add a `useEffect` + `useState`) and worth doing before a real demo, but I
left the working code as-is rather than touching files not required for the
admin dashboard itself.

## What's genuinely admin-managed vs. read-only for now

- **Products, Categories, Orders, Sauces (assignment), Offers, Coupons,
  Branches, Reviews, Payments** — full CRUD via the service layer.
- **Product Sizes** — sizes live embedded on each product (matching your
  existing `product.sizes` structure), so `/admin/product-sizes` is a
  flattened, read-oriented table; price edits happen from the product's own
  edit page (`sizeService.update()` exists if you want to wire inline
  editing there too).
- **Customers** — read-only view over the same `peakburger_registered_users`
  list your `authService.register()` already writes to, joined with orders
  for spend/order-count. No separate customer dataset.
- **Settings** — the "Restaurant" and "Language" tabs are wired up; the rest
  (Orders/Payments/Notifications/Appearance) are placeholders, since the
  brief didn't specify concrete fields for them.

## Laravel migration path

Every service method has a `// Future Laravel endpoint: ...` comment right
above it. When the backend is ready, only the service files change (swap
the store/localStorage calls for `api.get/post/put/delete`) — no component
should need to change, same pattern your original `services/api.js` already
sets up.

## Auth roles

`AuthContext` (customer) and `AdminAuthContext` (admin) are two separate,
parallel contexts — same shape, separate localStorage keys
(`peakburger_user` vs `peakburger_admin_user`), separate route guards
(`ProtectedRoute`/`GuestRoute` vs `AdminProtectedRoute`/`AdminGuestRoute`).
A customer session and an admin session can coexist without conflict.
