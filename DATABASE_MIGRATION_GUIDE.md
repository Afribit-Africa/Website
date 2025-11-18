# Database Migration Guide - Lightning Address

## Migration Required
A new column `lightning_address` needs to be added to the `merchant_submissions` table.

## Option 1: Run SQL Directly (Recommended for Production)

Access your production database (Vercel Postgres) and run:

```sql
-- Add lightning_address column
ALTER TABLE merchant_submissions 
ADD COLUMN lightning_address VARCHAR(255) NULL 
AFTER payment_lightning_contactless;

-- Add index for performance
CREATE INDEX idx_lightning_address ON merchant_submissions(lightning_address);

-- Verify
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'merchant_submissions' 
AND COLUMN_NAME = 'lightning_address';
```

## Option 2: Via Vercel Dashboard

1. Go to your Vercel project
2. Navigate to Storage → Your Postgres Database
3. Click "Query" tab
4. Paste and execute the SQL above

## Option 3: TypeScript Migration Script

If you have DATABASE_URL configured locally:

```bash
# Set environment variable
export DATABASE_URL="your_postgres_connection_string"

# Run migration
npx tsx scripts/add-lightning-address-column.ts
```

## Verification

After migration, test:

```sql
-- Check structure
DESCRIBE merchant_submissions;

-- Test insert (should not error)
SELECT id, business_name, lightning_address 
FROM merchant_submissions 
LIMIT 5;
```

## Rollback (if needed)

```sql
-- Remove column
ALTER TABLE merchant_submissions DROP COLUMN lightning_address;

-- Remove index
DROP INDEX idx_lightning_address ON merchant_submissions;
```

## Notes

- Column is **nullable** - backwards compatible
- Existing submissions will have NULL lightning_address
- New submissions can include Lightning address
- Edit API supports updating Lightning addresses
- No data loss - safe migration
