const mysql = require('mysql2/promise');
const { randomUUID } = require('crypto');

// Hardcoded merchant data (from lib/merchants-data.ts)
const merchantDirectory = [
  {
    businessName: "3 West Collection",
    ownerName: "Billy",
    email: "bildadouma578@gmail.com",
    phoneNumber: "110924413",
    location: "Soweto",
    blinkAddress: "threewestcollection@blink.sv",
    category: "shop"
  },
  {
    businessName: "Shine Magicians",
    ownerName: "Gundo",
    email: "gundokevin386@gmail.com",
    phoneNumber: "790274104",
    location: "Soweto 3 West",
    blinkAddress: "livegreatshinemagician@blink.sv",
    category: "beauty"
  },
  {
    businessName: "MUANZO MPYA ORGANISATION",
    ownerName: "Eunice",
    email: "muanzompyaorg@gmail.com",
    phoneNumber: "254792261682",
    location: "ST CHRISTINE'S, KIBERA",
    blinkAddress: "muanzompya@blink.sv",
    category: "nonprofit"
  },
  {
    businessName: "For People Forever LTD",
    ownerName: "Lipapi",
    email: "dennisochiengotolo@gmail.com",
    phoneNumber: "742857375",
    location: "Raila Village, Nairobi, Kenya",
    blinkAddress: "forpeopleforever01@blink.sv",
    category: "nonprofit"
  },
  {
    businessName: "Usafi Boys Initiative",
    ownerName: "Abelo",
    email: "info@afribit.africa",
    phoneNumber: "254711430664",
    location: "Kibera",
    blinkAddress: "usafiboysinitiative@blink.sv",
    category: "service"
  },
  {
    businessName: "BIG BROTHER CAR WASH",
    ownerName: "Johnteh",
    email: "johnomomndi541@gmail.com",
    phoneNumber: "254792261682",
    location: "Kibera",
    blinkAddress: "bigbrothercarwash@blink.sv",
    category: "service"
  },
  {
    businessName: "Damiano Fast Foods",
    ownerName: "Damiano",
    email: "magakdamiano0@gmail.com",
    phoneNumber: "111835388",
    location: "3 West",
    blinkAddress: "damiano@blink.sv",
    category: "restaurant"
  },
  {
    businessName: "Kevin Entertainment Square",
    ownerName: "Kevin",
    email: "info@afribit.africa",
    phoneNumber: "",
    location: "Kibera",
    blinkAddress: "kevinnakali147@blink.sv",
    category: "service"
  },
  {
    businessName: "BLACK AND WHITE (aka Kibra BTC Shop)",
    ownerName: "Steph",
    email: "info@afribit.africa",
    phoneNumber: "254701930675",
    location: "Raila Village, Kibera",
    blinkAddress: "kibrabtcshop@blink.sv",
    category: "shop"
  },
  {
    businessName: "3WEST BUTCHERY",
    ownerName: "Newson Onyonyi",
    email: "Newsononyoni5@gmail.com",
    phoneNumber: "720778480",
    location: "Soweto Academy",
    blinkAddress: "threewestbutchery@blink.sv",
    category: "shop"
  },
  // Add more merchants here...
];

// Migration script to import hardcoded merchants into database
async function migrateMerchantsToDatabase() {
  let conn;
  try {
    conn = await mysql.createConnection(
      'mysql://mdawidah_afribit:G5H1t_cAsvIA@mdawidahomestay.com:3306/mdawidah_afribit'
    );
    
    console.log('✓ Connected to database\n');
    console.log(`Found ${merchantDirectory.length} merchants to migrate\n`);
    
    let inserted = 0;
    let skipped = 0;
    let updated = 0;
    
    for (const merchant of merchantDirectory) {
      try {
        // Check if merchant already exists by business name
        const [existing] = await conn.query(
          'SELECT id FROM merchant_submissions WHERE business_name = ?',
          [merchant.businessName]
        );
        
        if (existing.length > 0) {
          console.log(`  ⊙ Skipping: ${merchant.businessName} (already exists)`);
          skipped++;
          continue;
        }
        
        // Generate UUID
        const id = randomUUID();
        const editToken = randomUUID().replace(/-/g, '');
        
        // Determine category_key and category_value
        let categoryKey = 'amenity';
        let categoryValue = 'other';
        
        switch (merchant.category) {
          case 'restaurant':
            categoryKey = 'amenity';
            categoryValue = 'restaurant';
            break;
          case 'transport':
            categoryKey = 'shop';
            categoryValue = 'car';
            break;
          case 'beauty':
            categoryKey = 'shop';
            categoryValue = 'beauty';
            break;
          case 'shop':
            categoryKey = 'shop';
            categoryValue = 'convenience';
            break;
          case 'service':
            categoryKey = 'amenity';
            categoryValue = 'community_centre';
            break;
          case 'tourism':
            categoryKey = 'tourism';
            categoryValue = 'attraction';
            break;
          case 'tech':
            categoryKey = 'shop';
            categoryValue = 'electronics';
            break;
          case 'nonprofit':
            categoryKey = 'amenity';
            categoryValue = 'social_facility';
            break;
          default:
            categoryKey = 'amenity';
            categoryValue = 'other';
        }
        
        // Insert merchant with status 'published' since these are verified legacy merchants
        await conn.query(
          `INSERT INTO merchant_submissions (
            id, business_name, category_key, category_value, description,
            latitude, longitude, address, phone, website,
            payment_onchain, payment_lightning, payment_lightning_contactless,
            lightning_address, contact_name, contact_email, contact_relationship,
            status, edit_token, osm_node_id, btcmap_synced,
            is_early_adopter, submitted_at, verified_at, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
          [
            id,
            merchant.businessName,
            categoryKey,
            categoryValue,
            `${merchant.businessName} in ${merchant.location}`,
            null, // latitude
            null, // longitude
            merchant.location,
            merchant.phoneNumber || null,
            null, // website
            false, // payment_onchain
            true,  // payment_lightning (all have Blink addresses)
            false, // payment_lightning_contactless
            merchant.blinkAddress || null,
            merchant.ownerName,
            merchant.email || 'info@afribit.africa',
            'owner',
            'published', // Mark as published since these are verified legacy merchants
            editToken,
            null, // osm_node_id
            false, // btcmap_synced
            true, // is_early_adopter - all legacy merchants are early adopters
          ]
        );
        
        console.log(`  ✓ Migrated: ${merchant.businessName}`);
        inserted++;
        
      } catch (error) {
        console.error(`  ✗ Error migrating ${merchant.businessName}:`, error.message);
      }
    }
    
    console.log(`\n=== Migration Summary ===`);
    console.log(`  Inserted: ${inserted}`);
    console.log(`  Skipped:  ${skipped}`);
    console.log(`  Total:    ${merchantDirectory.length}`);
    
    // Assign adopter numbers to early adopters
    console.log('\nAssigning adopter numbers...');
    const [earlyAdopters] = await conn.query(
      `SELECT id FROM merchant_submissions 
       WHERE is_early_adopter = true AND adopter_number IS NULL 
       ORDER BY submitted_at ASC`
    );
    
    for (let i = 0; i < earlyAdopters.length; i++) {
      await conn.query(
        'UPDATE merchant_submissions SET adopter_number = ? WHERE id = ?',
        [i + 1, earlyAdopters[i].id]
      );
    }
    console.log(`  ✓ Assigned adopter numbers to ${earlyAdopters.length} merchants`);
    
    console.log('\n✓ Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    if (conn) await conn.end();
  }
}

// Run migration
migrateMerchantsToDatabase();
