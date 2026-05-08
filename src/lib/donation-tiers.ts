export interface DonationTier {
  id: string
  name: string
  label: string
  summary: string
  description: string
  recognition: string
  amountLabel: string
  defaultAmount?: number
  goalLabel?: string
  imageSrc: string
  imageAlt: string
  accentClassName: string
  linkedProgramSlug?: 'merchants' | 'upcycling' | 'waste-management' | 'bodaboda'
}

export const donationTiers: DonationTier[] = [
  {
    id: 'custom-contribution',
    name: 'Custom Contribution',
    label: 'General Empowerment Fund',
    summary: 'Flexible support for the daily operating backbone behind every Afribit program.',
    description:
      'Every satoshi helps cover the practical costs that keep Afribit moving in Kibera, from connectivity and workspace needs to outreach materials and field coordination.',
    recognition:
      'Flexible support strengthens the whole ecosystem even when it is not tied to one named recognition tier.',
    amountLabel: 'Any amount',
    imageSrc: '/Images/Kibera Aerial view.jpg',
    imageAlt: 'Aerial view of Kibera.',
    accentClassName: 'from-bitcoin/30 via-bitcoin/10 to-transparent',
  },
  {
    id: 'friend-of-afribit-kibera',
    name: 'Friend of Afribit Kibera',
    label: 'Core Supporter',
    summary: 'Foundational donor support for the daily success of Afribit initiatives.',
    description:
      'This contribution supports communication tools, basic supplies, and the recurring operational work that keeps Afribit reliable for the community.',
    recognition:
      'Supporters can be recognized on the Friends of Afribit Kibera page and receive a personalized digital thank-you note.',
    amountLabel: '$25+',
    defaultAmount: 25,
    goalLabel: 'Goal: $5,000',
    imageSrc: '/Images/Person scanning to pay in bitcoin2.jpg',
    imageAlt: 'Community member scanning to pay in Bitcoin.',
    accentClassName: 'from-panafrican-green/30 via-panafrican-green/10 to-transparent',
  },
  {
    id: 'business-accelerator-program',
    name: 'Business Accelerator Program',
    label: 'Fuel local entrepreneurship',
    summary: 'Mentorship, digital tools, and business support for community enterprises and rider teams.',
    description:
      'This tier supports small businesses and neighborhood entrepreneurship with training, tools, and practical capacity-building. It also reinforces the rider compliance work tied to business growth.',
    recognition:
      'A business cluster or boda-boda team can be named in your honor as the program scales.',
    amountLabel: 'Any amount',
    goalLabel: 'Goal: $12,000',
    imageSrc: '/Images/Mama mboga groceries accepting bitcoin2.jpg',
    imageAlt: 'Merchant using Bitcoin in a local business setting.',
    accentClassName: 'from-bitcoin/35 via-red-500/10 to-transparent',
    linkedProgramSlug: 'merchants',
  },
  {
    id: 'bitcoin-education-program',
    name: 'Bitcoin Education Program',
    label: 'Train 500 Community Ambassadors',
    summary: 'Support monthly cohorts that spread practical Bitcoin literacy across Kibera.',
    description:
      'Afribit aims to equip community champions who can host meetups, mentor peers, and multiply digital financial literacy at neighborhood level.',
    recognition:
      'Training cohorts or meetups can carry your name or your organization’s recognition.',
    amountLabel: 'Any amount',
    goalLabel: 'Goal: $9,500',
    imageSrc: '/Images/Trezor Academy session pics/IMG-20250914-WA0144.jpg',
    imageAlt: 'Afribit Bitcoin education session in Kibera.',
    accentClassName: 'from-sky-400/30 via-sky-400/10 to-transparent',
  },
  {
    id: 'equipment-for-efficiency-scaling',
    name: 'Equipment for Efficiency & Scaling',
    label: 'Tools for upcycling and waste management',
    summary: 'Fund the equipment that lets circular economy groups work faster and scale further.',
    description:
      'This support helps purchase practical tools like sewing machines, handcarts, and processing equipment that raise productivity for upcycling and waste teams.',
    recognition:
      'Specific pieces of equipment can be named in your honor for visible and lasting community impact.',
    amountLabel: '$90',
    defaultAmount: 90,
    imageSrc: '/Images/People cleaning drainage.jpg',
    imageAlt: 'Community members cleaning drainage in Kibera.',
    accentClassName: 'from-amber-400/30 via-amber-400/10 to-transparent',
  },
  {
    id: 'upcycle-queen',
    name: 'Upcycle Queen',
    label: 'Empower a micro-entrepreneur',
    summary: 'Sponsor one woman in the upcycling and weekend empowerment program for a full month.',
    description:
      'This contribution helps Afribit scale the upcycling program from the current cohort to a wider network of women building income through skills and Bitcoin commerce.',
    recognition:
      'Donors receive a personal story and photo from the woman they helped empower, alongside website recognition.',
    amountLabel: '$190',
    defaultAmount: 190,
    imageSrc: '/Images/Trezor Academy session pics/IMG-20250914-WA0155.jpg',
    imageAlt: 'Women participating in Afribit upcycling and empowerment work.',
    accentClassName: 'from-panafrican-green/35 via-bitcoin/10 to-transparent',
    linkedProgramSlug: 'upcycling',
  },
  {
    id: 'satoshi-kwa-usafi',
    name: 'Satoshi Kwa Usafi',
    label: 'Sats for cleanups',
    summary: 'Expand waste-management incentives with direct satoshi rewards for cleanup crews.',
    description:
      'This tier funds community groups for collection and sorting work, helping Afribit add new waste-management teams while keeping Kibera cleaner and healthier.',
    recognition:
      'Donors receive a quarterly impact report with cleanup photos, collection metrics, and recognition on the website.',
    amountLabel: 'Any amount',
    goalLabel: 'Supports expansion beyond the current 4 groups',
    imageSrc: '/Images/Waste Collection.jpg',
    imageAlt: 'Waste collection activity supported by Afribit.',
    accentClassName: 'from-sky-400/35 via-bitcoin/10 to-transparent',
    linkedProgramSlug: 'waste-management',
  },
]

export const donationFaqs = [
  {
    question: 'Can I donate in Bitcoin directly?',
    answer:
      'Yes. Donations are routed through Afribit’s BTCPay Server, so supporters can pay with Bitcoin on-chain or over Lightning without a traditional processor sitting in the middle.',
  },
  {
    question: 'How does program selection work?',
    answer:
      'Some donation tiers align directly with existing Afribit programs such as merchants, upcycling, and waste incentives. Others support wider education or operational capacity across the whole ecosystem.',
  },
  {
    question: 'Can I donate anonymously?',
    answer:
      'Yes. The donate form supports anonymous giving. If you still want impact follow-up or recognition, you can choose to share contact details voluntarily.',
  },
  {
    question: 'How does Afribit show transparency?',
    answer:
      'Afribit pairs BTCPay-based payment flow with public ecosystem references such as BTC Map, Geyser, and Bitcoin Confederation, while also reporting on community outcomes and program growth.',
  },
]