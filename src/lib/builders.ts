export type BuilderStat = {
  value: string
  label: string
}

export type BuilderLink = {
  label: string
  href: string
  external?: boolean
}

export type BuilderSection = {
  id: string
  eyebrow: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export type BuilderProject = {
  slug: string
  legacySlug: string
  name: string
  number: string
  accent: 'green' | 'orange' | 'cyan'
  stage: string
  technologies: string[]
  flow: { title: string; detail: string }[]
  title: string
  seoTitle: string
  description: string
  excerpt: string
  modifiedDate: string
  category: string
  primaryKeyword: string
  secondaryKeywords: string[]
  imageSrc: string
  imageAlt: string
  heroEyebrow: string
  heroDescription: string
  stats: BuilderStat[]
  sections: BuilderSection[]
  takeaways: string[]
  relatedLinks: BuilderLink[]
  sourcePath: string
}

export const builderProjects: BuilderProject[] = [
  {
    slug: 'taka-sats',
    legacySlug: 'taka-sats-waste-to-bitcoin',
    name: 'Taka Sats',
    number: '01',
    accent: 'green',
    stage: 'In development',
    technologies: ['Offline-first PWA', 'NFC', 'Lightning', 'Evidence ledger'],
    flow: [
      {
        title: 'Identify',
        detail: 'An NFC tap links the collection to a collector and their receive destination.',
      },
      {
        title: 'Record',
        detail:
          'Material, weight, and photo evidence stay on the supervisor device when the network is unavailable.',
      },
      {
        title: 'Verify',
        detail: 'Synced events are reviewed against the evidence and the applicable material rate.',
      },
      {
        title: 'Reward',
        detail: 'Verified work becomes a sats payout with a record that the team can reconcile.',
      },
    ],
    title: 'Taka Sats: Offline-First Waste-to-Bitcoin Rewards',
    seoTitle: 'Taka Sats Waste-to-Bitcoin Rewards in Kibera',
    description:
      "Taka Sats is Afribit's offline-first waste-to-Bitcoin system for verified recycling work, fair sats payouts, and transparent impact records.",
    excerpt:
      'Afribit is building Taka Sats to help waste collectors record recycling work, verify collection evidence, and receive fair Bitcoin rewards even when connectivity is unreliable.',
    modifiedDate: '2026-09-10',
    category: 'Circular Economy',
    primaryKeyword: 'waste to Bitcoin',
    secondaryKeywords: [
      'Taka Sats',
      'Bitcoin rewards',
      'waste management Kibera',
      'offline-first PWA',
      'Lightning payouts',
    ],
    imageSrc: '/Images/blog/taka-sats-waste-to-bitcoin-recycling.jpg',
    imageAlt: 'Community waste collectors gathering recyclable material in Kibera',
    heroEyebrow: 'Afribit Builders',
    heroDescription:
      'A field-ready system for turning verified recycling work into traceable value, transparent reporting, and fair sats payouts.',
    stats: [
      { value: 'Offline-first', label: 'Designed for field work with intermittent connectivity' },
      { value: 'NFC identity', label: 'Collector recognition without complex app onboarding' },
      { value: 'Auditable', label: 'Evidence, ledger records, and payout reconciliation' },
    ],
    sections: [
      {
        id: 'problem',
        eyebrow: 'The Problem',
        title: 'Waste collection is valuable work, but too often it is invisible',
        paragraphs: [
          'Across communities like Kibera, recycling and waste collection create public value every day. The work keeps drainage clearer, reduces unmanaged waste, and gives collectors a way to earn. Yet many programs still rely on informal records, handwritten weights, delayed payments, and incomplete proof of what happened.',
          'That gap creates friction for everyone. Collectors may not see a clear link between the material they brought in and the money they received. Supervisors have to manage work in areas where internet access can be unreliable. Program managers and partners need evidence that the work was completed, paid, and reconciled.',
          "Taka Sats is Afribit's answer to that operating challenge: a waste-to-Bitcoin system that records recycling events, verifies the details, and turns the result into a fair payout in sats.",
        ],
      },
      {
        id: 'system',
        eyebrow: 'The Build',
        title: 'What Taka Sats is building for recycling teams',
        paragraphs: [
          'Taka Sats is not just a wallet screen. It is program infrastructure for a circular economy operation. A supervisor can identify a collector, record material type and weight, capture evidence, save the event locally, sync when internet returns, and prepare the verified payout.',
          'The design starts with real field conditions. Collection points do not always have strong mobile data. Staff need simple steps that can be repeated quickly. Collectors need to receive value without being forced into complex financial tools.',
        ],
        bullets: [
          'Collector enrollment with aliases or identity handles.',
          'NFC tag-based identification for fast field recognition.',
          'Offline event capture with local queueing and later sync.',
          'Photo, timestamp, location, material, and weight evidence.',
          'Server-side payout calculation from verified event data.',
          'Append-only records that support program auditability.',
        ],
      },
      {
        id: 'principles',
        eyebrow: 'Product Principles',
        title: 'The collector earns first, and the system proves the work',
        paragraphs: [
          'The core principle is earn-first. Taka Sats is designed so collectors can receive value for verified work without needing to manage a complicated operating system. The collector remains the central beneficiary, while the supervisor and admin tools handle rate tables, verification, and settlement controls.',
          'The wallet model is intentionally cautious. A collector can use their own Lightning destination or a program-supported receive-only wallet. The operating flow focuses on receiving value, not exposing collectors to spend risk by default.',
          'For partners, the value is trust. Instead of asking donors or program managers to rely on summary claims, Taka Sats creates a reviewable trail of what was collected, where, when, by whom, and how it was rewarded.',
        ],
      },
      {
        id: 'impact',
        eyebrow: 'Why It Matters',
        title: 'Transparent recycling data can strengthen local circular economies',
        paragraphs: [
          'Afribit sees waste collection as more than cleanup. It is a local economic activity that can become more accountable, more rewarding, and easier to support when the records are clear.',
          'A transparent recycling system helps reduce disputes around weights and payments. It gives field teams a better operating rhythm. It helps partners understand whether funding is reaching real collection activity. Most importantly, it links community labor to digital value in a way that people can inspect and trust.',
          'If Taka Sats succeeds in Kibera, it can become a practical model for other community-led environmental programs that need offline-first tools, verified records, and direct digital rewards.',
        ],
      },
    ],
    takeaways: [
      'Taka Sats turns recycling events into verified, auditable records.',
      'Offline-first capture protects field teams when mobile connectivity is weak.',
      'Lightning payouts connect community cleanup work to immediate digital value.',
      'Public transparency can give partners stronger evidence of environmental impact.',
    ],
    relatedLinks: [
      { label: 'Explore Afribit waste management', href: '/programs/waste-management' },
      { label: 'Support Afribit programs', href: '/donate' },
      { label: 'Talk to the team', href: '/contact' },
    ],
    sourcePath: 'docs/blog/AFRIBIT_BLOG_TAKA_SATS.md',
  },
  {
    slug: 'afribit-wifi',
    legacySlug: 'building-afribit-wifi',
    name: 'Afribit Wi-Fi',
    number: '02',
    accent: 'orange',
    stage: 'Hardware pilot',
    technologies: ['MikroTik', 'BTCPay Server', 'Lightning', 'Local router agent'],
    flow: [
      {
        title: 'Connect',
        detail: 'A phone joins the access point and opens the mobile captive portal.',
      },
      {
        title: 'Choose',
        detail:
          'Internet packages are priced in Kenyan shillings, with a Bitcoin quote at checkout.',
      },
      {
        title: 'Settle',
        detail: 'The platform verifies a BTCPay payment or voucher and queues one access grant.',
      },
      {
        title: 'Go online',
        detail:
          'The local agent applies access on the MikroTik router, with a defined expiry and audit trail.',
      },
    ],
    title: 'Afribit Wi-Fi: Community Connectivity, Built Locally',
    seoTitle: 'Bitcoin Wi-Fi Kenya: Building Afribit Wi-Fi',
    description:
      "Inside Afribit's Bitcoin Wi-Fi Kenya build: community internet access, MikroTik testing, Lightning payments, vouchers, and future M-Pesa support.",
    excerpt:
      'Afribit is building an operator-owned, Bitcoin-first Wi-Fi platform for community internet access in Kenya, tested carefully with real routers, payments, and access grants.',
    modifiedDate: '2026-09-10',
    category: 'Connectivity',
    primaryKeyword: 'Bitcoin Wi-Fi Kenya',
    secondaryKeywords: [
      'community Wi-Fi',
      'MikroTik hotspot',
      'Lightning payments',
      'M-Pesa to Bitcoin',
      'Afribit Wi-Fi',
    ],
    imageSrc: '/Images/blog/afribit-wifi-community-router.png',
    imageAlt: 'Community Wi-Fi router and phone portal concept for Afribit Wi-Fi in Kenya',
    heroEyebrow: 'Afribit Builders',
    heroDescription:
      'A Bitcoin-first community internet platform being tested with real network hardware, careful access rules, and operator-owned infrastructure.',
    stats: [
      { value: 'Bitcoin-first', label: 'BTCPay invoices as the primary payment path' },
      { value: 'KES pricing', label: 'Packages stay understandable in Kenyan shillings' },
      { value: 'Router agent', label: 'Local network changes stay outbound-only and auditable' },
    ],
    sections: [
      {
        id: 'why-build',
        eyebrow: 'Why Build It',
        title: 'Owning community Wi-Fi means owning the customer journey',
        paragraphs: [
          'Bitcoin Wi-Fi Kenya is not just a payment idea for Afribit. It is a practical attempt to own the full path from connection to payment to access. A customer should be able to join the network, choose a package, pay, and get online without losing time or money because two systems disagree.',
          'Afribit currently uses third-party hotspot software where it makes sense. The builder goal is to create an operator-owned platform that Afribit can understand, test, improve, and connect deeply to Bitcoin payments while keeping package prices familiar in Kenyan shillings.',
          'The business case is bigger than reducing a subscription bill. It is about data ownership, support visibility, local technical capacity, and a payment architecture that can grow with community needs.',
        ],
      },
      {
        id: 'system-today',
        eyebrow: 'The Pilot Stack',
        title: 'A clear split between wireless access, routing, and business logic',
        paragraphs: [
          'The Afribit Wi-Fi pilot separates the system into practical layers. The access point provides the wireless connection. The MikroTik router enforces access rules. The Afribit cloud platform creates payment orders, decides who should receive access, and queues the router work.',
          'That separation matters. The public website should not expose the router management interface. The access point should not become a billing system. The cloud should make business decisions, while the local network agent carries approved changes to the router from inside the network.',
        ],
        bullets: [
          'A mobile captive portal for package selection.',
          'BTCPay Server invoices for Bitcoin payments.',
          'Voucher support for operator-issued access.',
          'Passkey-protected operator access.',
          'Router jobs that can be queued, reviewed, retried, and audited.',
          'Readiness checks that show configuration health without exposing secrets.',
        ],
      },
      {
        id: 'payments',
        eyebrow: 'Payment Model',
        title: 'Bitcoin first, with prices people recognize',
        paragraphs: [
          "A Wi-Fi package advertised at KES 20 should remain KES 20, even when the Bitcoin exchange rate moves. Afribit's target model keeps package prices stable in Kenyan shillings while BTCPay calculates the satoshi amount when the invoice is created.",
          'That quote can then be stored with the order for support and reconciliation. The user sees a familiar local price. Afribit receives Bitcoin through infrastructure it controls. The operator has a record that connects payment, device, package, expiry, and router action.',
          'M-Pesa support is also part of the public direction, but it belongs behind careful testing. If a mobile money transaction succeeds while a Lightning settlement or access job is delayed, the user should not be charged again while systems reconcile the event.',
        ],
      },
      {
        id: 'readiness',
        eyebrow: 'Readiness',
        title: 'The system has to pass real outage and recovery tests',
        paragraphs: [
          'Afribit Wi-Fi will be ready when reliability is proven by repeated tests, not when the dashboard has the most screens. A settled payment should create exactly one access grant. Expired access should be removed promptly. Duplicate or replayed payment events should never activate a device twice.',
          'Operators also need evidence. They should know whether a router is online, whether the local agent is healthy, whether a job failed, and what recovery step is safe. That level of visibility protects the customer and the operator at the same time.',
          'The first milestone is a reliable single-site Bitcoin pilot. From there, Afribit can add deeper network monitoring, M-Pesa-to-Lightning testing, multiple sites, and community access features on top of a dependable core.',
        ],
      },
    ],
    takeaways: [
      'Afribit Wi-Fi is a community internet platform, not only a payment checkout.',
      'Stable KES package prices can still settle through Bitcoin infrastructure.',
      'Router changes should be local, outbound-only, auditable, and recoverable.',
      'The same access engine can later support vouchers, sponsored access, and learning rewards.',
    ],
    relatedLinks: [
      { label: 'Explore Afribit community', href: '/community' },
      { label: 'Support the build', href: '/donate' },
      { label: 'Contact Afribit', href: '/contact' },
    ],
    sourcePath: 'docs/blog/AFRIBIT_WIFI_BUILD_IN_PUBLIC_BLOG.md',
  },
  {
    slug: 'insats',
    legacySlug: 'local-economic-intelligence-bitcoin-payments',
    name: 'Local Economic Intelligence',
    number: '03',
    accent: 'cyan',
    stage: 'Research pilot with Insats',
    technologies: ['Merchant wallets', 'Microtasks', 'Price observations', 'Insats'],
    flow: [
      {
        title: 'Pay',
        detail:
          'A payment reaches a merchant-controlled wallet. The event supplies settlement evidence.',
      },
      {
        title: 'Describe',
        detail:
          'A consent-based microtask adds the item, quantity, unit, and price to that payment context.',
      },
      {
        title: 'Review',
        detail:
          'Observations need evidence checks and consistent units before they can inform a public index.',
      },
      {
        title: 'Understand',
        detail:
          'Insats compares purchasing power in local currency, sats, and a living-cost basket.',
      },
    ],
    title: 'Building Local Economic Intelligence with Bitcoin Payments',
    seoTitle: 'Local Economic Intelligence with Bitcoin Payments',
    description:
      'Afribit and Insats are testing Bitcoin payments, merchant-controlled wallets, and microtasks to build local price intelligence in Kibera.',
    excerpt:
      'Afribit and Insats are exploring how Bitcoin payment events, consent-based microtasks, and merchant tools can produce a living local price index.',
    modifiedDate: '2026-09-10',
    category: 'Economic Data',
    primaryKeyword: 'local economic intelligence',
    secondaryKeywords: [
      'Bitcoin payments Kibera',
      'merchant price data',
      'sats purchasing power',
      'Afribit Insats',
      'local price index',
    ],
    imageSrc: '/Images/blog/local-economic-intelligence-bitcoin-payment.jpg',
    imageAlt: 'A customer completing a Bitcoin payment with a local Afribit merchant',
    heroEyebrow: 'Afribit Builders',
    heroDescription:
      'A research and product track with Insats for understanding local prices through real trade, consent-based microtasks, and merchant-controlled payment rails.',
    stats: [
      { value: 'Non-custodial', label: 'Merchant payments can route to wallets they control' },
      { value: 'Microtasks', label: 'Light follow-up questions add product and price context' },
      { value: 'Living index', label: 'Everyday prices can be tracked in shillings and sats' },
    ],
    sections: [
      {
        id: 'first-test',
        eyebrow: 'The First Test',
        title: 'A payment can prove settlement, but not what was bought',
        paragraphs: [
          "Afribit and Insats are testing local economic intelligence with Bitcoin payments in Kibera. In an early live payment test, Sam Designs received Bitcoin through an Afribit payment address connected to the merchant's own Blink wallet.",
          "That transaction proved an important foundation: Afribit and Insats can observe a payment event for research and settlement evidence without taking custody of the merchant's funds.",
          'But payment data alone is incomplete. It can show that value moved, when it moved, and which merchant received it. It cannot reliably explain what the buyer purchased, what quantity was sold, or how that price compares with other everyday goods.',
        ],
      },
      {
        id: 'microtasks',
        eyebrow: 'The Next Layer',
        title: 'Microtasks can turn payment moments into useful price data',
        paragraphs: [
          'Insats is exploring a lightweight follow-up layer after verified payment events. A buyer, merchant, or trusted contributor can answer a simple question: what did this payment buy?',
          'That answer might be typed, selected from common goods, or spoken by voice. The system can then standardize the response into economic data that is useful without making the merchant run a complicated checkout process.',
        ],
        bullets: [
          'Item or service purchased.',
          'Quantity and local measure.',
          'Brand or type where it matters.',
          'Price in Kenyan shillings and sats.',
          'Merchant and payment context.',
          'Consent and review status before public use.',
        ],
      },
      {
        id: 'pos',
        eyebrow: 'Merchant Tools',
        title: 'A simple Afribit POS can make structured checkout optional',
        paragraphs: [
          'For merchants who want a smoother checkout tool, Afribit can provide a mobile point-of-sale experience. A merchant could enter or speak the items sold, trigger an M-Pesa STK push, confirm payment, and receive the equivalent value in Bitcoin.',
          'The point is not to force every business into a new tool overnight. The point is to offer a path where familiar customer behavior can connect to Bitcoin settlement and cleaner local price data.',
          'Payments should remain linked to merchant-controlled wallets wherever possible. Price data should be gathered with consent, reviewed responsibly, and used to help communities understand everyday purchasing power.',
        ],
      },
      {
        id: 'why-it-matters',
        eyebrow: 'Why It Matters',
        title: 'A local price index can show how far money goes today',
        paragraphs: [
          'Inflation, fees, currency volatility, and supply changes all affect daily life. But many communities do not have a living, local view of prices that reflects actual street-level trade.',
          "By combining Afribit's payment rails with Insats research tooling, local trade can become a clearer signal. Bread, vegetables, airtime, transport, household goods, and services can be compared over time in both shillings and sats.",
          'The shared question is practical: how far does money go here, today? A trustworthy answer can help builders, merchants, funders, and community organizations make better decisions.',
        ],
      },
    ],
    takeaways: [
      'Bitcoin payment events can support settlement evidence without platform custody.',
      'Microtasks add the missing context: what was bought, in what quantity, at what price.',
      'Merchant tools should remain optional, lightweight, and aligned with existing habits.',
      'Local economic intelligence can make purchasing power visible in shillings and sats.',
    ],
    relatedLinks: [
      { label: 'Explore Insats', href: 'https://insats.org', external: true },
      { label: 'View Afribit merchants', href: '/merchants' },
      { label: 'Explore merchant onboarding', href: '/programs/merchants' },
      { label: 'Start a partnership conversation', href: '/contact' },
    ],
    sourcePath: 'docs/blog/Building Local Economic Intelligence.md',
  },
]

export function getBuilderProject(slug: string) {
  return builderProjects.find((project) => project.slug === slug)
}
