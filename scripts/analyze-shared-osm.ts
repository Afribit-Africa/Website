import { executeQuery } from '../lib/db';

async function main() {
  const merchants = await executeQuery<any[]>(
    `SELECT business_name, latitude, longitude, lightning_address, osm_node_id 
     FROM merchant_submissions 
     WHERE osm_node_id = '12300469782' 
     AND status = 'published' 
     ORDER BY business_name`
  );

  console.log('Merchants sharing OSM node 12300469782:\n');
  merchants.forEach(m => {
    console.log(`- ${m.business_name}`);
    console.log(`  GPS: ${m.latitude}, ${m.longitude}`);
    console.log(`  Lightning: ${m.lightning_address || 'none'}\n`);
  });
  
  console.log(`Total: ${merchants.length} merchants\n`);
  
  // Calculate distances between them
  console.log('Distance analysis:');
  for (let i = 0; i < merchants.length - 1; i++) {
    const m1 = merchants[i];
    const lat1 = parseFloat(m1.latitude);
    const lon1 = parseFloat(m1.longitude);
    
    for (let j = i + 1; j < merchants.length; j++) {
      const m2 = merchants[j];
      const lat2 = parseFloat(m2.latitude);
      const lon2 = parseFloat(m2.longitude);
      
      // Haversine formula
      const R = 6371e3;
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lon2 - lon1) * Math.PI / 180;
      
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      console.log(`  ${m1.business_name} ↔ ${m2.business_name}: ${distance.toFixed(0)}m`);
    }
  }
}

main().catch(console.error);
