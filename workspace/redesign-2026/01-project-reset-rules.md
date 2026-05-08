# 01 Project Reset Rules

Prepared: 2026-05-05

## Source Of Truth

- `https://www.afribit.africa` is the source of truth for public content, route hierarchy, section order, CTA labels, footer IA, and baseline visual tone.
- The live site date lock for this reset is 2026-05-05.

## What Stays Active

- `public/**`
- `prisma/**`
- `src/app/api/**`
- Auth and integration utilities under `src/lib/**` that back active contracts
- `src/types/**`
- Root config and build files
- Local Vercel linkage in `.vercel/project.json`

## What Becomes Historical Input

- `afribit-docs/**`
- `new design inspo/**`
- Superseded root redesign markdown files
- Current public marketing/frontend surfaces once archived

## New Working Source

- `workspace/redesign-2026/` is the only tracked redesign source of truth.
- `workspace/_legacy-archive/` is read-only historical material and must never be imported by live code.

## Route Scope Lock

- Phase 1 redesign docs cover: `/`, `/about`, `/donate`, `/contact`, `/maps`, `/fedi`, `/register`, program detail, merchant directory, merchant detail, legal pages, and `/admin/login`.
- `/programs` is intentionally absent or 404 in the new public IA unless product direction changes later.
- Current repo routes `/impact`, `/donate/success`, and `/programs/**` are treated as legacy for this reset.

## Admin Scope Lock

- Admin redesign scope is limited to `/admin/login`.
- Existing admin portal surfaces remain preserved but are outside the redesign brief.

## Delivery Rules

- This phase delivers markdown planning and reset scaffolding, not a frontend rebuild.
- Backend/public contracts are unchanged in this phase.
- `public/Media/**` is the future canonical asset path, but assets are not being moved yet.

## Current Preflight Notes

- Vercel CLI account verified: `afribit`
- Vercel project visibility verified: `afribit-africa`
- `.env.local` refreshed from Vercel on 2026-05-05
- Current env-name drift identified and tracked in `03-content-source-map.md`