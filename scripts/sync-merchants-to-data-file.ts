/**
 * Sync Database Merchants to merchants-data.ts
 * Updates the static merchant data file with current database values
 */

import { executeQuery } from '../lib/db';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface DBMerchant {
  id: string;
  business_name: string;
  contact_name: string;
  contact_email: string;
  phone: string | null;
  address: string;
  lightning_address: string | null;
  latitude: string;
  longitude: string;
  category_value: string;
  description: string | null;
  osm_node_id: string | null;
  website: string | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function syncMerchantsToDataFile() {
  console.log('📦 Syncing database merchants to merchants-data.ts...\n');

  // Get all published merchants with OSM nodes
  const merchants = await executeQuery<DBMerchant[]>(
    `SELECT 
      id,
      business_name,
      contact_name,
      contact_email,
      phone,
      address,
      lightning_address,
      latitude,
      longitude,
      category_value,
      description,
      osm_node_id,
      website
    FROM merchant_submissions
    WHERE status = 'published' AND osm_node_id IS NOT NULL
    ORDER BY business_name`
  );

  console.log(`Found ${merchants.length} published merchants with OSM nodes\n`);

  // Generate TypeScript merchant data
  const merchantsCode = merchants.map(m => {
    const slug = slugify(m.business_name);
    const blinkAddress = m.lightning_address?.includes('@blink.sv') 
      ? m.lightning_address 
      : `${slug}@blink.sv`;
    
    return `  {
    id: "${m.id}",
    businessName: "${m.business_name}",
    ownerName: "${m.contact_name}",
    email: "${m.contact_email}",
    phoneNumber: "${m.phone || ''}",
    location: "${m.address}",
    blinkAddress: "${blinkAddress}",
    lightningAddress: "${m.lightning_address || ''}",
    btcMapUrl: "https://btcmap.org/map#node=${m.osm_node_id}",
    btcMapNodeId: "${m.osm_node_id}",
    latitude: ${m.latitude},
    longitude: ${m.longitude},
    slug: "${slug}",
    category: "${m.category_value || 'other'}",
    description: "${(m.description || '').replace(/"/g, '\\"')}"${m.website ? `,\n    website: "${m.website}"` : ''}
  }`;
  }).join(',\n');

  const fileContent = `/**
 * Merchant Data - Auto-generated from database
 * Last updated: ${new Date().toISOString()}
 * 
 * DO NOT EDIT MANUALLY - Run: npx tsx scripts/sync-merchants-to-data-file.ts
 */

export interface Merchant {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  location: string;
  blinkAddress: string;
  lightningAddress?: string;
  btcMapUrl?: string;
  btcMapNodeId?: string;
  latitude?: number;
  longitude?: number;
  slug: string;
  category?: string;
  description?: string;
  website?: string;
}

export const merchants: Merchant[] = [
${merchantsCode}
];

export const CATEGORY_INFO: Record<string, { name: string; color: string }> = {
  restaurant: { name: 'Restaurant', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  shop: { name: 'Shop', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  salon: { name: 'Salon', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  service: { name: 'Service', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  clothing: { name: 'Clothing', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  convenience: { name: 'Convenience', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  other: { name: 'Other', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' }
};

// Helper functions
export function getMerchantBySlug(slug: string): Merchant | undefined {
  return merchants.find(m => m.slug === slug);
}

export function getMerchantsByCategory(category: string): Merchant[] {
  return merchants.filter(m => m.category === category);
}

export function getAllMerchants(): Merchant[] {
  return merchants;
}
`;

  // Write to file
  const filePath = join(process.cwd(), 'lib', 'merchants-data.ts');
  writeFileSync(filePath, fileContent, 'utf-8');

  console.log('✅ Successfully updated lib/merchants-data.ts');
  console.log(`   ${merchants.length} merchants exported`);
  console.log('\n📋 Merchant List:');
  merchants.forEach((m, i) => {
    console.log(`   ${i + 1}. ${m.business_name} - Node ${m.osm_node_id}`);
  });
}

syncMerchantsToDataFile().catch(console.error);
