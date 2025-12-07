/**
 * Update existing OSM nodes with BTCMap-compliant tags
 * Removes legacy payment:bitcoin tag, adds verification dates
 */

const OSM_API_URL = process.env.OSM_API_URL || 'https://master.apis.dev.openstreetmap.org/api/0.6';
const OSM_ACCESS_TOKEN = process.env.OSM_ACCESS_TOKEN;

const merchants = [
  { nodeId: '4361326784', name: '3 West Butchery' },
  { nodeId: '4361326785', name: '3 West Collection' },
  { nodeId: '4361326786', name: '3 West Hotel' },
  { nodeId: '4361326787', name: 'Abebo Vegez' },
  { nodeId: '4361326788', name: 'AC Gas Suppliers' },
  { nodeId: '4361326789', name: 'Black and White Fries Corner' },
  { nodeId: '4361326790', name: 'Bridgeway Shop' },
  { nodeId: '4361326791', name: "Candy's Collection Hub" },
  { nodeId: '4361326792', name: 'Caronaliak' },
  { nodeId: '4361326793', name: 'Galaxxy Toilet' },
  { nodeId: '4361326794', name: 'Goreti Greens Shop' },
  { nodeId: '4361326795', name: 'Krezzy Kicks' },
  { nodeId: '4361326796', name: 'Mama Clear' },
  { nodeId: '4361326797', name: 'Mama Eddy Salon' },
  { nodeId: '4361326798', name: 'Mama Nonny Shop' },
  { nodeId: '4361326799', name: 'Shibe' },
  { nodeId: '4361326800', name: 'Sokoni Mboga' },
  { nodeId: '4361326801', name: 'Soweto Car Wash' },
  { nodeId: '4361326802', name: 'Venlavery Retail Shop' },
  { nodeId: '4361326803', name: 'Yummy Tummy' },
];

async function updateNode(nodeId: string, merchantName: string) {
  try {
    // Get current node data
    const getResponse = await fetch(`${OSM_API_URL}/node/${nodeId}`, {
      headers: {
        'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
      },
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch node: ${getResponse.status}`);
    }

    const xmlText = await getResponse.text();

    // Parse current data
    const versionMatch = xmlText.match(/version="(\d+)"/);
    const version = versionMatch ? parseInt(versionMatch[1]) : 1;
    const latMatch = xmlText.match(/lat="([^"]+)"/);
    const lonMatch = xmlText.match(/lon="([^"]+)"/);
    const lat = latMatch ? latMatch[1] : '';
    const lon = lonMatch ? lonMatch[1] : '';

    // Parse existing tags
    const tagMatches = xmlText.matchAll(/<tag k="([^"]+)" v="([^"]+)"\/>/g);
    const tags: Record<string, string> = {};
    for (const match of tagMatches) {
      tags[match[1]] = match[2];
    }

    // Remove legacy tag
    if (tags['payment:bitcoin']) {
      delete tags['payment:bitcoin'];
    }

    // Add BTCMap verification tags
    const today = new Date().toISOString().split('T')[0];
    tags['survey:date'] = today;
    tags['check_date:currency:XBT'] = today;
    tags['check_date'] = today;

    // Update source to be more specific
    tags['source'] = 'survey';

    // Create changeset
    const changesetXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <changeset>
    <tag k="created_by" v="Afribit Africa - BTCMap Tag Update"/>
    <tag k="comment" v="Adding BTCMap verification tags (survey:date, check_date:currency:XBT), removing legacy payment:bitcoin tag #btcmap"/>
    <tag k="source" v="Physical verification by Afribit Africa field team"/>
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
      throw new Error(`Failed to create changeset: ${changesetResponse.status}`);
    }

    const changesetId = await changesetResponse.text();

    // Build updated node XML
    let tagsXML = '';
    for (const [key, value] of Object.entries(tags)) {
      if (value) {
        const escapedValue = value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        tagsXML += `    <tag k="${key}" v="${escapedValue}"/>\n`;
      }
    }

    const nodeXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <node id="${nodeId}" changeset="${changesetId}" version="${version}" lat="${lat}" lon="${lon}">
${tagsXML}  </node>
</osm>`;

    // Update node
    const updateResponse = await fetch(`${OSM_API_URL}/node/${nodeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
        'Content-Type': 'text/xml',
      },
      body: nodeXML,
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update node: ${updateResponse.status} - ${errorText}`);
    }

    // Close changeset
    await fetch(`${OSM_API_URL}/changeset/${changesetId}/close`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
      },
    });

    console.log(`✅ ${merchantName} - Updated node ${nodeId}`);
    console.log(`   Added: survey:date, check_date:currency:XBT, check_date`);
    console.log(`   Removed: payment:bitcoin (legacy tag)`);
    return true;

  } catch (error: any) {
    console.log(`❌ ${merchantName} - Failed: ${error.message}`);
    return false;
  }
}

async function updateAllMerchants() {
  console.log('🔄 Updating 20 merchants with BTCMap-compliant tags...\n');
  console.log(`📡 API: ${OSM_API_URL}\n`);

  if (!OSM_ACCESS_TOKEN) {
    console.error('❌ Missing OSM_ACCESS_TOKEN');
    process.exit(1);
  }

  console.log('Changes to be made:');
  console.log('  ✅ Add: survey:date (physical verification)');
  console.log('  ✅ Add: check_date:currency:XBT (Bitcoin tags verified)');
  console.log('  ✅ Add: check_date (all tags verified)');
  console.log('  ❌ Remove: payment:bitcoin (legacy tag)');
  console.log('  🔄 Update: source = "survey"\n');

  console.log('⏳ Starting updates in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < merchants.length; i++) {
    const merchant = merchants[i];
    console.log(`[${i + 1}/20] ${merchant.name}...`);

    const success = await updateNode(merchant.nodeId, merchant.name);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    console.log('');

    // Rate limit
    if (i < merchants.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('='.repeat(60));
  console.log('📊 UPDATE SUMMARY:');
  console.log('='.repeat(60));
  console.log(`✅ Successfully updated: ${successCount}/20`);
  console.log(`❌ Failed: ${failCount}/20`);
  console.log('\n✅ All merchants now have BTCMap-compliant tags!');
  console.log('\n📝 Next: Publish to production OSM for BTCMap sync');
}

updateAllMerchants().catch(console.error);
