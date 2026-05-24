# Local Development

This guide describes the fastest reliable way to run the Afribit site locally.

## Prerequisites

- Node.js 20 or later
- npm
- a MySQL database reachable from your machine

Optional, depending on what you are testing:

- BTCPay Server credentials for donation flows
- SMTP credentials for outbound email testing
- hCaptcha keys for the contact form

## Environment Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in the values required for the features you want to test.

### Core variables

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`

### SEO and search variables

- `GOOGLE_SITE_VERIFICATION` for Google Search Console URL-prefix verification

### Donation flow variables

- `BTCPAY_HOST`
- `BTCPAY_STORE_ID`
- `BTCPAY_API_KEY`
- `BTCPAY_WEBHOOK_SECRET`

### Email variables

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `ADMIN_EMAIL`

### Contact form protection

- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- `HCAPTCHA_SECRET`

## Installation

```bash
npm install
npm run db:generate
```

If your database schema already exists and you only need the client generated, the commands above are enough to start UI work.

If you are actively changing schema and migrations, use the Prisma scripts in `package.json` carefully against the correct database.

## Run The App

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

```bash
npm run lint
npm run build
npm run db:generate
npm run db:studio
npm run test-db
```

## Notes On Current State

- Many public-facing pages can be developed without live BTCPay or SMTP.
- Donation testing requires a working BTCPay configuration.
- Contact-form end-to-end testing is best done with hCaptcha configured, though the UI can still be developed without production keys.
- Merchant discovery and GIS features are planned but not yet implemented in the current codebase.

## Google Search Console

Use a URL-prefix property if you want the site to verify through the app itself.

1. Open Google Search Console and add the exact production URL as a URL-prefix property.
2. Choose the HTML tag verification method.
3. Copy only the token from the `content` attribute.
4. Set `GOOGLE_SITE_VERIFICATION` in your deployed environment.
5. Redeploy the site so the verification meta tag is emitted from the root layout.
6. In Search Console, verify the property and submit `https://afribit.africa/sitemap.xml`.

If you want a domain property instead of a URL-prefix property, the verification happens in DNS and does not require an application code change.