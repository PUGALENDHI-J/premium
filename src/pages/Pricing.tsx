import { CheckCircle2, Tag } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Button } from "../components/ui/Button";
import { CtaBanner } from "../components/ui/CtaBanner";
import { PRICING_TIERS, PRICING_FAQS } from "../data/pricing";

export default function Pricing() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="Pricing"
        icon={Tag}
        title={
          <>
            <span className="block">Transparent scopes,</span>
            <span className="block">no surprise invoices.</span>
          </>
        }
        description="Starting prices for our most common engagements. Every project is scoped precisely after a discovery call — these numbers are the honest starting point."
      />

      <section className="border-b border-white/10 bg-black py-24 lg:py-32">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {PRICING_TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div
                  className={`flex h-full flex-col p-8 transition-all duration-500 lg:p-10 ${
                    tier.highlighted
                      ? "border border-white bg-white/[0.06]"
                      : "border border-white/10 bg-white/[0.03] hover:border-white/25"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="mb-4 inline-block w-fit border border-white/40 px-3 py-1 font-inter text-[10px] uppercase tracking-widest text-white">
                      Most Popular
                    </span>
                  )}
                  <h2 className="font-podium text-xl uppercase tracking-tight text-white">
                    {tier.name}
                  </h2>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-podium text-4xl uppercase tracking-tight text-white">
                      {tier.price}
                    </span>
                    <span className="font-inter text-xs uppercase tracking-widest text-white/50">
                      {tier.cadence}
                    </span>
                  </div>
                  <p className="mt-4 font-inter text-sm leading-relaxed text-white/60">
                    {tier.description}
                  </p>
                  <ul className="mt-8 flex-1 space-y-3.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 font-inter text-sm text-white/70">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href="/contact"
                    variant={tier.highlighted ? "primary" : "outline"}
                    className="mt-10 w-full justify-center"
                  >
                    GET STARTED
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing FAQs */}
      <section className="bg-black py-24 lg:py-32">
        <Container>
          <Reveal className="mb-12 max-w-xl">
            <SectionLabel>Common Questions</SectionLabel>
            <h2 className="mt-6 font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
              Pricing FAQ
            </h2>
          </Reveal>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-3">
            {PRICING_FAQS.map((faq, i) => (
              <Reveal key={faq.question} delay={(i % 4) as 0 | 1 | 2 | 3} className="border-t border-white/10 pt-6">
                <h3 className="font-podium text-base uppercase tracking-tight text-white">
                  {faq.question}
                </h3>
                <p className="mt-3 font-inter text-sm leading-relaxed text-white/60">{faq.answer}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Still Deciding?"
        title="Let's scope your project together — no pressure, no pitch deck."
        buttonLabel="BOOK A CALL"
      />
    </Layout>
  );
}
