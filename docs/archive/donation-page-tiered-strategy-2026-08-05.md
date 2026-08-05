# Archived Donation Page Strategy - 2026-08-05

This archive preserves the tiered Afribit donation page strategy that was hidden while BTCPay Server checkout is under maintenance.

The active `/donate` page is temporarily simplified to a single Lightning QR code and copyable address:

- Lightning address: `afribit@blink.sv`
- QR value: `afribit@blink.sv`
- Temporary notice: Afribit's BTCPay Server checkout is under maintenance while moving to Afribit-owned infrastructure.

## Hidden Tiered Donation Strategy

The tier data remains in `src/lib/donation-tiers.ts` and can be restored when direct checkout returns.

Visible tiers before the temporary simplification:

- Custom Contribution
  - Label: General Empowerment Fund
  - Purpose: flexible operating support for all Afribit programs.
- Friend of Afribit Kibera
  - Label: Core Supporter
  - Suggested amount: `$25+`
  - Purpose: communication tools, supplies, and recurring field coordination.
- Business Accelerator Program
  - Label: Fuel local entrepreneurship
  - Linked program: `merchants`
  - Purpose: merchant, business, and rider-team support.
- Bitcoin Education Program
  - Label: Train 500 Community Ambassadors
  - Purpose: Bitcoin literacy cohorts, meetups, and community champions.
- Equipment for Efficiency & Scaling
  - Label: Tools for upcycling and waste management
  - Fixed amount: `$90`
  - Purpose: equipment such as sewing machines, handcarts, and processing tools.
- Upcycle Queen
  - Label: Empower a micro-entrepreneur
  - Fixed amount: `$190`
  - Linked program: `upcycling`
  - Purpose: sponsor one woman in the upcycling and weekend empowerment program.
- Satoshi Kwa Usafi
  - Label: Sats for cleanups
  - Linked program: `waste-management`
  - Purpose: Bitcoin rewards and expansion support for cleanup crews.

## Code To Restore Later

The current temporary component is intentionally minimal:

- `src/app/donate/page.tsx`
- `src/components/donations/donate-experience.tsx`

The supporting donation strategy and BTCPay code were not deleted:

- `src/lib/donation-tiers.ts`
- `src/lib/donation-policy.ts`
- `src/lib/btcpay.ts`
- `src/app/api/donations/create-invoice/route.ts`
- `src/app/api/donations/check-status/[invoiceId]/route.ts`
- `src/app/api/donations/webhook/route.ts`
- `src/app/api/donations/stats/route.ts`
- `prisma/schema.prisma`

## Restoration Notes

When Afribit's BTCPay Server is ready:

1. Restore a tier/card selection UI that reads from `donationTiers`.
2. Reconnect the checkout button to `/api/donations/create-invoice`.
3. Keep the temporary QR-only page as a fallback or maintenance mode.
4. Verify invoice creation, webhook delivery, donation status updates, email notifications, and program totals before exposing tiered checkout again.
