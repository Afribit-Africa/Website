# Live Site Reconstruction Spec

Prepared: 2026-05-01
Source of truth: https://www.afribit.africa
Scope: Public frontend reconstruction and shared shell restoration

## Decision

Rebuild from the live site, not from a new custom UI direction.

That is the easier and lower-risk path because:

- The live site already answers the hard product questions: route inventory, page hierarchy, section order, copy tone, CTA labels, footer information architecture, and visual system.
- The local repo already contains valid backend work, content-layer helpers, donation APIs, map infrastructure, and auth plumbing. Replacing the UI direction would add unnecessary design decisions on top of a recovery project.
- A fresh UI would create acceptance ambiguity. Rebuilding from live gives a measurable parity target.

## Locked Assumptions

- Visual source of truth is the current live site.
- Public theme is dark by default.
- Admin authentication should use Google Auth only.
- The public `/programs` index is intentionally absent on the live site and currently returns `404`.
- Public assets should ultimately resolve through the live-style `/Media/...` structure.

## Global Design System

### Typography

- Primary font: `Inter`
- Body line-height: `1.6`
- Anti-aliasing: enabled

### Core Colors

- Bitcoin orange: `#f78318`
- Bitcoin orange hover: `#e9770c`
- Bitcoin orange light: `#ffab5c`
- Page background: `#0a0a0a`
- Card background: `#121212`
- Border tone: `#333333`
- Body text: `#ededed`
- Muted text: `#a1a1a1`
- Kenyan red accent: `#bd0000`
- Dark green accent: `#006b42`

### Shell Structure

- Header nav items: `About`, `Merchant Program`, `Merchant Map`, `Community`, `Contact`
- Primary header CTA: `Fuel BCE`
- Mobile shell: hamburger plus bottom navigation
- Footer heading pattern: promotional lead-in plus 4-column link area
- Footer columns: `Brand`, `Quick Links`, `Community`, `Resources`
- Footer legal links: `Privacy Policy`, `Terms of Service`, `Cookie Policy`

### Shared External Links

- X: `https://x.com/afribitkibera`
- Instagram: `https://www.instagram.com/afribit_africa/`
- YouTube: `https://www.youtube.com/@AfribitAfrica`
- Medium: `https://medium.com/@afribitkibera`
- BTC Map community: `https://btcmap.org/community/afribit-kibera`
- Geyser Fund: `https://staging.geyser.fund/project/afribitkibera`
- Bitcoin Confederation: `https://bitcoinconfederation.org/hub/afribit-kibera/`
- BTCPay Server: `https://pay.afribit.africa/`

## Homepage Reconstruction

Route: `/`

### Hero

- Main heading: `Empowering African Communities Through Bitcoin`
- Supporting line: `Financial freedom, environmental stewardship, and community resilience — powered by sats.`
- Primary CTA: `Fuel the Movement` -> `/donate`
- Secondary CTA: `Learn More` -> `/about`
- Hero metrics shown in-line: `2000+ Transactions`, `40+ Merchants`, `5 Programs`

### Section Order

1. `Hero`
2. `Bitcoin ticker`
3. `Campaign Progress`
4. `Impact at a Glance`
5. `Real People.Real Progress.Powered by Sats`
6. `Why Start in Kibera?`
7. `How We Build Circular Resilience`
8. `Community Success Stories`
9. `Our Partners`
10. `Join Our Community`
11. `Stories From the Heart of the Bitcoin Movement`
12. `Frequently Asked Questions`
13. `Strategic Goals 2026`
14. `Don't miss what's next`

### Section Details

#### Bitcoin ticker

- Infinite marquee text: `Permissionless. Immutable. Borderless. Secure. Transparent.`

#### Campaign Progress

- Heading: `Campaign Progress`
- Campaign line: `Building a Bitcoin circular economy in Kibera`
- Live figures captured during research:
  - `$2,149.45 of $100,000 goal`
  - `2.15% funded`
  - `54 contributors`
  - `$40 Avg Donation`
  - `$97,851 To Go`
- Note: explicitly labeled as live tracking from BTCPay Server

#### Impact at a Glance

- Four stats shown live on the homepage:
  - `2,000+ Bitcoin transactions`
  - `120+ youth and women trained`
  - `7+ boda-boda riders`
  - `40+ merchants`

#### Real People.Real Progress.Powered by Sats

- Four image-backed impact cards
- Copy emphasizes grassroots proof of impact in Kibera

#### Why Start in Kibera?

