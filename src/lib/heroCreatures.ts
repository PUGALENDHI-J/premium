// Lightweight steering-behavior simulation for the hero cursor-interaction layer.
// Pure vanilla canvas + rAF (no animation library) to keep the bundle small.

type Pointer = { x: number; y: number; active: boolean };

const TAU = Math.PI * 2;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type Bounds = { width: number; height: number };

type ButterflyType = "approach" | "circle" | "avoid";

export class Butterfly {
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  wanderAngle: number;
  type: ButterflyType;
  size: number;
  hue: number;
  flap = Math.random() * TAU;
  flapSpeed: number;
  radius: number; // interaction radius, 250-350px
  circleRadius: number;
  circleAngle: number;
  landTimer = 0;

  constructor(bounds: Bounds, type: ButterflyType) {
    this.x = rand(0, bounds.width);
    this.y = rand(0, bounds.height);
    this.wanderAngle = rand(0, TAU);
    this.type = type;
    this.size = rand(7, 12);
    this.hue = rand(0, 1); // used to pick a soft palette tone
    this.flapSpeed = rand(0.25, 0.4);
    this.radius = rand(250, 350);
    this.circleRadius = rand(70, 130);
    this.circleAngle = rand(0, TAU);
  }

  update(dt: number, bounds: Bounds, pointer: Pointer, hasPointer: boolean) {
    this.wanderAngle += rand(-0.12, 0.12);
    const wanderSpeed = 0.35;
    let fx = Math.cos(this.wanderAngle) * wanderSpeed;
    let fy = Math.sin(this.wanderAngle) * wanderSpeed;

    if (hasPointer && pointer.active) {
      const dx = pointer.x - this.x;
      const dy = pointer.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (dist < this.radius) {
        const proximity = 1 - dist / this.radius; // 0..1, stronger when closer

        if (this.type === "approach") {
          const stopAt = 55;
          const pull = dist > stopAt ? proximity * 0.9 : -proximity * 0.4;
          fx += (dx / dist) * pull;
          fy += (dy / dist) * pull;
        } else if (this.type === "circle") {
          this.circleAngle += 0.045;
          const targetX = pointer.x + Math.cos(this.circleAngle) * this.circleRadius;
          const targetY = pointer.y + Math.sin(this.circleAngle) * this.circleRadius;
          fx += (targetX - this.x) * 0.02;
          fy += (targetY - this.y) * 0.02;
        } else {
          // avoid: flee when close, drift back once clear
          const fleeAt = 130;
          if (dist < fleeAt) {
            const flee = (1 - dist / fleeAt) * 1.1;
            fx -= (dx / dist) * flee;
            fy -= (dy / dist) * flee;
          } else {
            fx += (dx / dist) * proximity * 0.25;
            fy += (dy / dist) * proximity * 0.25;
          }
        }
      }
    }

    this.vx = lerp(this.vx, this.vx + fx, 0.12);
    this.vy = lerp(this.vy, this.vy + fy, 0.12);
    this.vx *= 0.94;
    this.vy *= 0.94;

    const maxSpeed = 2.4;
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.flap += this.flapSpeed * dt;

    const pad = 20;
    if (this.x < -pad) this.x = bounds.width + pad;
    if (this.x > bounds.width + pad) this.x = -pad;
    if (this.y < -pad) this.y = bounds.height + pad;
    if (this.y > bounds.height + pad) this.y = -pad;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const angle = Math.atan2(this.vy, this.vx || 0.001);
    const wingScale = 0.55 + Math.abs(Math.sin(this.flap)) * 0.45;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);
    ctx.globalAlpha = 0.55;
    ctx.shadowColor = "rgba(255,255,255,0.5)";
    ctx.shadowBlur = 6;

    const palette = ["rgba(255,255,255,0.9)", "rgba(255,214,170,0.85)", "rgba(200,225,255,0.85)"];
    ctx.fillStyle = palette[Math.floor(this.hue * palette.length) % palette.length];

