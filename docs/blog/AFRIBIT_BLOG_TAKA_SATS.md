# Taka Sats: Building a Transparent, Offline-First Waste-to-Bitcoin System for Afribit Africa

## Introduction

At Afribit Africa, we are building a system that turns everyday recycling work into verifiable, traceable value. Taka Sats is a waste-to-Bitcoin platform designed to help informal collection networks record recycling activity, prove what happened, and reward collectors fairly — even in low-connectivity environments.

The core idea is simple: when a collector brings in recyclable material, the system records the event, verifies the details, and ensures a transparent payout is sent to the collector’s own wallet. Every step in the process is designed to be traceable, auditable, and fair.

This project is not just a wallet or a reward app. It is a full operational system for a circular-economy programme: offline data capture, staff workflows, rate management, verification, payout settlement, and public transparency.

---

## The problem we are solving

Across many communities, waste collection is real work but often remains invisible, underpaid, and hard to verify.

In many programmes, the activities below are difficult to manage consistently:

- collectors are not properly identified or tracked,
- material weights are recorded informally,
- payments are not clearly tied to verified collection events,
- supervisors work in areas with unreliable internet access,
- programme managers cannot easily reconcile what was collected, paid, and sold,
- funders and partners cannot see whether the programme is delivering real value.

The result is often a gap between effort and accountability. Taka Sats is designed to close that gap.

---

## What Taka Sats is building

Taka Sats is an open, offline-first collection and payout system.

It allows a supervisor to:

- tap a collector’s NFC tag,
- select the material,
- record the weight,
- capture a photo and location evidence,
- save the event locally when the network is down,
- sync it later when connectivity returns,
- verify the event and pay the collector in sats.

The system is built to work in real field conditions, not only in a connected office. It is designed for markets, collection points, and programmes where phone connectivity can be intermittent and the workflow must still continue.

---

## Why this matters for Afribit

A strong recycling programme should do more than collect waste — it should create trust, financial inclusion, and measurable impact.

For Afribit, Taka Sats represents a way to:

- reward verified collection work fairly,
- reduce disputes around what was collected and paid,
- support field staff with a mobile-first workflow,
- create a transparent ledger of verified events,
- give partners and funders confidence through auditable records,
- strengthen the link between community labour and digital value.

In other words, the platform is designed to help transform informal recycling knowledge and effort into a more accountable, transparent, and sustainable operating model.

---

## The core experience

### 1. Collector enrolment

Each collector can be enrolled with a simple alias or identity handle. The system supports a receive-only wallet model, where the collector’s own wallet or a programme-provisioned wallet can be attached to the collector record.

This means the collector does not need to install a new app or hold a spend-capable wallet in the operational flow. The focus is on receiving value, not managing funds.

### 2. NFC tag-based identity

A physical NFC tag is used to identify the collector in the field. This allows the supervisor to quickly verify the collector and associate the collection event with a real person in the programme without requiring app-based login or complex onboarding.

The tag is designed as a receive-only access point to a Lightning payment destination, helping preserve the principle that collectors are not exposed to custody or spend risk by default.

### 3. Offline-first weighing workflow

The supervisor PWA is designed to work even without internet access. A collection event can be captured offline and queued locally in browser storage. Later, when the network is available, the queued events sync to the server.

This is essential for field operations where connectivity may be poor, expensive, or unavailable at the point of collection.

### 4. Evidence capture

Every collection event is meant to carry evidence:

- material type,
- weight,
- timestamp,
- GPS or recorded reason if location is unavailable,
- photo evidence,
- collector identity,
- supervisor identity,
- content hash for integrity protection.

This creates a practical evidence bundle that can be reviewed later if questions arise.

### 5. Fair payout calculation

The project uses a versioned per-material rate table, with rates configured by the programme and tied to time windows. The amount owed is derived from the material weight and the applicable rate, then converted into sats at the disbursement-time exchange rate.

The system is intentionally built around the principle that payout logic is handled server-side and based on verified event data, not on a client-controlled input.

### 6. Auditability and transparency

Taka Sats is not limited to operational records. It includes a ledger system that records events and checkpoints, so the full chain of verified collection activity can be inspected and independently verified.

This is a major differentiator: the platform is designed not only to help a programme run smoothly, but also to make the programme explainable and auditable.

---

## How the system works technically

The project is implemented as a modern, full-stack Next.js application with App Router architecture.

### Core stack

