import { Bike, Leaf, Recycle, Store, type LucideIcon } from 'lucide-react'

export interface ProgramMetric {
  value: string
  label: string
}

export interface ProgramSectionItem {
  title: string
  description?: string
  value?: string
}

export interface ProgramSection {
  id: string
  eyebrow: string
  title: string
  intro?: string
  variant: 'cards' | 'steps' | 'metrics' | 'tags'
  items: ProgramSectionItem[]
}

export interface ProgramQuote {
  text: string
  name: string
  role: string
}

export interface ProgramContent {
  slug: string
  title: string
  shortTitle: string
  summary: string
  description: string
  statusLabel: string
  icon: LucideIcon
  iconClassName: string
  iconBackgroundClassName: string
  imageSrc: string
  imageAlt: string
  impactValue: string
  impactLabel: string
  supportLabel: string
  heroTitle: string
  heroDescription: string
  heroMetrics: ProgramMetric[]
  sections: ProgramSection[]
  supportTitle: string
  supportDescription: string
  donationLabel: string
  donationHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  quote: ProgramQuote
}

export const programs: ProgramContent[] = [
  {
    slug: 'merchants',
    title: 'Micro-Merchants & Traders',
    shortTitle: 'Merchants',
    summary: 'Empowering local entrepreneurs to accept Bitcoin payments and grow inside a circular economy.',
    description:
      'The Micro-Merchants & Traders program works directly with local business owners across Kibera to integrate Bitcoin as a practical payment method, backed by onboarding, point-of-sale support, and ongoing field mentorship.',
    statusLabel: 'Active',
    icon: Store,
    iconClassName: 'text-bitcoin',
    iconBackgroundClassName: 'bg-bitcoin/10',
    imageSrc: '/Images/Mama mboga groceries accepting bitcoin.jpg',
    imageAlt: 'A Kibera merchant accepting a Bitcoin payment at a grocery stand.',
    impactValue: '40+',
    impactLabel: 'Merchants actively onboarded into the circular economy.',
    supportLabel: 'Wallet setup, merchant training, and first-payment support.',
    heroTitle: 'Micro-Merchants & Traders',
    heroDescription:
      'Afribit works with mama mbogas, barbers, food vendors, restaurants, and small retailers to make Bitcoin usable in daily trade. The goal is not symbolic adoption. It is a durable network of merchants who can earn, keep, and recirculate value inside Kibera.',
    heroMetrics: [
      { value: '40+', label: 'Active merchants' },
      { value: '2,000+', label: 'Bitcoin transactions' },
      { value: '100%', label: 'Lightning-enabled payments' },
    ],
    sections: [
      {
        id: 'provide',
        eyebrow: 'What we provide',
        title: 'Merchant support goes beyond wallet setup.',
        intro:
          'The program combines practical Bitcoin education with the merchant tools required to keep transactions flowing after launch day.',
        variant: 'cards',
        items: [
          {
            title: 'Bitcoin Education & Onboarding',
            description:
              'Hands-on training covering Bitcoin basics, Lightning usage, wallet setup, security, and merchant-specific transaction handling.',
          },
          {
            title: 'Point-of-Sale Solutions',
            description:
              'Setup for Blink wallets, BTCPay tools, QR signage, and contactless payment flows tailored to small informal businesses.',
          },
          {
            title: 'Ongoing Support & Community',
            description:
              'Regular check-ins, troubleshooting support, and a live merchant network for peer learning and repeat use.',
          },
          {
            title: 'Global Visibility',
            description:
              'Listings on BTC Map and Afribit surfaces help merchants attract Bitcoin-savvy locals, visitors, and supporters.',
          },
        ],
      },
      {
        id: 'how-it-works',
        eyebrow: 'How it works',
        title: 'A four-step path from curiosity to active acceptance.',
        variant: 'steps',
        items: [
          {
            title: 'Initial Consultation',
            description:
              'Afribit meets merchants, explains Bitcoin in plain language, and checks whether the business is ready for simple day-to-day use.',
          },
          {
            title: 'Training Workshop',
            description:
              'Merchants learn wallets, security, pricing, and how Lightning payments feel at the counter before going live.',
          },
          {
            title: 'Setup & Installation',
            description:
              'Wallets, QR codes, signage, and payment flows are configured so the shop can start accepting sats immediately.',
          },
          {
            title: 'Go Live & Support',
            description:
              'Afribit stays close after launch to solve issues early and help Bitcoin become a repeat payment option, not a one-off experiment.',
          },
        ],
      },
      {
        id: 'goals',
        eyebrow: 'Goals',
        title: 'The long-term target is a dense merchant economy, not isolated storefronts.',
        variant: 'metrics',
        items: [
          {
            value: '100 Merchants by 2026',
            title: 'Scale merchant onboarding',
            description: 'Expand the current network across Kibera with stronger category coverage and repeat usage.',
          },
          {
            value: 'Category Diversity',
            title: 'Broaden where sats can be spent',
            description: 'Build representation across food, retail, services, transport, and entertainment.',
          },
          {
            value: 'Peer-to-Peer Ecosystem',
            title: 'Keep value circulating locally',
            description: 'Encourage merchants to transact with each other for supplies and services in Bitcoin.',
          },
          {
            value: 'International Tourism',
            title: 'Create outside demand',
            description: 'Bring Bitcoin-aware visitors into Kibera in ways that support local businesses directly.',
          },
        ],
      },
    ],
    supportTitle: 'Support Micro-Merchants',
    supportDescription:
      'Your donation helps Afribit onboard more local businesses, provide merchant training, and maintain the payment infrastructure that keeps a circular Bitcoin economy alive in Kibera.',
    donationLabel: 'Donate to This Program',
    donationHref: 'https://www.afribit.africa/donate?program=merchants',
    secondaryCtaLabel: 'View Merchant Directory',
    secondaryCtaHref: 'https://www.afribit.africa/maps',
    quote: {
      text: 'I was the first merchant selling fries, juice, and porridge. Thanks to my Bitcoin earnings, I bought a motorbike and expanded my business. Bitcoin has not just helped me grow; it has given me the confidence to dream even bigger.',
      name: 'Steph',
      role: 'Food merchant and Bitcoin advocate',
    },
  },
  {
    slug: 'upcycling',
    title: "Women's Upcycling Collective",
    shortTitle: 'Upcycling',
    summary: 'Training women to transform waste into valuable products and earn through Bitcoin commerce.',
    description:
      'The Women\'s Upcycling Collective combines craftsmanship training, material access, and Bitcoin commerce so women in Kibera can build sustainable businesses from discarded materials.',
    statusLabel: 'Active',
    icon: Leaf,
    iconClassName: 'text-panafrican-green',
    iconBackgroundClassName: 'bg-panafrican-green/10',
    imageSrc: '/Images/Trezor Academy session pics/IMG-20250914-WA0155.jpg',
    imageAlt: 'Women participating in Afribit upcycling and Bitcoin training.',
    impactValue: '7 Women',
    impactLabel: 'Currently training and producing inside the collective.',
    supportLabel: 'Training, equipment, material sourcing, and sales support.',
    heroTitle: "Women's Upcycling Collective",
    heroDescription:
      'This program equips women in Kibera with the skills, equipment, and sales pathways needed to turn waste into marketable products. By combining creative production with Bitcoin payments, Afribit helps participants build income and agency while reducing environmental waste.',
    heroMetrics: [
      { value: '7', label: 'Women currently training' },
      { value: '150+', label: 'Products created' },
      { value: '500kg', label: 'Waste diverted' },
    ],
    sections: [
      {
        id: 'provide',
        eyebrow: 'What we provide',
        title: 'The collective blends production, commerce, and market access.',
        intro:
          'Participants receive both craft training and the tools to earn from what they create.',
        variant: 'cards',
        items: [
          {
            title: 'Skills Training & Equipment',
            description:
              'Instruction in sewing, design, pattern making, and upcycling techniques with access to machines, tools, and working materials.',
          },
          {
            title: 'Bitcoin Commerce Training',
            description:
              'Practical lessons on wallet use, receiving payments, and managing earnings in Bitcoin.',
          },
          {
            title: 'Market Access & Sales Support',
            description:
              'Support with pricing, product photography, local sales, and connections to wider ethical and international markets.',
          },
          {
            title: 'Material Sourcing Network',
            description:
              'Links to waste collection partners that provide steady access to fabrics, plastics, metals, and other reusable materials.',
          },
        ],
      },
      {
        id: 'create',
        eyebrow: 'What we create',
        title: 'Products are designed for real use and repeat sales.',
        variant: 'tags',
        items: [
          { title: 'Handbags & totes' },
          { title: 'Clothing & apparel' },
          { title: 'Home decor' },
          { title: 'Accessories & gifts' },
        ],
      },
      {
        id: 'journey',
        eyebrow: 'Program journey',
        title: 'Participants move from orientation to independent production.',
        variant: 'steps',
        items: [
          {
            title: 'Recruitment & Orientation',
            description: 'Women apply, join orientation sessions, and learn how the collective works in practice.',
          },
          {
            title: '8-Week Skills Training',
            description: 'Hands-on craft and design sessions build the technical foundation for production.',
          },
          {
            title: 'Bitcoin & Business Training',
            description: 'Afribit teaches wallet use, pricing, customer service, and how to sell through Bitcoin-enabled channels.',
          },
          {
            title: 'Production & Sales',
            description: 'Graduates receive equipment kits, begin producing independently, and keep access to mentorship and sales support.',
          },
        ],
      },
      {
        id: 'goals',
        eyebrow: 'Goals',
        title: 'The next phase expands both income and environmental impact.',
        variant: 'metrics',
        items: [
          {
            value: '20 Women by 2026',
            title: 'Scale participation',
            description: 'Grow the collective from the current cohort to a wider network of women-led producers.',
          },
          {
            value: 'Dedicated Workshop Space',
            title: 'Create a permanent production hub',
            description: 'Establish space for training, storage, production, and retail operations.',
          },
          {
            value: 'International Markets',
            title: 'Unlock broader demand',
            description: 'Connect the collective to ethical buyers and export opportunities beyond the neighborhood.',
          },
          {
            value: '5 Tons Diverted Annually',
            title: 'Deepen environmental impact',
            description: 'Increase the volume of waste reclaimed through creative upcycling.',
          },
        ],
      },
    ],
    supportTitle: "Support Women's Empowerment",
    supportDescription:
      'Your donation funds training, equipment, materials, and market support so women in Kibera can build sustainable businesses while reducing waste.',
    donationLabel: 'Donate to This Program',
    donationHref: 'https://www.afribit.africa/donate?program=upcycling',
    secondaryCtaLabel: 'Partner With Afribit',
    secondaryCtaHref: '/contact',
    quote: {
      text: 'As part of the Upcycle Queens initiative, I learned how to create beautiful, functional items from materials that would otherwise be thrown away. My creations are now earning me Bitcoin, and I get to contribute to a sustainable future.',
      name: 'Abebo',
      role: 'Upcycle Queen and Bitcoin advocate',
    },
  },
  {
    slug: 'waste-management',
    title: 'Waste Incentives Program',
    shortTitle: 'Waste Incentives',
    summary: 'Rewarding community members with Bitcoin for collecting and recycling waste across Kibera.',
    description:
      'The Waste Incentives Program uses Bitcoin rewards to turn cleanup work into income, motivating youth and community members to collect, sort, and route waste toward recycling, upcycling, or safe disposal.',
    statusLabel: 'Expanding',
    icon: Recycle,
    iconClassName: 'text-sky-400',
    iconBackgroundClassName: 'bg-sky-400/10',
    imageSrc: '/Images/Waste Collection.jpg',
    imageAlt: 'Afribit waste collection activity in Kibera.',
    impactValue: '2.5 Tons',
    impactLabel: 'Waste collected monthly through active neighborhood groups.',
    supportLabel: 'Collector rewards, equipment, verification, and expansion to new zones.',
    heroTitle: 'Waste Incentives Program',
    heroDescription:
      'Afribit tackles Kibera\'s waste crisis by attaching clear Bitcoin incentives to collection and recycling. Participants earn sats based on the quantity and quality of the waste they collect, while the neighborhood benefits from cleaner streets, drainage, and public spaces.',
    heroMetrics: [
      { value: '4', label: 'Active collection groups' },
      { value: '2.5 Tons', label: 'Collected monthly' },
      { value: '30+', label: 'Active participants' },
    ],
    sections: [
      {
        id: 'system',
        eyebrow: 'How the system works',
        title: 'The incentive loop is simple, transparent, and repeatable.',
        variant: 'steps',
        items: [
          {
            title: 'Registration & Training',
            description: 'Collectors register, receive Bitcoin wallets, and learn sorting, safety, and environmental best practices.',
          },
          {
            title: 'Collection & Sorting',
            description: 'Participants gather waste from assigned zones and separate materials into reusable categories.',
          },
          {
            title: 'Weighing & Verification',
            description: 'Afribit verifies the collected materials and confirms quality before rewards are issued.',
          },
          {
            title: 'Bitcoin Payment',
            description: 'Collectors receive Lightning payments based on weight and material type using transparent rates.',
          },
          {
            title: 'Processing & Recycling',
            description: 'Materials move to recycling, upcycling, or safe disposal partners, closing the loop.',
          },
        ],
      },
      {
        id: 'payments',
        eyebrow: 'Payment structure',
        title: 'Reward rates give collectors a clear reason to participate consistently.',
        variant: 'metrics',
        items: [
          {
            value: '~500 sats/kg',
            title: 'Plastics',
            description: 'Clean, sorted bottles and plastic containers.',
          },
          {
            value: '~800 sats/kg',
            title: 'Metals',
            description: 'Aluminum, copper, and other recyclable metals.',
          },
          {
            value: '~300 sats/kg',
            title: 'Paper & cardboard',
            description: 'Clean paper products and boxes ready for recovery.',
          },
          {
            value: '~400 sats/kg',
            title: 'Glass',
            description: 'Bottles and containers, ideally sorted and unbroken.',
          },
        ],
      },
      {
        id: 'benefits',
        eyebrow: 'Program benefits',
        title: 'The upside is economic, environmental, and educational at the same time.',
        variant: 'cards',
        items: [
          {
            title: 'Environmental Impact',
            description: 'Cleaner streets, less blocked drainage, better sanitation, and stronger public-health outcomes.',
          },
          {
            title: 'Income Generation',
            description: 'Participants earn supplemental or full-time income that can be saved, spent locally, or converted when necessary.',
          },
          {
            title: 'Youth Employment',
            description: 'The program creates dignified work for people who often face barriers to formal employment.',
          },
          {
            title: 'Bitcoin Adoption',
            description: 'Collectors gain direct exposure to Bitcoin and practical financial tools through repeated use.',
          },
        ],
      },
      {
        id: 'goals',
        eyebrow: 'Expansion goals',
        title: 'The next phase is about coverage, infrastructure, and scale.',
        variant: 'metrics',
        items: [
          {
            value: '10 Collection Groups',
            title: 'Expand community coverage',
            description: 'Grow from four active groups to a network serving all major parts of Kibera.',
          },
          {
            value: '3 Permanent Centers',
            title: 'Build durable infrastructure',
            description: 'Create permanent weighing, storage, and processing points for consistent operations.',
          },
          {
            value: '10 Tons Monthly',
            title: 'Scale collection capacity',
            description: 'Increase the amount of waste removed from streets and waterways every month.',
          },
          {
            value: 'Recycling Partnerships',
            title: 'Strengthen downstream processing',
            description: 'Formalize relationships that improve material recovery and create additional revenue.',
          },
        ],
      },
    ],
    supportTitle: 'Support Clean Kibera',
    supportDescription:
      'Your donation funds Bitcoin rewards for waste collectors, equipment for collection centers, and expansion into new areas so the program can scale with the community.',
    donationLabel: 'Donate to This Program',
    donationHref: 'https://www.afribit.africa/donate?program=waste-management',
    secondaryCtaLabel: 'Partner With Us',
    secondaryCtaHref: '/contact',
    quote: {
      text: 'When Afribit introduced Bitcoin to our waste management group, I was immediately hooked. I have been earning and stacking sats regularly. I also joined the Core Bitcoin Classes to deepen my understanding. It is about financial freedom.',
      name: 'Glen Omolo',
      role: 'Waste management participant and Bitcoin advocate',
    },
  },
  {
    slug: 'bodaboda',
    title: 'Boda-Boda "Ride to Freedom"',
    shortTitle: 'Boda-Boda',
    summary: 'Providing motorcycle riders with Bitcoin microloans for compliance, safety, and financial independence.',
    description:
      'The Boda-Boda "Ride to Freedom" program uses Bitcoin-based microloans to help riders secure licensing, insurance, safety gear, and business upgrades so they can operate legally and build long-term stability.',
    statusLabel: 'Active',
    icon: Bike,
    iconClassName: 'text-amber-400',
    iconBackgroundClassName: 'bg-amber-400/10',
    imageSrc: '/Images/Motorbike bitcoin onboarding.jpg',
    imageAlt: 'A boda-boda rider participating in Bitcoin onboarding.',
    impactValue: '95%',
    impactLabel: 'Repayment rate across current loan recipients.',
    supportLabel: 'Licensing, insurance, safety gear, and rider growth capital.',
    heroTitle: 'Boda-Boda "Ride to Freedom"',
    heroDescription:
      'Boda-boda riders are central to Nairobi transport, but many operate without the licensing, insurance, or equipment required for safe and legal work. Afribit uses flexible Bitcoin microloans to help riders formalize their businesses and move toward stronger incomes and eventual ownership.',
    heroMetrics: [
      { value: '10', label: 'Active loan recipients' },
      { value: '95%', label: 'Repayment rate' },
      { value: '100%', label: 'Licensed and insured' },
    ],
    sections: [
      {
        id: 'coverage',
        eyebrow: 'Loan coverage',
        title: 'Loans remove the barriers that keep riders stuck in informal risk.',
        variant: 'metrics',
        items: [
          {
            value: 'KES 5,000 - 15,000',
            title: 'Licenses & permits',
            description: 'Support for operator licensing, PSV permits, and business registration fees.',
          },
          {
            value: 'KES 8,000 - 20,000',
            title: 'Insurance & inspection',
            description: 'Annual insurance, inspection fees, and compliance costs tied to legal operation.',
          },
          {
            value: 'KES 3,000 - 10,000',
            title: 'Safety equipment',
            description: 'Helmets, reflective jackets, locks, and core protective gear.',
          },
          {
            value: 'KES 10,000 - 50,000',
            title: 'Motorcycle improvements',
            description: 'Repairs, maintenance, and steps toward eventual motorcycle ownership.',
          },
        ],
      },
      {
        id: 'process',
        eyebrow: 'Application process',
        title: 'The rider journey is structured, practical, and flexible to real income cycles.',
        variant: 'steps',
        items: [
          {
            title: 'Application & Verification',
            description: 'Riders submit basic information, explain their need, and complete light-touch identity and business checks.',
          },
          {
            title: 'Bitcoin Education',
            description: 'Every participant learns wallet setup, sending and receiving, and Lightning fundamentals before disbursement.',
          },
          {
            title: 'Loan Approval & Disbursement',
            description: 'Approved riders receive Bitcoin loans directly and can convert for fees or spend within the ecosystem.',
          },
          {
            title: 'Flexible Repayment',
            description: 'Repayments adapt to real transport income so busy weeks and slow weeks are handled differently.',
          },
          {
            title: 'Graduation & Growth',
            description: 'Successful repayment opens access to future opportunities, including larger growth or ownership-focused loans.',
          },
        ],
      },
      {
        id: 'terms',
        eyebrow: 'Loan terms',
        title: 'The model is designed to be lower-friction than traditional microfinance.',
        variant: 'metrics',
        items: [
          {
            value: '5-8% annual interest',
            title: 'Affordable lending',
            description: 'Rates stay well below what many riders would face elsewhere.',
          },
          {
            value: '3-12 months',
            title: 'Flexible repayment horizon',
            description: 'Loan length adjusts to size, purpose, and the rider\'s cash-flow reality.',
          },
          {
            value: '0 collateral',
            title: 'Trust-based structure',
            description: 'No hard collateral requirement, backed by community trust and real engagement.',
          },
        ],
      },
      {
        id: 'goals',
        eyebrow: 'Program goals',
        title: 'The program aims to formalize more riders and widen the path to ownership.',
        variant: 'cards',
        items: [
          {
            title: '40 Riders by 2026',
            description: 'Expand from the current cohort to a much larger pool of compliant, active riders.',
          },
          {
            title: 'Motorcycle Ownership Program',
            description: 'Create purchase-focused loans that help riders move beyond daily rental dependence.',
          },
          {
            title: 'Ride-Hailing Integration',
            description: 'Help compliant riders access premium earnings through local and international platforms.',
          },
          {
            title: 'Savings & Investment Education',
            description: 'Pair lending with longer-term wealth and Bitcoin savings guidance.',
          },
        ],
      },
    ],
    supportTitle: 'Empower Boda-Boda Riders',
    supportDescription:
      'Your donation provides life-changing microloans to motorcycle riders, helping them achieve legal compliance, financial security, and a path toward ownership.',
    donationLabel: 'Donate to This Program',
    donationHref: 'https://www.afribit.africa/donate?program=bodaboda',
    secondaryCtaLabel: 'Talk to the Team',
    secondaryCtaHref: '/contact',
    quote: {
      text: 'Through Afribit, I was able to complete my driving classes. The repayment in sats is very affordable. I can now convert my sats, save some, and spend some within the circular economy, supporting other riders and helping the whole community grow.',
      name: 'Brian',
      role: 'Boda-boda rider and Bitcoin advocate',
    },
  },
]

export const generalDonateHref = 'https://www.afribit.africa/donate'

export function getProgramBySlug(slug: string) {
  return programs.find((program) => program.slug === slug)
}