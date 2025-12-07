import { executeQuery } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

async function updateMerchantsWithBTCMapLinks() {
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'Merchants Link(Sheet1).csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').slice(3); // Skip header rows

    const csvMerchants: { name: string; nodeId: string }[] = [];
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts[0] && parts[1]) {
        const name = parts[0].trim();
        const url = parts[1].trim();
        if (name && url && url.includes('btcmap.org/merchant/node:')) {
          // Extract node ID from URL: https://btcmap.org/merchant/node:12300475666
          const match = url.match(/node:(\d+)/);
          if (match) {
            csvMerchants.push({ name, nodeId: match[1] });
          }
        }
      }
    });

    console.log(`\n📊 Found ${csvMerchants.length} merchants with BTCMap node IDs in CSV\n`);

    // Get all merchants from database
    const dbMerchants = await executeQuery<any[]>(
      'SELECT id, business_name, osm_node_id, is_early_adopter, status FROM merchant_submissions'
    );

    console.log(`📊 Database has ${dbMerchants.length} total merchants\n`);

    // Normalize names for matching
    const normalizeName = (name: string) => {
      return name.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();
    };

    // Create lookup map from CSV
    const csvMap = new Map<string, string>();
    csvMerchants.forEach(m => {
      csvMap.set(normalizeName(m.name), m.nodeId);
    });

    let updatedCount = 0;
    let markedEarlyAdopter = 0;
    let removedEarlyAdopter = 0;

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔄 UPDATING MERCHANTS WITH BTCMAP NODE IDs');
    console.log('═══════════════════════════════════════════════════════════\n');

    for (const merchant of dbMerchants) {
      const normalizedDbName = normalizeName(merchant.business_name);
      const nodeId = csvMap.get(normalizedDbName);

      if (nodeId) {
        // Merchant has BTCMap link - update node ID and mark as early adopter
        const needsUpdate = merchant.osm_node_id !== nodeId || !merchant.is_early_adopter;

        if (needsUpdate) {
          await executeQuery(
            `UPDATE merchant_submissions
             SET osm_node_id = ?,
                 is_early_adopter = 1,
                 btcmap_synced = 1
             WHERE id = ?`,
            [nodeId, merchant.id]
          );

          console.log(`✅ ${merchant.business_name}`);
          console.log(`   Node ID: ${nodeId}`);
          console.log(`   BTCMap: https://btcmap.org/merchant/node:${nodeId}`);
          console.log(`   Status: ${merchant.status} → Early Adopter: Yes`);
          console.log('');

          updatedCount++;
          if (!merchant.is_early_adopter) {
            markedEarlyAdopter++;
          }
        }
      } else if (merchant.is_early_adopter && !merchant.osm_node_id) {
        // Merchant is marked as early adopter but has no BTCMap link - remove early adopter status
        await executeQuery(
          `UPDATE merchant_submissions
           SET is_early_adopter = 0
           WHERE id = ?`,
          [merchant.id]
        );

        console.log(`❌ ${merchant.business_name}`);
        console.log(`   Removed Early Adopter status (no BTCMap link)`);
        console.log(`   Status: ${merchant.status}`);
        console.log('');

        removedEarlyAdopter++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ UPDATE COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Updated with node IDs: ${updatedCount}`);
    console.log(`Marked as Early Adopters: ${markedEarlyAdopter}`);
    console.log(`Removed Early Adopter status: ${removedEarlyAdopter}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Now check for merchants in CSV but not in database
    const dbNameSet = new Set(dbMerchants.map(m => normalizeName(m.business_name)));
    const missingMerchants = csvMerchants.filter(csvM => !dbNameSet.has(normalizeName(csvM.name)));

    if (missingMerchants.length > 0) {
      console.log('\n⚠️  MERCHANTS IN CSV BUT NOT IN DATABASE:');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('These merchants need to register through the website:\n');

      missingMerchants.forEach((m, i) => {
        console.log(`${i + 1}. ${m.name}`);
        console.log(`   BTCMap: https://btcmap.org/merchant/node:${m.nodeId}`);
        console.log('');
      });
    }

    // Final verification
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 FINAL STATISTICS:');
    console.log('═══════════════════════════════════════════════════════════');

    const finalStats = await executeQuery<any[]>(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_early_adopter = 1 THEN 1 ELSE 0 END) as early_adopters,
        SUM(CASE WHEN osm_node_id IS NOT NULL THEN 1 ELSE 0 END) as with_btcmap,
        SUM(CASE WHEN is_early_adopter = 1 AND osm_node_id IS NOT NULL THEN 1 ELSE 0 END) as early_with_map
      FROM merchant_submissions`
    );

    const stats = finalStats[0];
    console.log(`Total merchants: ${stats.total}`);
    console.log(`Early Adopters: ${stats.early_adopters}`);
    console.log(`With BTCMap links: ${stats.with_btcmap}`);
    console.log(`Early Adopters with BTCMap: ${stats.early_with_map}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateMerchantsWithBTCMapLinks();
