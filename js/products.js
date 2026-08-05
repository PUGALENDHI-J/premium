/* =========================================================
   Hastavam Textiles — Product Catalog
   Static data layer. In a production build this would be
   served by a backend API; here it powers the full frontend
   shopping experience client-side.
   ========================================================= */

const CATEGORIES = [
  { slug: "banarasi",   title: "Banarasi Silk Sarees",  blurb: "Rich zari work & Mughal-inspired motifs, woven along the ghats of Varanasi." },
  { slug: "kanjivaram",  title: "Kanjivaram Silk Sarees", blurb: "South India's pride — bold colour, temple borders, pure mulberry silk." },
  { slug: "chanderi",    title: "Chanderi Cotton-Silk",   blurb: "Sheer, lightweight elegance for daytime festivity and office wear." },
  { slug: "bandhani",    title: "Bandhani & Leheriya",    blurb: "Rajasthan's tie-dye artistry, a joyful celebration of colour." },
  { slug: "bridal",      title: "Bridal & Trousseau Edit",blurb: "Heavy zari and hand embroidery for the bride who honours tradition." },
  { slug: "everyday",    title: "Everyday Handloom",      blurb: "Breathable cotton wear for daily grace." },
  { slug: "festive",     title: "Festive Drapes",         blurb: "Vibrant colour and zari artistry for every celebration." },
  { slug: "western",     title: "Western Wear",           blurb: "Everyday western staples and indo-western fusion, tailored for daily comfort." }
];

const IMG = "assets/images/products/";

/* Each product: id, cat, name, price (INR number), mrp, fabric, colors[],
   images[], rating, reviewCount, stock, sku, tags[], description, care,
   dimensions, deliveryDays */
