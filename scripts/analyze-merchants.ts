import { executeQuery } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

async function analyzeMerchants() {
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'Merchants Link(Sheet1).csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').slice(3); // Skip header rows

    const csvMerchants: { name: string; url: string }[] = [];
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts[0] && parts[1]) {
        const name = parts[0].trim();
        const url = parts[1].trim();
        if (name && url && url.includes('btcmap.org')) {
          csvMerchants.push({ name, url });
        }
      }
    });

    console.log(`\n📊 CSV FILE: Found ${csvMerchants.length} merchants with BTCMap links\n`);

    // Get merchants from database
    const dbMerchants = await executeQuery<any[]>(
      `SELECT
        id,
        business_name,
        osm_node_id,
        status,
        is_early_adopter,
        adopter_number
      FROM merchant_submissions
      ORDER BY business_name`
    );

    console.log(`📊 DATABASE: Found ${dbMerchants.length} total merchants`);
    const approvedMerchants = dbMerchants.filter(m => m.status === 'approved');
    console.log(`✅ APPROVED: ${approvedMerchants.length} merchants\n`);

    // Normalize names for comparison
    const normalizeName = (name: string) => {
      return name.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();
    };

    // Create lookup maps
    const dbNameMap = new Map<string, any>();
    const dbNodeIdMap = new Map<string, any>();

    dbMerchants.forEach(m => {
      const normalizedName = normalizeName(m.business_name);
      dbNameMap.set(normalizedName, m);
      if (m.osm_node_id) {
        const nodeUrl = `https://btcmap.org/merchant/node:${m.osm_node_id}`;
        dbNodeIdMap.set(nodeUrl, m);
      }
    });

    // Find missing merchants
    const missingMerchants: typeof csvMerchants = [];
    const foundMerchants: Array<{ csv: string; db: string; url: string }> = [];

    csvMerchants.forEach(csvM => {
      const normalizedCsvName = normalizeName(csvM.name);

      // Try to find by URL first (most accurate)
      const foundByUrl = dbNodeIdMap.get(csvM.url);

      // Try to find by name
      const foundByName = dbNameMap.get(normalizedCsvName);

      if (foundByUrl) {
        foundMerchants.push({
          csv: csvM.name,
          db: foundByUrl.business_name,
          url: csvM.url
        });
      } else if (foundByName) {
        foundMerchants.push({
          csv: csvM.name,
          db: foundByName.business_name,
          url: csvM.url
        });
      } else {
        missingMerchants.push(csvM);
      }
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ MATCHED: ${foundMerchants.length} merchants found in database`);
    console.log('═══════════════════════════════════════════════════════════\n');

    if (missingMerchants.length > 0) {
      console.log('❌ MISSING FROM DATABASE: ' + missingMerchants.length + ' merchants');
      console.log('═══════════════════════════════════════════════════════════\n');
      missingMerchants.forEach((m, i) => {
        console.log(`${i + 1}. ${m.name}`);
        console.log(`   BTCMap: ${m.url}`);
        console.log('');
      });
    } else {
      console.log('🎉 ALL CSV MERCHANTS ARE IN THE DATABASE!\n');
    }

    // Show merchants in DB but not in CSV
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 MERCHANTS IN DATABASE BUT NOT IN CSV FILE:');
    console.log('═══════════════════════════════════════════════════════════\n');

    const csvUrlSet = new Set(csvMerchants.map(m => m.url));
    const csvNameSet = new Set(csvMerchants.map(m => normalizeName(m.name)));

    const dbOnlyMerchants = dbMerchants.filter(m => {
      if (!m.osm_node_id) return true; // No BTCMap URL at all

      const nodeUrl = `https://btcmap.org/merchant/node:${m.osm_node_id}`;
      const hasUrl = csvUrlSet.has(nodeUrl);
      const hasName = csvNameSet.has(normalizeName(m.business_name));
      return !hasUrl && !hasName;
    });

    if (dbOnlyMerchants.length > 0) {
      dbOnlyMerchants.forEach((m, i) => {
        console.log(`${i + 1}. ${m.business_name}`);
        console.log(`   Status: ${m.status}`);
        const btcmapUrl = m.osm_node_id ? `https://btcmap.org/merchant/node:${m.osm_node_id}` : 'NO URL';
        console.log(`   BTCMap: ${btcmapUrl}`);
        console.log(`   Early Adopter: ${m.is_early_adopter ? 'Yes (#' + m.adopter_number + ')' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('None - All database merchants are in the CSV\n');
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`CSV Merchants: ${csvMerchants.length}`);
    console.log(`Database Merchants: ${dbMerchants.length} (${approvedMerchants.length} approved)`);
    console.log(`Matched: ${foundMerchants.length}`);
    console.log(`Missing from DB: ${missingMerchants.length}`);
    console.log(`In DB but not CSV: ${dbOnlyMerchants.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

analyzeMerchants();
