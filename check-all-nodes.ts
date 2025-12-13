import { executeQuery } from './lib/db';

async function checkNodes() {
  const results = await executeQuery(`
    SELECT business_name, osm_node_id, status
    FROM merchant_submissions
    WHERE status='published'
    ORDER BY business_name
  `);

  console.log('Current merchants in database:\n');
  results.forEach((row: any, i: number) => {
    console.log(`${i + 1}. ${row.business_name}`);
    console.log(`   OSM Node: ${row.osm_node_id}\n`);
  });
  console.log(`Total: ${results.length} merchants`);

  process.exit(0);
}

checkNodes();
