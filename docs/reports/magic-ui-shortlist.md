# Magic UI Shortlist

Prepared: 2026-05-01
Scope: public marketing surfaces and high-signal content cards

## Research Summary

Magic UI is a React, TypeScript, Tailwind CSS, and Motion-based component library positioned as a strong companion to shadcn/ui.

Relevant findings from current docs:

- Magic UI markets 150+ free open-source animated components and effects.
- The library is built for landing pages and marketing-heavy interfaces.
- `Magic Card` is available through the shadcn CLI path:
  - `pnpm dlx shadcn@latest add @magicui/magic-card`
- `Magic Card` supports spotlight-style hover treatment and is a good fit for panels that need more emphasis without changing layout structure.

## Best-Fit Components For Afribit

### Immediate fit

- `Magic Card`
  - Best for: contact form shell, donation tiers, invite code panels, admin sign-in blocks
  - Reason: it adds perceived polish without changing data flow or form contracts

- `Marquee`
  - Best for: trust rails, featured-in strips, supporter logos, ticker statements
  - Reason: directly matches the homepage need for endless motion loops

- `Blur Fade`
  - Best for: section-intro reveals and card entrance motion
  - Reason: cleaner and more restrained than stacking multiple custom animations

- `Bento Grid`
  - Best for: program overviews, impact clusters, merchant ecosystem storytelling
  - Reason: gives structure to mixed-size content blocks without visual clutter

- `Border Beam` or `Shine Border`
  - Best for: BTCPay campaign cards, Fedi invite cards, newsletter CTA shells
  - Reason: strong focal treatment for key conversion surfaces

### Situational fit

- `Animated Beam`
  - Best for: visualizing value flow in circular economy diagrams or "how it works" sections

- `Animated Grid Pattern`
  - Best for: subtle section backdrops behind stats or technical narratives

- `Animated Gradient Text`
  - Best for: restrained hero emphasis, not paragraph copy

- `Number Ticker`
  - Best for: replacing purely decorative counters
  - Note: Afribit already has GSAP counters, so this should only replace rather than duplicate them

## Aceternity Components Still Worth Keeping

- `Comet Card`
  - Best for featured media or flagship program cards where depth and hover response matter

- `Spotlight`
  - Best for hero lighting and emphasis behind a single message

- `Aurora` / beam-style backgrounds
  - Best for hero and CTA backdrops when used sparingly

## Font Direction

For Afribit's current direction, the safest path is still a two-font system:

- Body: `Inter`
  - Reason: clean, readable, neutral, already in use

- Display candidate 1: `Space Grotesk`
  - Reason: better personality for headlines without becoming too stylized

- Display candidate 2: `Sora`
  - Reason: softer and more contemporary for campaign-style marketing sections

If the visual goal is sharper and more editorial, `Space Grotesk + Inter` remains the strongest next font move.

## Animation Guidance

- Use one entrance language consistently across the public site.
- Prefer fade, blur-fade, and marquee motion over many competing hover effects.
- Reserve heavier effects like `Comet Card` for sections that need priority, not for every card grid.
- Let spacing and hierarchy solve most professionalism issues before animation does.

## Recommendation

Short term:

- Keep the existing shadcn foundation.
- Use a local `MagicCard`-style wrapper for high-value surfaces first.
- Continue using Aceternity selectively for flagship moments.

Next best candidates to install later:

1. `@magicui/magic-card`
2. `@magicui/blur-fade`
3. `@magicui/marquee`
4. `@magicui/border-beam`
5. `@aceternity/comet-card`