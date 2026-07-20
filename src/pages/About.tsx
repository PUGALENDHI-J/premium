import { Users, Target, Sparkle } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { SectionLabel } from "../components/ui/SectionLabel";
import { CtaBanner } from "../components/ui/CtaBanner";
import { TEAM, VALUES } from "../data/misc";

const STORY_STATS = [
  { value: "2016", label: "Studio Founded" },
  { value: "250+", label: "Brands Transformed" },
  { value: "18", label: "Team Members" },
  { value: "95%", label: "Client Retention" },
];

export default function About() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="The Studio"
        icon={Users}
        title={
          <>
            <span className="block">We're a small team</span>
            <span className="block">obsessed with craft.</span>
          </>
        }
        description="Vanguard is an independent brand and digital studio founded on a simple belief: most creative work is forgettable because most teams optimize for safe. We don't."
      />

      {/* Story */}
      <section className="border-b border-white/10 bg-black py-24 lg:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <SectionLabel icon={Target}>Our Story</SectionLabel>
              <h2 className="mt-6 font-podium text-[clamp(1.8rem,3.5vw,2.75rem)] uppercase leading-tight tracking-tight text-white">
                Founded on a refusal to build anything ordinary.
              </h2>
            </Reveal>
            <Reveal delay={1} className="space-y-5 font-inter text-sm leading-relaxed text-white/70 sm:text-base">
              <p>
                Vanguard started in 2016 as a two-person studio taking on brand identity projects
                that bigger agencies considered too small to matter. We took them seriously anyway —
                and the brands we built noticed.
              </p>
              <p>
                A decade later, we're an 18-person team spanning brand strategy, design, motion, and
                engineering — but the standard hasn't moved. Every project still gets the same level
                of obsession the first one did.
              </p>
              <p>
                We work with founders and marketing leaders who are done accepting "good enough,"
                and who understand that a genuinely distinctive brand is one of the few durable
                competitive advantages left.
              </p>
            </Reveal>
          </div>

          <Reveal delay={2} className="mt-20 grid grid-cols-2 gap-8 border-t border-white/10 pt-12 sm:grid-cols-4">
            {STORY_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-inter text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-widest text-white/50 sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Values */}
      <section className="border-b border-white/10 bg-black py-24 lg:py-32">
        <Container>
          <Reveal className="max-w-2xl">
            <SectionLabel icon={Sparkle}>What We Believe</SectionLabel>
            <h2 className="mt-6 font-podium text-[clamp(1.8rem,3.5vw,2.75rem)] uppercase leading-tight tracking-tight text-white">
              The principles behind every project.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]">
                  <div className="font-podium text-3xl text-white/30">0{i + 1}</div>
                  <h3 className="mt-4 font-podium text-lg uppercase tracking-tight text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 font-inter text-sm leading-relaxed text-white/60">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-black py-24 lg:py-32">
        <Container>
          <Reveal className="max-w-2xl">
            <SectionLabel icon={Users}>Leadership</SectionLabel>
            <h2 className="mt-6 font-podium text-[clamp(1.8rem,3.5vw,2.75rem)] uppercase leading-tight tracking-tight text-white">
              The people behind the work.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={(i % 4) as 0 | 1 | 2 | 3} className="border-t border-white/10 pt-6">
                <h3 className="font-podium text-xl uppercase tracking-tight text-white">
                  {member.name}
                </h3>
                <p className="mt-1 font-inter text-xs uppercase tracking-widest text-white/50">
                  {member.role}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Join Forces"
        title="Think we'd be a good fit for your next project?"
        buttonLabel="START A CONVERSATION"
      />
    </Layout>
  );
}
