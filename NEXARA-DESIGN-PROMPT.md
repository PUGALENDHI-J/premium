# Recreate this site as a single HTML file: NEXARA — Thailand from Chennai

You are an expert creative front-end developer. Produce a **single self-contained `nexara-redesign.html`**
that sits next to the existing `assets/` folder and reproduces the design below exactly: same layout,
copy, visuals, motion and interaction. Pure HTML, CSS and JS in one file, with no build step, framework
or bundler. Put the JS in one inline `<script type="module">`. **Lenis is the only external code**, pulled
through an import map, and the page must still work if it fails to load. The spring solver, shared ticker,
scroll triggers, text reveals, sticky stack, hero arch scene, route trace, halftone, seam dissolve, contour
backdrops and loader are all hand-written. Every number below is a fixed constant.

The page must also work when it is **double-clicked from disk** (`file://`). So the hero is drawn with
**Canvas 2D, not WebGL**, because Chrome refuses to upload `file://` images as WebGL textures.

## What it is

A one-page site for **Nexara Holidays**, a Chennai travel agency selling three Thailand packages. It is a
warm, art-directed sheet: one sand ground (`#fbf7f2`), warm-black copy (`#1c1416`), the brand maroon
(`#8e3b40`) as the accent on light and brand gold (`#c8a466`) as the accent on dark, with near-black
panels that come and go per section. It uses two typefaces: **Oswald** (condensed, bold, uppercase) for
headlines, figures and dates, and **Space Grotesk** for everything else, always uppercase in UI runs.

Five blocks. The first three form a **stack**: each pins to the top of the viewport and the next one
slides over it, while the covered one recedes (scales to 0.9 and darkens to 55% black) instead of
scrolling away.

1. **Hero.** Masthead, a 96px headline, meta rows, two bracket-cornered panels and an actions row,
   laid over a full-bleed canvas. The canvas shows a **pointed temple arch** holding two photographs.
   Wat Arun (`img-d6812c89.webp`) **burns away** top to bottom along a gold glowing front to reveal the
   Yi Peng lanterns (`img-e3d4227e.webp`). After that, Wat Arun appears only where the cursor has just
   been, as a liquid-edged trail with a band-striped shadow on the backdrop. Animated contour lines roll
   behind everything. A loading veil (a lantern silhouette filling from the bottom, plus a 4px meter)
   lifts when the images and fonts are ready.
2. **The route.** The first dark surface. The seam with the hero is a **chequered dissolve**: the light
   ground carries into the top of the dark block, breaks into a chequerboard and burns off as you scroll.
   Behind the copy sits a 2560×1440 instrument-panel map of Thailand (halftone landmass, crawling dashed
   axes, a hub with three rings and a ping, the dashed flight arc in from Chennai). On arrival, the
   honeymoon route **traces itself in one 6-second lap** in gold, lighting four turn markers. Once the lap
   has cooled, the cursor becomes a **reticle**.
3. **Chennai to Chennai.** The six-day Ultimate Boys Escape as a timeline. Photos sit in stepped-corner
   plates, with a rail carrying a white progress thread and a square marker that turns five times over the
   block. Each row has three parallax layers. "DAY 0N" labels assemble letter by letter and then settle to
   40%. Hovering a row dims the others.
4. **Three ways to go.** Back to light: a 96px masthead, a short report, a chamfered button, the three
   packages as rows, then a lantern photograph bleeding into a dark band. The band carries a live
   countdown and the five-stop November calendar strip (crawling dashed connectors, a bracketed and
   pulsing "next departure").
5. **See you in Thailand.** A maroon page edge with a dark panel inset 16px inside it, white contours at
   10%, a large sky lantern rising into place as the page bottoms out, a few far lanterns drifting up, a
   nav column that resolves letter by letter, contact details and a legal row.

