BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MerchantOpenStatus') THEN
    CREATE TYPE "MerchantOpenStatus" AS ENUM ('UNKNOWN', 'OPEN', 'CLOSED', 'MOVED', 'TEMPORARILY_CLOSED');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MerchantBitcoinStatus') THEN
    CREATE TYPE "MerchantBitcoinStatus" AS ENUM ('UNKNOWN', 'ACCEPTS', 'DOES_NOT_ACCEPT');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MerchantVerificationMethod') THEN
    CREATE TYPE "MerchantVerificationMethod" AS ENUM (
      'ONSITE_SURVEY',
      'PHONE',
      'EMAIL',
      'WEBSITE',
      'SOCIAL_MEDIA',
      'COMMUNITY_REPORT',
      'OSM_SYNC',
      'CSV_IMPORT',
      'OTHER'
    );
  END IF;
END $$;

ALTER TABLE "merchants"
  ADD COLUMN IF NOT EXISTS "btcpayStoreId" text,
  ADD COLUMN IF NOT EXISTS "btcpayUrl" text,
  ADD COLUMN IF NOT EXISTS "osmNodeId" text,
  ADD COLUMN IF NOT EXISTS "osmUrl" text,
  ADD COLUMN IF NOT EXISTS "osmChangesetId" text,
  ADD COLUMN IF NOT EXISTS "osmSourceRef" text,
  ADD COLUMN IF NOT EXISTS "openStatus" "MerchantOpenStatus" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS "bitcoinStatus" "MerchantBitcoinStatus" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS "paymentLightningEnabled" boolean,
  ADD COLUMN IF NOT EXISTS "paymentOnchainEnabled" boolean,
  ADD COLUMN IF NOT EXISTS "paymentLightningContactlessEnabled" boolean,
  ADD COLUMN IF NOT EXISTS "openingHours" text,
  ADD COLUMN IF NOT EXISTS "lastVerifiedAt" timestamp(3),
  ADD COLUMN IF NOT EXISTS "lastSurveyedAt" timestamp(3),
  ADD COLUMN IF NOT EXISTS "lastVerificationMethod" "MerchantVerificationMethod",
  ADD COLUMN IF NOT EXISTS "lastVerifiedById" text,
  ADD COLUMN IF NOT EXISTS "lastVerifiedByName" text,
  ADD COLUMN IF NOT EXISTS "verificationNotes" text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'merchants_lastVerifiedById_fkey'
  ) THEN
    ALTER TABLE "merchants"
      ADD CONSTRAINT "merchants_lastVerifiedById_fkey"
      FOREIGN KEY ("lastVerifiedById") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "merchant_verification_checks" (
  "id" text PRIMARY KEY,
  "merchantId" text NOT NULL,
  "checkedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "surveyDate" timestamp(3),
  "verificationMethod" "MerchantVerificationMethod" NOT NULL,
  "checkedByUserId" text,
  "checkedByName" text,
  "openStatus" "MerchantOpenStatus" NOT NULL DEFAULT 'UNKNOWN',
  "bitcoinStatus" "MerchantBitcoinStatus" NOT NULL DEFAULT 'UNKNOWN',
  "paymentLightningEnabled" boolean,
  "paymentOnchainEnabled" boolean,
  "paymentLightningContactlessEnabled" boolean,
  "correctName" boolean,
  "correctPhone" boolean,
  "correctAddress" boolean,
  "correctCategory" boolean,
  "openingHours" text,
  "notes" text,
  "osmNodeId" text,
  "osmUrl" text,
  "osmChangesetId" text,
  "osmVersion" integer,
  "osmTimestamp" timestamp(3),
  "rawOSMTags" jsonb,
  "sourceRef" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'merchant_verification_checks_merchantId_fkey'
  ) THEN
    ALTER TABLE "merchant_verification_checks"
      ADD CONSTRAINT "merchant_verification_checks_merchantId_fkey"
      FOREIGN KEY ("merchantId") REFERENCES "merchants"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'merchant_verification_checks_checkedByUserId_fkey'
  ) THEN
    ALTER TABLE "merchant_verification_checks"
      ADD CONSTRAINT "merchant_verification_checks_checkedByUserId_fkey"
      FOREIGN KEY ("checkedByUserId") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "merchants_osmNodeId_key"
  ON "merchants"("osmNodeId")
  WHERE "osmNodeId" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "merchants_openStatus_idx" ON "merchants"("openStatus");
CREATE INDEX IF NOT EXISTS "merchants_bitcoinStatus_idx" ON "merchants"("bitcoinStatus");
CREATE INDEX IF NOT EXISTS "merchants_lastVerifiedAt_idx" ON "merchants"("lastVerifiedAt");

CREATE INDEX IF NOT EXISTS "merchant_verification_checks_merchantId_checkedAt_idx"
  ON "merchant_verification_checks"("merchantId", "checkedAt");
CREATE INDEX IF NOT EXISTS "merchant_verification_checks_surveyDate_idx"
  ON "merchant_verification_checks"("surveyDate");
CREATE INDEX IF NOT EXISTS "merchant_verification_checks_openStatus_idx"
  ON "merchant_verification_checks"("openStatus");
CREATE INDEX IF NOT EXISTS "merchant_verification_checks_bitcoinStatus_idx"
  ON "merchant_verification_checks"("bitcoinStatus");
CREATE INDEX IF NOT EXISTS "merchant_verification_checks_osmNodeId_idx"
  ON "merchant_verification_checks"("osmNodeId");
CREATE UNIQUE INDEX IF NOT EXISTS "merchant_verification_checks_merchantId_osmNodeId_osmVersion_key"
  ON "merchant_verification_checks"("merchantId", "osmNodeId", "osmVersion");

COMMIT;