import { executeQuery } from './lib/db.js';

async function getMerchants() {
  try {
    const merchants = await executeQuery(`
      SELECT
        business_name,
        osm_node_id,
        is_early_adopter,
        adopter_number,
        category_value,
        address
      FROM merchant_submissions
      WHERE status = 'published'
        AND osm_node_id IS NOT NULL
      ORDER BY published_at DESC
      LIMIT 20
    `);

    console.log('\n=== PUBLISHED MERCHANTS WITH BTCMAP LINKS ===\n');

    merchants.forEach((m: any, index: number) => {
      const osmUrl = `https://www.openstreetmap.org/node/${m.osm_node_id}`;
      const btcmapUrl = `https://btcmap.org/merchant/${m.osm_node_id}`;

      console.log(`${index + 1}. ${m.business_name}`);
      console.log(`   Category: ${m.category_value}`);
      if (m.address) console.log(`   Address: ${m.address}`);
      console.log(`   OSM Node ID: ${m.osm_node_id}`);
      console.log(`   OSM URL: ${osmUrl}`);
      console.log(`   BTCMap URL: ${btcmapUrl}`);
      if (m.is_early_adopter) {
        console.log(`   ⭐ Early Adopter #${m.adopter_number}`);
      }
      console.log('');
    });

    console.log(`\nTotal: ${merchants.length} merchants\n`);
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

getMerchants();
