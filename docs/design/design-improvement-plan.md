# Design Baseline & Improvement Plan

Status: **implementation in progress.** Phase 0 (foundations) and Phase 1 (home)
are done. Phase 2 is partially done — see §6 for exact scope covered so far and
what's still open. Track live progress in `AGENTS.md` §13 (git-ignored, not this file).
Prepared: 2026-09-04. Scope: the public marketing site (`src/app`, `src/components`).

This is an *improvement* pass, not a redesign. The brand, palette, typography
choices, dark shell, and documentary tone stay. The goal is to raise the polish
ceiling of components, layouts, typography, motion, and background interactivity
using well-supported libraries — most of which are **already wired into this repo**.

---

## 1. Guardrails (do not violate when implementing)

- **Improve, don't replace.** Keep Bitcoin orange as the single CTA/emphasis color;
  red & green stay reserved for story moments. Keep near-black `--bg-base`, elevated
  surfaces, high-contrast text.
- **Keep the type pairing**: DM Sans (body) + Space Grotesk (display). Improvements
  are scale/rhythm/animation, not new typefaces.
- **RSC-first.** Any new interactive/animated piece is an isolated `"use client"`
  leaf; data and layout stay in Server Components.
- **`prefers-reduced-motion` is mandatory** on every motion addition. Background
  effects must pause/disable under it.
- **Dependency budget.** Prefer copy-in components (shadcn/Magic UI/Aceternity
  registries already configured) over new runtime packages. Evaluate any new
  package against `.github/skills/systems-design/SKILL.md` Step 4 before adding.
- **Performance.** No always-on WebGL on mobile. Background canvases must be
  `pointer-events: none`, capped FPS, and unmounted off-screen.
- **Accessibility.** Contrast ≥ WCAG AA on text over animated backgrounds; focus
  rings (currently `2px solid var(--bitcoin)`) must survive.

---

## 2. Current design baseline (what we have today)

### Tokens & theme
- All tokens in `src/app/globals.css` `:root` (no `tailwind.config`). Brand,
  bg ramp (`--bg-base`→`--bg-muted`), text ramp, border rgba set, `--radius 0.5rem`,
  shadcn HSL vars mapped via `@theme inline`.
- Dark-only: `<html class="dark">` hard-coded in `layout.tsx`; `next-themes`
  installed but unused. No light theme.

### Typography
- `next/font` DM Sans + Space Grotesk. Headings: `font-display`, weight ~750,
  `line-height: 1.08`, `text-wrap: balance`. Body: `line-height: 1.6`,
  `text-wrap: pretty`. Fixed `16px` on form controls.
- **No fluid type scale** — sizes are per-component Tailwind steps
  (`text-4xl sm:text-5xl md:text-6xl` repeated across hero/section files).
- No text-animation primitives (split/blur-in/counter) beyond ad hoc framer-motion.

### Motion
- `framer-motion` ^12 (header mobile menu, hero badge pulse, staggered cards).
- `gsap` ^3.13 installed; usage is minimal.
- CSS keyframes in `globals.css`: `marquee`, `brand-marquee`, pulse via Tailwind.
- `prefers-reduced-motion` block already zeroes animations/transitions globally.

### Backgrounds & surface effects (already present)
- CSS utilities: `.bg-dot-grid`, `.bg-grid-lines`, `.bg-noise` (inline SVG turbulence),
  `.glow-bitcoin`, `.glow-green`, `.section-panel` (masked grid + gradient),
  `.interactive-card` (mouse-follow radial spotlight), `.accent-line`,
  `.text-gradient-brand`, `.btn-dark`.
- Radial gradient washes hand-written per page
  (`bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),…)]`).
- Hero uses a real `<video>` background with layered gradient scrims.

### Components
- shadcn/ui (new-york) primitives in `src/components/ui/`: accordion, badge, button,
  input, select, tabs + custom `card-spotlight`, `comet-card`, `marquee`.
- `components.json` already registers external registries:
  `@magicui` → `https://magicui.design/r/{name}`,
  `@aceternity` → `https://ui.aceternity.com/registry/{name}.json`.
  → `npx shadcn@latest add @magicui/<x>` / `@aceternity/<x>` works today.
- Button: 6 variants, orange-gradient primary with hover glow; 5 sizes; `asChild`.
- Cards: bordered `bg-white/[0.03]`, `rounded-2xl`/`[2rem]`, heavy shadow, some with
  spotlight hover.

### Layout system
- Section rhythm classes (`.section*`) + `<Container>` (max 1180px).
- Grids are per-page Tailwind (`lg:grid-cols-[0.95fr_1.05fr]` etc.). No shared
  bento/feature-grid component — patterns are re-implemented per page.
