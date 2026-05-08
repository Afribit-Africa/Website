# 11 Build Order

Prepared: 2026-05-05

## Sequence

1. Confirm MCP setup and archive safety.
2. Preserve or recreate the minimal active App Router shell needed to keep backend routes stable.
3. Establish shared public shell rules, typography, color tokens, and asset-path conventions.
4. Build homepage.
5. Build core marketing pages: about, donate, contact, fedi.
6. Build merchant directory and merchant detail.
7. Build maps and register.
8. Build legal pages.
9. Build admin login.
10. Add deferred parity work, redirects, and any legacy route handling that survives the archive pass.

## Parallel Work

- Legal content pages can proceed in parallel with merchant/map work after the shared shell exists.
- Asset cleanup can proceed in parallel with page implementation once every dependency is mapped.
- Admin login can proceed late because its scope is intentionally narrow.

## Readiness Checklist

- MCP verification log completed
- archive metadata present
- redesign docs created
- route scope locked
- asset map at least root-complete
- no active code depends on legacy archive paths