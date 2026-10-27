// Sacred journeys (/sacred/): faith pilgrimages in India and abroad, grouped into categories.
// Each category lists its itineraries by package name (packages-*.mjs, places-added.mjs); the build warns on unknown names.
// hero: the photo key (destination, or destination--attraction) that heads the category page. Original copy; no prices, dates or darshan guarantees.

export const SACRED_HUB = {
  title: "Sacred Journeys: Pilgrimage Tours in India & Abroad | Nexara Holidays",
  hero: "haridwar--har-ki-pauri", tiles: { india: "rishikesh--triveni-ghat", abroad: "kailash-mansarovar" }, h1: "Sacred", scr: "National + International Faith Journeys", sub: "Curated with Reverence.",
  desc: "Pilgrimage tours from Chennai for every faith: Char Dham and Jyotirlinga yatras, temple trails, gurdwaras, Jain tirths, Sufi shrines, churches, Buddhist circuits, Kailash Mansarovar and sacred sites abroad.",
  intro: `A pilgrimage is planned around faith first and sightseeing second. We build each sacred journey around darshan and prayer timings, festival calendars and rules of dress and conduct, and keep the pace gentle enough for parents and grandparents.

Choose a journey below, or tell us the shrines you want to visit and we will plan the route.`,
  how: [
    ["Darshan and prayer timings", "We plan each day around opening hours, aarti, Mass or prayer times, and book darshan, puja or VIP entry where the temple allows it."],
    ["Paced for elders", "Fewer hotel changes, ground-floor or lift rooms on request, wheelchairs, ponies, palkis or helicopters where available."],
    ["Food that respects your faith", "Pure vegetarian, Jain, satvik or halal meals arranged where possible, and we tell you honestly where options are limited."],
    ["Registrations and permits", "Char Dham and Amarnath registration, Inner Line and Tibet permits, and medical certificates where they are required."],
  ],
  faq: [
    ["Can you guarantee darshan or a special puja?", "No. Temples, gurdwaras and shrines control their own queues and bookings. We book darshan, puja or VIP entry wherever the temple offers it, and plan extra time on busy days."],
    ["Are these trips suitable for senior citizens?", "Most are. We keep travel days short, choose hotels close to the shrine and arrange ponies, palkis, wheelchairs or helicopters where available. High-altitude yatras such as Kedarnath, Hemkund Sahib, Amarnath and Kailash need a medical check-up first."],
    ["Do you arrange vegetarian or Jain food?", "Yes. We choose hotels and restaurants that serve pure vegetarian or Jain food where possible, and pack-meal arrangements for long drives."],
    ["Can I join a group pilgrimage?", "Every itinerary here can be private for your family, or we can form a small group with other travellers on fixed dates for popular yatras."],
    ["Do you arrange Umrah or Hajj?", "Hajj is arranged through the Haj Committee of India and licensed operators, and Umrah through licensed operators. We do not sell either directly, but we can help with flights and connecting holidays."],
  ],
};

// group: where the category sits on the hub and in the menu
export const SACRED_GROUPS = { india: "Within India", faiths: "Faiths across borders", abroad: "Beyond India" };