- Content helpers: `.section-intro`, `.content-shell`, `.content-copy`.

### Per-surface notes
| Surface | Current | Weak spot |
|---|---|---|
| Home hero | video bg + gradient scrim + badge | static headline, no scroll cue, CTA row plain |
| Home sections (×13) | alternating `bg-base` / `bg-surface` + grid-lines | uniform reveal, little depth hierarchy, ticker/stats not animated on scroll |
| Programs / Program detail | card + steps + metrics grids | dense, low motion, repeated gradient boilerplate |
| Merchants directory | client filter list | list feels utilitarian; no map, no skeleton, cards flat |
| Donate | static Lightning QR panel | intentionally minimal (BTCPay paused) — leave alone for now |
| Community / Contact | invite cards, form | form has no inline validation animation / success motion |
| Legal | `LegalLayout` prose | fine; only needs a fluid-type + reading-width polish |
| 404 | spotlight cards | already the most "designed" page — use as reference |

---

## 3. Library options (evaluated)

### Already in the repo — lean on these first
| Tool | State | Use for |
|---|---|---|
| **shadcn/ui** registry + CLI | configured | more primitives (dialog, tooltip, sonner, skeleton, hover-card, scroll-area), block layouts |
| **Magic UI** (`@magicui`) | registry configured | marquee upgrade, `blur-fade`, `text-animate`, `number-ticker`, `animated-grid-pattern`, `dot-pattern`, `retro-grid`, `border-beam`, `shine-border`, `animated-beam` |
| **Aceternity UI** (`@aceternity`) | registry configured | `aurora-background`, `background-beams`, `spotlight`, `grid-and-dot-backgrounds`, `bento-grid`, `card-spotlight` (we have a fork), `text-generate-effect`, `tracing-beam` |
| **framer-motion / Motion** | installed ^12 | the default for React enter/scroll/gesture animation; `useScroll`, `useInView`, layout animations, `AnimatePresence` |
| **GSAP** | installed ^3.13 | reserve for complex imperative timelines only (hero sequence, SVG draw). Consider `@gsap/react` `useGSAP` if we keep it |

### New candidates
| Tool | Verdict | Rationale |
|---|---|---|
| **anime.js v4** (`animejs`, ~ small, ESM, `animate`/`createTimeline`/`stagger`/`createScope`/`svg`) | **Optional / targeted** | Great for non-React sequences: number counters, SVG line-draw (logo, route lines), text stagger, the Bitcoin ticker. But Motion already covers most React needs — only add if we hit an imperative-timeline wall. v4 API: module imports, `to`/`ease` (not `value`/`easing`), `reversed`/`alternate` flags. |
| **KokonutUI** (kokonutui.com — Tailwind + shadcn + Motion, copy-in via shadcn CLI, 100+ free) | **Adopt selectively** | Same copy-in model as shadcn, no new runtime dep (uses Motion we already have). Good sources for: hero sections, pricing/CTA blocks, animated inputs, toasts, cards, "AI"/gradient buttons. Pull individual components, restyle to Afribit tokens. |
| **react-bits** (110+ customizable animated components) | **Reference only** | Useful catalogue for background ideas (Aurora, StarField, threads). Copy patterns, don't add as a dep. |
| **tsParticles** (`@tsparticles/react`) | **Only if a particle field is chosen** | Heavier; last resort for a "sats floating" motif. Prefer CSS/Canvas 2D or a Magic UI pattern first. |
| **@react-three/fiber + drei / shader gradient** | **Avoid for now** | WebGL cost not justified for a content site; revisit only for one flagship hero moment, lazy-loaded, desktop-only. |
| **CSS scroll-driven animations** (`animation-timeline: scroll()/view()`) | **Adopt progressively** | Native, ~84% support mid-2026 (Chrome/Edge 115+, FF 132+, Safari 18/26+). Use behind `@supports (animation-timeline: view())` for: section reveals, progress bars, parallax washes, the campaign-progress meter. Falls back to static (fine) or framer-motion `useInView`. Removes JS scroll listeners. |
| **tweakcn** (visual shadcn theme editor) | **Use as a tool** | To regenerate/expand the token set (add light theme later, tune `--radius`, elevation shadows) without hand-math. Output is just CSS vars. |
| **Lightswind UI** | **Reference only** | Large background catalogue; cherry-pick effect ideas. |

---

## 4. Recommendations by area

### 4.1 Background interactivity
Goal: cohesive, brand-tinted, low-cost depth instead of per-page hand-written radial gradients.

