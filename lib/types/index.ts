/**
 * Common TypeScript type definitions for Afribit Africa project
 * Centralizes interfaces and types used across components
 */

// ============================================================================
// DONATION TYPES
// ============================================================================

export interface DonationTier {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  goal?: number;
  perk: string;
  description: string;
  image: string;
  isCustom?: boolean;
  bgGradient: string;
}

export interface InvoiceData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdTime: number;
  expirationTime: number;
  checkoutLink?: string;
  metadata?: Record<string, any>;
}

export interface DonorInfo {
  invoiceId: string;
  name: string;
  email: string;
  amount: number;
  tier: string;
  donationType: 'anonymous' | 'named';
  createdAt?: Date;
}

export interface DonationStats {
  totalDonations: number;
  totalDonors: number;
  averageDonation: number;
  recentDonations?: Array<{
    amount: number;
    donor: string;
    date: string;
  }>;
}

// Database row types (snake_case matching DB columns)
export interface Donor {
  id: number;
  invoice_id: string;
  name: string | null;
  email: string | null;
  amount: number;
  tier: string;
  donation_type: 'anonymous' | 'named';
  created_at: Date;
}

export interface DonorStats {
  total_donations: number;
  total_amount: number;
  named_donations: number;
  anonymous_donations: number;
}

// ============================================================================
// MERCHANT TYPES
// ============================================================================

export interface Merchant {
  id: string;
  businessName: string;
  categoryValue: string;
  categoryDisplay?: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  contactEmail?: string;
  paymentOnchain: boolean;
  paymentLightning: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'published';
  submittedAt: string;
  approvedAt?: string;
  publishedAt?: string;
  isEarlyAdopter?: boolean;
  adopterNumber?: number;
  osmId?: string;
  osmUrl?: string;
}

export interface MerchantSubmission {
  businessName: string;
  categoryValue: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  contactEmail: string;
  paymentOnchain: boolean;
  paymentLightning: boolean;
  additionalInfo?: string;
}

export interface MerchantFormData extends MerchantSubmission {
  businessName: string;
  categoryValue: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  contactEmail: string;
  paymentOnchain: boolean;
  paymentLightning: boolean;
  additionalInfo?: string;
}

// ============================================================================
// VERIFIER TYPES
// ============================================================================

export interface VerifierApplication {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  yearsInKibera: number;
  languages: string;
  community_roles: string;
  localKnowledge: string;
  verificationExperience: string;
  motivation: string;
  availability: string;
  hasSmartphone: boolean;
  internetAccess: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface VerifierStats {
  totalApplications: number;
  pendingApplications: number;
  approvedVerifiers: number;
  rejectedApplications: number;
  recentApplications: VerifierApplication[];
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'verifier' | 'moderator';
  createdAt: string;
  lastLogin?: string;
}

export interface DashboardStats {
  pendingCount: number;
  approvedCount: number;
  publishedCount: number;
  rejectedCount: number;
  earlyAdoptersCount: number;
  submissionsLast7Days: number;
  submissionsLast30Days: number;
  totalSubmissions: number;
}

export interface RecentSubmission {
  id: string;
  businessName: string;
  contactEmail: string;
  status: string;
  submittedAt: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
}

// ============================================================================
// MAP TYPES
// ============================================================================

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface LocationMarker {
  id: string;
  position: MapCoordinates;
  title: string;
  description?: string;
  icon?: string;
}

// ============================================================================
// BTCPAY TYPES
// ============================================================================

export interface BTCPayInvoice {
  id: string;
  storeId: string;
  amount: number;
  currency: string;
  status: 'New' | 'Processing' | 'Settled' | 'Expired' | 'Invalid';
  createdTime: number;
  expirationTime: number;
  monitoringExpiration: number;
  checkoutLink: string;
  metadata?: Record<string, any>;
}

export interface BTCPayPaymentMethod {
  paymentMethod: string;
  destination: string;
  paymentLink?: string;
  amount: string;
  rate?: number;
}

// ============================================================================
// EMAIL TYPES
// ============================================================================

export interface EmailTemplate {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MerchantEmailData {
  businessName: string;
  email: string;
  status: 'approved' | 'rejected';
  reason?: string;
}

// ============================================================================
// OSM (OPENSTREETMAP) TYPES
// ============================================================================

export interface OSMNode {
  type: 'node';
  id?: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

export interface OSMChangeset {
  id: number;
  created_at: string;
  closed_at?: string;
  open: boolean;
  user: string;
  uid: number;
  comments_count: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type PaymentMethod = 'onchain' | 'lightning' | 'both';

export type MerchantStatus = 'pending' | 'approved' | 'rejected' | 'published';

export type DonationTierType =
  | 'custom'
  | 'friend'
  | 'business'
  | 'education'
  | 'equipment'
  | 'upcycle'
  | 'waste';

export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'processing';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params?: Record<string, string>;
  searchParams?: Record<string, string | string[] | undefined>;
}

export interface LayoutProps {
  children: React.ReactNode;
  params?: Record<string, string>;
}
