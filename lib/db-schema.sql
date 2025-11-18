-- Merchant Submissions Table (MySQL Compatible)
-- For BTCMap self-registration with Afribit verification

CREATE TABLE IF NOT EXISTS merchant_submissions (
  id CHAR(36) PRIMARY KEY,

  -- Business Information
  business_name VARCHAR(255) NOT NULL,
  category_key VARCHAR(50) NOT NULL, -- 'amenity' or 'shop'
  category_value VARCHAR(50) NOT NULL, -- 'restaurant', 'cafe', 'convenience', etc.
  description TEXT,

  -- Location Data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,

  -- Contact & Details
  phone VARCHAR(50),
  website VARCHAR(255),
  opening_hours VARCHAR(255),
  social_twitter VARCHAR(100),
  social_facebook VARCHAR(100),
  social_instagram VARCHAR(100),

  -- Bitcoin Payment Methods
  payment_onchain BOOLEAN DEFAULT false,
  payment_lightning BOOLEAN DEFAULT false,
  payment_lightning_contactless BOOLEAN DEFAULT false,
  lightning_address VARCHAR(255), -- Lightning address like user@blink.sv

  -- Merchant Contact
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_relationship VARCHAR(50), -- 'owner', 'manager', 'staff'

  -- Supporting Evidence
  evidence_urls JSON, -- JSON array of image URLs

  -- Status & Workflow
  status VARCHAR(20) DEFAULT 'pending',
  rejection_reason TEXT,
  edit_token VARCHAR(64) UNIQUE, -- For merchant to edit submission

  -- OSM Integration
  osm_node_id BIGINT,
  osm_changeset_id BIGINT,
  btcmap_synced BOOLEAN DEFAULT false,

  -- Early Adopter Program
  is_early_adopter BOOLEAN DEFAULT false,
  adopter_number INTEGER, -- 1st, 2nd, 3rd merchant, etc.

  -- Timestamps & Audit
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP NULL,
  verified_by_email VARCHAR(255), -- Admin who verified
  published_at TIMESTAMP NULL,
  last_edited_at TIMESTAMP NULL,

  -- Constraints
  CONSTRAINT unique_location UNIQUE (latitude, longitude),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'published'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes
CREATE INDEX idx_merchant_status ON merchant_submissions(status);
CREATE INDEX idx_merchant_email ON merchant_submissions(contact_email);
CREATE INDEX idx_merchant_submitted_at ON merchant_submissions(submitted_at DESC);
CREATE INDEX idx_merchant_edit_token ON merchant_submissions(edit_token);
CREATE INDEX idx_merchant_osm_node ON merchant_submissions(osm_node_id);

-- Admin Activity Log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id CHAR(36) PRIMARY KEY,
  merchant_submission_id CHAR(36),
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'approved', 'rejected', 'edited', 'published'
  details TEXT,
  ip_address VARCHAR(45), -- Supports IPv4 and IPv6
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (merchant_submission_id) REFERENCES merchant_submissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_admin_activity_merchant ON admin_activity_log(merchant_submission_id);
CREATE INDEX idx_admin_activity_date ON admin_activity_log(created_at DESC);

-- View for admin dashboard statistics
CREATE OR REPLACE VIEW merchant_submission_stats AS
SELECT
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
  SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
  SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_count,
  SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
  SUM(CASE WHEN is_early_adopter = true THEN 1 ELSE 0 END) as early_adopters_count,
  SUM(CASE WHEN submitted_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as submissions_last_7_days,
  SUM(CASE WHEN submitted_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as submissions_last_30_days
FROM merchant_submissions;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'super_admin', 'reviewer'
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_admin_email (email),
  INDEX idx_admin_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: 'changeme123' - CHANGE THIS IN PRODUCTION)
-- Password hash generated with bcrypt, rounds=10
INSERT IGNORE INTO admin_users (id, email, password_hash, name, role)
VALUES (
  UUID(),
  'admin@afribit.co.ke',
  '$2a$10$rXZvLhqJ5vZVGJmN5nZ5Y.XqKZJYx8qmP0YZqJxKZqJxKZqJxKZqJ',
  'Admin User',
  'super_admin'
);
