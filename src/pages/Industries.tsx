import { Building2 } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { CtaBanner } from "../components/ui/CtaBanner";
import { INDUSTRIES } from "../data/misc";

export default function Industries() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="Industries We Serve"
        icon={Building2}
        title={
          <>
            <span className="block">Range without</span>
            <span className="block">generic-ness.</span>
          </>
        }
        description="Every industry has its own visual clichés. We know them well enough to help you avoid them."
      />

      <section className="bg-black py-24 lg:py-32">
        <Container>
          <div className="grid gap-px overflow-hidden bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((industry, i) => (
              <Reveal key={industry.name} delay={(i % 4) as 0 | 1 | 2 | 3} className="bg-black p-10">
                <span className="font-podium text-3xl text-white/20">0{i + 1}</span>
                <h2 className="mt-6 font-podium text-xl uppercase tracking-tight text-white">
                  {industry.name}
                </h2>
                <p className="mt-3 font-inter text-sm leading-relaxed text-white/60">
                  {industry.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Don't See Your Industry?"
        title="If your brand needs to stand out, we probably want to work on it."
        buttonLabel="LET'S TALK"
      />
    </Layout>
  );
}
