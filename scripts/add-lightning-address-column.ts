/**
 * Migration Script: Add Lightning Address Column
 * Run this script to add the lightning_address column to existing databases
 * 
 * Usage: npx ts-node scripts/add-lightning-address-column.ts
 */

import { executeQuery } from '../lib/db';
import { logger } from '../lib/logger';

async function migrateLightningAddress() {
  try {
    logger.info('🚀 Starting migration: Add lightning_address column...');

    // Add column
    await executeQuery(`
      ALTER TABLE merchant_submissions 
      ADD COLUMN lightning_address VARCHAR(255) NULL 
      AFTER payment_lightning_contactless
    `);

    logger.info('✅ Column lightning_address added successfully');

    // Add index
    await executeQuery(`
      CREATE INDEX idx_lightning_address 
      ON merchant_submissions(lightning_address)
    `);

    logger.info('✅ Index idx_lightning_address created successfully');

    // Verify column exists
    const result = await executeQuery<any[]>(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'merchant_submissions' 
      AND COLUMN_NAME = 'lightning_address'
    `);

    if (result.length > 0) {
      logger.info('✅ Migration verified:', result[0]);
      logger.info('🎉 Migration completed successfully!');
    } else {
      logger.error('❌ Migration verification failed - column not found');
    }

  } catch (error: any) {
    // Column already exists error
    if (error.code === 'ER_DUP_FIELDNAME') {
      logger.info('ℹ️ Column lightning_address already exists');
      return;
    }
    
    // Index already exists error
    if (error.code === 'ER_DUP_KEYNAME') {
      logger.info('ℹ️ Index idx_lightning_address already exists');
      return;
    }

    logger.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateLightningAddress()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error('Fatal error during migration:', error);
    process.exit(1);
  });
