import { Workflow, ShieldCheck } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { SectionLabel } from "../components/ui/SectionLabel";
import { CtaBanner } from "../components/ui/CtaBanner";
import { PROCESS_STEPS, PROCESS_PRINCIPLES } from "../data/process";

export default function Process() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="How We Work"
        icon={Workflow}
        title={
          <>
            <span className="block">A process built</span>
            <span className="block">for momentum.</span>
          </>
        }
        description="No black-box mystery, no endless revision loops. Six clear stages, senior hands the whole way through."
      />

      {/* Steps */}
      <section className="border-b border-white/10 bg-black py-24 lg:py-32">
        <Container>
          <div className="space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal
                key={step.number}
                delay={(i % 4) as 0 | 1 | 2 | 3}
                className="grid grid-cols-1 items-start gap-4 border-t border-white/10 py-10 sm:grid-cols-[100px_1fr_auto] sm:items-center sm:gap-8 first:border-t-0"
              >
                <span className="font-podium text-4xl text-white/25 sm:text-5xl">{step.number}</span>
                <div>
                  <h2 className="font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
                    {step.title}
                  </h2>
                  <p className="mt-2 max-w-lg font-inter text-sm leading-relaxed text-white/60 sm:text-base">
                    {step.description}
                  </p>
                </div>
                <span className="font-inter text-xs uppercase tracking-widest text-white/40 sm:text-right">
                  {step.duration}
                </span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section className="bg-black py-24 lg:py-32">
        <Container>
          <Reveal className="max-w-2xl">
            <SectionLabel icon={ShieldCheck}>Our Commitments</SectionLabel>
            <h2 className="mt-6 font-podium text-[clamp(1.8rem,3.5vw,2.75rem)] uppercase leading-tight tracking-tight text-white">
              Principles we don't compromise on.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {PROCESS_PRINCIPLES.map((principle, i) => (
              <Reveal key={principle.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]">
                  <h3 className="font-podium text-lg uppercase tracking-tight text-white">
                    {principle.title}
                  </h3>
                  <p className="mt-3 font-inter text-sm leading-relaxed text-white/60">
                    {principle.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Ready When You Are"
        title="Let's map your project onto this process."
        buttonLabel="START A PROJECT"
      />
    </Layout>
  );
}
