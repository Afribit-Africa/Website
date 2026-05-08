# 03 Content Source Map

Prepared: 2026-05-05

## Source Priority

- First: live site content and route behavior at `https://www.afribit.africa`
- Second: current repo content helpers and static data
- Third: historical redesign docs for context only
- Fourth: documented content gaps to resolve before implementation

## Live Site Route Evidence

- Confirmed active from live site or repo parity work: `/`, `/about`, `/donate`, `/contact`, `/maps`, `/fedi`, `/register`, `/admin/login`, legal pages.
- Live site references program detail routes such as `/programs/merchants`, `/programs/upcycling`, `/programs/waste-management`, and `/programs/bodaboda`.
- Live site footer and CTA inventory reinforce `/about`, `/contact`, `/fedi`, `/donate`, and merchant/map flows.

## Current Repo Inputs Worth Mining Before Archive

- `src/data/homepage.ts`
- `src/data/about.ts`
- `src/data/donate.ts`
- `src/data/fedi.ts`
- `src/data/legal.ts`
- `src/data/navigation.ts`
- `src/data/merchants.ts`
- `src/data/programs.ts`
- `src/lib/content/**`

## Historical Inputs Only

- `afribit-docs/**`
- `docs/reports/live-site-reconstruction-spec.md`
- `new design inspo/**`
- legacy redesign markdown files at repo root

## Known Conflicts To Preserve In Planning

- Historical notes claimed `/programs` should be public 404, but the current repo still implements `/programs` and `/programs/[slug]`.
- Current repo includes `/impact` and `/donate/success`, but these are out of the approved phase 1 redesign route set.
- `.env.example` and `.env.local` do not currently match by key name.

## Env Name Drift

### Present In `.env.example` Only

- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_SITE_VERIFICATION`
- `ADMIN_EMAIL`
- `BTCPAY_WEBHOOK_SECRET`
- `SMTP_FROM`
- `HCAPTCHA_SECRET`

### Present In `.env.local` Only

- `DATABASE_URL_UNPOOLED`
- `EMAIL_FROM`
- `EMAIL_FROM_NAME`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `HCAPTCHA_SECRET_KEY`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_BTCPAY_STORE_ID`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_afribit_STACK_PROJECT_ID`
- `NEXT_PUBLIC_afribit_STACK_PUBLISHABLE_CLIENT_KEY`
- `NODE_ENV`
- `PORTFOLIO_ALLOWED_ORIGIN`
- `PORTFOLIO_API_KEY`
- `RATE_LIMIT_MAX`
- `RATE_LIMIT_WINDOW_MS`
- `RESEND_API_KEY`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_REDIS_REST_URL`
- `VERCEL_OIDC_TOKEN`
- `afribit_DATABASE_URL`
- `afribit_DATABASE_URL_UNPOOLED`
- `afribit_NEON_PROJECT_ID`
- `afribit_PGDATABASE`
- `afribit_PGHOST`
- `afribit_PGHOST_UNPOOLED`
- `afribit_PGPASSWORD`
- `afribit_PGUSER`
- `afribit_POSTGRES_DATABASE`
- `afribit_POSTGRES_HOST`
- `afribit_POSTGRES_PASSWORD`
- `afribit_POSTGRES_PRISMA_URL`
- `afribit_POSTGRES_URL`
- `afribit_POSTGRES_URL_NON_POOLING`
- `afribit_POSTGRES_URL_NO_SSL`
- `afribit_POSTGRES_USER`
- `afribit_STACK_SECRET_SERVER_KEY`

## Content Gaps To Resolve Later

- Confirm live merchant detail route with a currently valid merchant slug.
- Confirm exact live copy for `/maps` and `/register` once route-by-route captures are refreshed.
- Confirm current live donation campaign figures at implementation time because BTCPay stats are time-sensitive.