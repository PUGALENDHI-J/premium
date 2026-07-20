import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/ui/Container";
import { Reveal } from "../components/ui/Reveal";
import { CtaBanner } from "../components/ui/CtaBanner";
import { BLOG_POSTS } from "../data/blog";

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-white/10 bg-black pt-36 sm:pt-40 lg:pt-48">
        <Container>
          <Link
            to="/blog"
            className="animate-fade-up mb-10 inline-flex items-center gap-2 font-inter text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            The Journal
          </Link>
          <div className="animate-fade-up-delay-1 flex items-center gap-3 font-inter text-xs uppercase tracking-widest text-white/50">
            <span>{post.category}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="animate-fade-up-delay-2 mt-6 max-w-3xl font-podium text-[clamp(2rem,5.5vw,4rem)] uppercase leading-[1] tracking-tight text-white">
            {post.title}
          </h1>
        </Container>

        <div className="animate-fade-up-delay-3 relative mt-14 aspect-[16/8] w-full overflow-hidden">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>

      <section className="border-b border-white/10 bg-black py-20 lg:py-28">
        <Container>
          <Reveal className="mx-auto max-w-2xl space-y-6">
            {post.content.map((paragraph, i) => (
              <p key={i} className="font-inter text-base leading-relaxed text-white/75">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="bg-black py-20 lg:py-24">
        <Container>
          <Reveal>
            <h2 className="font-podium text-xl uppercase tracking-tight text-white sm:text-2xl">
              More from the journal
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <Link to={`/blog/${p.slug}`} className="group flex items-center justify-between gap-4 border-t border-white/10 py-6">
                  <div>
                    <div className="font-inter text-[11px] uppercase tracking-widest text-white/45">
                      {p.category}
                    </div>
                    <h3 className="mt-2 font-podium text-lg uppercase tracking-tight text-white">
                      {p.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </Layout>
  );
}
