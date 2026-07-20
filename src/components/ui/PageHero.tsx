import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";

type PageHeroProps = {
  label: string;
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  size?: "lg" | "md";
};

export function PageHero({ label, icon, title, description, children, size = "lg" }: PageHeroProps) {
  const headingSize =
    size === "lg"
      ? "text-[clamp(2.4rem,6.5vw,5.5rem)]"
      : "text-[clamp(2rem,5vw,4rem)]";

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-black pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-48">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, white 0, transparent 45%), radial-gradient(circle at 85% 0%, white 0, transparent 40%)",
        }}
      />
      <Container className="relative z-10">
        <div className="animate-fade-up mb-6 lg:mb-8">
          <SectionLabel icon={icon}>{label}</SectionLabel>
        </div>
        <h1
          className={`animate-fade-up-delay-1 font-podium ${headingSize} max-w-4xl uppercase leading-[0.95] tracking-tight text-white`}
        >
          {title}
        </h1>
        {description && (
          <p className="animate-fade-up-delay-2 mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8">
            {description}
          </p>
        )}
        {children && <div className="animate-fade-up-delay-3 mt-8 lg:mt-10">{children}</div>}
      </Container>
    </section>
  );
}
