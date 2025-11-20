/**
 * FINAL STEP: Update all merchant coordinates from BTCMap
 * Run this AFTER importing merchants via the web UI
 */

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'mdawidahomestay.com',
  port: 3306,
  user: 'mdawidah_afribit',
  password: 'G5H1t_cAsvIA',
  database: 'mdawidah_afribit'
};

// Manual mapping of merchant names to BTCMap node IDs from CSV
const manualMappings = {
  'muanzo mpya organisation': '12300475666',
  'black and white': '12300467146',
  'black and white (aka kibra btc shop)': '12300467146',
  'joseph public washroom': '12300462657',
  'kheezonix fashions and styles': '12300462658',
  'biogas public washrooms': '12300462655',
  'caro public washroom (biogas)': '12300462655',
  'abuki distributors': '12300462656',
  'yummytummygoodies': '12167701319',
  'livegreat foundation (yummy tummy goodies)': '12167701319',
  '3west butchery': '12300469780',
  'kibera the largest slum tour': '12300469783',
  'evalyncafeterian': '12700628232',
  'abebo vegez': '12300439008',
  'mama nonny shop': '12300462946',
  'mama noony mini shop': '12300462946',
  'domiano fast foods': '12700702059',
  'damiano fast foods': '12700702059',
  'wamboya': '12700702058',
  'acgassuppliers': '12700702057',
  'galaxytoilets': '12700702056',
  'mama clinton groceries': '12700702055',
  'mama clear grocery': '12700702055',
  'fred collections': '12700702054',
  'krezzy kicks': '12700702054',
  'arca tech services': '12300515181',
  'maji safi': '12300469782',
  'swahili dishes': '12300469782',
  'were tours': '12300462913',
  'wilson asweto': '12300443594',
  'delivery (bodaboda)': '12300443594',
  'elijah draxler': '12300443592',
  'moseso rides': '12300433274',
  'charlie rider': '12300433273',
  'big brother car wash': '12300417204',
  'unique barber shop': '12254721499',
  "shiko's ferments": '12281745878',
  'kosmos solutions ltd': '12281743822',
  'outdoor kids kenya': '12281727715',
  'njema safaris': '12280177485',
  'greencard mtaani': '12255259652',
  'ronniefund': '12280168473',
  'obadia nyaenda': '12254733210',
  'obado agure bodaboda': '12254733210',
  'kera transport': '12254728433',
  'kera bodaboda': '12254728433',
  'felix': '12254728431',
  'mama design': '12254678587',
  'calisto enterprise': '12253101509',
  'kevo ds station': '12254686388',
  'kevin ds arena': '12254686388',
  'kevin entertainment square': '12254686388',
  'for people forever ltd': '12254728432',
  'fishpoint eateries': '12254752062',
  'spira': '12168076295',
  'dess gaming': '12165688182',
  // Additional mappings for bodaboda merchants
  'bodaboda (nyabuto kennedy)': '12254728433', // Same as Kera
  'vincent boda boda': '12254728431', // Same as Felix
  'kanana boda boda': '12254728432', // Same as For People Forever
  'sammy ouma bodaboda': '12254733210', // Same as Obadia
  'mlosho bodaboda': '12254728433', // Same as Kera
  'onetouch bodaboda': '12254728431', // Same as Felix
  // Shop mappings
  '3 west collection': '12300469780', // Same as 3WEST BUTCHERY
  'shine magicians': '12300467146', // BLACK AND WHITE
  'usafi boys initiative': '12300462655', // BIOGAS
  'jewelry arts': '12700702054', // Fred Collections
  'nyale nuts': '12700702054', // Fred Collections
  'kunta natural products': '12300469782', // Maji safi
  'habil print & photo hub': '12300515181', // Arca Tech
  'goreti greens shop': '12700702055', // Mama Clinton
  'golden heart youth group': '12280168473', // RonnieFund
  'venla very retail shop': '12300462946', // MAMA NONNY
  'night salon': '12254678587', // Mama Design
  "mama eddy's salon": '12254678587', // Mama Design
  'bridgeway shop': '12300462946', // MAMA NONNY
};

async function fetchAllBTCMapElements() {
  try {
    const response = await fetch('https://api.btcmap.org/v2/elements');
    if (!response.ok) {
      throw new Error(`BTCMap API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching BTCMap elements:', error);
    throw error;
  }
}

function getCoordinatesForNode(nodeId, btcMapElements) {
  const element = btcMapElements.find(el => el.id === `node:${nodeId}`);
  if (element && element.osm_json) {
    return {
      latitude: element.osm_json.lat,
      longitude: element.osm_json.lon
    };
  }
  return null;
}

async function main() {
  let connection;

  try {
    console.log('Fetching BTCMap data...\n');
    const btcMapElements = await fetchAllBTCMapElements();
    console.log(`✓ Fetched ${btcMapElements.length} BTCMap elements\n`);

    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Connected\n');

    // Get all early adopter merchants
    const [merchants] = await connection.execute(`
      SELECT id, business_name, latitude, longitude, osm_node_id
      FROM merchant_submissions
      WHERE is_early_adopter = 1 AND status = 'published'
      ORDER BY business_name
    `);

    console.log(`Processing ${merchants.length} early adopter merchants\n`);
    console.log('='.repeat(80));

    let updated = 0;
    let skipped = 0;
    let notFound = 0;

    for (const merchant of merchants) {
      const normalized = merchant.business_name.toLowerCase().trim();
      console.log(`\n${merchant.business_name}`);
      
      const nodeId = manualMappings[normalized];
      
      if (!nodeId) {
        console.log(`  ✗ No mapping found`);
        notFound++;
        continue;
      }
      
      const coords = getCoordinatesForNode(nodeId, btcMapElements);
      
      if (!coords) {
        console.log(`  ✗ Node ${nodeId} not found in BTCMap data`);
        notFound++;
        continue;
      }
      
      // Check if update needed
      if (merchant.latitude === coords.latitude && merchant.longitude === coords.longitude) {
        console.log(`  ✓ Already correct: ${coords.latitude}, ${coords.longitude}`);
        skipped++;
        continue;
      }
      
      // Update
      await connection.execute(`
        UPDATE merchant_submissions
        SET latitude = ?, longitude = ?, osm_node_id = ?
        WHERE id = ?
      `, [coords.latitude, coords.longitude, `node:${nodeId}`, merchant.id]);
      
      console.log(`  ✓ UPDATED: ${coords.latitude}, ${coords.longitude}`);
      console.log(`    (was: ${merchant.latitude}, ${merchant.longitude})`);
      updated++;
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\nSummary:`);
    console.log(`  Total processed: ${merchants.length}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Already correct: ${skipped}`);
    console.log(`  Not found: ${notFound}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\nError:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

main();
