import { ShieldCheck } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { CONTACT_EMAIL } from "../lib/constants";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly to us, such as your name, email address, company, and project details, when you submit a contact form, subscribe to our journal, or otherwise communicate with us. We also automatically collect limited technical information, such as browser type and general usage data, to help us understand how our site is used.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use the information we collect to respond to inquiries, provide and improve our services, send occasional updates you've opted into, and maintain the security and performance of our website. We do not sell your personal information to third parties.",
  },
  {
    title: "3. Cookies & Tracking",
    body: "Our site may use cookies and similar technologies to remember preferences and understand aggregate usage patterns. You can control cookie behavior through your browser settings; disabling cookies may affect certain site functionality.",
  },
  {
    title: "4. Sharing of Information",
    body: "We may share information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential. We may also disclose information if required by law or to protect our rights.",
  },
  {
    title: "5. Data Retention",
    body: "We retain personal information only as long as necessary to fulfill the purposes outlined in this policy, or as required by applicable law. Project-related communications may be retained for our business records.",
  },
  {
    title: "6. Your Rights",
    body: "Depending on your jurisdiction, you may have the right to access, correct, or request deletion of your personal information. To exercise these rights, contact us using the details below.",
  },
  {
    title: "7. Security",
    body: "We take reasonable technical and organizational measures to protect your information. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this policy from time to time. We'll post the revised version on this page with an updated effective date.",
  },
  {
    title: "9. Contact Us",
    body: `If you have questions about this Privacy Policy, please contact us at ${CONTACT_EMAIL}.`,
  },
];

export default function Privacy() {
  return (
    <Layout>
      <InteractiveVideoHero
        label="Legal"
        icon={ShieldCheck}
        title="Privacy Policy"
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
