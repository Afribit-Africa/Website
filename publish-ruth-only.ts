import 'dotenv/config';
import { executeQuery } from './lib/db';

const OSM_API_URL = process.env.OSM_API_URL || 'https://api.openstreetmap.org/api/0.6';
const OSM_ACCESS_TOKEN = process.env.OSM_ACCESS_TOKEN;

async function createChangeset(comment: string): Promise<string> {
  const changesetXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <changeset>
    <tag k="created_by" v="Afribit Africa Merchant Directory v2.0"/>
    <tag k="comment" v="${comment} #btcmap"/>
    <tag k="source" v="GPS survey by Afribit Africa field team - physically verified"/>
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

async function createNode(changesetId: string, merchant: any): Promise<string> {
  const nodeXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <node changeset="${changesetId}" lat="${merchant.latitude}" lon="${merchant.longitude}">
    <tag k="name" v="${merchant.business_name}"/>
    <tag k="shop" v="convenience"/>
    <tag k="payment:bitcoin" v="yes"/>
    <tag k="payment:lightning" v="yes"/>
    <tag k="lightning" v="${merchant.lightning_address}"/>
    <tag k="currency:XBT" v="yes"/>
    <tag k="contact:email" v="${merchant.contact_email}"/>
    <tag k="payment:onchain" v="yes"/>
    <tag k="description" v="Convenience store in Soweto, Kibera - accepts Bitcoin"/>
  </node>
</osm>`;

  const response = await fetch(`${OSM_API_URL}/node/create`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
      'Content-Type': 'text/xml',
    },
    body: nodeXML,
  });

  if (!response.ok) {
    throw new Error(`Failed to create node: ${response.status}`);
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

async function main() {
  console.log('🌍 Publishing Ruth Shop to OpenStreetMap...\n');

  const results = await executeQuery(
    `SELECT * FROM merchant_submissions WHERE business_name = 'Ruth Shop'`
  );

  if (!results || results.length === 0) {
    console.error('❌ Ruth Shop not found');
    return;
  }

  const ruthShop = results[0];
  console.log('📋 Ruth Shop Details:');
  console.log('   Business:', ruthShop.business_name);
  console.log('   Operator:', ruthShop.contact_name);
  console.log('   Location:', ruthShop.latitude, ruthShop.longitude);
  console.log('   Lightning:', ruthShop.lightning_address);

  console.log('\n📝 Creating changeset...');
  const changesetId = await createChangeset('Add Ruth Shop - Bitcoin-accepting convenience store in Kibera');
  console.log('✅ Changeset:', changesetId);

  console.log('\n📍 Creating OSM node...');
  const nodeId = await createNode(changesetId, ruthShop);
  console.log('✅ OSM Node:', nodeId);

  console.log('\n💾 Updating database...');
  await executeQuery(
    `UPDATE merchant_submissions SET osm_node_id = ?, status = 'published' WHERE id = ?`,
    [nodeId, ruthShop.id]
  );

  console.log('\n📝 Closing changeset...');
  await closeChangeset(changesetId);

  console.log('\n🎉 Success!');
  console.log('   OSM: https://www.openstreetmap.org/node/' + nodeId);
  console.log('   BTCMap: https://btcmap.org/merchant/' + nodeId);
  console.log('\n⏳ BTCMap will sync within 24-48 hours');

  process.exit(0);
}

main().catch(console.error);
