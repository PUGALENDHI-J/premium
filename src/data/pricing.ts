export type PricingTier = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Launch",
    price: "$9,000",
    cadence: "starting price",
    description: "For early-stage brands that need a sharp, credible foundation fast.",
    features: [
      "Brand identity or single web project",
      "1 dedicated designer",
      "2 concept directions",
      "3 weeks average turnaround",
      "30 days of post-launch support",
    ],
  },
  {
    name: "Momentum",
    price: "$24,000",
    cadence: "starting price",
    description: "For growing companies investing in a full brand and digital presence.",
    features: [
      "Brand identity + web design & build",
      "Dedicated design + dev pod",
      "3 concept directions",
      "Motion & animation included",
      "90 days of post-launch support",
      "Quarterly brand check-in",
    ],
    highlighted: true,
  },
  {
    name: "Vanguard Partner",
    price: "Custom",
    cadence: "retainer",
    description: "For companies that want an embedded creative team, ongoing.",
    features: [
      "Full-service creative retainer",
      "Dedicated senior pod on-call",
      "Unlimited scoped requests",
      "Priority turnaround SLAs",
      "Quarterly strategy sessions",
      "Direct access to leadership",
    ],
  },
];

export const PRICING_FAQS = [
  {
    question: "How is pricing determined for a project?",
    answer:
      "Pricing depends on scope, timeline, and the mix of services involved. Most engagements fall within our published starting prices; custom retainers are scoped individually after a discovery call.",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "Yes — we typically require 50% to begin work, with the remaining balance split across project milestones or due on delivery for smaller engagements.",
  },
  {
    question: "Can we start with a smaller project first?",
    answer:
      "Absolutely. Many long-term partners started with a single Launch-tier project before expanding into an ongoing retainer once trust was established.",
  },
];
