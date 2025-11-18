# Lightning Address Fix - Complete Implementation

## Issue Summary
The merchant registration form collected Lightning addresses but the API did not save them to the database.

## Fix Applied

### 1. Database Schema Updated
**File:** `lib/db-schema.sql`

Added `lightning_address` column:
```sql
-- Bitcoin Payment Methods
payment_onchain BOOLEAN DEFAULT false,
payment_lightning BOOLEAN DEFAULT false,
payment_lightning_contactless BOOLEAN DEFAULT false,
lightning_address VARCHAR(255), -- Lightning address like user@blink.sv
```

### 2. Submit API Updated
**File:** `app/api/merchants/submit/route.ts`

**Added sanitization:**
```typescript
lightningAddress: body.lightningAddress ? sanitizeEmail(body.lightningAddress) : null,
```

**Added to INSERT query:**
```sql
INSERT INTO merchant_submissions (
  ...
  payment_onchain, payment_lightning, payment_lightning_contactless,
  lightning_address,
  contact_name, contact_email, contact_relationship,
  ...
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ...)
```

### 3. Edit API Updated
**File:** `app/api/merchants/edit/[id]/route.ts`

**Added update logic:**
```typescript
if (updateData.lightningAddress !== undefined) {
  updateFields.push('lightning_address = ?');
  updateValues.push(updateData.lightningAddress);
}
```

### 4. Migration Scripts Created

#### SQL Migration
**File:** `scripts/add-lightning-address-column.sql`
```sql
ALTER TABLE merchant_submissions
ADD COLUMN IF NOT EXISTS lightning_address VARCHAR(255) NULL
AFTER payment_lightning_contactless;

CREATE INDEX IF NOT EXISTS idx_lightning_address ON merchant_submissions(lightning_address);
```

#### TypeScript Migration
**File:** `scripts/add-lightning-address-column.ts`
```bash
npx ts-node scripts/add-lightning-address-column.ts
```

Features:
- Adds column if not exists
- Creates index for performance
- Verifies migration success
- Handles errors gracefully (already exists)

## Testing Checklist

### ✅ Before Deployment
- [ ] Run migration script on staging database
- [ ] Verify column exists: `DESCRIBE merchant_submissions;`
- [ ] Test merchant registration with Lightning address
- [ ] Verify data saved: `SELECT lightning_address FROM merchant_submissions WHERE id = ?;`
- [ ] Test edit functionality with Lightning address
- [ ] Test empty/null Lightning address (should be allowed)

### ✅ Test Cases

**1. Submit with Lightning Address:**
```json
{
  "businessName": "Test Cafe",
  "lightningAddress": "testcafe@blink.sv",
  ...
}
```
Expected: Saved to database

**2. Submit without Lightning Address:**
```json
{
  "businessName": "Test Shop",
  "lightningAddress": "",
  ...
}
```
Expected: NULL in database, no errors

**3. Edit Lightning Address:**
```json
{
  "token": "edit-token-here",
  "lightningAddress": "updated@getalby.com"
}
```
Expected: Updated in database

**4. Invalid Lightning Address:**
```json
{
  "lightningAddress": "not-an-email"
}
```
Expected: Sanitization handles it (email format validation)

## Deployment Steps

### 1. Apply Database Migration
```bash
# Option A: Direct SQL
mysql -u username -p database_name < scripts/add-lightning-address-column.sql

# Option B: TypeScript script
npx ts-node scripts/add-lightning-address-column.ts
```

### 2. Deploy Code Changes
```bash
git add .
git commit -m "Fix: Add lightning_address field to merchant registration"
git push origin main
```

### 3. Verify in Production
```sql
-- Check column exists
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'merchant_submissions'
AND COLUMN_NAME = 'lightning_address';

-- Test query
SELECT id, business_name, lightning_address
FROM merchant_submissions
ORDER BY submitted_at DESC
LIMIT 5;
```

## Impact

### ✅ Fixes
- Merchants can now provide Lightning addresses
- Lightning addresses are saved and retrievable
- Edit functionality includes Lightning address
- Proper sanitization prevents invalid data

### ✅ User Experience
- Wallet recommendations displayed (Blink, Fedi, Muun)
- Optional field (not required)
- Email-like format expected (user@domain.com)
- Helps other users send tips/payments to merchants

### ✅ Database Integrity
- Column nullable (backwards compatible)
- Index added for performance
- Migration scripts handle existing databases
- No data loss

## Related Files Modified

1. `lib/db-schema.sql` - Database schema
2. `app/api/merchants/submit/route.ts` - Submission API
3. `app/api/merchants/edit/[id]/route.ts` - Edit API
4. `scripts/add-lightning-address-column.sql` - SQL migration
5. `scripts/add-lightning-address-column.ts` - TypeScript migration
6. `MERCHANT_REGISTRATION_FLOW_ANALYSIS.md` - Updated documentation

## Next Steps

1. **Test on staging environment**
2. **Run migration on production database**
3. **Deploy code to production**
4. **Monitor first submissions with Lightning addresses**
5. **Consider adding Lightning address validation** (future enhancement)
   - Verify address format: `username@domain.tld`
   - Optional: Test Lightning address is reachable
   - Optional: Show Lightning QR code on merchant pages

## Notes

- Lightning address format follows email format (user@domain.com)
- Common providers: Blink (blink.sv), Alby (getalby.com), Fedi (fedi.xyz), Muun (muun.com)
- Field is optional - not all merchants may have one
- Sanitization uses `sanitizeEmail()` for format validation
- Can be displayed on merchant detail pages for users to send tips

---

**Status:** ✅ Fixed and ready for deployment
**Priority:** HIGH - User-reported issue
**Risk:** LOW - Backwards compatible, optional field
