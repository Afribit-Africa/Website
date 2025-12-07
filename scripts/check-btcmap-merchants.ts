import { executeQuery } from '../lib/db';

async function main() {
  console.log('Checking merchants with BTCMap links...\n');

  const merchants = await executeQuery<any[]>(
    `SELECT id, business_name, osm_node_id
     FROM merchant_submissions
     WHERE status = "published"
     AND osm_node_id IS NOT NULL
     ORDER BY business_name`
  );

  console.log('Merchants with BTCMap OSM node IDs:');
  merchants.forEach(m => {
    console.log(`- ${m.business_name} (OSM: ${m.osm_node_id})`);
  });

  console.log(`\nTotal: ${merchants.length} merchants with BTCMap links`);
}

main().catch(console.error);