- Next.js / App Router
- TypeScript
- PostgreSQL with Drizzle ORM
- Auth.js for staff and partner authentication
- Offline-first PWA patterns for the field app
- IndexedDB for local event capture and queueing
- Lightning provider abstraction for payouts and wallet integration
- Service worker / offline shell for mobile supervisor use
- Worker process for jobs and reconciliation automation

### Product architecture

At a high level, the architecture is designed around three main layers:

1. Field layer
   - Supervisor PWA
   - Collector tag-based identity
   - Offline event capture
   - Local queue and sync

2. Application and API layer
   - Authenticated Next.js API routes
   - Session and RBAC enforcement
   - Rate management
   - Event validation
   - Payout preparation and execution

3. Trust and verification layer
   - Append-only ledger
   - Hash-chain integrity checks
   - Checkpoints and auditability
   - Public and partner-facing transparency surfaces

---

## Key product principles

### Earn-first

The collector is the central beneficiary. The platform is designed to ensure collectors receive value for verified work without requiring them to manage complicated financial infrastructure.

### Offline-first

A field programme cannot depend on constant connectivity. The system is designed to support work even when the supervisor loses mobile signal.

### Trust through transparency

The platform is built around evidence, records, and verification, not assumptions. Every event is designed to be traceable, reviewable, and explainable.

### Non-custodial by default

The default operating model is bring-your-own wallet. The collector uses their own receive-only Lightning address or wallet destination, with the programme not holding funds on their behalf unless a specific operator-enabled custodial mode is explicitly configured.

This is important for both operational and regulatory clarity.

---

## Notable platform capabilities already in implementation

The project includes a broad set of capabilities under active development, including:

- collector enrolment and tag lifecycle management,
- supervisor and admin role-based access,
- session and rate configuration,
- offline event capture and sync,
- photo upload and hash verification,
- local outbox and retry behaviour,
- append-only ledger architecture,
- integration with exchange-rate sources,
- administrative dashboard views,
- public and partner-facing reporting surfaces.

The work is organized into milestones and follows a structured engineering roadmap from M0 foundation through M8 pilot hardening and public release readiness.

---

## Why this is different from a typical app

This project is not a simple consumer app or basic reward tracker. It is a programme infrastructure layer for a circular-economy operation.

It combines:

- field collection operations,
- data integrity controls,
- financial payout logic,
- auditability and transparency,
- independent verification,
- open-source principles,
- deployability in both self-hosted and managed environments.

That combination makes it much more than a “waste collection app.” It is a practical digital infrastructure for community-led recycling and value recognition.

---

## Current status

The project is in active implementation. The core foundations, authentication, rates, sessions, collector identity, offline weigh workflow, and the beginning of the ledger/sync engine are already underway and validated in the repository.

At the current stage, the team is focused on completing the end-to-end sync and ledger flow so that queued collection events are reliably recorded, verified, and stored in an append-only record chain.

This is a strong sign that the project is moving from concept to operational system — which is exactly what is needed for a real programme rollout.

---

## The long-term vision

The longer-term vision of Taka Sats is to create a transparent, open, and trustworthy system for circular-economy value exchange across communities.

In practical terms, that means:

- collectors are paid for actual verified work,
- supervisors have a trusted field tool,
- admins can monitor sessions and rates,
- partners can review programme-level performance,
- the public can inspect verifiable, aggregate programme activity,
- the underlying records remain independent, accessible, and auditable.

This is exactly where transparency and financial inclusion meet: by making verified collection activity visible and rewardable in a way that can be trusted.

---

## Closing

Taka Sats is being built to help Afribit Africa turn waste collection into a more transparent, measurable, and rewarding economic activity. It is designed for the realities of field work: poor connectivity, limited technical friction, strong evidence requirements, and the need for trust across the entire value chain.

If we succeed, this system can do more than manage recycling operations. It can become a model for how community-driven environmental work is recorded, valued, and verified in a digital age.

---

## Short project summary for publication

Taka Sats is an offline-first, transparent waste-to-Bitcoin platform for Afribit Africa. It enables supervised collection events to be captured in the field, verified, synchronized when internet returns, and settled in sats to a collector’s own Lightning wallet. Built on a modern Next.js stack, the system combines NFC identity, rate configuration, photo and GPS evidence, a distributed-style sync engine, and an append-only ledger to ensure auditability and trust. The project is designed to support real-world field conditions while providing a public-facing trail of verified activity.
