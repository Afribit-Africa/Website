# Current Architecture

This document describes the application as it exists today.

## Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma with MySQL
- BTCPay Server for Bitcoin donations
- Nodemailer for email

## Current Strengths

- The donation flow is already implemented and is the most complete product surface.
- The public marketing site is structured and visually consistent.
- API routes exist for contact, newsletter, and donation workflows.
- The Prisma schema already covers operational records such as donations, subscribers, page views, and testimonials.

## Current Structural Gaps

### 1. Documentation sprawl

The repository has many root-level markdown files with overlapping scope. This makes onboarding and maintenance harder than necessary.

### 2. Split content ownership

Important site content is split across two patterns:

- database-backed operational records in `prisma/schema.prisma`
- static TypeScript content in `src/data/`

Programs and testimonials currently live in static files, while donations and submissions are database-backed.

### 3. Merchant model does not exist yet

The site references merchants in testimonials and statistics, but there is no merchant entity, directory page, detail page, or location-aware discovery workflow.

### 4. Program pages are shallow

Program detail pages currently depend on static content and hardcoded supporting facts. That limits credibility and makes future growth harder.

### 5. GIS and maps are unimplemented

The current dependency graph contains no map library and the data model contains no structured coordinates.

## Current Data Ownership

### Database-backed

- users
- contact submissions
- subscribers
- posts
- donations
- programs table exists in Prisma but site rendering is still driven by static content files
- testimonials table exists in Prisma but site rendering is still driven by static content files
- statistics
- page views

### Static TypeScript sources

- `src/data/programs.ts`
- `src/data/testimonials.ts`
- `src/data/navigation.ts`
- team, partners, media, and other presentation-oriented data files

## Recommended Direction

Move toward a clearer content platform model:

- dynamic content with business value should come from managed records
- presentational constants can remain in code
- merchant discovery should become a first-class domain, not a side effect of testimonials

That work is documented in [content-model.md](content-model.md).