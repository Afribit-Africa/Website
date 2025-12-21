/**
 * Initialize Neon PostgreSQL Database Schema
 * Run this script to create all required tables
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function initializeDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🚀 Connecting to Neon PostgreSQL...');
  const sql = neon(databaseUrl);

  try {
    // Test connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connected to database at:', result[0].current_time);

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'neon-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split by semicolons but be careful with function definitions
    const statements = splitSQLStatements(schema);

    console.log(`\n📋 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;

      try {
        // Use tagged template literal for raw SQL
        await sql.query(statement);
        // Extract table/index name for logging
        const match = statement.match(/(?:CREATE TABLE IF NOT EXISTS|CREATE INDEX IF NOT EXISTS|CREATE OR REPLACE FUNCTION|CREATE TRIGGER|DROP TRIGGER IF EXISTS)\s+(\w+)/i);
        const name = match ? match[1] : `Statement ${i + 1}`;
        console.log(`  ✓ ${name}`);
      } catch (error: any) {
        // Some errors are okay (like "already exists")
        if (error.message?.includes('already exists')) {
          console.log(`  ⚠ Already exists: ${error.message.split('"')[1] || 'item'}`);
        } else {
          console.error(`  ✗ Error in statement ${i + 1}:`, error.message);
          // Continue with other statements
        }
      }
    }

    console.log('\n✅ Database schema initialization complete!');

    // Verify tables exist
    console.log('\n📊 Verifying tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    console.log('\nCreated tables:');
    tables.forEach((t: any) => console.log(`  - ${t.table_name}`));

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Helper to split SQL statements properly (handling functions with semicolons)
function splitSQLStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inFunction = false;

  const lines = sql.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip comments
    if (trimmedLine.startsWith('--')) continue;

    // Track function blocks
    if (trimmedLine.includes('$$')) {
      inFunction = !inFunction;
    }

    current += line + '\n';

    // Split on semicolons only if not in a function block
    if (trimmedLine.endsWith(';') && !inFunction) {
      statements.push(current.trim());
      current = '';
    }
  }

  // Add any remaining content
  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements.filter(s => s.length > 0);
}

initializeDatabase();
