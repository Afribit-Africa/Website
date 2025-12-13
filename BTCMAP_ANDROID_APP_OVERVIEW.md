# BTCMap Merchant Registration App - Technical Overview

## Project Vision
Open-source, GPS-first Android app for registering Bitcoin-accepting merchants directly to BTCMap/OpenStreetMap. Designed for circular economy organizations worldwide to map their local Bitcoin merchant networks.

## Core Concept
**GPS-First Registration Flow:**
1. Walk to merchant location
2. App automatically captures GPS coordinates
3. Fill basic merchant details
4. Submit → Publishes to OSM → Auto-syncs to BTCMap within 24-48 hours
5. Validators verify location accuracy using GPS

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ANDROID APP (Kotlin)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │  GPS Tracker     │  │  Camera          │  │  Forms    │ │
│  │  - Location      │  │  - Photo capture │  │  - Wizard │ │
│  │  - Accuracy      │  │  - Verification  │  │  - Valida │ │
│  │  - Real-time     │  │  - Evidence      │  │    -tion  │ │
│  └──────────────────┘  └──────────────────┘  └───────────┘ │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Local SQLite Database                       │   │
│  │  - Offline draft storage                              │   │
│  │  - Queue for syncing when online                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                        │
│              (Node.js/Express or Python/FastAPI)             │
├─────────────────────────────────────────────────────────────┤
│  Endpoints:                                                   │
│  • POST /api/merchants/register                              │
│  • POST /api/merchants/verify                                │
│  • GET  /api/merchants/pending                               │
│  • POST /api/merchants/publish-to-osm                        │
│  • GET  /api/config/settings (org-specific configs)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────┐                  ┌──────────────────┐
│  MYSQL DATABASE  │                  │  OPENSTREETMAP   │
│  (Organization)  │                  │   API (OAuth2)   │
│                  │                  │                  │
│  • Merchants     │                  │  • Create nodes  │
│  • Verifications │                  │  • Changesets    │
│  • Photos        │                  │  • Tags          │
│  • Users/Roles   │                  └──────────────────┘
└──────────────────┘                           ↓
                                    ┌──────────────────┐
                                    │     BTCMap       │
                                    │  (Auto-sync in   │
                                    │   24-48 hours)   │
                                    └──────────────────┘
```

---

## Key Features

### 1. GPS-First Registration
**User Flow:**
```
1. User opens app → Requests GPS permission
2. App shows live GPS accuracy indicator
   - Green: <10m (excellent)
   - Yellow: 10-20m (good)
   - Red: >20m (wait for better signal)
