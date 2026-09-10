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
    name: '3 West Satenet Wi-Fi',
    number: '02',
    accent: 'orange',
    stage: 'Community intranet support',
    technologies: ['wifi.afribit.africa', 'MikroTik', 'Lightning tools', 'Kibera Mesh research'],
    flow: [
      {
        title: 'Join',
        detail: 'A phone joins the local 3 West Satenet network and opens the community portal.',
      },
      {
        title: 'Explore',
        detail:
          'Local tools, learning links, and Bitcoin resources can live inside wifi.afribit.africa.',
      },
      {
        title: 'Support',
        detail:
          'Afribit contributes software, payment experiments, and documentation for local operators.',
      },
      {
        title: 'Mesh',
        detail:
          'The next research question is Kibera Mesh: local calling, chat, and communication inside the network.',
      },
    ],
    title: '3 West Satenet Wi-Fi: Community Intranet, Built Locally',
    seoTitle: '3 West Satenet Wi-Fi and Kibera Mesh Research',
    description:
      'Afribit supports 3 West Satenet Wi-Fi with Bitcoin tools, local intranet experiments, and research toward a possible Kibera Mesh for free communication inside the network.',
    excerpt:
      '3 West Satenet Wi-Fi is a locally run community network. Afribit supports the builders with software tools, Bitcoin experiments, and research into a future Kibera Mesh.',
    modifiedDate: '2026-09-10',
    category: 'Connectivity',
    primaryKeyword: 'Kibera community intranet',
    secondaryKeywords: [
      '3 West Satenet Wi-Fi',
      'wifi.afribit.africa',
      'Kibera Mesh',
      'community-run Wi-Fi',
      'MikroTik hotspot',
      'Lightning payments',
    ],
    imageSrc: '/Images/blog/afribit-wifi-community-router.png',
    imageAlt: 'Concept illustration for 3 West Satenet Wi-Fi and a local community portal',
    heroEyebrow: 'Afribit Builders',
    heroDescription:
      'A locally run network and intranet space where Afribit supports community builders with tools, Bitcoin experiments, and research toward free local communication.',
    stats: [
      {
        value: 'Local-run',
        label: 'Network ownership and day-to-day operation stay with community builders',
      },
      {
        value: 'Intranet',
        label: 'wifi.afribit.africa can host tools and resources inside the local network',
      },
      {
        value: 'Mesh research',
        label: 'Exploring chat, calls, and communication that work within Kibera',
      },
    ],
    sections: [
      {
        id: 'role',
        eyebrow: 'Afribit Role',
        title: 'Afribit supports the builders, the community runs the network',
        paragraphs: [
          '3 West Satenet Wi-Fi is not an Afribit internet service. It is a local connectivity effort led by people in the community. Afribit supports that work with tools, learning resources, Bitcoin payment experiments, and technical collaboration where it is useful.',
          'That distinction matters. The goal is not for Afribit to become a Wi-Fi provider. The goal is to help local operators and builders own the knowledge, interfaces, and support systems around the networks they already understand.',
          'Our work is to build useful pieces, document them clearly, test them with real constraints, and then let the community take the system forward in the way that fits their streets, devices, and relationships.',
        ],
      },
      {
        id: 'intranet',
        eyebrow: 'Local Portal',
        title: 'wifi.afribit.africa can become a community intranet layer',
        paragraphs: [
          'The current idea is less about selling internet and more about making the local network useful even before the wider internet is involved. A community intranet can host tools, guides, Bitcoin learning resources, service links, and local updates at wifi.afribit.africa.',
          'Inside that model, Afribit can help design the portal and the software patterns while local operators manage the physical network. The portal becomes a shared surface for learning, onboarding, support, and experiments that make sense for 3 West Satenet.',
        ],
        bullets: [
          'A mobile-friendly local portal at wifi.afribit.africa.',
          'Bitcoin education and merchant onboarding resources.',
          'Operator-owned network decisions and community support workflows.',
          'Optional Lightning or voucher experiments where they help the operator.',
          'Documentation that local builders can maintain and improve.',
          'Monitoring ideas that respect privacy and keep operational control local.',
        ],
      },
      {
        id: 'bitcoin-tools',
        eyebrow: 'Bitcoin Tools',
        title: 'Bitcoin support belongs behind the community need',
        paragraphs: [
          'Bitcoin can help a community network when it solves a real coordination problem: accepting small payments, issuing sponsored access, rewarding learning, or connecting merchants to digital value. It should not be forced into the experience just because the technology is exciting.',
          'For 3 West Satenet Wi-Fi, Afribit is exploring tools that can plug into local operations when the operators want them. That could mean Lightning payment experiments, vouchers, merchant education, or simple records that make support easier.',
          'The principle is simple: the community takes it up from there. Afribit can offer software and support, but the people closest to the network decide what is useful.',
        ],
      },
      {
        id: 'mesh',
        eyebrow: 'Kibera Mesh Research',
        title: 'What if the network also carried local communication?',
        paragraphs: [
          'The deeper research track is Kibera Mesh: a possibility where people connected to the local network can call, chat, and communicate for free inside the network. That would make the network valuable even when internet access is limited, expensive, or temporarily unavailable.',
          'This is research, not a promise. It raises practical questions about devices, routing, identity, moderation, safety, emergency use, and what apps or protocols people would actually use. The Builders are exploring those questions with care.',
          'If it works, a community-run mesh could become more than connectivity. It could become local communication infrastructure, built with the people who rely on it.',
        ],
      },
    ],
    takeaways: [
      '3 West Satenet Wi-Fi is locally run; Afribit supports with tools and collaboration.',
      'wifi.afribit.africa can become a useful intranet layer for resources and experiments.',
      'Bitcoin tools are optional support infrastructure, not the point of the network.',
      'Kibera Mesh research asks whether local calls, chat, and communication can happen inside the network for free.',
    ],
    relatedLinks: [
      { label: 'Open wifi.afribit.africa', href: 'https://wifi.afribit.africa', external: true },
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
