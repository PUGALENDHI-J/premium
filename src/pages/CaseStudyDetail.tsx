import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { Reveal } from "../components/ui/Reveal";
import { SectionLabel } from "../components/ui/SectionLabel";
import { CtaBanner } from "../components/ui/CtaBanner";
import { CASE_STUDIES } from "../data/caseStudies";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const study = CASE_STUDIES.find((s) => s.slug === slug);

  if (!study) return <Navigate to="/portfolio" replace />;

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-white/10 bg-black pt-36 sm:pt-40 lg:pt-48">
        <Container>
          <Link
            to="/portfolio"
            className="animate-fade-up mb-10 inline-flex items-center gap-2 font-inter text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Work
          </Link>
          <div className="animate-fade-up-delay-1 mb-6">
            <SectionLabel icon={Briefcase}>{`${study.category} — ${study.year}`}</SectionLabel>
          </div>
          <h1 className="animate-fade-up-delay-2 font-podium text-[clamp(2.4rem,6.5vw,5.5rem)] uppercase leading-[0.95] tracking-tight text-white">
            {study.client}
          </h1>
          <p className="animate-fade-up-delay-3 mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/70 sm:text-base">
            {study.summary}
          </p>
        </Container>

        <div className="animate-fade-up-delay-4 relative mt-16 aspect-[16/8] w-full overflow-hidden">
          <img src={study.image} alt={study.client} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>

      <section className="border-b border-white/10 bg-black py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-3 lg:gap-10">
            <Reveal>
              <h3 className="font-podium text-lg uppercase tracking-tight text-white">
                The Challenge
              </h3>
              <p className="mt-4 font-inter text-sm leading-relaxed text-white/65">
                {study.challenge}
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h3 className="font-podium text-lg uppercase tracking-tight text-white">
                Our Approach
              </h3>
              <p className="mt-4 font-inter text-sm leading-relaxed text-white/65">
                {study.approach}
              </p>
            </Reveal>
            <Reveal delay={2}>
              <h3 className="font-podium text-lg uppercase tracking-tight text-white">
                The Result
              </h3>
              <p className="mt-4 font-inter text-sm leading-relaxed text-white/65">
                {study.result}
              </p>
            </Reveal>
          </div>

          <Reveal delay={3} className="mt-16 grid grid-cols-1 gap-8 border-t border-white/10 pt-12 sm:grid-cols-3">
            {study.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-podium text-4xl uppercase tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 font-inter text-xs uppercase tracking-widest text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBanner
        label="More Work"
        title="Curious what we could build for you?"
        buttonLabel="START A PROJECT"
      />
    </Layout>
  );
}