3. When accuracy is sufficient, "Register Merchant" button activates
4. User fills form with GPS coordinates pre-populated
5. Takes photo of merchant storefront (optional but recommended)
6. Submits → Saved to backend with "pending_verification" status
```

**GPS Features:**
- Real-time coordinate display
- Accuracy meter (in meters)
- Satellite count indicator
- Option to manually adjust pin on map if GPS drifts
- Altitude recording (helps with verification)
- Timestamp of GPS capture

### 2. Merchant Registration Form
**Required Fields:**
- Business Name
- Category (dropdown: restaurant, shop, cafe, salon, service, etc.)
- GPS Coordinates (auto-captured)
- Lightning Address (if available)
- Payment Methods (checkboxes: Lightning, On-chain, Contactless)

**Optional Fields:**
- Operator Name
- Phone Number
- Email
- Website
- Opening Hours
- Description/Products
- Photos (storefront, payment setup)

### 3. Verification System
**Validator App Mode:**
- List of pending merchants (sorted by distance from validator's current location)
- Navigate to merchant location using GPS
- When within 20m radius:
  - Verify business exists
  - Confirm Bitcoin acceptance
  - Take verification photo
  - Mark as "verified" or "rejected" with notes
- GPS distance tracking ensures physical verification

**Verification Statuses:**
- `pending_verification` - Submitted, awaiting validator
- `merchant_verified` - Validator confirmed location + Bitcoin acceptance
- `merchant_confirmed` - Ready for OSM publication
- `published` - Live on OSM/BTCMap
- `rejected` - Validator found issues

### 4. Multi-Organization Support
**Settings Configuration (per organization):**
```json
{
  "organization_name": "Afribit Africa",
  "organization_id": "afribit-kenya",
  "api_base_url": "https://afribit.africa/api",
  "database_endpoint": "https://afribit.africa/api/merchants",
  "osm_oauth": {
    "client_id": "your-osm-app-client-id",
    "client_secret": "encrypted-secret",
    "redirect_uri": "afribitapp://oauth/callback"
  },
  "btcmap_community": "afribit-kibera",
  "default_region": {
    "latitude": -1.316,
    "longitude": 36.776,
    "radius_km": 10
  },
  "verification_required": true,
  "auto_publish": false,
  "branding": {
    "logo_url": "https://afribit.africa/logo.png",
    "primary_color": "#F7931A",
    "app_name": "Afribit Merchant Mapper"
  }
}
```

**How Organizations Connect:**
1. Download open-source app
2. Enter organization API endpoint in settings
3. App fetches configuration from `/api/config/settings`
4. User authenticates with organization credentials
5. App uses organization's database + OSM keys for all operations

---

## Database Schema

### Merchants Table
```sql
CREATE TABLE merchants (
  id VARCHAR(36) PRIMARY KEY,
  organization_id VARCHAR(50) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  category_key VARCHAR(50) NOT NULL,
  category_value VARCHAR(50) NOT NULL,

  -- GPS Data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  altitude DECIMAL(8, 2),
  gps_accuracy DECIMAL(6, 2),
  gps_timestamp DATETIME,

  -- Contact & Payment
  operator_name VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  lightning_address VARCHAR(255),
  payment_lightning BOOLEAN DEFAULT FALSE,
  payment_onchain BOOLEAN DEFAULT FALSE,
  payment_contactless BOOLEAN DEFAULT FALSE,

  -- Details
  description TEXT,
  opening_hours TEXT,
  address TEXT,

  -- Metadata
  status ENUM('pending_verification', 'merchant_verified', 'merchant_confirmed', 'published', 'rejected'),
  osm_node_id BIGINT,
  btcmap_synced BOOLEAN DEFAULT FALSE,

  -- Tracking
  submitted_by VARCHAR(36),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  verified_by VARCHAR(36),
  verified_at DATETIME,
  published_at DATETIME,

  INDEX idx_status (status),
  INDEX idx_org (organization_id),
  INDEX idx_location (latitude, longitude)
);
```

### Verifications Table
```sql
CREATE TABLE verifications (
  id VARCHAR(36) PRIMARY KEY,
  merchant_id VARCHAR(36) NOT NULL,
  validator_id VARCHAR(36) NOT NULL,

  -- Verification GPS
  validator_latitude DECIMAL(10, 8) NOT NULL,
  validator_longitude DECIMAL(11, 8) NOT NULL,
  distance_from_merchant DECIMAL(8, 2), -- meters

  -- Verification Result
  status ENUM('verified', 'rejected', 'needs_correction'),
  bitcoin_confirmed BOOLEAN,
  business_exists BOOLEAN,
  notes TEXT,

  -- Evidence
  photo_url VARCHAR(500),
  verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  FOREIGN KEY (validator_id) REFERENCES users(id)
);
```

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  organization_id VARCHAR(50) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),

  role ENUM('registrar', 'validator', 'admin') DEFAULT 'registrar',

  -- Stats
  merchants_registered INT DEFAULT 0,
  merchants_verified INT DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,

  INDEX idx_org (organization_id)
);
```

