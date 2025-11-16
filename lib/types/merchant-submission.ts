// Types for Merchant Submission System

export type MerchantStatus = 'pending' | 'approved' | 'rejected' | 'published';

export type CategoryKey = 'amenity' | 'shop';

export type ContactRelationship = 'owner' | 'manager' | 'staff' | 'other';

export interface MerchantSubmission {
  id: string;

  // Business Information
  businessName: string;
  categoryKey: CategoryKey;
  categoryValue: string;
  description?: string;

  // Location Data
  latitude: number;
  longitude: number;
  address?: string;

  // Contact & Details
  phone?: string;
  website?: string;
  openingHours?: string;
  socialTwitter?: string;
  socialFacebook?: string;
  socialInstagram?: string;

  // Bitcoin Payment Methods
  paymentOnchain: boolean;
  paymentLightning: boolean;
  paymentLightningContactless: boolean;

  // Merchant Contact
  contactName: string;
  contactEmail: string;
  contactRelationship?: ContactRelationship;

  // Supporting Evidence
  evidenceUrls?: string[];

  // Status & Workflow
  status: MerchantStatus;
  rejectionReason?: string;
  editToken?: string;

  // OSM Integration
  osmNodeId?: number;
  osmChangesetId?: number;
  btcmapSynced: boolean;

  // Early Adopter Program
  isEarlyAdopter: boolean;
  adopterNumber?: number;

  // Timestamps
  submittedAt: Date;
  verifiedAt?: Date;
  verifiedByEmail?: string;
  publishedAt?: Date;
  lastEditedAt?: Date;
}

export interface MerchantSubmissionForm {
  // Business Information
  businessName: string;
  categoryKey: CategoryKey;
  categoryValue: string;
  description?: string;

  // Location Data
  latitude: number;
  longitude: number;
  address?: string;

  // Contact & Details
  phone?: string;
  website?: string;
  openingHours?: string;
  socialTwitter?: string;
  socialFacebook?: string;
  socialInstagram?: string;

  // Bitcoin Payment Methods
  paymentOnchain: boolean;
  paymentLightning: boolean;
  paymentLightningContactless: boolean;

  // Merchant Contact
  contactName: string;
  contactEmail: string;
  contactRelationship?: ContactRelationship;

  // Supporting Evidence (file uploads)
  evidenceFiles?: File[];
}

export interface SubmitMerchantResponse {
  success: boolean;
  submissionId?: string;
  editToken?: string;
  message: string;
  error?: string;
}

export interface AdminDashboardStats {
  pendingCount: number;
  approvedCount: number;
  publishedCount: number;
  rejectedCount: number;
  earlyAdoptersCount: number;
  submissionsLast7Days: number;
  submissionsLast30Days: number;
}

export interface AdminActivity {
  id: string;
  merchantSubmissionId: string;
  adminEmail: string;
  action: 'approved' | 'rejected' | 'edited' | 'published';
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

export interface ApprovalRequest {
  submissionId: string;
  adminEmail: string;
  notes?: string;
}

export interface RejectionRequest {
  submissionId: string;
  adminEmail: string;
  reason: string;
}

// OSM Tag Mapping
export const AMENITY_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Café' },
  { value: 'bar', label: 'Bar' },
  { value: 'pub', label: 'Pub' },
  { value: 'fast_food', label: 'Fast Food' },
  { value: 'food_court', label: 'Food Court' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'bank', label: 'Bank' },
  { value: 'bureau_de_change', label: 'Currency Exchange' },
  { value: 'atm', label: 'ATM' },
  { value: 'fuel', label: 'Fuel Station' },
  { value: 'parking', label: 'Parking' },
  { value: 'car_wash', label: 'Car Wash' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'guest_house', label: 'Guest House' },
  { value: 'hostel', label: 'Hostel' },
] as const;

export const SHOP_TYPES = [
  { value: 'convenience', label: 'Convenience Store' },
  { value: 'supermarket', label: 'Supermarket' },
  { value: 'mall', label: 'Shopping Mall' },
  { value: 'clothes', label: 'Clothing Store' },
  { value: 'shoes', label: 'Shoe Store' },
  { value: 'jewelry', label: 'Jewelry Store' },
  { value: 'beauty', label: 'Beauty Shop' },
  { value: 'hairdresser', label: 'Hairdresser' },
  { value: 'mobile_phone', label: 'Mobile Phone Shop' },
  { value: 'computer', label: 'Computer Shop' },
  { value: 'electronics', label: 'Electronics Store' },
  { value: 'hardware', label: 'Hardware Store' },
  { value: 'books', label: 'Bookstore' },
  { value: 'stationery', label: 'Stationery Store' },
  { value: 'gift', label: 'Gift Shop' },
  { value: 'florist', label: 'Florist' },
  { value: 'car', label: 'Car Dealership' },
  { value: 'car_repair', label: 'Car Repair' },
  { value: 'bicycle', label: 'Bicycle Shop' },
] as const;

export const CONTACT_RELATIONSHIPS = [
  { value: 'owner', label: 'Business Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff Member' },
  { value: 'other', label: 'Other' },
] as const;