1. **Extract a `<SectionBackground variant="…">` component** (`src/components/ui/`) that
   centralizes today's ad-hoc gradients + `bg-grid-lines`/`bg-noise`. Variants:
   `hero | orange-wash | green-wash | grid | dot | panel | none`.
2. **Upgrade the grid/dot layers** to Magic UI `animated-grid-pattern` /
   `interactive-grid-pattern` (Aceternity) — subtle mouse-reactive distortion,
   `pointer-events: none`, disabled under reduced-motion. One shared instance per
   long page, not per section.
3. **One flagship animated background**, hero only: Aceternity `aurora-background` or
   `background-beams` tinted to `--bitcoin` / `--panafrican-green`, layered *under*
   the existing video with low opacity — or replace video scrim on inner-page heroes
   that have no video.
4. **Retire** repeated `bg-[radial-gradient(...)]` strings in favor of the component.
5. **Cursor spotlight**: generalize `.interactive-card` into a `useSpotlight` hook so
   cards, CTA panels, and nav can share it.

### 4.2 Typography
1. **Fluid type scale** via `clamp()` CSS custom props in `globals.css`
   (`--step--1 … --step-8`), map to Tailwind via `@theme inline`. Replace the
   repeated `text-4xl sm:text-5xl md:text-6xl` chains with `text-fluid-h1` etc.
2. **Vertical rhythm**: standardize measure (`--measure: 65ch`) and paragraph
   spacing; wire into `.content-copy` and `LegalLayout`.
3. **Text motion primitives** (`"use client"` leaves): `TextReveal` (word/line
   blur-in on `useInView` or CSS `view()`), `NumberTicker` for stats/impact/campaign,
   `GradientText` (already have `.text-gradient-brand` — wrap it). Source from
   Magic UI `text-animate` / `number-ticker` and restyle.
4. **Headline treatment**: keep Space Grotesk; add optional tracking-tight +
   balanced wrap util class so every hero is consistent.
5. Consider enabling **DM Sans optical sizing / variable weights** if the loaded
   subset allows, for finer hierarchy without new fonts.

### 4.3 Layouts
1. **Shared `<BentoGrid>` / `<FeatureGrid>`** component (Aceternity `bento-grid` as a
   base, Afribit-tokenized) to replace bespoke `grid-cols-[…fr_…fr]` blocks on
   Programs, Merchants, About, Home "why Kibera".
2. **Sticky / scroll-pinned storytelling** for Program detail and "How the model
   works": pinned media column + stepped copy (framer-motion `useScroll` or CSS
   `scroll-timeline`).
3. **`<SectionHeader>`** primitive (eyebrow + `text-fluid-h2` + intro) — this exact
   markup is copy-pasted ~15 times.
4. **Merchant cards**: move to a consistent `<MerchantCard>` with image, status
   pills, hover spotlight, and a `Skeleton` loading state; add `loading.tsx`.
5. **Marquee upgrade**: swap the hand-rolled `.animate-brand-marquee` for Magic UI
   `marquee` (pause-on-hover, mask, vertical option) for partners/media logos.
6. **Container queries** for card grids so components reflow by their own width,
   not the viewport — fewer breakpoint-specific class chains.

### 4.4 Motion system
1. **Codify a motion config**: `src/lib/motion.ts` with shared `Variants`
   (fadeInUp, stagger, springs) + durations/eases as tokens, so every reveal
   matches. Wrap in a `<Reveal>` / `<StaggerGroup>` client component.
2. **Prefer CSS `view()` reveals** where possible; framer-motion `useInView` as the
   cross-browser fallback path.
3. **Micro-interactions**: button press/scale (partly there), input focus glow,
   nav underline, card lift — standardize via variants + `data-*` states.
4. **Page transitions**: light `AnimatePresence` fade/slide on route change
   (App Router `template.tsx`), reduced-motion aware.
5. **GSAP**: keep only if we build the hero timeline or SVG route-draw; otherwise
   drop it from deps to save weight (decision to confirm at implementation).

### 4.5 Components
- Add from shadcn registry: `tooltip`, `dialog`, `sonner` (toast — dep already
  present), `skeleton`, `scroll-area`, `hover-card`, `separator`, `sheet`
  (mobile nav could move to `sheet` instead of the custom overlay).
- Buttons: add a `subtle`/`link-arrow` variant with animated trailing arrow
  (pattern repeated inline everywhere); consider Magic UI `shimmer` / `border-beam`
  on the primary donate CTA only.
- Cards: converge on 2–3 canonical card components (content, stat, media) instead
  of per-page divs.
- Forms (Contact / newsletter): inline zod error animation, success state motion,
  `Field` wrapper; pull an animated input pattern from KokonutUI and retokenize.
