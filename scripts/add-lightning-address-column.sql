-- Migration: Add lightning_address column to merchant_submissions table
-- Date: 2024
-- Description: Add Lightning address field to support merchant Lightning addresses

-- Add lightning_address column if it doesn't exist
ALTER TABLE merchant_submissions
ADD COLUMN IF NOT EXISTS lightning_address VARCHAR(255) NULL
AFTER payment_lightning_contactless;

-- Add index for lightning address lookups
CREATE INDEX IF NOT EXISTS idx_lightning_address ON merchant_submissions(lightning_address);

-- Verify column was added
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'merchant_submissions' AND COLUMN_NAME = 'lightning_address';
