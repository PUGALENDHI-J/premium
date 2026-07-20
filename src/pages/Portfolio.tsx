import { Link } from "react-router-dom";
import { Briefcase, ArrowUpRight } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { CtaBanner } from "../components/ui/CtaBanner";
import { CASE_STUDIES } from "../data/caseStudies";

export default function Portfolio() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="Selected Work"
        icon={Briefcase}
        title={
          <>
            <span className="block">Proof, not</span>
            <span className="block">promises.</span>
          </>
        }
        description="A selection of brand, product, and campaign work — each one measured by real business outcomes, not just design awards."
      />

      <section className="bg-black py-24 lg:py-32">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2">
            {CASE_STUDIES.map((study, i) => (
              <Reveal key={study.slug} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <Link to={`/portfolio/${study.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                    <img
                      src={study.image}
                      alt={study.client}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />
                    <span className="absolute right-4 top-4 border border-white/30 bg-black/60 px-3 py-1 font-inter text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
                      {study.category}
                    </span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-podium text-xl uppercase tracking-tight text-white sm:text-2xl">
                        {study.client}
                      </h2>
                      <p className="mt-1 font-inter text-sm text-white/60">{study.summary}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Your Project, Next"
        title="Want results like these for your brand?"
        buttonLabel="START A PROJECT"
      />
    </Layout>
  );
}
