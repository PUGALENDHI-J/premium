import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from "../lib/constants";

const BUDGETS = ["Under $10K", "$10K – $25K", "$25K – $50K", "$50K+"];

const inputClasses =
  "w-full border-b border-white/20 bg-transparent py-3 font-inter text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white";

export default function Contact() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(BUDGETS[0]);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      navigate("/thank-you");
    }, 500);
  }

  return (
    <Layout>
      <InteractiveVideoHero
        label="Get In Touch"
        icon={Mail}
        title={
          <>
            <span className="block">Let's build something</span>
            <span className="block">fierce together.</span>
          </>
        }
        description="Tell us a bit about your project. We reply to every inquiry within one business day."
        size="md"
      />

      <section className="bg-black pb-24 lg:pb-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            {/* Contact info */}
            <Reveal className="space-y-10">
              <div>
                <h2 className="font-inter text-xs uppercase tracking-[0.25em] text-white/40">
                  Email
                </h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-3 flex items-center gap-3 font-inter text-base text-white/80 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 text-white/40" />
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div>
                <h2 className="font-inter text-xs uppercase tracking-[0.25em] text-white/40">
                  Phone
                </h2>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="mt-3 flex items-center gap-3 font-inter text-base text-white/80 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 text-white/40" />
                  {CONTACT_PHONE}
                </a>
              </div>
              <div>
                <h2 className="font-inter text-xs uppercase tracking-[0.25em] text-white/40">
                  Studio
                </h2>
                <p className="mt-3 flex items-start gap-3 font-inter text-base text-white/80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                  {CONTACT_ADDRESS}
                </p>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={1}>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label className="font-inter text-xs uppercase tracking-widest text-white/50">
                      Full Name
                    </label>
                    <input required type="text" placeholder="Jane Doe" className={`${inputClasses} mt-2`} />
                  </div>
                  <div>
                    <label className="font-inter text-xs uppercase tracking-widest text-white/50">
                      Email
                    </label>
                    <input required type="email" placeholder="jane@company.com" className={`${inputClasses} mt-2`} />
                  </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label className="font-inter text-xs uppercase tracking-widest text-white/50">
                      Company
                    </label>
                    <input type="text" placeholder="Company name" className={`${inputClasses} mt-2`} />
                  </div>
                  <div>
                    <label className="font-inter text-xs uppercase tracking-widest text-white/50">
                      Budget Range
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className={`${inputClasses} mt-2 appearance-none [&>option]:bg-black`}
                    >
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-inter text-xs uppercase tracking-widest text-white/50">
                    Tell Us About Your Project
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="What are you building, and what does success look like?"
                    className={`${inputClasses} mt-2 resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center gap-2 bg-white px-7 py-4 text-xs font-inter uppercase tracking-widest text-black transition-colors hover:bg-white/85 disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "SEND INQUIRY"}
                  <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </form>
            </Reveal>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
