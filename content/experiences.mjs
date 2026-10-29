// Travel Experiences (/experiences/): five worldwide categories built on one shared discovery system.
// Each category lists "items" (events, hubs, destinations, routes, sailing regions) in one shape:
//   { id, name, country, region, place?, ll, tags, text, ... }  country: a site country slug where one exists,
//   (or a plain country name when the site has no page for it), region: a key of REGIONS, place: a site destination slug used for the photo and link, ll: [lat, lon] for the map.
// Nothing here is a bookable product: prices, availability and operator details are confirmed in a written quote.
// Event dates were checked against organiser sites and trade listings on EVENTS_CHECKED; "status" says how firm each is.

export const EVENTS_CHECKED = "26 October 2026";

export const REGIONS = {
  asia: "Asia", europe: "Europe", "middle-east": "Middle East", africa: "Africa",
  "north-america": "North America", caribbean: "Caribbean", "latin-america": "Central & South America", oceania: "Oceania & Pacific", "indian-ocean": "Indian Ocean islands",
};

// event date status: confirmed by the organiser, listed by trade sources, or not yet announced
export const STATUS = {
  official: "Dates published by the organiser",
  listed: "Dates from trade listings; confirm with the organiser",
  tba: "Next dates not yet announced",
};

/* ---------- 1. Business & Trade Travel ---------- */
const INDUSTRIES = ["Technology & electronics", "Manufacturing & machinery", "Textiles & fashion", "Food & beverage", "Agriculture", "Construction & building", "Healthcare & medical", "Automotive & mobility", "Consumer products & home", "Retail", "Logistics & trade"];

const EVENTS = [
  { id: "canton-fair", place: "china", name: "Canton Fair (China Import and Export Fair)", city: "Guangzhou", country: "china", region: "asia", ll: [23.10, 113.37], tags: ["Technology & electronics", "Manufacturing & machinery", "Consumer products & home", "Textiles & fashion", "Healthcare & medical", "Food & beverage"],
    when: "Spring session (April–May) and autumn session (October–November), each in three phases", status: "tba", sort: "04",
    text: "China's largest trade fair, held twice a year at the Canton Fair Complex in Pazhou. Phase one covers electronics, machinery and vehicles; phase two housewares, gifts and building materials; phase three textiles, fashion, toys, medical and food products. Buyers register online in advance.",
    link: "https://www.cantonfair.org.cn/en-US" },
  { id: "ces", place: "las-vegas", name: "CES", city: "Las Vegas", country: "usa", region: "north-america", ll: [36.13, -115.15], tags: ["Technology & electronics", "Automotive & mobility", "Healthcare & medical"],
    when: "Held every year, usually in January", status: "listed", sort: "01", text: "The Consumer Technology Association's annual technology show, centred on the Las Vegas Convention Center. It is a trade event for industry professionals, and attendees register in advance.", link: "https://www.ces.tech/" },
  { id: "nrf-big-show", place: "new-york", name: "NRF Retail's Big Show", city: "New York", country: "usa", region: "north-america", ll: [40.76, -74.00], tags: ["Retail", "Technology & electronics", "Consumer products & home"],
    when: "Held every year, usually in January", status: "listed", sort: "01", text: "The National Retail Federation's annual expo and conference at the Javits Center, focused on retail technology, store operations and consumer brands.", link: "https://nrfbigshow.nrf.com/" },
  { id: "heimtextil", place: "germany", name: "Heimtextil", city: "Frankfurt", country: "germany", region: "europe", ll: [50.11, 8.65], tags: ["Textiles & fashion", "Consumer products & home"],
    when: "Held every year, usually in January", status: "listed", sort: "01", text: "Messe Frankfurt's international trade fair for home and contract textiles, from bed linen and curtains to upholstery fabrics and textile technology.", link: "https://heimtextil.messefrankfurt.com/" },
  { id: "whx-dubai", place: "dubai", name: "WHX Dubai (formerly Arab Health)", city: "Dubai", country: "uae", region: "middle-east", ll: [24.96, 55.15], tags: ["Healthcare & medical"],
    when: "Held every year, usually in January", status: "official", sort: "01", text: "One of the largest healthcare and medical-device exhibitions in the world, at Dubai Exhibition Centre in Expo City, with labs exhibits at Dubai World Trade Centre.", link: "https://www.worldhealthexpo.com/" },
  { id: "ambiente", place: "germany", name: "Ambiente", city: "Frankfurt", country: "germany", region: "europe", ll: [50.11, 8.65], tags: ["Consumer products & home", "Retail"],
    when: "Held every year, usually in February", status: "official", sort: "02", text: "Messe Frankfurt's consumer goods fair for tableware, kitchen, home décor, gifts and living, held alongside Christmasworld and Creativeworld.", link: "https://ambiente.messefrankfurt.com/" },
  { id: "mwc-barcelona", place: "barcelona", name: "MWC Barcelona", city: "Barcelona", country: "spain", region: "europe", ll: [41.35, 2.13], tags: ["Technology & electronics", "Automotive & mobility"],
    when: "Held every year, usually in March", status: "official", sort: "03", text: "The GSMA's mobile and connectivity event at Fira Barcelona Gran Via, covering telecoms, devices, AI and connected industries.", link: "https://www.mwcbarcelona.com/" },
  { id: "gulfood", place: "dubai", name: "Gulfood", city: "Dubai", country: "uae", region: "middle-east", ll: [25.22, 55.29], tags: ["Food & beverage", "Agriculture"],
    when: "Held every year, usually in March", status: "listed", sort: "03", text: "A major annual food and beverage sourcing show, spread across Dubai World Trade Centre and Dubai Exhibition Centre.", link: "https://www.gulfood.com/" },
  { id: "hannover-messe", place: "germany", name: "Hannover Messe", city: "Hannover", country: "germany", region: "europe", ll: [52.32, 9.81], tags: ["Manufacturing & machinery", "Technology & electronics", "Automotive & mobility"],
    when: "Held every year, usually in April", status: "official", sort: "04", text: "The world's leading industrial technology fair: automation, digital factories, energy and industrial AI.", link: "https://www.hannovermesse.de/en/" },
  { id: "agrishow", place: "brazil", name: "Agrishow", city: "Ribeirão Preto", country: "brazil", region: "latin-america", ll: [-21.18, -47.81], tags: ["Agriculture", "Manufacturing & machinery"],
    when: "Held every year, usually in April", status: "official", sort: "04", text: "Latin America's largest agricultural technology fair, with field demonstrations of machinery, irrigation and agribusiness technology in São Paulo state.", link: "https://www.agrishow.com.br/en/" },
  { id: "saitex", place: "south-africa", name: "SAITEX & Africa's Big 7", city: "Johannesburg", country: "south-africa", region: "africa", ll: [-26.11, 28.05], tags: ["Consumer products & home", "Food & beverage", "Retail"],
    when: "Usually June", status: "tba", sort: "06", text: "Co-located trade shows in Johannesburg for consumer goods, hardware and food and beverage, used by exporters as a gateway to southern African markets." },
  { id: "fine-food-australia", place: "sydney", name: "Fine Food Australia", city: "Sydney / Melbourne", country: "australia", region: "oceania", ll: [-33.87, 151.20], tags: ["Food & beverage"],
    when: "Usually late August or early September; alternates between Sydney and Melbourne", status: "tba", sort: "09", text: "Australia's major food service and hospitality trade show, for food, beverage, bakery and equipment suppliers.", link: "https://finefoodaustralia.com.au/" },
  { id: "metalex", place: "bangkok", name: "METALEX", city: "Bangkok", country: "thailand", region: "asia", ll: [13.67, 100.61], tags: ["Manufacturing & machinery", "Automotive & mobility"],
    when: "Held every year, usually in November", status: "official", sort: "11", text: "Southeast Asia's machine tool and metalworking show at BITEC Bangkok, with more than 3,000 brands from around 50 countries.", link: "https://www.metalex.co.th/" },
  { id: "big5-global", place: "dubai", name: "Big 5 Global", city: "Dubai", country: "uae", region: "middle-east", ll: [25.22, 55.29], tags: ["Construction & building"],
    when: "Held every year, usually in November", status: "official", sort: "11", text: "The Middle East's largest construction event at Dubai World Trade Centre: building materials, MEP, concrete, urban design and construction technology.", link: "https://www.big5global.com/" },
];

