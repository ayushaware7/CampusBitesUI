# CLAUDE.md: CampusBitesUI

@docs/PROJECT_OVERVIEW.md

React frontend for Campus Bites (customer ordering + restaurant admin). Marketing lives in a separate project (YourBiteWebsite). Read the overview above first for the product, the
decisions and the owner's working agreement (design first, honest status, commit/push only when asked).

## Commands
```
npm install        # NOT `npm ci`: package-lock.json is out of sync with package.json (missing typescript@4.9.5)
npm start          # http://localhost:3000, needs the backend on REACT_APP_API_BASE_URL
npm run build
```
Env (CRA bakes these in at start; **restart `npm start` after changing them**): copy `.env.example` to `.env.local` (gitignored).
`REACT_APP_API_BASE_URL` (default `http://localhost:8081`) and `REACT_APP_RAZORPAY_KEY_ID` (the public `rzp_test_...` id, needed for checkout).
No hard-coded URLs or keys in source.

## Stack
Create React App, React Router, Tailwind CSS, `lucide-react` icons, Razorpay Checkout loaded from their CDN. No state library:
cart is a context, everything else is local state. There is no test suite yet (`App.test.js` is the CRA stub).

## Structure (`src/`)
```
config.js            API_BASE, RAZORPAY_KEY_ID from env
services/api.js      the ONLY place that calls the backend (publicApi, adminApi); errors carry the server's message
services/canteen.js  current canteen slug (localStorage), set by the /c/:slug QR route
contexts/CartContext cart lines, persisted under localStorage key `cart_v2`
contexts/BrandContext loads the restaurant (GET /canteens/{slug}) and applies name, logo, tagline and accent colour (customer app only)
utils/money.js       formatPaise, toPaise, toRupees      utils/cart.js buildLine, describeLine
hooks/useMenu.js     loads the public menu
components/menu/     ItemCard, ItemOptionsModal (size + add-on picker), ItemGrid, SpecialsGrid
components/common/   Navbar, About, ImageCarousel      components/categories/TodaySpecial
pages/               menu, CartPage, CheckoutPage, TrackOrdersPage, CanteenEntry (/r/:slug and /c/:slug). No landing/About: those moved to the company site
features/admin/      AdminLogin, AdminDashboard (tabs + live-orders badge), AdminMenu, ItemForm, AdminAddonGroups,
                     AdminLiveOrders, AdminPastOrders, AdminBranding (name/tagline/logo/colour), OrderCard, useLiveOrders (polls every 5s), ui.js (shared styles/Modal)
```
Routes: `/` (redirects to `/menu`) `/menu` `/cart` `/checkout` `/track-orders` `/specials` `/r/:slug` `/c/:slug` `/admin/login` `/admin`;
old `/lunch`, `/snacks`, `/category/:name` redirect to `/menu?category=...`.

## Conventions
- **Money is integer paise** end to end. Format only at display with `formatPaise`; parse form input with `toPaise`. Never use floats for prices.
- **Call the backend only through `services/api.js`.** Customer calls send ids and quantities, never prices (the server prices the order).
- A **cart line** (`utils/cart.buildLine`) = item + variant + add-ons; its `id` encodes the choice (`itemId:variantId:addonIds`).
  Same item with different choices is a different line. Sent to the backend as `{itemId, variantId, addonIds, quantity}`.
- Admin screens use the shared helpers in `features/admin/ui.js`; the admin JWT is in `localStorage.adminToken`; a 401 clears it and
  redirects to `/admin/login`.
- `localStorage` keys: `canteenSlug`, `cart_v2`, `adminToken`, `lastOrder` (`{code, phone}` so Track Orders opens the order just placed).
- Tailwind utility classes inline. The accent colour is `brand-*` (50/100/200/300/500/600/700), never `orange-*`: it reads CSS variables (defaults in `index.css`, overridden per restaurant by `BrandContext`). Match the surrounding style; do not add a CSS framework.

## Checkout flow (CheckoutPage)
`publicApi.placeOrder` (server creates the order + Razorpay order) then Razorpay popup with `order_id = gatewayOrderId` then
`publicApi.verifyPayment` then clear cart and go to Track Orders. Closing the popup leaves an unpaid `PENDING_PAYMENT` order on the
server; there is no "Pay now" to resume it yet (see the overview's Known gaps).

## Gotchas
- Razorpay India test mode rejects the `4111...` Visa as international; use UPI `success@razorpay` in the popup.
- The menu API returns `pricePaise`; anything still reading `price` (rupees) is a bug from the old backend.
- Large image files are not in git (`public/images/Pizza.jpg` stays untracked on purpose). Do not `git add -A` blindly in `public/images`.
- Build lint warnings in `Navbar.js`, `CartPage.js`, `ImageCarousel.js` are old and harmless.
- Check `netstat -ano | findstr :3000` for a stale dev server before starting another.

## Layout of the app (customer vs admin)
`App.js` has two route groups: a customer layout (`BrandProvider` + `CartProvider` + `Navbar`) and the admin routes (no navbar, no brand theming, so the
admin keeps the default orange). Admin pages are `React.lazy` so customers never download them. `/` redirects to `/menu`, which uses the stored
canteen slug (default `main-canteen`).

## Branding
Name, logo, tagline and colour come from the backend per restaurant and are edited in the admin **Branding** tab (`PUT /api/v1/admin/canteen`).
`BrandContext` ignores any colour that is not `#rrggbb`, falls back to the Campus Bites logo and orange until data loads, and sets `document.title`
and the Razorpay popup name/colour. The logo is a link, not an upload.

## Next up
"Pay now" on Track Orders for a pending order (needs the backend resume endpoint), customer-friendly expiry messaging, and a
countdown. Wait for the backend design to be agreed first. Also parked: the order-tracking security design (see the overview, Known gaps item 6),
which would change `lastOrder` to also hold a token.

## Git
Branch `feature/product-rebrand` holds the current work (based on `feature/new-backend-menu-orders`; PRs to `main` pending); it only works with the
new Gin backend with migration `000006` applied. Commit/push only when asked, on a feature branch. `.env.local` is gitignored.
`public/images/Pizza.jpg` stays untracked on purpose.
