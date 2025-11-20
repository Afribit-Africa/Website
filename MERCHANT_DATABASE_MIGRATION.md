# Merchant Database Migration Guide

## Overview
The hardcoded 40+ merchants from `lib/merchants-data.ts` have been migrated to the database for full CRUD operations through the admin panel.

## What Changed

### Before
- Merchants were hardcoded in `lib/merchants-data.ts`
- No admin control over merchant data
- Maps page (`/maps`) loaded from static file

### After
- All merchants stored in `merchant_submissions` table
- Admin can perform CRUD operations on all merchants
- Maps page fetches from database via `/api/merchants`
- Legacy merchants marked as "Early Adopters" with status "published"

## Import Legacy Merchants

### Option 1: Using API Endpoint (Recommended)
Run this command to import all 41 hardcoded merchants:

```bash
curl -X POST https://afribit.africa/api/admin/merchants/import \
  -H "Cookie: your-admin-session-cookie" \
  -H "Content-Type: application/json"
```

Or use this PowerShell command:
```powershell
Invoke-WebRequest -Uri "https://afribit.africa/api/admin/merchants/import" `
  -Method POST `
  -UseBasicParsing `
  -WebSession $session
```

**Note:** You must be logged in as admin. The endpoint checks authentication.

### Option 2: Using Node Script
```bash
node scripts/migrate-merchants.js
```

**Note:** This script only has 10 merchants as examples. Use the API endpoint (Option 1) to import all 41 merchants.

## API Endpoints

### Get All Published Merchants
```
GET /api/merchants
```

Query parameters:
- `category` - Filter by category (optional)
- `search` - Search by business name, location, owner (optional)

Response:
```json
{
  "success": true,
  "merchants": [...],
  "count": 41
}
```

### Import Legacy Merchants (Admin Only)
```
POST /api/admin/merchants/import
```

Response:
```json
{
  "success": true,
  "message": "Merchant import completed",
  "stats": {
    "total": 41,
    "inserted": 41,
    "skipped": 0,
    "errors": 0
  }
}
```

## Admin CRUD Operations

### View All Merchants
Navigate to: `https://afribit.africa/admin/merchants`

### Manage Individual Merchant
Navigate to: `https://afribit.africa/admin/merchants/manage`

### View Submissions
Navigate to: `https://afribit.africa/admin/submissions`

## Database Schema

Merchants are stored in `merchant_submissions` table with these key fields:
- `id` - UUID
- `business_name` - Merchant business name
- `category_key` / `category_value` - OSM category mapping
- `latitude` / `longitude` - GPS coordinates
- `lightning_address` - Blink/Lightning address
- `contact_name` / `contact_email` - Owner information
- `status` - pending, approved, published, rejected
- `is_early_adopter` - Boolean (all legacy merchants = true)
- `adopter_number` - Sequential number for early adopters

## Migration Process

1. **Check existing merchants:**
   ```bash
   node scripts/check-db-schema.js
   ```

2. **Import legacy merchants:**
   - Log in to admin panel
   - Call import API endpoint
   - Verify merchants appear in admin panel

3. **Verify maps page:**
   - Visit `https://afribit.africa/maps`
   - Should show all imported merchants
   - Search and filter should work

## Rollback

If you need to rollback, the hardcoded data still exists in `lib/merchants-data.ts`. Just revert the maps page changes to use `MERCHANTS` import instead of fetching from API.

## Next Steps

1. Import all legacy merchants using the API endpoint
2. Verify all merchants appear on maps page
3. Test CRUD operations in admin panel
4. Future merchants will be added through:
   - Public registration form (`/register`)
   - Admin manual entry
   - Verifier approvals

## Notes

- Legacy merchants are automatically marked as "Early Adopters"
- All legacy merchants have status "published" (already verified)
- Adopter numbers are assigned sequentially based on submission date
- The import is idempotent - running it multiple times won't create duplicates
