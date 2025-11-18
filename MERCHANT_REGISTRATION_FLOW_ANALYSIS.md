# Merchant Registration Flow - Complete Analysis

## Flow Overview
```
Merchant Registration → Database Submission → Verifier Verification → Admin Approval → OSM Publishing → BTCMap Integration
```

---

## 1. MERCHANT REGISTRATION (Frontend)
**File:** `app/merchants/register/page.tsx`

### Form Fields:
✅ **Step 1 - Business Info:**
- businessName (required)
- categoryValue (required)
- description (optional)

✅ **Step 2 - Location:**
- latitude/longitude (default: Kibera coordinates)
- address (required)
- Interactive map for precise location

✅ **Step 3 - Payment Methods:**
- paymentOnchain (checkbox)
- paymentLightning (checkbox)
- paymentLightningContactless (checkbox)
- **NEW:** lightningAddress (optional) ✨
- phone (optional)
- website (optional)

✅ **Step 4 - Contact:**
- contactName (required)
- contactEmail (required)
- contactRelationship (owner/manager/staff/other)

### Validation:
- All required fields validated per step
- At least one payment method required
- Valid coordinates (-90 to 90, -180 to 180)
- Email format validation

---

## 2. SUBMISSION API ENDPOINT
**File:** `app/api/merchants/submit/route.ts`

### Security Features:
✅ **Rate Limiting:**
- IP-based rate limiting using Upstash Redis
- Limits submissions per IP address
- Returns 429 with retry-after headers

✅ **Input Sanitization:**
- `sanitizeText()` - Business name, category, contact info
- `sanitizeEmail()` - Email validation
- `sanitizeUrl()` - Website, social media links
- `sanitizePhone()` - Phone number formatting
- `sanitizeHtml()` - Description (allows safe HTML)

### Database Insertion:
✅ **Table:** `merchant_submissions`
- Generates UUID for submission_id
- Generates edit_token (for merchant to edit later)
- Status: 'pending'
- is_early_adopter: false
- Stores all form data with sanitization

### Post-Submission Actions:
✅ **Email Confirmations:**
1. **To Merchant:** Submission confirmation with edit link
   - Function: `sendMerchantSubmissionConfirmation()`
   - Includes: submissionId, editToken for editing

2. **To Admin:** New submission notification
   - Function: `sendAdminNotificationEmail()`
   - Includes: Business details, location, contact info

### Issues Found:
✅ **FIXED:** Lightning address field now properly saved to database
- Form has `lightningAddress` field
- API endpoint sanitizes and saves it
- Database schema includes `lightning_address VARCHAR(255)`
- Edit API supports updating lightning address

---

## 3. MERCHANT EDIT FUNCTIONALITY
**Files:**
- `app/merchants/edit/[id]/page.tsx` (Frontend)
- `app/api/merchants/edit/[id]/route.ts` (Backend)

### Features:
✅ **Secure Edit Access:**
- Requires submissionId + editToken
- Token verification before allowing edits

✅ **GET Request:**
- Fetches submission by ID and token
- Returns all merchant data for editing

✅ **PUT Request:**
- Updates submission with new data
- Sanitizes all inputs again
- Maintains same security validations

---

## 4. VERIFIER SYSTEM
**Files:**
- `app/verifier/verify/[id]/page.tsx`
- `app/api/verifier/submit-verification/route.ts`
- `app/api/verifier/submission/[id]/route.ts`

### Verification Process:
✅ **Location Verification:**
- Gets verifier's GPS location
- Calculates distance to merchant location
- Uses Haversine formula for accuracy

✅ **Photo Evidence:**
- Supports multiple photo uploads
- Photos stored as evidence

✅ **Verification Results:**
- verified / not_found / closed / incorrect_info

✅ **Database Updates:**
- Updates `verification_status` in merchant_submissions
- Logs verification attempt
- Stores verifier info and photos

---

## 5. ADMIN APPROVAL FLOW
**Files:**
- `app/api/admin/submissions/approve/route.ts`
- `app/api/admin/submissions/reject/route.ts`
- `app/admin/submissions/page.tsx`

### Approval Process:
✅ **Admin Authentication:**
- Requires active session
- Checks for admin role

