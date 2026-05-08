# Donations Integration Overview

The donation flow is the strongest implemented functional area in the current application.

## Current Flow

1. A donor starts from the donate page or donation modal.
2. The app sends a request to create an invoice.
3. BTCPay Server returns a checkout link and invoice identifier.
4. The donor completes payment through BTCPay.
5. The application checks invoice state and receives webhook events.
6. The donation record is updated in the database.

## Primary Code Areas

- `src/components/donations/DonationModal.tsx`
- `src/app/api/donations/create-invoice/route.ts`
- `src/app/api/donations/check-status/route.ts`
- `src/app/api/donations/webhook/route.ts`
- `src/lib/btcpay.ts`

## Current Limitations

- program selection in the modal is currently hardcoded
- donation-related content is not yet aligned with a relational content model
- email and reporting flows need to stay aligned as schema evolves

## Implementation Guidance

As the content model is redesigned, preserve this donation flow and avoid breaking:

- invoice creation
- status polling
- webhook verification
- donor confirmation and admin notifications

This area should be treated as a protected workflow during future schema and UI refactors.