### Photos Table
```sql
CREATE TABLE merchant_photos (
  id VARCHAR(36) PRIMARY KEY,
  merchant_id VARCHAR(36) NOT NULL,
  uploaded_by VARCHAR(36) NOT NULL,

  photo_type ENUM('storefront', 'payment_setup', 'menu', 'verification', 'other'),
  file_url VARCHAR(500) NOT NULL,
  file_size INT,

  -- GPS of photo location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);
```

---

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token
GET  /api/auth/osm/authorize
POST /api/auth/osm/callback
```

### Merchant Registration
```
POST   /api/merchants/register
  Body: {
    business_name, category, latitude, longitude,
    gps_accuracy, lightning_address, payment_methods,
    photos (base64 or multipart), ...
  }
  Returns: { merchant_id, status }

GET    /api/merchants/pending
  Query: ?organization_id, ?near_lat, ?near_lon, ?radius_km
  Returns: Array of merchants needing verification

GET    /api/merchants/{id}
  Returns: Full merchant details + verification history

PUT    /api/merchants/{id}
  Body: Updated merchant data
  Auth: Admin or original submitter only
```

### Verification
```
POST   /api/merchants/{id}/verify
  Body: {
    validator_latitude, validator_longitude,
    status: "verified" | "rejected",
    bitcoin_confirmed: true/false,
    business_exists: true/false,
    notes, photo (optional)
  }
  Returns: { verification_id, merchant_status }

GET    /api/merchants/near-me
  Query: ?lat, ?lon, ?radius_km, ?status
  Returns: Merchants within radius sorted by distance
```

### OSM Publishing
```
POST   /api/merchants/{id}/publish-to-osm
  Auth: Admin only (or auto-triggered after verification)
  Process:
    1. Validate merchant is "merchant_confirmed"
    2. Create OSM changeset
    3. Create OSM node with tags:
       - name
       - shop/amenity category
       - payment:bitcoin=yes
       - payment:lightning=yes
       - lightning=<address>
       - currency:XBT=yes
       - contact:email, phone, website
    4. Update database with osm_node_id
    5. Return BTCMap URL

GET    /api/merchants/published
  Returns: All published merchants with BTCMap links
```

### Configuration
```
GET    /api/config/settings
  Query: ?organization_id
  Returns: Organization configuration (branding, OSM keys, rules)

PUT    /api/config/settings
  Auth: Admin only
  Body: Updated organization config
```

---

## Android App Architecture

### Technology Stack
- **Language:** Kotlin
- **Architecture:** MVVM (Model-View-ViewModel) + Clean Architecture
- **Location:** Google Play Services Location API
- **Maps:** OpenStreetMap (osmdroid) or Google Maps SDK
- **Network:** Retrofit + OkHttp
- **Database:** Room (SQLite)
- **Image:** Coil or Glide
- **DI:** Hilt (Dagger)
- **Camera:** CameraX
- **Authentication:** OAuth2 (AppAuth library)

### App Modules

```
com.btcmap.merchantregister/
├── data/
│   ├── local/
│   │   ├── dao/
│   │   │   ├── MerchantDao.kt
│   │   │   └── UserDao.kt
│   │   ├── entities/
│   │   │   ├── MerchantEntity.kt
│   │   │   └── VerificationEntity.kt
│   │   └── AppDatabase.kt
│   ├── remote/
│   │   ├── api/
│   │   │   ├── MerchantApi.kt
│   │   │   ├── AuthApi.kt
│   │   │   └── ConfigApi.kt
│   │   └── dto/
│   │       ├── MerchantDto.kt
│   │       └── VerificationDto.kt
│   └── repository/
│       ├── MerchantRepository.kt
│       ├── LocationRepository.kt
│       └── ConfigRepository.kt
├── domain/
│   ├── model/
│   │   ├── Merchant.kt
│   │   ├── Location.kt
│   │   └── Verification.kt
│   └── usecase/
│       ├── RegisterMerchantUseCase.kt
│       ├── VerifyMerchantUseCase.kt
│       └── GetNearbyMerchantsUseCase.kt
├── presentation/
│   ├── MainActivity.kt
│   ├── registration/
│   │   ├── RegistrationFragment.kt
│   │   ├── RegistrationViewModel.kt
│   │   └── GPS StatusView.kt
│   ├── verification/
│   │   ├── VerificationListFragment.kt
│   │   ├── VerificationDetailFragment.kt
│   │   └── VerificationViewModel.kt
│   ├── map/
│   │   ├── MapFragment.kt
│   │   └── MapViewModel.kt
│   └── settings/
│       ├── SettingsFragment.kt
│       └── OrganizationConfigFragment.kt
└── util/
    ├── LocationHelper.kt
    ├── CameraHelper.kt
    └── NetworkHelper.kt
