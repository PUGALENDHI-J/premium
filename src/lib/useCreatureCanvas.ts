import { useEffect, useRef } from "react";
import {
  Bounds,
  Pointer,
  createButterflies,
  createInsects,
  createParticles,
} from "./heroCreatures";

type Density = "full" | "reduced";

export function useCreatureCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLElement>,
  density: Density,
) {
  const stateRef = useRef<{
    bounds: Bounds;
    butterflies: ReturnType<typeof createButterflies>;
    insects: ReturnType<typeof createInsects>;
    particles: ReturnType<typeof createParticles>;
    dpr: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const counts =
      density === "full"
        ? { butterflies: 5, insects: 9, particles: 34 }
        : { butterflies: 2, insects: 3, particles: 14 };

    function setup() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bounds: Bounds = { width: rect.width, height: rect.height };
      canvas!.width = bounds.width * dpr;
      canvas!.height = bounds.height * dpr;
      canvas!.style.width = `${bounds.width}px`;
      canvas!.style.height = `${bounds.height}px`;

      stateRef.current = {
        bounds,
        butterflies: createButterflies(counts.butterflies, bounds),
        insects: createInsects(counts.insects, bounds),
        particles: createParticles(counts.particles, bounds),
        dpr,
      };
    }

    setup();
    const resizeObserver = new ResizeObserver(() => setup());
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [canvasRef, containerRef, density]);

  function step(dt: number, pointer: Pointer, hasPointer: boolean) {
    const canvas = canvasRef.current;
    const state = stateRef.current;
    if (!canvas || !state) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.scale(state.dpr, state.dpr);
    ctx.clearRect(0, 0, state.bounds.width, state.bounds.height);

    for (const p of state.particles) {
      p.update(dt, state.bounds, pointer, hasPointer);
      p.draw(ctx);
    }
    for (const b of state.butterflies) {
      b.update(dt, state.bounds, pointer, hasPointer);
      b.draw(ctx);
    }
    for (const i of state.insects) {
      i.update(dt, state.bounds, pointer, hasPointer);
      i.draw(ctx);
    }

    ctx.restore();
  }

  return { step };
}
