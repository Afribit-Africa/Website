import { executeQuery } from './lib/db.js';

async function checkRuthShop() {
  const result = await executeQuery(
    "SELECT id, business_name, contact_name, lightning_address, status, latitude, longitude FROM merchant_submissions WHERE business_name = 'Ruth Shop'"
  );

  console.log('\n✅ Ruth Shop Registration Status:\n');
  console.log(JSON.stringify(result, null, 2));

  if (result && result.length > 0) {
    const shop = result[0];
    console.log('\n📋 Summary:');
    console.log(`   Business: ${shop.business_name}`);
    console.log(`   Operator: ${shop.contact_name}`);
    console.log(`   Blink: ${shop.lightning_address}`);
    console.log(`   Location: ${shop.latitude}, ${shop.longitude}`);
    console.log(`   Status: ${shop.status}`);
    console.log(`   ID: ${shop.id}`);
  }

  process.exit(0);
}

checkRuthShop();
