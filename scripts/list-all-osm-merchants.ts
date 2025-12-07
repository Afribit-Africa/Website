import { executeQuery } from '../lib/db';

async function listAllOSMMerchants() {
  console.log('📋 Listing all published merchants with OSM nodes...\n');

  const results = await executeQuery(`
    SELECT
      id,
      business_name,
      osm_node_id,
      status,
      contact_email
    FROM merchant_submissions
    WHERE status = 'published'
      AND osm_node_id IS NOT NULL
    ORDER BY business_name
  `) as any[];

  console.log(`Found ${results.length} merchants with OSM nodes:\n`);

  results.forEach((merchant: any, index: number) => {
    console.log(`${index + 1}. ${merchant.business_name}`);
    console.log(`   ID: ${merchant.id}`);
    console.log(`   OSM Node: ${merchant.osm_node_id}`);
    console.log(`   Contact: ${merchant.contact_email}`);
    console.log('');
  });

  // Check for the 20 verified merchants
  const verified = await executeQuery(`
    SELECT business_name, osm_node_id
    FROM merchant_submissions
    WHERE contact_email = 'edmundspira@gmail.com'
      AND status = 'published'
    ORDER BY business_name
  `) as any[];

  console.log(`\n✅ ${verified.length} verified merchants (edmundspira@gmail.com):`);
  verified.forEach((m: any) => {
    console.log(`   • ${m.business_name} - Node ${m.osm_node_id}`);
  });

  // Check for old merchants
  const oldMerchants = await executeQuery(`
    SELECT business_name, osm_node_id
    FROM merchant_submissions
    WHERE contact_email != 'edmundspira@gmail.com'
      AND status = 'published'
      AND osm_node_id IS NOT NULL
    ORDER BY business_name
  `) as any[];

  console.log(`\n⚠️  ${oldMerchants.length} OLD merchants (not in verified list):`);
  oldMerchants.forEach((m: any) => {
    console.log(`   • ${m.business_name} - Node ${m.osm_node_id}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY:');
  console.log(`Total published with OSM: ${results.length}`);
  console.log(`Verified (keep): ${verified.length}`);
  console.log(`Old (need cleanup): ${oldMerchants.length}`);
}

listAllOSMMerchants().catch(console.error);
