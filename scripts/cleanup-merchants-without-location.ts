import { executeQuery } from '../lib/db';

async function cleanupMerchantsWithoutLocation() {
  try {
    // Get merchants without BTCMap node IDs (no location data)
    const merchantsWithoutLocation = await executeQuery<any[]>(
      `SELECT id, business_name, status, is_early_adopter, submitted_at
       FROM merchant_submissions
       WHERE osm_node_id IS NULL
       ORDER BY business_name`
    );

    console.log(`\n📊 Found ${merchantsWithoutLocation.length} merchants WITHOUT BTCMap location data\n`);

    if (merchantsWithoutLocation.length === 0) {
      console.log('✅ All merchants have location data. Nothing to delete.\n');
      return;
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🗑️  MERCHANTS TO BE DELETED (No BTCMap Location):');
    console.log('═══════════════════════════════════════════════════════════\n');

    merchantsWithoutLocation.forEach((m, i) => {
      console.log(`${i + 1}. ${m.business_name}`);
      console.log(`   Status: ${m.status}`);
      console.log(`   Early Adopter: ${m.is_early_adopter ? 'Yes' : 'No'}`);
      console.log(`   Submitted: ${m.submitted_at}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`⚠️  WARNING: About to delete ${merchantsWithoutLocation.length} merchants`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Delete merchants without location data
    const result = await executeQuery<any>(
      'DELETE FROM merchant_submissions WHERE osm_node_id IS NULL'
    );

    console.log(`✅ Successfully deleted ${(result as any).affectedRows || 0} merchants\n`);

    // Get final statistics
    const finalStats = await executeQuery<any[]>(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_early_adopter = 1 THEN 1 ELSE 0 END) as early_adopters,
        SUM(CASE WHEN osm_node_id IS NOT NULL THEN 1 ELSE 0 END) as with_btcmap,
        SUM(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 ELSE 0 END) as with_coords
      FROM merchant_submissions`
    );

    const stats = finalStats[0];
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 FINAL DATABASE STATISTICS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total merchants: ${stats.total}`);
    console.log(`Early Adopters: ${stats.early_adopters}`);
    console.log(`With BTCMap links: ${stats.with_btcmap}`);
    console.log(`With coordinates: ${stats.with_coords}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('✅ Cleanup complete!');
    console.log('💡 These merchants can now re-register with proper location data.\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupMerchantsWithoutLocation();
