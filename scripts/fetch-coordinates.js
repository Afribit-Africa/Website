/**
 * Fetch merchant coordinates from OpenStreetMap API
 * 
 * This script reads BTCMap merchant links from CSV, extracts OSM node IDs,
 * fetches lat/long coordinates from OSM API, and outputs formatted data.
 */

const fs = require('fs');
const path = require('path');

// Merchant data from CSV (node:ID extracted from BTCMap URLs)
const merchants = [
  { name: "MUANZO MPYA ORGANISATION", nodeId: "12300475666" },
  { name: "BLACK AND WHITE", nodeId: "12300467146" },
  { name: "JOSEPH PUBLIC WASHROOM", nodeId: "12300462657" },
  { name: "KHEEZONIX FASHIONS AND STYLES", nodeId: "12300462658" },
  { name: "BIOGAS PUBLIC WASHROOMS", nodeId: "12300462655" },
  { name: "ABUKI DISTRIBUTORS", nodeId: "12300462656" },
  { name: "Yummytummygoodies", nodeId: "12167701319" },
  { name: "3WEST BUTCHERY", nodeId: "12300469780" },
  { name: "Kibera the Largest slum tour", nodeId: "12300469783" },
  { name: "Evalyncafeterian", nodeId: "12700628232" },
  { name: "ABEBO VEGEZ", nodeId: "12300439008" },
  { name: "MAMA NONNY SHOP", nodeId: "12300462946" },
  { name: "Domiano Fast foods", nodeId: "12700702059" },
  { name: "Wamboya", nodeId: "12700702058" },
  { name: "ACGassuppliers", nodeId: "12700702057" },
  { name: "GalaxyToilets", nodeId: "12700702056" },
  { name: "Mama Clinton Groceries", nodeId: "12700702055" },
  { name: "Fred Collections", nodeId: "12700702054" },
  { name: "Arca Tech Services", nodeId: "12300515181" },
  { name: "Maji safi", nodeId: "12300469782" },
  { name: "WERE TOURS", nodeId: "12300462913" },
  { name: "WILSON ASWETO", nodeId: "12300443594" },
  { name: "ELIJAH DRAXLER", nodeId: "12300443592" },
  { name: "MOSESO RIDES", nodeId: "12300433274" },
  { name: "CHARLIE RIDER", nodeId: "12300433273" },
  { name: "BIG BROTHER CAR WASH", nodeId: "12300417204" },
  { name: "Unique Barber Shop", nodeId: "12254721499" },
  { name: "Shiko's Ferments", nodeId: "12281745878" },
  { name: "Kosmos Solutions LTD", nodeId: "12281743822" },
  { name: "Outdoor Kids Kenya", nodeId: "12281727715" },
  { name: "Njema Safaris", nodeId: "12280177485" },
  { name: "Greencard Mtaani", nodeId: "12255259652" },
  { name: "RonnieFund", nodeId: "12280168473" },
  { name: "Obadia Nyaenda", nodeId: "12254733210" },
  { name: "Kera Transport", nodeId: "12254728433" },
  { name: "Felix", nodeId: "12254728431" },
  { name: "Mama Design", nodeId: "12254678587" },
  { name: "Calisto Enterprise", nodeId: "12253101509" },
  { name: "Kevo DS Station", nodeId: "12254686388" },
  { name: "For People Forever LTD", nodeId: "12254728432" },
  { name: "Fishpoint Eateries", nodeId: "12254752062" },
  { name: "Spira", nodeId: "12168076295" },
  { name: "Dess Gaming", nodeId: "12165688182" }
];

// OpenStreetMap API endpoint
const OSM_API_BASE = 'https://api.openstreetmap.org/api/0.6';

// Delay between API calls (milliseconds) - OSM requests reasonable usage
const DELAY_MS = 1000;

/**
 * Fetch node data from OpenStreetMap API
 */
async function fetchNodeData(nodeId) {
  const url = `${OSM_API_BASE}/node/${nodeId}.json`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // OSM JSON format: { elements: [{ type: "node", id: X, lat: Y, lon: Z, ... }] }
    if (data.elements && data.elements.length > 0) {
      const node = data.elements[0];
      return {
        lat: node.lat,
        lon: node.lon,
        tags: node.tags || {}
      };
    }
    
    throw new Error('No node data found');
  } catch (error) {
    console.error(`Error fetching node ${nodeId}:`, error.message);
    return null;
  }
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main execution
 */
async function main() {
  console.log(`Fetching coordinates for ${merchants.length} merchants...\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < merchants.length; i++) {
    const merchant = merchants[i];
    console.log(`[${i + 1}/${merchants.length}] Fetching: ${merchant.name}`);
    
    const nodeData = await fetchNodeData(merchant.nodeId);
    
    if (nodeData) {
      results.push({
        name: merchant.name,
        nodeId: merchant.nodeId,
        latitude: nodeData.lat,
        longitude: nodeData.lon,
        btcMapUrl: `https://btcmap.org/merchant/node:${merchant.nodeId}`
      });
      console.log(`  ✓ ${nodeData.lat}, ${nodeData.lon}`);
      successCount++;
    } else {
      console.log(`  ✗ Failed to fetch coordinates`);
      failCount++;
    }
    
    // Rate limiting: wait between requests
    if (i < merchants.length - 1) {
      await sleep(DELAY_MS);
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total: ${merchants.length}`);
  
  // Save results to JSON file
  const outputPath = path.join(__dirname, 'merchant-coordinates.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputPath}`);
  
  // Generate TypeScript code for btcMapLinks
  console.log('\n=== TypeScript Code for lib/merchants-data.ts ===\n');
  console.log('export const btcMapLinks: Record<string, { url: string; latitude?: number; longitude?: number }> = {');
  
  results.forEach((merchant, index) => {
    const key = merchant.name.replace(/'/g, "\\'");
    console.log(`  '${key}': {`);
    console.log(`    url: '${merchant.btcMapUrl}',`);
    console.log(`    latitude: ${merchant.latitude},`);
    console.log(`    longitude: ${merchant.longitude}`);
    console.log(`  }${index < results.length - 1 ? ',' : ''}`);
  });
  
  console.log('};');
}

// Run the script
main().catch(console.error);
