/**
 * Script to update merchants with missing coordinates by fetching from BTCMap API
 * Run with: node scripts/update-missing-coordinates.js
 */

const mysql = require('mysql2/promise');

// Database connection
const dbConfig = {
  host: 'mdawidahomestay.com',
  port: 3306,
  user: 'mdawidah_afribit',
  password: 'G5H1t_cAsvIA',
  database: 'mdawidah_afribit'
};

/**
 * Fetch all elements from BTCMap API
 */
async function fetchAllBTCMapElements() {
  try {
    const response = await fetch('https://api.btcmap.org/v2/elements');
    if (!response.ok) {
      throw new Error(`BTCMap API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching BTCMap elements:', error);
    throw error;
  }
}

/**
 * Search for merchant by business name in BTCMap data
 */
function findMerchantInBTCMap(businessName, btcMapElements) {
  // Normalize business name for matching
  const normalized = businessName.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  // Try exact match first
  for (const element of btcMapElements) {
    if (!element.osm_json || !element.osm_json.tags) continue;

    const name = element.osm_json.tags.name || '';
    if (name.toLowerCase() === normalized) {
      return {
        latitude: element.osm_json.lat,
        longitude: element.osm_json.lon,
        osmNodeId: element.id
      };
    }
  }

  // Try partial match
  for (const element of btcMapElements) {
    if (!element.osm_json || !element.osm_json.tags) continue;

    const name = element.osm_json.tags.name || '';
    if (name.toLowerCase().includes(normalized) || normalized.includes(name.toLowerCase())) {
      return {
        latitude: element.osm_json.lat,
        longitude: element.osm_json.lon,
        osmNodeId: element.id
      };
    }
  }

  return null;
}

async function main() {
  let connection;

  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Connected to database');

    // Fetch all merchants with default Kibera coordinates (these need updating)
    const [merchants] = await connection.execute(`
      SELECT id, business_name, latitude, longitude, osm_node_id
      FROM merchant_submissions
      WHERE latitude = -1.3133 AND longitude = 36.7897
      ORDER BY business_name
    `);

    if (merchants.length === 0) {
      console.log('No merchants with default coordinates found.');
      return;
    }

    console.log(`\nFound ${merchants.length} merchants with default coordinates:`);
    merchants.forEach(m => console.log(`  - ${m.business_name}`));

    console.log('\nFetching BTCMap data...');
    const btcMapElements = await fetchAllBTCMapElements();
    console.log(`✓ Fetched ${btcMapElements.length} BTCMap elements`);

    let updated = 0;
    let notFound = 0;

    console.log('\nUpdating coordinates...\n');

    for (const merchant of merchants) {
      const coords = findMerchantInBTCMap(merchant.business_name, btcMapElements);

      if (coords) {
        await connection.execute(`
          UPDATE merchant_submissions
          SET latitude = ?, longitude = ?, osm_node_id = ?
          WHERE id = ?
        `, [coords.latitude, coords.longitude, coords.osmNodeId, merchant.id]);

        console.log(`✓ ${merchant.business_name}`);
        console.log(`  → Lat: ${coords.latitude}, Lng: ${coords.longitude}`);
        console.log(`  → Node: ${coords.osmNodeId}\n`);
        updated++;
      } else {
        console.log(`✗ ${merchant.business_name} - NOT FOUND in BTCMap`);
        notFound++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Summary:`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Not found: ${notFound}`);
    console.log(`  Total: ${merchants.length}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

main();
