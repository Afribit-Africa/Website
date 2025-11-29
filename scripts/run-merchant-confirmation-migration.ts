/**
 * Run Merchant Confirmation Migration
 *
 * This script applies the database schema changes for the two-step approval workflow.
 * Run this before deploying the admin approval system.
 *
 * Usage: npm run ts-node scripts/run-merchant-confirmation-migration.ts
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🔧 Starting merchant confirmation migration...\n');

  // Parse DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  // Parse MySQL connection URL
  const urlMatch = databaseUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

  if (!urlMatch) {
    console.error('❌ ERROR: Invalid DATABASE_URL format');
    process.exit(1);
  }

  const [, user, password, host, port, database] = urlMatch;

  console.log('📊 Database connection details:');
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   Database: ${database}`);
  console.log(`   User: ${user}\n`);

  let connection;

  try {
    // Create database connection
    connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      multipleStatements: true
    });

    console.log('✅ Connected to database\n');

    // Read migration SQL file
    const sqlFilePath = path.join(__dirname, 'add-merchant-confirmation.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('📄 Executing migration SQL...\n');

    // Execute migration
    const [results] = await connection.query(sqlContent);

    console.log('✅ Migration completed successfully!\n');

    // Display results
    if (Array.isArray(results)) {
      results.forEach((result: any) => {
        if (result && typeof result === 'object') {
          console.log(result);
        }
      });
    }

    console.log('\n✨ Database schema updated:');
    console.log('   • Added confirmation_token column');
    console.log('   • Added merchant_confirmed_at column');
    console.log('   • Added token_expires_at column');
    console.log('   • Updated status enum (approved, merchant_confirmed, applied)');
    console.log('   • Created indexes for performance');

  } catch (error: any) {
    console.error('❌ Migration failed:');
    console.error(error.message);

    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('\n⚠️  Note: Some columns may already exist. This is normal if re-running the migration.');
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run migration
runMigration().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
