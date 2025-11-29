/**
 * Create merchant_edit_requests table
 * Run this before the confirmation migration
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTable() {
  console.log('🔧 Creating merchant_edit_requests table...\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL not found');
    process.exit(1);
  }

  const urlMatch = databaseUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

  if (!urlMatch) {
    console.error('❌ ERROR: Invalid DATABASE_URL format');
    process.exit(1);
  }

  const [, user, password, host, port, database] = urlMatch;

  let connection;

  try {
    connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      multipleStatements: true
    });

    console.log('✅ Connected to database\n');

    const sqlFilePath = path.join(__dirname, 'create-merchant-edit-requests-table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('📄 Executing table creation SQL...\n');

    await connection.query(sqlContent);

    console.log('✅ Table created successfully!\n');

  } catch (error: any) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTable();
