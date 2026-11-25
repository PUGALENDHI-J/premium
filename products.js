/**
 * Rib Cotton - Master Products Catalog Database
 * Catalog-only version: no prices, only wa-product images
 */
const PRODUCTS = [
  {
    "id": 1,
    "slug": "blue-linen-party-shirt",
    "name": "Cold Blue Hand-Embroidered Pure Linen Shirt",
    "category": "Casual Shirts",
    "tag": "Bestseller",
    "rating": 4.9,
    "reviews": 188,
    "image": "asserts/products/wa-product-01.jpg",
    "gallery": [
      "asserts/products/wa-product-01.jpg",
      "asserts/products/wa-product-02.jpg",
      "asserts/products/wa-product-03.jpg"
    ],
    "fabric": "100% Pure Organic Linen with Rib Cotton Collar",
    "fit": "Relaxed Fit",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Ice Blue", "hex": "#7ba4c9"},
      {"name": "Sand Beige", "hex": "#e1dac7"}
    ],
    "description": "Crafted from pure organic linen with hand-embroidered artisanal motifs across the placket. Features a structured rib cotton collar that maintains shape all evening. Perfect for warm-weather parties, sundowners, and resort getaways.",
    "featured": true,
    "bestseller": true,
    "stock": 34
  },
  {
    "id": 2,
    "slug": "sumwon-wave-oversized-tee",
    "name": "SUMWON Wave Graphic Oversized Rib Tee",
    "category": "T-Shirts",
    "tag": "Trending",
    "rating": 4.8,
    "reviews": 320,
    "image": "asserts/products/wa-product-04.jpg",
    "gallery": [
      "asserts/products/wa-product-04.jpg",
      "asserts/products/wa-product-05.jpg",
      "asserts/products/wa-product-06.jpg"
    ],
    "fabric": "280 GSM Heavyweight 2x2 Ribbed Combed Cotton",
    "fit": "Drop-Shoulder Oversized",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Off-White Wave", "hex": "#f5f3eb"},
      {"name": "Slate Black", "hex": "#1a1a1a"}
    ],
    "description": "Our signature heavyweight streetwear tee crafted from ultra-dense 280 GSM rib cotton. Features high-density Japanese screen print wave artwork, dropped shoulders, and a thick reinforced collar band that never sags.",
    "featured": true,
    "bestseller": true,
    "stock": 52
  },
  {
    "id": 3,
    "slug": "portofino-resort-black",
    "name": "Portofino Resort Camp Collar Shirt - Onyx",
    "category": "Casual Shirts",
    "tag": "Hot Deal",
    "rating": 4.9,
    "reviews": 145,
    "image": "asserts/products/wa-product-07.jpg",
    "gallery": [
      "asserts/products/wa-product-07.jpg",
      "asserts/products/wa-product-08.jpg",
      "asserts/products/wa-product-09.jpg"
    ],
    "fabric": "Textured Rib-Weave Breathable Modal Cotton",
    "fit": "Cuban Relaxed Fit",
    "sizes": ["M","L","XL","XXL"],
    "colors": [
      {"name": "Onyx Black", "hex": "#111111"},
      {"name": "Espresso Coffee", "hex": "#4a3525"}
    ],
    "description": "Designed for timeless elegance on warm coastal evenings. Features a classic Cuban camp collar, mother-of-pearl buttons, and a textured rib weave that promotes natural airflow while draping effortlessly.",
    "featured": true,
    "bestseller": true,
    "stock": 28
  },
  {
    "id": 4,
    "slug": "italian-gurkha-pleated-trousers",
    "name": "Italian Gurkha High-Waist Pleated Trousers",
    "category": "Trousers",
    "tag": "Bestseller",
    "rating": 5.0,
    "reviews": 210,
    "image": "asserts/products/wa-product-10.jpg",
    "gallery": [
      "asserts/products/wa-product-10.jpg",
      "asserts/products/wa-product-11.jpg",
      "asserts/products/wa-product-12.jpg"
    ],
    "fabric": "Italian Poly-Viscose Rib Twill with Comfort Stretch",
    "fit": "Gurkha High-Waist Tailored",
    "sizes": ["30","32","34","36","38"],
    "colors": [
      {"name": "Tobacco Brown", "hex": "#5a3d28"},
      {"name": "Charcoal Slate", "hex": "#2f3542"}
    ],
    "description": "Inspired by Neapolitan tailoring with distinctive double Gurkha waistband buckles and deep forward pleats. Features a gentle taper down to the ankle for a sharp, sartorial silhouette.",
    "featured": true,
    "bestseller": true,
    "stock": 19
  },
  {
    "id": 5,
    "slug": "portofino-resort-coffee",
    "name": "Portofino Resort Camp Collar Shirt - Espresso",
    "category": "Casual Shirts",
    "tag": "Trending",
    "rating": 4.8,
    "reviews": 92,
    "image": "asserts/products/wa-product-13.jpg",
    "gallery": [
      "asserts/products/wa-product-13.jpg",
      "asserts/products/wa-product-14.jpg"
    ],
    "fabric": "Textured Rib-Weave Breathable Modal Cotton",
    "fit": "Cuban Relaxed Fit",
    "sizes": ["S","M","L","XL"],
    "colors": [
      {"name": "Espresso Coffee", "hex": "#4a3525"},
      {"name": "Onyx Black", "hex": "#111111"}
    ],
    "description": "A rich, earthy colorway of our acclaimed Portofino shirt. The rich coffee tint pairs effortlessly with cream linen trousers or vintage denim for an understated Mediterranean aesthetic.",
    "featured": false,
    "bestseller": true,
    "stock": 22
  },
  {
    "id": 6,
    "slug": "vintage-ethnic-resort-shirt",
    "name": "Vintage African Retro Ethnic Vacation Shirt",
    "category": "Resort Wear",
    "tag": "New Arrival",
    "rating": 4.7,
    "reviews": 76,
    "image": "asserts/products/wa-product-15.jpg",
    "gallery": [
      "asserts/products/wa-product-15.jpg",
      "asserts/products/wa-product-16.jpg"
    ],
    "fabric": "Breathable Vintage Slub Cotton",
    "fit": "Relaxed Resort Fit",
    "sizes": ["M","L","XL","XXL"],
    "colors": [
      {"name": "Ethnic Tribal Multi", "hex": "#c9823e"}
    ],
    "description": "Infused with retro geometric tribal prints, this lightweight slub cotton vacation shirt brings bold character to warm-weather days. Features notched lapels and reinforced side slits.",
    "featured": true,
    "bestseller": false,
    "stock": 40
  },
  {
    "id": 7,
    "slug": "cotton-linen-henley-shirt",
    "name": "Cotton Linen Long Sleeve Henley Shirt",
    "category": "Casual Shirts",
    "tag": "Bestseller",
    "rating": 4.9,
    "reviews": 245,
    "image": "asserts/products/wa-product-17.jpg",
    "gallery": [
      "asserts/products/wa-product-17.jpg",
      "asserts/products/wa-product-18.jpg",
      "asserts/products/wa-product-19.jpg"
    ],
    "fabric": "70% Organic Cotton + 30% Pure Flax Linen",
    "fit": "Regular Tailored",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Sand Beige", "hex": "#d8c7a6"},
      {"name": "Navy Blue", "hex": "#1a2c4e"}
    ],
    "description": "The quintessential casual weekend shirt. Combining the gentle softness of combed cotton with the airy breathability of natural linen, featuring a wooden button-front Henley placket.",
    "featured": true,
    "bestseller": true,
    "stock": 46
  },
  {
    "id": 8,
    "slug": "dream-print-graphic-tee",
    "name": "Dream Print Streetwear Heavy Cotton Tee",
    "category": "T-Shirts",
    "tag": "Popular",
    "rating": 4.8,
    "reviews": 168,
    "image": "asserts/products/wa-product-20.jpg",
    "gallery": [
      "asserts/products/wa-product-20.jpg",
      "asserts/products/wa-product-21.jpg"
    ],
    "fabric": "240 GSM Super Combed Ribbed Cotton",
    "fit": "Boxy Street Fit",
    "sizes": ["S","M","L","XL"],
    "colors": [
      {"name": "Vintage Stone", "hex": "#c3bdb2"},
      {"name": "Anthracite", "hex": "#222222"}
    ],
    "description": "High-density puff screen print across the chest on pre-shrunk, bio-washed ribbed cotton. Retains vibrant contrast and buttery softness through dozens of washes.",
    "featured": false,
    "bestseller": false,
    "stock": 38
  },
  {
    "id": 9,
    "slug": "contrast-trim-rib-tee",
    "name": "Contrast Trim Ribbed Everyday Tee",
    "category": "T-Shirts",
    "tag": "New Arrival",
    "rating": 4.9,
    "reviews": 114,
    "image": "asserts/products/wa-product-22.jpg",
    "gallery": [
      "asserts/products/wa-product-22.jpg",
      "asserts/products/wa-product-23.jpg"
    ],
    "fabric": "220 GSM 1x1 Fine Ribbed Cotton",
    "fit": "Athletic Regular Fit",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Royal White/Navy", "hex": "#f0f4f8"},
      {"name": "Heather Slate", "hex": "#8892a0"}
    ],
    "description": "Clean contrast tipping along the ribbed crewneck collar and sleeve cuffs. Engineered with 5% elastane for 4-way stretch that moves with your body while recovering shape instantly.",
    "featured": false,
    "bestseller": false,
    "stock": 60
  },
  {
    "id": 10,
    "slug": "minimalist-knit-polo",
    "name": "Minimalist Ribbed Knit Polo Shirt",
    "category": "Polo T-Shirts",
    "tag": "Bestseller",
    "rating": 4.9,
    "reviews": 275,
    "image": "asserts/products/wa-product-24.jpg",
    "gallery": [
      "asserts/products/wa-product-24.jpg",
      "asserts/products/wa-product-25.jpg",
      "asserts/products/wa-product-26.jpg"
    ],
    "fabric": "100% Mercerized Rib Knit Cotton",
    "fit": "Smart Casual Fit",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Midnight Navy", "hex": "#0a2463"},
      {"name": "Warm Ivory", "hex": "#f6f2e8"}
    ],
    "description": "Elevated luxury for modern professionals. Mercerized yarns deliver a subtle lustrous sheen, pill resistance, and exceptional drape that seamlessly transitions from office presentations to rooftop dinners.",
    "featured": true,
    "bestseller": true,
    "stock": 42
  },
  {
    "id": 11,
    "slug": "designer-floral-shirt",
    "name": "Designer Floral Stand-Collar Shirt",
    "category": "Casual Shirts",
    "tag": "Trending",
    "rating": 4.7,
    "reviews": 88,
    "image": "asserts/products/wa-product-27.jpg",
    "gallery": [
      "asserts/products/wa-product-27.jpg",
      "asserts/products/wa-product-28.jpg"
    ],
    "fabric": "Premium Cotton-Linen Satin Weave",
    "fit": "Modern Slim Fit",
    "sizes": ["M","L","XL"],
    "colors": [
      {"name": "Midnight Floral", "hex": "#1f2a44"}
    ],
    "description": "Subtle botanical motifs printed on fine satin-finish cotton with mandarin stand collar. Features French seams and tonal pearlescent buttons.",
    "featured": false,
    "bestseller": false,
    "stock": 25
  },
  {
    "id": 12,
    "slug": "classic-office-tailored-trousers",
    "name": "Classic Office Sartorial Pleated Trousers",
    "category": "Trousers",
    "tag": "Bestseller",
    "rating": 4.9,
    "reviews": 195,
    "image": "asserts/products/wa-product-29.jpg",
    "gallery": [
      "asserts/products/wa-product-29.jpg",
      "asserts/products/wa-product-30.jpg"
    ],
    "fabric": "Structured Twill Cotton Blend with Anti-Wrinkle Finish",
    "fit": "Tailored Straight Fit",
    "sizes": ["30","32","34","36","38"],
    "colors": [
      {"name": "Charcoal Slate", "hex": "#343a40"},
      {"name": "Deep Navy", "hex": "#1a2538"}
    ],
    "description": "Engineered for day-long office comfort without wrinkling. Features an expandable concealed interior waistband, reinforced hemmed cuffs, and deep angled slash pockets.",
    "featured": true,
    "bestseller": true,
    "stock": 31
  },
  {
    "id": 13,
    "slug": "peacock-embroidered-shirt",
    "name": "Peacock Hand-Embroidered Luxury Shirt",
    "category": "Casual Shirts",
    "tag": "Handcrafted",
    "rating": 5.0,
    "reviews": 122,
    "image": "asserts/products/wa-product-31.jpg",
    "gallery": [
      "asserts/products/wa-product-31.jpg",
      "asserts/products/wa-product-32.jpg"
    ],
    "fabric": "100% Pure Superfine Irish Linen",
    "fit": "Regular Tailored",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Ivory Pearl", "hex": "#f8f5ee"},
      {"name": "Indigo Blue", "hex": "#192f59"}
    ],
    "description": "Exquisite heirloom piece featuring 4,000+ hand-stitched silk thread needlework on the left chest. Breathable, hypoallergenic pure linen that gets softer with every wash.",
    "featured": true,
    "bestseller": false,
    "stock": 15
  },
  {
    "id": 14,
    "slug": "retro-striped-rib-tee",
    "name": "Retro Striped Ribbed Knit Tee",
    "category": "T-Shirts",
    "tag": "New Arrival",
    "rating": 4.8,
    "reviews": 95,
    "image": "asserts/products/wa-product-33.jpg",
    "gallery": [
      "asserts/products/wa-product-33.jpg",
      "asserts/products/wa-product-34.jpg"
    ],
    "fabric": "240 GSM Yarn-Dyed 2x2 Rib Cotton",
    "fit": "Relaxed Vintage Fit",
    "sizes": ["S","M","L","XL"],
    "colors": [
      {"name": "Vintage Navy Stripe", "hex": "#183059"}
    ],
    "description": "Yarn-dyed horizontal micro-stripes knit into ribbed combed cotton. Offers unmatched depth of color that will never fade or bleed in the wash.",
    "featured": false,
    "bestseller": false,
    "stock": 35
  },
  {
    "id": 15,
    "slug": "waffle-knit-crewneck",
    "name": "Waffle Knit Thermal Crewneck Shirt",
    "category": "Hoodies & Layers",
    "tag": "Winter Layer",
    "rating": 4.9,
    "reviews": 163,
    "image": "asserts/products/wa-product-35.jpg",
    "gallery": [
      "asserts/products/wa-product-35.jpg",
      "asserts/products/wa-product-36.jpg"
    ],
    "fabric": "320 GSM Heavy Waffle Texture Rib Cotton",
    "fit": "Thermal Relaxed Fit",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Olive Green", "hex": "#4b5320"},
      {"name": "Oatmeal", "hex": "#e3dac9"}
    ],
    "description": "Heavy honeycomb waffle weave traps insulating pockets of warm air for cozy cold-season layering without heavy bulk. Finished with reinforced rib knit cuffs and neckline.",
    "featured": true,
    "bestseller": false,
    "stock": 29
  },
  {
    "id": 16,
    "slug": "everyday-comfort-co-ord",
    "name": "Everyday Comfort Rib Knit Co-Ord Set",
    "category": "Co-Ords & Sets",
    "tag": "Bestseller",
    "rating": 5.0,
    "reviews": 230,
    "image": "asserts/products/wa-product-37.jpg",
    "gallery": [
      "asserts/products/wa-product-37.jpg",
      "asserts/products/wa-product-38.jpg"
    ],
    "fabric": "Super-Soft Double Knit Ribbed Cotton",
    "fit": "Relaxed Lounge Fit",
    "sizes": ["S","M","L","XL"],
    "colors": [
      {"name": "Sage Green", "hex": "#9caf88"},
      {"name": "Cloud Grey", "hex": "#cfd6df"}
    ],
    "description": "The pinnacle of lounge luxury. Includes an oversized drop-shoulder ribbed crew and matching elasticated drawstring joggers crafted from cloud-soft double-knit cotton.",
    "featured": true,
    "bestseller": true,
    "stock": 20
  },
  {
    "id": 17,
    "slug": "chase-the-sun-heavy-tee",
    "name": "Chase The Sun Heavyweight Rib Tee",
    "category": "T-Shirts",
    "tag": "Trending",
    "rating": 4.8,
    "reviews": 140,
    "image": "asserts/products/wa-product-39.jpg",
    "gallery": [
      "asserts/products/wa-product-39.jpg",
      "asserts/products/wa-product-40.jpg"
    ],
    "fabric": "260 GSM Heavy Combed Cotton",
    "fit": "Boxy Street Fit",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Sunset Mustard", "hex": "#d4a017"},
      {"name": "Vintage White", "hex": "#faf8f2"}
    ],
    "description": "Typography and graphic design inspired by California coastlines. Printed using water-based zero-feel discharge inks for breathable softness that never sticks.",
    "featured": false,
    "bestseller": false,
    "stock": 48
  },
  {
    "id": 18,
    "slug": "mashriq-formal-shirt",
    "name": "Mashriq Luxury Formal Linen Blend Shirt",
    "category": "Casual Shirts",
    "tag": "Hot Deal",
    "rating": 4.9,
    "reviews": 88,
    "image": "asserts/products/wa-product-01.jpg",
    "gallery": [
      "asserts/products/wa-product-01.jpg",
      "asserts/products/wa-product-05.jpg"
    ],
    "fabric": "60% Linen + 40% Giza Long-Staple Cotton",
    "fit": "Slim Tailored Formal",
    "sizes": ["38","40","42","44"],
    "colors": [
      {"name": "Crisp White", "hex": "#ffffff"},
      {"name": "Powder Blue", "hex": "#b8d0eb"}
    ],
    "description": "Impeccably tailored with German interlining in the semi-spread collar and cuffs to preserve crisp structure under blazers and suits. Hand-finished buttonholes.",
    "featured": false,
    "bestseller": true,
    "stock": 26
  },
  {
    "id": 19,
    "slug": "cuban-collar-resort-shirt",
    "name": "Cuban Collar Resort Patterned Shirt",
    "category": "Resort Wear",
    "tag": "Popular",
    "rating": 4.8,
    "reviews": 119,
    "image": "asserts/products/wa-product-09.jpg",
    "gallery": [
      "asserts/products/wa-product-09.jpg",
      "asserts/products/wa-product-11.jpg"
    ],
    "fabric": "Lightweight Breathable Rayon-Cotton",
    "fit": "Cuban Boxy Fit",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Earth Geo", "hex": "#8c6239"}
    ],
    "description": "Breezy vacation essential adorned with geometric earth-toned prints. Features a relaxed straight hem with side vents, cut to be worn untucked.",
    "featured": false,
    "bestseller": false,
    "stock": 32
  },
  {
    "id": 20,
    "slug": "urban-street-cargo-tee",
    "name": "Urban Street Utility Cargo Rib Tee",
    "category": "T-Shirts",
    "tag": "Trending",
    "rating": 4.7,
    "reviews": 77,
    "image": "asserts/products/wa-product-12.jpg",
    "gallery": [
      "asserts/products/wa-product-12.jpg",
      "asserts/products/wa-product-13.jpg"
    ],
    "fabric": "280 GSM Structured Rib Knit Cotton",
    "fit": "Oversized Utility",
    "sizes": ["M","L","XL","XXL"],
    "colors": [
      {"name": "Military Khaki", "hex": "#6b705c"},
      {"name": "Obsidian", "hex": "#1c1c1c"}
    ],
    "description": "Tactical streetwear aesthetic featuring a zip utility cargo pocket on the left arm and heavy 2x2 ribbed cotton construction built to withstand years of active wear.",
    "featured": false,
    "bestseller": false,
    "stock": 24
  },
  {
    "id": 21,
    "slug": "textured-cotton-casual-shirt",
    "name": "Textured Slub Cotton Casual Shirt",
    "category": "Casual Shirts",
    "tag": "Hot Deal",
    "rating": 4.8,
    "reviews": 134,
    "image": "asserts/products/wa-product-16.jpg",
    "gallery": [
      "asserts/products/wa-product-16.jpg",
      "asserts/products/wa-product-17.jpg"
    ],
    "fabric": "100% Breathable Slub Ribbed Cotton",
    "fit": "Modern Regular Fit",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Raw Natural", "hex": "#e6e1d5"},
      {"name": "Charcoal", "hex": "#333333"}
    ],
    "description": "Pure breathable comfort with a natural slub texture that breathes easily and feels feather-light. Finished with contrast stitching and tailored point collar.",
    "featured": false,
    "bestseller": false,
    "stock": 50
  },
  {
    "id": 22,
    "slug": "ribbed-polo-terracotta",
    "name": "Signature Rib Knit Polo - Rust Terracotta",
    "category": "Polo T-Shirts",
    "tag": "Trending",
    "rating": 4.9,
    "reviews": 142,
    "image": "asserts/products/wa-product-20.jpg",
    "gallery": [
      "asserts/products/wa-product-20.jpg",
      "asserts/products/wa-product-21.jpg",
      "asserts/products/wa-product-22.jpg"
    ],
    "fabric": "100% Super-Combed 240 GSM Rib Knit Cotton",
    "fit": "Regular Fit",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Rust Terracotta", "hex": "#6f423c"},
      {"name": "Oat Beige", "hex": "#e1dac7"}
    ],
    "description": "A stunning warm terracotta knit polo offering vintage charm with contemporary comfort. The breathable 240 GSM rib cotton contours gently without clinging.",
    "featured": true,
    "bestseller": true,
    "stock": 37
  },
  {
    "id": 23,
    "slug": "heavy-ribbed-crew-teal",
    "name": "Heritage Heavy Ribbed Crewneck - Sea Teal",
    "category": "T-Shirts",
    "tag": "New Arrival",
    "rating": 4.9,
    "reviews": 96,
    "image": "asserts/products/wa-product-24.jpg",
    "gallery": [
      "asserts/products/wa-product-24.jpg",
      "asserts/products/wa-product-25.jpg",
      "asserts/products/wa-product-26.jpg"
    ],
    "fabric": "260 GSM Bio-Washed Rib Knit Cotton",
    "fit": "Relaxed Fit",
    "sizes": ["S","M","L","XL","XXL"],
    "colors": [
      {"name": "Sea Teal", "hex": "#5aa9b0"},
      {"name": "Golden Mustard", "hex": "#d4a700"}
    ],
    "description": "Drenched in refreshing sea teal, this heritage ribbed crewneck combines dense, durable rib knitting with silicone bio-wash for unmatched silky touch.",
    "featured": true,
    "bestseller": false,
    "stock": 44
  },
  {
    "id": 24,
    "slug": "vintage-renaissance-slub-shirt",
    "name": "Vintage Renaissance Slub Tunic Shirt",
    "category": "Resort Wear",
    "tag": "Trending",
    "rating": 4.8,
    "reviews": 83,
    "image": "asserts/products/wa-product-30.jpg",
    "gallery": [
      "asserts/products/wa-product-30.jpg",
      "asserts/products/wa-product-31.jpg"
    ],
    "fabric": "100% Breathable Pure Slub Cotton",
    "fit": "Boho Relaxed Fit",
    "sizes": ["M","L","XL","XXL"],
    "colors": [
      {"name": "Natural Ecru", "hex": "#f2eee6"}
    ],
    "description": "Bohemian Renaissance-inspired tunic shirt with lace-up placket and billowy sleeves. Perfect for music festivals, holiday retreats, and expressive streetwear styling.",
    "featured": false,
    "bestseller": false,
    "stock": 18
  }
];

if (typeof module !== 'undefined') { module.exports = { PRODUCTS }; }