Everything that moves is a spring (react-spring's damped spring with mass 1). There are no CSS
keyframes. The only CSS transitions are hover colour, the plates' inset and the button flood.

## Shell

```html
<script type="importmap">{ "imports": { "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.mjs" } }</script>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
```

`<html lang="en">`. Set `history.scrollRestoration = "manual"` and call `scrollTo(0,0)` first. Load Lenis
with a dynamic `import("lenis")` inside `.catch()`, never a top-level await. Skip it entirely under
reduced motion. Favicon: `assets/img-b59f6efd.webp` (also the logo).

### Tokens (three tiers; tier 1 is the only place a literal appears)

```
sand-50  #fbf7f2 ground          sand-100 #efe4d8 hero contours     sand-200 #e4d7c9 hairlines / stripe A
sand-300 #d3c0ad stripe B        ink-950  #1c1416 copy              ink-900  #241a1c button body
ink-alpha-40 rgb(28 20 22/.4) muted     night-950 #120c0e stack ground / timeline
night-900 #181012 route + footer panel  cocoa-200 #bfaea8 muted on dark
cocoa-500 #7d6a64 halftone    cocoa-600 #54453f grid, inner ring    cocoa-900 #2c2124 ghost rings, lattice
maroon-600 #8e3b40 accent     maroon-700 #6f2e33                    gold-400 #c8a466 accent on dark
stone-600 #4f4346 plate outline         plate-900 #231b1d plate fill
white-alpha-20 rail · white-alpha-10 footer contours · white-alpha-40 legal · ink-alpha-08 trips contours
```

Roles: `--background --foreground --foreground-muted --surface-dark --surface-button --surface-black
--surface-muted --surface-soft --surface-stripe --foreground-on-dark(-muted/-faint) --border-muted
--map-dot --map-grid --map-grid-ghost --timeline-outline --timeline-fill --timeline-rail
--paddock-contour --footer-contour --accent --gold`.

Type scale (rem): impact 6, display-lg 4.375, display 3.25, heading 2.375, title 1.25, lead 1.125,
label 1, body .875, eyebrow .75, display-sm 3.4375, year 2.25. Leading: headline .95, flat .9, cap .72.
Durations: fast 150ms, normal 250ms, plate 700ms. Easing: entrance `cubic-bezier(.2,0,0,1)`, plate
`cubic-bezier(.33,0,0,1)`. There is no dark-mode override.

**Root scaling:** `html{font-size:16px}` and `@media (min-width:1280px){html{font-size:1.111111vw}}`,
so from xl up one rem is one design pixel of the 1440 frame. Breakpoints: sm 640, md 768, lg 1024,
xl 1280, plus `short` = `(max-height:500px)`.

### Motion engine

- **Ticker:** a single rAF loop. Subscribers register `(cb, getFramerate)` and are called only when
  `t - last > framerate`. The loop starts on the first subscriber and stops on the last. Lenis subscribes
  with framerate 0.
- **Spring:** react-spring's solver with 1ms substeps and a 64ms frame cap:
  `a = -tension·1e-6·(x-goal) - friction·1e-3·v`. It is at rest when |v| and |goal-x| are both below 0.001.
  `to(goal, delay, cfg)` waits `delay` ms before starting. `{duration}` configs are tweens. Under reduced
  motion every spring sets immediately.
- **Configs:** REVEAL {90,26}, ROW/ITEM {170,24}, SHEET {190,26}, FIGURE {200,24}, YEAR {190,24},
  COPY {110,26}, VEIL {70,24}, CLEAR {140,26}, WAIT {10,30}, READY {170,26}, SETTLE {32,26},
  TRIGGER {140,30}.
- **Text engine:** split into words (`opacity 0, translateY .35em → 1, 0`) or letters (`.3em`) as
  `inline-block` spans in a `flex-wrap` container with `column-gap .3em` (letters use 0). Unit *i* starts at
  `delay + i·stagger`. Keep a visually hidden plain copy and mark the spans `aria-hidden`. Never set
  overflow clipping.
- **gate(el, {margin, mode}):** an IntersectionObserver. `once` plays once. `forward` resets only when the
  element leaves downward (its top below the viewport). `always` resets on any leave.
- **watch(el, fn, fr):** runs `fn` on the ticker while the element is in view, plus ten frames after it
  leaves.
- **progress(el, start, end)** uses the standard pose table (`top_top … bottom_center`):
  `clamp(1 - (s + len)/len)`.
- **readToken(name)** resolves a CSS variable through a probe element's computed `color`. Every canvas
  colour comes from tokens.

### The sticky stack

`.stack{position:relative;background:var(--surface-black)}`. Layers are sticky at `top:0` with z-index
0 and 10. The last layer (the journey) is `relative; z-index 20`. Each pinned layer holds an `.inner`
(transform-origin centre) and a full-bleed `.shade` (surface-black, opacity 0). On scroll (coalesced into
one rAF):

```js
const p = clamp(1 - next.getBoundingClientRect().top / innerHeight);
inner.style.transform = p > 0 && shrink > 0 ? `scale(${1 - shrink*p})` : "";   // shrink = 0.1, 0 below 640
shade.style.opacity = 0.55 * p;  inner.style.visibility = p >= 1 ? "hidden" : "visible";
```

A layer taller than the viewport gets `top = min(0, innerHeight - offsetHeight)` px, set on resize.
Anchor clicks compute a pinned layer's static top as the stack's document top plus the heights of the
layers before it, then scroll there with `lenis.scrollTo(y,{duration:1.6})` (or native smooth scroll).

## 1 · Hero

`section[data-hero]`: `relative; isolation:isolate; min-height:100lvh; overflow:hidden`, on the
background colour. Layers, bottom up: `#heroCanvas` (absolute inset 0); `.hero-box` (the fit box below xl,
absolute at the bottom, height 50% / md 56% / lg 62%, hidden from xl); `.hero-ramp` (below xl, bottom 22%,
the six-stop eased gradient to the ground: 0, 6, 20, 45, 74, 93% at 0, 26, 46, 64, 80, 91%); the veil;
then the content column (`min-height:100lvh; flex column; padding 1.5rem`, sm side padding 2rem, gap
1rem / sm 1.5rem / xl 0; short: .75rem block padding).

**Masthead:** the logo (`img-b59f6efd.webp` at 2.25rem plus "NEXARA" in Oswald 700, `letter-spacing .14em`).
From xl, the nav is centred on the page's centre line (`absolute; left:50%; translateX(-50%)`, gap 4rem):
Packages → #trips, route → #route, itinerary → #journey, departures → #departures, contact → #contact.
On the right, `[ Free quote → ]` (bold; the brackets and arrow are `aria-hidden`) opens WhatsApp. Below xl,
a two-line burger (1.5rem lines, .3125rem apart) opens a full-screen sheet appended to `<body>`: fixed,
z 50, fading in on SHEET. It lists the five links plus Free quote in Oswald 700 heading size (sm: display),
each rising .75rem on ITEM at `120 + i·55` ms. While it is open, Lenis stops and the page locks. Escape
closes it, and so does crossing 1280.

**Identity (left):** the eyebrow `nexara_holidays · chennai` (label size, muted). The h1
`amazing thailand` in Oswald 700, uppercase, leading .95, `max-width:6em`, revealed word by word (stagger
110, REVEAL). Size: display-lg by default, short heading, md impact, lg band display-lg, xl impact. The
meta rows (lead size, uppercase, gap 1rem; xl margin-top 4rem) each have a 1rem maroon icon:
plane `Chennai → Bangkok · 4 hrs`, four-point spark `Group batch · 19 Nov 2026`, lantern
`Yi Peng lanterns · 24–25 Nov`.

**Panels (right):** a 13.625rem column from md, a wrapping row at sm, hidden below sm. Each is a
**bracket panel**: 1rem padding (sm `1rem 1.375rem 1.1875rem`) and four corner strokes made from one path,
`viewBox 0 0 10.5 10.5`, `M0 0.5H10V10.5`, .625rem square. The corners are tr as drawn, tl `scaleX(-1)`,
bl `scale(-1)`, br `scaleY(-1)`.
- *next departure:* eyebrow, then a `dl` (dt `boys batch`; dd `chennai → bangkok`; dd `<time>19 nov 2026`;
  dd live `Nd HHh MMm to go` in maroon). Beside or under it sits a mini map of Thailand drawn from the
  polygon below (stroke currentColor, .8) with a maroon dot and ring at Bangkok.
- *trip stats:* three-up `packages 3`, `experiences 9`, `places 12`. The dt is eyebrow size with tracking
  −.04em. The dd is Oswald 500, heading size, leading .72, tracking −.08em, revealed letter by letter
  (stagger 26, FIGURE).

**Actions (foot):** `margin-top:auto`; from sm, a `1fr auto 1fr` grid aligned to the end.
- *Film* (sm and up): a 2rem play ring, `watch the film` over `thailand · m:ss` (read from the video's
  metadata). It opens a `<dialog>` playing `assets/video-66a5393d.mp4`.
- *CTA* `plan my trip` → WhatsApp. This is the **chamfered button**, `font-size: title`, `2.5em × 11em`
  (full width and 3.5rem tall below sm), gap 1.6em. An inline SVG `viewBox 0 0 220 50
  preserveAspectRatio none` carries: body `M220 42L212.932 50H0V0H220V42Z` filled with button ink; the
  same path as a gold flood (`scaleX 0→1` from the left on hover, 250ms plate easing); the same path as
  a gold ring at stroke-opacity .25; and the brackets
  `M205 49.5H213L219.5 42V36M212 0.5H219.5V7M8 0.5H0.5V7M7.5 49.5H0.5V42.5` in gold. The label is gold
  and turns surface-black on hover. The arrow (`M0 5.35355H13M8 10.3536L13 5.35355L8 0.353553`,
  .65em × .5em) moves `translateX(.25rem)` on hover.
- *Socials* (sm and up): `inst`, `whatsapp`, `call`, right-aligned, gap 2rem (xl 3.6875rem).

**Loader veil:** fixed, z 60, on the ground colour, `role=status`, aria-label "Loading Nexara Holidays"
changing to "Loaded". A 5.4 × 7.2rem box is masked to a lantern silhouette (inline SVG data URI). Inside
it, a 12% foreground ghost, and a maroon fill with `transform-origin:bottom` whose `scaleY` is the
progress. Below that, `nexara holidays` (lead size, `letter-spacing .18em`) rises .6rem on COPY at
+260ms. Along the foot runs a 4px meter (track border-muted, fill foreground, `scaleX = progress`).
Progress creeps to **0.7** on WAIT and completes to **1** on READY when the scene reports ready.
**Exit:** on ready, the content clears (`opacity→0`, `translateY(-.75rem)`, CLEAR; the meter fades with
it). After **430 + 240 ms** the veil fades on VEIL, the scroll lock lifts, and the scene's `beginRise()`
and the page entrance start on the same tick. Remove the veil when its *computed* opacity is ≤ 0.004
(polled each frame), with a 3000ms timeout as a backstop. The page is scroll-locked while the veil is up.

**Entrance (ms after handover):** masthead rises .75rem at 0. The eyebrow fades at 180. The name's words
start at 180. Meta rows rise .75rem at `440 + i·130`. Panels rise 1.25rem at 900. Stat figures play at
`1100 + i·90`. Actions rise 1.25rem at 1500. Everything uses REVEAL unless named.

## 2 · The hero scene (Canvas 2D)

**Tier** (re-read when the width or the coarse-pointer query changes; height-only changes on a coarse
pointer are ignored):

- *Classification:* mobile is `<768`, or coarse and `<1024`. Tablet is coarse or `<1280`. Everything else
  is desktop.
- *Rendering:* `maxDpr` 1 / 1.25 / 1.5. `frameInterval` 0 on desktop, otherwise `1000/60 − 2`.
- *Trail and pointer:* `trailSamples` 28 / 44 / 72. `pointerEnabled = !coarse && !reducedMotion`.
- *Effects:* `outline` and `reveal` are off on mobile.
- *Freeze:* `freeze = reducedMotion || (mobile && (saveData || deviceMemory <= 2))`.

**Arch fit:** from xl, the half-width is `w = min(W·.165, H·.3)`, centred, with the apex at `H·.12`.
Below xl it is fitted to `.hero-box`: `w = min(box.w·.3, box.h·.36)`, centred in the box, apex at the
box top. The arch is a pointed (equilateral-ish) arch with `R = 1.6w`, apex height
`√(R² − (R−w)²)`. Path: up the left side to the springline, then `arc(cx+(R−w), sp, R, π, π+d)` and
`arc(cx−(R−w), sp, R, −d, 0)`, then down the right side to `H+40`.

**Each frame, in order:**

1. Fill the ground. Stroke contours (sand-100, 1.4px) with marching squares on a 14px grid. The field is
   `sin(u·1.1+dx)·cos(v·.9+dy) + .6 sin(u·.7−v·1.2+.12t+seed) + .4 cos(u·1.6+v·.5−.09t) +
   .3 sin(v·1.9−u·.4+1.3·seed)`, where `u,v = px·.0042` and `dx,dy` are `.37·sin(…)` roll terms. It is
   scaled by **2.5 bands**, drawn at every integer level, with time `t·1.66·.3`.
2. Desktop only (≥1024): stroke the trail onto the backdrop with a 12px diagonal stripe pattern
   (sand-200 ground, 3px sand-300 lines every 6px) at alpha .85. This is the reveal's shadow.
3. Draw the arch outline offset +14px in the hairline colour, plus a 44px finial line above the apex.
4. Clip to the arch. Cover-fit the lanterns at ×1.08 with parallax (`ox = p2.x·14`,
   `oy = p2.y·8 + lift`, inner image `−p2.x·10, −p2.y·6`). Relight: a radial gold
   `rgba(255,214,150,.32)` at the cursor, radius `.6H`, blended `soft-light`. Scan: a band every 1.2s
   travelling apex to foot in 3.1s, gaussian width `.15·archHeight`, shows Wat Arun at peak **9%**, fading
   in on the burn curve (not on mobile).
5. Mask (an offscreen canvas): the white burn region (below the front line) plus the trail capsules.
   Apply `destination-in` with the arch, then `source-in` with the cover-fitted Wat Arun, and composite
   the result.
6. While burning, stroke the front inside the arch with `lighter`: widths 16, 7, 2.5 in gold at alphas
   .1, .22, .9, plus 1px white, each scaled by `4k(1−k)·1.6`.

**Burn:** a 4s intro clock starts at ready. `k = smoothstep(.14, 1, intro)`, `front = mix(−.1, 1.1, k)`.
`frontY(x) = archTop − 40 + (L+80)·front + (noise(x,t) − .5)·.45·L·.22`, where noise is
`.5 sin(.021x+.7t) + .3 sin(.047x−1.1t) + .2 sin(.093x+1.9t)`. Wat Arun is intact below the front.

**Trail:** the pointer (window `pointermove`, bound only when `pointerEnabled`) is smoothed by 0.55 into
`tp`. Each frame, `tp` is pushed to the front of a history of `trailSamples` points.
- *Pace:* `speed = |Δtp| / (H·.0145)`, eased with attack .09 and release .205.
- *Gate:* `smoothstep(.06, .21, pace)`. A resting cursor shows nothing.
- *Brush:* `H·.085` (phones `.12`) × `mix(.28, 1, pace)` × gate.
- *Taper:* `mix(1.9·1.6, 1.25, pace)`. Segment *i* radius is `r0·(1−i/span)^taper·(1+.12 sin(.9i+5.2t))`.
- *Warp:* each point is displaced by `±.29r` (sin/cos of position and time).
- *Capsules:* round-cap lines.

Parallax uses two cascaded 0.17 lerps of the NDC pointer. With no pointer it is parked at
`STATIC_POSE (.3, .1)`.

**Touch (hover:none, non-mobile):** an idle sweep drives the trail. Every 3.4s, a 1s S-curve crosses the
arch, with the brush scaled by `.76/.76`.

**Rise:** after `beginRise()`, the composition rises from 200px to 0 over 2s, easing out quad.

**Loop:** the scene rides the ticker at the tier's interval, only while the tab is visible and
`scrollY ≤ innerHeight·1.15`. When the tier says freeze, it stops after the intro.

**Ready:** both images decoded and `document.fonts.ready` (8s timeout), then one frame is drawn, then
ready fires.

## 3 · The route

The section is `min-height:100lvh` on surface-dark with white copy. `#routeCanvas` is full-bleed. The
copy is on the left from lg (`left:4rem`, vertically centred, max 30rem) and on top below lg (padding
8rem 1.5rem 2rem, followed by a 52vh spacer for the map).

**Copy:**
- Eyebrow `Lantern of Love · 5 nights 6 days` (gold).
- h2 `one trip, three cities` (Oswald 700, display-sm, words revealed on arrival, stagger 90, +200ms).
- Lead: *"Four hours from Chennai to Bangkok, north to Chiang Mai for the Yi Peng lanterns, then south to
  Pattaya and the islands before a river-cruise farewell in Bangkok."*
- Stat grid: `4 HR` Chennai to Bangkok, `+1:30` Ahead of India, `NOV–FEB` Cool, dry season, `12` Places
  we plan.
- Legend: `01 Bangkok · arrival & farewell`, `02 Chiang Mai · Yi Peng`, `03 Tiger Topia · en route`,
  `04 Pattaya · Coral Island`. Each turns white with a gold diamond when its marker lights.

**Map (logical 2560×1440):** the projection is `x = 1180 + (lon − 97.3)·150`, `y = 80 + (20.5 − lat)·150`.
The Thailand polygon (lon, lat) is in the source; it runs clockwise from Mae Sai `[99.9, 20.43]`.
Halftone dots sit on a 14px lattice inside the polygon (`r = max(.7, 3.1·s)`, map-dot), plus small
crosses every 6 lattice cells in ghost. The hub at Bangkok `(100.75, 13.69)` has rings 26 (grid), 52 and
90 (ghost). These are pre-rendered to an offscreen base on resize.
- *Fit:* from lg, cover and right-aligned. Below lg, `s = min(1.1W/1245, .5H/1150)`, centred, with the
  map's south at the foot.

**Per frame:**
- Dashed axes (4/8, grid colour) through Bangkok's row and column and Chiang Mai's row, crawling at
  24px/s.
- The Chennai → Bangkok flight arc (ghost, dashed, crawling at 40px/s) from logical `(−600, y(13.08))`
  with control `(300, 560)`, plus a 4px gold dot flying it every 5s and the label `MAA → BKK · 4 HR`.
- A hub ping every 3s (radius 26 → 116, alpha .5 → 0).

**The lap:**
- *Route:* Bangkok → Chiang Mai `(98.98, 18.79)` (control bulging 300 west) → Bangkok (380 east) →
  Tiger Topia `(100.93, 13.17)` → Pattaya `(100.88, 12.93)` → Bangkok (150 west).
- *Timing:* segment time ∝ √length, 6000ms in total, each segment eased in-out cubic so it brakes into
  every stop. It starts when the section's bottom is ≤ 1.2× the viewport height, so on a phone the map is in view.
- *Drawing:* glow passes with `lighter` (16px @ .1, 7px @ .22), a 3px gold core, a white 1.6px filament
  over the last 180ms of path, and a radial head glow (22px).
- *Cool-down:* after the lap, the glow cools out over 1.2s to a plain 2.5px gold line.
- *Markers:* 8px diamonds with labels `01 BANGKOK … 04 PATTAYA`. They light gold as the head passes.

**Reticle** (fine pointer, after the lap): two gold arms ±12 lattice cells along the cursor's row and
column at 50% alpha. Land dots on the arms become small gold squares. Within ±2 cells they square up
into a chequer of light squares. A `13.69°N 100.75°E` read-out is shown.

**Seam:** a `#seam` canvas, 32vh tall, at the top of the section. `p = clamp(1 − layerTop/innerHeight)`.
Cell size is `max(24, W/40)`. A cell is drawn in the ground colour while
`(1 − row/rows)·.6 + checker·.2 + hash·.15 > p·1.05`. It is redrawn only when `p` changes.

## 4 · Chennai to Chennai (journey)

The section is on surface-black (padding 8rem / lg `10rem 4rem 12rem`). The head is centred:
- Eyebrow `Thailand Ultimate Boys Escape · 4 nights 5 days`.
- h2 `chennai to chennai` (display-sm, lg impact, words revealed).
- The line *"Pattaya and Bangkok with the massage, the dinner cruise and the train market. Flights not
  included."*

**Rows** (max 78rem): from lg, a `1fr 8rem 1fr` grid with a min-height of 32rem, the plate and text
alternating sides (even rows put the text right-aligned on the left). Below lg it is one column with a
2rem left gutter.

**Plate:** 4:3 with stepped corners, `--s:.75rem`, a two-step polygon clip at top-left and bottom-right.
The outline is stone-600, with a 1px inset fill of plate-900. The photo is inset .875rem with the same
clip, and the inset goes to 0 on row hover over 700ms (plate easing).

**Text:**
- `DAY 0N`: Oswald 700, year size, leading .72, letters stagger 40 on YEAR. It then settles to .4
  opacity on SETTLE about 700ms after it assembles.
- `nov 19 · chennai`: eyebrow size, gold, tracking .08em.
- The title: Oswald 500, 2rem.
- A muted list.

**Data** (date · place · title · image · items):
1. nov 19 · chennai · night flight out · `exp/from-chennai.webp`
2. nov 20 · pattaya · tigers, massage, alcazar · `exp/tiger.webp`
3. nov 21 · coral island · speedboat to the sand · `exp/coral-island.webp`
4. nov 22 · bangkok · safari world, dinner cruise · `exp/safari-world.webp`
5. nov 23 · bangkok · floating market, train market · `exp/train-market.webp`
6. nov 24 · bangkok → chennai · golden buddha, then home · `img-a02b9314.webp`

The items are the package's own itinerary lines.

**Motion:**
- *Entry* (gate `0% 0% -25% 0%`): the plate rises 2rem on ROW, the text 1.5rem at +120ms.
- *Parallax:* plate `−30·d` px, photo `−40·d`, text `+20·d`, where `d` = the row's centre offset / vh.
- *Hover:* the other rows dim to .35 on TRIGGER.
- *Rail:* centred from lg, 1px at white 20%. The thread is `scaleY(progress(top_center → bottom_center))`.
  The .75rem square marker rides the thread and rotates `progress·1800°`.

**Foot:** `per person, without flight`, then `₹34,999` (Oswald heading), then a chamfered `book a seat`
button.

## 5 · Three ways to go (trips)

Light. Padding-top 8rem, with a contour canvas (ink 8%, seed 2.1) behind the top 46rem.

**Head** (lg: `1fr 26rem`):
- h2 `three ways to go` (display-lg, md impact, words, mode forward).
- Report: eyebrow `from chennai, handpicked`; the paragraph *"A honeymoon timed to the Yi Peng lanterns, a
  four-day boys batch, and the full Ultimate Escape. Private AC transfers, a Nexara representative at the
  airport and a tour manager on every group trip."*; a chamfered `free quote` button.

**Packages:** rows with hairline borders. From lg the grid is `4rem 1fr 15rem 11rem`: index, name and
meta, price, `enquire →`. Each row is a WhatsApp link with a prefilled package name, rising 1.25rem on ROW
at `i·90`. On hover, the name turns maroon.
- 01 Thailand Honeymoon Special: Lantern of Love · Chiang Mai · Pattaya · Bangkok · 5 nights 6 days ·
  Yi Peng Nov 24–25 · Call for price
- 02 Thailand Boys Unleashed · Pattaya · Bangkok · 3 nights 4 days · Tamil boys batch · Call for price
- 03 Thailand Ultimate Boys Escape · Pattaya · Bangkok · 4 nights 5 days · Most selling · ₹34,999

**Bleed:** `img-e5898052.webp`, full-bleed, 34rem tall, with a gradient from the ground at the top to
surface-dark at the bottom. It drifts −40 → 40px at ×1.12 across its pass through the viewport.

**Band (`#departures`):**
- Eyebrow `the november batch` and `Leaves Chennai in`, with a live countdown (days, hrs, min, sec) to
  `2026-11-19T20:00+05:30`.
- The calendar: five stops in five columns from lg:
  - 19 nov Batch leaves Chennai
  - 20 nov Pattaya · Tiger Topia, Alcazar
  - 22 nov Bangkok · Safari World
  - 24 nov Chiang Mai · Yi Peng lanterns
  - 25 nov Back in Chennai
- The first future stop is **live**: gold bracket corners, a `next departure` tag with a pulsing dot
  (scale 1 → 3.2, opacity → 0, every 1.6s). Past stops sit at 40%.
- Dashed connectors (3/6) crawl. The stops rise 1rem on ITEM at `i·110` (gate −20%).

## 6 · See you in Thailand (footer, `#contact`)

`padding:16px; background: maroon`. The panel is surface-dark, `min-height: calc(100lvh − 32px)`, with
white 10% contours (seed 4.7).

**Grid** (lg `1fr 12rem 16rem`):
- h2 `see you in thailand` (Oswald 700, 7.5rem from md).
- `navigate`: home, packages, route, itinerary, departures, letter by letter (stagger 22, FIGURE, mode
  forward, each link +120ms).
- `talk to us`: +91 73059 71481, WhatsApp us, hello@nexaraholidays.com, @nexara_holidays_official.

**Figure:** a sky lantern SVG (gold-to-terracotta body, ribs, a ring, a flame and a radial glow), absolute
at the bottom right, `min(44vw, 26rem)` wide. It sits at `translateY((1 − p)·38%)` with
`p = progress(panel, top_bottom → bottom_bottom)`. Five small far lanterns drift upward.

**Legal row:** `© 2026 Nexara Holidays · Chennai` · `Flights, visa/TDAC and personal expenses not included
unless stated` · `back to top ↑`.

## Accessibility

- Every animated text has a visually hidden plain copy.
- Canvases are `aria-hidden`.
- The veil is a status region.
- The menu sheet is `role=dialog` with focus moved to the close button and restored on close.
- Under reduced motion, springs set instantly, there is no Lenis, and the hero freezes after its
  entrance.
