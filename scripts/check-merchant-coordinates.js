/**
 * Diagnostic script to check which merchants have coordinates and which don't
 */

const { MERCHANTS } = require('../lib/merchants-data.ts');

console.log('Merchant Coordinate Status:\n');
console.log('='.repeat(80));

let withCoords = 0;
let withoutCoords = 0;

MERCHANTS.forEach((merchant, index) => {
  const hasCoords = merchant.latitude !== undefined && merchant.longitude !== undefined;

  if (hasCoords) {
    console.log(`✓ ${merchant.businessName}`);
    console.log(`  Lat: ${merchant.latitude}, Lng: ${merchant.longitude}`);
    withCoords++;
  } else {
    console.log(`✗ ${merchant.businessName} - MISSING COORDINATES`);
    withoutCoords++;
  }
});

console.log('\n' + '='.repeat(80));
console.log(`Total merchants: ${MERCHANTS.length}`);
console.log(`With coordinates: ${withCoords}`);
console.log(`Without coordinates: ${withoutCoords}`);
