/**
 * Script to fetch coordinates from BTCMap API using the CSV file
 * and update merchants in the database
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database connection
const dbConfig = {
  host: 'mdawidahomestay.com',
  port: 3306,
  user: 'mdawidah_afribit',
  password: 'G5H1t_cAsvIA',
  database: 'mdawidah_afribit'
};

// Parse CSV data
const csvData = `MUANZO MPYA ORGANISATION,https://btcmap.org/merchant/node:12300475666
BLACK AND WHITE,https://btcmap.org/merchant/node:12300467146
JOSEPH PUBLIC WASHROOM,https://btcmap.org/merchant/node:12300462657
KHEEZONIX FASHIONS AND STYLES,https://btcmap.org/merchant/node:12300462658
BIOGAS PUBLIC WASHROOMS,https://btcmap.org/merchant/node:12300462655
ABUKI DISTRIBUTORS,https://btcmap.org/merchant/node:12300462656
Yummytummygoodies,https://btcmap.org/merchant/node:12167701319
3WEST BUTCHERY,https://btcmap.org/merchant/node:12300469780
Kibera the Largest slum tour,https://btcmap.org/merchant/node:12300469783
Evalyncafeterian,https://btcmap.org/merchant/node:12700628232
ABEBO VEGEZ,https://btcmap.org/merchant/node:12300439008
MAMA NONNY SHOP,https://btcmap.org/merchant/node:12300462946
Domiano Fast foods,https://btcmap.org/merchant/node:12700702059
Wamboya,https://btcmap.org/merchant/node:12700702058
ACGassuppliers,https://btcmap.org/merchant/node:12700702057
GalaxyToilets,https://btcmap.org/merchant/node:12700702056
Mama Clinton Groceries,https://btcmap.org/merchant/node:12700702055
Fred Collections,https://btcmap.org/merchant/node:12700702054
Arca Tech Services,https://btcmap.org/merchant/node:12300515181
Maji safi,https://btcmap.org/merchant/node:12300469782
WERE TOURS,https://btcmap.org/merchant/node:12300462913
WILSON ASWETO,https://btcmap.org/merchant/node:12300443594
ELIJAH DRAXLER,https://btcmap.org/merchant/node:12300443592
MOSESO RIDES,https://btcmap.org/merchant/node:12300433274
CHARLIE RIDER,https://btcmap.org/merchant/node:12300433273
BIG BROTHER CAR WASH,https://btcmap.org/merchant/node:12300417204
Unique Barber Shop,https://btcmap.org/merchant/node:12254721499
Shiko's Ferments,https://btcmap.org/merchant/node:12281745878
Kosmos Solutions LTD,https://btcmap.org/merchant/node:12281743822
Outdoor Kids Kenya,https://btcmap.org/merchant/node:12281727715
Njema Safaris,https://btcmap.org/merchant/node:12280177485
Greencard Mtaani,https://btcmap.org/merchant/node:12255259652
RonnieFund,https://btcmap.org/merchant/node:12280168473
Obadia Nyaenda,https://btcmap.org/merchant/node:12254733210
Kera Transport,https://btcmap.org/merchant/node:12254728433
Felix,https://btcmap.org/merchant/node:12254728431
Mama Design,https://btcmap.org/merchant/node:12254678587
Calisto Enterprise,https://btcmap.org/merchant/node:12253101509
Kevo DS Station,https://btcmap.org/merchant/node:12254686388
For People Forever LTD,https://btcmap.org/merchant/node:12254728432
Fishpoint Eateries,https://btcmap.org/merchant/node:12254752062
Spira,https://btcmap.org/merchant/node:12168076295
Dess Gaming,https://btcmap.org/merchant/node:12165688182`;

// Parse CSV into map
const btcMapLinks = new Map();
csvData.split('\n').forEach(line => {
  const [name, url] = line.split(',').map(s => s.trim());
  if (name && url) {
    const nodeId = url.match(/node:(\d+)/)?.[1];
    if (nodeId) {
      btcMapLinks.set(name.toLowerCase(), { url, nodeId });
    }
  }
});

console.log(`Parsed ${btcMapLinks.size} merchant links from CSV\n`);

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
 * Get coordinates for a node ID from BTCMap data
 */
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

/**
 * Fuzzy match merchant name to CSV names
 */
function findBTCMapLink(businessName) {
  const normalized = businessName.toLowerCase().trim();
  
  // Direct match
  if (btcMapLinks.has(normalized)) {
    return btcMapLinks.get(normalized);
  }
  
  // Try common variations
  const variations = [
    normalized.replace(/\s*\(aka[^)]+\)/gi, '').trim(), // Remove (aka ...) 
    normalized.replace(/\s*\([^)]+\)/g, '').trim(), // Remove all parentheses
    normalized.replace('&', 'and'),
    normalized.replace("'s", 's'),
    normalized.split('(')[0].trim(), // Everything before first parenthesis
  ];
  
  for (const variant of variations) {
    if (btcMapLinks.has(variant)) {
      return btcMapLinks.get(variant);
    }
  }
  
  // Partial match - find if CSV name is contained in business name or vice versa
  for (const [csvName, link] of btcMapLinks.entries()) {
    if (normalized.includes(csvName) || csvName.includes(normalized)) {
      return link;
    }
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
    console.log('✓ Connected to database\n');

    // Get all merchants from database
    const [merchants] = await connection.execute(`
      SELECT id, business_name, latitude, longitude, osm_node_id
      FROM merchant_submissions
      WHERE status = 'published'
      ORDER BY business_name
    `);

    console.log(`Found ${merchants.length} published merchants\n`);
    console.log('='.repeat(80));

    let updated = 0;
    let alreadyCorrect = 0;
    let notFound = 0;

    for (const merchant of merchants) {
      console.log(`\n${merchant.business_name}`);
      
      const btcMapLink = findBTCMapLink(merchant.business_name);
      
      if (!btcMapLink) {
        console.log(`  ✗ No BTCMap link found`);
        notFound++;
        continue;
      }
      
      console.log(`  → Found BTCMap link: ${btcMapLink.url}`);
      
      const coords = getCoordinatesForNode(btcMapLink.nodeId, btcMapElements);
      
      if (!coords) {
        console.log(`  ✗ Could not fetch coordinates from BTCMap API`);
        notFound++;
        continue;
      }
      
      console.log(`  → Coordinates: ${coords.latitude}, ${coords.longitude}`);
      
      // Check if already has correct coordinates
      if (merchant.latitude === coords.latitude && merchant.longitude === coords.longitude) {
        console.log(`  ✓ Already has correct coordinates`);
        alreadyCorrect++;
        continue;
      }
      
      // Update database
      await connection.execute(`
        UPDATE merchant_submissions
        SET latitude = ?, longitude = ?, osm_node_id = ?
        WHERE id = ?
      `, [coords.latitude, coords.longitude, `node:${btcMapLink.nodeId}`, merchant.id]);
      
      console.log(`  ✓ UPDATED from (${merchant.latitude}, ${merchant.longitude}) to (${coords.latitude}, ${coords.longitude})`);
      updated++;
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\nSummary:`);
    console.log(`  Total merchants: ${merchants.length}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Already correct: ${alreadyCorrect}`);
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
