# HunarHub — Discover Local Skills & Handmade Work

A premium digital marketplace connecting customers with local micro-entrepreneurs —
cobblers, potters, tailors, artisans and small vendors. Customers can discover makers,
shop handmade products, book services, save makers and track orders. Makers get a full
dashboard (profile, services, products, requests, orders, earnings). Admins get
verification, category, order, request and complaint management.

**Design language:** near-black canvas (`#050505`) with a subtle 76px technical grid,
oversized editorial typography (Inter Tight), lime accent (`#B7FF2A`), thin translucent
borders, 0–4px radii, restrained motion. No gradients, no pills, no glassmorphism.

## Tech stack

- React 18 + Vite + react-router-dom (HashRouter — no server routing needed)
- Plain CSS only (design tokens in `src/styles/tokens.css`), zero animation libraries
- `localStorage`-persisted demo state — no backend required

## Quick start

```bash
cd hunarhub
npm install
npm run dev      # local dev at http://localhost:5173
npm run build    # production build → dist/
```

Requires Node 18+ (verified on Node v24.20.0 / npm 10.9.4).

## Demo accounts

Demo authentication — **any password works**, clearly labeled DEMO in the UI.
This is not production security; sessions live in `localStorage`.

| Email | Role | Lands on |
|---|---|---|
| `customer@hunarhub.demo` | Customer | `/dashboard` — orders, requests, saved makers, complaints |
| `seller@hunarhub.demo` | Maker (Meena Kumari, potter) | `/seller` — requests, orders, products, services, earnings |
| `admin@hunarhub.demo` | Admin | `/admin` — verification, orders, complaints, analytics |

The login page has one-tap demo account buttons. Registering as a MAKER creates a
pending maker profile; registering as CUSTOMER goes straight to the dashboard.

## Key flows to try

1. **Explore** — search "pottery", filter by craft/location/price/rating/availability;
   filters genuinely change results.
2. **Maker profile** (`/maker/ent-meena`) — services, products, gallery, reviews;
   leave a review while signed in; save the maker (★ persists).
3. **Product** (`/product/prd-vase`) — quantity, add to cart, buy now.
4. **Cart** (`/cart`) — quantity steppers, subtotal/delivery/total; checkout creates
   one order per maker and decrements stock.
5. **Service request** — from any maker profile: pick service, date, time, budget →
   confirmation shows the generated request ID (e.g. `HH-2026-00491`).
6. **Seller dashboard** — accept/reject incoming requests, advance order statuses,
   toggle availability, CRUD products & services, view derived earnings.
7. **Admin dashboard** — verify/suspend makers, inspect orders/requests, resolve
   complaints, manage categories, view analytics.

To reset all demo data: sign in and use the reset control, or clear `localStorage`
key `hunarhub_db_v1`.

## Deploy

HashRouter + relative asset paths (`base: './'`) — the `dist/` output deploys
as-is anywhere. No redirects or rewrites required.

### Vercel (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** the repository.
3. Vercel auto-detects Vite: build command `npm run build`, output directory
   `dist`. No environment variables needed.
4. Click **Deploy** — every push to `main` redeploys automatically, and pull
   requests get preview URLs.

Or via CLI:

```bash
npm i -g vercel
vercel --prod
```

### Netlify

- **Drag & drop:** run `npm run build`, then drop the `dist/` folder onto
  [app.netlify.com/drop](https://app.netlify.com/drop) — live in seconds.
- **Git:** import the repo, build command `npm run build`, publish directory
  `dist`.

### GitHub Pages
```bash
npm run build
# publish the dist/ folder (e.g. via gh-pages, or Actions uploading dist as artifact)
```
`base: './'` and HashRouter mean the build works from any path — no 404 rewrites needed.

## Project structure

```
hunarhub/
├── public/images/          # 28 curated craft photos (self-contained)
├── src/
│   ├── components/         # Navbar, Footer, Button, SectionLabel, SearchBar,
│   │                       # FilterPanel, EntrepreneurCard, ProductCard, Rating,
│   │                       # StatusBadge, StatCard, DataTable, Modal, Drawer,
│   │                       # EmptyState, SafeImage, DashboardShell, ...
│   ├── pages/              # Home, Explore, EntrepreneurProfile, ProductDetails,
│   │                       # ServiceRequest, Cart, CheckoutSuccess, Login,
│   │                       # Register, CustomerDashboard, EntrepreneurDashboard,
│   │                       # AdminDashboard, NotFound
│   ├── data/seed.js        # Users, makers, categories, services, products,
│   │                       # orders, requests, reviews, complaints
│   ├── store/StoreContext.jsx  # Global state + localStorage persistence
│   ├── hooks/useReveal.js  # Scroll-reveal (respects prefers-reduced-motion)
│   ├── utils/format.js     # INR formatting, dates
│   ├── styles/tokens.css   # Design tokens — the single source of truth
│   ├── App.jsx             # HashRouter routes
│   └── main.jsx
├── index.html              # SEO meta, OG tags, SVG favicon, fonts
├── README.md
└── skills.md               # Operator's capability guide
```

## Notes

- All sample data is fictional (believable Indian micro-entrepreneur personas).
- Images are real craft photography stored locally in `public/images/`;
  `SafeImage` guarantees a fallback so no broken-image icons ever appear.
- No secrets are committed; there is no backend and no API key in the codebase.
