import { Compass } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <Layout>
      <section className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-32 text-center">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center">
            <span className="animate-fade-up font-podium text-[clamp(5rem,18vw,11rem)] uppercase leading-none tracking-tight text-white/10">
              404
            </span>
            <div className="animate-fade-up-delay-1 -mt-6 flex items-center gap-2.5">
              <Compass className="h-4 w-4 text-white/70" />
              <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70">
                Off The Map
              </span>
            </div>
            <h1 className="animate-fade-up-delay-2 mt-6 font-podium text-[clamp(1.8rem,4.5vw,3rem)] uppercase leading-tight tracking-tight text-white">
              This page didn't make the cut.
            </h1>
            <p className="animate-fade-up-delay-3 mt-5 max-w-md font-inter text-sm leading-relaxed text-white/70 sm:text-base">
              The page you're looking for may have been moved, renamed, or never existed.
              Let's get you back on track.
            </p>
            <div className="animate-fade-up-delay-4 mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/" variant="primary">
                BACK TO HOME
              </Button>
              <Button href="/contact" variant="outline">
                CONTACT US
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
