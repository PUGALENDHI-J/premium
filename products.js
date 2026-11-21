/**
 * Rib Cotton - Master Products Catalog Database
 */
const PRODUCTS = [
  {
    "id": 1,
    "slug": "blue-linen-party-shirt",
    "name": "Cold Blue Hand-Embroidered Pure Linen Shirt",
    "category": "Casual Shirts",
    "price": 1499,
    "originalPrice": 2499,
    "discount": "40% OFF",
    "tag": "Bestseller",
    "rating": 4.9,
    "reviews": 188,
    "image": "asserts/products/blue-linen-party-shirt.jpg",
    "gallery": [
      "asserts/products/blue-linen-party-shirt.jpg",
      "asserts/products/wa-product-06.jpg",
      "asserts/products/wa-product-01.jpg"
    ],
    "fabric": "100% Pure Organic Linen with Rib Cotton Collar",
    "fit": "Relaxed Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Ice Blue",
        "hex": "#7ba4c9"
      },
      {
        "name": "Sand Beige",
        "hex": "#e1dac7"
      }
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
    "price": 899,
    "originalPrice": 1499,
    "discount": "40% OFF",
    "tag": "Trending",
    "rating": 4.8,
    "reviews": 320,
    "image": "asserts/products/sumwon-wave-oversized-tee.jpg",
    "gallery": [
      "asserts/products/sumwon-wave-oversized-tee.jpg",
      "asserts/products/wa-product-03.jpg",
      "asserts/products/wa-product-04.jpg"
    ],
    "fabric": "280 GSM Heavyweight 2x2 Ribbed Combed Cotton",
    "fit": "Drop-Shoulder Oversized",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Off-White Wave",
        "hex": "#f5f3eb"
      },
      {
        "name": "Slate Black",
        "hex": "#1a1a1a"
      }
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
    "price": 1299,
    "originalPrice": 2199,
    "discount": "41% OFF",
    "tag": "Hot Deal",
    "rating": 4.9,
    "reviews": 145,
    "image": "asserts/products/portofino-resort-black.jpg",
    "gallery": [
      "asserts/products/portofino-resort-black.jpg",
      "asserts/products/portofino-resort-coffee.jpg",
      "asserts/products/cuban-collar-resort-shirt.jpg"
    ],
    "fabric": "Textured Rib-Weave Breathable Modal Cotton",
    "fit": "Cuban Relaxed Fit",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Onyx Black",
        "hex": "#111111"
      },
      {
        "name": "Espresso Coffee",
        "hex": "#4a3525"
      }
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
    "price": 1799,
    "originalPrice": 2999,
    "discount": "40% OFF",
    "tag": "Bestseller",
    "rating": 5.0,
    "reviews": 210,
    "image": "asserts/products/italian-gurkha-pleated-trousers.jpg",
    "gallery": [
      "asserts/products/italian-gurkha-pleated-trousers.jpg",
      "asserts/products/classic-office-tailored-trousers.jpg",
      "asserts/products/wa-product-10.jpg"
    ],
    "fabric": "Italian Poly-Viscose Rib Twill with Comfort Stretch",
    "fit": "Gurkha High-Waist Tailored",
    "sizes": [
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "Tobacco Brown",
        "hex": "#5a3d28"
      },
      {
        "name": "Charcoal Slate",
        "hex": "#2f3542"
      }
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
    "price": 1299,
    "originalPrice": 2199,
    "discount": "41% OFF",
    "tag": "Trending",
    "rating": 4.8,
    "reviews": 92,
    "image": "asserts/products/portofino-resort-coffee.jpg",
    "gallery": [
      "asserts/products/portofino-resort-coffee.jpg",
      "asserts/products/portofino-resort-black.jpg"
    ],
    "fabric": "Textured Rib-Weave Breathable Modal Cotton",
    "fit": "Cuban Relaxed Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Espresso Coffee",
        "hex": "#4a3525"
      },
      {
        "name": "Onyx Black",
        "hex": "#111111"
      }
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
    "price": 1199,
    "originalPrice": 1999,
    "discount": "40% OFF",
    "tag": "New Arrival",
    "rating": 4.7,
    "reviews": 76,
    "image": "asserts/products/vintage-ethnic-resort-shirt.jpg",
    "gallery": [
      "asserts/products/vintage-ethnic-resort-shirt.jpg",
      "asserts/products/designer-floral-shirt.jpg"
    ],
    "fabric": "Breathable Vintage Slub Cotton",
    "fit": "Relaxed Resort Fit",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Ethnic Tribal Multi",
        "hex": "#c9823e"
      }
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
    "price": 1399,
    "originalPrice": 2299,
    "discount": "39% OFF",
    "tag": "Bestseller",
    "rating": 4.9,
    "reviews": 245,
    "image": "asserts/products/cotton-linen-henley-shirt.jpg",
    "gallery": [
      "asserts/products/cotton-linen-henley-shirt.jpg",
      "asserts/products/wa-product-01.jpg",
      "asserts/products/wa-product-07.jpg"
    ],
    "fabric": "70% Organic Cotton + 30% Pure Flax Linen",
    "fit": "Regular Tailored",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Sand Beige",
        "hex": "#d8c7a6"
      },
      {
        "name": "Navy Blue",
        "hex": "#1a2c4e"
      }
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
    "price": 799,
    "originalPrice": 1399,
    "discount": "43% OFF",
    "tag": "Popular",
    "rating": 4.8,
    "reviews": 168,
    "image": "asserts/products/dream-print-graphic-tee.jpg",
    "gallery": [
      "asserts/products/dream-print-graphic-tee.jpg",
      "asserts/products/chase-the-sun-heavy-tee.jpg"
    ],
    "fabric": "240 GSM Super Combed Ribbed Cotton",
    "fit": "Boxy Street Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Vintage Stone",
        "hex": "#c3bdb2"
      },
      {
        "name": "Anthracite",
        "hex": "#222222"
      }
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
    "price": 749,
    "originalPrice": 1299,
    "discount": "42% OFF",
    "tag": "New Arrival",
    "rating": 4.9,
    "reviews": 114,
    "image": "asserts/products/contrast-trim-rib-tee.jpg",
    "gallery": [
      "asserts/products/contrast-trim-rib-tee.jpg",
      "asserts/products/wa-product-14.jpg"
    ],
    "fabric": "220 GSM 1x1 Fine Ribbed Cotton",
    "fit": "Athletic Regular Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Royal White/Navy",
        "hex": "#f0f4f8"
      },
      {
        "name": "Heather Slate",
        "hex": "#8892a0"
      }
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
    "price": 1099,
    "originalPrice": 1899,
    "discount": "42% OFF",
    "tag": "Bestseller",
    "rating": 4.9,
    "reviews": 275,
    "image": "asserts/products/minimalist-knit-polo.jpg",
    "gallery": [
      "asserts/products/minimalist-knit-polo.jpg",
      "asserts/products/wa-product-08.jpg",
      "asserts/products/wa-product-09.jpg"
    ],
    "fabric": "100% Mercerized Rib Knit Cotton",
    "fit": "Smart Casual Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Midnight Navy",
        "hex": "#0a2463"
      },
      {
        "name": "Warm Ivory",
        "hex": "#f6f2e8"
      }
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
    "price": 1349,
    "originalPrice": 2299,
    "discount": "41% OFF",
    "tag": "Trending",
    "rating": 4.7,
    "reviews": 88,
    "image": "asserts/products/designer-floral-shirt.jpg",
    "gallery": [
      "asserts/products/designer-floral-shirt.jpg",
      "asserts/products/peacock-embroidered-shirt.jpg"
    ],
    "fabric": "Premium Cotton-Linen Satin Weave",
    "fit": "Modern Slim Fit",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Midnight Floral",
        "hex": "#1f2a44"
      }
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
    "price": 1699,
    "originalPrice": 2799,
    "discount": "39% OFF",
    "tag": "Bestseller",
    "rating": 4.9,
    "reviews": 195,
    "image": "asserts/products/classic-office-tailored-trousers.jpg",
    "gallery": [
      "asserts/products/classic-office-tailored-trousers.jpg",
      "asserts/products/italian-gurkha-pleated-trousers.jpg"
    ],
    "fabric": "Structured Twill Cotton Blend with Anti-Wrinkle Finish",
    "fit": "Tailored Straight Fit",
    "sizes": [
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "Charcoal Slate",
        "hex": "#343a40"
      },
      {
        "name": "Deep Navy",
        "hex": "#1a2538"
      }
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
    "price": 1599,
    "originalPrice": 2699,
    "discount": "41% OFF",
    "tag": "Handcrafted",
    "rating": 5.0,
    "reviews": 122,
    "image": "asserts/products/peacock-embroidered-shirt.jpg",
    "gallery": [
      "asserts/products/peacock-embroidered-shirt.jpg",
      "asserts/products/blue-linen-party-shirt.jpg"
    ],
    "fabric": "100% Pure Superfine Irish Linen",
    "fit": "Regular Tailored",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Ivory Pearl",
        "hex": "#f8f5ee"
      },
      {
        "name": "Indigo Blue",
        "hex": "#192f59"
      }
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
    "price": 849,
    "originalPrice": 1399,
    "discount": "39% OFF",
    "tag": "New Arrival",
    "rating": 4.8,
    "reviews": 95,
    "image": "asserts/products/retro-striped-rib-tee.jpg",
    "gallery": [
      "asserts/products/retro-striped-rib-tee.jpg",
      "asserts/products/wa-product-16.jpg"
    ],
    "fabric": "240 GSM Yarn-Dyed 2x2 Rib Cotton",
    "fit": "Relaxed Vintage Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Vintage Navy Stripe",
        "hex": "#183059"
      }
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
    "price": 1199,
    "originalPrice": 1999,
    "discount": "40% OFF",
    "tag": "Winter Layer",
    "rating": 4.9,
    "reviews": 163,
    "image": "asserts/products/waffle-knit-crewneck.jpg",
    "gallery": [
      "asserts/products/waffle-knit-crewneck.jpg",
      "asserts/products/wa-product-21.jpg"
    ],
    "fabric": "320 GSM Heavy Waffle Texture Rib Cotton",
    "fit": "Thermal Relaxed Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Olive Green",
        "hex": "#4b5320"
      },
      {
        "name": "Oatmeal",
        "hex": "#e3dac9"
      }
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
    "price": 1899,
    "originalPrice": 3199,
    "discount": "41% OFF",
    "tag": "Bestseller",
    "rating": 5.0,
    "reviews": 230,
    "image": "asserts/products/everyday-comfort-co-ord.jpg",
    "gallery": [
      "asserts/products/everyday-comfort-co-ord.jpg",
      "asserts/products/wa-product-28.jpg"
    ],
    "fabric": "Super-Soft Double Knit Ribbed Cotton",
    "fit": "Relaxed Lounge Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Sage Green",
        "hex": "#9caf88"
      },
      {
        "name": "Cloud Grey",
        "hex": "#cfd6df"
      }
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
    "price": 799,
    "originalPrice": 1399,
    "discount": "43% OFF",
    "tag": "Trending",
    "rating": 4.8,
    "reviews": 140,
    "image": "asserts/products/chase-the-sun-heavy-tee.jpg",
    "gallery": [
      "asserts/products/chase-the-sun-heavy-tee.jpg",
      "asserts/products/dream-print-graphic-tee.jpg"
    ],
    "fabric": "260 GSM Heavy Combed Cotton",
    "fit": "Boxy Street Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Sunset Mustard",
        "hex": "#d4a017"
      },
      {
        "name": "Vintage White",
        "hex": "#faf8f2"
      }
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
    "price": 1449,
    "originalPrice": 2399,
    "discount": "40% OFF",
    "tag": "Hot Deal",
    "rating": 4.9,
    "reviews": 88,
    "image": "asserts/products/mashriq-formal-shirt.jpg",
    "gallery": [
      "asserts/products/mashriq-formal-shirt.jpg",
      "asserts/products/wa-product-01.jpg"
    ],
    "fabric": "60% Linen + 40% Giza Long-Staple Cotton",
    "fit": "Slim Tailored Formal",
    "sizes": [
      "38",
      "40",
      "42",
      "44"
    ],
    "colors": [
      {
        "name": "Crisp White",
        "hex": "#ffffff"
      },
      {
        "name": "Powder Blue",
        "hex": "#b8d0eb"
      }
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
    "price": 1249,
    "originalPrice": 2099,
    "discount": "40% OFF",
    "tag": "Popular",
    "rating": 4.8,
    "reviews": 119,
    "image": "asserts/products/cuban-collar-resort-shirt.jpg",
    "gallery": [
      "asserts/products/cuban-collar-resort-shirt.jpg",
      "asserts/products/portofino-resort-coffee.jpg"
    ],
    "fabric": "Lightweight Breathable Rayon-Cotton",
    "fit": "Cuban Boxy Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Earth Geo",
        "hex": "#8c6239"
      }
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
    "price": 899,
    "originalPrice": 1499,
    "discount": "40% OFF",
    "tag": "Trending",
    "rating": 4.7,
    "reviews": 77,
    "image": "asserts/products/urban-street-cargo-tee.jpg",
    "gallery": [
      "asserts/products/urban-street-cargo-tee.jpg",
      "asserts/products/sumwon-wave-oversized-tee.jpg"
    ],
    "fabric": "280 GSM Structured Rib Knit Cotton",
    "fit": "Oversized Utility",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Military Khaki",
        "hex": "#6b705c"
      },
      {
        "name": "Obsidian",
        "hex": "#1c1c1c"
      }
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
    "price": 999,
    "originalPrice": 1699,
    "discount": "41% OFF",
    "tag": "Hot Deal",
    "rating": 4.8,
    "reviews": 134,
    "image": "asserts/products/textured-cotton-casual-shirt.jpg",
    "gallery": [
      "asserts/products/textured-cotton-casual-shirt.jpg",
      "asserts/products/wa-product-02.jpg"
    ],
    "fabric": "100% Breathable Slub Ribbed Cotton",
    "fit": "Modern Regular Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Raw Natural",
        "hex": "#e6e1d5"
      },
      {
        "name": "Charcoal",
        "hex": "#333333"
      }
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
    "price": 1049,
    "originalPrice": 1799,
    "discount": "42% OFF",
    "tag": "Trending",
    "rating": 4.9,
    "reviews": 142,
    "image": "asserts/products/wa-product-03.jpg",
    "gallery": [
      "asserts/products/wa-product-03.jpg",
      "asserts/products/wa-product-01.jpg",
      "asserts/products/wa-product-07.jpg"
    ],
    "fabric": "100% Super-Combed 240 GSM Rib Knit Cotton",
    "fit": "Regular Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Rust Terracotta",
        "hex": "#6f423c"
      },
      {
        "name": "Oat Beige",
        "hex": "#e1dac7"
      }
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
    "price": 849,
    "originalPrice": 1449,
    "discount": "41% OFF",
    "tag": "New Arrival",
    "rating": 4.9,
    "reviews": 96,
    "image": "asserts/products/wa-product-06.jpg",
    "gallery": [
      "asserts/products/wa-product-06.jpg",
      "asserts/products/wa-product-04.jpg",
      "asserts/products/wa-product-05.jpg"
    ],
    "fabric": "260 GSM Bio-Washed Rib Knit Cotton",
    "fit": "Relaxed Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Sea Teal",
        "hex": "#5aa9b0"
      },
      {
        "name": "Golden Mustard",
        "hex": "#d4a700"
      }
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
    "price": 1299,
    "originalPrice": 2199,
    "discount": "41% OFF",
    "tag": "Trending",
    "rating": 4.8,
    "reviews": 83,
    "image": "asserts/products/vintage-renaissance-shirt.jpg",
    "gallery": [
      "asserts/products/vintage-renaissance-shirt.jpg",
      "asserts/products/cotton-linen-henley-shirt.jpg"
    ],
    "fabric": "100% Breathable Pure Slub Cotton",
    "fit": "Boho Relaxed Fit",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Natural Ecru",
        "hex": "#f2eee6"
      }
    ],
    "description": "Bohemian Renaissance-inspired tunic shirt with lace-up placket and billowy sleeves. Perfect for music festivals, holiday retreats, and expressive streetwear styling.",
    "featured": false,
    "bestseller": false,
    "stock": 18
  }
];

if (typeof module !== 'undefined') { module.exports = { PRODUCTS }; }
