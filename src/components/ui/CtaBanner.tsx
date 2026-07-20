import { Sparkles } from "lucide-react";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";
import { Button } from "./Button";
import { Reveal } from "./Reveal";

export function CtaBanner({
  label = "Let's Work Together",
  title = "Have a project in mind? Let's build something fierce.",
  description = "Tell us where you want your brand to go. We'll reply within one business day with next steps.",
  buttonLabel = "START A PROJECT",
  buttonHref = "/contact",
}: {
  label?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black py-24 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, white 0, transparent 55%)",
        }}
      />
      <Container className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
        <Reveal className="max-w-2xl">
          <SectionLabel icon={Sparkles}>{label}</SectionLabel>
          <h2 className="mt-6 font-podium text-[clamp(2rem,4.5vw,3.5rem)] uppercase leading-[0.95] tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-5 max-w-lg font-inter text-sm leading-relaxed text-white/70 sm:text-base">
            {description}
          </p>
        </Reveal>
        <Reveal delay={1}>
          <Button href={buttonHref} variant="primary">
            {buttonLabel}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