export const SACRED = [
  {
    s: "tamil-nadu-temples", n: "Tamil Nadu Temples & Shrines", group: "india", hero: "thanjavur--brihadeeswarar-temple", scr: "Sacred Tamil Nadu", feature: true,
    short: "Madurai, Rameswaram, Srirangam, Tiruvannamalai, Chidambaram, Murugan's six abodes, the Navagrahas and Velankanni.",
    desc: "Tamil Nadu pilgrimage tours from Chennai: Madurai Meenakshi, Rameswaram, Srirangam, Tiruvannamalai Girivalam, Chidambaram, the Pancha Bhoota temples, Arupadai Veedu, the Navagraha temples and Velankanni.",
    who: ["Families from Chennai and across Tamil Nadu", "Senior pilgrims", "Temple architecture lovers"],
    intro: `Tamil Nadu has more great temples than anywhere else in India, and most are within a day's drive of Chennai. The circuits that pilgrims follow here are centuries old: the five Pancha Bhoota temples of Shiva, the six abodes of Lord Murugan, the nine Navagraha temples around Kumbakonam, and the Divya Desams of Vishnu from Srirangam to Kanchipuram.

We plan around abhishekam and pooja timings, festival days such as Thai Poosam, Karthigai Deepam and Vaikunta Ekadasi, and full-moon Girivalam at Tiruvannamalai. Drivers who know each temple's darshan hours keep the days unhurried, and we choose hotels close to the main shrine. Velankanni and the Nagore Dargah are part of Tamil Nadu's sacred coast too.`,
    pk: ["Grand Tamil Nadu Temple Tour", "Temples of Tamil Nadu", "Madurai, Rameswaram & Kanyakumari Pilgrimage", "Arupadai Veedu: Six Abodes of Murugan", "Pancha Bhoota Sthalam Yatra", "Navagraha Temples of Kumbakonam", "Srirangam & Trichy Temples", "Tiruvannamalai Girivalam", "Chidambaram Nataraja & Pichavaram", "Tiruchendur & Kanyakumari Coastal Temples", "Velankanni Pilgrimage", "Velankanni, Nagore & Thanjavur", "Tirupati & Chennai Temple Tour"],
    faq: [["When is the best time for a Tamil Nadu temple tour?", "October to March is the most comfortable. Plan around the big festivals if you want to see them: Karthigai Deepam at Tiruvannamalai (November or December), Vaikunta Ekadasi at Srirangam (December or January), Thai Poosam at Palani (January or February) and Kanda Sashti at Tiruchendur (October or November)."], ["What is the dress code in Tamil Nadu temples?", "Traditional dress is expected: veshti or trousers with a shirt for men, and a saree, half-saree or churidar for women. Some temples, such as Chidambaram, ask men to remove their shirts in the inner sanctum."], ["Can the tour start and end in Chennai?", "Yes. Every Tamil Nadu itinerary starts and ends in Chennai by car or train, and we can add a pickup from your home."]],
  },
  {
    s: "tirupati-shirdi-sabarimala", n: "Tirupati, Shirdi & Sabarimala", group: "india", hero: "tirupati--sri-venkateswara-temple-tirumala", scr: "India's most visited shrines",
    short: "Tirumala Balaji, Shirdi Sai Baba and Sabarimala Ayyappa, plus Vaishno Devi, the Golden Temple and Kashi Vishwanath.",
    desc: "Pilgrimages to Tirupati Balaji, Shirdi Sai Baba and Sabarimala Ayyappa, plus Vaishno Devi, the Golden Temple and Kashi, with darshan booking help.",
    who: ["Families from Chennai and across the south", "Ayyappa devotees and their groups", "Senior pilgrims"],
    intro: `Tirumala, Shirdi and Sabarimala draw more pilgrims than almost anywhere else in India, and each runs its own booking system. Lord Venkateswara's temple on Tirumala hill releases darshan tickets online through TTD, the Sai Baba Sansthan at Shirdi sells darshan and aarti passes, and Sabarimala admits pilgrims only with a Virtual-Q slot for the Mandala-Makaravilakku season from mid-November to mid-January.

We book what each temple allows as soon as it opens, plan the day around the queue rather than sightseeing, and keep a spare day where crowds are hard to predict. For Sabarimala we arrange vehicles for your whole group and leave the vratham and irumudi kettu to your guru swami's guidance. The same care goes into Vaishno Devi, the Golden Temple, Kashi Vishwanath and Guruvayur.`,
    pk: ["Tirupati Balaji Darshan Tour", "Tirumala Footpath Darshan", "Tirupati & Chennai Temple Tour", "Shirdi & Nashik Pilgrimage", "Mumbai Siddhivinayak & Shirdi", "Nashik Vineyards & Shirdi", "Sabarimala Ayyappa Darshan", "Erumeli, Sabarimala & Guruvayur Yatra", "Guruvayur & Kerala Temple Trail", "Vaishno Devi Yatra", "Amritsar Golden Temple Weekend", "Kashi & Ayodhya Yatra"],
    faq: [["How is darshan booked at Tirumala?", "TTD sells paid Special Entry darshan online, usually weeks or months ahead. The free Sarva Darshan queue and the Divya Darshan tokens for pilgrims walking up the Alipiri or Srivari Mettu footpaths are issued in Tirupati and Tirumala. We book the online tickets for your dates as soon as they open, subject to availability."], ["Do I need a pass for Shirdi?", "Darshan in the general queue is free. Paid darshan passes and passes for the Kakad, Madhyan, Dhoop and Shej aartis are sold on the Sai Sansthan's official site, and we book them once your dates are fixed. Thursdays, Ram Navami, Guru Purnima and Vijayadashami are the busiest days."], ["When is Sabarimala open?", "For the Mandala season from about mid-November to late December, again for Makaravilakku until about 20 January, and for the first few days of every Malayalam month. The Travancore Devaswom Board announces the exact dates each year, and every pilgrim needs a Virtual-Q booking."], ["Who can make the Sabarimala pilgrimage?", "Devotees traditionally observe a 41-day vratham and carry the irumudi kettu. By custom, women aged 10 to 50 do not make the pilgrimage; the question of entry is before the Supreme Court, and we follow the Travancore Devaswom Board's rules at the time you travel."], ["How hard is the Sabarimala climb?", "It is about 5 km uphill from Pamba to the Sannidhanam on a paved path with steps, and most pilgrims take two to four hours. Dolis carry those who cannot walk, and anyone with heart or breathing problems should see a doctor first."]],
  },
  {
    s: "char-dham-yatra", n: "Char Dham & Himalayan Yatras", group: "india", hero: "kedarnath--kedarnath-temple", scr: "Himalayan yatras",
    short: "Yamunotri, Gangotri, Kedarnath and Badrinath, plus Vaishno Devi and Amarnath.",
    desc: "Char Dham, Do Dham, Kedarnath, Vaishno Devi and Amarnath yatras with registration, helicopter or pony options and pacing for the altitude.",
    who: ["Families travelling with elders", "First-time Himalayan pilgrims", "Devotees completing the Char Dham"],
    intro: `The Himalayan yatras are the most demanding pilgrimages in India, and the most rewarding. The four dhams of Uttarakhand open on Akshaya Tritiya in April or May and close around Diwali, Vaishno Devi is open all year, and the Amarnath cave is open only for a few weeks in July and August.

We handle the compulsory registrations, book helicopter seats to Kedarnath where available, and plan overnight stops so that no day has too much driving on mountain roads. Ponies, palkis and porters can be arranged at the trailheads.`,
    pk: ["Char Dham Yatra", "Kedarnath & Badrinath Do Dham Yatra", "Kedarnath Yatra", "Haridwar & Rishikesh Pilgrimage", "Vaishno Devi Yatra", "Vaishno Devi & Kashmir", "Amarnath Yatra via Pahalgam"],
    faq: [["When is the best time for the Char Dham Yatra?", "May to June and September to October. The shrines open in late April or May and close around Diwali; July and August bring monsoon landslides on the mountain roads."], ["How fit do I need to be?", "Kedarnath is a 16 km trek each way and Yamunotri 6 km; ponies, palkis and helicopters reduce the walking. Everyone should have a medical check-up before travelling above 3,000 metres."]],
  },
  {
    s: "jyotirlinga-darshan", n: "Jyotirlinga Darshan", group: "india", hero: "ujjain", scr: "Shiva's twelve lights",
    short: "Mahakaleshwar, Kashi Vishwanath, Somnath, Trimbakeshwar and more of the twelve Jyotirlingas.",
    desc: "Jyotirlinga yatras to Ujjain, Omkareshwar, Varanasi, Somnath, Trimbakeshwar, Grishneshwar, Bhimashankar, Rameswaram, Kedarnath and Deoghar.",
    who: ["Shiva devotees", "Families on a temple circuit", "Senior pilgrims"],
    intro: `The twelve Jyotirlingas are the holiest shrines of Lord Shiva, spread from Kedarnath in the Himalaya to Rameswaram on the southern coast. Most pilgrims visit them a few at a time, grouped by region.

We book the Bhasma Aarti at Mahakaleshwar in Ujjain when slots are released, plan around abhishekam timings and combine nearby Jyotirlingas so you spend more time in darshan and less on the road.`,
    pk: ["Ujjain & Omkareshwar Jyotirlinga Yatra", "Indore, Ujjain & Mandu", "Maharashtra Jyotirlinga Yatra", "Nashik Vineyards & Shirdi", "Dwarka & Somnath Pilgrimage", "Gir Lions & Somnath", "Varanasi Spiritual Retreat", "Madurai, Rameswaram & Kanyakumari Pilgrimage", "Ranchi Waterfalls & Deoghar"],
    faq: [["Can you book the Bhasma Aarti in Ujjain?", "We apply for Bhasma Aarti entry as soon as the temple releases slots, but numbers are limited and allocation is not guaranteed."]],
  },
  {
    s: "south-india-temple-trails", n: "South India Temple Trails", group: "india", hero: "madurai--meenakshi-amman-temple", scr: "Gopurams and sacred tanks",
    short: "Tirupati Balaji, Guruvayur, Padmanabhaswamy, Udupi and Gokarna, plus Madurai and Rameswaram.",
    desc: "South Indian temple tours to Tirupati, Guruvayur, Padmanabhaswamy in Thiruvananthapuram, Udupi, Gokarna, Madurai and Rameswaram. Tamil Nadu temple tours have their own page.",
    who: ["Families from Chennai and the south", "Temple architecture lovers", "Senior pilgrims"],
    intro: `South India's great temples are living places of worship, with daily rituals that have continued for more than a thousand years. Many are an easy drive or overnight train from Chennai.

We plan around special darshan tickets at Tirumala, the dress codes of Kerala temples and the long distances of the Navagraha circuit, and choose hotels within walking distance of the main shrine where possible.`,
    pk: ["Tirupati Balaji Darshan Tour", "Tirupati & Chennai Temple Tour", "Guruvayur & Kerala Temple Trail", "Sabarimala Ayyappa Darshan", "Madurai, Rameswaram & Kanyakumari Pilgrimage", "Kanyakumari & Thiruvananthapuram Tip-of-India Tour", "Karnataka Coastal Trail: Gokarna & Udupi"],
    faq: [["Can you book Tirumala special darshan?", "Special entry darshan tickets are released online by TTD; we book them for your dates as soon as they open, subject to availability."], ["What should I wear in Kerala temples?", "Men usually wear a mundu without a shirt and women a saree or traditional dress. Some temples, including Guruvayur and Padmanabhaswamy, admit only Hindus."]],
  },
  {
    s: "krishna-rama-sacred-rivers", n: "Krishna, Rama & Sacred Rivers", group: "india", hero: "varanasi--dashashwamedh-ghat", scr: "Ghats, sangams and holy cities",
    short: "Varanasi, Prayagraj, Ayodhya, Mathura–Vrindavan, Dwarka and Puri.",
    desc: "Pilgrimages to Varanasi, the Sangam at Prayagraj, Ayodhya's Ram Mandir, Mathura and Vrindavan, Dwarka and Puri's Jagannath temple.",
    who: ["Families on a first yatra", "Devotees of Krishna and Rama", "Festival travellers"],
    intro: `The holy cities of the north and west are tied to the lives of Rama and Krishna and to India's sacred rivers. A dip at the Triveni Sangam, the Ganga aarti in Varanasi and darshan at the Ram Mandir in Ayodhya can be combined in one unhurried trip.

Festivals change these places completely: Holi in Braj, the Magh Mela at Prayagraj and the Rath Yatra in Puri. We book stays months ahead for festival dates and plan viewing arrangements where they can be made.`,
    pk: ["Prayagraj, Varanasi & Ayodhya Yatra", "Magh Mela at the Sangam", "Kashi & Ayodhya Yatra", "Ayodhya Darshan Short Trip", "Braj Darshan: Mathura, Vrindavan & Govardhan", "Mathura Vrindavan Holi Trip", "Golden Triangle & Varanasi", "Dwarka & Somnath Pilgrimage", "Puri Rath Yatra Trip", "Odisha Golden Triangle"],
  },
  {
    s: "devi-shakti-temples", n: "Devi & Shakti Temples", group: "india", hero: "guwahati--kamakhya-temple", scr: "The Mother Goddess",
    short: "Vaishno Devi, Kamakhya, Kalighat and Dakshineswar, Meenakshi and Durga Puja.",
    desc: "Shakti Peeth and Devi temple tours: Vaishno Devi, Kamakhya in Guwahati, Kalighat and Dakshineswar in Kolkata, Madurai Meenakshi and Durga Puja.",
    who: ["Devotees of the Goddess", "Navratri and Durga Puja travellers"],
    intro: `The Shakti Peethas and the great Devi temples draw pilgrims all year, and most of all during Navratri and Durga Puja. Vaishno Devi's climb, Kamakhya's hilltop shrine and Kolkata's Kali temples each have their own rhythm of queues and rituals.

We plan around the festival calendar, arrange battery cars, ponies or the helicopter at Katra, and choose stays close to the temple for early darshan.`,
    pk: ["Vaishno Devi Yatra", "Vaishno Devi & Kashmir", "Kamakhya Devi Darshan", "Kolkata, Dakshineswar & Belur Math", "Kolkata Durga Puja Special", "Madurai, Rameswaram & Kanyakumari Pilgrimage"],
  },
  {
    s: "sikh-gurdwara-yatras", n: "Sikh Gurdwara Yatras", group: "india", hero: "amritsar--golden-temple-harmandir-sahib", scr: "Takhts and gurdwaras",
    short: "The Golden Temple, Patna Sahib, Hazur Sahib and Hemkund Sahib.",
    desc: "Sikh pilgrimage tours to the Golden Temple in Amritsar, Takht Sri Patna Sahib, Hazur Sahib in Nanded and Hemkund Sahib in the Himalaya.",
    who: ["Sikh families and sangat groups", "Travellers drawn to seva and langar"],
    intro: `The Sikh takhts and historic gurdwaras welcome everyone to pray, share langar and do seva. The Golden Temple in Amritsar is the heart of the faith; Patna Sahib and Hazur Sahib mark the birth and last days of Guru Gobind Singh, and Hemkund Sahib stands beside a Himalayan lake.

We book hotels or yatri niwas close to the gurdwara, plan around Gurpurab dates and arrange ponies and porters for the Hemkund trek.`,
    pk: ["Amritsar Golden Temple Weekend", "Golden Triangle with Amritsar", "Amritsar, Dharamshala & Dalhousie", "Patna Sahib & Bodh Gaya", "Hazur Sahib Nanded Yatra", "Hemkund Sahib & Valley of Flowers Yatra"],
    faq: [["What should I know before visiting a gurdwara?", "Cover your head, remove shoes and wash your feet before entering, and do not carry tobacco or alcohol. Scarves are usually available at the entrance."]],
  },
  {
    s: "jain-tirth-yatras", n: "Jain Tirth Yatras", group: "india", hero: "palitana", scr: "Marble temples and holy hills",
    short: "Palitana, Shravanabelagola, Dilwara and Ranakpur.",
    desc: "Jain pilgrimage tours to Palitana's Shatrunjaya Hill, Shravanabelagola's Gommateshwara, the Dilwara temples of Mount Abu and Ranakpur.",
    who: ["Jain families and groups", "Lovers of temple architecture"],
    intro: `The Jain tirths include some of the most beautiful temples in India: the carved marble of Dilwara and Ranakpur, the 800 temples of Palitana's sacred hill and the great monolith of Gommateshwara at Shravanabelagola.

We arrange Jain food throughout, plan pre-dawn starts for the climbs, book dolis for those who cannot walk the steps, and avoid Chaturmas when the hill temples close to pilgrims.`,
    pk: ["Palitana Shatrunjaya Yatra", "Shravanabelagola & Mysuru", "Dilwara & Ranakpur Jain Temples"],
    faq: [["Can you arrange Jain food?", "Yes. We choose hotels and caterers who prepare Jain food without root vegetables, and pack meals for travel days."]],
  },
  {
    s: "sufi-shrines", n: "Sufi Shrines & Islamic Heritage", group: "faiths", hero: "ajmer", scr: "Dargahs and qawwali",
    short: "Ajmer Sharif, Nizamuddin, Nagore and the great mosques of Istanbul.",
    desc: "Ziyarat tours to Ajmer Sharif, Hazrat Nizamuddin in Delhi and Nagore Dargah, and Islamic heritage tours of Istanbul.",
    who: ["Families on ziyarat", "Travellers of every faith drawn to Sufi music"],
    intro: `India's Sufi shrines are visited by people of every faith. The Dargah of Khwaja Moinuddin Chishti in Ajmer, Hazrat Nizamuddin in Delhi and the Nagore Dargah on the Tamil Nadu coast are places of prayer, music and open kitchens.

We plan visits around Thursday qawwali and the Urs, choose stays within walking distance of the dargah and explain the customs of each shrine. Hajj and Umrah are arranged through licensed operators, and we do not sell them directly.`,
    pk: ["Ajmer Sharif & Pushkar", "Delhi Sufi Trail & Ajmer Sharif", "Velankanni, Nagore & Thanjavur", "Istanbul Mosques & Ottoman Heritage"],
  },
  {
    s: "christian-pilgrimages", n: "Churches & Christian Pilgrimages", group: "faiths", hero: "velankanni", scr: "Basilicas and holy lands",
    short: "Velankanni, Old Goa, the Holy Land, Rome and the Vatican, and Fatima.",
    desc: "Christian pilgrimage tours to Velankanni, the churches of Old Goa, the Holy Land in Israel, Rome and the Vatican, and Fatima in Portugal.",
    who: ["Parish groups and families", "Feast-day pilgrims"],
    intro: `From the Basilica of Our Lady of Good Health in Velankanni and the Basilica of Bom Jesus in Old Goa to Jerusalem, Rome and Fatima, Christian pilgrimages combine Mass, prayer and the history of the faith.

We plan around feast days, book Papal audience tickets when they are offered, and arrange guides who know the scripture behind each site. Travel to the Holy Land is planned subject to current government travel advice.`,
    pk: ["Velankanni Pilgrimage", "Velankanni, Nagore & Thanjavur", "Goa Churches & Old Goa Heritage", "Israel Holy Land Tour", "Rome & Vatican Pilgrimage", "Lisbon, Fatima & Porto Pilgrimage"],
    faq: [["Can you arrange a Papal audience?", "General audiences are free and ticketed by the Prefecture of the Papal Household. We request tickets for your dates when an audience is scheduled, but they cannot be guaranteed."]],
  },
  {
    s: "buddhist-pilgrimages", n: "Buddhist Pilgrimages", group: "faiths", hero: "bodh-gaya", scr: "In the footsteps of the Buddha",
    short: "Bodh Gaya, Sarnath, Lumbini, Kandy, Bhutan and Tawang.",
    desc: "Buddhist pilgrimage tours to Bodh Gaya, Sarnath, Nalanda and Rajgir, Lumbini in Nepal, Kandy and Anuradhapura in Sri Lanka, Bhutan and Tawang.",
    who: ["Buddhist pilgrims and meditation groups", "History and philosophy lovers"],
    intro: `The Buddhist circuit follows the life of the Buddha: his birth at Lumbini, enlightenment at Bodh Gaya, first teaching at Sarnath near Varanasi, and the great monastic university of Nalanda. Beyond India, Sri Lanka, Bhutan and the Himalaya keep living Buddhist traditions.

We plan quiet early visits to the Mahabodhi Temple, time trips for Buddha Purnima on request, and arrange meditation sessions at monasteries where they welcome visitors.`,
    pk: ["Buddhist Circuit: Varanasi to Bodh Gaya", "Bodh Gaya Pilgrimage", "Bodh Gaya & Varanasi", "Patna Sahib & Bodh Gaya", "Tawang Monastery Trip", "Nepal Buddhist Circuit", "Lumbini Pilgrimage", "Sri Lanka Buddhist Trail", "Bhutan Monasteries & Tiger's Nest"],
  },
  {
    s: "kailash-nepal-yatras", n: "Kailash & Nepal Yatras", group: "abroad", hero: "kathmandu", scr: "The sacred Himalaya",
    short: "Kailash Mansarovar, Pashupatinath and Muktinath.",
    desc: "Kailash Mansarovar Yatra via Nepal, and Nepal pilgrimages to Pashupatinath, Muktinath and Lumbini.",
    who: ["Devotees in good health", "Pilgrims combining Nepal's great temples"],
    intro: `Mount Kailash and Lake Mansarovar are the most sacred and most demanding pilgrimage of all, open only from May to September and entirely above 4,500 metres. Nepal's Pashupatinath and Muktinath are easier to reach and can be visited at any time of year.

Kailash trips run in permitted groups through licensed Tibetan operators, and the permits can be suspended at short notice by the Chinese authorities. We explain the medical requirements and the risks before you book.`,
    pk: ["Kailash Mansarovar Yatra via Nepal", "Pashupatinath & Muktinath Yatra", "Lumbini Pilgrimage", "Nepal Buddhist Circuit"],
    faq: [["Is the Kailash Mansarovar Yatra safe for older travellers?", "It is a high-altitude journey with basic facilities. A medical check-up is essential, and many operators set an upper age limit. Those who cannot walk the parikrama can stay at Darchen or Mansarovar."], ["What about the Government of India yatra?", "The Ministry of External Affairs runs a yatra via Lipulekh and Nathu La each summer, with places allotted by lottery. Our itinerary is a private alternative via Nepal."]],
  },
  {
    s: "hindu-temples-abroad", n: "Hindu Temples Abroad", group: "abroad", hero: "siem-reap", scr: "Sacred sites beyond India",
    short: "The Ramayana trail, Angkor Wat, Bali, Prambanan, Batu Caves and Mauritius.",
    desc: "Hindu pilgrimage tours abroad: the Ramayana trail in Sri Lanka, Angkor Wat, Bali's temples, Prambanan, Thaipusam at Batu Caves and Maha Shivaratri in Mauritius.",
    who: ["Families combining faith and a holiday", "Festival travellers"],
    intro: `Hindu temples and festivals thrive far beyond India: Thaipusam at Batu Caves in Malaysia, Maha Shivaratri at Grand Bassin in Mauritius, the temple culture of Bali, and the great Khmer and Javanese temples of Angkor and Prambanan.

These trips pair darshan with a comfortable holiday, and many can be timed for the festival. We include temple dress and etiquette notes for each country.`,
    pk: ["Sri Lanka Ramayana Trail", "Angkor Wat Explorer", "Bali Temple Trail", "Yogyakarta Heritage Short Break", "Thaipusam at Batu Caves", "Mauritius Shivaratri Pilgrimage"],
  },
];
