// Sacred journeys (/sacred/): faith pilgrimages in India and abroad, grouped into categories.
// Each category lists its itineraries by package name (packages-*.mjs, places-added.mjs); the build warns on unknown names.
// hero: the photo key (destination, or destination--attraction) that heads the category page. Original copy; no prices, dates or darshan guarantees.

export const SACRED_HUB = {
  title: "Sacred Journeys: Pilgrimage Tours in India & Abroad | Nexara Holidays",
  hero: "haridwar--har-ki-pauri", tiles: { india: "rishikesh--triveni-ghat", abroad: "kailash-mansarovar" }, h1: "Sacred", scr: "National + International Faith Journeys", sub: "Curated with Reverence.",
  desc: "Pilgrimage tours from Chennai for every faith: Kashi, Char Dham and Jyotirlinga yatras, temple trails, gurdwaras, Jain tirths, dargahs, Umrah and Ziyarat, churches, Buddhist circuits, Kailash Mansarovar and sacred sites abroad.",
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
    ["Do you arrange Umrah or Hajj?", "We plan Umrah together with our licensed Umrah partner, who arranges the Umrah visa and Nusuk permits while we look after flights, hotels near the Haram and the rest of your trip. Hajj places for Indian pilgrims are allotted only through the Haj Committee of India and Ministry-approved Hajj Group Organisers, so we do not sell Hajj."],
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
    s: "tirupati-balaji", n: "Tirupati Balaji (Tirumala)", group: "india", hero: "tirupati--sri-venkateswara-temple-tirumala", scr: "Lord of the seven hills",
    short: "Darshan of Lord Venkateswara at Tirumala, the Alipiri and Srivari Mettu footpaths, the Padmavathi temple, Sri Kalahasti and Kanipakam.",
    desc: "Tirupati Balaji tours from Chennai: Tirumala Venkateswara darshan with booking help, footpath darshan, the Padmavathi temple, Sri Kalahasti and Kanipakam.",
    who: ["Families from Chennai and across the south", "Senior pilgrims", "Devotees climbing on foot"],
    intro: `The Sri Venkateswara Temple on Tirumala, the hill of seven peaks above Tirupati, is one of the most visited places of worship in the world. Pilgrims come for darshan of Lord Venkateswara, offer their hair at the Kalyana Katta, take home the famous laddu prasadam and visit the Padmavathi temple at Tiruchanur, since tradition holds that the journey is complete only with darshan of the goddess.

Darshan is managed by the Tirumala Tirupati Devasthanams (TTD). Paid Special Entry tickets are released online in advance, the free Sarva Darshan queue runs every day, and devotees who climb the Alipiri or Srivari Mettu footpaths can receive Divya Darshan tokens. We book what TTD allows for your dates as soon as it opens, keep a spare half-day for the queue, and combine Tirumala with Sri Kalahasti, Kanipakam and the temples of Chennai and Kanchipuram.`,
    pk: ["Tirupati Balaji Darshan Tour", "Tirumala Footpath Darshan", "Tirupati & Chennai Temple Tour"],
    faq: [["How is darshan booked at Tirumala?", "TTD sells paid Special Entry darshan online, usually weeks or months ahead. The free Sarva Darshan queue and the Divya Darshan tokens for pilgrims walking up the footpaths are issued in Tirupati and Tirumala. We book the online tickets for your dates as soon as they open, subject to availability."], ["Which footpath should we climb?", "Alipiri is the main route, about 3,550 steps and three to five hours. Srivari Mettu is shorter, about 2,400 steps and two to three hours. Luggage can be sent up by the TTD service, and there are rest points and water along both paths."], ["When is Tirumala most crowded?", "Brahmotsavam (usually September or October), Vaikunta Ekadasi (December or January), weekends and the summer school holidays. Weekdays outside festivals have the shortest queues."], ["Is there a dress code?", "Yes. Traditional dress is expected for darshan: a dhoti or kurta-pyjama for men, and a saree, half-saree or churidar with a dupatta for women."]],
  },
  {
    s: "shirdi-sai-baba", n: "Shirdi Sai Baba", group: "india", hero: "shirdi", scr: "Shraddha and saburi",
    short: "Darshan and aarti at the Sai Baba Samadhi Mandir, Dwarkamai and Chavadi, with Shani Shingnapur, Nashik, Trimbakeshwar and Mumbai's Siddhivinayak.",
    desc: "Shirdi Sai Baba pilgrimage tours: Samadhi Mandir darshan and aarti passes, Dwarkamai and Chavadi, Shani Shingnapur, Nashik, Trimbakeshwar and Mumbai.",
    who: ["Sai devotees of every faith", "Families and senior pilgrims", "Weekend travellers from Mumbai and Pune"],
    intro: `Sai Baba lived in Shirdi for some sixty years until his samadhi in 1918, and devotees of every faith come to pray at the Samadhi Mandir where his remains rest. The village keeps the places of his life close together: Dwarkamai, the mosque where he lived and kept a sacred fire burning, the Chavadi where he slept on alternate nights, Gurusthan under the neem tree, and the Lendi Baug garden.

The day at Shirdi follows four aartis, Kakad at dawn, Madhyan at noon, Dhoop at sunset and Shej at night, and on Thursdays the palki procession carries Baba's portrait from the Samadhi Mandir. We book darshan and aarti passes on the Sai Sansthan's official site once your dates are fixed, choose hotels within walking distance of the temple, and pair Shirdi with Shani Shingnapur, the Trimbakeshwar Jyotirlinga near Nashik and Siddhivinayak in Mumbai.`,
    pk: ["Shirdi & Nashik Pilgrimage", "Mumbai Siddhivinayak & Shirdi", "Nashik Vineyards & Shirdi", "Maharashtra Heritage Circuit"],
    faq: [["Do I need a pass for Shirdi?", "Darshan in the general queue is free. Paid darshan passes and passes for the Kakad, Madhyan, Dhoop and Shej aartis are sold on the Sai Sansthan's official site, and we book them once your dates are fixed."], ["When is Shirdi busiest?", "Thursdays, weekends and the festivals of Ram Navami, Guru Purnima and Vijayadashami, the anniversary of Baba's samadhi. Weekdays have much shorter queues."], ["How do we get to Shirdi?", "Shirdi Airport has limited flights; most pilgrims fly to Mumbai, Pune or Aurangabad and drive, or take a train to Sainagar Shirdi station. The drive from Mumbai takes about five to six hours."], ["Is there a dress code?", "Modest clothing is requested in the temple complex, with shoulders and knees covered. Shoes are left at the stands outside."]],
  },
  {
    s: "sabarimala-ayyappa", n: "Sabarimala Ayyappa", group: "india", hero: "sabarimala", scr: "Swamiye saranam Ayyappa",
    short: "The Mandala-Makaravilakku pilgrimage to Sabarimala with Virtual-Q booking, group vehicles, the Erumeli route and Guruvayur on the way home.",
    desc: "Sabarimala pilgrimage tours: Virtual-Q booking help, group vehicles to Nilakkal and Pamba, the traditional Erumeli route, and Guruvayur on the way home.",
    who: ["Ayyappa devotees and their groups", "Guru swamis leading first-time Kanni swamis", "Families travelling with elders"],
    intro: `Sabarimala is the forest hill shrine of Lord Ayyappa in the Western Ghats of Kerala, inside the Periyar Tiger Reserve. Devotees observe a 41-day vratham of simple living, wear black or saffron, and carry the irumudi kettu on their heads up the trail from Pamba to climb the eighteen holy steps, the Pathinettam Padi, to the sanctum. Many follow the traditional route through Erumeli, where pilgrims perform the petta thullal and pray at the Vavar mosque.

The temple opens for the Mandala season from about mid-November to late December, again for Makaravilakku until about 20 January, and for the first few days of every Malayalam month. Every pilgrim needs a Virtual-Q slot, booked on the official Sabarimala portal. We help with the booking, arrange vehicles for your whole group as far as Nilakkal, plan rooms around Pathanamthitta, Chengannur or Kottayam, and leave the vratham and irumudi to your guru swami's guidance.`,
    pk: ["Sabarimala Ayyappa Darshan", "Erumeli, Sabarimala & Guruvayur Yatra", "Guruvayur & Kerala Temple Trail"],
    faq: [["When is Sabarimala open?", "For the Mandala season from about mid-November to late December, again for Makaravilakku until about 20 January, and for the first few days of every Malayalam month. The Travancore Devaswom Board announces the exact dates each year, and every pilgrim needs a Virtual-Q booking."], ["Who can make the Sabarimala pilgrimage?", "Devotees traditionally observe a 41-day vratham and carry the irumudi kettu. By custom, women aged 10 to 50 do not make the pilgrimage; the question of entry is before the Supreme Court, and we follow the Travancore Devaswom Board's rules at the time you travel."], ["How hard is the Sabarimala climb?", "It is about 5 km uphill from Pamba to the Sannidhanam on a paved path with steps, and most pilgrims take two to four hours. Dolis carry those who cannot walk, and anyone with heart or breathing problems should see a doctor first."], ["Can you arrange transport for our whole group?", "Yes. We arrange cars, tempo travellers or buses for groups of any size. Private vehicles stop at Nilakkal, and KSRTC buses run the last 22 km to Pamba."]],
  },
  {
    s: "kashi-yatra", n: "Kashi Yatra (Varanasi)", group: "india", hero: "varanasi", scr: "The city of Shiva",
    short: "Kashi Vishwanath, the Ganga aarti, Sarnath, Prayagraj, Gaya pind daan and the Rameswaram–Kashi yatra.",
    desc: "Kashi yatras to Varanasi: Kashi Vishwanath darshan, Ganga aarti, Dev Deepawali, Sarnath, the Kashi–Prayag–Gaya tristhali for ancestral rites and the traditional Rameswaram–Kashi yatra.",
    who: ["Families with elders", "Families performing ancestral rites", "Devotees from Tamil Nadu on the Rameswaram–Kashi yatra"],
    intro: `Kashi, the city of Lord Shiva on the Ganga, is the holiest of the seven sacred cities. Pilgrims come for darshan of the Kashi Vishwanath Jyotirlinga, the evening Ganga aarti at Dashashwamedh Ghat, a dawn boat past the burning ghats of Manikarnika, and the temples of Annapurna, Kaal Bhairav and Sankat Mochan.

Many families combine Kashi with Prayagraj and Gaya, the tristhali of ancestral rites, or follow the Tamil tradition of beginning at Rameswaram and bringing Ganga water back to it. We book darshan, boats and pandas, choose hotels close to the ghats and keep the walking within reach of elders.`,
    pk: ["Kashi Vishwanath & Sarnath", "Varanasi Spiritual Retreat", "Kashi Darshan: Vishwanath, Annapurna & Kaal Bhairav", "Dev Deepawali in Kashi", "Kashi & Ayodhya Yatra", "Prayagraj, Varanasi & Ayodhya Yatra", "Kashi, Prayag & Gaya Tristhali Yatra", "Gaya Pind Daan Yatra", "Rameswaram–Kashi Yatra", "Buddhist Circuit: Varanasi to Bodh Gaya"],
    faq: [["How do I book Kashi Vishwanath darshan?", "The temple trust offers sugam darshan, aarti and rudrabhishek bookings online for set time slots. We book them for your dates where slots are open, and plan the rest of the day around them."], ["What is the Rameswaram–Kashi yatra?", "A traditional pilgrimage for Tamil families: you begin with a bath and puja at Rameswaram, carry sand from there to the Triveni Sangam at Prayagraj, pray at Kashi Vishwanath and perform pind daan at Gaya, then complete the yatra by offering Ganga water at Rameswaram."], ["When is the best time to visit Kashi?", "October to March, when the days are cool. Dev Deepawali at Kartik Purnima in November and Mahashivratri in February or March are the most festive, and the busiest."]],
  },
  {
    s: "char-dham-yatra", n: "Char Dham, Amarnath & Himalayan Yatras", group: "india", hero: "kedarnath--kedarnath-temple", scr: "Himalayan yatras",
    short: "Yamunotri, Gangotri, Kedarnath and Badrinath, plus Vaishno Devi and Amarnath.",
    desc: "Char Dham, Do Dham, Kedarnath, Vaishno Devi and Amarnath yatras with registration, helicopter or pony options and pacing for the altitude.",
    who: ["Families travelling with elders", "First-time Himalayan pilgrims", "Devotees completing the Char Dham"],
    intro: `The Himalayan yatras are the most demanding pilgrimages in India, and the most rewarding. The four dhams of Uttarakhand open on Akshaya Tritiya in April or May and close around Diwali, Vaishno Devi is open all year, and the Amarnath cave is open only for a few weeks in July and August.

We handle the compulsory registrations, book helicopter seats to Kedarnath where available, and plan overnight stops so that no day has too much driving on mountain roads. Ponies, palkis and porters can be arranged at the trailheads.`,
    pk: ["Char Dham Yatra", "Kedarnath & Badrinath Do Dham Yatra", "Kedarnath Yatra", "Haridwar & Rishikesh Pilgrimage", "Vaishno Devi Yatra", "Vaishno Devi & Kashmir", "Amarnath Yatra via Pahalgam", "Amarnath Yatra via Baltal", "Amarnath Yatra by Helicopter", "Vaishno Devi & Amarnath Yatra", "Chopta, Tungnath & Chandrashila Trek"],
    faq: [["When is the best time for the Char Dham Yatra?", "May to June and September to October. The shrines open in late April or May and close around Diwali; July and August bring monsoon landslides on the mountain roads."], ["How fit do I need to be?", "Kedarnath is a 16 km trek each way and Yamunotri 6 km; ponies, palkis and helicopters reduce the walking. Everyone should have a medical check-up before travelling above 3,000 metres."], ["How do I register for the Amarnath Yatra?", "Registration opens in spring through the Shri Amarnathji Shrine Board and its designated banks, and needs a Compulsory Health Certificate from an authorised doctor. Pilgrims must be aged 13 to 70. We guide you through the forms, then collect your RFID card and book helicopter seats where you want them."], ["Pahalgam or Baltal: which Amarnath route is better?", "The Pahalgam route is about 36 km and takes three days up, through Sheshnag and Panchtarni, with a gentler climb. The Baltal route is about 14 km and can be done up and back in a day or two, but it is much steeper. Helicopters fly to Panchtarni from both sides."]],
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
    pk: ["Prayagraj, Varanasi & Ayodhya Yatra", "Magh Mela at the Sangam", "Kashi & Ayodhya Yatra", "Ayodhya Darshan Short Trip", "Braj Darshan: Mathura, Vrindavan & Govardhan", "Mathura Vrindavan Holi Trip", "Golden Triangle & Varanasi", "Dwarka & Somnath Pilgrimage", "Puri Rath Yatra Trip", "Odisha Golden Triangle", "Prayagraj & Chitrakoot Ramayana Trail"],
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
    short: "Ajmer Sharif, Nizamuddin, Fatehpur Sikri, Hazratbal, Nagore, Cheraman Juma Masjid and the mosques of Istanbul.",
    desc: "Ziyarat tours to Ajmer Sharif, Hazrat Nizamuddin, Fatehpur Sikri, Hazratbal in Srinagar, Nagore Dargah and Kerala's Cheraman Juma Masjid, and Islamic heritage tours of Istanbul.",
    who: ["Families on ziyarat", "Travellers of every faith drawn to Sufi music"],
    intro: `India's Sufi shrines are visited by people of every faith. The Dargah of Khwaja Moinuddin Chishti in Ajmer, Hazrat Nizamuddin in Delhi and the Nagore Dargah on the Tamil Nadu coast are places of prayer, music and open kitchens.

We plan visits around Thursday qawwali and the Urs, choose stays within walking distance of the dargah and explain the customs of each shrine. For Umrah in Makkah and Madinah, and ziyarat to Najaf, Karbala and Mashhad, see Umrah & Ziyarat.`,
    pk: ["Ajmer Sharif & Pushkar", "Delhi Sufi Trail & Ajmer Sharif", "Agra, Fatehpur Sikri & Ajmer Sharif", "Hazratbal & Kashmir Sufi Shrines", "Nagore Dargah Ziyarat", "Kochi & Cheraman Juma Masjid", "Velankanni, Nagore & Thanjavur", "Istanbul Mosques & Ottoman Heritage"],
  },
  {
    s: "christian-pilgrimages", n: "Churches & Christian Pilgrimages", group: "faiths", hero: "velankanni", scr: "Basilicas and holy lands",
    short: "Velankanni, San Thome, Old Goa, Kerala's St Thomas shrines, Mother Teresa's Kolkata, the Holy Land, Rome, Lourdes and Fatima.",
    desc: "Christian pilgrimage tours to Velankanni, San Thome in Chennai, Old Goa, Kerala's St Thomas shrines and Mother Teresa's Kolkata, and abroad to the Holy Land, Rome and the Vatican, Lourdes and Fatima.",
    who: ["Parish groups and families", "Feast-day pilgrims"],
    intro: `From the Basilica of Our Lady of Good Health in Velankanni and the Basilica of Bom Jesus in Old Goa to Jerusalem, Rome and Fatima, Christian pilgrimages combine Mass, prayer and the history of the faith.

We plan around feast days, book Papal audience tickets when they are offered, and arrange guides who know the scripture behind each site. Travel to the Holy Land is planned subject to current government travel advice.`,
    pk: ["Velankanni Pilgrimage", "Chennai St Thomas & Velankanni Pilgrimage", "Velankanni, Nagore & Thanjavur", "Kerala St Thomas Christian Trail", "Goa Churches & Old Goa Heritage", "Kolkata: Mother Teresa's City", "Israel Holy Land Tour", "Holy Land: Israel & Jordan", "Rome & Vatican Pilgrimage", "Lourdes & Paris Pilgrimage", "Rome, Lourdes & Fatima Pilgrimage", "Lisbon, Fatima & Porto Pilgrimage"],
    faq: [["When are the big feast days?", "Velankanni's feast runs from 29 August to 8 September, the Feast of St Francis Xavier in Old Goa is on 3 December, Malayattoor's Puthunjayar falls on the Sunday after Easter, and Lourdes marks 11 February. Hotels fill early, so book these dates months ahead."], ["Can you arrange a Papal audience?", "General audiences are free and ticketed by the Prefecture of the Papal Household. We request tickets for your dates when an audience is scheduled, but they cannot be guaranteed."]],
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
    s: "umrah-ziyarat", n: "Umrah & Ziyarat", group: "abroad", hero: "madinah", scr: "Makkah, Madinah, Najaf, Karbala, Mashhad",
    short: "Umrah in Makkah and Madinah with our licensed partner, Ramadan Umrah, and ziyarat to Najaf, Karbala and Mashhad.",
    desc: "Umrah packages to Makkah and Madinah arranged with our licensed Umrah partner, Ramadan Umrah, Umrah with Istanbul, and ziyarat tours to Najaf, Karbala and Mashhad.",
    who: ["Families on their first Umrah", "Elders who need a gentle pace", "Shia pilgrims on ziyarat"],
    intro: `Umrah can be performed at any time of year. Pilgrims enter ihram at the miqat, perform tawaf around the Kaaba and sa'i between Safa and Marwah in Makkah, and then visit the Prophet's Mosque in Madinah, travelling between the two cities on the Haramain high-speed train.

We plan Umrah together with our licensed Umrah partner, who arranges the Umrah visa and Nusuk permits, while we look after flights from India, hotels close to the Haram and the Prophet's Mosque, a mutawwif and ziyarat tours. Hajj places for Indian pilgrims are allotted only through the Haj Committee of India and Ministry-approved Hajj Group Organisers, so we do not sell Hajj.

For ziyarat, we plan journeys to the shrine of Imam Ali in Najaf, Imam Hussain and Hazrat Abbas in Karbala, and Imam Reza in Mashhad, only when government travel advice allows.`,
    pk: ["Umrah Package", "Umrah with Extended Madinah Stay", "Ramadan Umrah: Last Ten Nights", "Umrah & Istanbul", "Iraq Ziyarat: Najaf & Karbala", "Arbaeen Walk to Karbala", "Iran & Iraq Ziyarat"],
    faq: [["Who arranges the Umrah visa?", "Our licensed Umrah partner applies for the Umrah visa and Nusuk permits. You need a passport valid for at least six months and the vaccinations Saudi Arabia requires at the time, such as meningitis; we send the current list with your quote."], ["Can women travel for Umrah without a mahram?", "Saudi rules now allow women to perform Umrah without a mahram in an organised group. We confirm the current rule for your dates when you enquire."], ["Can you arrange Hajj?", "No. Hajj places for Indian pilgrims are allotted through the Haj Committee of India and Ministry-approved Hajj Group Organisers. We can help with Umrah at other times of the year."]],
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
