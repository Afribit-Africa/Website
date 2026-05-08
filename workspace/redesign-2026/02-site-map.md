# 02 Site Map

Prepared: 2026-05-05

## Phase 1 Public IA

- `/` Home
- `/about` About
- `/donate` Donate
- `/contact` Contact
- `/maps` Merchant map and directory shell
- `/fedi` Community on Fedi
- `/register` Business registration entry
- `/programs` Programs landing page
- `/programs/[slug]` Program detail template
- `/merchants` Merchant directory
- `/merchants/[slug]` Merchant detail template
- `/legal/privacy` Privacy policy
- `/legal/terms` Terms of service
- `/legal/cookies` Cookie policy
- `/admin/login` Admin login

## Explicitly Absent

- No additional program archive index is planned beyond the public `/programs` landing page and reusable `/programs/[slug]` detail template.

## Legacy Current-Code Routes

- `/impact`
- `/donate/success`
- `/programs/[slug]` exists in current code but is being retained only as a detail-template reference for redesign planning.
- `/admin` and authenticated admin portal routes remain outside redesign scope.

## Navigation Intent From Live Site

- Header items on live site: `About`, `Merchant Program`, `Merchant Map`, `Community`, `Contact`
- Primary header CTA on live site: `Fuel BCE`
- Footer quick links on live site: `About Us`, `Merchant Program`, `Merchant Map`, `Community`, `Contact Us`, `Donate`

## Implementation Note

- The current repo still contains `/impact` in code and keeps `/programs/[slug]` as a reusable detail-template surface. The public `/programs` landing page is now included in the target IA.