import { ReactNode, useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";
import { useReducedMotion } from "../../lib/useReducedMotion";
import { useHoverCapable } from "../../lib/useHoverCapable";
import { useCreatureCanvas } from "../../lib/useCreatureCanvas";
import type { Pointer } from "../../lib/heroCreatures";

const VIDEO_SRC_WEBM = "/videos/hero-nature.webm";
const VIDEO_SRC_MP4 = "/videos/hero-nature.mp4";
const POSTER_SRC = "/images/hero-nature-poster.jpg";

const MAX_PARALLAX = 16; // px, spec range 10-20px
const MAX_LIGHT_SHIFT = 30; // px, light rays move a bit more than the flowers

type InteractiveVideoHeroProps = {
  label: string;
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  size?: "lg" | "md";
};

export function InteractiveVideoHero({
  label,
  icon,
  title,
  description,
  children,
  size = "lg",
}: InteractiveVideoHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [videoReady, setVideoReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const hasPointer = useHoverCapable();

  const { step } = useCreatureCanvas(canvasRef, sectionRef, hasPointer ? "full" : "reduced");

  const headingSize =
    size === "lg" ? "text-[clamp(2.4rem,6.5vw,5.5rem)]" : "text-[clamp(2rem,5vw,4rem)]";

  // Start the video once the component mounts. Guarded with startedRef so
  // React 18 StrictMode's dev-only double-invoke of effects can't fire
  // video.load() twice in a row -- that race (second load() aborting the
  // first in-flight fetch) is what left the video stuck in a broken
  // NETWORK_NO_SOURCE state during testing.
  // The <video> declares its own <source> candidates (see JSX below), so the
  // browser handles codec selection and loading natively -- no manual
  // src/load() juggling, which sidesteps StrictMode re-invoking an effect
  // that mutates video.src (that race previously left the element stuck in
  // a broken state). We just listen for playability to trigger the fade-in.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      setVideoReady(true);
      video.play().catch(() => {
        /* autoplay can be blocked before user interaction on some browsers; poster still shows */
      });
    };

    if (video.readyState >= 3) {
      onReady();
    } else {
      video.addEventListener("canplay", onReady, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", onReady);
    };
  }, []);

  // Single rAF loop drives parallax, light shift, scroll fade, and the creature canvas.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const pointerRaw: Pointer = { x: 0, y: 0, active: false };
    const pointerEased = { x: 0, y: 0 };
    let rafId = 0;
    let lastTime = 0;
    let running = false;

    function onPointerMove(e: PointerEvent) {
      const rect = section!.getBoundingClientRect();
      pointerRaw.x = e.clientX - rect.left;
      pointerRaw.y = e.clientY - rect.top;
      pointerRaw.active = true;
    }
    function onPointerLeave() {
      pointerRaw.active = false;
    }

    function loop(time: number) {
      if (!running) return;
      const dt = lastTime ? Math.min((time - lastTime) / 16.6667, 3) : 1;
      lastTime = time;

      pointerEased.x += (pointerRaw.x - pointerEased.x) * 0.08;
      pointerEased.y += (pointerRaw.y - pointerEased.y) * 0.08;

      const rect = section!.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const nx = pointerRaw.active ? (pointerEased.x - cx) / cx : 0;
      const ny = pointerRaw.active ? (pointerEased.y - cy) / cy : 0;

      if (videoWrapRef.current) {
        const px = nx * MAX_PARALLAX;
        const py = ny * MAX_PARALLAX;
        videoWrapRef.current.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) scale(1.08)`;
      }
      if (lightRef.current) {
        const lx = nx * MAX_LIGHT_SHIFT;
        const ly = ny * MAX_LIGHT_SHIFT;
        const rot = nx * 4;
        lightRef.current.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }

      // Subtle scroll parallax + content fade, read directly from the DOM (no React state).
      const scrollProgress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);
      if (contentRef.current) {
        contentRef.current.style.opacity = `${1 - scrollProgress * 0.5}`;
        contentRef.current.style.transform = `translate3d(0, ${(scrollProgress * 24).toFixed(1)}px, 0)`;
      }
      if (videoRef.current) {
        videoRef.current.style.transform = `translate3d(0, ${(scrollProgress * 40).toFixed(1)}px, 0)`;
      }

      step(dt, { x: pointerEased.x, y: pointerEased.y, active: pointerRaw.active }, hasPointer);

      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reducedMotion) return;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    if (hasPointer) {
      section.addEventListener("pointermove", onPointerMove);
      section.addEventListener("pointerleave", onPointerLeave);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          videoRef.current?.play().catch(() => {});
        } else {
          stop();
          videoRef.current?.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(section);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (io.takeRecords().length || section.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [step, hasPointer, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-white/10 bg-black pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-48"
    >
      {/* Video background layer (parallax target) */}
      <div ref={videoWrapRef} className="absolute inset-0 will-change-transform">
        <video
          ref={videoRef}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className={`h-full w-full object-cover transition-opacity duration-700 ease-out ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={VIDEO_SRC_WEBM} type="video/webm" />
          <source src={VIDEO_SRC_MP4} type="video/mp4" />
        </video>
        <img
          src={POSTER_SRC}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* Dark overlay for legibility (~20%) */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/35" />

      {/* Dynamic light / lens flare layer */}
      <div
        ref={lightRef}
        className="pointer-events-none absolute -inset-1/4 opacity-30 mix-blend-screen will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,244,214,0.55) 0%, transparent 45%), radial-gradient(circle at 75% 65%, rgba(255,255,255,0.3) 0%, transparent 40%)",
        }}
      />

      {/* Cursor-reactive butterflies, insects, and pollen */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

      <Container className="relative z-10">
        <div ref={contentRef} className="will-change-transform">
          <div className="animate-hero-blur-up mb-6 lg:mb-8">
            <SectionLabel icon={icon}>{label}</SectionLabel>
          </div>
          <h1
            className={`animate-hero-blur-up font-podium ${headingSize} max-w-4xl uppercase leading-[0.95] tracking-tight text-white`}
          >
            {title}
          </h1>
          {description && (
            <p className="animate-hero-blur-up-delay-1 mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/75 sm:text-base lg:mt-8">
              {description}
            </p>
          )}
          {children && (
            <div className="animate-spring-in-delay mt-8 lg:mt-10">{children}</div>
          )}
        </div>
      </Container>
    </section>
  );
}
