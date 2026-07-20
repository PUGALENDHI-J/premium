export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
  image: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-most-rebrands-fail",
    title: "Why Most Rebrands Fail Before They Launch",
    excerpt:
      "The problem usually isn't the design — it's that the strategy was never agreed on in the first place.",
    category: "Strategy",
    date: "June 2, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop",
    content: [
      "Most failed rebrands don't fail in the design studio. They fail months earlier, in a kickoff meeting where five stakeholders quietly agreed to disagree on what the brand was actually for.",
      "Design can only execute a strategy — it can't invent consensus that was never there. When we start a project, the first deliverable isn't a mood board. It's a single-page positioning statement that every stakeholder has to actually sign off on, in writing, before a single pixel moves.",
      "That document becomes the arbiter for every disagreement that follows. Don't like the color palette? Let's check it against the positioning. Think the tone is too playful? Same test. It turns subjective debates into structured ones.",
      "The brands that get this right treat strategy as a real deliverable, not a preamble to the fun part. The ones that skip it end up with a beautiful logo attached to a brand nobody can actually describe in one sentence.",
    ],
  },
  {
    slug: "designing-for-motion-not-decoration",
    title: "Designing for Motion, Not Decoration",
    excerpt:
      "Animation that exists to impress rarely survives contact with real users. Here's how we think about motion with purpose.",
    category: "Design",
    date: "May 14, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
    content: [
      "The easiest way to spot decorative animation is to mute it, mentally, and ask whether the interface still makes sense. If the answer is no, the motion was probably load-bearing. If the answer is yes, it might just be noise.",
      "We treat every animation as a piece of information: a fade-up tells the eye where to look next, a scale-in confirms an action was received, a staggered reveal establishes hierarchy in a list. Every one of those has a job.",
      "That doesn't mean motion can't be expressive — some of our favorite work leans hard into personality. But even the boldest motion systems we've shipped were built on the same skeleton of purposeful, consistent timing and easing.",
      "The tell of a mature motion system isn't how flashy it looks in a showreel. It's how invisible it feels while you're actually using the product.",
    ],
  },
  {
    slug: "pricing-creative-work-honestly",
    title: "How We Price Creative Work (and Why We're Transparent About It)",
    excerpt:
      "Opaque pricing breeds distrust. We'd rather tell you the range upfront and earn the rest of the conversation.",
    category: "Business",
    date: "April 22, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop",
    content: [
      "For years, agency pricing was treated like a poker hand — never shown until the very end of a sales process, adjusted based on how much budget a client seemed to have rather than the actual scope of work.",
      "We publish starting prices for a simple reason: it saves everyone time. If a founder knows a brand identity engagement starts around $12,000, they can self-select into or out of a conversation before either of us invests hours in it.",
      "Custom scopes still get custom pricing, but the starting point is never a mystery. We'd rather lose a mismatched lead early than have an uncomfortable budget conversation three meetings in.",
      "Transparency isn't just an ethical stance for us — it's also, frankly, a better sales strategy. The clients who reach out already know roughly what to expect, and the conversations move faster because of it.",
    ],
  },
  {
    slug: "brand-consistency-across-channels",
    title: "Keeping a Brand Consistent Across Twelve Different Channels",
    excerpt:
      "A brand system is only as strong as its weakest touchpoint. Here's how we build systems that hold up everywhere.",
    category: "Systems",
    date: "March 30, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=1600&auto=format&fit=crop",
    content: [
      "A brand guideline PDF is where most consistency efforts go to die. It gets built, it gets admired once, and then six months later the Instagram templates look nothing like the website, which looks nothing like the sales deck.",
      "The fix isn't a longer PDF. It's building the system as reusable components from day one — Figma libraries, code components, and templated assets that make the on-brand choice the easiest choice, not an extra step.",
      "We also build what we call a 'minimum viable brand kit' for every channel a client actually uses, rather than a generic one-size-fits-all guideline. Social has different rules than print, which has different rules than product UI.",
      "Consistency isn't about rigid enforcement — it's about making it easier to stay on-brand than to drift off it. When the system does that work, the brand holds together even as more people touch it.",
    ],
  },
  {
    slug: "hiring-your-first-in-house-designer",
    title: "When to Hire Your First In-House Designer (and When Not To)",
    excerpt:
      "We get this question constantly from growing clients. The honest answer depends less on headcount than on repetition.",
    category: "Strategy",
    date: "March 4, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
    content: [
      "The question we hear most from growing clients isn't 'should we ever hire in-house' — it's 'should we hire instead of you, right now.' The answer is almost always about repetition, not budget.",
      "If your design needs are high-frequency and low-variance — resizing the same ad templates, shipping the same style of product screen weekly — an in-house hire usually pays for itself quickly.",
      "If your needs are high-variance and strategic — a rebrand every few years, occasional campaign pushes, an annual site redesign — an embedded agency partner is usually more efficient than a full-time salary and benefits package.",
      "Many of our longest partnerships are actually hybrid: an in-house designer handles day-to-day execution, and we step in for strategic, high-stakes projects a few times a year. Neither model is inherently better — it depends entirely on your rhythm of work.",
    ],
  },
  {
    slug: "state-of-web-animation-2026",
    title: "The State of Web Animation in 2026",
    excerpt:
      "Scroll-driven storytelling is no longer a novelty — it's table stakes. Here's what's actually working right now.",
    category: "Design",
    date: "February 11, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop",
    content: [
      "Five years ago, scroll-triggered animation was a differentiator. Today, its absence is what stands out — and usually not in a good way. Users have been trained by a generation of sites to expect content to arrive with intention.",
      "What's changed is subtlety. The best sites we've studied this year use shorter, faster reveals — 400 to 800 milliseconds, not the sluggish two-second fades that were common a few years back.",
      "Stagger effects remain the highest-leverage technique in the toolkit: revealing a grid of cards or list items with a slight delay between each does more to communicate hierarchy than almost any other single animation choice.",
      "The biggest mistake we still see is animating everything with the same weight. Not every element deserves a dramatic entrance — reserve emphasis for the moments that actually matter, and let secondary content settle in quietly.",
    ],
  },
];
