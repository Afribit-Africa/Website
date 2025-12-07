import { executeQuery } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

interface BTCMapMerchant {
  id: string;
  osm_json: {
    lat: number;
    lon: number;
    tags: {
      name?: string;
      'addr:street'?: string;
      'addr:city'?: string;
      'contact:phone'?: string;
      'contact:website'?: string;
      opening_hours?: string;
      'payment:bitcoin'?: string;
      'payment:lightning'?: string;
    };
  };
}

async function fetchBTCMapData(nodeId: string): Promise<BTCMapMerchant | null> {
  try {
    const response = await fetch(`https://api.btcmap.org/v2/elements/node:${nodeId}`);
    if (!response.ok) {
      console.log(`   ⚠️  BTCMap API error for node:${nodeId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`   ⚠️  Failed to fetch node:${nodeId}:`, error);
    return null;
  }
}

async function updateMerchantsWithLocationData() {
  try {
    // Read CSV file to get BTCMap links
    const csvPath = path.join(process.cwd(), 'Merchants Link(Sheet1).csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').slice(3);

    const csvMerchants: { name: string; nodeId: string }[] = [];
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts[0] && parts[1]) {
        const name = parts[0].trim();
        const url = parts[1].trim();
        if (name && url && url.includes('btcmap.org/merchant/node:')) {
          const match = url.match(/node:(\d+)/);
          if (match) {
            csvMerchants.push({ name, nodeId: match[1] });
          }
        }
      }
    });

    console.log(`\n📊 Found ${csvMerchants.length} merchants with BTCMap links in CSV\n`);

    // Get merchants from database
    const dbMerchants = await executeQuery<any[]>(
      `SELECT id, business_name, osm_node_id, latitude, longitude
       FROM merchant_submissions
       WHERE osm_node_id IS NOT NULL OR business_name IN (${csvMerchants.map(() => '?').join(',')})`,
      csvMerchants.map(m => m.name)
    );

    console.log(`📊 Database has ${dbMerchants.length} merchants to process\n`);

    // Normalize name helper
    const normalizeName = (name: string) => {
      return name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    };

    // Create lookup map
    const csvMap = new Map<string, string>();
    csvMerchants.forEach(m => {
      csvMap.set(normalizeName(m.name), m.nodeId);
    });

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌍 FETCHING LOCATION DATA FROM BTCMAP');
    console.log('═══════════════════════════════════════════════════════════\n');

    for (const merchant of dbMerchants) {
      const normalizedName = normalizeName(merchant.business_name);
      let nodeId = merchant.osm_node_id || csvMap.get(normalizedName);

      if (!nodeId) {
        console.log(`⏭️  ${merchant.business_name} - No BTCMap node ID, skipping`);
        skippedCount++;
        continue;
      }

      console.log(`\n📍 ${merchant.business_name}`);
      console.log(`   Node ID: ${nodeId}`);
      console.log(`   Current location: ${merchant.latitude || 'none'}, ${merchant.longitude || 'none'}`);

      // Fetch data from BTCMap API
      const btcmapData = await fetchBTCMapData(nodeId);

      if (!btcmapData || !btcmapData.osm_json) {
        console.log(`   ❌ Failed to fetch BTCMap data`);
        errorCount++;
        continue;
      }

      const { lat, lon } = btcmapData.osm_json;

      if (!lat || !lon) {
        console.log(`   ❌ No coordinates in BTCMap data`);
        errorCount++;
        continue;
      }

      console.log(`   ✅ BTCMap location: ${lat}, ${lon}`);

      // Update database with location data and node ID
      await executeQuery(
        `UPDATE merchant_submissions
         SET latitude = ?,
             longitude = ?,
             osm_node_id = ?,
             btcmap_synced = 1,
             is_early_adopter = 1
         WHERE id = ?`,
        [lat, lon, nodeId, merchant.id]
      );

      console.log(`   ✅ Updated database with coordinates`);
      updatedCount++;

      // Rate limiting - wait 500ms between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ UPDATE COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Successfully updated: ${updatedCount}`);
    console.log(`⏭️  Skipped (no node ID): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Final verification
    const finalStats = await executeQuery<any[]>(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 ELSE 0 END) as with_coordinates,
        SUM(CASE WHEN osm_node_id IS NOT NULL THEN 1 ELSE 0 END) as with_node_id,
        SUM(CASE WHEN is_early_adopter = 1 THEN 1 ELSE 0 END) as early_adopters
      FROM merchant_submissions`
    );

    const stats = finalStats[0];
    console.log('📊 FINAL STATISTICS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total merchants: ${stats.total}`);
    console.log(`With coordinates: ${stats.with_coordinates}`);
    console.log(`With BTCMap node ID: ${stats.with_node_id}`);
    console.log(`Early Adopters: ${stats.early_adopters}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateMerchantsWithLocationData();