✅ **Verification Requirement:**
```typescript
if (submission.verification_status !== 'verified') {
  return NextResponse.json(
    { error: 'Submission must be verified by a verifier before approval' },
    { status: 400 }
  );
}
```
⚠️ **Issue:** Admin cannot approve without verifier verification
- **Good for quality** but may block legitimate submissions
- **Consider:** Admin override option for trusted submissions

✅ **Approval Actions:**
- Status: 'pending' → 'approved'
- Sets `approved_at` timestamp
- Logs admin activity
- Sends approval email to merchant

✅ **Rejection Actions:**
- Status: 'pending' → 'rejected'
- Requires rejection reason
- Sends rejection email with reason
- Logs rejection in activity log

---

## 6. OSM PUBLISHING
**Files:**
- `app/api/quantum-verify/publish/route.ts`
- `lib/osm-client.ts`
- `lib/osm-publisher.ts`

### Prerequisites:
⚠️ **CRITICAL - Environment Variable Required:**
```
OSM_ACCESS_TOKEN=your_oauth_token_here
```

### Publishing Process:
✅ **Status Check:**
- Must be 'approved' status
- Cannot publish 'pending', 'rejected', or already 'published'

✅ **OSM Node Creation:**
```typescript
const result = await publishMerchantToOSM(submission);
// Returns: { nodeId, changesetId }
```

✅ **OSM Tags Added:**
- `name` - Business name
- `amenity` or `shop` - Category
- `payment:bitcoin` = 'yes'
- `payment:lightning` = 'yes' (if enabled)
- `payment:onchain` = 'yes' (if enabled)
- `payment:lightning_contactless` = 'yes' (if enabled)
- `currency:XBT` = 'yes'
- `contact:phone`, `contact:website`, etc.
- `source` = 'Afribit Community Survey'

✅ **Database Updates:**
- Status: 'approved' → 'published'
- Stores `osm_node_id`
- Stores `osm_changeset_id`
- Sets `published_at` timestamp

✅ **Post-Publish Email:**
- Notifies merchant of successful publishing
- Includes OSM node ID and BTCMap link

### Error Handling:
✅ **Graceful Failures:**
- Logs failed publish attempts
- Returns detailed error messages
- Doesn't break if email fails

---

## 7. BTCMAP INTEGRATION

### How BTCMap Works:
BTCMap automatically discovers Bitcoin merchants from OpenStreetMap by:
1. Scanning OSM for nodes with `payment:bitcoin=yes`
2. Indexing merchants with `currency:XBT=yes`
3. Updating their database periodically

### Our Integration:
✅ **Automatic Discovery:**
- Once published to OSM, BTCMap will discover it
- No direct API call needed
- Usually appears within 24-48 hours

