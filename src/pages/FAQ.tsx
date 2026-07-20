import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { CtaBanner } from "../components/ui/CtaBanner";
import { FAQ_GROUPS } from "../data/faqs";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/10 py-6 first:border-t-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 text-left"
        aria-expanded={open}
      >
        <span className="font-podium text-base uppercase tracking-tight text-white sm:text-lg">
          {question}
        </span>
        <Plus
          className={`h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="mt-4 max-w-2xl font-inter text-sm leading-relaxed text-white/60 sm:text-base">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="Questions, Answered"
        icon={HelpCircle}
        title={
          <>
            <span className="block">Everything you</span>
            <span className="block">need to know.</span>
          </>
        }
        description="Can't find what you're looking for? Reach out and we'll get back to you within a business day."
      />

      <section className="bg-black py-24 lg:py-32">
        <Container>
          <div className="space-y-16">
            {FAQ_GROUPS.map((group, gi) => (
              <Reveal key={group.category} delay={(gi % 4) as 0 | 1 | 2 | 3}>
                <h2 className="font-inter text-xs uppercase tracking-[0.25em] text-white/40">
                  {group.category}
                </h2>
                <div className="mt-4">
                  {group.items.map((item) => (
                    <FaqItem key={item.question} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Still Have Questions?"
        title="Send us a message — a real person will respond."
        buttonLabel="CONTACT US"
      />
    </Layout>
  );
}
