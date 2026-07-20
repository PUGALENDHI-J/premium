import { Briefcase, Heart } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Button } from "../components/ui/Button";
import { CtaBanner } from "../components/ui/CtaBanner";
import { JOBS, BENEFITS } from "../data/misc";

export default function Careers() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="Careers"
        icon={Briefcase}
        title={
          <>
            <span className="block">Build your best work</span>
            <span className="block">alongside people who care.</span>
          </>
        }
        description="We're a small, senior team that believes great work comes from trust, autonomy, and genuinely caring about the craft."
      />

      {/* Benefits */}
      <section className="border-b border-white/10 bg-black py-24 lg:py-32">
        <Container>
          <Reveal className="max-w-2xl">
            <SectionLabel icon={Heart}>Why Vanguard</SectionLabel>
            <h2 className="mt-6 font-podium text-[clamp(1.8rem,3.5vw,2.75rem)] uppercase leading-tight tracking-tight text-white">
              Benefits worth showing up for.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, i) => (
              <Reveal key={benefit.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]">
                  <h3 className="font-podium text-base uppercase tracking-tight text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 font-inter text-sm leading-relaxed text-white/60">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Open roles */}
      <section className="bg-black py-24 lg:py-32">
        <Container>
          <Reveal className="mb-12 max-w-xl">
            <SectionLabel>Join The Team</SectionLabel>
            <h2 className="mt-6 font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
              Open Positions
            </h2>
          </Reveal>

          <div>
            {JOBS.map((job, i) => (
              <Reveal
                key={job.title}
                delay={(i % 4) as 0 | 1 | 2 | 3}
                className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between first:border-t-0"
              >
                <div>
                  <h3 className="font-podium text-lg uppercase tracking-tight text-white sm:text-xl">
                    {job.title}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-inter text-xs uppercase tracking-widest text-white/50">
                    <span>{job.department}</span>
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <Button href="/contact" variant="outline">
                  APPLY NOW
                </Button>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Don't See Your Role?"
        title="We're always open to meeting exceptional people."
        buttonLabel="INTRODUCE YOURSELF"
      />
    </Layout>
  );
}
