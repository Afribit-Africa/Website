# Schema Redesign Phase 1

This phase introduces the first relational bridge between the current public site and the future merchant platform.

## Goals

- keep the existing donation flow working
- preserve backward compatibility with current slug-based program references
- add first-class merchant storage
- add relations that allow programs, testimonials, donations, and merchants to connect cleanly over time

## What Changed In The Schema

### Programs

Programs now support richer editorial and reporting fields:

- `summary`
- `status`
- `locationLabel`
- `city`
- `country`
- `beneficiaryCount`
- `featured`

Programs also now expose relations to donations, testimonials, and merchants.

### Donations

Donations still keep the legacy `program` slug field for compatibility with the current API flow, but now also support:

- `programId`
- `programRef`

This lets the application migrate from string references to proper relational references without breaking existing code immediately.

### Testimonials

Testimonials now support:

- `slug`
- `youtubeId`
- `programId`
- `merchantId`
- `featured`

This allows a testimonial to work as a reusable content asset instead of just a page-local card.

### Merchants

The new `Merchant` model introduces first-class merchant storage with fields for:

- identity and slug
- summary and description
- category and status
- location and service area
- optional coordinates for future GIS work
- payment methods and services
- featured state
- linked program and linked primary testimonial

## Migration Strategy

The repository does not yet contain an applied database migration for this phase because local database access varies by environment.

Recommended sequence:

1. review the schema changes
2. run `npm run db:generate`
3. run `npm run db:migrate` or `npm run db:push` against the correct environment
4. run `npm run db:seed`
5. begin switching UI code from static files to repository-backed content

## Seed Strategy

The first seed script uses the current static sources:

- `src/data/programs.ts`
- `src/data/testimonials.ts`
- `src/data/merchants.ts`

This is intentional. It creates a controlled bridge from the current code-defined content to database-backed content without trying to rewrite the whole frontend in one pass.

## Next Steps After This Phase

1. update repository access helpers so pages can read from Prisma first and fall back to static content if needed
2. refactor donation routes to store `programId` alongside the legacy program slug
3. migrate program and testimonial pages away from direct static imports
4. add merchant coordinates and map-ready querying in the next GIS phase