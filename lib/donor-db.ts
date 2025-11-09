import { executeQuery } from './db';

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
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoice_id VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      email VARCHAR(255),
      amount DECIMAL(10, 2) NOT NULL,
      tier VARCHAR(50) NOT NULL,
      donation_type ENUM('anonymous', 'named') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_created_at (created_at)
    )
  `;

  await executeQuery(createTableQuery);
}

export async function saveDonorInfo(donorInfo: DonorInfo) {
  const { invoiceId, name, email, amount, tier, donationType } = donorInfo;

  const query = `
    INSERT INTO donors (invoice_id, name, email, amount, tier, donation_type)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      email = VALUES(email),
      amount = VALUES(amount),
      tier = VALUES(tier),
      donation_type = VALUES(donation_type)
  `;

  await executeQuery(query, [
    invoiceId,
    donationType === 'named' ? name : null,
    donationType === 'named' ? email : null,
    amount,
    tier,
    donationType,
  ]);
}

export async function getDonorByInvoiceId(invoiceId: string) {
  const query = `SELECT * FROM donors WHERE invoice_id = ?`;
  const results = await executeQuery<any[]>(query, [invoiceId]);
  return results[0] || null;
}

export async function getAllDonors() {
  const query = `
    SELECT * FROM donors
    WHERE donation_type = 'named'
    ORDER BY created_at DESC
  `;
  return await executeQuery<any[]>(query);
}

export async function getDonorStats() {
  const query = `
    SELECT
      COUNT(*) as total_donations,
      SUM(amount) as total_amount,
      COUNT(CASE WHEN donation_type = 'named' THEN 1 END) as named_donations,
      COUNT(CASE WHEN donation_type = 'anonymous' THEN 1 END) as anonymous_donations
    FROM donors
  `;
  const results = await executeQuery<any[]>(query);
  return results[0] || null;
}
