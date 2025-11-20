/**
 * Script to fix coordinates for the 32 merchants that failed to import
 * Fetches coordinates directly from BTCMap API and re-attempts import
 */

const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Database connection
const dbConfig = {
  host: 'mdawidahomestay.com',
  port: 3306,
  user: 'mdawidah_afribit',
  password: 'G5H1t_cAsvIA',
  database: 'mdawidah_afribit'
};

// Merchants that failed (from error logs)
const failedMerchants = [
  "3 West Collection",
  "Shine Magicians",
  "Usafi Boys Initiative",
  "Damiano Fast Foods",
  "Kevin Entertainment Square",
  "BLACK AND WHITE (aka Kibra BTC Shop)",
  "Swahili Dishes",
  "Livegreat Foundation (Yummy Tummy Goodies)",
  "Krezzy Kicks",
  "Delivery (BodaBoda)",
  "Kevin DS arena",
  "Bodaboda (Nyabuto Kennedy)",
  "Jewelry Arts",
  "Nyale Nuts",
  "Kunta Natural Products",
  "Vincent Boda Boda",
  "Habil Print & Photo Hub",
  "Goreti Greens Shop",
  "Mama Clear Grocery",
  "Kanana Boda Boda",
  "Golden Heart Youth Group",
  "Venla Very Retail Shop",
  "Night Salon",
  "Mama Eddy's Salon",
  "Obado Agure BodaBoda",
  "Mlosho BodaBoda",
  "Mama Noony Mini Shop",
  "Sammy Ouma BodaBoda",
  "Caro Public Washroom (Biogas)",
  "Bridgeway Shop",
  "Kera BodaBoda",
  "OneTouch BodaBoda"
];

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
 * Fuzzy match merchant name in BTCMap data
 */
function findMerchantInBTCMap(businessName, btcMapElements) {
  // Normalize business name
  const normalized = businessName.toLowerCase()
    .replace(/\(aka[^)]+\)/g, '') // Remove (aka ...) parts
    .replace(/\([^)]+\)/g, '') // Remove other parentheses
    .replace(/\s+/g, '') // Remove spaces
    .trim();

  console.log(`  Searching for: "${businessName}" (normalized: "${normalized}")`);

  // Try exact match
  for (const element of btcMapElements) {
    if (!element.osm_json || !element.osm_json.tags) continue;

    const tagName = element.osm_json.tags.name || element.osm_json.tags['payment:lightning_contactless'] || '';
    const name = tagName.toLowerCase().replace(/\s+/g, '');
    if (name === normalized) {
      console.log(`  ✓ Found exact match: ${tagName}`);
      return {
        latitude: element.osm_json.lat,
        longitude: element.osm_json.lon,
        osmNodeId: element.id,
        matchedName: tagName
      };
    }
  }

  // Try partial match
  for (const element of btcMapElements) {
    if (!element.osm_json || !element.osm_json.tags) continue;

    const tagName = element.osm_json.tags.name || element.osm_json.tags['payment:lightning_contactless'] || '';
    const name = tagName.toLowerCase().replace(/\s+/g, '');
    if (name && (name.includes(normalized) || normalized.includes(name))) {
      console.log(`  ≈ Found partial match: ${tagName}`);
      return {
        latitude: element.osm_json.lat,
        longitude: element.osm_json.lon,
        osmNodeId: element.id,
        matchedName: tagName
      };
    }
  }

  console.log(`  ✗ No match found`);
  return null;
}

async function main() {
  let connection;

  try {
    console.log('Fetching BTCMap data...\n');
    const btcMapElements = await fetchAllBTCMapElements();
    console.log(`✓ Fetched ${btcMapElements.length} BTCMap elements\n`);
    console.log('='.repeat(80));

    let found = 0;
    let notFound = 0;
    const results = [];

    for (const merchantName of failedMerchants) {
      const coords = findMerchantInBTCMap(merchantName, btcMapElements);

      if (coords) {
        results.push({
          name: merchantName,
          matchedName: coords.matchedName,
          latitude: coords.latitude,
          longitude: coords.longitude,
          osmNodeId: coords.osmNodeId
        });
        found++;
      } else {
        results.push({
          name: merchantName,
          latitude: null,
          longitude: null,
          osmNodeId: null
        });
        notFound++;
      }
      console.log('');
    }

    console.log('='.repeat(80));
    console.log(`\nSummary:`);
    console.log(`  Found: ${found}`);
    console.log(`  Not found: ${notFound}`);
    console.log(`  Total: ${failedMerchants.length}\n`);

    // Show results
    console.log('Results:\n');
    results.forEach(r => {
      if (r.latitude) {
        console.log(`✓ ${r.name}`);
        console.log(`  Matched: "${r.matchedName}"`);
        console.log(`  Coordinates: ${r.latitude}, ${r.longitude}`);
        console.log(`  OSM Node: ${r.osmNodeId}\n`);
      } else {
        console.log(`✗ ${r.name} - NO COORDINATES FOUND\n`);
      }
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
