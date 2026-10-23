# GT Holidays: page types

Derived from the crawl of 1340 fetched pages (2026-10-23T18:14:32+00:00). Counts are fetched pages only.

| Page type | Fetched | URL pattern / notes |
|---|---:|---|
| package-detail | 605 | Individual itinerary at `/package/<slug>/` (flat URL, not nested under its destination). Sections: Itinerary, Tour's Location, Reviews. |
| blog-archive | 301 | `/blog/`, `/category/<x>/`, `/tag/<x>/` and their `/page/N/` pagination. |
| package-listing | 181 | Destination or theme listing under `/packages/india/...` or `/packages/international/...` (state, country, region, honeymoon, educational). Each links to package-detail pages. |
| blog-post | 168 | Article at a root-level slug (from post-sitemap.xml). |
| honeymoon-listing | 39 | `/honeymoon-packages/<place>/` landing pages. |
| page | 26 | Other WordPress pages: branch/city office pages (e.g. `/chennai/`), company pages (`/history/`, contact, policies). |
| destination-wedding-listing | 16 | `/destination-wedding/<place>/` landing pages. |
| package-region-hub | 2 | `/packages/india/` and `/packages/international/`: lists of regions, states/countries and themes. |
| home | 1 | Home page: hero search, popular packages, group departures, testimonials, accreditation. |
| package-hub | 1 | `/packages/`: entry point that splits into India and International. |

## Typical sections (most common H2 headings) by type

**package-detail**: Itinerary (605); Tour's Location (605); Reviews (605)

**blog-archive**: When Is The Best Time To Travel To Australia From India (10); Where to Find the Perfect Beaches in the Maldives? (8); 5 Reasons to Visit the Dubai Aquarium (7); Where to Find the top 10 House Reefs in the Maldives? (7); Why Choose House Reef Resorts in the Maldives? (7); Getting Ready for Europe Tour: Four Things to Know (7); How to Travel Around Europe on a Budget (7); Find the Best Maldives Honeymoon Packages from Chennai (7)

**package-listing**: Unique Wildlife (33); Cultural Experiences (33); Top Attractions (32); OUTDOOR ACTIVITIES (23); Popular Packages (14); Table of Content: (2); 8 tours found (1); 14 tours found (1)

**blog-post**: Post navigation (168); Why Choose GT Holidays? (5); Activities (3); Other Essentials (2); Accommodation (2); 3. Kuta (2); 1. Adaaran Select Hudhuran Fushi (2); 2. Biyadhoo Island Resort (2)

**honeymoon-listing**: How to Plan a Honeymoon Trip to India? (3); Why Choose GT Holidays as Your Travel Partner? (2); Planning an International Honeymoon Trip from India (1); India (1); Choosing the Best Honeymoon Packages in India (1); Need Help? We’re Here for You (1); International (1); International Honeymoon Tour Packages at GT Holidays (1)

**page**: Why Choose GT Holidays as Your Travel Agent in Hyderabad? (1); What to Look for in a Travel Agency in Hyderabad? (1); Planning Your Next Holiday? Read This.... (1); How To Choose the Best Travel Agency in Chennai? (1); Why Is GT Holidays the Best Travel Agent in Chennai? (1); What Services GT Holidays Offer in Chennai? (1); How To Choose the Best Travel Agency in Coimbatore? (1); How To Find the Best Tour Operators in Coimbatore? (1)

**destination-wedding-listing**: Tips For a Destination Wedding in Andaman (1); Tips For a Destination Wedding in Goa (1); Jodhpur Destination Wedding Packages (1); Tips for Destination Wedding in Jodhpur (1); Best place for Destination Wedding in Jodhpur (1); Which part of Jodhpur is best for a Destination Wedding? (1); Best resorts to stay in Jodhpur for wedding ceremonies. (1); Welcome hotel Jodhpur (1)

**package-region-hub**: Popular Packages (2); Local Experiences You’ll Love (2); Our happy clients (1)

**home**: Popular Packages (1); Stress-Free Holidays with GT (1); GT Group Departures (1); GT Premium Group Tours (1); Our Happy Clients (1); Trending Tours (1); Daily Deals (1); Accreditation (1)

**package-hub**: 605 tours found (1)

## Example URLs

* **blog-archive**: `/blog/`, `/category/dubai-tour/`, `/tag/dubai-activities/`, `/tag/dubai-travel-packages/`
* **blog-post**: `/five-things-you-didnt-know-about-the-burj-khalifa-dubai/`, `/travelling-to-sri-lanka-from-south-india-essential-tips/`, `/guide-to-bali-tour-packages-money-saving-tips-indian-travellers/`, `/dubai-museums-you-must-visit-at-least-once-in-your-lifetime/`
* **destination-wedding-listing**: `/destination-wedding/india/`, `/destination-wedding/international/`, `/destination-wedding/agra/`, `/destination-wedding/andaman/`
* **home**: `/`
* **honeymoon-listing**: `/honeymoon-packages/international/`, `/honeymoon-packages/kerala/`, `/honeymoon-packages/india/`, `/honeymoon-packages/`
* **package-detail**: `/package/sihanoukville-tour-package/`, `/package/classical-beijing-tour-packages/`, `/package/unveiling-china-super-saver-package-itinerary/`, `/package/unveiling-amazing-hangzhou-tour-packages-at-gt-holidays/`
* **package-hub**: `/packages/`
* **package-listing**: `/packages/international/canada-tour-packages/`, `/packages/international/usa-tour-packages/`, `/packages/india/honeymoon-packages/`, `/packages/international/educational-tour-packages/`
* **package-region-hub**: `/packages/india/`, `/packages/international/`
* **page**: `/hyderabad/`, `/bangalore/`, `/chennai/`, `/coimbatore/`

## Observations used for Nexara's architecture

* Package detail pages use a flat `/package/<slug>/` URL. Nexara nests packages under their destination (`/packages/india/kerala/<slug>/`) so the URL itself carries the hierarchy.
* Listings are organised two ways: by geography (India → state; International → region → country) and by theme (honeymoon, educational, destination wedding). Nexara mirrors this with `/destinations/...` (geography) and `/tour-types/...` (themes).
* Breadcrumbs on listings follow Home → Tour Packages → India/International → [region] → listing; package detail pages use only Home → title. Nexara uses full breadcrumbs on every page.
* Only 110 of 605 package pages state a duration in their title or headings; none show a price in headings. Nexara shows duration on every package and uses quote requests instead of prices.
* The blog has many tag and category archives (thin, near-duplicate listing pages). Nexara uses a small number of topic pages instead of tag archives.