- Two-column story split
- Subsections:
  - `The Challenge`
  - `Our Approach`
- Includes supporting photography and pull-quote treatment

#### How We Build Circular Resilience

- Four program cards:
  - `Micro-Merchants & Traders`
  - `Women's Upcycling Collective`
  - `Waste Incentives Program`
  - `Boda-Boda "Ride to Freedom"`
- Each card includes image, summary, and `Learn More` link

#### Community Success Stories

- Testimonial carousel or slider
- Named stories visible in live crawl:
  - `Brian`
  - `DaMian Magak`
  - `Steph`
  - `Glen Omolo`
  - `Abebo`

#### Our Partners

- Auto-scrolling logo rail
- Visible logos:
  - `FBCE Global`
  - `Geyser`
  - `Rottweil`
  - `Fedi`
  - `Bitcoin Conference`

#### Join Our Community

- Homepage Fedi block
- Four feature cards:
  - `Bitcoin Payments`
  - `Community Chat`
  - `Real-time Updates`
  - `Privacy & Security`
- CTA: `Join Community on Fedi`
- QR blocks:
  - `Community Invite`
  - `Federation Invite`

#### Stories From the Heart of the Bitcoin Movement

- Media coverage block with six YouTube links
- Visible sources:
  - `BBC News`
  - `AP News`
  - `ABC News`
  - `Firstpost`
  - `Associated Press`
  - `Joe Nakamoto`

#### Frequently Asked Questions

- Section lead: `Everything you need to know about Afribit and how Bitcoin is transforming Kibera`
- Includes donor, Bitcoin, program, and participation questions
- Ends with support prompt and contact email

#### Strategic Goals 2026

- Five goal cards:
  - `Expand Upcycling Enterprise`
  - `Strengthen Waste Management`
  - `Monthly Bitcoin Education`
  - `Merchant Accelerator Program`
  - `Bitcoin Ambassadors Network`

#### Don't miss what's next

- Footer promo lead-in
- Newsletter/social block followed by footer columns

## Route-by-Route Spec

### `/`

- Live status: active
- Role: primary landing page
- Rebuild target: full parity with homepage section list above

### `/about`

- Live status: active
- Main heading: `Building Africa's Bitcoin Future`
- Hero copy: community-first Bitcoin adoption story
- Key hero metrics: `2,000+ Bitcoin Transactions`, `40+ Active Merchants`, `500+ Community Members`, `5 Impact Programs`
- Sections:
  - `Our Mission`
  - `Our Core Values`
  - `Our Journey`
  - `Powered by Community`
  - `Join the Revolution`
- Core values visible:
  - `Bitcoin Sovereignty`
  - `Community First`
  - `Circular Economy`
  - `Education & Empowerment`

### `/programs`

- Live status: `404`
- Interpretation: do not rebuild as a public index unless product requirements change
- Rebuild target: preserve intentional not-found behavior or redirect strategy only if explicitly requested later

### `/programs/[slug]`

- Live status: active for sampled program route `/programs/merchants`
- Sample heading: `Micro-Merchants & Traders`
- Template sections:
  - `Program Overview`
  - `What We Provide`
  - `How It Works`
  - `Our Goals`
  - `Support <Program Name>`
- CTA cluster on sampled page:
  - `Donate to This Program`
  - `View Merchant Directory`
- Template note: this is the strongest reusable program-detail pattern for all program pages

### `/merchants`

- Live status: active
- Main heading: `Bitcoin Merchant Directory`
- Intro line: `Discover 0 Bitcoin-accepting businesses in Kibera. Support local entrepreneurs by donating directly via Lightning Network.`
- Current live data state during crawl: zero merchants shown
- Key UI pieces:
  - top stat strip
  - list/map toggle
  - empty state: `No merchants found`
  - `About This Directory`
  - `Accept Bitcoin in Your Business`
- CTAs:
  - `Register Your Business`
  - `View on BTCMap`

### `/merchants/[slug]`

- Live status: unresolved from sampled slug
- Sampled route `/merchants/fridah-fresh-produce` returned `Merchant Not Found`
- Rebuild note: preserve the not-found template immediately; capture the live merchant-detail template later only after confirming a currently valid live merchant slug
- Minimum required state now:
  - heading: `Merchant Not Found`
  - support copy
  - CTA: `View All Merchants` -> `/maps`

### `/donate`