    // two wing lobes, flapping via horizontal scale
    ctx.save();
    ctx.scale(wingScale, 1);
    ctx.beginPath();
    ctx.ellipse(0, -this.size * 0.5, this.size * 0.62, this.size * 0.42, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, this.size * 0.5, this.size * 0.62, this.size * 0.42, 0, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "rgba(40,30,20,0.6)";
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.12, this.size * 0.55, 0, 0, TAU);
    ctx.fill();

    ctx.restore();
  }
}

export class Insect {
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  homeX: number;
  homeY: number;
  size: number;
  buzz = Math.random() * TAU;
  landTimer = 0;
  landing = false;

  constructor(bounds: Bounds) {
    this.x = rand(0, bounds.width);
    this.y = rand(0, bounds.height);
    this.homeX = this.x;
    this.homeY = this.y;
    this.size = rand(2, 3.4);
  }

  update(dt: number, bounds: Bounds, pointer: Pointer, hasPointer: boolean) {
    this.buzz += 0.6 * dt;

    if (this.landing) {
      this.landTimer -= dt;
      this.vx *= 0.8;
      this.vy *= 0.8;
      if (this.landTimer <= 0) this.landing = false;
    } else {
      let tx = this.homeX;
      let ty = this.homeY;

      if (hasPointer && pointer.active) {
        const dx = pointer.x - this.x;
        const dy = pointer.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 220) {
          tx = pointer.x + Math.cos(this.buzz * 2) * 26;
          ty = pointer.y + Math.sin(this.buzz * 1.7) * 26;
          if (dist < 40 && Math.random() < 0.004) {
            this.landing = true;
            this.landTimer = rand(35, 90);
          }
        } else {
          this.homeX = clamp(this.homeX + rand(-1, 1), 0, bounds.width);
          this.homeY = clamp(this.homeY + rand(-1, 1), 0, bounds.height);
        }
      }

      const dx = tx - this.x + Math.cos(this.buzz * 3) * 6;
      const dy = ty - this.y + Math.sin(this.buzz * 2.4) * 6;
      this.vx = lerp(this.vx, dx * 0.06, 0.2);
      this.vy = lerp(this.vy, dy * 0.06, 0.2);
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "rgba(255,244,214,0.85)";
    ctx.shadowColor = "rgba(255,244,214,0.6)";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  drift: number;
  opacity: number;

  constructor(bounds: Bounds) {
    this.x = rand(0, bounds.width);
    this.y = rand(0, bounds.height);
    this.vx = rand(-0.08, 0.08);
    this.vy = rand(-0.35, -0.08);
    this.size = rand(0.8, 2.2);
    this.drift = rand(0, TAU);
    this.opacity = rand(0.15, 0.45);
  }

  update(dt: number, bounds: Bounds, pointer: Pointer, hasPointer: boolean) {
    this.drift += 0.01 * dt;
    this.x += (this.vx + Math.sin(this.drift) * 0.06) * dt;
    this.y += this.vy * dt;

    if (hasPointer && pointer.active) {
      const dx = this.x - pointer.x;
      const dy = this.y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dist < 90) {
        const push = (1 - dist / 90) * 0.6;
        this.x += (dx / dist) * push;
        this.y += (dy / dist) * push;
      }
    }

    if (this.y < -10) {
      this.y = bounds.height + 10;
      this.x = rand(0, bounds.width);
    }
    if (this.x < -10) this.x = bounds.width + 10;
    if (this.x > bounds.width + 10) this.x = -10;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "rgba(255,250,235,0.9)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

export function createButterflies(count: number, bounds: Bounds) {
  const types: ButterflyType[] = ["approach", "circle", "avoid"];
  return Array.from({ length: count }, (_, i) => new Butterfly(bounds, types[i % types.length]));
}

export function createInsects(count: number, bounds: Bounds) {
  return Array.from({ length: count }, () => new Insect(bounds));
}

export function createParticles(count: number, bounds: Bounds) {
  return Array.from({ length: count }, () => new Particle(bounds));
}

export type { Pointer };
