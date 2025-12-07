/**
 * OpenStreetMap Publisher for BTCMap Integration
 *
 * This module handles publishing verified merchants to OpenStreetMap
 * following BTCMap tagging requirements.
 *
 * References:
 * - https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/Tagging-Merchants
 * - https://wiki.openstreetmap.org/wiki/Organised_Editing/Activities/BTCMap
 */

import { logger } from './logger';

interface MerchantData {
  businessName: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  paymentOnchain: boolean;
  paymentLightning: boolean;
  paymentLightningContactless: boolean;
  contactEmail?: string;
  verifiedAt: string; // ISO date from verifier visit
  submissionId: string;
}

interface OSMPublishResult {
  success: boolean;
  nodeId?: string;
  changesetId?: string;
  error?: string;
}

/**
 * Publishes a verified merchant to OpenStreetMap
 * This is called AFTER admin approval
 */
export async function publishToOSM(merchant: MerchantData): Promise<OSMPublishResult> {
  const OSM_CLIENT_ID = process.env.OSM_CLIENT_ID;
  const OSM_CLIENT_SECRET = process.env.OSM_CLIENT_SECRET;
  const OSM_ACCESS_TOKEN = process.env.OSM_ACCESS_TOKEN;
  const OSM_API_URL = process.env.OSM_API_URL || 'https://api.openstreetmap.org/api/0.6';

  // Check if OSM is configured
  if (!OSM_ACCESS_TOKEN) {
    logger.info('⏭️  OSM publishing skipped (not configured)');
    return {
      success: false,
      error: 'OSM_ACCESS_TOKEN not configured'
    };
  }

  try {
    logger.info('🗺️  Publishing merchant to OpenStreetMap...');
    logger.info(`   Business: ${merchant.businessName}`);
    logger.info(`   Location: ${merchant.latitude}, ${merchant.longitude}`);

    // Step 1: Create changeset
    const changesetId = await createChangeset(OSM_API_URL, OSM_ACCESS_TOKEN, merchant);
    logger.info(`   ✅ Changeset created: ${changesetId}`);

    // Step 2: Create node with BTCMap-compliant tags
    const nodeId = await createNode(
      OSM_API_URL,
      OSM_ACCESS_TOKEN,
      changesetId,
      merchant
    );
    logger.info(`   ✅ Node created: ${nodeId}`);

    // Step 3: Close changeset
    await closeChangeset(OSM_API_URL, OSM_ACCESS_TOKEN, changesetId);
    logger.info(`   ✅ Changeset closed: ${changesetId}`);

    logger.info('✅ Successfully published to OpenStreetMap');

    return {
      success: true,
      nodeId: nodeId.toString(),
      changesetId: changesetId.toString()
    };

  } catch (error: any) {
    logger.error('❌ OSM publishing failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Creates a changeset on OSM
 * Includes #btcmap hashtag as per BTCMap requirements
 */
async function createChangeset(
  apiUrl: string,
  accessToken: string,
  merchant: MerchantData
): Promise<number> {
  const changesetXml = `
    <osm>
      <changeset>
        <tag k="created_by" v="Afribit Merchant Verification System"/>
        <tag k="comment" v="Add Bitcoin-accepting merchant: ${merchant.businessName} #btcmap"/>
        <tag k="source" v="Ground verification by Afribit verifier (issue:${merchant.submissionId})"/>
        <tag k="hashtags" v="#btcmap"/>
      </changeset>
    </osm>
  `.trim();

  const response = await fetch(`${apiUrl}/changeset/create`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'text/xml',
    },
    body: changesetXml,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create changeset: ${response.status} - ${errorText}`);
  }

  const changesetId = await response.text();
  return parseInt(changesetId, 10);
}

/**
 * Creates a node on OSM with BTCMap-compliant tags
 *
 * Required BTCMap tags:
 * - currency:XBT=yes (required)
 * - payment:onchain=yes/no
 * - payment:lightning=yes/no
 * - payment:lightning_contactless=yes/no
 * - survey:date=YYYY-MM-DD (physical verification date)
 *
 * Recommended tags:
 * - name (business name)
 * - amenity or shop (business category)
 * - addr:full or addr:street, addr:city, etc.
 * - contact:email
 */
async function createNode(
  apiUrl: string,
  accessToken: string,
  changesetId: number,
  merchant: MerchantData
): Promise<number> {
  // Build BTCMap-compliant tags
  const today = new Date().toISOString().split('T')[0];
  const surveyDate = merchant.verifiedAt.split('T')[0];

  const tags: Record<string, string> = {
    // Required: Bitcoin acceptance
    'currency:XBT': 'yes',

    // Payment methods (BTCMap specification)
    'payment:onchain': merchant.paymentOnchain ? 'yes' : 'no',
    'payment:lightning': merchant.paymentLightning ? 'yes' : 'no',
    'payment:lightning_contactless': merchant.paymentLightningContactless ? 'yes' : 'no',

    // Verification dates (BTCMap requirement)
    'survey:date': surveyDate, // Physical verification date (YYYY-MM-DD)
    'check_date:currency:XBT': today, // Bitcoin tags verified today
    'check_date': today, // All tags verified today

    // Source attribution (BTCMap requirement)
    'source': 'survey',

    // Business information
    'name': merchant.businessName,
    'addr:full': merchant.address,
  };

  // Add contact email if available
  if (merchant.contactEmail) {
    tags['contact:email'] = merchant.contactEmail;
  }

  // Map category to OSM amenity/shop tags
  const osmCategory = mapCategoryToOSM(merchant.category);
  if (osmCategory.key && osmCategory.value) {
    tags[osmCategory.key] = osmCategory.value;
  }

  // Build XML
  const tagElements = Object.entries(tags)
    .map(([k, v]) => `    <tag k="${escapeXml(k)}" v="${escapeXml(v)}"/>`)
    .join('\n');

  const nodeXml = `
    <osm>
      <node changeset="${changesetId}" lat="${merchant.latitude}" lon="${merchant.longitude}">
${tagElements}
      </node>
    </osm>
  `.trim();

  const response = await fetch(`${apiUrl}/node/create`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'text/xml',
    },
    body: nodeXml,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create node: ${response.status} - ${errorText}`);
  }

  const nodeId = await response.text();
  return parseInt(nodeId, 10);
}

/**
 * Closes a changeset on OSM
 */
async function closeChangeset(
  apiUrl: string,
  accessToken: string,
  changesetId: number
): Promise<void> {
  const response = await fetch(`${apiUrl}/changeset/${changesetId}/close`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to close changeset: ${response.status} - ${errorText}`);
  }
}

/**
 * Maps Afribit categories to OpenStreetMap amenity/shop tags
 */
function mapCategoryToOSM(category: string): { key: string; value: string } {
  const categoryMap: Record<string, { key: string; value: string }> = {
    'Restaurant': { key: 'amenity', value: 'restaurant' },
    'Cafe': { key: 'amenity', value: 'cafe' },
    'Bar': { key: 'amenity', value: 'bar' },
    'Hotel': { key: 'tourism', value: 'hotel' },
    'Shop': { key: 'shop', value: 'general' },
    'Supermarket': { key: 'shop', value: 'supermarket' },
    'Grocery': { key: 'shop', value: 'convenience' },
    'Pharmacy': { key: 'amenity', value: 'pharmacy' },
    'Gas Station': { key: 'amenity', value: 'fuel' },
    'Salon': { key: 'shop', value: 'hairdresser' },
    'Gym': { key: 'leisure', value: 'fitness_centre' },
    'Clinic': { key: 'amenity', value: 'clinic' },
    'School': { key: 'amenity', value: 'school' },
    'Other': { key: 'shop', value: 'yes' },
  };

  return categoryMap[category] || { key: 'amenity', value: 'payment_terminal' };
}

/**
 * Escapes XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates the OSM node URL for viewing in browser
 */
export function getOSMNodeUrl(nodeId: string): string {
  const isDev = process.env.OSM_API_URL?.includes('dev.openstreetmap.org');
  const baseUrl = isDev
    ? 'https://master.apis.dev.openstreetmap.org'
    : 'https://www.openstreetmap.org';
  return `${baseUrl}/node/${nodeId}`;
}

/**
 * Generates the BTCMap URL for viewing the merchant
 */
export function getBTCMapUrl(latitude: number, longitude: number): string {
  return `https://btcmap.org/map?lat=${latitude}&long=${longitude}`;
}