// industrial clusters: each lists only what the place is actually known for
const HUBS = [
  { id: "shenzhen", name: "Shenzhen", country: "china", region: "asia", ll: [22.54, 114.06], tags: ["Technology & electronics", "Manufacturing & machinery"], text: "Electronics and hardware manufacturing, component markets around Huaqiangbei and fast prototyping." },
  { id: "yiwu", name: "Yiwu", country: "china", region: "asia", ll: [29.31, 120.08], tags: ["Consumer products & home", "Retail"], text: "Small-commodity wholesale at Yiwu International Trade City: toys, stationery, accessories, festive goods and household items." },
  { id: "foshan", name: "Foshan", country: "china", region: "asia", ll: [23.02, 113.12], tags: ["Consumer products & home", "Construction & building"], text: "Furniture (Lecong), ceramics, lighting and home appliances, close to Guangzhou and the Canton Fair." },
  { id: "aichi", name: "Nagoya & Aichi", country: "japan", region: "asia", ll: [35.18, 136.91], tags: ["Automotive & mobility", "Manufacturing & machinery"], text: "Japan's automotive and aerospace heartland, with machine-tool makers and factory and museum visits." },
  { id: "hsinchu", name: "Hsinchu", country: "taiwan", region: "asia", ll: [24.80, 120.97], tags: ["Technology & electronics"], text: "Hsinchu Science Park, the centre of Taiwan's semiconductor and electronics industry." },
  { id: "ulsan", name: "Ulsan", country: "south-korea", region: "asia", ll: [35.54, 129.31], tags: ["Automotive & mobility", "Manufacturing & machinery"], text: "Automotive, shipbuilding and petrochemical industries on Korea's southeast coast." },
  { id: "binh-duong", name: "Ho Chi Minh City & Binh Duong", country: "vietnam", region: "asia", ll: [10.98, 106.65], tags: ["Textiles & fashion", "Consumer products & home", "Technology & electronics"], text: "Garments, footwear, furniture and electronics assembly in industrial parks north of Ho Chi Minh City." },
  { id: "eastern-seaboard", name: "Bangkok & the Eastern Seaboard", country: "thailand", region: "asia", ll: [13.08, 100.92], tags: ["Automotive & mobility", "Manufacturing & machinery"], text: "Thailand's automotive and industrial belt in Chonburi and Rayong, with Laem Chabang port." },
  { id: "tiruppur", name: "Tiruppur", country: "india", region: "asia", ll: [11.11, 77.34], tags: ["Textiles & fashion"], text: "India's knitwear and garment export cluster in Tamil Nadu, a short drive from Coimbatore." },
  { id: "jebel-ali", name: "Dubai & Jebel Ali", country: "uae", region: "middle-east", ll: [25.01, 55.06], tags: ["Logistics & trade", "Retail"], text: "Jebel Ali port and free zone, the Gulf's main re-export and logistics hub." },
  { id: "istanbul", name: "Istanbul", country: "turkey", region: "europe", ll: [41.01, 28.98], tags: ["Textiles & fashion", "Consumer products & home"], text: "Textiles, apparel and home textiles, with wholesale districts and manufacturers across the city." },
  { id: "stuttgart", name: "Stuttgart", country: "germany", region: "europe", ll: [48.78, 9.18], tags: ["Automotive & mobility", "Manufacturing & machinery"], text: "Automotive and mechanical engineering in Baden-Württemberg, home of major carmakers and their museums." },
  { id: "milan", name: "Milan & Lombardy", country: "italy", region: "europe", ll: [45.46, 9.19], tags: ["Textiles & fashion", "Consumer products & home", "Manufacturing & machinery"], text: "Fashion, furniture and design, plus one of Europe's densest machinery-manufacturing regions." },
  { id: "rotterdam", name: "Rotterdam", country: "netherlands", region: "europe", ll: [51.95, 4.14], tags: ["Logistics & trade"], text: "Europe's largest seaport and a hub for logistics, distribution and agrifood trade." },
  { id: "detroit", name: "Detroit", country: "usa", region: "north-america", ll: [42.33, -83.05], tags: ["Automotive & mobility"], text: "The traditional centre of the US auto industry, now also of mobility and EV development." },
  { id: "silicon-valley", name: "Silicon Valley", country: "usa", region: "north-america", ll: [37.39, -122.03], tags: ["Technology & electronics"], text: "Technology companies, start-ups and venture investors across the San Francisco Bay Area." },
  { id: "monterrey", name: "Monterrey", country: "mexico", region: "latin-america", ll: [25.69, -100.32], tags: ["Manufacturing & machinery", "Automotive & mobility", "Consumer products & home"], text: "A major manufacturing centre in northern Mexico for automotive parts, appliances and steel." },
  { id: "sao-paulo", name: "São Paulo", country: "brazil", region: "latin-america", ll: [-23.55, -46.63], tags: ["Manufacturing & machinery", "Consumer products & home", "Agriculture"], text: "Brazil's business capital, with industry, consumer goods and agribusiness headquarters." },
  { id: "johannesburg", name: "Johannesburg", country: "south-africa", region: "africa", ll: [-26.20, 28.05], tags: ["Manufacturing & machinery", "Retail"], text: "Southern Africa's commercial centre, with mining equipment, manufacturing and retail distribution." },
  { id: "perth", name: "Perth", country: "australia", region: "oceania", ll: [-31.95, 115.86], tags: ["Manufacturing & machinery"], text: "Mining technology, resources and energy services for Western Australia." },
];

