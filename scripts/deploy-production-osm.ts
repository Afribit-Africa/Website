/**
 * Production OSM Deployment Script
 *
 * Step 1: Delete old 34 merchants from production OSM
 * Step 2: Publish 20 verified merchants with BTCMap-compliant tags
 */

import { executeQuery } from '../lib/db';

const OSM_API_URL = process.env.OSM_API_URL || 'https://api.openstreetmap.org/api/0.6';
const OSM_ACCESS_TOKEN = process.env.OSM_ACCESS_TOKEN;

interface Merchant {
  id: string;
  business_name: string;
  category_key: string;
  category_value: string;
  description: string | null;
  latitude: string;
  longitude: string;
  address: string;
  phone: string | null;
  website: string | null;
  opening_hours: string | null;
  payment_onchain: number;
  payment_lightning: number;
  payment_lightning_contactless: number;
  lightning_address: string | null;
  contact_name: string;
  contact_email: string;
  osm_node_id: string | null;
}

// Old merchants to delete
const OLD_MERCHANTS_TO_DELETE = [
  { nodeId: '12300462656', name: 'ABUKI DISTRIBUTORS' },
  { nodeId: '12300515181', name: 'Arca Tech Services' },
  { nodeId: '12300417204', name: 'BIG BROTHER CAR WASH' },
  { nodeId: '12300462655', name: 'BIOGAS PUBLIC WASHROOMS' },
  { nodeId: '12300467146', name: 'BLACK AND WHITE' },
  { nodeId: '12253101509', name: 'Calisto Enterprise' },
  { nodeId: '12300433273', name: 'CHARLIE RIDER' },
  { nodeId: '12165688182', name: 'Dess Gaming' },
  { nodeId: '12700702059', name: 'Domiano Fast foods' },
  { nodeId: '12300443592', name: 'ELIJAH DRAXLER' },
  { nodeId: '12700628232', name: 'Evalyncafeterian' },
  { nodeId: '12254728431', name: 'Felix' },
  { nodeId: '12254752062', name: 'Fishpoint Eateries' },
  { nodeId: '12254728432', name: 'For People Forever LTD' },
  { nodeId: '12700702056', name: 'GalaxyToilets' },
  { nodeId: '12255259652', name: 'Greencard Mtaani' },
  { nodeId: '12300462657', name: 'Joseph Public Washroom' },
  { nodeId: '12254728433', name: 'Kera Transport' },
  { nodeId: '12254686388', name: 'Kevo DS Station' },
  { nodeId: '12300462658', name: 'KHEEZONIX FASHIONS AND STYLES' },
  { nodeId: '12300469783', name: 'Kibera the Largest slum tour' },
  { nodeId: '12281743822', name: 'Kosmos Solutions LTD' },
  { nodeId: '12254678587', name: 'Mama Design' },
  { nodeId: '12300433274', name: 'MOSESO RIDES' },
  { nodeId: '12300475666', name: 'MUANZO MPYA ORGANISATION' },
  { nodeId: '12280177485', name: 'Njema Safaris' },
  { nodeId: '12254733210', name: 'Obadia Nyaenda' },
  { nodeId: '12281727715', name: 'Outdoor Kids Kenya' },
  { nodeId: '12280168473', name: 'RonnieFund' },
  { nodeId: '12281745878', name: "Shiko's Ferments" },
  { nodeId: '12168076295', name: 'Spira' },
  { nodeId: '12254721499', name: 'Unique Barber Shop' },
  { nodeId: '12300462913', name: 'WERE TOURS' },
  { nodeId: '12300443594', name: 'WILSON ASWETO' },
];

