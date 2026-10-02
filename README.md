# Afribit Africa

Afribit Africa is a Bitcoin-powered community platform focused on education, merchant onboarding, financial inclusion, and practical economic participation across African communities.

This repository contains the public website and operational platform for Afribit Africa. It currently includes:

- public-facing pages for mission, programs, donations, and contact
- a static Lightning donation page, with the BTCPay integration retained but checkout disabled
- a Prisma and PostgreSQL (Neon) data layer for merchants, donations and submissions
- a searchable merchant directory, Builders project pages and the Bitcoin education Studio

## What The Site Does

- explains Afribit Africa's mission and programs
- shares a Lightning address and QR code for donations
- captures contact and newsletter submissions
- presents community stories and program progress
- provides merchant profiles and public map links, alongside audio education with synchronized text

## Who This README Is For

This README is written for partners, operators, and collaborators first.

If you want the technical details, local setup guidance, or architecture notes, use the docs hub:

- [docs/README.md](docs/README.md)

## Running The Site Locally

### 1. Install prerequisites

- Node.js 20 or later
- npm
- a PostgreSQL database (Neon in production)
- BTCPay Server credentials and explicit checkout opt-in only when restoring invoice payments

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

Copy `.env.example` to `.env.local` and fill in the required values.

### 4. Generate the Prisma client

```bash
npm run db:generate
```

### 5. Start the development server

```bash
npm run dev
```

The site will run at `http://localhost:3000`.

## Required Services

Depending on which features you need locally, the project may require:

- PostgreSQL for application data
- BTCPay Server for retained invoice/webhook operations; new checkout requires `BTCPAY_CHECKOUT_ENABLED=true`
- SMTP email credentials for outbound notifications
- hCaptcha keys for contact-form bot protection
- A healthy Upstash Redis connection and `PUBLIC_FORM_REDIS_ENABLED=true` for distributed form limits; otherwise limits are per instance

You can still work on most UI pages without all production integrations configured.

## Maintenance

`npm run merchants:audit` produces a sanitized directory report. `npm run merchants:dedup`
is dry-run-only unless passed `-- --apply`; it archives only the two reviewed import copies,
backs up privately, preserves canonical GPS/history and never edits OSM nodes.

See [the October maintenance report](docs/maintenance/2026-10-02.md) for changes,
verification, held merchant identities and remaining security/configuration work.

## Documentation

The repository is moving toward a single documentation home under `docs/`.

- [docs/README.md](docs/README.md) - documentation hub
- [docs/setup/local-development.md](docs/setup/local-development.md) - local environment and startup guide
- [docs/architecture/current-state.md](docs/architecture/current-state.md) - current application architecture and gaps
- [docs/architecture/content-model.md](docs/architecture/content-model.md) - planned content model and merchant platform direction
- [docs/integrations/donations.md](docs/integrations/donations.md) - donation system overview

## Current Product State

The current codebase is strongest in these areas:

- donation infrastructure and BTCPay integration
- responsive public marketing pages
- SEO and metadata support
- Prisma-backed operational data

The biggest work now in progress is structural:

- consolidating documentation into `docs/`
- redesigning content ownership so important site content is no longer split between database records and static TypeScript files
- preparing a merchant directory and map-based merchant experience using OpenStreetMap and Leaflet
- improving page depth, content credibility, and executive presentation quality

## Repository Structure

```text
src/
  app/            Next.js App Router pages and API routes
  components/     UI, layout, donation, form, and section components
  data/           Static content sources that are planned for gradual migration
  lib/            Integrations, metadata, email, Prisma, and utilities
  types/          Shared TypeScript types
prisma/           Prisma schema and database configuration
public/           Images, videos, and static assets
docs/             Centralized project documentation
```

## Near-Term Priorities

- centralize and polish documentation
- redesign the content and merchant data model
- replace shallow merchant and program experiences with richer, data-backed pages
- add GIS-aware merchant discovery with map and list views

## Support And Coordination

For implementation details, use the docs linked above.

For product and structure changes, the repository is being actively reorganized so documentation and architecture notes remain aligned with current work.
