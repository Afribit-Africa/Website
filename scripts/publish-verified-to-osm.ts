import { executeQuery } from '../lib/db';
import fetch from 'node-fetch';

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

// OSM API Configuration
const OSM_API_URL = process.env.OSM_API_URL || 'https://master.apis.dev.openstreetmap.org/api/0.6';
const OSM_ACCESS_TOKEN = process.env.OSM_ACCESS_TOKEN;

// Generate detailed description for each merchant
function generateMerchantDescription(merchant: Merchant): string {
  const categoryDescriptions: Record<string, string> = {
    'restaurant': 'a local eatery serving fresh meals',
    'shop': 'a retail shop offering various goods',
    'salon': 'a beauty and grooming salon',
    'service': 'a service provider',
    'clothing': 'a fashion and clothing store',
    'convenience': 'a convenience store',
  };

  const baseDesc = categoryDescriptions[merchant.category_key] || 'a local business';
  
  let description = `${merchant.business_name} is ${baseDesc} located in Kibera, Nairobi. `;
  
  // Add payment info
  const payments: string[] = [];
  if (merchant.payment_lightning) payments.push('Bitcoin Lightning Network');
  if (merchant.payment_onchain) payments.push('Bitcoin on-chain');
  
  if (payments.length > 0) {
    description += `This business accepts ${payments.join(' and ')} payments. `;
  }
  
  if (merchant.lightning_address) {
    description += `Lightning payments: ${merchant.lightning_address}. `;
  }
  
  // Add Afribit branding
  description += 'Verified and registered through Afribit Africa - empowering Kibera businesses with Bitcoin. ';
  description += 'Part of the Afribit Kibera Merchant Directory.';
  
  return description;
}

// Map category keys to OSM tags
function getOSMTags(merchant: Merchant): Record<string, string> {
  const categoryMapping: Record<string, { amenity?: string; shop?: string }> = {
    'restaurant': { amenity: 'restaurant' },
    'shop': { shop: 'general' },
    'salon': { shop: 'beauty' },
    'service': { shop: 'services' },
    'clothing': { shop: 'clothes' },
    'convenience': { shop: 'convenience' },
  };

  const osmCategory = categoryMapping[merchant.category_key] || { shop: 'general' };
  
  const tags: Record<string, string> = {
    name: merchant.business_name,
    ...osmCategory,
    'addr:full': merchant.address || 'Kibera, Nairobi',
    'addr:city': 'Nairobi',
    'addr:suburb': 'Kibera',
    'addr:country': 'KE',
    description: generateMerchantDescription(merchant),
    'contact:phone': merchant.phone || '',
    'contact:email': merchant.contact_email,
    'payment:bitcoin': 'yes',
    'payment:lightning': merchant.payment_lightning ? 'yes' : 'no',
    'payment:onchain': merchant.payment_onchain ? 'yes' : 'no',
    'payment:lightning_contactless': merchant.payment_lightning_contactless ? 'yes' : 'no',
    'currency:XBT': 'yes',
    source: 'Afribit Africa Merchant Directory',
    'source:ref': `afribit:${merchant.id}`,
    'operator': merchant.contact_name,
    'operator:type': 'private',
    // Afribit-specific tags to identify our merchants
    'afribit:verified': 'yes',
    'afribit:directory': 'kibera',
    'afribit:merchant_id': merchant.id,
    'afribit:registration_date': new Date().toISOString().split('T')[0],
  };

  // Add lightning address if available
  if (merchant.lightning_address) {
    tags['payment:lightning:address'] = merchant.lightning_address;
    tags['contact:lightning'] = merchant.lightning_address;
  }

  // Add website if available
  if (merchant.website) {
    tags['contact:website'] = merchant.website;
  }

  // Add opening hours if available
  if (merchant.opening_hours) {
    tags['opening_hours'] = merchant.opening_hours;
  }

  // Remove empty tags
  Object.keys(tags).forEach(key => {
    if (!tags[key] || tags[key] === '') {
      delete tags[key];
    }
  });

  return tags;
}

// Create OSM changeset
async function createChangeset(comment: string): Promise<string> {
  const changesetXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <changeset>
    <tag k="created_by" v="Afribit Africa Merchant Directory v2.0"/>
    <tag k="comment" v="${comment}"/>
    <tag k="source" v="GPS survey by Afribit Africa field team"/>
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

  return await response.text(); // Returns changeset ID
}

// Close OSM changeset
async function closeChangeset(changesetId: string): Promise<void> {
  const response = await fetch(`${OSM_API_URL}/changeset/${changesetId}/close`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.warn(`Failed to close changeset: ${response.status} - ${error}`);
  }
}

// Create OSM node
async function createOSMNode(
  merchant: Merchant,
  changesetId: string
): Promise<string> {
  const tags = getOSMTags(merchant);
  
  // Build node XML
  let nodeXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <node changeset="${changesetId}" lat="${merchant.latitude}" lon="${merchant.longitude}">
`;

  // Add all tags
  for (const [key, value] of Object.entries(tags)) {
    // Escape XML special characters
    const escapedValue = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
    nodeXML += `    <tag k="${key}" v="${escapedValue}"/>\n`;
  }

  nodeXML += `  </node>
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
    const error = await response.text();
    throw new Error(`Failed to create node: ${response.status} - ${error}`);
  }

  return await response.text(); // Returns node ID
}

