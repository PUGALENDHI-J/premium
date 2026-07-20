import { Quote, MessageSquareQuote } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { CtaBanner } from "../components/ui/CtaBanner";
import { TESTIMONIALS } from "../data/testimonials";

export default function Testimonials() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="Client Voices"
        icon={MessageSquareQuote}
        title={
          <>
            <span className="block">Don't just take</span>
            <span className="block">our word for it.</span>
          </>
        }
        description="A handful of the people we've partnered with, in their own words."
      />

      <section className="bg-black py-24 lg:py-32">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="flex h-full flex-col border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]">
                  <Quote className="h-6 w-6 text-white/25" />
                  <p className="mt-5 flex-1 font-inter text-sm leading-relaxed text-white/75">
                    “{t.quote}”
                  </p>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="font-podium text-sm uppercase tracking-tight text-white">
                      {t.name}
                    </div>
                    <div className="mt-0.5 font-inter text-xs uppercase tracking-widest text-white/50">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Be Our Next Success Story"
        title="Ready to see what we could do for your brand?"
        buttonLabel="START A PROJECT"
      />
    </Layout>
  );
}
