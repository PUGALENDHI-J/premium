// Company, contact, enquiry and policy pages. Policies describe how this static site actually handles data
// (no server-side form storage; enquiries go to WhatsApp). Have them reviewed before relying on them legally.
import { SITE } from "./site.mjs";

const contactLinks = `<a href="tel:${SITE.tel}"><b>${SITE.phone}</b><small>Call a planner</small></a>
<a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener"><b>WhatsApp</b><small>Fastest way to reach us</small></a>
<a href="mailto:${SITE.email}"><b>${SITE.email}</b><small>Email</small></a>
<a href="https://instagram.com/${SITE.insta}" target="_blank" rel="noopener"><b>@${SITE.insta}</b><small>Instagram</small></a>
<a class="caddr" href="${SITE.map}" target="_blank" rel="noopener"><b>Visit our office</b><small>${SITE.address}</small></a>`;
const contactCards = `<section class="tight"><div class="cgrid">
${contactLinks}
</div></section>`;

// About page sections (styles: .ab-* in assets/css/nexara-pages.css); every claim here repeats what the rest of the site says
// [title, text, link, link label, photo, photo caption]
const aboutPlan = [
  ["Tamil Nadu, close to home", "Temple circuits, hill-station breaks in the Nilgiris and Kodaikanal, and roots journeys for Tamil families returning to their native villages.", "/sacred/tamil-nadu-temples/", "Tamil Nadu temples & shrines", "/assets/photos/vw/paris.webp", "The Eiffel Tower at dusk, Paris"],
  ["India, every season", "From Kashmir and Ladakh to Kerala and the Andamans, with Sacred journeys for pilgrimages of every faith.", "/tour-packages/india/", "India holidays", "/assets/photos/vw/tokyo.webp", "Shibuya at night, Tokyo"],
  ["The world", "Private holidays across Asia, Europe, the Middle East, Africa, the Americas and Oceania, with flights, hotels, transfers and visa guidance in one plan.", "/tour-packages/international/", "International holidays", "/assets/photos/vw/switzerland.webp", "An alpine valley in Switzerland"],
  ["Travel with a purpose", "Business and trade travel, educational trips, roots and heritage journeys, cruises and luxury yacht experiences.", "/experiences/", "Travel experiences", "/assets/photos/guangzhou.webp", "Guangzhou, home of the Canton Fair"],
  ["Groups and honeymoons", "Group tours for friends, families, clubs and companies, including our own fixed-date departures, and honeymoons planned around the two of you.", "/tour-types/group-tours/", "Group tours", "/assets/photos/vw/maldives.webp", "Island reefs of the Maldives"],
  ["Travel services", "Flight tickets, visas, forex, travel insurance, hotels and airport transfers, on their own or as part of your trip.", "/services/", "Travel services", "/assets/photos/vw/dubai--burj-khalifa.webp", "Burj Khalifa, Dubai"],
];
const aboutSteps = [
  ["Tell us your idea", `On WhatsApp, by phone or through our <a href="/custom-tour/">custom tour form</a>, from wherever you live.`],
  ["Get a written plan", "We send a written plan with a price. Itineraries on this website are starting points, not fixed products."],
  ["Change anything", "Swap hotels, add a day or change the route until the plan is right for you."],
  ["Confirm when ready", "Nothing is booked until you confirm in writing and pay the deposit stated in your quote."],
];
const aboutPromises = [
  ["Honest information", "We tell you the right season for a destination, even if it means suggesting a different month or place."],
  ["No surprises", "Inclusions and exclusions are listed in your written quote. If something is not included, we say so."],
  ["A real person to message", "You have a planner on WhatsApp before and during your trip, in English or Tamil."],
];
const two = n => String(n + 1).padStart(2, "0");
const chev = '<svg class="abx-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const aboutFacts = [[70, "+", "countries we plan trips to"], [2, "", "languages: English and Tamil"], [1, "", "planner on WhatsApp, before and during your trip"], [0, "Free", "quotes; nothing is booked until you confirm"]];
// interactions (count-up, plan showcase, timeline, collage parallax) live in assets/js/nexara-about.js
const aboutPre = `<section class="ab-s abx-intro"><div class="abx-copy"><div class="h"><span class="eye">Who we are</span><h2>A Tamil Nadu travel company, planning journeys <em>everywhere</em></h2></div>
<p class="abx-lede">Nexara Holidays is rooted in <b>Tamil Nadu</b>. We know its temple towns, hill stations, coast and villages first-hand, and we plan journeys from here to every part of India and more than 70 countries around the world.</p>
<p>Every trip starts as a conversation with a planner, not a fixed package: you tell us what you have in mind, and we send a written plan with a price that you can change until it is right.</p>
<div class="ab-cta"><button type="button" class="btn red" data-enq>Request a free quote →</button><a class="btn ghost2" href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">Chat on WhatsApp</a></div></div>
<div class="abx-art"><figure class="abx-p1"><img src="/assets/photos/vw/venice.webp" alt="A gondola under the Bridge of Sighs, Venice"></figure><figure class="abx-p2"><img src="/assets/photos/vw/santorini--oia-sunset.webp" alt="Whitewashed houses of Oia, Santorini" loading="lazy"></figure>
<div class="abx-seal" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="abx-ring" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"/></defs><text><textPath href="#abx-ring" textLength="280" lengthAdjust="spacing">From Tamil Nadu · to the world · </textPath></text></svg><i><img src="/assets/logo-circle.webp" alt=""></i></div>
<div class="abx-tag"><b>English &amp; Tamil</b><span>your planner speaks both</span></div></div></section>
<div class="abx-statw"><ul class="abx-stats">${aboutFacts.map(([n, s, t]) => `<li><b${n ? ` data-count="${n}" data-suffix="${s}"` : ""}>${n ? n + s : s}</b><span>${t}</span></li>`).join("")}</ul></div>
<div class="alt abx-band"><section class="ab-s"><div class="h"><span class="eye">What we plan</span><h2>Trips for every reason to travel</h2><p>From a weekend temple circuit to a month across several continents.</p></div>
<div class="abx-show"><div class="abx-media">${aboutPlan.map(([, , , , img, cap], i) => `<figure${i ? "" : ' class="on"'}><img src="${img}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`).join("")}<div class="abx-num" aria-hidden="true"><b>01</b> / ${two(aboutPlan.length - 1)}</div></div>
<ol class="abx-tabs">${aboutPlan.map(([h, p, u, go, img], i) => `<li${i ? "" : ' class="on"'}><button type="button" id="abx-t${i}" aria-controls="abx-p${i}" aria-expanded="${!i}"><i><img src="${img}" alt="" loading="lazy"></i><span class="abx-n">${two(i)}</span><span class="abx-t">${h}</span>${chev}</button><div class="abx-panel" id="abx-p${i}" role="region" aria-labelledby="abx-t${i}"><div><p>${p}</p><a class="abx-go" href="${u}">${go} →</a></div></div><span class="abx-bar" aria-hidden="true"><span></span></span></li>`).join("")}</ol></div></section></div>
<section class="ab-s"><div class="h c"><span class="eye">How we work</span><h2>From your first message to a confirmed trip</h2><p>Four simple steps, and you decide at every one of them.</p></div>
<ol class="abx-steps">${aboutSteps.map(([h, p], i) => `<li><span class="abx-dot">${two(i)}</span><h3>${h}</h3><p>${p}</p></li>`).join("")}</ol></section>
<div class="abx-pwrap"><section class="ab-s abx-promise"><figure class="abx-pimg"><img src="/assets/photos/vw/lucerne.webp" alt="Lucerne's old town on the Reuss river, Switzerland" loading="lazy"><figcaption><span>Lucerne</span>Where the lake meets the Alps</figcaption></figure>
<div><div class="h"><span class="eye">Our promises</span><h2>What you can count on</h2><p>Three things that hold for every trip we plan, whatever its size.</p></div>
<ul class="abx-plist">${aboutPromises.map(([h, p]) => `<li><div><h3>${h}</h3><p>${p}</p></div></li>`).join("")}</ul></div></section></div>
<script src="/assets/js/nexara-about.js" defer></script>`;
const aboutContact = `<div class="alt"><section class="ab-s"><div class="abx-cta"><img src="/assets/photos/vw/bali--tanah-lot.webp" alt="" loading="lazy"><div class="abx-cin"><span class="eye">Get in touch</span><h2>Talk to a planner</h2><p>Call, WhatsApp, email or message us on Instagram. We usually reply the same day.</p><div class="ab-cta"><button type="button" class="btn red" data-enq>Request a free quote →</button><a class="btn ghost2" href="/contact-us/">Contact page</a></div></div></div><div class="cgrid">
${contactLinks}
</div></section></div>`;
// destination picker for the enquiry forms (contact, custom tour, home page): grouped like the Packages menu
export const DEST_GROUPS = [
  ["India", ["Tamil Nadu", "Kerala", "Karnataka", "Goa", "Rajasthan", "Golden Triangle (Delhi, Agra, Jaipur)", "Kashmir", "Ladakh", "Himachal Pradesh", "Uttarakhand", "Varanasi and Uttar Pradesh", "Sikkim and Darjeeling", "Northeast India", "Andaman Islands", "Lakshadweep", "Pilgrimage in India"]],
  ["Africa", ["Kenya", "Morocco", "Seychelles", "South Africa", "Tanzania", "Zimbabwe"]],
  ["America", ["Alaska", "Canada", "Central America", "North America", "South America", "USA"]],
  ["Pacific", ["Australia", "Fiji", "New Zealand"]],
  ["Asia", ["Bali", "Cambodia", "China", "Hong Kong", "Indonesia", "Japan", "Kazakhstan", "Malaysia", "Philippines", "Russia", "Singapore", "South Korea", "Taiwan", "Thailand", "Uzbekistan", "Vietnam"]],
  ["Europe", ["Armenia", "Austria", "Belgium", "Bulgaria", "Croatia", "Czech Republic", "Denmark", "Finland", "France", "Germany", "Greece", "Greenland", "Hungary", "Iceland", "Ireland", "Italy", "London", "Netherlands", "Norway", "Portugal", "Romania", "Slovakia", "Spain", "Sweden", "Switzerland", "Turkey", "United Kingdom", "Europe multi-country"]],
  ["Islands", ["Madagascar", "Maldives", "Mauritius", "Reunion", "Sri Lanka"]],
  ["Middle East", ["Dubai", "Egypt", "Israel", "Jordan", "Oman", "Qatar", "UAE"]],
  ["Cruises", ["Cordelia Cruises", "International cruise"]],
  ["Honeymoon", ["Australia", "Bali", "Croatia", "Dubai", "Europe", "Greece", "Italy", "Koh Samui", "Krabi", "Langkawi", "Malaysia", "Maldives", "Mauritius", "Paris", "Phuket", "Seychelles", "Singapore", "South Africa", "Spain", "Sri Lanka", "Switzerland", "Thailand"].map(x => "Honeymoon in " + x)],
  ["Business travel", ["Canton Fair, China", "Other trade fair or sourcing trip"]],
];
export const destOptions = () => `<option value="">Not sure yet</option>` + DEST_GROUPS.map(([g, l]) => `<optgroup label="${g}">${l.map(x => `<option>${x}</option>`).join("")}</optgroup>`).join("");
const opt = a => a.map(v => `<option>${v}</option>`).join("");
const form = (full) => `<section><div class="h"><span class="eye">${full ? "Start planning" : "Quick message"}</span><h2>${full ? "Tell us about your trip" : "Send us a note"}</h2><p>Fill this in and WhatsApp opens with your message ready to send. Nothing is stored on this website.</p></div>
<form id="ctf" novalidate>
<div class="fl"><input id="cfn" placeholder=" " autocomplete="name"><label for="cfn">Your name</label><span class="ok">✓</span></div>
<div class="fl"><input id="cfp" type="tel" inputmode="tel" placeholder=" " autocomplete="tel"><label for="cfp">Mobile number (WhatsApp)</label><span class="ok">✓</span></div>
<div class="fl f"><select id="cfd">${destOptions()}</select><label for="cfd">Where would you like to go?</label></div>
${full ? `<div class="fl"><input id="cft" type="number" min="1" max="99" placeholder=" "><label for="cft">Number of travellers</label></div>
<div class="fl"><input id="cfdt" type="month" placeholder=" "><label for="cfdt">Approximate travel month</label></div>
<div class="fl"><select id="cfdu">${opt(["Not sure yet", "2–3 days", "4–5 days", "6–7 days", "8–10 days", "11 days or more"])}</select><label for="cfdu">Preferred duration</label></div>
<div class="fl"><select id="cfb">${opt(["Not sure yet", "Under ₹25,000 per person", "₹25,000–50,000 per person", "₹50,000–1 lakh per person", "₹1–2 lakh per person", "Above ₹2 lakh per person"])}</select><label for="cfb">Budget</label></div>` : ""}
<div class="fl f"><select id="cfk">${opt(["Not sure yet", "Honeymoon", "Family holiday", "Friends or group trip", "Pilgrimage", "Adventure", "Luxury holiday", "School or college tour", "Corporate trip"])}</select><label for="cfk">Type of trip</label></div>
<div class="fl f"><textarea id="cfm" placeholder=" " rows="4"></textarea><label for="cfm">${full ? "Special requirements or ideas (optional)" : "Your message (optional)"}</label></div>
<button class="btn red f" type="submit">Send on WhatsApp →</button></form>
<p class="note">Sending this form opens WhatsApp on your device. Your enquiry reaches us only when you press send there. An enquiry is not a booking; trips are confirmed only after you accept a written quote.</p></section>`;

export const PAGES = [
  { s: "about-us", n: "About us", title: "About Nexara Holidays | Tamil Nadu Travel Company, Worldwide Trips", desc: "Nexara Holidays is a Tamil Nadu travel company planning private holidays, pilgrimages, roots journeys, business trips and group tours across India and the world.", h1: "About Nexara Holidays", scr: "From Tamil Nadu to the world", sub: "A Tamil Nadu travel company that plans journeys anywhere in the world, one conversation at a time.", img: "/assets/photos/vw/italy.webp", noCta: true, pre: aboutPre,
    post: `<section class="ab-s"><div class="h"><span class="eye">Where we take you</span><h2>Journeys to the world's horizons</h2><p>Our trips reach more than 70 countries.</p></div><div class="brg"><a class="brt" href="/destinations/international/europe/france/paris/"><img src="/assets/photos/vw/sm/paris.webp" alt="Paris" loading="lazy"><span class="brl"><b>Paris</b></span></a><a class="brt" href="/destinations/international/southeast-asia/singapore/"><img src="/assets/photos/vw/sm/singapore.webp" alt="Singapore" loading="lazy"><span class="brl"><b>Singapore</b></span></a><a class="brt" href="/destinations/international/southeast-asia/thailand/"><img src="/assets/photos/vw/sm/thailand.webp" alt="Thailand" loading="lazy"><span class="brl"><b>Thailand</b></span></a><a class="brt" href="/destinations/international/indian-ocean/maldives/"><img src="/assets/photos/vw/sm/maldives.webp" alt="Maldives" loading="lazy"><span class="brl"><b>Maldives</b></span></a><a class="brt" href="/destinations/international/europe/switzerland/"><img src="/assets/photos/vw/sm/switzerland.webp" alt="Switzerland" loading="lazy"><span class="brl"><b>Switzerland</b></span></a><a class="brt" href="/destinations/international/east-asia/japan/"><img src="/assets/photos/vw/sm/japan.webp" alt="Japan" loading="lazy"><span class="brl"><b>Japan</b></span></a><a class="brt" href="/destinations/international/middle-east/uae/dubai/"><img src="/assets/photos/vw/sm/dubai.webp" alt="Dubai" loading="lazy"><span class="brl"><b>Dubai</b></span></a><a class="brt" href="/destinations/international/southeast-asia/indonesia/bali/"><img src="/assets/photos/vw/sm/bali.webp" alt="Bali" loading="lazy"><span class="brl"><b>Bali</b></span></a></div><p style="text-align:center;margin-top:24px"><a class="btn ghost2" href="/destinations/">Explore all destinations →</a></p></section><!--PARTNERS-->` + aboutContact,
    body: "" },
  { s: "contact-us", n: "Contact us", title: "Contact Nexara Holidays | Call or WhatsApp +91 73059 71481", desc: "Contact Nexara Holidays in Chennai by phone, WhatsApp, email or Instagram, or send a quick enquiry. We reply on WhatsApp with a plan and a price.", h1: "Contact us", scr: "Let's plan together", sub: "Call, WhatsApp or email. We usually reply the same day.", img: "/assets/photos/vw/dubai.webp", noCta: true, pre: contactCards, post: form(false),
    body: `## The quickest ways to reach us

**WhatsApp** is the fastest: message ${SITE.phone} with where you would like to go and your dates, and a planner will reply. You can also **call** the same number or email **${SITE.email}**.

**Visit us** at our office: Nexara Holidays, ${SITE.address}. Please call or WhatsApp before you come so a planner is free to meet you.

For a detailed quote, the [custom tour enquiry form](/custom-tour/) asks for everything we need in one go: destination, travellers, month, duration and budget.

## Before you message

It helps to have:

- Approximate travel dates or month
- Number of adults and children (with ages)
- The city you will travel from
- Places you are considering, or the kind of trip you want
- A rough budget per person

Not sure where to go? Browse the [destination directory](/destinations/), [holiday themes](/tour-types/) or [travel guides](/travel-guides/) for ideas.` },
  { s: "custom-tour", n: "Custom tour enquiry", title: "Plan a Custom Tour | Free Quote | Nexara Holidays", desc: "Request a free, no-obligation quote for a customised private tour in India or abroad. Share your dates, travellers and budget and we reply on WhatsApp.", h1: "Plan a custom tour", scr: "Made for you", sub: "Tell us your dates, travellers and budget. We reply with a plan and a price.", img: "/assets/photos/vw/bali.webp", noCta: true, post: form(true),
    body: `Every trip on this website can be changed, and many of our travellers start from a blank page. Fill in the form below and WhatsApp opens with your details ready to send.

## What happens next

1. **We reply on WhatsApp**, usually the same day, with any questions.
2. **We send a written plan**: day-by-day route, suggested hotels, inclusions, exclusions and a price.
3. **You fine-tune it.** Change hotels, add nights or swap sightseeing.
4. **You confirm** in writing and pay the deposit stated in your quote. Only then do we make bookings.

There is no charge for a quote and no obligation to book. See [how custom planning works](/tour-types/private-tours/) for more detail.` },
  { s: "privacy-policy", n: "Privacy policy", title: "Privacy Policy | Nexara Holidays", desc: "How Nexara Holidays collects, uses and protects the personal information you share when you enquire about or book a trip.", h1: "Privacy policy", scr: "Your information", sub: "How we collect, use and protect your details.", noCta: true,
    body: `This policy explains how Nexara Holidays ("we", "us") handles personal information when you use this website or plan a trip with us.

## What this website collects

This website does not store the details you type into its enquiry forms. When you submit a form, your browser opens WhatsApp with a pre-filled message. Your information reaches us only if you press send in WhatsApp. WhatsApp is operated by Meta and its own privacy policy applies to messages sent through it.

The website does not use advertising or analytics cookies. Pages load fonts from Google Fonts, which means your browser connects to Google's servers. The home page uses your browser's session storage only to avoid showing the same pop-up twice.

## Information you give us directly

When you enquire or book by WhatsApp, phone or email, we may receive:

- Your name, phone number and email address
- Travel dates, destinations and the number and ages of travellers
- Passport, visa, date-of-birth and similar details needed to make bookings
- Dietary, medical or accessibility needs you choose to share
- Payment details needed to complete a booking

## How we use it

We use your information to answer your enquiry, prepare quotes, make and manage bookings, help with visas and travel documents, contact you about your trip and meet our legal and accounting obligations.

## Who we share it with

We share only what is needed with the suppliers who provide your trip, such as airlines, hotels, transport operators, local guides, insurers and visa authorities. Some of these suppliers are outside India and handle your data under their own policies and local laws. We do not sell your information.

## How long we keep it

We keep booking records for as long as needed to provide the service and to meet tax, accounting and legal requirements, then delete or anonymise them.

## Your choices

You can ask us what information we hold about you, ask us to correct it, or ask us to delete it where we are not required to keep it. Contact us at ${SITE.email} or ${SITE.phone}.

## Changes

We may update this policy. The date at the top shows when it was last changed.` },
  { s: "terms-and-conditions", n: "Terms and conditions", title: "Terms and Conditions | Nexara Holidays", desc: "The terms that apply to quotes, bookings, payments, changes, travel documents and responsibilities when you book a trip with Nexara Holidays.", h1: "Terms and conditions", scr: "The fine print", sub: "Your written quote and booking confirmation take priority over this page where they differ.", noCta: true,
    body: `These terms apply to trips booked with Nexara Holidays. Specific terms for your trip, including prices, inclusions, payment schedule and cancellation charges, are set out in your written quote and booking confirmation. Where those documents differ from this page, they take priority.

## Itineraries and information on this website

Itineraries on this website are suggestions to help you plan. They are not offers of a specific price or availability. Prices, hotels, inclusions and timings are confirmed only in your written quote. We try to keep destination information accurate, but opening hours, entry rules, fees and seasons change; please check important details before you travel.

## Quotes and booking

- A quote is valid for the period stated on it and depends on availability when you confirm.
- A booking is confirmed only when you accept the quote in writing and we receive the deposit stated in it, and we then confirm the booking to you in writing.
- Prices can change before a booking is fully paid if suppliers, taxes or exchange rates change. We will tell you before asking you to pay any difference.

## Payments

The payment schedule is stated in your quote. Full payment is usually required before departure. If payments are not made on time, we may cancel the booking and apply the cancellation charges in your confirmation.

## Travel documents, visas and health

You are responsible for holding a valid passport, visas, permits and any health documents required for your trip. We help with guidance and paperwork, but visa decisions are made by the authorities and are outside our control. Please check vaccination and health advice with a doctor.

## Travel insurance

We strongly recommend comprehensive travel insurance covering cancellation, medical expenses and any activities you plan.

## Changes by you

We will try to make changes you request. Changes may involve supplier charges and fare differences, which we tell you before confirming the change.

## Changes by us or our suppliers

Occasionally suppliers change schedules, close attractions or substitute hotels of a similar standard. If a significant change is needed before departure, we will offer alternatives or a refund of amounts we can recover from suppliers. Weather, natural events, strikes, government orders and similar events outside anyone's control can affect itineraries; we will help you rearrange plans, but additional costs may apply.

## Our responsibility

We arrange services provided by independent suppliers such as airlines, hotels and transport operators, and their own terms also apply. We are responsible for arranging your booking with reasonable care. We are not responsible for the acts or omissions of independent suppliers beyond what the law requires.

## Complaints

If something is not right during your trip, please tell us immediately on WhatsApp so we can try to fix it. If you remain unhappy, write to us within 30 days of your return.

## Governing law

These terms are governed by the laws of India, and the courts in Chennai have jurisdiction.` },
  { s: "cancellation-policy", n: "Cancellation and refunds", title: "Cancellation & Refund Policy | Nexara Holidays", desc: "How cancellations, refunds, no-shows and changes work for trips booked with Nexara Holidays, and where to find the charges for your booking.", h1: "Cancellation and refund policy", scr: "If plans change", sub: "The exact charges for your trip are in your booking confirmation.", noCta: true,
    body: `We understand plans change. This page explains how cancellations and refunds work. The **exact cancellation charges for your trip are listed in your written quote and booking confirmation**, because they depend on the airlines, hotels and other suppliers involved.

## If you cancel

- Tell us in writing (WhatsApp or email). The cancellation date is the day we receive your message.
- Cancellation charges usually increase as the departure date gets closer, because suppliers charge more for late cancellations.
- Some services are **non-refundable** once booked, such as many promotional airfares, some hotel rates, festival-period stays, permits and visa fees. These are marked in your quote where they apply.

## Refunds

- We refund the amount you paid minus the cancellation charges in your confirmation and any non-refundable supplier costs.
- Refunds go back to the original payment method.
- We process refunds after we receive money back from suppliers. Airlines and hotels have their own timelines, so some refunds take longer than others; we keep you updated.

## No-shows and unused services

If you do not turn up for a service, or leave a trip early, refunds for unused services depend on what suppliers return to us and are not guaranteed.

## Changes instead of cancelling

Changing dates or destinations is often cheaper than cancelling. Ask us first; we will tell you the cost of a change before you decide.

## If we cancel

If we have to cancel a confirmed trip for reasons within our control, we will offer an alternative or a full refund of what you paid us. If a trip cannot go ahead because of events beyond anyone's control, such as natural disasters or government restrictions, we will help you rearrange it or refund the amounts we recover from suppliers.

## Travel insurance

Insurance with trip-cancellation cover can protect you against many of these costs. We recommend buying it when you book.

## Questions

Message us on WhatsApp or call ${SITE.phone}.` },
];

