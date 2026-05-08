# Current Spacing and Alignment Review

Prepared: 2026-05-01
Scope: current homepage implementation and shared public shell

## Intent Read

The current design direction is no longer chasing a wide, experimental landing page. It is moving toward a tighter, darker, more deliberate live-site-style system with stronger consistency between header, sections, cards, and footer.

This is not final polish. It reads like an active in-progress alignment pass where the main priority is now rhythm and structure, not new visual effects.

## System Now Driving The Layout

The shared spacing and alignment system is mostly defined in these files:

- `src/app/globals.css`
- `src/components/shared/DesignSystem.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/sections/HomepageRebuild.tsx`

### Shared spacing primitives

- `.container` uses `max-width: 1180px`
- `.container` padding is `1rem` on mobile, `1.5rem` from `640px`, `2rem` from `1024px`
- `.section` uses `3.25rem` vertical padding on mobile and `4.5rem` on tablet and up
- `.section-tight` uses `2.25rem` on mobile and `3rem` on tablet and up
- `.section-spacious` uses `4.5rem` on mobile and `6rem` on tablet and up
- `.section-hero` uses `6rem 4rem` on mobile and `7.5rem 5.5rem` on tablet and up

### Shared alignment primitives

- `Section` handles section-level alignment with `align="left"` or `align="center"`
- `SectionHeader` defaults to centered presentation layout
- `StatCard`, `CTA`, and most homepage sections currently lean into centered composition

## What The Current Spacing Is Doing Well

- The page now has a clear vertical rhythm instead of oversized empty space.
- The header, homepage sections, and footer feel like they belong to the same system.
- Card padding is mostly stable around `p-4`, `p-5`, and `p-6`, which makes the page feel more disciplined.
- Border radius is consistent enough that nothing feels like it came from a different design pass.
- The container width is restrained enough to improve alignment without making the site feel narrow.
- The tighter section cadence fits the darker visual language better than the previous looser layout direction.

## What The Current Alignment Is Doing Well

- Centered sections create a strong public-facing, campaign-style landing page feel.
- Stat blocks, logos, testimonials, CTA areas, and ticker content all benefit from the current centered treatment.
- The homepage is easier to scan top-to-bottom because most sections share the same framing logic.
- The header and footer align cleanly with the body container, which helps the whole site feel more intentional.

## Where The Rhythm Feels Strongest

### Hero

- Strong left-anchored content inside the shared container.
- Good relationship between headline width, supporting copy width, and CTA spacing.
- The hero feels denser than earlier redesign attempts in a good way.

### Why Kibera

- This is one of the strongest sections structurally.
- Two-card layout, image ratio, and left-aligned card body create better reading flow than the more presentation-heavy sections.
- The `space-y-4` and `p-5` combination feels balanced here.

### FAQ and Newsletter reset

- The narrower FAQ width works as a pacing reset late in the page.
- The newsletter panel and final CTA do a good job compressing the end of the page without feeling abrupt.

## Where Spacing Or Alignment Still Feels Uneven

### Center alignment is overused

Most of the homepage is centered, including sections that are structurally split into left and right columns. That makes the page feel consistent, but it also removes directional hierarchy on large screens.

This is most visible in:

- the BTCPay campaign section
- the Fedi split section
- the merchant network block
- parts of the strategic goals and media sections

### Split sections are still behaving like poster layouts

On desktop, sections with two-column composition still keep the copy block centered inside its own column. That weakens scan flow because the eye does not get a strong left edge to follow.

The layout is structurally two-column, but the alignment is still one-column presentation.

### Density changes from section to section

The page is mostly compact, but not at exactly the same cadence.

Examples:

- media cards feel denser than the surrounding sections because of `p-3` outer spacing plus `p-2` inner content
- the campaign block is slightly tighter than the impact section that follows it
- some sections use `gap-4`, others `gap-5`, `gap-6`, or `gap-8` with no obvious hierarchy yet

This is not broken, but it shows the system is still settling.

### The hero sits slightly outside the shared section system

The hero uses a custom `section` wrapper and its own internal `py-14 md:py-16` instead of the shared `Section size="hero"` primitive.

That is not necessarily wrong, but it means the most important section is currently governed by a different spacing rule than the rest of the homepage.

## Section-by-Section Read

### BTCPay campaign block

- Outer spacing is good.
- Internal alignment is too centered for a two-column section.
- The metric card works, but the text column and number card compete instead of leading and supporting.

### Impact at a glance

- Good grid discipline.
- Stat cards and impact image cards share a strong card rhythm.
- This section feels like a stable baseline for the rest of the page.

### Circular resilience / programs

- The four-card grid is visually clean and aligned.
- The section is structurally consistent with the rest of the page.
- Copy length may become the next pressure point if program descriptions grow.

### Merchant network

- Clear and readable.
- Slightly repetitive because it repeats the same centered stat-card language already used earlier.
- The CTA placement is consistent, but the section may want stronger left-right contrast later.

### Testimonials and partners

- These sections sit comfortably in the current system.
- Logo height normalization helps partner cards align better.
- Testimonials are visually calm and consistent with the darker tone.

### Fedi section

- Good structure, but alignment still feels too centered for a split layout.
- The section looks organized, but not yet directional.

### Media coverage

- Card layout is coherent.
- This section currently feels a little tighter than the rest of the page because card content spacing is compressed.

## Current Design Rule Set Worth Preserving

- Keep the current `1180px` container width.
- Keep the tighter section rhythm rather than returning to oversized vertical spacing.
- Keep the current card padding range as the default.
- Keep centered alignment for marquees, stats, testimonials, CTA panels, and narrow FAQ content.
- Use left alignment by default for desktop split sections unless there is a clear reason to keep them centered.
- Solve emphasis with contrast, hierarchy, or scale before solving it with more padding.

## Practical Takeaway

The current work already has a real spacing system. The main unfinished part is not raw spacing anymore. It is alignment strategy.

The page now needs fewer new ideas and more discipline about when content should be centered and when it should lock to a readable left edge.

That is the main thing to preserve while the design is still in progress.