- Nav: scroll-progress bar (CSS `scroll-timeline`), active-link indicator, and a
  `border-beam` or hairline on scroll (already changes bg opacity).

### 4.6 Per-page priority list (when we implement)
1. **Home hero** — flagship background + `TextReveal` headline + scroll cue.
2. **Home sections** — `<SectionHeader>`, `<Reveal>`/`view()` reveals, `NumberTicker`
   on ImpactStats / CampaignProgress / BitcoinTicker.
3. **Programs + Program detail** — `<BentoGrid>`, sticky storytelling, shared header.
4. **Merchants** — `<MerchantCard>`, skeletons, filter transitions, map placeholder.
5. **Contact/Community** — animated form fields + success motion.
6. **Global** — motion config, `<SectionBackground>`, fluid type, marquee swap,
   page transitions.
7. **Donate** — leave until BTCPay work resumes.

---

## 5. Dependency decision summary

| Add now | Copy-in (no dep) | Defer / avoid |
|---|---|---|
| (none required) | shadcn primitives, Magic UI patterns, Aceternity backgrounds, KokonutUI components, CSS scroll-driven animations | anime.js (only if imperative-timeline wall), tsParticles (only if particle motif chosen), react-three-fiber / shaders, react-bits as a package |

Everything in the "copy-in" column uses the **already-installed** Tailwind v4 +
Motion + shadcn CLI. Net new runtime weight target for phase 1: **0 kb**.

Reconsider `gsap` (currently installed, barely used) — drop unless the hero
timeline needs it.

---

## 6. Suggested phasing (for the later implementation plan)

- **Phase 0 — foundations. ✅ Done.** `src/lib/motion.ts`, fluid type scale
  (`--step--1`…`--step-8` → `text-fluid-*` in `globals.css`), `<SectionBackground>`,
  `<SectionHeader>`, `<Reveal>`/`<StaggerGroup>`/`<StaggerItem>`, `<NumberTicker>`,
  `<TextReveal>` — all in `src/components/ui/`. No page wired yet at this point.
- **Phase 1 — home. ✅ Done.** `hero.tsx`: `<TextReveal>` headline, staggered
  badge/paragraph/CTA entrance, reduced-motion-aware scroll-cue chevron.
  `impact-stats.tsx`: `<SectionHeader>` + `<StaggerGroup>` + `<NumberTicker>` counts.
  `campaign-progress.tsx`: `<Reveal>` card entrance + `<NumberTicker currency="USD">`
  for the raised amount.
- **Phase 2 — programs & merchants. ⚠️ Partially done.** Done: `<SectionHeader>` +
  `<StaggerGroup>`/`<StaggerItem>` reveal wiring on the home `Programs` section,
  `program-focus-cards.tsx`, `/programs` (hero, summary-metric row, operating-model
  cards), `/programs/[slug]` (hero copy, quote block, all three `SectionGrid`
  variants, final support CTA), `/merchants` (hero stat row, "why this directory"
  cards, and the `MerchantDirectoryClient` result grid). A canonical
  `<MerchantCard>` (`src/components/merchants/merchant-card.tsx`) now backs the
  directory grid, and `/merchants` has a `loading.tsx` skeleton state (§4.3.4 —
  done). The marquee (§4.3.5) turned out to already match the Magic UI
  pause-on-hover/mask pattern the plan asked for — no change needed there.
  **Not done / still open:** the shared `<BentoGrid>`/`<FeatureGrid>` component
  described in §4.3.1 (existing per-page `grid-cols-[...fr_...fr]` layouts were
  left as-is — converting them is a structural change, deferred pending a
  visual QA pass) and sticky/scroll-pinned storytelling for Program detail (§4.3.2,
  same reason).
- **Phase 3 — forms, nav, page transitions, marquee swap.** Not started.
- **Phase 4 — cleanup**: remove ad-hoc gradient strings, dead `gsap`, duplicate `cn()`. Not started.

Each phase: verify reduced-motion, Lighthouse (perf/a11y) before/after, and dark
contrast.

---

## 7. Risks / open questions

- Magic UI / Aceternity components ship their own class conventions — every pulled
  component must be retokenized to Afribit vars (no raw `blue-500`, no `zinc`).
- CSS scroll-driven animations still need JS fallback for Safari < 18 / older FF —
  keep the framer-motion path.
- Animated backgrounds + hero `<video>` together can spike GPU on mid mobile —
  measure; likely disable the animated layer when video is present.
- A light theme is out of scope here but the token refactor should leave room for it.
- Confirm whether the 2026 rebuild (`workspace/redesign-2026/`) supersedes any of
  this before building — align with that IA first.