/* ---------- 2. Roots, Heritage & Cultural Journeys ---------- */
const HERITAGE = [
  { id: "ireland", name: "Ireland", country: "ireland", place: "ireland", region: "europe", ll: [53.35, -6.26], tags: ["Family history", "Historic towns", "Ancestral villages"], text: "Parish records, national archives and county heritage centres help many families trace Irish ancestors, then visit the townlands they came from." },
  { id: "scotland", name: "Scotland", country: "united-kingdom", place: "scottish-highlands", region: "europe", ll: [57.48, -4.22], tags: ["Family history", "Historic towns", "Festivals"], text: "Clan lands, castles and Highland villages, with family-history research at national and local archives." },
  { id: "italy-villages", name: "Italy's ancestral villages", country: "italy", place: "italy", region: "europe", ll: [40.85, 14.27], tags: ["Ancestral villages", "Food & traditions", "Family reunions"], text: "Many Italian families trace their roots to small hill towns in the south; town-hall and parish records can lead you back to the family home." },
  { id: "greece-islands", name: "Greek islands and villages", country: "greece", place: "greece", region: "europe", ll: [37.98, 23.73], tags: ["Ancestral villages", "Festivals", "Food & traditions"], text: "Island and mainland villages with name-day festivals, family tavernas and churches that keep generations of records." },
  { id: "scandinavia", name: "Norway and Sweden", country: "norway", place: "norway", region: "europe", ll: [59.91, 10.75], tags: ["Family history", "Historic towns"], text: "Emigrant museums and digitised church records help descendants of Scandinavian emigrants find farms and parishes." },
  { id: "armenia", name: "Armenia", country: "armenia", place: "armenia", region: "europe", ll: [40.18, 44.51], tags: ["Places of worship", "Historic towns", "Family history"], text: "Ancient monasteries, Yerevan's museums and memorials, and journeys for Armenian families connecting with their heritage." },
  { id: "kerala-roots", name: "Kerala", country: "india", place: "kerala", region: "asia", ll: [10.52, 76.21], tags: ["Ancestral villages", "Places of worship", "Food & traditions", "Family reunions"], text: "Ancestral tharavad homes, family temples, churches and mosques, and backwater villages, for Malayali families returning from the Gulf and beyond." },
  { id: "punjab-gujarat", name: "Punjab and Gujarat", country: "india", place: "punjab", region: "asia", ll: [31.63, 74.87], tags: ["Ancestral villages", "Places of worship", "Family reunions"], text: "Home districts of large diaspora communities, with village visits, gurdwaras and temples, and family celebrations." },
  { id: "fujian-guangdong", name: "Fujian and Guangdong", country: "china", place: "china", region: "asia", ll: [22.38, 112.69], tags: ["Ancestral villages", "Historic towns"], text: "Ancestral halls and qiaoxiang villages of the Chinese diaspora, including the UNESCO-listed Kaiping diaolou towers." },
  { id: "japan-heritage", name: "Kyoto, Nara and rural Japan", country: "japan", place: "kyoto", region: "asia", ll: [35.01, 135.77], tags: ["Historic towns", "Festivals", "Places of worship"], text: "Temple towns, preserved merchant districts and seasonal matsuri festivals, with family visits arranged where relatives still live." },
  { id: "malaysia-singapore", name: "Penang, Malacca and Singapore", country: "malaysia", place: "penang", region: "asia", ll: [5.41, 100.33], tags: ["Historic towns", "Food & traditions", "Places of worship"], text: "Chinese clan houses, Tamil and Malay heritage districts and shophouse streets shaped by centuries of migration." },
  { id: "sri-lanka-north", name: "Sri Lanka", country: "sri-lanka", place: "sri-lanka", region: "asia", ll: [9.66, 80.02], tags: ["Ancestral villages", "Places of worship", "Family reunions"], text: "Jaffna's temples and villages, the hill country and Colombo, for Sri Lankan families visiting home districts." },
  { id: "mauritius-girmit", name: "Mauritius", country: "mauritius", place: "mauritius", region: "indian-ocean", ll: [-20.16, 57.50], tags: ["Family history", "Historic towns", "Places of worship"], text: "Aapravasi Ghat, the UNESCO-listed immigration depot in Port Louis, where indentured labourers arrived from India, and the island's Indian heritage today." },
  { id: "fiji-girmit", name: "Fiji", country: "fiji", place: "fiji", region: "oceania", ll: [-18.14, 178.44], tags: ["Family history", "Ancestral villages", "Festivals"], text: "Indo-Fijian girmit history, iTaukei village visits with respect for local custom, and the old capital of Levuka, a UNESCO site." },
  { id: "south-africa-heritage", name: "South Africa", country: "south-africa", place: "south-africa", region: "africa", ll: [-29.86, 31.02], tags: ["Family history", "Historic towns", "Places of worship"], text: "The Indian heritage of Durban and KwaZulu-Natal, Johannesburg's history museums, and Cape Town's layered colonial past." },
  { id: "morocco-medinas", name: "Morocco", country: "morocco", place: "morocco", region: "africa", ll: [34.03, -5.00], tags: ["Historic towns", "Food & traditions", "Places of worship"], text: "Fes and Marrakech medinas, crafts passed down in families, and Amazigh mountain villages." },
  { id: "peru-andes", name: "Peru's Andes", country: "peru", place: "peru", region: "latin-america", ll: [-13.53, -71.97], tags: ["Historic towns", "Festivals", "Food & traditions"], text: "Cusco and the Sacred Valley, Quechua weaving communities and festivals such as Inti Raymi in June." },
  { id: "mexico-traditions", name: "Mexico", country: "mexico", place: "mexico", region: "latin-america", ll: [17.07, -96.72], tags: ["Festivals", "Food & traditions", "Historic towns"], text: "Oaxaca's markets and kitchens, colonial towns and Día de Muertos family traditions at the start of November." },
  { id: "usa-ellis", name: "New York and the United States", country: "usa", place: "new-york", region: "north-america", ll: [40.70, -74.04], tags: ["Family history", "Historic towns"], text: "Ellis Island and its passenger records, plus the neighbourhoods and towns where immigrant families first settled." },
];

