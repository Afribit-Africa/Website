import { executeQuery } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

interface MatchReport {
  submission: any;
  merchant: any;
  matchType: 'exact' | 'fuzzy' | 'location' | 'none';
}

async function main() {
  console.log('🔄 Starting merchant database update...\n');

  // 1. Load the match report
  const reportPath = path.join(__dirname, '..', 'backups', 'match_report_2025-12-07T12-54-09-430Z.json');
  const matches: MatchReport[] = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  console.log(`📋 Loaded ${matches.length} matches from report\n`);

  // 2. Get list of matched merchant IDs (these will be updated)
  const matchedMerchantIds = matches
    .filter(m => m.merchant !== null)
    .map(m => m.merchant.id);

  console.log('Matched merchant IDs to be updated:', matchedMerchantIds.length);

  // 3. Get merchants with BTCMap that are NOT in the matched list (preserve these)
  const allMerchants = await executeQuery<any[]>(
    `SELECT id, business_name, osm_node_id
     FROM merchant_submissions
     WHERE status = "published"
     AND osm_node_id IS NOT NULL`
  );

  const merchantsToPreserve = allMerchants.filter(m => !matchedMerchantIds.includes(m.id));

  console.log('\n📌 Merchants to PRESERVE (have BTCMap, not in your 20):');
  merchantsToPreserve.forEach(m => {
    console.log(`   - ${m.business_name} (OSM: ${m.osm_node_id})`);
  });

  console.log(`\nTotal preserved: ${merchantsToPreserve.length} merchants`);

  // 4. Archive old matched merchants (change status to 'archived')
  console.log('\n🗄️  Archiving old merchant data...');

  if (matchedMerchantIds.length > 0) {
    const placeholders = matchedMerchantIds.map(() => '?').join(',');
    await executeQuery(
      `UPDATE merchant_submissions
       SET status = 'archived',
           last_edited_at = NOW()
       WHERE id IN (${placeholders})`,
      matchedMerchantIds
    );
    console.log(`✅ Archived ${matchedMerchantIds.length} old merchants`);
  }

  // 5. Publish the 20 new verified submissions
  console.log('\n📤 Publishing your 20 verified submissions...');

  const submissionIds = matches.map(m => m.submission.id);
  const updatePromises = [];

  for (const match of matches) {
    const submission = match.submission;
    const oldMerchant = match.merchant;

    // Preserve BTCMap data if it existed
    const osmNodeId = oldMerchant?.osm_node_id || null;
    const osmChangesetId = oldMerchant?.osm_changeset_id || null;
    const btcmapSynced = oldMerchant?.btcmap_synced || 0;
    const isEarlyAdopter = oldMerchant?.is_early_adopter || 0;
    const adopterNumber = oldMerchant?.adopter_number || null;

    const updateQuery = executeQuery(
      `UPDATE merchant_submissions
       SET status = 'published',
           verification_status = 'verified',
           verified_by_email = 'edmundspira@gmail.com',
           verified_by_verifier_email = 'edmundspira@gmail.com',
           verified_at = NOW(),
           published_at = NOW(),
           osm_node_id = ?,
           osm_changeset_id = ?,
           btcmap_synced = ?,
           is_early_adopter = ?,
           adopter_number = ?
       WHERE id = ?`,
      [osmNodeId, osmChangesetId, btcmapSynced, isEarlyAdopter, adopterNumber, submission.id]
    );

    updatePromises.push(updateQuery);
  }

  await Promise.all(updatePromises);
  console.log(`✅ Published 20 verified merchant submissions\n`);

  // 6. Final statistics
  console.log('\n📊 FINAL DATABASE STATE:');
  console.log('═══════════════════════════════════════════════════\n');

  const stats = await executeQuery<any[]>(
    `SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN osm_node_id IS NOT NULL AND status = 'published' THEN 1 ELSE 0 END) as with_btcmap,
      SUM(CASE WHEN is_early_adopter = 1 AND status = 'published' THEN 1 ELSE 0 END) as early_adopters
     FROM merchant_submissions`
  );

  const stat = stats[0];
  console.log(`Total merchants: ${stat.total}`);
  console.log(`├─ Published: ${stat.published}`);
  console.log(`│  ├─ With BTCMap links: ${stat.with_btcmap}`);
  console.log(`│  └─ Early adopters: ${stat.early_adopters}`);
  console.log(`├─ Archived: ${stat.archived}`);
  console.log(`└─ Pending: ${stat.pending}\n`);

  // 7. Show breakdown
  console.log('Breakdown:');
  console.log(`• Your 20 verified merchants: PUBLISHED ✅`);
  console.log(`• ${merchantsToPreserve.length} merchants with BTCMap (not in your 20): PRESERVED ✅`);
  console.log(`• ${matchedMerchantIds.length} old duplicate/incorrect entries: ARCHIVED 🗄️\n`);

  // 8. List all published merchants
  const published = await executeQuery<any[]>(
    `SELECT business_name, category_value, lightning_address, osm_node_id
     FROM merchant_submissions
     WHERE status = 'published'
     ORDER BY business_name`
  );

  console.log('\n📋 All Published Merchants:');
  console.log('═══════════════════════════════════════════════════\n');
  published.forEach((m, i) => {
    const btcmap = m.osm_node_id ? `[BTCMap: ${m.osm_node_id}]` : '[No BTCMap]';
    const lightning = m.lightning_address || 'none';
    console.log(`${i + 1}. ${m.business_name}`);
    console.log(`   Category: ${m.category_value || 'unknown'}`);
    console.log(`   Lightning: ${lightning}`);
    console.log(`   ${btcmap}\n`);
  });

  console.log(`\n✅ Update complete! Database now has ${published.length} published merchants.\n`);

  // 9. Recommendations for BTCMap updates
  console.log('\n💡 RECOMMENDATIONS FOR BTCMAP:');
  console.log('═══════════════════════════════════════════════════\n');

  const needsBtcmapUpdate = matches.filter(m => m.merchant?.osm_node_id);

  if (needsBtcmapUpdate.length > 0) {
    console.log('⚠️  These merchants have BTCMap entries that may need updating:');
    console.log('    (business names or coordinates have changed)\n');

    for (const match of needsBtcmapUpdate) {
      const oldName = match.merchant.business_name;
      const newName = match.submission.business_name;
      const osmId = match.merchant.osm_node_id;

      if (oldName !== newName) {
        console.log(`   • OSM ${osmId}: "${oldName}" → "${newName}"`);
      }
    }

    console.log('\n   Options:');
    console.log('   1. Use OSM API to update these nodes (requires OSM account)');
    console.log('   2. Delete from BTCMap and re-add with correct info');
    console.log('   3. Leave as-is (minor differences)\n');
  }

  console.log('\n✅ All done! Your 20 verified merchants are now live.\n');
}

main().catch(console.error);
