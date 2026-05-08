// Central types export file

// Database types (from Prisma)
export type {
  User,
  UserRole,
  ContactSubmission,
  SubmissionStatus,
  Subscriber,
  SubscriberStatus,
  Post,
  PostCategory,
  PostStatus,
  Donation,
  DonationStatus,
  Program,
  Testimonial,
  Statistic,
  PageView,
} from '@prisma/client'

// Component types
export interface NavItem {
  title: string
  href: string
  description?: string
  external?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

export interface SocialLink {
  name: string
  href: string
  icon: string
}

export interface ProgramCard {
  id: string
  title: string
  description: string
  image: string
  slug: string
  icon?: string
  goal?: number
  raised?: number
  category?: string
  features?: string[]
  status?: string
  locationLabel?: string
  city?: string
  country?: string
  beneficiaryCount?: number
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface TestimonialCard {
  id: string
  name: string
  role?: string
  location?: string
  quote: string
  image?: string
  videoUrl?: string
  youtubeId?: string
}

export interface MerchantProfile {
  id: string
  slug: string
  name: string
  category: string
  summary: string
  description?: string | null
  locationLabel?: string | null
  neighborhood?: string | null
  city?: string | null
  country?: string | null
  latitude?: number | null
  longitude?: number | null
  address?: string | null
  phone?: string | null
  email?: string | null
  image?: string | null
  videoUrl?: string
  youtubeId?: string
  acceptsBitcoin: boolean
  services: string[]
  paymentMethods: string[]
  featured?: boolean
  programSlug?: string | null
  btcpayUrl?: string | null
  osmLink?: string | null
  btcmapUrl?: string | null
  openStatus?: string | null
  bitcoinStatus?: string | null
  paymentLightningEnabled?: boolean | null
  paymentOnchainEnabled?: boolean | null
  paymentLightningContactlessEnabled?: boolean | null
  openingHours?: string | null
  lastVerifiedAt?: Date | null
  lastVerifiedByName?: string | null
  verificationNotes?: string | null
}

export interface StatItem {
  label: string
  value: number | string
  icon?: string
  suffix?: string
  prefix?: string
}

// Form types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface NewsletterFormData {
  email: string
  name?: string
}

export interface DonationFormData {
  amount: number
  currency: string
  donorEmail?: string
  donorName?: string
  message?: string
  isAnonymous: boolean
  program?: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface BTCPayInvoice {
  id: string
  storeId: string
  amount: string
  currency: string
  checkoutLink: string
  status: string
  createdTime: string
}