// Tamil Nadu leads the roots page: its historic regions, each with towns (site destination slugs), what to explore and when.
// Nexara arranges the travel, Tamil-speaking guides and stays; contact with relatives, temples and record offices goes through the family.
export const TN_ROOTS = {
  intro: "For Tamil families in Malaysia, Singapore, Sri Lanka, Mauritius, Fiji, South Africa, the Gulf, Europe and North America, and for families within India, a roots journey often means finding the native village (ooru), visiting the family deity's temple (kula deivam) and meeting relatives. We plan it region by region, with drivers and guides who speak Tamil.",
  help: ["Travel to your native village with a Tamil-speaking driver-guide", "Visits to your kula deivam temple, with poojas booked through the temple office", "Family reunions, with stays and transport for every generation", "Trips timed for Pongal, temple festivals and family occasions", "Local food, crafts and the stories of each region"],
  // photo: the tab's main picture (a site photo key, or a topic key from content/photo-topics.json); tall: a portrait photo, shown whole
  // sights: [caption, photo key, fit?] for the small gallery under the main picture
  areas: [
    { id: "chennai-thondai", name: "Chennai & Thondai Nadu", short: "Chennai, Kanchipuram, Mahabalipuram, Tiruvannamalai", photo: "chennai--kapaleeshwarar-temple", ll: [12.83, 79.70], towns: [["Chennai", "chennai"], ["Kanchipuram", "kanchipuram"], ["Mahabalipuram", "mahabalipuram"], ["Tiruvannamalai", "tiruvannamalai"]],
      text: "The northern region around Chennai: old Mylapore and George Town, Marina Beach and Valluvar Kottam, the Pallava temples of Kanchipuram and Mahabalipuram, and inland forts and temple towns such as Vellore, Gingee and Tiruvannamalai.",
      explore: ["Mylapore's Kapaleeshwarar temple and tank", "An evening on Marina Beach", "Valluvar Kottam, the stone-chariot memorial to Thiruvalluvar", "Shore Temple and Arjuna's Penance at Mahabalipuram", "Kanchipuram's silk-weaving streets and temples", "Gingee Fort and girivalam at Tiruvannamalai"], when: "December–January brings Chennai's music and dance season; Karthigai Deepam at Tiruvannamalai falls in November or December.",
      sights: [["Marina Beach, Chennai", "chennai--marina-beach"], ["Valluvar Kottam, Chennai", "tn-valluvar-kottam"], ["Shore Temple, Mahabalipuram", "mahabalipuram--shore-temple"], ["Arjuna's Penance, Mahabalipuram", "mahabalipuram--arjuna-s-penance", 1], ["Kailasanathar Temple, Kanchipuram", "kanchipuram--kailasanathar-temple"], ["Gingee Fort", "tn-gingee"]] },
    { id: "chola-nadu", name: "Chola Nadu: the Kaveri delta", short: "Thanjavur, Kumbakonam, Trichy, Chidambaram", photo: "thanjavur--brihadeeswarar-temple", ll: [10.85, 79.30], towns: [["Thanjavur", "thanjavur"], ["Kumbakonam", "kumbakonam"], ["Tiruchirappalli", "tiruchirappalli"], ["Chidambaram", "chidambaram"]],
      text: "The rice bowl of Tamil Nadu and heartland of the Cholas: the great living Chola temples, temple towns, agraharam streets and delta villages where many families trace their ancestors.",
      explore: ["Brihadeeswarar Temple in Thanjavur", "Airavatesvara Temple at Darasuram", "Srirangam and Thiruvanaikaval in Trichy", "Thillai Nataraja Temple, Chidambaram", "Bronze casting at Swamimalai", "Thanjavur paintings and veena makers"], when: "The Thyagaraja Aradhana music festival at Thiruvaiyaru is in January; Pongal is in mid-January.",
      sights: [["Airavatesvara Temple, Darasuram", "kumbakonam--airavatesvara-temple-darasuram"], ["Srirangam, Trichy", "tiruchirappalli--sri-ranganathaswamy-temple-srirangam"], ["Thiruvanaikaval, Trichy", "tiruchirappalli--jambukeswarar-temple-thiruvanaikaval"], ["Thillai Nataraja Temple, Chidambaram", "chidambaram--thillai-nataraja-temple"], ["Navagraha temples, Kumbakonam", "kumbakonam--navagraha-temples"], ["Thanjavur Royal Palace", "thanjavur--thanjavur-royal-palace"]] },
    { id: "pandya-nadu", name: "Pandya Nadu: Madurai and the south", short: "Madurai, Rameswaram, Tirunelveli, Tiruchendur", photo: "madurai--meenakshi-amman-temple", ll: [9.30, 78.10], towns: [["Madurai", "madurai"], ["Rameswaram", "rameswaram"], ["Tiruchendur", "tiruchendur"]],
      text: "The old Pandya country, from Madurai's Meenakshi temple to the coast at Rameswaram and Tiruchendur, with Tirunelveli's temples, the Courtallam falls and family shrines across the dry south.",
      explore: ["Meenakshi Amman Temple and Madurai's old streets", "Rameswaram, the Pamban bridge and Dhanushkodi", "Tiruchendur's seashore Murugan temple", "Nellaiappar Temple in Tirunelveli", "Courtallam falls in the monsoon", "Village festivals and family deity temples"], when: "The Chithirai festival in Madurai is in April–May; Courtallam's falls run best from June to September.",
      sights: [["Mariamman Teppakulam, Madurai", "madurai"], ["Ramanathaswamy Temple, Rameswaram", "rameswaram--ramanathaswamy-temple"], ["Pamban Bridge, Rameswaram", "rameswaram--pamban-bridge"], ["Subramaniya Swamy Temple, Tiruchendur", "tiruchendur--arulmigu-subramaniya-swamy-temple"], ["Nellaiappar Temple, Tirunelveli", "tn-nellaiappar"], ["Courtallam falls", "tn-courtallam"]] },
    { id: "nanjil-nadu", name: "Nanjil Nadu: Kanyakumari", short: "Kanyakumari, Nagercoil, Suchindram, Padmanabhapuram", photo: "kanyakumari", ll: [8.18, 77.41], towns: [["Kanyakumari", "kanyakumari"], ["Thiruvananthapuram", "thiruvananthapuram"]],
      text: "The green southern tip of India, where three seas meet: paddy fields under the Western Ghats, Nagercoil's temples and churches, and a mix of Tamil and Travancore heritage seen best at Suchindram and Padmanabhapuram Palace.",
      explore: ["Sunrise and sunset at Kanyakumari", "The Thiruvalluvar Statue and Vivekananda Rock Memorial", "Suchindram's Thanumalayan Temple", "Padmanabhapuram Palace, the old Travancore seat", "Nagercoil's temples and churches", "Nanjil Nadu cooking and paddy-field villages"], when: "October to March; Chithra Pournami, the full moon of April–May, brings a famous moonrise and sunset together at Kanyakumari.",
      sights: [["Thiruvalluvar Statue, Kanyakumari", "kanyakumari--thiruvalluvar-statue", 1], ["Vivekananda Rock Memorial", "kanyakumari--vivekananda-rock-memorial"], ["Thanumalayan Temple, Suchindram", "tn-suchindram"], ["Padmanabhapuram Palace", "tn-padmanabhapuram"]] },
    { id: "kongu-nadu", name: "Kongu Nadu: the west", short: "Coimbatore, Tiruppur, Erode, Salem, Palani", photo: "coimbatore--adiyogi-shiva-statue-isha-yoga-centre", ll: [11.02, 77.30], towns: [["Coimbatore", "coimbatore"], ["Palani", "palani"], ["Valparai", "valparai"], ["Yercaud", "yercaud"]],
      text: "The western uplands of textile towns, farming villages and hill temples, with its own Kongu cuisine and long family histories in Coimbatore, Tiruppur, Erode and Salem, and the Kaveri falling through Hogenakkal on its way in.",
      explore: ["Adiyogi at the Isha Yoga Centre", "Marudhamalai and Perur temples near Coimbatore", "Palani's hilltop Murugan temple", "Hogenakkal falls and coracle rides", "Valparai's tea estates and Aliyar dam", "Kongu home cooking and farm visits"], when: "October to March; Thai Poosam at Palani is in January or February.",
      sights: [["Marudhamalai Temple, Coimbatore", "coimbatore--marudhamalai-temple"], ["Perur Patteeswarar Temple", "tn-perur"], ["Dhandayuthapani Temple, Palani", "palani--dhandayuthapani-swamy-temple"], ["Hogenakkal falls", "tn-hogenakkal"], ["Aliyar Dam, Valparai", "valparai--aliyar-dam"], ["Yercaud Lake", "yercaud--yercaud-lake", 1]] },
    { id: "chera-nadu", name: "Chera Nadu: Sabarimala and the Ghats", short: "Sabarimala, Thiruvananthapuram, Guruvayur", state: "Kerala", photo: "tn-ayyappan", tall: 1, ll: [9.43, 77.08], towns: [["Sabarimala", "sabarimala"], ["Thiruvananthapuram", "thiruvananthapuram"], ["Guruvayur", "guruvayur"]],
      text: "Across the Western Ghats from Kongu and Nanjil Nadu lies the old Chera country, now Kerala. Every Mandalam season Tamil families take the vow and climb to Swami Ayyappan at Sabarimala, and many return through the temples of Thiruvananthapuram and Guruvayur.",
      explore: ["The Sabarimala pilgrimage and the 18 holy steps", "Sree Padmanabhaswamy Temple, Thiruvananthapuram", "Guruvayur's Krishna temple", "Periyar and Thekkady on the way through the Ghats", "Travel and stays arranged around your vratham"], when: "The Mandala–Makaravilakku season runs from mid-November to mid-January; the temple also opens for the first days of each Malayalam month.",
      sights: [["The 18 holy steps, Sabarimala", "tn-sabari-steps"], ["Sree Padmanabhaswamy Temple", "thiruvananthapuram--sree-padmanabhaswamy-temple"], ["Guruvayur", "guruvayur"], ["Sannidhanam, Sabarimala", "sabarimala"]] },
    { id: "chettinad", name: "Chettinad", short: "Karaikudi, Kanadukathan, Athangudi", photo: "chettinad--chettinad-mansions-of-kanadukathan", ll: [10.07, 78.78], towns: [["Chettinad", "chettinad"], ["Madurai", "madurai"]],
      text: "The home villages of the Nattukottai Chettiars, whose trading families went to Burma, Malaya, Ceylon and Saigon and built grand mansions back home. Many diaspora families return here to find the family house.",
      explore: ["Mansions of Kanadukathan and Karaikudi", "Athangudi tile workshops", "Pillayarpatti cave temple", "Chettinad cooking in a family kitchen", "Antique and kandangi sari markets"], when: "October to March is most comfortable; many families return for weddings and temple festivals." },
    { id: "hills", name: "The hills: Nilgiris, Kodaikanal and Yercaud", short: "Ooty, Coonoor, Kotagiri, Kodaikanal, Yercaud", photo: "ooty--nilgiri-mountain-railway", ll: [11.40, 76.70], towns: [["Ooty", "ooty"], ["Coonoor", "coonoor"], ["Kodaikanal", "kodaikanal"], ["Yercaud", "yercaud"]],
      text: "Hill towns with tea estates, old schools and churches, and the Badaga and Toda communities of the Nilgiris, whose villages are visited only with local guides and respect for their customs.",
      explore: ["Nilgiri Mountain Railway, a UNESCO site", "Tea estates and factories", "Hill-station schools and churches families attended", "Badaga village visits with local guides", "Kodaikanal's lake and forest walks"], when: "March to June and September to November; the monsoon is heavy from June to August.",
      sights: [["Doddabetta Peak, Ooty", "ooty--doddabetta-peak"], ["Dolphin's Nose, Coonoor", "coonoor--dolphin-s-nose"], ["Kodaikanal Lake", "kodaikanal--kodaikanal-lake"], ["Government Botanical Garden, Ooty", "ooty--government-botanical-garden"]] },
    { id: "coromandel", name: "The Coromandel coast", short: "Nagapattinam, Velankanni, Nagore, Tharangambadi, Puducherry", photo: "velankanni--basilica-of-our-lady-of-good-health", ll: [10.90, 79.84], towns: [["Velankanni", "velankanni"], ["Puducherry", "puducherry"], ["Chidambaram", "chidambaram"]],
      text: "A coast of many faiths and trading histories: Velankanni's basilica, the Nagore Dargah, the Danish fort at Tharangambadi and French Puducherry, home to old Tamil Christian, Muslim and Hindu families.",
      explore: ["Velankanni Basilica and Nagore Dargah", "Fort Dansborg at Tharangambadi", "Puducherry's French and Tamil quarters", "Fishing villages and coastal temples", "Boat rides through the Pichavaram mangroves"], when: "December to March; the Velankanni feast falls in late August and early September, and the Nagore Kandoori festival follows the Islamic calendar.",
      sights: [["Nagore Dargah", "tn-nagore"], ["Fort Dansborg, Tharangambadi", "tn-tharangambadi"], ["Promenade Beach, Puducherry", "puducherry--promenade-beach"], ["Pichavaram mangroves", "tn-pichavaram"]] },
  ],
};