async function main() {
  console.log('🌍 Starting OSM publication for 20 verified Afribit merchants...\n');

  if (!OSM_ACCESS_TOKEN) {
    throw new Error('OSM_ACCESS_TOKEN not found in environment variables');
  }

  console.log('📡 Using OSM API:', OSM_API_URL);
  console.log('   (Dev server - safe for testing)\n');

  // Get the 20 verified merchants submitted by edmundspira@gmail.com
  const merchants = await executeQuery<Merchant[]>(
    `SELECT * FROM merchant_submissions 
     WHERE contact_email = 'edmundspira@gmail.com' 
     AND status = 'published'
     AND verification_status = 'verified'
     ORDER BY business_name`
  );

  console.log(`✅ Found ${merchants.length} verified merchants to publish\n`);

  if (merchants.length === 0) {
    console.log('No merchants found. Exiting.');
    return;
  }

  // Group merchants by proximity for analysis
  console.log('📍 LOCATION ANALYSIS:');
  console.log('═══════════════════════════════════════════════════\n');

  const merchantsWithSharedOSM = merchants.filter(m => m.osm_node_id === '12300469782');
  console.log(`⚠️  ${merchantsWithSharedOSM.length} merchants currently share OSM node 12300469782:`);
  merchantsWithSharedOSM.forEach(m => {
    console.log(`   - ${m.business_name} at (${m.latitude}, ${m.longitude})`);
  });

  console.log('\n✅ Each will get their own unique OSM node with precise GPS coordinates\n');

  // Confirm before proceeding
  console.log('📋 MERCHANTS TO PUBLISH:');
  console.log('═══════════════════════════════════════════════════\n');

  merchants.forEach((m, i) => {
    console.log(`${i + 1}. ${m.business_name}`);
    console.log(`   Category: ${m.category_value}`);
    console.log(`   Location: ${m.latitude}, ${m.longitude}`);
    console.log(`   Lightning: ${m.lightning_address || 'none'}`);
    console.log(`   Current OSM: ${m.osm_node_id || 'none'}\n`);
  });

  console.log('⏳ Starting OSM publication in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Create changeset
  console.log('📝 Creating OSM changeset...');
  const changesetComment = `Adding ${merchants.length} verified Bitcoin-accepting businesses in Kibera, Nairobi - Afribit Africa Merchant Directory`;
  const changesetId = await createChangeset(changesetComment);
  console.log(`✅ Changeset created: ${changesetId}\n`);

  // Publish each merchant
  const results: Array<{ merchant: string; nodeId: string; success: boolean; error?: string }> = [];

  for (let i = 0; i < merchants.length; i++) {
    const merchant = merchants[i];
    console.log(`\n[${i + 1}/${merchants.length}] Publishing: ${merchant.business_name}...`);

    try {
      const nodeId = await createOSMNode(merchant, changesetId);
      console.log(`   ✅ Created OSM node: ${nodeId}`);

      // Update database with new OSM node ID
      await executeQuery(
        `UPDATE merchant_submissions 
         SET osm_node_id = ?,
             osm_changeset_id = ?,
             btcmap_synced = 1,
             last_edited_at = NOW()
         WHERE id = ?`,
        [nodeId, changesetId, merchant.id]
      );

      console.log(`   ✅ Database updated`);

      results.push({
        merchant: merchant.business_name,
        nodeId,
        success: true,
      });

      // Rate limit: 1 request per second
      if (i < merchants.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error: any) {
      console.error(`   ❌ Failed: ${error.message}`);
      results.push({
        merchant: merchant.business_name,
        nodeId: '',
        success: false,
        error: error.message,
      });
    }
  }

  // Close changeset
  console.log(`\n\n📝 Closing changeset ${changesetId}...`);
  await closeChangeset(changesetId);
  console.log('✅ Changeset closed\n');

  // Summary
  console.log('\n📊 PUBLICATION SUMMARY:');
  console.log('═══════════════════════════════════════════════════\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successfully published: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}\n`);

  if (successful.length > 0) {
    console.log('Successfully published merchants:');
    successful.forEach(r => {
      console.log(`   ✓ ${r.merchant} - OSM node ${r.nodeId}`);
      console.log(`     BTCMap: https://btcmap.org/map?lat=0&long=0#node=${r.nodeId}`);
    });
  }

  if (failed.length > 0) {
    console.log('\nFailed merchants:');
    failed.forEach(r => {
      console.log(`   ✗ ${r.merchant}: ${r.error}`);
    });
  }

  console.log('\n\n🎉 OSM Publication Complete!');
  console.log('\n📍 Next steps:');
  console.log('1. Verify nodes on OSM dev server: https://master.apis.dev.openstreetmap.org');
  console.log('2. Check BTCMap integration (may take a few minutes to sync)');
  console.log('3. If everything looks good, run again with production OSM API');
  console.log('4. Update .env.local: OSM_API_URL="https://api.openstreetmap.org/api/0.6"\n');
}

main().catch(console.error);