```

### Key Android Components

**1. GPS Location Service**
```kotlin
class LocationHelper(private val fusedLocationClient: FusedLocationProviderClient) {

    fun getCurrentLocation(callback: (Location) -> Unit) {
        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null && location.accuracy < 20) {
                callback(location)
            }
        }
    }

    fun startLocationUpdates(intervalMs: Long = 5000) {
        val locationRequest = LocationRequest.create().apply {
            interval = intervalMs
            fastestInterval = 2000
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        }
        // Stream real-time GPS updates
    }

    fun getAccuracyLevel(accuracy: Float): AccuracyLevel {
        return when {
            accuracy < 10 -> AccuracyLevel.EXCELLENT
            accuracy < 20 -> AccuracyLevel.GOOD
            else -> AccuracyLevel.POOR
        }
    }
}
```

**2. Registration ViewModel**
```kotlin
class RegistrationViewModel @Inject constructor(
    private val registerMerchantUseCase: RegisterMerchantUseCase,
    private val locationHelper: LocationHelper
) : ViewModel() {

    private val _currentLocation = MutableLiveData<Location>()
    val currentLocation: LiveData<Location> = _currentLocation

    private val _accuracyLevel = MutableLiveData<AccuracyLevel>()
    val accuracyLevel: LiveData<AccuracyLevel> = _accuracyLevel

    fun startGPSTracking() {
        locationHelper.startLocationUpdates { location ->
            _currentLocation.postValue(location)
            _accuracyLevel.postValue(
                locationHelper.getAccuracyLevel(location.accuracy)
            )
        }
    }

    suspend fun submitMerchant(merchant: Merchant, photos: List<Uri>) {
        // Upload to backend
        val result = registerMerchantUseCase(merchant, photos)
        // Handle success/error
    }
}
```

**3. Offline Support**
```kotlin
class MerchantRepository @Inject constructor(
    private val merchantApi: MerchantApi,
    private val merchantDao: MerchantDao,
    private val networkHelper: NetworkHelper
) {

    suspend fun registerMerchant(merchant: Merchant): Result<String> {
        // Save locally first
        merchantDao.insert(merchant.toEntity())

        return if (networkHelper.isOnline()) {
            // Try to sync immediately
            syncMerchant(merchant)
        } else {
            // Queue for later sync
            merchantDao.markForSync(merchant.id)
            Result.success(merchant.id)
        }
    }

    suspend fun syncPendingMerchants() {
        val pending = merchantDao.getPendingSync()
        pending.forEach { merchant ->
            syncMerchant(merchant.toDomain())
        }
    }
}
```

---

## OSM Integration

### Publishing Flow
```kotlin
// Backend implementation
class OSMPublisher(
    private val osmApiUrl: String,
    private val accessToken: String
) {

    suspend fun publishMerchant(merchant: Merchant): String {
        // 1. Create changeset
        val changesetId = createChangeset(
            comment = "Add ${merchant.name} - Bitcoin merchant in ${merchant.address}"
        )

        // 2. Create node with Bitcoin tags
        val nodeXml = buildNodeXml(merchant, changesetId)
        val nodeId = createNode(nodeXml)

        // 3. Close changeset
        closeChangeset(changesetId)

        return nodeId
    }

    private fun buildNodeXml(merchant: Merchant, changesetId: String): String {
        return """
            <?xml version="1.0" encoding="UTF-8"?>
            <osm>
              <node changeset="$changesetId" lat="${merchant.latitude}" lon="${merchant.longitude}">
                <tag k="name" v="${merchant.name}"/>
                <tag k="${merchant.categoryKey}" v="${merchant.categoryValue}"/>
                <tag k="payment:bitcoin" v="yes"/>
                <tag k="payment:lightning" v="yes"/>
                <tag k="lightning" v="${merchant.lightningAddress}"/>
                <tag k="currency:XBT" v="yes"/>
                <tag k="payment:onchain" v="${if (merchant.paymentOnchain) "yes" else "no"}"/>
                <tag k="contact:email" v="${merchant.email}"/>
                <tag k="contact:phone" v="${merchant.phone}"/>
                <tag k="source" v="survey"/>
                <tag k="survey:date" v="${LocalDate.now()}"/>
              </node>
            </osm>
        """.trimIndent()
    }
}
```

### Required OSM Tags (BTCMap compatible)
```
name: Business name
shop/amenity: Category (shop=convenience, amenity=restaurant, etc.)
payment:bitcoin: "yes"
payment:lightning: "yes" (if they accept Lightning)
lightning: Lightning address or LNURL
currency:XBT: "yes"
payment:onchain: "yes"/"no"
contact:email: Email
contact:phone: Phone
description: Brief description
source: "survey"
survey:date: Date of verification
```

---

## Security Considerations

### 1. API Authentication
- JWT tokens with refresh mechanism
- OAuth2 for OSM (don't store credentials in app)
- API rate limiting per organization

### 2. Data Encryption
- HTTPS only (enforce TLS 1.3+)
- Encrypt sensitive data in local SQLite using SQLCipher
- Store OSM tokens encrypted (Android Keystore)

### 3. Permission Handling
- GPS: Request at registration time with clear explanation
- Camera: Request when taking photos
- Storage: For offline photo storage
- Network: Check connectivity before sync

### 4. Input Validation
- Sanitize all user inputs (prevent SQL injection, XSS)
- Validate GPS coordinates (reasonable bounds)
- Verify Lightning addresses format
- Image size limits (max 5MB per photo)

---

## Open Source Strategy

### Repository Structure
```
btcmap-merchant-app/
├── android/               # Android app (Kotlin)
├── backend/              # API server (Node.js or Python)
│   ├── src/
│   ├── database/
│   │   └── migrations/
│   └── README.md
├── docs/
│   ├── SETUP.md         # Deployment guide
│   ├── API.md           # API documentation
│   └── CONTRIBUTING.md
├── docker-compose.yml   # Easy backend deployment
├── LICENSE              # MIT or Apache 2.0
└── README.md
```

### License
**Recommended:** MIT License (most permissive, encourages adoption)

### Documentation
1. **Quick Start Guide** - How to deploy for your organization
2. **API Documentation** - OpenAPI/Swagger spec
3. **Android Setup** - Building and customizing the app
4. **Database Setup** - Schema + migrations
5. **OSM Integration** - How to get OAuth keys
6. **Contributing Guide** - How others can help

### Community
- GitHub Issues for bug reports
- Discussions for feature requests
- Wiki for deployment examples
- Example configurations for popular hosting providers (Vercel, Heroku, DigitalOcean)

---

## Deployment Options

### For Organizations

**Option 1: Hosted Backend (Recommended)**
```bash
# Deploy backend to VPS/Cloud
git clone https://github.com/your-org/btcmap-merchant-app
cd backend
npm install
cp .env.example .env
# Configure database + OSM keys
npm run migrate
npm start
```

**Option 2: Serverless**
- Deploy API to Vercel/Netlify Functions
- Use managed MySQL (PlanetScale, AWS RDS)
- Object storage for photos (S3, Cloudflare R2)

**Option 3: Docker**
```bash
docker-compose up -d
# Includes: API server, MySQL, Redis (for queue)
```

### Android App Customization
```gradle
// app/build.gradle
android {
    defaultConfig {
        // Organization branding
        resValue "string", "app_name", "Your Org Merchant Mapper"
        buildConfigField "String", "API_BASE_URL", "\"https://your-api.com\""
    }
}
```

---

## Roadmap

### Phase 1: MVP (3-4 months)
- [ ] Android app with GPS registration
- [ ] Basic backend API (register, verify, publish)
- [ ] MySQL database schema
- [ ] OSM integration (manual publish by admin)
- [ ] Photo upload

### Phase 2: Verification (2 months)
- [ ] Validator mode in app
- [ ] GPS-based verification distance check
- [ ] Verification workflow + admin dashboard
- [ ] Auto-publish after verification

### Phase 3: Multi-Org Support (2 months)
- [ ] Organization configuration API
- [ ] Dynamic app branding
- [ ] White-label capability
- [ ] Documentation for self-deployment

### Phase 4: Advanced Features
- [ ] Offline-first sync
- [ ] Web dashboard (React/Next.js)
- [ ] Analytics (merchant density maps)
- [ ] NFC tap-to-verify (for merchants with NFC tags)
- [ ] Integration with BTCMap API (query existing merchants)
- [ ] Multi-language support

---

## Comparison with Similar Tools

| Feature | This App | BTCMap.org (web) | Concept (Nostr) |
|---------|----------|------------------|-----------------|
| GPS-first | ✅ Built-in | ❌ Manual pin | ✅ GPS location |
| Offline support | ✅ Yes | ❌ No | ❌ No |
| Verification | ✅ GPS-based | ❌ Community edits | ✅ Validator notes |
| Multi-org | ✅ Configurable | ❌ Single instance | ❌ Single protocol |
| Open source | ✅ MIT | ✅ Yes | ✅ Nostr protocol |
| Self-hosted | ✅ Your database | ❌ Centralized | ⚠️ Relay dependent |
| Mobile app | ✅ Native Android | ⚠️ PWA | ✅ Nostr clients |

---

## Next Steps for Afribit

1. **Decide on backend technology** (Node.js vs Python)
2. **Set up development environment**
   - MySQL database (local or cloud)
   - OSM developer account + OAuth app
3. **Create Android project skeleton**
   - Setup MVVM architecture
   - GPS permissions + location tracking
4. **Build MVP features first:**
   - Registration form with GPS
   - Submit to your existing API
   - Admin dashboard to review/publish
5. **Test with your team in Kibera**
   - Dog-food the app for next 10 merchants
   - Iterate based on real-world usage
6. **Open source when stable** (after initial testing)

---

## Questions to Consider

1. **Backend preference:** Node.js (matches your current stack) or Python (simpler for some)?
2. **Photo storage:** Database BLOBs vs cloud storage (S3, Cloudflare R2)?
3. **Auto-publish:** Should verified merchants auto-publish to OSM or require admin approval?
4. **Branding:** Keep "BTCMap Merchant App" name or rebrand for each org?
5. **Monetization:** Completely free or offer hosted version as paid service?
6. **iOS:** Android-only initially or cross-platform (React Native/Flutter)?

---

## Estimated Development Time

**Solo developer:**
- MVP: 3-4 months
- With verification: +2 months
- Multi-org support: +2 months
- **Total:** ~6-8 months

**Small team (2-3 developers):**
- MVP: 6-8 weeks
- With verification: +3 weeks
- Multi-org support: +3 weeks
- **Total:** ~3-4 months

**Existing Afribit codebase advantage:**
- Already have backend API patterns ✅
- Already have OSM publishing logic ✅
- Already have database schema ✅
- **Accelerates to:** ~2-3 months for MVP

Would you like me to create the initial project structure, API specifications, or Android app skeleton to get started?