const HERITAGE_TYPES = [
  ["Ancestral hometown and village visits", "Find the street, temple, church or farm your family came from, with a local guide and translator where needed."],
  ["Family heritage and genealogy journeys", "Visits planned around archives, registry offices and heritage centres, with time to explore what you find."],
  ["Family reunions and multi-generation trips", "Pacing, rooms and transport that work for grandparents, parents and children travelling together."],
  ["Traditional communities and rural stays", "Homestays and village visits arranged with community operators, on their terms."],
  ["Historic neighbourhoods and architecture", "Old towns, mansions, forts and preserved districts, explained by local historians."],
  ["Festivals and local traditions", "Trips timed for harvest festivals, religious celebrations and family events."],
  ["Regional food and cooking", "Markets, home kitchens and cooking sessions that pass on family recipes."],
  ["Pilgrimage and spiritual journeys", "For travellers who want them; see our Sacred journeys for faith pilgrimages."],
];

/* ---------- 3. Worldwide Educational Trips ---------- */
const SUBJECTS = ["Science & space", "Technology & robotics", "History & heritage", "Art & architecture", "Environment & wildlife", "Marine science", "Geography & geology", "Sustainability & agriculture", "Industry & business", "Language & culture", "University visits"];
const AGES = ["Primary (8–11)", "Secondary (12–15)", "Senior school (16–18)", "College & university", "Teachers & professionals"];

