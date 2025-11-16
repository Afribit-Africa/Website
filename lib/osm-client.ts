// OpenStreetMap API Client for publishing Bitcoin merchants
// Using OSM API v0.6 with OAuth 2.0 authentication

import { logger } from './logger';

interface OSMNode {
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

interface OSMChangesetResponse {
  changeset: {
    id: number;
  };
}

interface OSMNodeResponse {
  node: {
    id: number;
  };
}

class OSMClient {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly userAgent: string;

  constructor() {
    // Use production OSM API (or dev.openstreetmap.org for testing)
    this.baseUrl = process.env.OSM_API_URL || 'https://api.openstreetmap.org/api/0.6';
    this.accessToken = process.env.OSM_ACCESS_TOKEN || '';
    this.userAgent = 'Afribit Merchant Onboarding/1.0';

    if (!this.accessToken) {
      logger.warn('⚠️ OSM_ACCESS_TOKEN not configured. OSM publishing will not work.');
    }
  }

  /**
   * Create a new changeset for grouping related changes
   */
  async createChangeset(comment: string, source: string = 'Afribit Merchant Directory'): Promise<number> {
    if (!this.accessToken) {
      throw new Error('OSM_ACCESS_TOKEN is not configured');
    }

    const changesetXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6">
  <changeset>
    <tag k="created_by" v="${this.userAgent}"/>
    <tag k="comment" v="${this.escapeXML(comment)}"/>
    <tag k="source" v="${this.escapeXML(source)}"/>
    <tag k="hashtags" v="#Bitcoin #BTCMap #AfribitAfrica"/>
  </changeset>
</osm>`;

    const response = await fetch(`${this.baseUrl}/changeset/create`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'text/xml',
        'User-Agent': this.userAgent,
      },
      body: changesetXML,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create changeset: ${response.status} - ${errorText}`);
    }

