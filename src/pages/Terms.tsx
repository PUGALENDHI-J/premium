import { ScrollText } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { CONTACT_EMAIL } from "../lib/constants";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using this website, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the site.",
  },
  {
    title: "2. Use of Our Services",
    body: "Any services engaged through Vanguard Studio, including brand identity, web design, and related deliverables, are governed by a separate signed project agreement, which takes precedence over this website's general terms where applicable.",
  },
  {
    title: "3. Intellectual Property",
    body: "All content on this website, including text, graphics, logos, and design elements, is the property of Vanguard Studio or its clients and is protected by applicable intellectual property laws. Client work displayed in our portfolio is shown with permission.",
  },
  {
    title: "4. Ownership of Deliverables",
    body: "Ownership and licensing of final project deliverables are defined in individual client agreements. Unless otherwise specified, full ownership transfers to the client upon final payment.",
  },
  {
    title: "5. Payment Terms",
    body: "Project payment schedules, deposits, and milestones are outlined in individual proposals and agreements. Late payments may result in a pause of active project work.",
  },
  {
    title: "6. Limitation of Liability",
    body: "Vanguard Studio is not liable for any indirect, incidental, or consequential damages arising from the use of this website or our services, to the fullest extent permitted by law.",
  },
  {
    title: "7. Third-Party Links",
    body: "Our website may contain links to third-party sites. We are not responsible for the content or practices of any linked sites.",
  },
  {
    title: "8. Governing Law",
    body: "These terms are governed by the laws of the State of California, without regard to its conflict of law principles.",
  },
  {
    title: "9. Changes to These Terms",
    body: "We may revise these terms periodically. Continued use of the site after changes are posted constitutes acceptance of the revised terms.",
  },
  {
    title: "10. Contact Us",
    body: `Questions about these Terms & Conditions can be directed to ${CONTACT_EMAIL}.`,
  },
];

export default function Terms() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="Legal"
        icon={ScrollText}
        title="Terms & Conditions"
        description="Effective date: January 1, 2026"
        size="md"
      />

      <section className="bg-black py-20 lg:py-28">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12">
            {SECTIONS.map((section, i) => (
              <Reveal key={section.title} delay={(i % 4) as 0 | 1 | 2 | 3} className="border-t border-white/10 pt-8 first:border-t-0 first:pt-0">
                <h2 className="font-podium text-lg uppercase tracking-tight text-white sm:text-xl">
                  {section.title}
                </h2>
                <p className="mt-4 font-inter text-sm leading-relaxed text-white/65 sm:text-base">
                  {section.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </Layout>
  );
}
