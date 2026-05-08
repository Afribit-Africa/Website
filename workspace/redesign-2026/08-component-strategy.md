# 08 Component Strategy

Prepared: 2026-05-05

## Sourcing Rules

- `shadcn/ui` for structure, forms, dialogs, navigation, tabs, and legal layouts
- `Magic UI` for marquee, blur-fade, grid and background treatments, and subtle emphasis
- `Aceternity UI` for hero drama, spotlight, comet cards, and storytelling surfaces
- `shadcn/studio` for landing-page block exploration and optional Figma-to-code experiments
- `UI9000` only for campaign progress or impact visualization concepts
- `ChunkHound` before rebuilding any surface that already has content or logic dependencies in the repo

## Structural Rule

- Existing backend and data contracts win over component-library convenience.
- The new public shell should stay thin over current API and content sources.