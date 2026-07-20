import { Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { CtaBanner } from "../components/ui/CtaBanner";
import { SERVICES } from "../data/services";

export default function Services() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="Offerings"
        icon={Layers}
        title={
          <>
            <span className="block">Everything a brand</span>
            <span className="block">needs to lead.</span>
          </>
        }
        description="From first identity to full digital product, we cover every discipline required to build a brand that competitors can't ignore."
      />

      <section className="bg-black py-24 lg:py-32">
        <Container>
          <div className="grid gap-px overflow-hidden bg-white/10 sm:grid-cols-2">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.slug} delay={(i % 4) as 0 | 1 | 2 | 3} className="bg-black">
                  <Link
                    to={`/services/${service.slug}`}
                    className="group flex h-full flex-col justify-between p-10 transition-colors duration-500 hover:bg-white/[0.04] lg:p-12"
                  >
                    <div>
                      <Icon className="h-8 w-8 text-white/60" strokeWidth={1.5} />
                      <h2 className="mt-8 font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
                        {service.name}
                      </h2>
                      <p className="mt-4 max-w-sm font-inter text-sm leading-relaxed text-white/60">
                        {service.shortDescription}
                      </p>
                    </div>
                    <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                      <span className="font-inter text-xs uppercase tracking-widest text-white/50">
                        From {service.startingAt}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-white/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Not Sure Where to Start?"
        title="Tell us what you're building — we'll recommend the right scope."
        buttonLabel="TALK TO US"
      />
    </Layout>
  );
}
