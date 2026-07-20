import { ReactNode, useEffect, useRef, useState } from "react";
import { useImageSequence } from "../../lib/useImageSequence";
import { useReducedMotion } from "../../lib/useReducedMotion";

type ImageSequenceHeroProps = {
  /** Public folder holding the frames, e.g. "/frames" */
  basePath: string;
  /** Total exported frame count */
  frameCount: number;
  /** Filename prefix before the zero-padded index */
  prefix?: string;
  /** File extension including the dot */
  extension?: string;
  /** Zero-padding width for the frame index */
  padding?: number;
  /**
   * How many viewport-heights of scroll it takes to scrub through the whole
   * sequence. Larger = slower, more deliberate scrub.
   */
  scrollLengthVh?: number;
  /** Section className, applied to the sticky pinned viewport-height panel */
  className?: string;
  /** Overlay content rendered above the canvas (unchanged hero copy, CTAs, etc.) */
  children?: ReactNode;
};

/**
 * Apple-style scroll-scrubbed image sequence.
 *
 * Renders a tall wrapper (scrollLengthVh * 100vh) with a sticky, viewport-
 * height panel inside it. While that panel is in view, scroll position is
 * mapped directly to a frame index and painted onto a single <canvas> --
 * scrolling down plays forward, scrolling up plays backward, and the panel
 * only releases to the next section once the last frame is reached.
 */
export function ImageSequenceHero({
  basePath,
  frameCount,
  prefix = "frame",
  extension = ".jpg",
  padding = 4,
  scrollLengthVh = 300,
  className = "",
  children,
}: ImageSequenceHeroProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const reducedMotion = useReducedMotion();
  const { images, isReady, progress: loadProgress } = useImageSequence({
    basePath,
    frameCount,
    prefix,
    extension,
    padding,
  });

  const [contentVisible, setContentVisible] = useState(false);

  // Smoothed (interpolated) playback progress, current frame index, and a
  // flag so the draw loop only runs while the sequence is on screen.
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const currentFrameRef = useRef(-1);
  const dprRef = useRef(1);
  const rafRef = useRef(0);

  // Fade the hero in once every frame has decoded, exactly mirroring the
  // opacity-0 -> opacity-100 fade the old <video>/poster pairing used.
  useEffect(() => {
    if (isReady) {
      const id = requestAnimationFrame(() => setContentVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isReady]);

  // Draw a single frame into the canvas using object-fit: cover math, so
  // framing stays identical across every screen size / aspect ratio.
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = images[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Resize the canvas backing store for the current viewport + DPR (retina
  // and high-DPI support) and immediately repaint the current frame so
  // resizing never shows a blank/stale canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !sticky) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const { width, height } = sticky.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const idx = currentFrameRef.current;
      if (idx >= 0) drawFrame(idx);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(sticky);
    window.addEventListener("orientationchange", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // Scroll -> progress -> frame, driven by a single rAF loop with lerp
  // smoothing so fast/jittery scroll input still paints buttery-smooth.
  useEffect(() => {
    if (!isReady) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let running = false;

    const readTargetProgress = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        targetProgressRef.current = 0;
        return;
      }
      const raw = -rect.top / scrollable;
      targetProgressRef.current = Math.min(Math.max(raw, 0), 1);
    };

    const tick = () => {
      if (!running) return;
      readTargetProgress();

      // Reduced-motion: snap instantly (no smoothing) instead of animating.
      const lerpFactor = reducedMotion ? 1 : 0.18;
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * lerpFactor;

      // Snap the last mile so we always land exactly on frame 1 / frame N.
      if (Math.abs(targetProgressRef.current - currentProgressRef.current) < 0.001) {
        currentProgressRef.current = targetProgressRef.current;
      }

      const frameIndex = Math.round(currentProgressRef.current * (frameCount - 1));
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafRef.current = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };

    // Only run the rAF loop while the pinned section is anywhere near the
    // viewport -- avoids burning frames on scroll happening elsewhere on
    // long pages.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(wrapper);

    // Passive listeners: scroll position is read from rAF via
    // getBoundingClientRect, so these just make sure a loop is running.
    const onScroll = () => start();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Paint the very first frame immediately so there's no blank flash
    // before the first scroll/rAF tick lands.
    readTargetProgress();
    currentProgressRef.current = targetProgressRef.current;
    const initialFrame = Math.round(currentProgressRef.current * (frameCount - 1));
    currentFrameRef.current = initialFrame;
    drawFrame(initialFrame);
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isReady, frameCount, reducedMotion]);

  return (
    <div ref={wrapperRef} style={{ height: `${scrollLengthVh}vh` }} className="relative">
      <div
        ref={stickyRef}
        className={`sticky top-0 h-screen w-full overflow-hidden bg-black text-white ${className}`}
      >
        {/* Image-sequence canvas (replaces the old <video> background) */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${
            contentVisible ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* First frame shown as a static poster while the sequence preloads */}
        {!contentVisible && images[0] && (
          <img
            src={images[0].src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Loading progress, mirrors the old poster fade -- only shown until
            enough frames are ready to scrub without popping/flashing. */}
        {!contentVisible && (
          <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center">
            <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-white/80 transition-[width] duration-150 ease-out"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
