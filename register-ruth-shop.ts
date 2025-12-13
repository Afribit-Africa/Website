import { executeQuery } from './lib/db.js';
import { v4 as uuidv4 } from 'uuid';

async function registerAndPublishMerchant() {
  try {
    const merchantId = uuidv4();
    const now = new Date();

    console.log('\n🔄 Registering Ruth Shop...\n');

    // Step 1: Insert merchant into database
    const insertQuery = `
      INSERT INTO merchant_submissions (
        id,
        business_name,
        category_key,
        category_value,
        description,
        latitude,
        longitude,
        address,
        contact_email,
        contact_name,
        lightning_address,
        payment_onchain,
        payment_lightning,
        payment_lightning_contactless,
        status,
        verification_status,
        is_early_adopter,
        submitted_at,
        verified_at,
        verified_by_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await executeQuery(insertQuery, [
      merchantId,
      'Ruth Shop',
      'shop',
      'convenience',
      'Retail shop selling general goods including bread, milk, food ingredients, and groceries',
      -1.318514,
      36.779287,
      'Soweto, Kibera',
      'edmundspira@gmail.com',
      'Ruth Kwamboka',
      'ruthkwamboka@blink.sv',
      true,  // payment_onchain
      true,  // payment_lightning
      false, // payment_lightning_contactless
      'merchant_confirmed', // status - ready for OSM publishing
      'verified', // verification_status
      true,  // is_early_adopter
      now,
      now,
      'edmundspira@gmail.com'
    ]);

    console.log('✅ Merchant registered in database');
    console.log(`   ID: ${merchantId}`);
    console.log(`   Business: Ruth Shop`);
    console.log(`   Operator: Ruth Kwamboka`);
    console.log(`   Blink: ruthkwamboka@blink.sv`);
    console.log(`   Location: -1.318514, 36.779287`);
    console.log(`   Status: merchant_confirmed (ready for OSM)`);
    console.log('');

    // Step 2: Query to verify insertion
    const checkQuery = `SELECT * FROM merchant_submissions WHERE id = ?`;
    const merchants = await executeQuery(checkQuery, [merchantId]);

    if (merchants && merchants.length > 0) {
      console.log('✅ Verified merchant in database');
      console.log('');
      console.log('📋 Next Steps:');
      console.log('   1. Run OSM publishing script:');
      console.log('      npx tsx scripts/publish-verified-to-osm.ts');
      console.log('');
      console.log('   2. This will:');
      console.log('      - Create OSM node');
      console.log('      - Get OSM node ID');
      console.log('      - Set status to "published"');
      console.log('      - BTCMap will sync within 24-48 hours');
      console.log('');
      console.log(`   Merchant ID: ${merchantId}`);
    } else {
      console.log('❌ Failed to verify merchant insertion');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }

  process.exit(0);
}

registerAndPublishMerchant();