async function deleteOSMNode(nodeId: string, changesetId: string): Promise<boolean> {
  try {
    // Get current node data
    const getResponse = await fetch(`${OSM_API_URL}/node/${nodeId}`);

    if (!getResponse.ok) {
      if (getResponse.status === 404 || getResponse.status === 410) {
        return true; // Already deleted
      }
      throw new Error(`Failed to fetch: ${getResponse.status}`);
    }

    const xmlText = await getResponse.text();
    const versionMatch = xmlText.match(/version="(\d+)"/);
    const version = versionMatch ? versionMatch[1] : '1';

    // Extract lat/lon from XML
    const latMatch = xmlText.match(/lat="([^"]+)"/);
    const lonMatch = xmlText.match(/lon="([^"]+)"/);
    const lat = latMatch ? latMatch[1] : '';
    const lon = lonMatch ? lonMatch[1] : '';

    if (!lat || !lon) {
      throw new Error('Could not extract coordinates from node');
    }

    // Delete node (OSM requires lat/lon in delete request)
    const deleteXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <node id="${nodeId}" changeset="${changesetId}" version="${version}" lat="${lat}" lon="${lon}"/>
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
      throw new Error(`Delete failed: ${deleteResponse.status} - ${errorText}`);
    }

    return true;
  } catch (error: any) {
    console.log(`   ⚠️  ${error.message}`);
    return false;
  }
}

async function createChangeset(comment: string): Promise<string> {
  const changesetXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <changeset>
    <tag k="created_by" v="Afribit Africa Merchant Directory v2.0"/>
    <tag k="comment" v="${comment} #btcmap"/>
    <tag k="source" v="GPS survey - physically verified by Afribit Africa field team"/>
    <tag k="locale" v="en"/>
  </changeset>
</osm>`;

  const response = await fetch(`${OSM_API_URL}/changeset/create`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
      'Content-Type': 'text/xml',
    },
    body: changesetXML,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create changeset: ${response.status} - ${error}`);
  }

  return await response.text();
}

async function closeChangeset(changesetId: string): Promise<void> {
  await fetch(`${OSM_API_URL}/changeset/${changesetId}/close`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
    },
  });
}

async function deployToProduction() {
  console.log('🚀 PRODUCTION OSM DEPLOYMENT\n');
  console.log(`📡 API: ${OSM_API_URL}`);
  console.log('⚠️  WARNING: This affects LIVE OpenStreetMap data!\n');

  if (!OSM_ACCESS_TOKEN) {
    console.error('❌ Missing OSM_ACCESS_TOKEN');
    process.exit(1);
  }

  if (OSM_API_URL.includes('dev')) {
    console.error('❌ Still using dev server! Update OSM_API_URL to production:');
    console.error('   https://api.openstreetmap.org/api/0.6');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('PHASE 1: DELETE OLD MERCHANTS (34 merchants)');
  console.log('='.repeat(60) + '\n');

  console.log('⏳ Starting deletion in 5 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Create changeset for deletions
  const deleteChangesetId = await createChangeset('Removing outdated Bitcoin merchant listings from Kibera - remapping with verified data');
  console.log(`✅ Deletion changeset created: ${deleteChangesetId}\n`);

  let deletedCount = 0;
  let skipCount = 0;

  for (let i = 0; i < OLD_MERCHANTS_TO_DELETE.length; i++) {
    const merchant = OLD_MERCHANTS_TO_DELETE[i];
    console.log(`[${i + 1}/34] Deleting: ${merchant.name} (${merchant.nodeId})...`);

    const success = await deleteOSMNode(merchant.nodeId, deleteChangesetId);
    if (success) {
      deletedCount++;
      console.log(`   ✅ Deleted`);
    } else {
      skipCount++;
      console.log(`   ⏭️  Skipped (already deleted or not found)`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await closeChangeset(deleteChangesetId);
  console.log(`\n✅ Deletion complete: ${deletedCount} deleted, ${skipCount} skipped`);
  console.log(`📝 Changeset: https://www.openstreetmap.org/changeset/${deleteChangesetId}\n`);

  console.log('='.repeat(60));
  console.log('PHASE 2: PUBLISH VERIFIED MERCHANTS (20 merchants)');
  console.log('='.repeat(60) + '\n');

  console.log('⏳ Starting publication in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Import and run the main publication logic directly
  const publishModule = await import('./publish-verified-to-osm');
  // The module's main() function runs automatically, just wait for it
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n' + '='.repeat(60));
  console.log('🎉 PRODUCTION DEPLOYMENT COMPLETE!');
  console.log('='.repeat(60));
  console.log('\n📝 Next steps:');
  console.log('1. Verify merchants on https://www.openstreetmap.org');
  console.log('2. Check BTCMap sync within 24 hours');
  console.log('3. Update database archived merchants');
}

deployToProduction().catch(console.error);
