import { executeQuery } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

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
    operator: merchant.contact_name,
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

async function main() {
  console.log('📋 Generating OSM XML for 20 verified Afribit merchants...\n');

  // Get the 20 verified merchants
  const merchants = await executeQuery<Merchant[]>(
    `SELECT * FROM merchant_submissions
     WHERE contact_email = 'edmundspira@gmail.com'
     AND status = 'published'
     AND verification_status = 'verified'
     ORDER BY business_name`
  );

  console.log(`✅ Found ${merchants.length} verified merchants\n`);

  if (merchants.length === 0) {
    console.log('No merchants found. Exiting.');
    return;
  }

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'osm-exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // Generate individual XML files for each merchant
  console.log('📝 Generating OSM XML files...\n');

  for (let i = 0; i < merchants.length; i++) {
    const merchant = merchants[i];
    const tags = getOSMTags(merchant);

    console.log(`${i + 1}. ${merchant.business_name}`);
    console.log(`   GPS: ${merchant.latitude}, ${merchant.longitude}`);
    console.log(`   OSM Tags: ${Object.keys(tags).length} tags`);

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="Afribit Africa Merchant Directory v2.0">
  <node lat="${merchant.latitude}" lon="${merchant.longitude}">
`;

    for (const [key, value] of Object.entries(tags)) {
      const escapedValue = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      xml += `    <tag k="${key}" v="${escapedValue}"/>\n`;
    }

    xml += `  </node>
</osm>`;

    // Save XML file
    const filename = `${merchant.business_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.osm`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, xml);

    console.log(`   ✅ Saved: ${filename}\n`);
  }

  // Generate combined XML file
  console.log('📝 Generating combined OSM XML file...\n');

  let combinedXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="Afribit Africa Merchant Directory v2.0">
`;

  for (const merchant of merchants) {
    const tags = getOSMTags(merchant);
    combinedXML += `  <node lat="${merchant.latitude}" lon="${merchant.longitude}">\n`;

    for (const [key, value] of Object.entries(tags)) {
      const escapedValue = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      combinedXML += `    <tag k="${key}" v="${escapedValue}"/>\n`;
    }

    combinedXML += `  </node>\n`;
  }

  combinedXML += `</osm>`;

  const combinedFile = path.join(outputDir, `afribit_kibera_merchants_${timestamp}.osm`);
  fs.writeFileSync(combinedFile, combinedXML);

  console.log(`✅ Combined file: afribit_kibera_merchants_${timestamp}.osm\n`);

  // Generate summary report
  console.log('\n📊 MERCHANT SUMMARY:');
  console.log('═══════════════════════════════════════════════════\n');

  merchants.forEach((m, i) => {
    console.log(`${i + 1}. ${m.business_name}`);
    console.log(`   Category: ${m.category_value}`);
    console.log(`   GPS: ${m.latitude}, ${m.longitude}`);
    console.log(`   Lightning: ${m.lightning_address || 'none'}`);
    console.log(`   Description: ${generateMerchantDescription(m).substring(0, 100)}...`);
    console.log(`   Tags: afribit:verified=yes, afribit:directory=kibera\n`);
  });

  console.log('\n✅ OSM XML generation complete!');
  console.log(`\n📁 Files saved to: ${outputDir}`);
  console.log('\n📍 Next steps:');
  console.log('1. Review the generated OSM XML files');
  console.log('2. Use JOSM (Java OpenStreetMap Editor) to upload:');
  console.log('   - Download JOSM: https://josm.openstreetmap.de/');
  console.log('   - File → Open → Select the combined OSM file');
  console.log('   - Review each node location on the map');
  console.log('   - Upload → Create changeset');
  console.log('3. Or use iD editor on openstreetmap.org');
  console.log('4. Nodes will appear on BTCMap within 24 hours\n');

  console.log('💡 BRANDING PROTECTION:');
  console.log('Each merchant has these Afribit-specific tags:');
  console.log('  • afribit:verified=yes');
  console.log('  • afribit:directory=kibera');
  console.log('  • afribit:merchant_id={UUID}');
  console.log('  • source=Afribit Africa Merchant Directory');
  console.log('  • Description includes "Verified through Afribit Africa"\n');
}

main().catch(console.error);
