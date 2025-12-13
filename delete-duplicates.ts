import 'dotenv/config';

const OSM_API_URL = process.env.OSM_API_URL || 'https://api.openstreetmap.org/api/0.6';
const OSM_ACCESS_TOKEN = process.env.OSM_ACCESS_TOKEN;

// The 20 duplicate nodes created in changeset 175695939
const duplicateNodes = [
  13362998101, 13362998201, 13362998401, 13362998202, 13362998501,
  13362998102, 13362998103, 13362998104, 13362998601, 13362998203,
  13362998105, 13362998701, 13362998702, 13362998502, 13362998703,
  13362998503, 13362998602, 13362998204, 13362998106, 13362998205
];

async function createChangeset(comment: string): Promise<string> {
  const changesetXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <changeset>
    <tag k="created_by" v="Afribit Africa Merchant Directory v2.0"/>
    <tag k="comment" v="${comment}"/>
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
    throw new Error(`Failed to create changeset: ${response.status}`);
  }

  return await response.text();
}

async function deleteNode(changesetId: string, nodeId: number, version: number = 1): Promise<void> {
  const nodeXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <node id="${nodeId}" changeset="${changesetId}" version="${version}" lat="0" lon="0"/>
</osm>`;

  const response = await fetch(`${OSM_API_URL}/node/${nodeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
      'Content-Type': 'text/xml',
    },
    body: nodeXML,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete node ${nodeId}: ${response.status} - ${error}`);
  }
}

async function closeChangeset(changesetId: string): Promise<void> {
  await fetch(`${OSM_API_URL}/changeset/${changesetId}/close`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
    },
  });
}

async function main() {
  console.log('🗑️  Deleting 20 duplicate OSM nodes...\n');
  console.log('Nodes to delete:', duplicateNodes.join(', '));

  console.log('\n📝 Creating changeset...');
  const changesetId = await createChangeset('Remove duplicate merchant nodes - keeping original entries');
  console.log('✅ Changeset:', changesetId);

  let deleted = 0;
  let failed = 0;

  for (const nodeId of duplicateNodes) {
    try {
      process.stdout.write(`\n[${deleted + failed + 1}/20] Deleting node ${nodeId}...`);
      await deleteNode(changesetId, nodeId);
      console.log(' ✅');
      deleted++;
    } catch (error: any) {
      console.log(' ❌', error.message);
      failed++;
    }
  }

  console.log('\n📝 Closing changeset...');
  await closeChangeset(changesetId);

  console.log('\n📊 SUMMARY:');
  console.log('   ✅ Deleted:', deleted);
  console.log('   ❌ Failed:', failed);
  console.log('\n🎉 Cleanup complete!');

  process.exit(0);
}

main().catch(console.error);
