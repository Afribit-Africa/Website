# Afribit Builders

Updated 2026-09-10. The Builders space showcases the team and three projects. It is
not a blog or a production console for those projects.

## Routes and content

| Page | Route |
| --- | --- |
| Team and project showcase | `/builders` |
| Recycling rewards | `/builders/taka-sats` |
| Community internet | `/builders/afribit-wifi` |
| Economic intelligence with Insats | `/builders/insats` |

`src/lib/builders.ts` is the static source for descriptions, long-form project
sections, stages, workflow steps, technologies, metadata, and the old URL mapping.
Original supplied documents remain in `docs/blog/`. Descriptions distinguish
design intentions and pilot work from operational capabilities.

`/blog` returns a 308 redirect to `/builders`. The three former article routes
redirect to their matching project pages. Unknown slugs return 404. A later blog
feature can reclaim the index while preserving these three legacy redirects.

The index emits CollectionPage/ItemList and BreadcrumbList structured data.
Project pages emit WebPage/Project and BreadcrumbList, website Open Graph metadata,
and canonical Builders URLs. They do not emit BlogPosting or publication bylines.
The sitemap contains Builders URLs and excludes the redirect routes.

## Design and interaction

- Scoped CSS: `src/app/builders/builders.css`. Near-black and forest surfaces,
  orange calls to action, green Taka Sats accents, cyan Insats accents.
- Real existing Kibera photography anchors the hero and project stories. The
  previously generated Wi-Fi asset is labeled as a concept illustration. Asset
  paths under `public/Images/blog/` are retained to avoid unnecessary duplication.
- Anime.js v4 provides finite hero entrances, pointer grid movement, workflow
  transitions, and chart fades. Scopes and event listeners clean up on unmount.
- Existing Button and Radix Tabs components support the page. A scoped Builders
  reveal wrapper animates after hydration and keeps server markup visible;
  the shared Reveal conditionally rendered different markup under reduced motion.
  Workflow tabs are
  keyboard navigable. Chart controls include product selection, a period slider,
  series visibility, and a data table. At least one series remains visible.
- `BuildersFrame` observes header size, including the taller reduced-motion
  notice, to keep titles and anchor destinations clear of the fixed header.
- No animation runs indefinitely. The existing site's reduced-motion preference
  is respected, and content remains available without JavaScript.

## Insats data provenance

Credit links lead to [Insats](https://insats.org). Two distinct data surfaces are
intentionally displayed separately:

1. **Illustrative method chart:** `src/lib/insats.ts` contains the three eight-period
   example series (milk, maize flour, vegetables) displayed by the Insats homepage
   on 2026-09-09. The original homepage asset was
   `https://insats.org/assets/index-D4xkVhnD.js`. Its chart explicitly identifies
   these as illustrative data with baseline 100. These values are a static
   snapshot, not verified local prices, forecasts, or current currency quotes.
2. **Polled public report:** `/api/builders/insats` fetches the public
   [Kibera report](https://prices.insats.org/report). It exposes only the published
   verified-entry count, active-merchant count, source URL, and retrieval time.
   The report returned 0 entries and 0 merchants when inspected. No chart-series
   JSON API was present in that site's public OpenAPI document. Its homepage
   advertises an organization API separately; this integration uses no credentials
   and does not access private observations or payment records.

The route uses a fixed upstream URL, an eight-second timeout, no redirects,
`htmlparser2` DOM parsing, zod validation, and a five-minute server cache. Labels
and the Kibera report heading must match. Missing or invalid values return 503,
never invented zeroes. The HTML adapter is deliberately limited to these counts:
if Insats changes its public report markup, update the parser and fixtures, or
replace it with a documented public JSON contract when one becomes available.

The browser requests the report when its section is visible, then polls every
five minutes while both the section and document remain visible. Requests cannot
overlap and are cancelled on unmount. Manual refresh uses the same cached route.
CDN/server caching may serve an older snapshot; the displayed retrieval timestamp
belongs to that snapshot. On a refresh failure, last-retrieved counts remain
visible with a stale-state message. An initial failure displays unavailable
values, with a source link and retry button. Live counts never relabel the
illustrative chart as measured data.

## Verification

```sh
npm run lint
npx tsc --noEmit
npx tsx --test tests/builders/insats-report.test.ts
npm run build
node tests/builders/browser.mjs <playwright-module-path> http://localhost:3000
```

The browser check uses Playwright from the supplied local module path, without
adding a production dependency. It covers all four pages, responsive widths,
canonical/schema output, workflow tabs and keyboard input, chart controls,
upstream failure/stale states, legacy redirects, sitemap, and mobile navigation.
It reads the real public report for its initial smoke check and mocks only the
failure scenarios. Screenshots are written to the operating system temp folder.
