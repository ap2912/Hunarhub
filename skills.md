# HunarHub — Skills & Capability Guide

> What this build can do, how to operate it, and where to extend it.
> Companion to `README.md` (setup) and `src/data/seed.js` (sample data).

## 1. Marketplace skills (customer-facing)

- **Discover**: full-text search across makers, skills, products and locations;
  filters for craft, location, price range, rating, availability and maker/product
  type; sorting by featured / rating / price. All filters are live.
- **Maker profiles** (`/maker/:id`): verified badge, rating, experience, bio,
  skills, gallery, services with request CTAs, products, availability, reviews,
  save-to-favorites, review submission (signed-in customers).
- **Product pages** (`/product/:id`): stock states, quantity stepper, add-to-cart,
  buy-now, material/dimensions/delivery details, related products.
- **Cart** (`/cart`): add/remove/quantity, subtotal, delivery logic
  (free ≥ ₹999, else ₹49), total; persisted in `localStorage`; checkout splits
  one order per maker and decrements stock.
- **Service requests**: service, date, time-slot, location, budget, notes →
  generated ID (`HH-2026-#####`); statuses
  pending → accepted/rejected → in-progress → completed (or cancelled).
- **Favorites**: persisted saved makers, surfaced in the customer dashboard.
- **Reviews**: 1–5 star + text with validation; shown on maker profiles.
- **Complaints**: customers can file from the dashboard; tracked with statuses
  open → in-review → resolved.

## 2. Maker skills (seller console, `/seller`)

- Overview: total earnings (derived), pending requests, active orders, profile views.
- Accept / reject / start / complete service requests; update order statuses.
- Availability toggle; profile editor (bio, skills, pricing, location, avatar).
- Full CRUD for services and products (validated modals, delete confirmations).
- Earnings: totals, last-30-days, average order value, 6-month CSS bar chart.

## 3. Admin skills (`/admin`)

- Overview: makers, active customers, orders, requests, sales volume, open complaints.
- Makers: search + status/verification filters; verify / suspend / reactivate.
- Orders & requests: search, status filters, detail inspection modals.
- Categories: full CRUD (delete blocked while in use).
- Complaints: inspect, set status, record resolution notes.
- Analytics: orders/month, revenue by category, top makers — all derived live.

## 4. Data model

Entities in `src/data/seed.js`, state in `src/store/StoreContext.jsx`
(persisted under `localStorage` key `hunarhub_db_v1`):

`users · entrepreneurs · categories · services · products · orders ·
serviceRequests · reviews · favorites · complaints`

Key conventions: money in whole INR; IDs are human-readable
(`HH-2026-00491`, `HH-ORD-2026-00372`, `HH-CMP-2026-0022`); request/order
statuses are explicit enums exported from `seed.js`.

## 5. Design system rules (for anyone editing UI)

- Tokens live in `src/styles/tokens.css` — always use the CSS variables.
- Page background stays `#050505` with the 76px grid; lime `#B7FF2A` is the
  only accent; radii 0–4px; buttons rectangular; borders over shadows.
- Reuse `src/components/` — never duplicate card/table/modal markup.
- Motion: fade / ≤18px translate / 180ms transitions / image scale ≤1.04;
  `prefers-reduced-motion` is handled globally.
- Every form validates with inline messages; every list has an `EmptyState`;
  images go through `SafeImage` with meaningful alt text.

## 6. Extending

- **Real backend**: replace `StoreContext` actions with API calls; the
  component contracts (ids, statuses, shapes) stay the same.
- **Payments**: hook into `Cart.jsx` `handleCheckout` before `actions.checkout`.
- **New craft categories**: add to `CATEGORIES` in `seed.js` (admin can also
  create them live in `/admin/categories`).
- **More makers/products**: append to `ENTREPRENEURS` / `PRODUCTS` in
  `seed.js` and drop photos into `public/images/`.

## 7. Known demo limitations

- Auth is demo-only (any password; `localStorage` session) — never presented
  as secure.
- Data resets only via the in-app reset or clearing `localStorage`.
- Analytics and earnings are derived from the bundled sample dataset.
- No real payments, notifications, or image uploads (avatar/product images
  are chosen from the curated local set).
