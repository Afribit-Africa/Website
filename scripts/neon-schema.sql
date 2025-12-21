-- Afribit Africa Database Schema for Neon PostgreSQL
-- Run this script to initialize all required tables

-- =============================================
-- ADMIN USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'reviewer', 'verifier')),
    is_active BOOLEAN DEFAULT true,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- =============================================
-- MERCHANT SUBMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS merchant_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Business Information
    business_name VARCHAR(255) NOT NULL,
    category_key VARCHAR(100),
    category_value VARCHAR(255),
    description TEXT,

    -- Location
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,

    -- Contact Information
    phone VARCHAR(50),
    website VARCHAR(255),
    opening_hours VARCHAR(255),

    -- Social Media
    social_twitter VARCHAR(255),
    social_facebook VARCHAR(255),
    social_instagram VARCHAR(255),

    -- Bitcoin Payment Methods
    payment_onchain BOOLEAN DEFAULT false,
    payment_lightning BOOLEAN DEFAULT false,
    payment_lightning_contactless BOOLEAN DEFAULT false,
    lightning_address VARCHAR(255),

    -- Submitter Contact
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_relationship VARCHAR(100),

    -- Evidence and Tokens
    evidence_urls JSONB,
    edit_token VARCHAR(255),

    -- Status and Workflow
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published', 'verified')),
    is_early_adopter BOOLEAN DEFAULT false,
    adopter_number INTEGER,

    -- OSM Integration
    osm_node_id BIGINT,
    osm_published_at TIMESTAMP,

    -- Verification Fields
    verification_status VARCHAR(50) CHECK (verification_status IN ('pending', 'verified', 'not_verified', 'needs_reverification')),
    verifier_id UUID REFERENCES admin_users(id),
    verified_by_verifier_email VARCHAR(255),
    verifier_notes TEXT,
    verifier_location_lat DECIMAL(10, 8),
    verifier_location_lng DECIMAL(11, 8),
    verifier_distance_meters INTEGER,
    verified_at_location TIMESTAMP,
    verification_photos JSONB,
    business_name_matches BOOLEAN,
    business_exists BOOLEAN,
    payment_methods_verified JSONB,
    business_operating VARCHAR(50),

    -- BTCMap Integration
    btcmap_id VARCHAR(255),
    btcmap_url VARCHAR(255),

    -- Timestamps
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_merchant_submissions_status ON merchant_submissions(status);
CREATE INDEX IF NOT EXISTS idx_merchant_submissions_email ON merchant_submissions(contact_email);
CREATE INDEX IF NOT EXISTS idx_merchant_submissions_location ON merchant_submissions(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_merchant_submissions_osm ON merchant_submissions(osm_node_id);
CREATE INDEX IF NOT EXISTS idx_merchant_submissions_early_adopter ON merchant_submissions(is_early_adopter);

-- =============================================
-- MERCHANT EDIT REQUESTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS merchant_edit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchant_submissions(id) ON DELETE CASCADE,

    -- Submitter Information
    submitter_name VARCHAR(255) NOT NULL,
    submitter_email VARCHAR(255) NOT NULL,
    submitter_phone VARCHAR(50),

    -- Old Values
    business_name_old VARCHAR(255),
    blink_address_old VARCHAR(255),
    latitude_old DECIMAL(10, 8),
    longitude_old DECIMAL(11, 8),
    location_old TEXT,
    address_old TEXT,
    phone_old VARCHAR(50),
    category_old VARCHAR(255),

    -- New Values
    business_name_new VARCHAR(255),
    blink_address_new VARCHAR(255),
    latitude_new DECIMAL(10, 8),
    longitude_new DECIMAL(11, 8),
    location_new TEXT,
    address_new TEXT,
    phone_new VARCHAR(50),
    category_new VARCHAR(255),

    -- Edit Details
    reason_for_edit TEXT NOT NULL,
    used_current_location BOOLEAN DEFAULT false,
    location_accuracy DECIMAL(10, 2),
    distance_from_original DECIMAL(10, 2),

    -- OSM Reference
    osm_node_id BIGINT,

    -- Status and Review
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'applied')),
    reviewed_by UUID REFERENCES admin_users(id),
    reviewed_at TIMESTAMP,
    admin_notes TEXT,

    -- Email Confirmation
    confirmation_token VARCHAR(255),
    confirmed_at TIMESTAMP,

    -- Timestamps
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_edit_requests_merchant ON merchant_edit_requests(merchant_id);
CREATE INDEX IF NOT EXISTS idx_edit_requests_status ON merchant_edit_requests(status);
CREATE INDEX IF NOT EXISTS idx_edit_requests_email ON merchant_edit_requests(submitter_email);

-- =============================================
-- DONORS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS donors (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    tier VARCHAR(50) NOT NULL,
    donation_type VARCHAR(20) NOT NULL CHECK (donation_type IN ('anonymous', 'named')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donors_invoice_id ON donors(invoice_id);
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);
CREATE INDEX IF NOT EXISTS idx_donors_created_at ON donors(created_at);

-- =============================================
-- VERIFICATION HISTORY TABLE (Optional)
-- =============================================
CREATE TABLE IF NOT EXISTS verification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES merchant_submissions(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES admin_users(id),
    verification_result VARCHAR(50) NOT NULL,
    verifier_notes TEXT,
    verifier_location_lat DECIMAL(10, 8),
    verifier_location_lng DECIMAL(11, 8),
    distance_meters INTEGER,
    photos JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verification_history_submission ON verification_history(submission_id);

-- =============================================
-- FUNCTION: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_merchant_submissions_updated_at ON merchant_submissions;
CREATE TRIGGER update_merchant_submissions_updated_at
    BEFORE UPDATE ON merchant_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_edit_requests_updated_at ON merchant_edit_requests;
CREATE TRIGGER update_edit_requests_updated_at
    BEFORE UPDATE ON merchant_edit_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
