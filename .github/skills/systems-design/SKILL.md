---
name: systems-design
description: "Use when: planning a new feature end-to-end, deciding component hierarchy, evaluating RSC vs client component boundaries, designing admin CRUD workflows, evaluating a new library or framework, planning a DB schema change before implementation, designing a page layout, planning state management strategy"
---

# Systems Design Skill

This skill guides structured thinking before writing code. Use it any time a feature involves more than one file, touches both frontend and backend, or requires a layout/architecture decision.

## When to Invoke

Load this skill before implementing:
- Any new page or admin route
- Any feature that requires a new API route **and** a UI form
- Any decision about adopting a new library or framework
- Any layout change that affects multiple components

---

## Step 1 — Understand the Contract

Before any design work, answer:

1. **What data does this feature read?**
   - Check `docs/backend/api-routes.md` for existing GET endpoints
   - Check `src/lib/content/` for server-side content helpers
   - If no endpoint exists, flag it for BackendDev first

2. **What data does this feature write?**
   - Check `docs/backend/api-routes.md` for existing POST/PATCH/DELETE endpoints
   - If no endpoint exists, stop and implement backend first

3. **Who can access this feature?**
   - Public (no auth) → RSC page, public route
   - Admin only → NextAuth session guard in `layout.tsx`, `UserRole.ADMIN` or `EDITOR`
   - User-specific → NextAuth session, filter by user ID

---

## Step 2 — Component Boundary Decision

Apply these rules to decide Server vs Client:

| Needs | Use |
|-------|-----|
| Fetch data from DB / content layer | React Server Component (RSC) |
| `useState`, `useEffect`, `useRef` | Client Component (`"use client"`) |
| Event handlers (onClick, onChange) | Client Component |
| Browser APIs (localStorage, window) | Client Component |
| Animation with Framer Motion | Client Component |
| Static display of server data | RSC |
| Form with React Hook Form | Client Component |
| Admin data table (read-only) | RSC (pass data as props to Client table) |

**The golden rule**: Push `"use client"` as low in the tree as possible. Fetch data in the RSC parent, pass it as props to the minimal Client Component that needs interactivity.

### Example Boundary Map
```
page.tsx (RSC)                ← fetches data, no interactivity
  └── MerchantList (RSC)      ← renders list
        └── MerchantCard (RSC)
              └── FavoriteButton ("use client")  ← only this needs useState
```

---

## Step 3 — Page Structure Blueprint

For every new page, produce this blueprint before writing code:

```
Route: /admin/merchants

Layout: AdminLayout (NextAuth guard)

Page (RSC):
  - Fetches: listMerchants() from src/lib/content/merchants.ts
  - Passes: merchants[] to MerchantsTable

Components:
  - MerchantsTable ("use client")
    - shadcn DataTable with columns: name, category, status, coords, actions
    - Actions: Edit, View on OSM, Deactivate
  - AddMerchantButton ("use client")
    - Opens AddMerchantDialog
  - AddMerchantDialog ("use client")
    - React Hook Form + Zod
    - Calls: POST /api/admin/merchants (BackendDev must implement)

Loading: loading.tsx → Skeleton rows
Error: error.tsx → error card with retry
```

---

## Step 4 — Library Evaluation Framework

When a new library or framework is proposed, answer all of these before installing:

| Question | Criteria |
|----------|----------|
| **Bundle size** | Does it add >50KB gzipped? Is that justified? |
| **Tailwind compatibility** | Does it work with Tailwind CSS v4? Does it conflict with existing classes? |
| **shadcn/ui compatibility** | Does it conflict with existing Radix UI primitives? |
| **Next.js App Router** | Does it support RSC? Does it require `"use client"` wrappers? |
| **Maintenance** | >1000 GitHub stars? Updated in last 6 months? |
| **Alternatives** | Can the existing stack (shadcn blocks, Framer Motion, Zod) do this already? |
| **Install risk** | Are there peer dependency conflicts with React 19 / Next 16? |

### Admin Dashboard Framework Evaluation (Pre-Researched)

| Framework | Verdict | Reason |
|-----------|---------|--------|
| **shadcn/ui Blocks** | ✅ Recommended | Already installed, has dashboard + sidebar + data table blocks |
| **Tremor** | ✅ Evaluate | Tailwind-based charts/stats, no conflicts — check `https://www.tremor.so` |
| **Recharts** | ✅ Evaluate | Lightweight charts, works in RSC wrappers — good for donation analytics |
| **Refine** | ❌ Avoid | Installs its own UI layer, conflicts with existing shadcn setup |
| **React Admin** | ❌ Avoid | Material UI based, conflicts with Tailwind |
| **AdminJS** | ❌ Avoid | Requires custom backend adapter, heavy for this scale |
| **Ant Design** | ❌ Avoid | Large bundle, fights with Tailwind |
| **Material UI** | ❌ Avoid | CSS-in-JS, incompatible with Tailwind v4 |

**Decision**: Build the admin with **shadcn/ui Blocks** (dashboard-01, sidebar-07, data-table). Add **Tremor** or **Recharts** only if donation analytics charts are needed.

---

## Step 5 — State Management Strategy

For this application:

| Scenario | Solution |
|----------|---------|
| Server data in RSC pages | No state — fetch directly in RSC |
| Form state | React Hook Form (already installed) |
| Toast/notification | Sonner (already installed via `src/components/ui/sonner.tsx`) |
| Admin table filters/sort | `useState` in Client Component or URL search params |
| Auth session | NextAuth `useSession()` / `getServerSession()` |
| Global UI state | URL search params (`useSearchParams`) — prefer over Redux/Zustand |
| Complex cross-component state | Evaluate `zustand` only if URL params are insufficient |

**Do NOT install** Redux, MobX, Jotai, or Recoil — the App Router pattern + React Hook Form + URL state handles everything this app needs.

---

## Step 6 — Output

After completing the design step, produce a structured plan:

```markdown
## System Design: <Feature Name>

### Data Flow
- Source: <content layer function or API route>
- Write: <API endpoint or "read-only">
- Auth: <public / ADMIN / EDITOR>

### Component Tree
<parent (RSC)>
  └── <child> (RSC | "use client")

### Files to Create
- src/app/...
- src/components/...

### Backend dependency
- [ ] Route exists in docs/backend/api-routes.md
- [ ] BackendDev must implement: <route>

### Library decisions
- Installing: <none | package>
- Reason: <why or why not>

### Risk / open questions
- <any ambiguity>
```
