import { executeQuery } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

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
      'payment:lightning_contactless'?: string;
    };
  };
}

async function fetchBTCMapData(nodeId: string): Promise<BTCMapMerchant | null> {
  try {
    const response = await fetch(`https://api.btcmap.org/v2/elements/node:${nodeId}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function importMissingMerchants() {
  try {
    // Read CSV
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

    // Get existing merchants
    const dbMerchants = await executeQuery<any[]>(
      'SELECT business_name FROM merchant_submissions'
    );

    const normalizeName = (name: string) => {
      return name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    };

    const dbNameSet = new Set(dbMerchants.map(m => normalizeName(m.business_name)));
    const missingMerchants = csvMerchants.filter(csvM => !dbNameSet.has(normalizeName(csvM.name)));

    console.log(`\n📊 Found ${missingMerchants.length} merchants to import\n`);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌍 IMPORTING MISSING MERCHANTS FROM BTCMAP');
    console.log('═══════════════════════════════════════════════════════════\n');

    let importedCount = 0;
    let errorCount = 0;

    for (const merchant of missingMerchants) {
      console.log(`\n📍 ${merchant.name}`);
      console.log(`   Node ID: ${merchant.nodeId}`);

      // Fetch data from BTCMap
      const btcmapData = await fetchBTCMapData(merchant.nodeId);

      if (!btcmapData || !btcmapData.osm_json) {
        console.log(`   ❌ Failed to fetch BTCMap data`);
        errorCount++;
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }

      const { lat, lon, tags } = btcmapData.osm_json;

      if (!lat || !lon) {
        console.log(`   ❌ No coordinates in BTCMap data`);
        errorCount++;
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }

      console.log(`   ✅ Location: ${lat}, ${lon}`);

      // Prepare merchant data
      const merchantId = randomUUID();
      const businessName = tags.name || merchant.name;
      const phone = tags['contact:phone'] || '';
      const website = tags['contact:website'] || '';
      const openingHours = tags.opening_hours || '';
      const paymentOnchain = tags['payment:bitcoin'] === 'yes' ? 1 : 0;
      const paymentLightning = tags['payment:lightning'] === 'yes' ? 1 : 0;
      const paymentLightningContactless = tags['payment:lightning_contactless'] === 'yes' ? 1 : 0;

      // Insert merchant
      await executeQuery(
        `INSERT INTO merchant_submissions (
          id, business_name, category_key, category_value,
          latitude, longitude, address,
          phone, website, opening_hours,
          payment_onchain, payment_lightning, payment_lightning_contactless,
          status, osm_node_id, btcmap_synced,
          is_early_adopter, submitted_at, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          merchantId,
          businessName,
          'other', // default category
          'Other',
          lat,
          lon,
          tags['addr:street'] || 'Kibera, Nairobi',
          phone,
          website,
          openingHours,
          paymentOnchain,
          paymentLightning,
          paymentLightningContactless,
          'published', // auto-publish since they're on BTCMap
          merchant.nodeId,
          1, // btcmap_synced
          1  // is_early_adopter
        ]
      );

      console.log(`   ✅ Imported as early adopter`);
      console.log(`   Payment: ${paymentLightning ? 'Lightning' : ''}${paymentOnchain ? ' On-chain' : ''}`);

      importedCount++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ IMPORT COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Successfully imported: ${importedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Final stats
    const finalStats = await executeQuery<any[]>(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_early_adopter = 1 THEN 1 ELSE 0 END) as early_adopters,
        SUM(CASE WHEN osm_node_id IS NOT NULL THEN 1 ELSE 0 END) as with_btcmap,
        SUM(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 ELSE 0 END) as with_coords
      FROM merchant_submissions`
    );

    const stats = finalStats[0];
    console.log('📊 FINAL STATISTICS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total merchants: ${stats.total}`);
    console.log(`Early Adopters: ${stats.early_adopters}`);
    console.log(`With BTCMap links: ${stats.with_btcmap}`);
    console.log(`With coordinates: ${stats.with_coords}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importMissingMerchants();
