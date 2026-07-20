import { useParams, Navigate, Link } from "react-router-dom";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { SectionLabel } from "../components/ui/SectionLabel";
import { CtaBanner } from "../components/ui/CtaBanner";
import { SERVICES } from "../data/services";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) return <Navigate to="/services" replace />;

  const Icon = service.icon;
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <Layout>
      <InteractiveVideoHero
        label="Offering"
        icon={Icon}
        title={service.name}
        description={service.description}
        size="md"
      >
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="font-inter text-2xl font-bold text-white">{service.startingAt}</div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-white/50">Starting At</div>
          </div>
          <div>
            <div className="font-inter text-2xl font-bold text-white">{service.timeline}</div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-white/50">Typical Timeline</div>
          </div>
        </div>
      </InteractiveVideoHero>

      {/* Deliverables + Process */}
      <section className="border-b border-white/10 bg-black py-24 lg:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <SectionLabel>What's Included</SectionLabel>
              <h2 className="mt-6 font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
                Deliverables
              </h2>
              <ul className="mt-8 space-y-4">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-inter text-sm text-white/70 sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={1}>
              <SectionLabel>How It Works</SectionLabel>
              <h2 className="mt-6 font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
                Process
              </h2>
              <div className="mt-8 space-y-6">
                {service.process.map((step, i) => (
                  <div key={step.title} className="flex gap-5 border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
                    <span className="font-podium text-2xl text-white/25">0{i + 1}</span>
                    <div>
                      <h3 className="font-podium text-base uppercase tracking-tight text-white">
                        {step.title}
                      </h3>
                      <p className="mt-1 font-inter text-sm leading-relaxed text-white/60">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Other services */}
      <section className="bg-black py-24 lg:py-32">
        <Container>
          <Reveal className="mb-12 max-w-xl">
            <SectionLabel>Explore More</SectionLabel>
            <h2 className="mt-6 font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
              Other offerings
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {otherServices.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <Link
                  to={`/services/${s.slug}`}
                  className="group block border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
                >
                  <h3 className="font-podium text-lg uppercase tracking-tight text-white">
                    {s.name}
                  </h3>
                  <p className="mt-2 font-inter text-sm leading-relaxed text-white/60">
                    {s.shortDescription}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-inter text-xs uppercase tracking-widest text-white/50">
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        title={`Ready to talk about ${service.name.toLowerCase()}?`}
        buttonLabel="GET A PROPOSAL"
      />
    </Layout>
  );
}