- Live status: active
- Main heading: `Fuel the Bitcoin Revolution`
- Supporting line: `Your contribution powers financial freedom, environmental stewardship, and community resilience in Kibera`
- Main content section: `Choose Your Impact`
- Donation cards visible in crawl:
  - `Custom Contribution`
  - `Friend of Afribit Kibera`
  - `Business Accelerator Program`
  - `Bitcoin Education Program`
  - `Equipment for Efficiency & Scaling`
  - `Upcycle Queen`
  - `Satoshi Kwa Usafi`
- Rebuild note: donation page is a curated card grid, not a generic pricing table

### `/contact`

- Live status: active
- Main heading: `Get in Touch`
- Supporting copy: help, involvement, and program questions
- Contact areas:
  - `Email`
  - `Connect With Us`
  - contact form
- Social/direct links visible: WhatsApp, Telegram, X

### `/maps`

- Live status: active
- Main heading: `Bitcoin Merchant Directory`
- Purpose: merchant discovery map and list view
- Key content:
  - map/list toggle
  - zero-state if no merchants
  - `About This Directory`
  - `Accept Bitcoin in Your Business`
- CTAs:
  - `Register Your Business`
  - `View on BTCMap`
- Tech expectation: Leaflet / OpenStreetMap experience

### `/fedi`

- Live status: active
- Main heading: `Join Afribit on Fedi`
- Sections:
  - `What is Fedi?`
  - `Step 1: Download Fedi App`
  - `Join Our Community`
  - `Join Our Federation`
  - `Why Join Afribit on Fedi?`
- QR/invite states:
  - community QR and invite code with copy action
  - federation QR and invite code with copy action
- CTAs:
  - `iOS`
  - `Android`
  - `Learn more about Fedi`
  - `Support Afribit`
  - `Fedi Support`

### `/register`

- Live status: active
- Main heading: `Register Your Bitcoin Business`
- Supporting line: `Join BTCMap and showcase your business to the Bitcoin community`
- Main section captured: `Install Afribit App`
- Feature bullets:
  - `Better GPS Accuracy`
  - `Save Drafts Offline`
  - `Status Notifications`
  - `Faster Loading`
- Rebuild note: current live route is an install-first entry surface, not a full long registration form in the public browser view

### `/admin/login`

- Live status: active
- Main heading: `Admin Portal`
- Subheading: `Afribit Merchant Management`
- Primary auth action: `Sign in with Google`
- Constraint: authorized administrators only
- Rebuild note: align implementation to Google Auth only

### `/legal/privacy`

- Live status: active
- Main heading: `Privacy Policy`
- Last updated: `November 19, 2025`
- Major sections:
  - `Introduction`
  - `Information We Collect`
  - `How We Use Your Information`
  - `Data Sharing and Disclosure`
  - `Verifier Image Collection`
  - `Data Security`
  - `Data Retention`
  - `Your Rights (Kenya Data Protection Act)`
  - `Children's Privacy`
  - `International Data Transfers`
  - `Changes to This Policy`
  - `Contact Us`
  - `Complaints`

### `/legal/terms`

- Live status: active
- Main heading: `Terms of Service`
- Last updated: `November 19, 2025`
- Major sections:
  - `Acceptance of Terms`
  - `About Afribit Africa`
  - `Merchant Registration`
  - `OpenStreetMap Contribution`
  - `Donations`
  - `Intellectual Property`
  - `Prohibited Activities`
  - `Disclaimers and Limitations`
  - `Termination`
  - `Governing Law`
  - `Changes to Terms`
  - `Contact`

### `/legal/cookies`

- Live status: active
- Main heading: `Cookie Policy`
- Last updated: `November 19, 2025`
- Major sections:
  - `What Are Cookies?`
  - `Types of Cookies We Use`
  - `Why We Use Cookies`
  - `Cookie Duration`
  - `How to Control Cookies`
  - `Third-Party Services`
  - `Updates to This Policy`
  - `Contact Us`

## Missing Locally But Required For Parity

- `/maps`
- `/fedi`
- `/register`
- `/admin/login`
- `/legal/privacy`
- `/legal/terms`
- `/legal/cookies`

## Shared Shell Acceptance Criteria

Phase 1 is complete only when all of the following are true:

- Inter is the primary site font.
- The app renders against the live dark palette by default.
- Header matches the live information architecture.
- Footer matches the live column structure and legal links.
- Mobile fixed bottom navigation is present.
- Shared shell uses the live CTA labeling, especially `Fuel BCE`.
- No page-specific route content is rebuilt in this phase.
