/**
 * Utility to fetch GPS coordinates from BTCMap API
 * BTCMap uses OpenStreetMap data and provides coordinates for merchants
 */

interface OSMJson {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

interface BTCMapElement {
  id: string;
  osm_json: OSMJson;
  tags?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Extract node ID from BTCMap URL
 * Example: https://btcmap.org/merchant/node:12300475666 -> 12300475666
 */
export function extractNodeId(btcMapUrl: string): string | null {
  const match = btcMapUrl.match(/node:(\d+)/);
  return match ? match[1] : null;
}

/**
 * Fetch all elements from BTCMap API
 * This returns all merchants with their GPS coordinates
 */
export async function fetchAllBTCMapElements(): Promise<BTCMapElement[]> {
  try {
    const response = await fetch('https://api.btcmap.org/v2/elements');
    if (!response.ok) {
      throw new Error(`BTCMap API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching BTCMap elements:', error);
    throw error;
  }
}

/**
 * Get coordinates for a specific node ID from BTCMap API
 */
export async function getCoordinatesForNode(nodeId: string): Promise<Coordinates | null> {
  try {
    const elements = await fetchAllBTCMapElements();
    const element = elements.find(el => el.id === `node:${nodeId}`);
    
    if (element && element.osm_json) {
      return {
        latitude: element.osm_json.lat,
        longitude: element.osm_json.lon
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting coordinates for node ${nodeId}:`, error);
    return null;
  }
}

/**
 * Get coordinates for multiple node IDs
 * More efficient than calling getCoordinatesForNode multiple times
 */
export async function getCoordinatesForNodes(nodeIds: string[]): Promise<Map<string, Coordinates>> {
  const coordinatesMap = new Map<string, Coordinates>();
  
  try {
    const elements = await fetchAllBTCMapElements();
    
    for (const nodeId of nodeIds) {
      const element = elements.find(el => el.id === `node:${nodeId}`);
      if (element && element.osm_json) {
        coordinatesMap.set(nodeId, {
          latitude: element.osm_json.lat,
          longitude: element.osm_json.lon
        });
      }
    }
  } catch (error) {
    console.error('Error getting coordinates for nodes:', error);
  }
  
  return coordinatesMap;
}

/**
 * Parse CSV data to extract merchant names and node IDs
 */
export function parseMerchantCSV(csvContent: string): Array<{ name: string; nodeId: string }> {
  const lines = csvContent.split('\n');
  const merchants: Array<{ name: string; nodeId: string }> = [];
  
  // Skip header rows (first 3 lines)
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [name, url] = line.split(',');
    if (name && url) {
      const nodeId = extractNodeId(url);
      if (nodeId) {
        merchants.push({
          name: name.trim(),
          nodeId
        });
      }
    }
  }
  
  return merchants;
}