export const FAQS = [
  ["Planning and quotes", [
    ["How do I get a quote?", "Send us your dates, number of travellers, the places you have in mind and a rough budget, on WhatsApp or through the [custom tour form](/custom-tour/). We reply with a written plan and a price."],
    ["Is there a charge for a quote?", "No. Quotes are free and there is no obligation to book."],
    ["Why don't your itineraries show prices?", "Prices change with travel dates, hotel category, room sharing and group size, so we quote each trip individually rather than showing a figure that may not apply to you. Our fixed-date group departures show prices where they are fixed."],
    ["Can I change one of your itineraries?", "Yes. Every itinerary except our fixed-date group departures is a private tour that can be changed: add or remove nights, change hotels or swap sightseeing."],
    ["How far ahead should I plan?", "Two to three months is comfortable for most trips. Plan four to six months ahead for peak seasons, festivals, safaris in India and destinations like the Maldives or Switzerland in summer."],
  ]],
  ["Booking and payments", [
    ["When is my trip confirmed?", "Only after you accept the written quote and pay the deposit stated in it, and we confirm the bookings to you in writing. An enquiry alone is not a booking."],
    ["What payment methods do you accept?", "Payment options are listed in your quote. Ask us if you need a specific method."],
    ["Do prices include GST and TCS?", "Your quote shows applicable taxes. International packages booked from India may attract Tax Collected at Source (TCS) under Indian tax rules, which we explain in your quote."],
    ["What happens if I need to cancel?", "Cancellation charges depend on the suppliers in your trip and how close you are to departure. They are listed in your booking confirmation. See our [cancellation and refund policy](/cancellation-policy/)."],
  ]],
  ["Visas, documents and flights", [
    ["Do you arrange visas?", "We guide you on the documents needed and can help with applications. Visa decisions are made by the relevant authorities, and entry rules change, so we check the current official requirements when you book."],
    ["Are flights included?", "Flights are not included in our itineraries unless they are added to your quote. We can add flights from Chennai or any other city."],
    ["What documents do I need for international travel?", "A passport valid for at least six months beyond your return date is commonly required, along with any visa or arrival registration the destination needs. We send a checklist with your confirmation."],
    ["Do I need travel insurance?", "It is not always mandatory, but we strongly recommend it. Some countries require proof of insurance for a visa."],
  ]],
  ["During your trip", [
    ["Who do I contact if something goes wrong?", "Message your planner on WhatsApp at any time. Your confirmation also includes local contacts for your trip."],
    ["Will someone meet me at the airport?", "Airport transfers are included in most of our itineraries. On our group departures, a Nexara representative meets the group."],
    ["Is vegetarian food available?", "In most of our destinations, yes. Tell us your dietary needs and we note them for hotels and tours, and suggest restaurants."],
    ["Can you help with special occasions?", "Yes. Tell us about birthdays, anniversaries or proposals and we ask hotels what they can arrange."],
  ]],
];
