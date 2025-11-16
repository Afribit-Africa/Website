// Utility to update merchants-data.ts with newly published merchants
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { logger } from './logger';

interface MerchantLink {
  url: string;
  latitude: number;
  longitude: number;
}

/**
 * Add a newly published merchant to the merchants-data.ts file
 */
export async function addMerchantToDirectory(
  osmNodeId: number,
  latitude: number,
  longitude: number,
  businessName: string
): Promise<void> {
  try {
    const filePath = join(process.cwd(), 'lib', 'merchants-data.ts');

    // Read current file
    let fileContent = readFileSync(filePath, 'utf-8');

    // Create new merchant entry
    const newMerchant: MerchantLink = {
      url: `https://btcmap.org/merchant/${osmNodeId}`,
      latitude,
      longitude,
    };

    // Find the btcMapLinks array in the file
    const arrayStartMatch = fileContent.match(/export const btcMapLinks: MerchantLink\[\] = \[/);

    if (!arrayStartMatch) {
      throw new Error('Could not find btcMapLinks array in merchants-data.ts');
    }

    const arrayStartIndex = arrayStartMatch.index! + arrayStartMatch[0].length;

    // Find where to insert (after the opening bracket, with proper indentation)
    const indent = '  ';
    const newEntry = `\n${indent}// ${businessName} (Auto-added: ${new Date().toISOString().split('T')[0]})\n${indent}${JSON.stringify(newMerchant, null, 2).replace(/\n/g, `\n${indent}`)},`;

    // Insert the new merchant at the beginning of the array
    fileContent =
      fileContent.slice(0, arrayStartIndex) +
      newEntry +
      fileContent.slice(arrayStartIndex);

    // Write back to file
    writeFileSync(filePath, fileContent, 'utf-8');

    logger.info(`✅ Added ${businessName} to merchants-data.ts`);
    logger.info(`   Location: ${latitude}, ${longitude}`);
    logger.info(`   BTCMap: https://btcmap.org/merchant/${osmNodeId}`);

  } catch (error) {
    logger.error('❌ Failed to update merchants-data.ts:', error);
    throw error;
  }
}

/**
 * Count total merchants in directory
 */
export function getMerchantCount(): number {
  try {
    const filePath = join(process.cwd(), 'lib', 'merchants-data.ts');
    const fileContent = readFileSync(filePath, 'utf-8');

    // Count occurrences of "url:" in btcMapLinks array
    const matches = fileContent.match(/url:/g);
    return matches ? matches.length : 0;
  } catch (error) {
    logger.error('Failed to count merchants:', error);
    return 0;
  }
}

/**
 * Check if a merchant already exists in directory by coordinates
 */
export function merchantExistsInDirectory(latitude: number, longitude: number): boolean {
  try {
    const filePath = join(process.cwd(), 'lib', 'merchants-data.ts');
    const fileContent = readFileSync(filePath, 'utf-8');

    // Simple check - in production you'd want to parse the file properly
    const latStr = latitude.toFixed(6);
    const lonStr = longitude.toFixed(6);

    return fileContent.includes(`latitude: ${latStr}`) &&
           fileContent.includes(`longitude: ${lonStr}`);
  } catch (error) {
    logger.error('Failed to check merchant existence:', error);
    return false;
  }
}
