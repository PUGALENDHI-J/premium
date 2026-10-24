// Travel services sold alongside (or without) a holiday: flights, forex, visas, insurance and the rest.
// Each record becomes /services/<s>/ and a link in the Services mega menu (grouped by `grp`).
// Forex and insurance are arranged through licensed partners; keep the wording that way unless that changes.
// Fields: s slug, n name, ic icon key (tools/lib/html.mjs IC), grp menu group, short one-line card text,
// title/desc for <head>, sub hero line, inc "what we handle", need "what to keep ready", body Markdown, faq [q, a].

export const SERVICE_GROUPS = { before: "Before you fly", there: "While you travel" };

export const SERVICES = [
  { s: "flight-tickets", n: "Flight tickets", ic: "plane", grp: "before", g: "#7a1f12,#d1401f,#ff8a3d",
    short: "Domestic and international flights from Chennai and every major Indian airport.",
    title: "Flight Tickets: Domestic & International Bookings | Nexara Holidays", desc: "Book domestic and international flights through Nexara Holidays: fare comparison, multi-city routes, group fares, date changes and web check-in help.",
    sub: "Fares compared across airlines, booked and managed by a planner you can message.",
    inc: ["Domestic and international one-way, return and multi-city tickets", "Group fares for 10 or more travellers", "Seat, meal and extra baggage requests", "Date changes, cancellations and refund follow-up", "Web check-in reminders and help"],
    need: ["Names exactly as printed on the passport (or government ID for domestic flights)", "Date of birth for every traveller", "Preferred dates and how flexible they are", "Passport number and expiry for international routes"],
    body: `We book flights on their own or as part of a holiday. Tell us where and when, and we compare fares across full-service and low-cost airlines, including connections you might not find on a single airline's website.

## What makes a good fare

The cheapest fare is not always the best one. Before we recommend a ticket we check:

- **Baggage.** Many low-cost and "lite" fares include only cabin baggage. We price the checked bag before comparing.
- **Layovers.** Short connections on separate tickets are risky; long ones may need a transit visa. See [[b:airport-transit-tips]].
- **Change and refund rules.** Some fares cannot be changed at all. We tell you the penalty before you pay.
- **Arrival time.** A cheap red-eye that loses you a day of the holiday is not a saving.

## Multi-city and open-jaw routes

Flying into one city and out of another often saves a long backtrack, for example into Zurich and out of Rome on a Europe trip. Read [[b:open-jaw-flights-explained]] for how this works.

## Group bookings

For 10 or more travellers on the same flight, airlines offer group fares with a fixed price and later name submission. These suit weddings, school tours, corporate trips and our own [group departures](/tour-types/group-tours/).

## After you book

You get the e-ticket and the fare rules in writing. We remind you when web check-in opens and help with any schedule change the airline makes.`,
    faq: [["Are your fares higher than airline websites?", "We quote the fare and any service fee separately, so you can compare. For many routes, especially multi-city ones, the total is the same or lower."],
      ["Can I book only a flight without a holiday?", "Yes. Every service on this page can be booked on its own."],
      ["What happens if the airline cancels or reschedules?", "We contact you with the options the airline offers, such as a free change or a refund, and handle the request for you."]] },

  { s: "forex", n: "Forex and currency exchange", ic: "cash", grp: "before", g: "#14532d,#15803d,#4ade80",
    short: "Foreign currency cash, multi-currency forex cards and overseas remittances.",
    title: "Forex & Currency Exchange for Travel | Nexara Holidays", desc: "Foreign currency notes, multi-currency forex cards and remittances for your trip, arranged through RBI-authorised dealers with doorstep delivery in Chennai.",
    sub: "Cash and forex cards for your trip, arranged through RBI-authorised dealers.",
    inc: ["Foreign currency notes in US dollars, euros, pounds, baht, dirhams, Singapore dollars and more", "Multi-currency prepaid forex cards loaded and delivered before you fly", "Reloading a forex card while you are abroad", "Buying back leftover currency when you return", "Remittances for tuition, medical or overseas hotel payments where allowed"],
    need: ["Passport with a valid visa (where the country needs one)", "Confirmed return ticket", "PAN card", "Completed Form A2 for card loads and remittances (we help you fill it in)"],
    body: `We arrange foreign exchange through **RBI-authorised dealers and full-fledged money changers**, not unlicensed exchangers. You get a written rate before you pay, and currency or a loaded card delivered before your trip.

## Cash or forex card?

Most travellers carry both:

| | Forex card | Cash |
|---|---|---|
| Best for | Hotels, shops, restaurants, ATM withdrawals | Taxis, street food, markets, tips |
| Exchange rate | Locked when you load | Locked when you buy |
| If lost | Can be blocked and replaced | Gone |
| Leftover money | Reload later or encash | Sell back on return |

A multi-currency card can hold several currencies at once, which suits trips such as Singapore and Malaysia or a Europe tour that ends in London. Our guide [[g:money-abroad-forex-cards-and-cash]] and the blog post [[b:travelling-with-forex-cards-tips]] go into more detail.

## Limits and rules worth knowing

Rules can change, so we confirm the current position when you order. At the time of writing:

- Resident Indians can spend abroad within the **Liberalised Remittance Scheme** limit of USD 250,000 per financial year.
- Foreign currency **cash** for a trip is generally limited to the equivalent of **USD 3,000**; the rest should be on a card or other instrument.
- You must declare foreign currency on arrival in India if cash exceeds USD 5,000, or cash plus other instruments exceed USD 10,000.
- Indian residents can take up to **25,000 Indian rupees** in cash out of the country.
- **TCS** (Tax Collected at Source) may apply to forex purchases and overseas tour packages above set thresholds. It is credited to your PAN and can be claimed against your income tax. See [[g:tcs-on-foreign-tour-packages-explained]].

## Tips for a better rate

- Order a few days ahead rather than at the airport, where rates are usually worse.
- Avoid paying in rupees when a card machine abroad offers "dynamic currency conversion"; choose the local currency.
- Carry some small notes for the first taxi and tips on arrival.`,
    faq: [["Do you sell foreign currency yourselves?", "No. Forex is supplied by RBI-authorised dealers and money changers we work with. We arrange the order, documents and delivery so you deal with one person."],
      ["How early should I order forex?", "Two to five working days before departure is ideal. Common currencies such as US dollars and euros can often be arranged sooner; less common ones may take longer."],
      ["Can I sell back leftover currency?", "Yes. Notes can be sold back after your trip, and forex card balances can be encashed or kept for your next trip. Coins usually cannot be exchanged."]] },

  { s: "visa-assistance", n: "Visa assistance", ic: "doc", grp: "before", g: "#1e3a8a,#2563eb,#60a5fa",
    short: "Document checklists, forms, appointments and cover letters for tourist visas.",
    title: "Tourist Visa Assistance for Indian Travellers | Nexara Holidays", desc: "Help with tourist visas for Indian passport holders: document checklists, application forms, appointments, cover letters, itineraries and hotel proofs.",
    sub: "Checklists, forms and appointments handled, so your file goes in complete.",
    inc: ["Checking whether you need a visa, an e-visa or visa on arrival", "A document checklist for your nationality, job and destination", "Filling in online forms and booking embassy or VFS appointments", "Cover letters, day-by-day itineraries and hotel confirmations for the file", "Travel insurance that meets embassy rules, such as Schengen cover"],
    need: ["Passport valid for at least 6 months beyond your return, with blank pages", "Recent photos to the embassy's size rules", "Bank statements and income tax returns", "Leave letter or employment proof, or business registration if self-employed"],
    body: `Visa rules change often, and a missing paper is the most common reason an application is delayed or refused. We prepare the file with you so it goes in complete.

## Types of visa we help with

- **E-visas and visas on arrival**, for destinations such as Thailand, Sri Lanka, Vietnam, Indonesia and others where rules allow. Many countries now also ask for a short online arrival form before you land.
- **Embassy and VFS visas**, including Schengen, UK, USA, Canada, Australia, New Zealand, Japan and Dubai.
- **Transit visas**, when a connection needs one.

Start with [[b:how-to-check-visa-rules-for-indian-passport-holders]], and for Europe read the [[g:schengen-visa-guide-for-indian-travellers]].

## How it works

1. We confirm the visa type and current processing time for your dates.
2. You receive a checklist made for your situation: salaried, self-employed, student, retired or travelling with children.
3. We fill in the form, book the appointment and prepare supporting documents such as the itinerary and hotel bookings.
4. You attend biometrics if the embassy needs them. We track the application until the passport comes back.

## Plan the timing

Apply early for popular visas. Schengen, UK and US appointments can book up weeks ahead in peak season, especially before summer and the December holidays.

The decision always rests with the embassy or immigration authority. We cannot guarantee approval, but a complete, consistent file gives you the best chance.`,
    faq: [["Can you guarantee my visa?", "No one can. The decision belongs to the embassy or immigration officer. We make sure the application is complete and consistent, which avoids the most common refusals."],
      ["Do you charge a fee for visa help?", "Embassy and VFS fees are paid at cost. Our service fee, if any, is shown separately in your quote and is often waived when you book a holiday with us."],
      ["How early should I apply?", "For e-visas, two to three weeks before travel is usually enough. For Schengen, UK, US and similar visas, start six to eight weeks ahead, or earlier in peak season."]] },

  { s: "passport-services", n: "Passport help", ic: "flag", grp: "before", g: "#3b0764,#7e22ce,#c084fc",
    short: "Guidance on new passports, renewals, Tatkaal and police verification.",
    title: "Passport Application & Renewal Help | Nexara Holidays", desc: "Guidance for new Indian passports and renewals: Passport Seva forms, documents, Tatkaal, appointments and timing your application before you travel.",
    sub: "Step-by-step help with new passports and renewals before you book.",
    inc: ["Checking whether your passport is valid enough for your trip", "Guidance on the Passport Seva online form", "Document lists for adults, minors and name changes", "Choosing between normal and Tatkaal applications", "Planning bookings around expected passport dates"],
    need: ["Proof of address and proof of date of birth", "Old passport, for renewals", "Parents' passports or IDs, for minors", "Marriage certificate or gazette notice, for name changes"],
    body: `Many international trips start with a passport problem: it has expired, it expires within six months, or a new family member needs one. We guide you through it so the trip can go ahead.

## Six-month validity

Most countries ask that your passport is valid for **at least six months after your return date**, with two or more blank pages. Check every traveller's passport before booking. Airlines can refuse boarding if it falls short.

## New passport or renewal

Indian passports are applied for through the official **Passport Seva** portal, followed by a visit to a Passport Seva Kendra or Post Office Passport Seva Kendra. Our guide [[g:indian-passport-application-basics]] explains the steps.

- **Normal** applications are the standard route.
- **Tatkaal** costs more and is faster, for genuine urgent travel.
- **Police verification** may happen before or after the passport is issued, depending on the case.

## What we do and do not do

We help you prepare the right documents, fill in the form correctly and time your holiday bookings. Applications must be submitted by you, in person, at the appointment. We never ask for your Passport Seva login or charge you for government fees beyond the official amount.`,
    faq: [["Can you apply for my passport on my behalf?", "No. You fill in and submit the application on the official Passport Seva portal and attend the appointment in person. We help you prepare everything before you go."],
      ["Should I book my trip before my passport arrives?", "We usually suggest holding bookings, or choosing refundable options, until the passport is in hand. Visas cannot be applied for without it."]] },

  { s: "travel-insurance", n: "Travel insurance", ic: "shield", grp: "before", g: "#0f3d3e,#0f766e,#2dd4bf",
    short: "Medical, trip-cancellation and baggage cover from licensed insurers.",
    title: "Travel Insurance for International Trips | Nexara Holidays", desc: "Overseas travel insurance from IRDAI-licensed insurers: medical cover, trip cancellation, lost baggage and flight delays, including Schengen-compliant plans.",
    sub: "Overseas medical and trip cover from licensed insurers, matched to your trip.",
    inc: ["Comparing plans from IRDAI-licensed insurers", "Schengen-compliant policies with at least €30,000 medical cover", "Family, senior citizen, student and multi-trip annual plans", "Add-ons such as adventure sports and trip cancellation", "Help filing a claim if something goes wrong"],
    need: ["Travel dates and destinations", "Age of each traveller", "Any pre-existing medical conditions (they affect cover)", "Planned activities such as trekking, skiing or diving"],
    body: `A hospital visit abroad can cost more than the whole holiday. Travel insurance covers that risk and several smaller ones for a small part of the trip cost. Policies are issued by **IRDAI-licensed insurers**; we help you choose and buy the right one.

## What a good policy covers

- **Medical emergencies** and hospitalisation abroad, including evacuation
- **Trip cancellation or cutting a trip short** for covered reasons such as illness
- **Lost or delayed checked baggage** and **lost passport**
- **Flight delays** and missed connections
- **Personal liability** if you accidentally injure someone or damage property

Read [[g:travel-insurance-explained]] for what the terms mean.

## Things to check before you buy

- **Sum insured.** Higher medical cover makes sense for the USA, Canada, Europe, Japan and Australia.
- **Pre-existing conditions.** Many policies exclude them unless declared. Always declare honestly.
- **Adventure activities.** Skiing, scuba diving and high-altitude trekking often need an add-on.
- **Visa rules.** Schengen countries require at least €30,000 of medical cover valid across the whole Schengen area.

## Buy it early

Buy insurance when you book the trip, not the day before you leave. Cancellation cover only protects you from the date the policy starts.`,
    faq: [["Is travel insurance compulsory?", "For a Schengen visa and some other countries, yes. Elsewhere it is optional but strongly recommended for any international trip."],
      ["Do you settle claims?", "Claims are decided and paid by the insurer. We help you understand the documents needed and stay in touch until the claim is resolved."],
      ["Are senior citizens covered?", "Yes, there are plans for older travellers, though premiums are higher and some conditions may apply. Tell us the ages and we compare options."]] },

  { s: "hotel-bookings", n: "Hotel bookings", ic: "star", grp: "there", g: "#78350f,#b45309,#fbbf24",
    short: "Hotels, resorts, villas and homestays, from budget to five-star.",
    title: "Hotel & Resort Bookings in India and Abroad | Nexara Holidays", desc: "Hotels, resorts, villas and homestays in India and abroad, chosen for location and reviews, with room requests, honeymoon set-ups and flexible rates.",
    sub: "Stays chosen for location and value, with your requests passed on to the hotel.",
    inc: ["Hotels, resorts, serviced apartments, villas and homestays", "Honeymoon and celebration set-ups where hotels offer them", "Connecting rooms, extra beds and family rooms", "Early check-in and late check-out requests", "Group room blocks for weddings and events"],
    need: ["Dates and number of rooms", "Adults and children, with children's ages", "Budget per night or preferred hotel category", "Any must-haves: pool, beach front, vegetarian food, lift access"],
    body: `We book hotels on their own or as part of a holiday. Our planners shortlist two or three options per stop, explain the trade-offs and book the one you choose.

## How we choose

- **Location first.** A slightly dearer hotel near the sights often saves more in taxis and time than it costs.
- **Recent reviews**, not just star ratings. A well-run three-star can beat a tired five-star. See [[b:three-star-or-five-star-hotels]].
- **What the rate includes**: breakfast, taxes, resort fees and city taxes, which some countries collect at check-in.
- **Cancellation rules.** Non-refundable rates are cheaper; we tell you the difference so you can decide.

## Special requests

Tell us about birthdays, anniversaries, honeymoons, mobility needs or food preferences. We pass them to the hotel in writing. Requests such as early check-in depend on availability, and we will say so.

## Changing hotels or staying put

Moving hotels every night is tiring. For many trips we suggest fewer, longer stays with day trips. Our post [[b:day-trips-or-moving-hotels]] explains when each works best.`,
    faq: [["Can I book a hotel I found myself?", "Yes. Send us the name and we check the rate, room type and cancellation terms we can get for your dates."],
      ["Do your prices include taxes?", "Our quotes show what is included. Some destinations charge a city or tourism tax payable at the hotel; we mention it where it applies."]] },

  { s: "airport-transfers-and-car-rentals", n: "Airport transfers and cabs", ic: "car", grp: "there", g: "#1f2937,#4b5563,#9ca3af",
    short: "Airport pick-ups, private cars with drivers and self-drive rentals.",
    title: "Airport Transfers, Cabs & Car Rentals | Nexara Holidays", desc: "Airport pick-ups and drops, private cars with drivers for sightseeing, intercity cabs and self-drive car rentals in India and abroad.",
    sub: "Someone waiting at arrivals, and a car and driver for the days you need one.",
    inc: ["Private and shared airport transfers, with name-board pick-up", "Cars with drivers for sightseeing and intercity travel in India", "Tempo travellers, minibuses and coaches for groups", "Self-drive car rentals abroad", "Railway station and cruise terminal transfers"],
    need: ["Flight numbers and arrival times", "Number of travellers and pieces of luggage", "Hotel addresses", "International or IDP driving permit, for self-drive abroad"],
    body: `A transfer waiting at the airport is the easiest start to a trip, especially after a long flight or a late-night landing. We arrange transfers in India and abroad, alone or as part of a package.

## Transfers

- **Private transfers** go straight to your hotel. The driver tracks your flight and waits if it is late.
- **Shared transfers** cost less but stop at several hotels on the way.
- **Group vehicles** such as tempo travellers and coaches suit families and groups with lots of luggage.

## Cars with drivers

For hill stations, temple circuits and road trips in India, a car with an experienced local driver is often the best way to travel. You get a fixed vehicle for the trip, with tolls, parking and driver allowances listed in the quote.

## Self-drive abroad

Driving yourself works well in places such as New Zealand, Australia, Iceland, Scotland and parts of Europe and the USA. Most countries need your Indian licence plus an **International Driving Permit**. See our [self-drive holidays](/tour-types/self-drive/) for ideas.

## Long journeys

For travellers prone to car sickness on hill roads, we plan shorter driving days and suitable vehicles. Read [[b:car-sickness-on-hill-roads]].`,
    faq: [["What if my flight is delayed?", "Drivers track the flight number you give us and adjust the pick-up time. Share any change of flight with us as soon as you know."],
      ["Are tolls and parking included?", "In India our car quotes say whether tolls, parking, state permits and driver allowances are included. Nothing is added later without telling you first."]] },

  { s: "sim-cards-and-esims", n: "SIM cards and eSIMs", ic: "globe", grp: "there", g: "#0c4a6e,#0284c7,#38bdf8",
    short: "Data plans that work the moment you land, with no surprise roaming bills.",
    title: "International SIM Cards & eSIMs for Travel | Nexara Holidays", desc: "Stay connected abroad with international SIM cards, travel eSIMs and roaming advice, so maps, WhatsApp and bookings work the moment you land.",
    sub: "Mobile data that works when you land, without a surprise roaming bill.",
    inc: ["Advice on Indian roaming packs versus a local SIM or eSIM", "Travel eSIMs for single countries and regions", "Physical travel SIM cards for phones that do not support eSIM", "Setting up before you fly so data works on arrival"],
    need: ["Your phone model (to check eSIM support and that it is unlocked)", "Countries you will visit", "How much data you use: light, normal or heavy"],
    body: `On a trip, your phone is your map, translator, boarding pass and the way you reach us. Being without data is more than an inconvenience. We help you pick the right option before you leave.

## Your three options

- **Indian roaming pack.** Simple and keeps your number, but often the most expensive per GB.
- **Travel eSIM.** Installed on your phone before you fly; data starts when you land. Good value for most trips. Your Indian SIM can stay active for OTP messages.
- **Local physical SIM.** Bought on arrival or from us before you leave. Useful for longer stays or phones without eSIM support.

Our guide [[g:international-roaming-and-esims]] compares them in more detail.

## Before you buy

- Check your phone supports eSIM and is **not carrier-locked**.
- Keep your Indian number able to receive SMS for banking OTPs.
- Download offline maps for each city as a backup.
- Keep our WhatsApp number saved. Your planner is reachable throughout the trip.`,
    faq: [["Will my Indian number still work with an eSIM?", "Yes, on dual-SIM phones. You can keep your Indian SIM for calls and OTP messages while the travel eSIM handles data."],
      ["Which is cheapest?", "For most trips a travel eSIM costs less than a roaming pack for the same data. For very short trips the difference can be small, so we compare for your dates."]] },

  { s: "sightseeing-and-activity-tickets", n: "Sightseeing and tickets", ic: "camera", grp: "there", g: "#831843,#db2777,#f472b6",
    short: "Theme parks, attractions, day tours, shows and local guides.",
    title: "Sightseeing Tours, Attraction & Theme Park Tickets | Nexara Holidays", desc: "Pre-booked tickets for theme parks, attractions, shows and day tours, plus private guides, so you skip queues and sold-out days on your holiday.",
    sub: "Tickets and tours booked ahead, so the day you planned is the day you get.",
    inc: ["Theme parks such as Disneyland, Universal Studios and Ferrari World", "Attraction tickets with timed entry, such as observation decks and museums", "Day tours, island hops, desert safaris and cruises", "Private local guides and language-specific guides", "Cultural shows and dinner cruises"],
    need: ["Dates you would like each activity", "Ages of children (many tickets are priced by age or height)", "Any mobility needs"],
    body: `Popular attractions sell out, especially on weekends and school holidays, and many now use timed entry. We book them ahead so the day goes as planned.

## Plan the order of days

We arrange activities around the weather, opening days and travel time. Outdoor tours go early in the trip so there is a spare day if rain cancels one. Families get the theme park on a weekday where possible. See [[b:best-theme-park-destinations-for-families]].

## Private or group tours

- **Group tours** cost less and are fine for most sightseeing.
- **Private tours** suit families with young children, seniors, honeymooners and anyone who wants to set their own pace. See [private tours](/tour-types/private-tours/).

## On the day

Your vouchers come to WhatsApp with the meeting point, time and what to bring. If the operator cancels for weather, we help rebook or refund.`,
    faq: [["Can I add tickets to a trip I booked elsewhere?", "Yes. Send us your dates and hotel, and we suggest and book activities that fit."],
      ["Are tickets refundable?", "It depends on the attraction. Some allow free changes; others are non-refundable once booked. We tell you before you pay."]] },

  { s: "airport-meet-and-assist", n: "Airport meet and assist", ic: "user", grp: "there", g: "#312e81,#4f46e5,#a5b4fc",
    short: "Help through check-in, immigration and transfers, plus lounge access.",
    title: "Airport Meet & Assist and Lounge Access | Nexara Holidays", desc: "Airport meet and assist, wheelchair requests, fast-track and lounge access for first-time flyers, senior citizens, families with infants and solo travellers.",
    sub: "A helping hand at the airport for first-time flyers, seniors and families.",
    inc: ["Meet and assist through check-in, security and immigration where offered", "Wheelchair and special assistance requests with the airline", "Airport lounge access", "Help with connections at busy hubs", "Briefing for first-time international travellers"],
    need: ["Flight numbers and dates", "Names and ages of travellers needing help", "Type of assistance needed, such as a wheelchair or help with forms"],
    body: `Big airports can be confusing, especially for a first international trip, for parents travelling alone with children or for older travellers. Meet and assist services provide a person who walks you through the airport.

## Who it helps

- **First-time international travellers**, unsure of immigration forms and connections
- **Senior citizens**, who may also need a wheelchair or buggy
- **Parents with infants** and families with lots of luggage
- **Short connections** at hubs such as Dubai, Doha, Singapore and Bangkok

## What to expect

Depending on the airport, an agent meets you at the terminal or aircraft door, helps with check-in, forms and immigration, and walks you to the gate or the arrivals hall. Wheelchair assistance is requested free through the airline; we add it to the booking.

## Lounges

A lounge gives you a quiet seat, food and showers on a long layover. We check whether your card or ticket already includes access before suggesting a paid pass. For tips on long journeys read [[b:long-haul-flight-tips]].`,
    faq: [["Is wheelchair assistance free?", "Airlines provide wheelchair assistance at no charge when requested in advance. We add the request to your booking at least 48 hours before the flight."],
      ["Is meet and assist available at every airport?", "Not everywhere. It is common at major international airports. We confirm availability for your exact airports and terminals."]] },
];

export const SERVICE_FAQ = [
  ["Can I book these services without a holiday package?", "Yes. Flights, forex, visas, insurance and every other service can be booked on its own. If you also book a holiday with us, we combine them into one quote."],
  ["How do I pay?", "By bank transfer or UPI, as stated in your quote. Forex is paid to the authorised dealer and insurance premiums to the insurer, as their rules require."],
  ["How quickly do you reply?", "Usually the same day on WhatsApp. Urgent flights and last-minute visas are handled first."],
];
