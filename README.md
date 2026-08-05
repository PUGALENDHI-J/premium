# Hastavam Textiles — Ecommerce Frontend

A full frontend ecommerce rebuild of the original one-page Hastavam Textiles
site. This is a **frontend-only** build, as requested — there is no server,
database, or payment gateway behind it. Everything (cart, wishlist, orders,
accounts) runs in the browser using `localStorage`, so the full shopping
*workflow* works end-to-end for demos, client review, or as a starting point
for wiring up a real backend later.

## How to view it

Just open `index.html` in a browser, or better, serve the folder so relative
paths and localStorage behave exactly like a real deployment:

```bash
cd hastavam
python3 -m http.server 8000
# then visit http://localhost:8000
```

Any static host works as-is with zero build step — Netlify, Vercel (static),
GitHub Pages, S3 + CloudFront, or your own server. Just upload the whole
folder.

## What's included

- **19 pages**: Home, Shop/Collections (with filters + sort), Product Detail,
  Search, Cart, Wishlist, Compare, Checkout (3-step), Order Success, Track
  Order, Login, Register, Account Dashboard, About, FAQ, Contact, Privacy,
  Terms, 404.
- **Cart, wishlist, and compare** (up to 4 products), all persisted across
  page loads and sessions.
- **Checkout workflow**: address form (saved for reuse), payment method
  selection (COD, UPI, Card, Net Banking — see note below), order review,
  and a real generated order ID.
- **Order history & tracking**: orders save to the browser and can be looked
  up by ID on the Track Order page, with a demo delivery-stage progress bar.
- **Demo accounts**: register/login stores credentials in `localStorage`
  (clearly labeled as demo-only in the UI — don't reuse real passwords).
- **Coupons**: `HANDLOOM10`, `WELCOME500`, `FESTIVE15` work in the cart.
- **32 products** across all 8 original categories, with ratings, reviews,
  stock levels, related/recently-viewed products, and a live search with
  suggestions.
- Fully responsive, with the original brand's animations (GSAP fan showcase,
  scroll reveals, page hero) carried through and extended.

## What's intentionally not included, and why

This was scoped as frontend-only, so a few things are simulated rather than
real — each is labeled in the UI so nothing pretends to be more than it is:

- **Payment processing**: Cash on Delivery completes a full demo order.
  UPI/Card/Net Banking show the real UI flow but don't move money — that
  requires a backend holding real Razorpay/Stripe keys, which this build
  intentionally doesn't have.
- **Accounts & orders aren't on a server**: they live in your browser's
  storage. Clearing browser data clears them. A real launch needs a backend
  (auth, database, order storage) behind this frontend.
- **Email/SMS notifications, invoices, admin panel**: not built, since they
  need a backend to send from or manage data through.

## Extending this later

The product catalog lives in `js/products.js`, cart/order/auth logic in
`js/store.js` (all through a small `Store` API — `Store.addToCart()`,
`Store.placeOrder()`, etc.), and shared UI behavior in `js/main.js`. If you
add a real backend later, the cleanest path is swapping the `Store` methods'
`localStorage` calls for `fetch()` calls to your API — the rest of the
frontend (pages, rendering, checkout flow) shouldn't need to change much.
