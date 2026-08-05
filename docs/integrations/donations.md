# Donations Integration And Migration Plan

Afribit currently keeps the public donation page online with an address-only Lightning QR flow while direct BTCPay checkout is being moved onto Afribit's own infrastructure.

## Public Donation Flow Active Now

The live user experience should be treated as static until Afribit's BTCPay server is ready:

1. A donor opens `/donate`.
2. The page shows a maintenance notice explaining that BTCPay Server checkout is temporarily unavailable.
3. The page shows a QR code generated only from `afribit@blink.sv`.
4. The donor scans the QR code or copies `afribit@blink.sv`.
5. The donor sets any donation amount from their wallet.

This flow intentionally does not call the local donation invoice API.

## Current Public Donation Targets

- Payment page: `https://pay.blink.sv/afribit/print`
- Lightning address: `afribit@blink.sv`
- QR value: `afribit@blink.sv`
- Configurable environment overrides:
  - `NEXT_PUBLIC_DONATION_PAY_URL`
  - `NEXT_PUBLIC_DONATION_LIGHTNING_ADDRESS`
  - `NEXT_PUBLIC_DONATION_QR_VALUE`

## Active Donation UI Code

- `src/app/donate/page.tsx` renders the temporary maintenance notice and QR-only donation page.
- `src/components/donations/donate-experience.tsx` renders the address-only QR code and copyable Lightning address.
- `src/lib/donation-tiers.ts` preserves the hidden tier strategy, impact labels, linked programs, images, and FAQ copy.
- `src/lib/donation-policy.ts` defines donation constants, the static Blink fallback target, Lightning address, currencies, minimums, and amount helpers.
- `.env.example` documents both the future BTCPay variables and the current static fallback variables.
- `docs/archive/donation-page-tiered-strategy-2026-08-05.md` archives the hidden tiered donation page strategy for restoration.

## Existing BTCPay Code Kept For Migration

The repo already contains a mostly complete BTCPay integration. It is not used by the current static donation panel, but it should be preserved for the self-hosted BTCPay rollout.

- `src/lib/btcpay.ts`
  - Configures `btcpay-greenfield-node-client`.
  - Creates invoices.
  - Reads invoice status.
  - Reads store invoice totals.
  - Verifies webhook HMAC signatures.
- `src/app/api/donations/create-invoice/route.ts`
  - Validates donor input.
  - Creates BTCPay invoices.
  - Stores pending donation records.
  - Returns the BTCPay checkout link.
- `src/app/api/donations/check-status/[invoiceId]/route.ts`
  - Pulls invoice state from BTCPay.
  - Updates local donation status.
  - Increments linked program totals when completed.
- `src/app/api/donations/webhook/route.ts`
  - Verifies BTCPay webhook signatures.
  - Maps BTCPay invoice events to local donation status.
  - Sends donor/admin email notifications when configured.
- `src/app/api/donations/stats/route.ts`
  - Reads completed donation totals from the database.
  - Falls back to BTCPay store stats when local DB totals are empty.
- `prisma/schema.prisma`
  - `Donation` stores invoice id, amount, currency, donor info, status, optional program linkage, and completion time.
  - `Program` has a `donations` relation and `raised` total for program-linked giving.
- `src/lib/email-templates.ts`
  - Contains donor confirmation and admin donation notification templates.

## Required BTCPay Environment Variables

When the Afribit BTCPay server is ready, configure:

```env
BTCPAY_HOST="https://pay.afribit.africa"
BTCPAY_STORE_ID=""
BTCPAY_API_KEY=""
BTCPAY_WEBHOOK_SECRET=""
NEXT_PUBLIC_SITE_URL="https://afribit.africa"
ADMIN_EMAIL=""
```

The API key should be scoped to the Afribit store and allow invoice creation/read access. The webhook secret must match the secret configured for the BTCPay webhook endpoint.

## BTCPay Server Setup Checklist

1. Provision Afribit's BTCPay server and confirm the public host, for example `https://pay.afribit.africa`.
2. Create or import the Afribit store.
3. Configure wallet payment methods:
   - Lightning if available.
   - On-chain Bitcoin if Afribit wants on-chain support.
4. Create a Greenfield API key for the website backend.
5. Add a webhook in BTCPay:
   - URL: `${NEXT_PUBLIC_SITE_URL}/api/donations/webhook`
   - Events: invoice created, payment received, payment settled, invoice settled, invoice expired, invoice invalid.
   - Secret: same value as `BTCPAY_WEBHOOK_SECRET`.
6. Set the production environment variables in Vercel or the target hosting platform.
7. Test invoice creation from the website against the new store.
8. Test webhook delivery using a low-value Lightning invoice.
9. Confirm `Donation` records move from `PENDING` to `PROCESSING` or `COMPLETED`.
10. Confirm completed program-linked donations increment `Program.raised`.
11. Re-enable the interactive checkout form in `DonateExperience` or add a new BTCPay checkout component that calls `/api/donations/create-invoice`.
12. Keep the address-only QR page as a fallback panel or emergency maintenance mode.

## Deployment Context Found Locally

The local checkout is linked to Vercel through `.vercel/project.json`:

- Project name: `afribit-africa`
- Framework: Next.js
- Node version: `22.x`
- Root directory: repository root

`vercel whoami` returned `Not authorized` in this shell, so remote deployment inspection requires refreshing Vercel CLI auth before querying logs, deployments, or environment variables.

GitHub context:

- Origin: `https://github.com/Afribit-Africa/Website.git`
- Default branch: `main`
- Local branch: `main`
- Open PRs at inspection time: none

## Operational Strategy

- Keep the address-only Lightning QR flow live while BTCPay infrastructure is unavailable.
- Do not delete the existing BTCPay API routes; they are the migration foundation.
- Keep hidden donation tiers program-aligned so future invoice metadata can use the same strategy.
- Prefer environment-variable switching for public donation targets.
- Before restoring direct checkout, verify BTCPay invoice creation, webhook signatures, database writes, email delivery, and program totals end to end.