✅ **BTCMap URL Generation:**
```typescript
btcmapUrl: `https://btcmap.org/merchant/${nodeId}`
```

⚠️ **No Real-Time Sync:**
- BTCMap doesn't have a submission API
- Relies on OSM sync schedule
- Cannot force immediate indexing

---

## 8. ADMIN MERCHANT MANAGEMENT
**Files:**
- `app/api/admin/merchants/list/route.ts`
- `app/api/admin/merchants/[id]/route.ts`

### Admin Capabilities:
✅ **List All Merchants:**
- GET `/api/admin/merchants/list`
- Returns all submissions with status

✅ **Manual Merchant Addition:**
- POST `/api/admin/merchants/list`
- Admin can add merchants directly (bypasses verification)

✅ **Edit Merchant:**
- PATCH `/api/admin/merchants/[id]`
- Update any field
- Full CRUD control

✅ **Delete Merchant:**
- DELETE `/api/admin/merchants/[id]`
- Soft delete or hard delete from database

---

## ISSUES IDENTIFIED

### 🔴 CRITICAL ISSUES:

1. **Lightning Address Not Saved**
   - Form collects `lightningAddress`
   - API doesn't save it to database
   - **Fix:** Add column and save logic

2. **OSM Token Required**
   - Publishing fails without `OSM_ACCESS_TOKEN`
   - No fallback or guidance
   - **Fix:** Add setup documentation or manual review option

3. **Mandatory Verifier Approval**
   - Admin cannot approve without verifier verification
   - May block legitimate submissions
   - **Fix:** Add admin override option

### 🟡 MEDIUM ISSUES:

4. **No BTCMap Direct Sync**
   - Relies on BTCMap's OSM sync schedule
   - 24-48 hour delay
   - **Note:** This is BTCMap's limitation, not ours

5. **Email Failures Don't Block Flow**
   - Good for UX but admin might not know about new submissions
   - **Consider:** Retry queue or admin notification dashboard

6. **No Merchant Dashboard**
   - Merchants can only edit via email link
   - No login/dashboard for merchants to track status
   - **Enhancement:** Create merchant portal

### 🟢 MINOR ISSUES:

7. **Rate Limiting Requires Redis**
   - Falls back gracefully if Redis unavailable
   - But no rate limiting in fallback mode
   - **OK:** Redis should be in production

---

## DATABASE SCHEMA REQUIRED

### ✅ Lightning Address Column:
```sql
ALTER TABLE merchant_submissions
ADD COLUMN lightning_address VARCHAR(255) NULL
AFTER payment_lightning_contactless;
```
**Status:** Fixed - Column added to schema, migration scripts created

### Verification Table (should exist):
```sql
CREATE TABLE IF NOT EXISTS merchant_verifications (
  id VARCHAR(36) PRIMARY KEY,
  submission_id VARCHAR(36),
  verifier_email VARCHAR(255),
  verification_result VARCHAR(50),
  verifier_latitude DECIMAL(10, 8),
  verifier_longitude DECIMAL(11, 8),
  distance_meters DECIMAL(10, 2),
  photo_urls TEXT,
  notes TEXT,
  verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES merchant_submissions(id)
);
```

---

## API ENDPOINT SUMMARY

### Public Endpoints:
- `POST /api/merchants/submit` - Submit new merchant
- `GET /api/merchants/edit/[id]?token=xxx` - Get submission for editing
- `PUT /api/merchants/edit/[id]?token=xxx` - Update submission

### Verifier Endpoints (Auth Required):
- `GET /api/verifier/submission/[id]` - Get submission details
- `POST /api/verifier/submit-verification` - Submit verification
- `GET /api/verifier/nearby-submissions` - Get submissions near verifier

### Admin Endpoints (Auth Required):
- `GET /api/admin/submissions` - List all submissions
- `POST /api/admin/submissions/approve` - Approve submission
- `POST /api/admin/submissions/reject` - Reject submission
- `POST /api/quantum-verify/publish` - Publish to OSM
- `GET /api/admin/merchants/list` - List all merchants
- `POST /api/admin/merchants/list` - Manually add merchant
- `PATCH /api/admin/merchants/[id]` - Edit merchant
- `DELETE /api/admin/merchants/[id]` - Delete merchant

---

## TESTING CHECKLIST

### ✅ Works:
- [x] Merchant registration form
- [x] Input sanitization
- [x] Rate limiting
- [x] Email confirmations
- [x] Database insertion
- [x] Edit functionality
- [x] Verifier verification
- [x] Admin approval/rejection
- [x] OSM publishing (if token configured)
- [x] Activity logging
- [x] CRUD operations

### ⚠️ Needs Fix:
- [ ] Save lightning address to database
- [ ] Add OSM token setup guide
- [ ] Admin override for verifier requirement
- [ ] Merchant status dashboard

### 📝 Enhancement Opportunities:
- [ ] Merchant login portal
- [ ] Real-time status tracking
- [ ] Bulk merchant operations
- [ ] Advanced filtering/search
- [ ] Analytics dashboard

---

## CONCLUSION

### Overall Assessment: **85/100** ✅

**Strengths:**
- ✅ Complete registration flow
- ✅ Strong security (sanitization, rate limiting, auth)
- ✅ Verifier system for quality control
- ✅ Admin approval workflow
- ✅ OSM integration working
- ✅ Email notifications
- ✅ Edit functionality

**Critical Fixes Needed:**
1. Save lightning address field
2. Handle OSM token missing gracefully
3. Allow admin override for verifier requirement

**The flow works end-to-end** but needs these fixes for production readiness.
