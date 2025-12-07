import { executeQuery } from '../lib/db';

const OSM_API_URL = process.env.OSM_API_URL || 'https://master.apis.dev.openstreetmap.org/api/0.6';
const OSM_ACCESS_TOKEN = process.env.OSM_ACCESS_TOKEN;

interface Merchant {
  id: string;
  business_name: string;
  osm_node_id: string;
  contact_email: string;
}

async function deleteOSMNode(nodeId: string, businessName: string): Promise<boolean> {
  try {
    // First, get the current node data
    const getResponse = await fetch(`${OSM_API_URL}/node/${nodeId}`, {
      headers: {
        'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
      },
    });

    if (!getResponse.ok) {
      console.log(`   ⚠️  Node ${nodeId} not found or already deleted`);
      return true; // Consider it success if already deleted
    }

    const nodeXML = await getResponse.text();
    const versionMatch = nodeXML.match(/version="(\d+)"/);
    const version = versionMatch ? versionMatch[1] : '1';

    // Create changeset for deletion
    const changesetXML = `<osm>
  <changeset>
    <tag k="created_by" v="Afribit Africa Cleanup Script"/>
    <tag k="comment" v="Removing outdated merchant listings - remapping with verified data"/>
  </changeset>
</osm>`;

    const changesetResponse = await fetch(`${OSM_API_URL}/changeset/create`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
        'Content-Type': 'text/xml',
      },
      body: changesetXML,
    });

    if (!changesetResponse.ok) {
      const errorText = await changesetResponse.text();
      throw new Error(`Failed to create changeset: ${changesetResponse.status} - ${errorText}`);
    }

    const changesetId = await changesetResponse.text();

    // Delete the node
    const deleteXML = `<osm>
  <node id="${nodeId}" changeset="${changesetId}" version="${version}"/>
</osm>`;

    const deleteResponse = await fetch(`${OSM_API_URL}/node/${nodeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
        'Content-Type': 'text/xml',
      },
      body: deleteXML,
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      // Close changeset even if delete failed
      await fetch(`${OSM_API_URL}/changeset/${changesetId}/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
        },
      });
      throw new Error(`Failed to delete node: ${deleteResponse.status} - ${errorText}`);
    }

    // Close changeset
    await fetch(`${OSM_API_URL}/changeset/${changesetId}/close`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
      },
    });

    return true;
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function cleanupOldMerchants() {
  console.log('🧹 Starting cleanup of old merchant OSM nodes...\n');
  console.log(`📡 Using OSM API: ${OSM_API_URL}\n`);

  if (!OSM_ACCESS_TOKEN) {
    console.error('❌ Missing OSM_ACCESS_TOKEN. Please set it in .env.local');
    process.exit(1);
  }

  // Get all old merchants (not verified by edmundspira)
  const oldMerchants = await executeQuery(`
    SELECT id, business_name, osm_node_id, contact_email
    FROM merchant_submissions
    WHERE contact_email != 'edmundspira@gmail.com'
      AND status = 'published'
      AND osm_node_id IS NOT NULL
    ORDER BY business_name
  `) as Merchant[];

  console.log(`Found ${oldMerchants.length} old merchants to clean up:\n`);

  oldMerchants.forEach((m, i) => {
    console.log(`${i + 1}. ${m.business_name} - OSM Node ${m.osm_node_id}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('⚠️  WARNING: This will:');
  console.log('1. Delete 34 OSM nodes from OpenStreetMap');
  console.log('2. Archive these merchants in the database (status = "archived")');
  console.log('3. Keep only the 20 verified merchants');
  console.log('='.repeat(60));

  console.log('\n⏳ Starting cleanup in 5 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  let successCount = 0;
  let failCount = 0;
  const failed: string[] = [];

  for (let i = 0; i < oldMerchants.length; i++) {
    const merchant = oldMerchants[i];
    console.log(`\n[${i + 1}/${oldMerchants.length}] Processing: ${merchant.business_name}...`);
    console.log(`   OSM Node: ${merchant.osm_node_id}`);

    // Delete from OSM
    const osmDeleted = await deleteOSMNode(merchant.osm_node_id, merchant.business_name);

    if (osmDeleted) {
      console.log(`   ✅ OSM node deleted`);

      // Archive in database
      try {
        await executeQuery(
          `UPDATE merchant_submissions
           SET status = 'archived',
               osm_node_id = NULL,
               btcmap_synced = 0
           WHERE id = ?`,
          [merchant.id]
        );
        console.log(`   ✅ Archived in database`);
        successCount++;
      } catch (error: any) {
        console.log(`   ❌ Database update failed: ${error.message}`);
        failCount++;
        failed.push(merchant.business_name);
      }
    } else {
      console.log(`   ❌ Failed to delete OSM node`);
      failCount++;
      failed.push(merchant.business_name);
    }

    // Rate limit: 1 request per second
    if (i < oldMerchants.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 CLEANUP SUMMARY:');
  console.log('='.repeat(60));
  console.log(`✅ Successfully cleaned: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);

  if (failed.length > 0) {
    console.log(`\nFailed merchants:`);
    failed.forEach(name => console.log(`   • ${name}`));
  }

  // Final verification
  const remaining = await executeQuery(`
    SELECT COUNT(*) as count
    FROM merchant_submissions
    WHERE status = 'published'
      AND osm_node_id IS NOT NULL
  `) as any[];

  console.log(`\n📍 Remaining published merchants with OSM: ${remaining[0].count}`);
  console.log('   (Should be 20 - the verified merchants)\n');

  console.log('🎉 Cleanup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Verify BTCMap only shows the 20 verified merchants');
  console.log('2. Old OSM nodes will be removed from BTCMap within 24 hours');
  console.log('3. Run list-all-osm-merchants.ts to verify');
}

cleanupOldMerchants().catch(console.error);
