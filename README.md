# RIB Cotton Exports website

Open `index.html` in a browser to preview. To publish, upload the whole folder
(everything except `_archive` and `_tools`) to any static host.

## Pages
- `index.html` home
- `shop.html` collection with filters and search
- `product.html?id=24` product detail (one template, data-driven)
- `enquiry.html` the customer's list, sent to you as one WhatsApp message
- `about.html`, `contact.html`

## Things to change first
1. **Phone, WhatsApp and address.** Edit `CONTACT` at the top of `js/app.js`, and
   `PHONE_DISPLAY`, `WHATSAPP_DISPLAY`, `WEBSITE`, `ADDRESS` at the top
   of `_tools/build.py`, then run `python3 _tools/build.py` to refresh the pages.
2. **Products.** Edit `js/products.js` (name, category, audience, fabric,
   description). Images live in `assets/products/` (garment cut-outs, WebP).
3. **Company details.** Confirm certifications, organic garment availability,
   production details and export destinations before publishing changes to them.

## Adding a product
Add a cut-out image to `assets/products/` (transparent WebP, about 900px),
then add an entry to `js/products.js` with a new `id` and `code`.

## Notes
- No prices are shown because the catalogue had none. Customers enquire on
  WhatsApp instead. The old cart and checkout were removed for that reason.
- Homepage family lifestyle photos are from Pexels (photo IDs 12969212,
  18379520 and 27176613); see the [Pexels license](https://www.pexels.com/license/).
- `_archive/original-assets` holds all of your original photos untouched.
