import { CheckCircle2 } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

export default function ThankYou() {
  return (
    <Layout>
      <section className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-32 text-center">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center">
            <div className="animate-scale-in flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div className="animate-fade-up-delay-1 mt-8 flex items-center gap-2.5">
              <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70">
                Message Received
              </span>
            </div>
            <h1 className="animate-fade-up-delay-2 mt-6 font-podium text-[clamp(2rem,5.5vw,4rem)] uppercase leading-[0.95] tracking-tight text-white">
              Thank you.
            </h1>
            <p className="animate-fade-up-delay-3 mt-6 max-w-md font-inter text-sm leading-relaxed text-white/70 sm:text-base">
              We've received your inquiry and will get back to you within one business day.
              In the meantime, take a look at some of our recent work.
            </p>
            <div className="animate-fade-up-delay-4 mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/portfolio" variant="primary">
                SEE OUR WORK
              </Button>
              <Button href="/" variant="outline">
                BACK TO HOME
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