    const changesetId = parseInt(await response.text());
    logger.info(`✅ Created OSM changeset: ${changesetId}`);
    return changesetId;
  }

  /**
   * Create a new node (point) on OpenStreetMap
   */
  async createNode(
    changesetId: number,
    node: OSMNode
  ): Promise<number> {
    if (!this.accessToken) {
      throw new Error('OSM_ACCESS_TOKEN is not configured');
    }

    // Build tags XML
    const tagsXML = Object.entries(node.tags)
      .map(([key, value]) => `    <tag k="${this.escapeXML(key)}" v="${this.escapeXML(value)}"/>`)
      .join('\n');

    const nodeXML = `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6">
  <node changeset="${changesetId}" lat="${node.lat}" lon="${node.lon}">
${tagsXML}
  </node>
</osm>`;

    const response = await fetch(`${this.baseUrl}/node/create`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'text/xml',
        'User-Agent': this.userAgent,
      },
      body: nodeXML,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create node: ${response.status} - ${errorText}`);
    }

    const nodeId = parseInt(await response.text());
    logger.info(`✅ Created OSM node: ${nodeId}`);
    return nodeId;
  }

  /**
   * Close a changeset (should always be done after finishing changes)
   */
  async closeChangeset(changesetId: number): Promise<void> {
    if (!this.accessToken) {
      throw new Error('OSM_ACCESS_TOKEN is not configured');
    }

    const response = await fetch(`${this.baseUrl}/changeset/${changesetId}/close`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'User-Agent': this.userAgent,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to close changeset: ${response.status} - ${errorText}`);
    }

    logger.info(`✅ Closed OSM changeset: ${changesetId}`);
  }

  /**
   * Check if a node already exists at given coordinates
   */
  async checkNodeExists(lat: number, lon: number, radius: number = 0.0001): Promise<number | null> {
    // Query nodes in a small bounding box around the coordinates
    const bbox = {
      left: lon - radius,
      bottom: lat - radius,
      right: lon + radius,
      top: lat + radius,
    };

    const response = await fetch(
      `${this.baseUrl}/map?bbox=${bbox.left},${bbox.bottom},${bbox.right},${bbox.top}`,
      {
        headers: {
          'User-Agent': this.userAgent,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const xml = await response.text();

    // Simple check if there's a node with currency:XBT tag
    // In production, you'd want to parse the XML properly
    if (xml.includes('currency:XBT') || xml.includes('currency:BTC')) {
      logger.info('⚠️ Node with Bitcoin tags already exists at this location');
      // Extract node ID from XML (simple regex, should use XML parser in production)
      const match = xml.match(/<node id="(\d+)"/);
      return match ? parseInt(match[1]) : null;
    }

    return null;
  }

  /**
   * Helper to escape XML special characters
   */
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// Export singleton instance
export const osmClient = new OSMClient();

/**
 * Build OSM tags for a Bitcoin-accepting merchant
 */
export function buildMerchantTags(submission: {
  business_name: string;
  category_key: string;
  category_value: string;
  phone?: string | null;
  website?: string | null;
  opening_hours?: string | null;
  payment_onchain: boolean;
  payment_lightning: boolean;
  payment_lightning_contactless: boolean;
}): Record<string, string> {
  const tags: Record<string, string> = {
    name: submission.business_name,
    [submission.category_key]: submission.category_value,
    'currency:XBT': 'yes', // Bitcoin currency tag (required for BTCMap)
  };

  // Add payment method tags
  if (submission.payment_onchain) {
    tags['payment:onchain'] = 'yes';
  }
  if (submission.payment_lightning) {
    tags['payment:lightning'] = 'yes';
  }
  if (submission.payment_lightning_contactless) {
    tags['payment:lightning_contactless'] = 'yes';
  }

  // Add optional contact info
  if (submission.phone) {
    tags['contact:phone'] = submission.phone;
  }
  if (submission.website) {
    tags['contact:website'] = submission.website;
  }
  if (submission.opening_hours) {
    tags['opening_hours'] = submission.opening_hours;
  }

  // Add source tag
  tags['source'] = 'Afribit Merchant Directory';

  return tags;
}

/**
 * Publish a merchant to OpenStreetMap
 * Returns the node ID if successful
 */
export async function publishMerchantToOSM(submission: {
  id: string;
  business_name: string;
  category_key: string;
  category_value: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  website?: string | null;
  opening_hours?: string | null;
  payment_onchain: boolean;
  payment_lightning: boolean;
  payment_lightning_contactless: boolean;
}): Promise<{ nodeId: number; changesetId: number }> {

  logger.info(`📍 Publishing merchant to OSM: ${submission.business_name}`);

  // Check if node already exists at this location
  const existingNodeId = await osmClient.checkNodeExists(
    submission.latitude,
    submission.longitude
  );

  if (existingNodeId) {
    logger.info(`⚠️ Node already exists at this location: ${existingNodeId}`);
    logger.info('Consider updating the existing node instead of creating a new one');
    throw new Error(`A Bitcoin-accepting merchant already exists at these coordinates (Node ID: ${existingNodeId})`);
  }

  // Create changeset
  const changesetId = await osmClient.createChangeset(
    `Add Bitcoin merchant: ${submission.business_name}`,
    'Afribit Merchant Directory - Verified submission'
  );

  try {
    // Build OSM tags
    const tags = buildMerchantTags(submission);

    // Create node
    const nodeId = await osmClient.createNode(changesetId, {
      lat: submission.latitude,
      lon: submission.longitude,
      tags,
    });

    // Close changeset
    await osmClient.closeChangeset(changesetId);

    logger.info(`✅ Successfully published merchant to OSM`);
    logger.info(`   Node ID: ${nodeId}`);
    logger.info(`   Changeset: ${changesetId}`);
    logger.info(`   View: https://www.openstreetmap.org/node/${nodeId}`);
    logger.info(`   BTCMap will sync in ~10 minutes: https://btcmap.org`);

    return { nodeId, changesetId };

  } catch (error) {
    // Close changeset even if node creation failed
    try {
      await osmClient.closeChangeset(changesetId);
    } catch (closeError) {
      logger.error('Failed to close changeset:', closeError);
    }
    throw error;
  }
}