const PRODUCTS = [
  // ---------------- Banarasi ----------------
  { id:"b1", cat:"banarasi", name:"Zari Meena Banarasi", price:18500, mrp:22500, fabric:"Pure Katan Silk", colors:["Rose Pink","Ivory"], images:[IMG+"saree-02-banarasi-pink.jpg",IMG+"saree-06-stack-jewel.jpg"], rating:4.7, reviewCount:38, stock:6, sku:"HST-BAN-001", tags:["bestseller"], desc:"A signature Katan silk weave with fine zari meenakari border, hand-finished by artisan partners in Varanasi.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"b2", cat:"banarasi", name:"Royal Kadhwa Banarasi", price:24900, mrp:29900, fabric:"Pure Silk, Kadhwa Weave", colors:["Deep Red"], images:[IMG+"saree-01-red-gold-petals.jpg",IMG+"saree-04-red-purple-floral.jpg"], rating:4.9, reviewCount:52, stock:4, sku:"HST-BAN-002", tags:["bestseller","new"], desc:"Kadhwa weave — the most labour-intensive Banarasi technique — with a dense gold petal motif across the body.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"b3", cat:"banarasi", name:"Ivory Tanchoi Banarasi", price:16200, mrp:18900, fabric:"Tanchoi Silk", colors:["Ivory","Jewel Multi"], images:[IMG+"saree-06-stack-jewel.jpg",IMG+"saree-08-stack-pastel.jpg"], rating:4.5, reviewCount:21, stock:9, sku:"HST-BAN-003", tags:[], desc:"Satin-smooth Tanchoi weave, prized for its subtle sheen and fine self-coloured motifs.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"b4", cat:"banarasi", name:"Rani Pink Jangla Banarasi", price:21000, mrp:24000, fabric:"Pure Silk, Jangla Weave", colors:["Rani Pink"], images:[IMG+"saree-04-red-purple-floral.jpg",IMG+"saree-01-red-gold-petals.jpg"], rating:4.6, reviewCount:17, stock:5, sku:"HST-BAN-004", tags:[], desc:"Jangla weave with an all-over trailing floral vine, a Mughal-era motif still hand-drawn on the loom today.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },

  // ---------------- Kanjivaram ----------------
  { id:"k1", cat:"kanjivaram", name:"Temple Border Kanjivaram", price:27500, mrp:32000, fabric:"Pure Mulberry Silk", colors:["Deep Red","Gold"], images:[IMG+"saree-03-red-temple-border.jpg",IMG+"saree-15-stack-jeweltone.jpg"], rating:4.8, reviewCount:44, stock:5, sku:"HST-KAN-001", tags:["bestseller"], desc:"Classic temple-border Kanjivaram in pure mulberry silk, woven with a contrasting zari pallu.", dims:"5.5m length x 1.2m width, with 0.8m blouse piece" },
  { id:"k2", cat:"kanjivaram", name:"Contrast Pallu Kanjivaram", price:23800, mrp:27500, fabric:"Pure Mulberry Silk", colors:["Peach","Pink"], images:[IMG+"saree-11-peach-pink-checks.jpg",IMG+"saree-07-peach-pink-border.jpg"], rating:4.6, reviewCount:19, stock:7, sku:"HST-KAN-002", tags:[], desc:"A softer everyday-festive Kanjivaram with a bold contrast pallu and korvai border technique.", dims:"5.5m length x 1.2m width, with 0.8m blouse piece" },
  { id:"k3", cat:"kanjivaram", name:"Bridal Red Kanjivaram", price:32000, mrp:38000, fabric:"Pure Mulberry Silk, Zari", colors:["Bridal Red"], images:[IMG+"saree-15-stack-jeweltone.jpg",IMG+"saree-03-red-temple-border.jpg"], rating:4.9, reviewCount:61, stock:3, sku:"HST-KAN-003", tags:["bestseller"], desc:"Heavy zari bridal Kanjivaram, densely woven with a wide temple border built for the wedding mandap.", dims:"5.5m length x 1.2m width, with 0.9m blouse piece" },
  { id:"k4", cat:"kanjivaram", name:"Emerald Checks Kanjivaram", price:19900, mrp:22900, fabric:"Pure Mulberry Silk", colors:["Emerald","Black"], images:[IMG+"saree-05-red-black-stripe.jpg",IMG+"saree-16-stack-checks.jpg"], rating:4.4, reviewCount:12, stock:8, sku:"HST-KAN-004", tags:["new"], desc:"A checked Kanjivaram in a modern colourway, ideal for guests-of-honour and office festive wear.", dims:"5.5m length x 1.2m width, with 0.8m blouse piece" },

  // ---------------- Chanderi ----------------
  { id:"c1", cat:"chanderi", name:"Sheer Butta Chanderi", price:8400, mrp:9800, fabric:"Cotton-Silk Blend", colors:["Mauve"], images:[IMG+"saree-09-mauve-floral.jpg",IMG+"saree-13-purple-pink-pleats.jpg"], rating:4.5, reviewCount:26, stock:12, sku:"HST-CHA-001", tags:[], desc:"Featherlight Chanderi with scattered gold butta motifs, sheer enough for daytime festivity.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"c2", cat:"chanderi", name:"Hand-block Chanderi Suit", price:6900, mrp:7900, fabric:"Chanderi Cotton", colors:["Peach"], images:[IMG+"saree-07-peach-pink-border.jpg",IMG+"saree-11-peach-pink-checks.jpg"], rating:4.3, reviewCount:9, stock:15, sku:"HST-CHA-002", tags:[], desc:"A three-piece hand block printed Chanderi suit set — kurta, dupatta, and bottom.", dims:"Kurta 44in length, Dupatta 2.3m, Bottom 2m unstitched" },
  { id:"c3", cat:"chanderi", name:"Zari Border Chanderi", price:9600, mrp:11200, fabric:"Cotton-Silk Blend", colors:["Pastel Multi"], images:[IMG+"saree-08-stack-pastel.jpg",IMG+"saree-09-mauve-floral.jpg"], rating:4.6, reviewCount:14, stock:10, sku:"HST-CHA-003", tags:["new"], desc:"Pastel Chanderi with a fine zari border, woven to catch light without overpowering the drape.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"c4", cat:"chanderi", name:"Pastel Chanderi Drape", price:7800, mrp:8900, fabric:"Chanderi Cotton", colors:["Lilac"], images:[IMG+"saree-13-purple-pink-pleats.jpg",IMG+"saree-08-stack-pastel.jpg"], rating:4.2, reviewCount:8, stock:11, sku:"HST-CHA-004", tags:[], desc:"An everyday Chanderi drape in a soft lilac, breathable enough for long office days.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },

  // ---------------- Bandhani ----------------
  { id:"d1", cat:"bandhani", name:"Classic Bandhani Dupatta", price:3200, mrp:3800, fabric:"Pure Cotton", colors:["Orange-Navy"], images:[IMG+"saree-14-orange-navy-floral.jpg"], rating:4.4, reviewCount:31, stock:20, sku:"HST-BAN2-001", tags:[], desc:"Hand tie-dyed Bandhani dupatta from Kutch, each dot pinched and dyed entirely by hand.", dims:"2.3m x 0.9m" },
  { id:"d2", cat:"bandhani", name:"Leheriya Silk Saree", price:11500, mrp:13500, fabric:"Silk, Leheriya Dye", colors:["Multi Stripe"], images:[IMG+"saree-16-stack-checks.jpg",IMG+"saree-05-red-black-stripe.jpg"], rating:4.5, reviewCount:16, stock:9, sku:"HST-BAN2-002", tags:["new"], desc:"Rajasthani Leheriya wave-dye technique on pure silk, traditionally worn through the monsoon festivals.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"d3", cat:"bandhani", name:"Gharchola Bandhani", price:14800, mrp:16900, fabric:"Silk, Bandhani Work", colors:["Red-Gold"], images:[IMG+"saree-05-red-black-stripe.jpg",IMG+"saree-14-orange-navy-floral.jpg"], rating:4.7, reviewCount:23, stock:6, sku:"HST-BAN2-003", tags:[], desc:"A checked Gharchola grid filled with fine Bandhani dots, traditionally a wedding trousseau piece.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"d4", cat:"bandhani", name:"Mothra Bandhani Stole", price:2600, mrp:3100, fabric:"Georgette", colors:["Mauve Multi"], images:[IMG+"saree-09-mauve-floral.jpg"], rating:4.1, reviewCount:7, stock:18, sku:"HST-BAN2-004", tags:[], desc:"A lightweight Mothra-pattern Bandhani stole, an easy way to carry the craft into everyday wear.", dims:"2.2m x 0.85m" },

  // ---------------- Bridal ----------------
  { id:"e1", cat:"bridal", name:"Kadhwa Bridal Banarasi", price:42000, mrp:49000, fabric:"Pure Silk, Kadhwa", colors:["Bridal Red"], images:[IMG+"saree-01-red-gold-petals.jpg",IMG+"saree-04-red-purple-floral.jpg"], rating:4.9, reviewCount:34, stock:2, sku:"HST-BRD-001", tags:["bestseller"], desc:"Our most intricate Kadhwa weave, months on the loom, built for the bride who wants heirloom weight.", dims:"5.5m length x 1.1m width, with 0.9m blouse piece" },
  { id:"e2", cat:"bridal", name:"Kanjivaram Bridal Red", price:38500, mrp:45000, fabric:"Pure Mulberry Silk", colors:["Bridal Red","Gold"], images:[IMG+"saree-03-red-temple-border.jpg",IMG+"saree-15-stack-jeweltone.jpg"], rating:4.8, reviewCount:29, stock:3, sku:"HST-BRD-002", tags:[], desc:"Temple border bridal Kanjivaram with a dense gold zari pallu, woven for the wedding day itself.", dims:"5.5m length x 1.2m width, with 0.9m blouse piece" },
  { id:"e3", cat:"bridal", name:"Zardozi Trousseau Saree", price:45900, mrp:52000, fabric:"Silk, Zardozi Embroidery", colors:["Rose Pink"], images:[IMG+"saree-02-banarasi-pink.jpg",IMG+"saree-06-stack-jewel.jpg"], rating:4.9, reviewCount:18, stock:2, sku:"HST-BRD-003", tags:["new"], desc:"Hand embroidered Zardozi work over silk base, an ideal reception or sangeet piece.", dims:"5.5m length x 1.1m width, with 0.9m blouse piece" },
  { id:"e4", cat:"bridal", name:"Heritage Gold Bridal Set", price:52000, mrp:59900, fabric:"Silk, Heavy Zari", colors:["Gold"], images:[IMG+"saree-12-stack-assorted.jpg"], rating:5.0, reviewCount:11, stock:1, sku:"HST-BRD-004", tags:["bestseller"], desc:"An all-gold heritage weave with matching blouse and dupatta, our flagship bridal edit piece.", dims:"5.5m length x 1.1m width, with 0.9m blouse piece + matching dupatta" },

  // ---------------- Everyday ----------------
  { id:"f1", cat:"everyday", name:"Handloom Cotton Saree", price:3800, mrp:4500, fabric:"Pure Cotton", colors:["Peach"], images:[IMG+"saree-07-peach-pink-border.jpg"], rating:4.3, reviewCount:42, stock:25, sku:"HST-EVD-001", tags:["bestseller"], desc:"An everyday handloom cotton weave, soft and breathable for daily wear.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"f2", cat:"everyday", name:"Block-Printed Kurti", price:1900, mrp:2300, fabric:"Cotton", colors:["Peach-Pink"], images:[IMG+"saree-11-peach-pink-checks.jpg"], rating:4.2, reviewCount:33, stock:30, sku:"HST-EVD-002", tags:[], desc:"Hand block printed cotton kurti, comfortable enough for all-day wear.", dims:"Length 42in, regular fit" },
  { id:"f3", cat:"everyday", name:"Everyday Chanderi Suit", price:4500, mrp:5200, fabric:"Chanderi Cotton", colors:["Pastel"], images:[IMG+"saree-08-stack-pastel.jpg"], rating:4.1, reviewCount:15, stock:16, sku:"HST-EVD-003", tags:[], desc:"A three-piece everyday Chanderi suit set, light enough for daily office wear.", dims:"Kurta 44in length, Dupatta 2.3m, Bottom 2m unstitched" },
  { id:"f4", cat:"everyday", name:"Casual Handloom Dupatta", price:1400, mrp:1700, fabric:"Cotton", colors:["Purple-Pink"], images:[IMG+"saree-13-purple-pink-pleats.jpg"], rating:4.0, reviewCount:10, stock:28, sku:"HST-EVD-004", tags:[], desc:"A lightweight handloom cotton dupatta for everyday styling.", dims:"2.3m x 0.9m" },

  // ---------------- Festive ----------------
  { id:"g1", cat:"festive", name:"Festive Zari Saree", price:15000, mrp:17500, fabric:"Silk Blend, Zari", colors:["Orange-Navy"], images:[IMG+"saree-14-orange-navy-floral.jpg"], rating:4.5, reviewCount:20, stock:9, sku:"HST-FST-001", tags:[], desc:"A festive zari-woven saree in a silk blend, styled for Diwali and puja gatherings.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"g2", cat:"festive", name:"Puja Silk Drape", price:9200, mrp:10800, fabric:"Pure Silk", colors:["Red-Purple"], images:[IMG+"saree-04-red-purple-floral.jpg"], rating:4.4, reviewCount:13, stock:14, sku:"HST-FST-002", tags:[], desc:"A pure silk everyday-festive drape, traditionally worn for morning puja and family gatherings.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },
  { id:"g3", cat:"festive", name:"Celebration Kanjivaram", price:26400, mrp:30500, fabric:"Pure Mulberry Silk", colors:["Deep Red"], images:[IMG+"saree-03-red-temple-border.jpg"], rating:4.7, reviewCount:22, stock:5, sku:"HST-FST-003", tags:["bestseller"], desc:"A celebration-ready Kanjivaram with temple border, suited to weddings and receptions alike.", dims:"5.5m length x 1.2m width, with 0.8m blouse piece" },
  { id:"g4", cat:"festive", name:"Golden Zari Banarasi", price:22300, mrp:25900, fabric:"Pure Silk", colors:["Ivory-Gold"], images:[IMG+"saree-06-stack-jewel.jpg"], rating:4.6, reviewCount:17, stock:7, sku:"HST-FST-004", tags:["new"], desc:"An all-gold zari Banarasi built for the festive season, pairs well with statement jewellery.", dims:"5.5m length x 1.1m width, with 0.8m blouse piece" },

  // ---------------- Western ----------------
  { id:"w1", cat:"western", name:"Tailored Cotton Shirt", price:2200, mrp:2600, fabric:"Pure Cotton", colors:["Lilac"], images:[IMG+"saree-13-purple-pink-pleats.jpg"], rating:4.2, reviewCount:19, stock:22, sku:"HST-WST-001", tags:[], desc:"A tailored pure cotton shirt with a relaxed collar, cut for everyday wear.", dims:"Regular fit, sizes XS–XXL" },
  { id:"w2", cat:"western", name:"Indo-Western Co-ord Set", price:4200, mrp:4900, fabric:"Cotton-Silk Blend", colors:["Green-Red"], images:[IMG+"saree-10-green-red-paithani.jpg"], rating:4.4, reviewCount:14, stock:12, sku:"HST-WST-002", tags:["new"], desc:"A two-piece indo-western co-ord set blending handloom textile with a contemporary silhouette.", dims:"Regular fit, sizes XS–XXL" },
  { id:"w3", cat:"western", name:"Relaxed Linen Trousers", price:2800, mrp:3300, fabric:"Pure Linen", colors:["Black-Red"], images:[IMG+"saree-05-red-black-stripe.jpg"], rating:4.3, reviewCount:11, stock:20, sku:"HST-WST-003", tags:[], desc:"Relaxed-fit pure linen trousers with an elasticated waistband, breathable for daily wear.", dims:"Regular fit, sizes 28–38" },
  { id:"w4", cat:"western", name:"Handloom Denim Jacket", price:5600, mrp:6500, fabric:"Denim, Hand-finished", colors:["Mauve Trim"], images:[IMG+"saree-09-mauve-floral.jpg"], rating:4.5, reviewCount:8, stock:9, sku:"HST-WST-004", tags:["bestseller"], desc:"A denim jacket finished with hand-embroidered trim, pairing western tailoring with handloom detail.", dims:"Regular fit, sizes XS–XXL" }
];

/* ---------- lookup + query helpers ---------- */
function getCategory(slug){ return CATEGORIES.find(c=>c.slug===slug); }
function getProduct(id){ return PRODUCTS.find(p=>p.id===id); }
function getProductsByCategory(slug){ return PRODUCTS.filter(p=>p.cat===slug); }
function currency(n){ return "₹" + Number(n).toLocaleString("en-IN"); }
function discountPct(p){ return Math.round((1 - p.price/p.mrp)*100); }

function relatedProducts(product, count){
  count = count || 4;
  const sameCat = PRODUCTS.filter(p=>p.cat===product.cat && p.id!==product.id);
  const rest = PRODUCTS.filter(p=>p.cat!==product.cat && p.id!==product.id);
  return sameCat.concat(rest).slice(0, count);
}

function searchProducts(query){
  const q = (query||"").trim().toLowerCase();
  if(!q) return [];
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.fabric.toLowerCase().includes(q) ||
    getCategory(p.cat).title.toLowerCase().includes(q) ||
    (p.colors||[]).some(c=>c.toLowerCase().includes(q))
  );
}

/* demo review authors, deterministic per product so counts feel stable */
const REVIEW_NAMES = ["Ananya R.","Priya S.","Meera K.","Lakshmi N.","Divya P.","Kavita J.","Sneha M.","Ritu T.","Pooja V.","Anjali D."];
function demoReviews(product){
  const seedNum = product.id.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const n = Math.min(3, Math.max(1, product.reviewCount % 4 || 2));
  const out = [];
  const bodies = [
    "The drape and finish are exactly as pictured — genuinely handwoven quality.",
    "Colour is richer in person. Delivery took a little longer than expected but well worth it.",
    "Bought this for a family wedding and got so many compliments on the weave.",
    "Fabric feels premium and the border work is very fine. Would order again.",
    "Exactly what I wanted for the occasion. Packaging was lovely too."
  ];
  for(let i=0;i<n;i++){
    out.push({
      name: REVIEW_NAMES[(seedNum+i*3)%REVIEW_NAMES.length],
      rating: Math.max(3, Math.min(5, Math.round(product.rating) - (i===2?1:0))),
      body: bodies[(seedNum+i*7)%bodies.length],
      date: ["2 weeks ago","1 month ago","3 months ago","5 months ago"][(seedNum+i)%4]
    });
  }
  return out;
}
