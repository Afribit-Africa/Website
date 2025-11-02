/**
 * Script to fetch GPS coordinates from BTCMap API and update merchant data
 * Run this script to populate latitude/longitude for all merchants
 * 
 * Usage: node scripts/update-coordinates.js
 */

const fs = require('fs');
const path = require('path');

// BTCMap API endpoint
const BTCMAP_API_URL = 'https://api.btcmap.org/v2/elements';

/**
 * Extract node ID from BTCMap URL
 */
function extractNodeId(btcMapUrl) {
  const match = btcMapUrl.match(/node:(\d+)/);
  return match ? match[1] : null;
}

/**
 * Fetch all elements from BTCMap API
 */
async function fetchAllBTCMapElements() {
  try {
    console.log('Fetching data from BTCMap API...');
    const response = await fetch(BTCMAP_API_URL);
    if (!response.ok) {
      throw new Error(`BTCMap API error: ${response.status}`);
    }
    const data = await response.json();
    console.log(`✓ Fetched ${data.length} elements from BTCMap\n`);
    return data;
  } catch (error) {
    console.error('Error fetching BTCMap elements:', error);
    throw error;
  }
}

/**
 * Main function to update coordinates
 */
async function updateCoordinates() {
  try {
    // Read the merchants data file
    const merchantsFilePath = path.join(__dirname, '..', 'lib', 'merchants-data.ts');
    let merchantsContent = fs.readFileSync(merchantsFilePath, 'utf-8');
    
    // Fetch all BTCMap elements
    const elements = await fetchAllBTCMapElements();
    
    // Create a map of node IDs to coordinates
    const coordsMap = new Map();
    elements.forEach(element => {
      if (element.id && element.osm_json) {
        const nodeId = element.id.replace('node:', '');
        coordsMap.set(nodeId, {
          latitude: element.osm_json.lat,
          longitude: element.osm_json.lon
        });
      }
    });
    
    console.log(`✓ Processed ${coordsMap.size} coordinates from BTCMap\n`);
    
    // Extract all BTCMap URLs from btcMapLinks
    const urlMatches = [...merchantsContent.matchAll(/"([^"]+)":\s*"https:\/\/btcmap\.org\/merchant\/node:(\d+)"/g)];
    let updatedCount = 0;
    let notFoundCount = 0;
    
    console.log(`Found ${urlMatches.length} BTCMap links to process:\n`);
    
    for (const match of urlMatches) {
      const businessName = match[1];
      const nodeId = match[2];
      const coords = coordsMap.get(nodeId);
      
      if (coords) {
        // Create the new line with coordinates that will be added
        const coordsLine = `  "${businessName}": { url: "https://btcmap.org/merchant/node:${nodeId}", latitude: ${coords.latitude}, longitude: ${coords.longitude} },`;
        const oldLine = `  "${businessName}": "https://btcmap.org/merchant/node:${nodeId}",`;
        
        // Replace the old line with the new one
        if (merchantsContent.includes(oldLine)) {
          merchantsContent = merchantsContent.replace(oldLine, coordsLine);
          console.log(`  ✓ ${businessName}: Added coordinates (${coords.latitude}, ${coords.longitude})`);
          updatedCount++;
        }
      } else {
        console.log(`  ✗ ${businessName} (node ${nodeId}): Not found in BTCMap data`);
        notFoundCount++;
      }
    }
    
    // Update the btcMapLinks type and access pattern
    // Change Record<string, string> to Record<string, string | { url: string; latitude: number; longitude: number }>
    merchantsContent = merchantsContent.replace(
      'const btcMapLinks: Record<string, string> = {',
      'const btcMapLinks: Record<string, string | { url: string; latitude: number; longitude: number }> = {'
    );
    
    // Update the code that accesses btcMapUrl
    const accessPattern = `  let btcMapUrl = btcMapLinks[merchant.businessName];`;
    const newAccessPattern = `  let btcMapUrl: string | undefined;
  let latitude: number | undefined;
  let longitude: number | undefined;
  
  const btcMapData = btcMapLinks[merchant.businessName];
  if (typeof btcMapData === 'string') {
    btcMapUrl = btcMapData;
  } else if (btcMapData) {
    btcMapUrl = btcMapData.url;
    latitude = btcMapData.latitude;
    longitude = btcMapData.longitude;
  }`;
    
    merchantsContent = merchantsContent.replace(accessPattern, newAccessPattern);
    
    // Update the similar code in the variations loop
    merchantsContent = merchantsContent.replace(
      /if \(btcMapLinks\[variation\]\) \{\s+btcMapUrl = btcMapLinks\[variation\];\s+break;\s+\}/g,
      `if (btcMapLinks[variation]) {
        const data = btcMapLinks[variation];
        if (typeof data === 'string') {
          btcMapUrl = data;
        } else {
          btcMapUrl = data.url;
          latitude = data.latitude;
          longitude = data.longitude;
        }
        break;
      }`
    );
    
    // Update the return statement to include latitude and longitude
    merchantsContent = merchantsContent.replace(
      /return \{\s+id: `merchant-\$\{index \+ 1\}`,\s+businessName: merchant\.businessName,\s+ownerName: merchant\.ownerName,\s+email: merchant\.email === 'N\/A' \|\| merchant\.email === '–' \? '' : merchant\.email,\s+phoneNumber: merchant\.phoneNumber === '–' \? '' : merchant\.phoneNumber,\s+location: merchant\.location,\s+blinkAddress: merchant\.blinkAddress,\s+btcMapUrl,\s+btcMapNodeId,\s+slug,\s+category,\s+description:/,
      `return {
    id: \`merchant-\${index + 1}\`,
    businessName: merchant.businessName,
    ownerName: merchant.ownerName,
    email: merchant.email === 'N/A' || merchant.email === '–' ? '' : merchant.email,
    phoneNumber: merchant.phoneNumber === '–' ? '' : merchant.phoneNumber,
    location: merchant.location,
    blinkAddress: merchant.blinkAddress,
    btcMapUrl,
    btcMapNodeId,
    latitude,
    longitude,
    slug,
    category,
    description:`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(merchantsFilePath, merchantsContent, 'utf-8');
    
    console.log(`\n✓ Updated ${updatedCount} merchants with coordinates`);
    if (notFoundCount > 0) {
      console.log(`⚠ ${notFoundCount} merchants not found in BTCMap data`);
    }
    console.log(`✓ File updated: ${merchantsFilePath}\n`);
    
  } catch (error) {
    console.error('Error updating coordinates:', error);
    process.exit(1);
  }
}

// Run the script
updateCoordinates();
