export type CaseStudy = {
  slug: string;
  client: string;
  category: string;
  year: string;
  summary: string;
  challenge: string;
  approach: string;
  result: string;
  stats: { value: string; label: string }[];
  image: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "nordveil-rebrand",
    client: "Nordveil",
    category: "Brand Identity",
    year: "2025",
    summary: "A full identity overhaul for a Nordic outerwear label entering the US market.",
    challenge:
      "Nordveil needed to shed a dated, generic look before a major US retail push — without losing the Scandinavian heritage their loyal customers valued.",
    approach:
      "We rebuilt the identity around a sharpened wordmark, a restrained monochrome palette, and a modular grid system that flexed across packaging, retail, and digital.",
    result:
      "Retail partners signed on within two months of the rebrand reveal, and brand recognition in surveyed focus groups rose sharply.",
    stats: [
      { value: "3.4x", label: "Brand Recall Lift" },
      { value: "12", label: "New Retail Partners" },
      { value: "6 wks", label: "Concept to Launch" },
    ],
    image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "ferro-app-redesign",
    client: "Ferro",
    category: "Product UI/UX",
    year: "2025",
    summary: "Redesigning a fintech app's core flows to cut onboarding drop-off in half.",
    challenge:
      "Ferro's onboarding flow was losing nearly half of new users before their first transaction, and support tickets around confusion were climbing.",
    approach:
      "We ran rapid user testing, simplified the flow from nine steps to four, and rebuilt the interface with clearer hierarchy and progressive disclosure.",
    result:
      "Onboarding completion improved dramatically within the first month post-launch, with support volume dropping in parallel.",
    stats: [
      { value: "+58%", label: "Onboarding Completion" },
      { value: "-41%", label: "Support Tickets" },
      { value: "9→4", label: "Steps Reduced" },
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "atlas-motion-system",
    client: "Atlas Robotics",
    category: "Motion & Animation",
    year: "2024",
    summary: "A cinematic motion language for a robotics company's product reveal.",
    challenge:
      "Atlas needed to unveil its flagship robotics platform to investors and press with visuals that matched the sophistication of the hardware itself.",
    approach:
      "We built a signature motion system — precise, mechanical easing curves paired with cinematic camera moves — used across the reveal film, site, and deck.",
    result:
      "The reveal film became the centerpiece of a funding round that closed within six weeks of launch.",
    stats: [
      { value: "2.1M", label: "Reveal Views" },
      { value: "$40M", label: "Round Closed" },
      { value: "6 wks", label: "Post-Reveal" },
    ],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "havenly-web-platform",
    client: "Havenly Goods",
    category: "Web Design & Development",
    year: "2024",
    summary: "A high-converting commerce platform for a direct-to-consumer home brand.",
    challenge:
      "Havenly's existing site was slow, generic, and converting well below category benchmarks despite strong paid traffic.",
    approach:
      "We rebuilt the site from scratch with a custom design system, sub-second load times, and conversion-focused product storytelling throughout.",
    result:
      "Conversion rate more than doubled within the first full quarter post-launch, with average order value climbing alongside it.",
    stats: [
      { value: "+118%", label: "Conversion Rate" },
      { value: "+34%", label: "Avg. Order Value" },
      { value: "0.9s", label: "Load Time" },
    ],
    image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "kindred-campaign",
    client: "Kindred Health",
    category: "Art Direction",
    year: "2024",
    summary: "Campaign art direction for a telehealth brand's national launch.",
    challenge:
      "Kindred needed a national campaign that felt human and trustworthy in a category crowded with clinical, sterile visuals.",
    approach:
      "We directed an original photo and film shoot centered on real patient stories, paired with warm, editorial art direction across every touchpoint.",
    result:
      "The campaign drove Kindred's strongest quarter of user acquisition since launch, with earned media coverage across major outlets.",
    stats: [
      { value: "4.2x", label: "Acquisition Growth" },
      { value: "18", label: "Press Placements" },
      { value: "92%", label: "Positive Sentiment" },
    ],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "summit-launch-strategy",
    client: "Summit Gear Co.",
    category: "Growth & Launch",
    year: "2023",
    summary: "Go-to-market strategy and execution for a new outdoor apparel line.",
    challenge:
      "Summit was entering a saturated outdoor apparel market with no existing audience and a tight pre-order launch window.",
    approach:
      "We built the messaging, landing experience, and phased launch sequence — from waitlist to pre-order to public release — with performance tracked at every stage.",
    result:
      "The launch sold through its entire first production run before public release, funding the second run outright.",
    stats: [
      { value: "100%", label: "Pre-Sell Through" },
      { value: "14K", label: "Waitlist Signups" },
      { value: "5 wks", label: "Full Sequence" },
    ],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1600&auto=format&fit=crop",
  },
];
