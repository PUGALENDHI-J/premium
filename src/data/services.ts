import {
  Fingerprint,
  Layers,
  MonitorSmartphone,
  Palette,
  Rocket,
  Video,
} from "lucide-react";

export type Service = {
  slug: string;
  icon: typeof Fingerprint;
  name: string;
  shortDescription: string;
  description: string;
  deliverables: string[];
  process: { title: string; description: string }[];
  startingAt: string;
  timeline: string;
};

export const SERVICES: Service[] = [
  {
    slug: "brand-identity",
    icon: Fingerprint,
    name: "Brand Identity",
    shortDescription: "Naming, logo systems, and visual identity built to be unmistakable.",
    description:
      "We craft brand identities that don't blend in. From naming and logo systems to color, type, and voice, every element is engineered to make your brand instantly recognizable and impossible to ignore.",
    deliverables: [
      "Naming & positioning",
      "Logo & mark system",
      "Color & typography system",
      "Brand guidelines",
      "Stationery & applications",
    ],
    process: [
      { title: "Discover", description: "Deep dive into your market, audience, and ambitions." },
      { title: "Define", description: "Lock the positioning and creative territory." },
      { title: "Design", description: "Explore, refine, and finalize the visual system." },
      { title: "Deliver", description: "Ship a complete, documented brand toolkit." },
    ],
    startingAt: "$12,000",
    timeline: "4–6 weeks",
  },
  {
    slug: "web-design-development",
    icon: MonitorSmartphone,
    name: "Web Design & Development",
    shortDescription: "High-performance, animation-rich websites that convert.",
    description:
      "Your website is your storefront, your pitch deck, and your first impression — all at once. We design and build fast, animated, conversion-focused sites that feel as premium as your brand.",
    deliverables: [
      "UX strategy & sitemap",
      "High-fidelity design system",
      "Custom animation & motion",
      "Responsive front-end build",
      "CMS integration & handoff",
    ],
    process: [
      { title: "Strategize", description: "Map the user journey and information architecture." },
      { title: "Design", description: "Design every screen, state, and breakpoint." },
      { title: "Build", description: "Develop with clean, performant, production-ready code." },
      { title: "Launch", description: "QA, optimize, and ship with confidence." },
    ],
    startingAt: "$18,000",
    timeline: "6–10 weeks",
  },
  {
    slug: "motion-animation",
    icon: Video,
    name: "Motion & Animation",
    shortDescription: "Scroll-triggered, cinematic motion that brings brands to life.",
    description:
      "Static is forgettable. We create signature motion systems — scroll reveals, micro-interactions, and cinematic transitions — that make your product and brand genuinely memorable.",
    deliverables: [
      "Motion design language",
      "Scroll-triggered animation",
      "Micro-interactions",
      "Product & launch video edits",
      "Lottie / video asset delivery",
    ],
    process: [
      { title: "Storyboard", description: "Plan the motion narrative and key moments." },
      { title: "Prototype", description: "Test timing, easing, and interaction feel." },
      { title: "Animate", description: "Produce final, polished motion assets." },
      { title: "Integrate", description: "Implement performantly across your product." },
    ],
    startingAt: "$9,000",
    timeline: "3–5 weeks",
  },
  {
    slug: "product-ui-ux",
    icon: Layers,
    name: "Product UI/UX",
    shortDescription: "Interfaces engineered for clarity, speed, and delight.",
    description:
      "We design digital products that people actually enjoy using. Research-backed UX, meticulous UI, and a design system that scales with your product roadmap.",
    deliverables: [
      "User research & flows",
      "Wireframes & prototypes",
      "Component-based design system",
      "Accessibility review",
      "Developer-ready handoff",
    ],
    process: [
      { title: "Research", description: "Understand users, edge cases, and business goals." },
      { title: "Architect", description: "Structure flows, IA, and core interactions." },
      { title: "Design", description: "Craft high-fidelity, on-brand interfaces." },
      { title: "Test", description: "Validate with users and refine before handoff." },
    ],
    startingAt: "$15,000",
    timeline: "5–9 weeks",
  },
  {
    slug: "art-direction",
    icon: Palette,
    name: "Art Direction",
    shortDescription: "Campaign concepts and visual worlds for major moments.",
    description:
      "From product launches to funding announcements, we build the visual world around your biggest moments — concept, photography direction, and cohesive campaign assets.",
    deliverables: [
      "Creative concept & mood",
      "Photo & video shoot direction",
      "Campaign asset system",
      "Social & paid adaptations",
      "Launch playbook",
    ],
    process: [
      { title: "Concept", description: "Develop the big creative idea and territory." },
      { title: "Direct", description: "Guide production, shoots, and content capture." },
      { title: "Produce", description: "Craft the full asset suite across channels." },
      { title: "Roll Out", description: "Package everything for a coordinated launch." },
    ],
    startingAt: "$14,000",
    timeline: "4–7 weeks",
  },
  {
    slug: "growth-launch",
    icon: Rocket,
    name: "Growth & Launch",
    shortDescription: "Go-to-market strategy and conversion-focused execution.",
    description:
      "Great design should move numbers. We pair creative execution with growth strategy — messaging, funnels, and launch sequencing — so your next release actually lands.",
    deliverables: [
      "Go-to-market strategy",
      "Messaging & positioning",
      "Landing page optimization",
      "Launch sequencing plan",
      "Post-launch performance review",
    ],
    process: [
      { title: "Plan", description: "Define goals, channels, and success metrics." },
      { title: "Prepare", description: "Build assets, funnels, and messaging." },
      { title: "Launch", description: "Execute the coordinated go-to-market plan." },
      { title: "Optimize", description: "Review performance and iterate fast." },
    ],
    startingAt: "$10,000",
    timeline: "3–6 weeks",
  },
];
