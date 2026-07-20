import { Link } from "react-router-dom";
import { Newspaper, ArrowUpRight } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { InteractiveVideoHero } from "../components/ui/InteractiveVideoHero";
import { Reveal } from "../components/ui/Reveal";
import { CtaBanner } from "../components/ui/CtaBanner";
import { BLOG_POSTS } from "../data/blog";

export default function Blog() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <Layout>
      <InteractiveVideoHero
        label="The Journal"
        icon={Newspaper}
        title={
          <>
            <span className="block">Notes on brand,</span>
            <span className="block">design & growth.</span>
          </>
        }
        description="Thinking from our studio on the craft and business of building brands that last."
      />

      <section className="border-b border-white/10 bg-black py-20 lg:py-24">
        <Container>
          <Reveal>
            <Link to={`/blog/${featured.slug}`} className="group grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
              <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div>
                <div className="flex items-center gap-3 font-inter text-xs uppercase tracking-widest text-white/50">
                  <span>{featured.category}</span>
                  <span>·</span>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                </div>
                <h2 className="mt-4 font-podium text-2xl uppercase leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-lg font-inter text-sm leading-relaxed text-white/65 sm:text-base">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-inter text-xs uppercase tracking-widest text-white transition-colors">
                  Read the article
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        </Container>
      </section>

      <section className="bg-black py-20 lg:py-24">
        <Container>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="mt-5 flex items-center gap-3 font-inter text-[11px] uppercase tracking-widest text-white/45">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 font-podium text-lg uppercase leading-snug tracking-tight text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 font-inter text-sm leading-relaxed text-white/60">{post.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        label="Enjoying the Journal?"
        title="See what this kind of thinking looks like applied to your brand."
        buttonLabel="START A PROJECT"
      />
    </Layout>
  );
}
