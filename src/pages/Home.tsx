import { Link } from "react-router-dom";
import { ArrowUpRight, Award, Crown } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { ImageSequenceHero } from "../components/ui/ImageSequenceHero";

// Exported frame sequence that replaces the old background video. Frames
// live at /public/frames/frame0001.jpg ... frame0051.jpg.
const HERO_FRAME_COUNT = 51;

const STATS = [
  { value: "250+", label: "Brands Transformed" },
  { value: "95%", label: "Client Retention" },
  { value: "10+", label: "Years in the Game" },
];

export default function Home() {
  return (
    <Layout navVariant="transparent">
      <ImageSequenceHero basePath="/frames" frameCount={HERO_FRAME_COUNT}>
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero content */}
        <div className="relative z-20 flex h-[calc(100vh-88px)] flex-col justify-center px-6 sm:px-10 lg:px-16 lg:h-[calc(100vh-112px)]">
          {/* Tagline */}
          <div className="animate-fade-up mb-6 flex items-center gap-2.5 lg:mb-8">
            <Crown className="h-4 w-4 text-white/70" />
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
              World-Class Digital Collective
            </span>
          </div>

          {/* Main heading */}
          <h2 className="animate-fade-up-delay-1 font-podium text-[clamp(2.8rem,8vw,7rem)] uppercase leading-[0.92] tracking-tight text-white">
            <span className="block">Design.</span>
            <span className="block">Disrupt.</span>
            <span className="block">Conquer.</span>
          </h2>

          {/* Subtext */}
          <p className="animate-fade-up-delay-2 mt-6 max-w-md font-inter text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8">
            We build fierce brand identities
            <br />
            that don't just turn heads --{" "}
            <span className="font-bold text-white">they lead.</span>
          </p>

          {/* CTA row */}
          <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-10">
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 bg-black px-5 py-3 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-neutral-900 sm:px-7 sm:py-4 sm:text-xs"
            >
              SEE OUR WORK
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <div className="hidden items-center gap-3 sm:flex">
              <Award className="h-8 w-8 text-white/50" />
              <div className="font-inter text-xs uppercase tracking-wider text-white/60">
                <span className="block">Top-Rated</span>
                <span className="block">Brand Studio</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up-delay-4 mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-inter text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-[9px] uppercase tracking-widest text-white/50 sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ImageSequenceHero>
    </Layout>
  );
}