const EDU = [
  { id: "florida-space", name: "Space science in Florida", country: "usa", place: "orlando", region: "north-america", ll: [28.52, -80.68], tags: ["Science & space", "Technology & robotics"], ages: ["Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "7–9", text: "Kennedy Space Center Visitor Complex, science museums and theme-park physics days around Orlando." },
  { id: "tokyo-tech", name: "Technology and robotics in Japan", country: "japan", place: "tokyo", region: "asia", ll: [35.62, 139.78], tags: ["Technology & robotics", "Science & space", "Language & culture"], ages: ["Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "7–8", text: "Tokyo's science museums such as Miraikan, rail and robotics technology, and Kyoto for traditional culture." },
  { id: "singapore-innovation", name: "Science and sustainability in Singapore", country: "singapore", place: "singapore", region: "asia", ll: [1.33, 103.74], tags: ["Science & space", "Sustainability & agriculture", "Environment & wildlife"], ages: ["Primary (8–11)", "Secondary (12–15)", "Senior school (16–18)"], days: "4–6", text: "Science Centre Singapore, Gardens by the Bay, water management at NEWater and wildlife parks; short flights from India." },
  { id: "london-museums", name: "History and museums in London", country: "united-kingdom", place: "london", region: "europe", ll: [51.52, -0.13], tags: ["History & heritage", "Science & space", "University visits"], ages: ["Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "7–10", text: "The British Museum, Natural History and Science Museums, Greenwich and university-town visits to Oxford or Cambridge." },
  { id: "rome-florence", name: "Classical history and art in Italy", country: "italy", place: "rome", region: "europe", ll: [41.90, 12.49], tags: ["History & heritage", "Art & architecture"], ages: ["Senior school (16–18)", "College & university"], days: "7–9", text: "Ancient Rome and Pompeii, Renaissance Florence and the Uffizi, with art-history guides." },
  { id: "egypt-ancient", name: "Ancient civilisations in Egypt", country: "egypt", place: "egypt", region: "africa", ll: [29.98, 31.13], tags: ["History & heritage", "Geography & geology"], ages: ["Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "6–8", text: "The Giza pyramids and the Grand Egyptian Museum, then Luxor's temples and the Valley of the Kings." },
  { id: "kenya-wildlife", name: "Wildlife conservation in Kenya", country: "kenya", place: "kenya", region: "africa", ll: [-1.50, 35.10], tags: ["Environment & wildlife"], ages: ["Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "7–9", text: "Game drives in the Masai Mara and conservation talks in Nairobi on wildlife protection and community conservancies." },
  { id: "costa-rica-ecology", name: "Rainforest ecology in Costa Rica", country: "costa-rica", place: "costa-rica", region: "latin-america", ll: [10.30, -84.80], tags: ["Environment & wildlife", "Sustainability & agriculture"], ages: ["Senior school (16–18)", "College & university"], days: "8–10", text: "Cloud-forest reserves, volcano landscapes, sustainable coffee farms and biodiversity field days." },
  { id: "cairns-reef", name: "Marine science on the Great Barrier Reef", country: "australia", place: "cairns", region: "oceania", ll: [-16.92, 145.77], tags: ["Marine science", "Environment & wildlife"], ages: ["Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "6–8", text: "Reef trips with marine educators, the Daintree rainforest and reef conservation programmes from Cairns." },
  { id: "iceland-geology", name: "Volcanoes and glaciers in Iceland", country: "iceland", place: "iceland", region: "europe", ll: [64.15, -21.94], tags: ["Geography & geology", "Environment & wildlife"], ages: ["Senior school (16–18)", "College & university"], days: "6–8", text: "Geothermal power, tectonic rift valleys, glaciers and waterfalls on the Golden Circle and south coast." },
  { id: "barcelona-architecture", name: "Architecture in Barcelona", country: "spain", place: "barcelona", region: "europe", ll: [41.40, 2.17], tags: ["Art & architecture", "Language & culture"], ages: ["Senior school (16–18)", "College & university"], days: "5–7", text: "Gaudí's Sagrada Família and Park Güell, the Eixample's urban grid and modern waterfront design." },
  { id: "dubai-future", name: "Innovation and design in Dubai", country: "uae", place: "dubai", region: "middle-east", ll: [25.22, 55.28], tags: ["Art & architecture", "Technology & robotics", "Industry & business"], ages: ["Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "4–5", text: "The Museum of the Future, Burj Khalifa engineering and desert ecology, a short flight from India." },
  { id: "netherlands-water", name: "Water and agriculture in the Netherlands", country: "netherlands", place: "netherlands", region: "europe", ll: [52.00, 4.30], tags: ["Sustainability & agriculture", "Geography & geology", "University visits"], ages: ["Senior school (16–18)", "College & university"], days: "6–8", text: "Dutch water management and flood defences, greenhouse horticulture and university campuses." },
  { id: "germany-industry", name: "Engineering and industry in Germany", country: "germany", place: "germany", region: "europe", ll: [48.79, 9.23], tags: ["Industry & business", "Technology & robotics", "University visits"], ages: ["Senior school (16–18)", "College & university", "Teachers & professionals"], days: "7–9", text: "Stuttgart's automotive museums, Munich's Deutsches Museum and technical university visits." },
  { id: "paris-culture", name: "French language and culture in Paris", country: "france", place: "paris", region: "europe", ll: [48.86, 2.35], tags: ["Language & culture", "Art & architecture", "History & heritage"], ages: ["Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "6–8", text: "Language sessions, the Louvre and Musée d'Orsay, and day trips to Versailles." },
  { id: "andaman-history", name: "Freedom struggle and wartime history in the Andamans", country: "india", place: "port-blair", region: "asia", ll: [11.67, 92.75], tags: ["History & heritage", "Industry & business"], ages: ["Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "4–5", text: "The Cellular Jail and its evening light-and-sound show, the British-era ruins and Japanese Second World War bunkers on Ross Island (Netaji Subhas Chandra Bose Dweep), Viper Island's old jail, Chatham Saw Mill and Port Blair's Anthropological, Samudrika Naval Marine and Fisheries museums." },
  { id: "andaman-marine", name: "Marine science and geology in the Andamans", country: "india", place: "havelock", region: "asia", ll: [12.00, 92.98], tags: ["Marine science", "Geography & geology", "Environment & wildlife"], ages: ["Primary (8–11)", "Secondary (12–15)", "Senior school (16–18)", "College & university"], days: "5–6", text: "Coral reefs by glass-bottom boat and snorkel at Mahatma Gandhi Marine National Park in Wandoor, the limestone caves, mud volcano and mangrove creeks of Baratang, and reef ecology on Havelock Island." },
  { id: "india-heritage-science", name: "Heritage and science in India", country: "india", place: "delhi", region: "asia", ll: [28.61, 77.21], tags: ["History & heritage", "Science & space", "Language & culture"], ages: ["Primary (8–11)", "Secondary (12–15)", "Senior school (16–18)"], days: "4–6", text: "Delhi's museums and monuments, the Taj Mahal and Jaipur's Jantar Mantar observatory, for domestic and visiting school groups." },
];

/* ---------- 4. International Cruise Holidays ---------- */
const CRUISE_STYLES = ["Ocean", "River", "Coastal", "Island hopping", "Expedition", "Luxury", "Family", "Couples", "Group", "Short getaway", "Cruise + land"];

const CRUISE = [
  { id: "mediterranean", name: "Mediterranean", country: "italy", place: "santorini", region: "europe", ll: [41.38, 2.18], ports: ["Barcelona", "Civitavecchia (Rome)", "Piraeus (Athens)", "Venice area"], season: "Main season about April to November; some western Mediterranean sailings year-round", tags: ["Ocean", "Island hopping", "Family", "Couples", "Luxury", "Cruise + land"], text: "Rome, the Greek islands, Barcelona and the Riviera on week-long sailings, easy to combine with time on land in Europe." },
  { id: "northern-europe", name: "Norwegian fjords & Northern Europe", country: "norway", place: "norway", region: "europe", ll: [60.39, 5.32], ports: ["Southampton", "Copenhagen", "Kiel", "Bergen"], season: "Mostly May to September", tags: ["Ocean", "Coastal", "Couples", "Luxury"], text: "Fjord villages, glaciers and Baltic and Scandinavian capitals in the long summer days." },
  { id: "caribbean", name: "Caribbean", country: "usa", place: "usa", region: "caribbean", ll: [25.77, -80.18], ports: ["Miami", "Fort Lauderdale", "Port Canaveral", "San Juan"], season: "Year-round; hurricane season runs June to November", tags: ["Ocean", "Island hopping", "Family", "Couples", "Short getaway"], text: "Beach islands, private cruise-line islands and big resort ships, often combined with Florida's theme parks." },
  { id: "alaska", name: "Alaska", country: "usa", place: "alaska", region: "north-america", ll: [47.61, -122.33], ports: ["Seattle", "Vancouver"], season: "About May to September", tags: ["Ocean", "Expedition", "Couples", "Cruise + land"], text: "The Inside Passage, glaciers and whales, with land extensions to Denali." },
  { id: "southeast-asia", name: "Southeast Asia", country: "singapore", place: "singapore", region: "asia", ll: [1.26, 103.82], ports: ["Singapore", "Port Klang", "Phuket", "Ho Chi Minh City"], season: "Many sailings from Singapore through the year", tags: ["Ocean", "Short getaway", "Family", "Group"], text: "Short sailings from Singapore to Malaysia and Thailand, popular with first-time cruisers from India." },
  { id: "east-asia", name: "Japan & East Asia", country: "japan", place: "japan", region: "asia", ll: [35.44, 139.64], ports: ["Yokohama (Tokyo)", "Kobe", "Busan", "Shanghai"], season: "Spring (cherry blossom) and autumn are the busiest seasons", tags: ["Ocean", "Couples", "Cruise + land"], text: "Japanese ports, Korean cities and Chinese coastal capitals, with cherry blossom and autumn-colour itineraries." },
  { id: "arabian-gulf", name: "Arabian Gulf", country: "uae", place: "dubai", region: "middle-east", ll: [25.27, 55.28], ports: ["Dubai", "Abu Dhabi", "Doha"], season: "Roughly November to March", tags: ["Ocean", "Family", "Short getaway"], text: "Dubai, Abu Dhabi, Doha and Oman's fjord-like Musandam in the cooler months." },
  { id: "india-coast", name: "India's coast", country: "india", place: "goa", region: "asia", ll: [13.08, 80.29], ports: ["Mumbai", "Chennai", "Kochi", "Goa"], season: "Domestic sailings run in the dry months; routes and ports change by season", tags: ["Coastal", "Short getaway", "Family", "Group"], text: "Short domestic cruises linking Mumbai, Goa, Kochi, Chennai and Sri Lanka, subject to each season's schedule." },
  { id: "australia-pacific", name: "Australia & the South Pacific", country: "australia", place: "sydney", region: "oceania", ll: [-33.86, 151.21], ports: ["Sydney", "Brisbane", "Auckland"], season: "Busiest from about October to April", tags: ["Ocean", "Island hopping", "Family", "Couples"], text: "Sydney sailings to New Caledonia, Vanuatu, Fiji and New Zealand's sounds." },
  { id: "danube-rhine", name: "Danube & Rhine river cruises", country: "hungary", place: "hungary", region: "europe", ll: [47.50, 19.04], ports: ["Budapest", "Vienna", "Passau", "Amsterdam", "Basel"], season: "Roughly March to December, with Christmas-market sailings", tags: ["River", "Couples", "Luxury", "Group"], text: "Small river ships docking in the heart of Budapest, Vienna, Cologne and Strasbourg." },
  { id: "nile", name: "Nile river cruise", country: "egypt", place: "luxor", region: "africa", ll: [25.69, 32.64], ports: ["Luxor", "Aswan"], season: "Most comfortable October to April", tags: ["River", "Couples", "Family", "Cruise + land"], text: "Three to four nights between Luxor and Aswan, with temples at Edfu and Kom Ombo along the way." },
  { id: "mekong", name: "Mekong river cruise", country: "vietnam", place: "vietnam", region: "asia", ll: [10.03, 105.78], ports: ["Ho Chi Minh City area", "Phnom Penh", "Siem Reap"], season: "Typically August to May; water levels shape the route", tags: ["River", "Couples", "Cruise + land"], text: "Vietnam's delta and Cambodia's riverside temples and villages on small river ships." },
  { id: "antarctica", name: "Antarctica expedition", country: "argentina", place: "argentina", region: "latin-america", ll: [-54.80, -68.30], ports: ["Ushuaia"], season: "Southern summer only, about November to March", tags: ["Expedition", "Luxury"], text: "Expedition ships crossing the Drake Passage from Ushuaia for penguins, ice and Zodiac landings." },
  { id: "galapagos", name: "Galápagos", country: "Ecuador", place: "peru", region: "latin-america", ll: [-0.74, -90.31], ports: ["Baltra", "San Cristóbal"], season: "Year-round; seas and wildlife change with the season", tags: ["Expedition", "Island hopping", "Family"], text: "Small expedition ships with naturalist guides among the islands' wildlife; often paired with Peru or mainland Ecuador." },
];
const CRUISE_LINES = "Royal Caribbean, MSC Cruises, Norwegian Cruise Line, Celebrity, Princess, Costa, Viking, AmaWaterways, Hurtigruten, Silversea and Cordelia Cruises";

/* ---------- 5. Worldwide Luxury Yacht Experiences ---------- */
const YACHT_TYPES = ["Motor yacht", "Sailing yacht", "Catamaran", "Gulet", "Phinisi", "Superyacht"];
const OCCASIONS = ["Honeymoon", "Anniversary", "Birthday", "Proposal", "Family holiday", "Corporate event", "Friends' trip"];

const YACHT = [
  { id: "french-riviera", name: "French Riviera & Monaco", country: "france", place: "nice", region: "europe", ll: [43.58, 7.12], marinas: ["Antibes", "Cannes", "Nice", "Monaco"], season: "May to October", tags: ["Motor yacht", "Superyacht", "Sailing yacht"], text: "Day charters and week-long cruises between Saint-Tropez, Cannes, Antibes and Monaco." },
  { id: "amalfi", name: "Amalfi Coast & Capri", country: "italy", place: "amalfi-coast", region: "europe", ll: [40.63, 14.60], marinas: ["Naples", "Sorrento", "Salerno", "Amalfi"], season: "May to October", tags: ["Motor yacht", "Sailing yacht"], text: "Capri's grottoes, Positano and Amalfi from the water, as day trips or longer charters." },
  { id: "croatia", name: "Croatia's Dalmatian coast", country: "croatia", place: "croatia", region: "europe", ll: [43.51, 16.44], marinas: ["Split", "Dubrovnik", "Trogir"], season: "May to October", tags: ["Catamaran", "Gulet", "Sailing yacht", "Motor yacht"], text: "Island hopping between Hvar, Brač, Vis and Korčula, popular for catamaran and gulet weeks." },
  { id: "greek-islands", name: "Greek islands", country: "greece", place: "mykonos", region: "europe", ll: [37.88, 23.73], marinas: ["Athens (Alimos)", "Lavrio", "Mykonos", "Corfu"], season: "May to October; strong meltemi winds in July and August", tags: ["Catamaran", "Sailing yacht", "Motor yacht"], text: "The Cyclades and Ionian islands, from sunset sails off Santorini to week-long charters." },
  { id: "turkey-coast", name: "Turkey's Turquoise Coast", country: "turkey", place: "turkey", region: "europe", ll: [37.04, 27.43], marinas: ["Bodrum", "Göcek", "Marmaris", "Fethiye"], season: "May to October", tags: ["Gulet", "Motor yacht"], text: "Traditional wooden gulets with crew, anchoring in quiet bays along the Lycian coast." },
  { id: "balearics", name: "Mallorca & Ibiza", country: "spain", place: "spain", region: "europe", ll: [39.57, 2.65], marinas: ["Palma de Mallorca", "Ibiza"], season: "May to October", tags: ["Motor yacht", "Catamaran", "Superyacht"], text: "Coves, beach clubs and island hopping in the Balearics." },
  { id: "bvi", name: "British Virgin Islands", country: "British Virgin Islands", region: "caribbean", ll: [18.43, -64.62], marinas: ["Tortola (Road Town)"], season: "About December to May; hurricane season June to November", tags: ["Catamaran", "Sailing yacht"], text: "One of the world's classic sailing grounds, with short hops between sheltered anchorages." },
  { id: "bahamas", name: "The Bahamas", country: "The Bahamas", region: "caribbean", ll: [25.05, -77.35], marinas: ["Nassau"], season: "About December to May", tags: ["Motor yacht", "Catamaran", "Superyacht"], text: "The Exumas' sandbars and clear shallows, often combined with Florida." },
  { id: "maldives-yacht", name: "Maldives", country: "maldives", place: "maldives", region: "indian-ocean", ll: [4.18, 73.51], marinas: ["Malé"], season: "Year-round; the drier northeast monsoon runs about December to April", tags: ["Motor yacht", "Catamaran"], text: "Sunset cruises, sandbank picnics and multi-day atoll charters with snorkelling and diving." },
  { id: "seychelles-yacht", name: "Seychelles", country: "seychelles", place: "seychelles", region: "indian-ocean", ll: [-4.62, 55.45], marinas: ["Mahé (Eden Island)", "Praslin"], season: "Year-round; calmer seas in April–May and October–November", tags: ["Catamaran", "Sailing yacht", "Motor yacht"], text: "Granite islands, La Digue and Praslin's beaches on skippered catamaran charters." },
  { id: "phuket-yacht", name: "Phuket & Phang Nga Bay", country: "thailand", place: "phuket", region: "asia", ll: [8.04, 98.34], marinas: ["Ao Po", "Chalong", "Yacht Haven"], season: "About November to April", tags: ["Catamaran", "Motor yacht", "Sailing yacht"], text: "Limestone islands of Phang Nga Bay, the Phi Phi islands and sunset sails from Phuket." },
  { id: "komodo-phinisi", name: "Komodo & Labuan Bajo", country: "indonesia", place: "labuan-bajo", region: "asia", ll: [-8.49, 119.88], marinas: ["Labuan Bajo"], season: "About April to November", tags: ["Phinisi"], text: "Traditional phinisi boats to Komodo National Park, Padar's viewpoint and pink beaches." },
  { id: "dubai-yacht", name: "Dubai Marina", country: "uae", place: "dubai", region: "middle-east", ll: [25.08, 55.14], marinas: ["Dubai Marina", "Dubai Harbour"], season: "Year-round; most comfortable October to April", tags: ["Motor yacht", "Superyacht"], text: "Two- to four-hour charters past Palm Jumeirah, Burj Al Arab and the Dubai skyline, popular for celebrations and corporate groups." },
  { id: "whitsundays", name: "Whitsundays", country: "australia", place: "australia", region: "oceania", ll: [-20.27, 148.72], marinas: ["Airlie Beach"], season: "Year-round; best May to October", tags: ["Catamaran", "Sailing yacht"], text: "Whitehaven Beach and the Great Barrier Reef on skippered or bareboat charters." },
  { id: "goa-yacht", name: "Goa & Mumbai", country: "india", place: "goa", region: "asia", ll: [15.49, 73.82], marinas: ["Panaji", "Mumbai (Gateway of India)"], season: "October to May; harbour charters pause in the monsoon", tags: ["Motor yacht", "Sailing yacht"], text: "Sunset sails and private yacht hire for a few hours, for celebrations and small groups in India." },
];

/* ---------- planner field sets (rendered by the build, run by assets/js/nexara-exp.js) ----------
   field types: chips (one), multi (several), dest (one or more destinations with suggestions), text, area, select, date, num */
const PURPOSES = ["Trade fair or exhibition", "Product sourcing & supplier visits", "Factory & industry tours", "Export market exploration", "Conference or corporate delegation", "Business networking", "Incentive travel for a team", "Something else"];

export const EXPERIENCES = [
  {
    s: "business-trade-travel", n: "Business & Trade Travel", short: "Trade fairs, sourcing trips, industry tours and corporate travel worldwide.", theme: "biz", lead: true,
    title: "Canton Fair Business Trips from India & Trade Fair Travel | Nexara Holidays",
    desc: "Canton Fair trips from India: phases, dates, buyer registration, China business visa, hotels near Pazhou, interpreters and factory visits, plus trade fairs worldwide.",
    h1: "Canton Fair & Global Business Travel",
    sub: "China's largest trade fair, twice a year in Guangzhou: we plan your flights, business visa, hotel near the Canton Fair Complex, interpreters and factory visits, and travel to trade fairs and industry hubs worldwide.",
    cta: ["Plan My Canton Fair Trip", "#canton-plan"], cta2: ["Canton Fair guide", "#canton"], img: "x-biz-canton", alt: "Aerial view of the Canton Fair Complex in Pazhou, Guangzhou",
  },
  {
    s: "roots-heritage-journeys", n: "Roots & Heritage Journeys", short: "Ancestral hometowns, family history, traditions and cultural journeys anywhere in the world.", theme: "her", img: "x-her-festival",
    title: "Roots & Heritage Journeys Worldwide | Nexara Holidays",
    desc: "Journeys to ancestral hometowns, family-history travel, multi-generation reunions and cultural heritage trips on every continent.",
    h1: "Discover Your Roots. Explore the World.",
    sub: "Reconnect with your heritage, explore ancestral destinations, discover local traditions, and create meaningful journeys across generations.",
    cta: ["Plan My Heritage Journey", "#planner"], cta2: ["Explore Tamil Nadu roots", "#tamil-nadu"],
  },
  {
    s: "educational-trips", n: "Educational Trips", short: "Study tours, science and industry visits and exchanges for schools and universities.", theme: "edu", img: "x-edu-campus",
    title: "Educational Trips for Schools & Colleges | Nexara Holidays",
    desc: "Educational trips for schools, colleges and universities: science, history, wildlife, industry visits, language immersion and campus tours worldwide.",
    h1: "Education Beyond Borders",
    sub: "Turn learning into a global experience through educational tours, cultural exchanges, scientific discoveries, industry visits, and international academic journeys.",
    cta: ["Plan an Educational Journey", "#planner"], cta2: ["Browse study destinations", "#discover"],
  },
  {
    s: "cruise-holidays", n: "Cruise Holidays", short: "Ocean, river and expedition cruises across the world's great sailing regions.", theme: "cru", img: "x-cru-deck",
    title: "International Cruise Holidays | Nexara Holidays",
    desc: "Worldwide cruises: the Mediterranean, Caribbean, fjords, Alaska, Southeast Asia, the Gulf, river cruises and expeditions, quoted for your dates.",
    h1: "Explore More of the World by Sea",
    sub: "Discover extraordinary coastlines, island escapes, iconic ports, and unforgettable onboard experiences through worldwide cruise holidays.",
    cta: ["Explore Worldwide Cruises", "#discover"], cta2: ["Request cruise options", "#planner"],
  },
  {
    s: "luxury-yacht-experiences", n: "Luxury Yacht Experiences", short: "Private charters, sailing holidays and sunset cruises in the world's finest waters.", theme: "yac", img: "x-yac-hero",
    title: "Luxury Yacht Charters Worldwide | Nexara Holidays",
    desc: "Private yacht charters, catamaran and gulet holidays and sunset cruises in the Mediterranean, Caribbean, Maldives, Seychelles, Thailand and Dubai.",
    h1: "Discover the World, One Horizon at a Time",
    sub: "Experience private yacht journeys, exceptional coastlines, island escapes, and personalized sailing adventures around the world.",
    cta: ["Plan My Yacht Experience", "#planner"], cta2: ["Explore sailing regions", "#discover"],
  },
];

export const EXP_HUB = {
  h1: "Travel the World Your Way", scr: "Travel Experiences",
  sub: "From international business opportunities and educational discoveries to meaningful heritage journeys and extraordinary experiences at sea, explore travel designed around your purpose.",
  desc: "Business and trade travel, roots and heritage journeys, educational trips, cruise holidays and luxury yacht experiences, planned worldwide.",
};


/* ---------- 1a. Canton Fair: the lead section of the Business & Trade Travel page ----------
   Dates were checked on EVENTS_CHECKED against the organiser's announcements and trade listings. The organiser
   confirms each session's dates and phase layout a few months ahead; the "next" session is shown as expected until then. */
const CANTON = {
  name: "Canton Fair (China Import and Export Fair)",
  intro: [
    "The Canton Fair is China's largest and longest-running trade fair, held since 1957 and run by the Ministry of Commerce and the Guangdong provincial government. It takes place twice a year in Guangzhou, in spring (April–May) and autumn (October–November), at the Canton Fair Complex in Pazhou, one of the largest exhibition centres in the world.",
    "Each session is split into three phases of about five days, each devoted to different industries, so buyers choose the phase that matches what they want to source. Tens of thousands of Chinese manufacturers and exporters exhibit, and there is also an International Pavilion for exhibitors from other countries.",
    "For Indian importers, wholesalers, retailers and manufacturers it is the single most efficient way to meet many suppliers in one trip. Nexara plans the whole journey from Chennai or any Indian city: flights, the China business visa, a hotel near the complex, transfers, interpreters and supplier visits after the fair.",
  ],
  facts: [["Since", "1957"], ["Held", "Twice a year"], ["Phases", "3 per session"], ["Venue", "Pazhou, Guangzhou"], ["Badge", "Free for buyers"], ["From India", "Nonstop flights"]],
  sessions: [
    { n: "140th session (autumn 2026)", st: "Dates published by the organiser", ph: [["Phase 1", "15–19 October 2026"], ["Phase 2", "23–27 October 2026"], ["Phase 3", "31 October – 4 November 2026"]] },
    { n: "141st session (spring 2027)", st: "Expected dates: confirm with the organiser", ph: [["Phase 1", "about 15–19 April 2027"], ["Phase 2", "about 23–27 April 2027"], ["Phase 3", "about 1–5 May 2027"]] },
  ],
  phases: [
    ["Phase 1", "Advanced manufacturing", ["Consumer electronics and information products", "Household electrical appliances", "Lighting equipment", "Industrial automation and machinery", "Power and electrical equipment", "Hardware and tools", "New energy and new-energy vehicles", "Vehicles, spare parts and motorcycles"]],
    ["Phase 2", "Quality home life", ["Building and decorative materials", "Furniture", "Kitchenware and tableware", "Household items", "Home decorations and gifts", "Festival products", "Garden products", "Toys, pet products and baby care"]],
    ["Phase 3", "Fashion, health and food", ["Textiles and garments", "Shoes, bags and fashion accessories", "Home textiles and carpets", "Office supplies and stationery", "Medicines, health products and medical devices", "Food and beverages", "Sports, travel and leisure products", "Personal care and bathroom products"]],
  ],
  steps: [
    ["Choose your phase", "Pick the phase that matches your products. Many buyers cover two phases; the gap between them is a good time for factory visits."],
    ["Register as a buyer", "Pre-register free on the Canton Fair's official Buyer Service System or app with your passport and company details. First-time buyers receive the invitation letter through the same system."],
    ["Apply for your China visa", "Indian passport holders need a visa for mainland China. Most buyers apply for a business (M) visa with the fair's invitation letter; the name and passport number must match on the letter, the visa and the badge."],
    ["Book flights and a hotel early", "IndiGo flies nonstop to Guangzhou from Delhi and Kolkata, and there are one-stop connections from Chennai, Mumbai and Bengaluru. Hotels near Pazhou fill up months before each session."],
    ["Collect your badge", "First-time buyers collect the buyer badge at the registration counters in Guangzhou, including at the airport and at the complex; returning buyers can reuse their badge."],
    ["Visit, then follow up", "Walk the halls with an interpreter if you need one, collect catalogues and quotes, and leave a day or two to visit shortlisted factories in Guangzhou, Foshan or Shenzhen."],
  ],
  services: [
    "Return flights from Chennai or any Indian city, timed to your phase",
    "China business (M) visa guidance and document checklist",
    "Buyer registration and invitation-letter guidance",
    "Hotels near the Canton Fair Complex, booked as soon as dates are fixed",
    "Airport and daily fair transfers, or a metro card for Pazhou",
    "English-Chinese interpreters, booked by the day",
    "Factory and showroom visits in Guangzhou, Foshan, Shenzhen and Yiwu",
    "Group delegations for associations, chambers of commerce and companies",
    "Local SIM or eSIM, and forex or a travel card for China",
    "Travel insurance for the trip",
  ],
  tips: [
    "Carry plenty of business cards and a short company profile; exhibitors exchange cards first and talk prices later.",
    "Most suppliers quote in US dollars. Ask for the minimum order quantity, lead time and sample cost at the stand.",
    "Google, WhatsApp and Gmail are blocked in mainland China without a roaming plan or an international eSIM, so set that up before you fly. Suppliers mostly use WeChat.",
    "Cash is rarely used: Alipay and WeChat Pay accept many foreign cards, so link yours before you travel.",
    "The halls are huge: wear comfortable shoes, use the fair's app or map, and plan each day by hall and zone.",
    "Metro Line 8 stops at Xingang East and Pazhou stations, right beside the complex, and is the fastest way in each morning.",
  ],
  faq: [
    ["When is the next Canton Fair?", "The 140th session (autumn 2026) runs in three phases from 15 October to 4 November 2026. The 141st session is expected in April and May 2027; the organiser confirms the exact dates a few months ahead, and we check them before booking any non-refundable travel."],
    ["Do Indians need a visa for the Canton Fair?", "Yes. Indian passport holders need a visa for mainland China. Most buyers apply for a business (M) visa using the invitation letter from the fair's Buyer Service System. We help with the checklist, but visa decisions are made by the Chinese visa office."],
    ["Is the Canton Fair free to attend?", "Yes. The buyer badge is free for overseas buyers who register in advance. You pay only for your travel, visa, hotel and any services such as interpreters."],
    ["Which phase should I attend?", "Phase 1 is for electronics, appliances, machinery, tools, energy and vehicles; Phase 2 for building materials, furniture, kitchenware, home goods and gifts; Phase 3 for textiles, garments, shoes, bags, office supplies, health products and food. Tell us your products and we will suggest the phase."],
    ["How many days do I need?", "Four to six nights covers one phase with a spare day for meetings. To cover two phases, plan nine to ten nights; to visit factories after the fair, add two to four nights in Foshan, Shenzhen or Yiwu."],
    ["How do I get from India to Guangzhou?", "IndiGo flies nonstop to Guangzhou from Delhi and Kolkata, and China Southern serves Delhi. From Chennai, Mumbai, Bengaluru and Hyderabad there are one-stop connections via these cities, Singapore, Hong Kong or Bangkok."],
    ["Can you arrange an interpreter and factory visits?", "Yes. We book English-Chinese interpreters by the day and arrange transport for factory and showroom visits. Supplier introductions and factory access depend on the companies themselves."],
    ["Can you plan a group delegation?", "Yes. We plan Canton Fair delegations for associations, chambers of commerce and companies, with group flights, hotels together near the complex, transfers and a shared day-by-day plan."],
  ],
  link: "https://www.cantonfair.org.cn/en-US",
};

export const EXP_DATA = {
  TN_ROOTS, INDUSTRIES, EVENTS, HUBS, CANTON, HERITAGE, HERITAGE_TYPES, SUBJECTS, AGES, EDU, CRUISE_STYLES, CRUISE, CRUISE_LINES, YACHT, YACHT_TYPES, OCCASIONS, PURPOSES,
  SOURCING: ["International product sourcing", "Supplier and manufacturer visits", "Wholesale market exploration", "Procurement trips", "Export market exploration", "Business networking", "Manufacturing and industrial visits", "Trade exhibition itineraries", "Custom business delegations"],
  CORPORATE: [["Corporate delegations", "Group flights, hotels near the venue, transfers and a shared programme for the whole team."], ["International conferences", "Travel built around the conference dates, with time added for meetings or sightseeing."], ["Executive meetings", "Short, tightly timed trips with private transfers and business hotels."], ["Industry association groups", "Itineraries for chambers of commerce and trade bodies, including fair visits."], ["Incentive travel", "Reward trips for teams and dealers, from city breaks to cruises."], ["Company visits and business exchanges", "Visits arranged through your contacts or the host organisation, with travel around them."]],
};
