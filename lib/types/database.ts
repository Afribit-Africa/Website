/**
 * Database Type Definitions
 * Provides type safety for all database operations
 */

// ==================== MERCHANTS ====================

export interface MerchantSubmission {
  id: string;
  business_name: string;
  category_key: string;
  category_value: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  website: string | null;
  opening_hours: string | null;
  social_twitter: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  payment_onchain: boolean;
  payment_lightning: boolean;
  payment_lightning_contactless: boolean;
  contact_name: string;
  contact_email: string;
  contact_relationship: string | null;
  evidence_urls: string | null; // JSON string
  edit_token: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  is_early_adopter: boolean;
  submitted_at: Date;
  reviewed_at: Date | null;
  reviewed_by: string | null;
  verification_status: 'pending' | 'verified' | 'not_verified' | null;
  verified_at: Date | null;
  verified_by: string | null;
  verifier_notes: string | null;
  osm_node_id: string | null;
  btcmap_url: string | null;
}

export type MerchantStatus = MerchantSubmission['status'];
export type VerificationStatus = MerchantSubmission['verification_status'];

// ==================== DONORS ====================

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

// ==================== ADMIN ====================

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'verifier';
  is_active: boolean;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
  reset_token: string | null;
  reset_token_expiry: Date | null;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  merchant_submission_id: string | null;
  action: 'approve' | 'reject' | 'publish' | 'edit' | 'delete' | 'verify';
  details: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

// ==================== VERIFIER ====================

export interface VerificationRecord {
  id: string;
  submission_id: string;
  verifier_id: string;
  business_exists: boolean;
  business_name_matches: boolean;
  corrected_name: string | null;
  business_operating: 'open' | 'closed' | 'temporarily_closed';
  payment_methods_verified: string; // JSON string array
  photos: string | null; // JSON string array
  verifier_notes: string | null;
  verification_result: 'verified' | 'not_verified';
  verified_at: Date;
  verifier_location_lat: number | null;
  verifier_location_lng: number | null;
  distance_from_business: number | null;
}

// ==================== QUERY RESULT TYPES ====================

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
  status: MerchantStatus;
  submittedAt: string;
}

export interface NearbySubmission {
  id: string;
  businessName: string;
  location: string;
  latitude: number;
  longitude: number;
  distance: number;
  submittedAt: string;
  verificationStatus: VerificationStatus;
}

export interface VerifierStats {
  totalVerifications: number;
  verifiedCount: number;
  notVerifiedCount: number;
  pendingCount: number;
}

// ==================== DATABASE UTILITIES ====================

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

export interface TransactionConnection {
  query: <T>(sql: string, params?: any[]) => Promise<T>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  release: () => void;
}
