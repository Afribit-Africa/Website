import { executeQuery } from './db';
import { logger } from './logger';
import type { Donor, DonorStats } from './types';

export interface DonorInfo {
  invoiceId: string;
  name: string;
  email: string;
  amount: number;
  tier: string;
  donationType: 'anonymous' | 'named';
  createdAt?: Date;
}

export async function initDonorsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS donors (
      id SERIAL PRIMARY KEY,
      invoice_id VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      email VARCHAR(255),
      amount DECIMAL(10, 2) NOT NULL,
      tier VARCHAR(50) NOT NULL,
      donation_type VARCHAR(20) NOT NULL CHECK (donation_type IN ('anonymous', 'named')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createIndexesQuery = `
    CREATE INDEX IF NOT EXISTS idx_donors_invoice_id ON donors(invoice_id);
    CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);
    CREATE INDEX IF NOT EXISTS idx_donors_created_at ON donors(created_at);
    CREATE INDEX IF NOT EXISTS idx_donors_donation_type ON donors(donation_type);
  `;

  try {
    await executeQuery(createTableQuery);
    // Create indexes separately to avoid issues
    try {
      await executeQuery(createIndexesQuery);
    } catch (indexError) {
      // Indexes might already exist, that's fine
      logger.debug('Index creation skipped (may already exist)');
    }
    logger.info('Donors table initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize donors table:', error);
    throw error;
  }
}

export async function saveDonorInfo(donorInfo: DonorInfo) {
  const { invoiceId, name, email, amount, tier, donationType } = donorInfo;

  // PostgreSQL UPSERT syntax using ON CONFLICT
  const query = `
    INSERT INTO donors (invoice_id, name, email, amount, tier, donation_type)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (invoice_id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      amount = EXCLUDED.amount,
      tier = EXCLUDED.tier,
      donation_type = EXCLUDED.donation_type
  `;

  try {
    await executeQuery(query, [
      invoiceId,
      donationType === 'named' ? name : null,
      donationType === 'named' ? email : null,
      amount,
      tier,
      donationType,
    ]);
    logger.info('Donor info saved successfully:', invoiceId);
  } catch (error) {
    logger.error('Failed to save donor info:', { invoiceId, error });
    throw error;
  }
}

export async function getDonorByInvoiceId(invoiceId: string): Promise<Donor | null> {
  const query = `SELECT * FROM donors WHERE invoice_id = $1`;

  try {
    const results = await executeQuery<Donor[]>(query, [invoiceId]);
    return results[0] || null;
  } catch (error) {
    logger.error('Failed to get donor by invoice ID:', { invoiceId, error });
    throw error;
  }
}

export async function getAllDonors(): Promise<Donor[]> {
  const query = `
    SELECT * FROM donors
    WHERE donation_type = 'named'
    ORDER BY created_at DESC
  `;

  try {
    return await executeQuery<Donor[]>(query);
  } catch (error) {
    logger.error('Failed to get all donors:', error);
    throw error;
  }
}

export async function getDonorStats(): Promise<DonorStats | null> {
  const query = `
    SELECT
      COUNT(*) as total_donations,
      SUM(amount) as total_amount,
      COUNT(CASE WHEN donation_type = 'named' THEN 1 END) as named_donations,
      COUNT(CASE WHEN donation_type = 'anonymous' THEN 1 END) as anonymous_donations
    FROM donors
  `;

  try {
    const results = await executeQuery<DonorStats[]>(query);
    return results[0] || null;
  } catch (error) {
    logger.error('Failed to get donor stats:', error);
    throw error;
  }
}
