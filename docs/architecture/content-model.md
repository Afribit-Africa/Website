# Content Model And Merchant Platform Direction

This document defines the first recommended architecture step for turning the current site into a stronger platform.

## Objective

Reduce reliance on static content files for business-critical content and prepare the application for merchant discovery, richer program pages, and map-based experiences.

## Current Problem

The repository mixes:

- static content for the pages users care about most
- dynamic records for operational workflows such as donations and submissions

That split is workable for a launch site, but it creates friction for content updates, data consistency, and richer product features.

## Proposed Ownership Model

### Keep in code

- small presentational constants
- animation configuration
- purely visual navigation metadata that does not need editorial management

### Move to managed records

- programs
- testimonials
- statistics
- merchants
- merchant media and merchant categories

## Merchant Domain Recommendation

Add a merchant-first model to the Prisma schema.

### Candidate entities

- `Merchant`
- `MerchantCategory`
- `MerchantMedia`
- `MerchantTag` or category mapping if multiple categories are needed

### Merchant fields to plan for

- name
- slug
- short description
- long description
- category
- neighborhood
- city
- country
- latitude
- longitude
- phone or preferred contact
- bitcoin acceptance status
- featured status
- active status
- primary image
- related program references

## Program And Testimonial Direction

### Programs

Programs should become the authoritative records for:

- title
- slug
- summary
- long description
- goal
- raised amount
- current status
- primary media
- impact metrics

### Testimonials

Testimonials should optionally relate to:

- a merchant
- a program
- a media asset

This allows one story to support multiple surfaces without duplicating content.

## GIS Recommendation

For MVP, use OpenStreetMap and Leaflet.

### Why

- no paid API requirement for the initial version
- enough capability for merchant listing and area discovery
- simple fit for the current stack

### Data handling guidance

- store both coordinates and a human-readable area label
- do not treat runtime geocoding as a hard dependency
- prefer manual or offline geocoding for the first merchant dataset
- define privacy rules before showing exact merchant pins publicly

## Implementation Order

1. finalize documentation structure and source-of-truth docs
2. redesign Prisma schema for managed content and merchants
3. migrate static program and testimonial content into the new model
4. build merchant list and detail pages
5. add a map and filter experience once the merchant dataset is reliable
6. refactor donation and program UI to pull from real records instead of static files