import { neon } from '@neondatabase/serverless';
import { logger } from './logger';

// Type for the neon SQL template function
type NeonSQL = ReturnType<typeof neon>;

let sql: NeonSQL | null = null;

/**
 * Get or create Neon database connection
 * Uses the @neondatabase/serverless driver for optimal Vercel performance
 */
export function getDbPool(): NeonSQL {
  if (!sql) {
    // Check for Vercel-prefixed variable first, then fall back to unprefixed
    const databaseUrl = process.env.afribit_DATABASE_URL || process.env.DATABASE_URL;

    if (!databaseUrl) {
      const error = new Error('DATABASE_URL or afribit_DATABASE_URL environment variable is not set');
      logger.error('Database configuration error:', error);
      throw error;
    }

    try {
      sql = neon(databaseUrl);
      logger.info('Neon database connection created');
    } catch (error) {
      logger.error('Failed to create Neon database connection:', error);
      throw error;
    }
  }

  return sql;
}

/**
 * Execute a database query with error handling
 * Converts MySQL-style ? placeholders to PostgreSQL $1, $2, etc.
 * Manually constructs template literal parts for Neon driver
 */
export async function executeQuery<T>(
  query: string,
  params?: any[]
): Promise<T> {
  try {
    const sql = getDbPool();

    // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
    let pgQuery = query;
    let paramIndex = 0;
    pgQuery = pgQuery.replace(/\?/g, () => `$${++paramIndex}`);

    // Manually construct template literal parts for Neon
    // Split query into parts and insert parameters
    const queryParams = params || [];
    
    // Create a template strings array-like object
    const strings = [pgQuery] as any;
    strings.raw = [pgQuery];
    
    // Call sql with the constructed template and spread parameters
    const results = await sql(strings, ...queryParams);
    return results as T;
  } catch (error) {
    logger.error('Database query error:', { query, params, error });
    throw error;
  }
}

/**
 * Execute a database query that returns a single row
 */
export async function executeQuerySingle<T>(
  query: string,
  params?: any[]
): Promise<T | null> {
  const results = await executeQuery<T[]>(query, params);
  return results[0] || null;
}

/**
 * Execute a database transaction
 * Note: For Neon serverless, we use the SQL template literal syntax
 */
export async function executeTransaction<T>(
  callback: (connection: NeonSQL) => Promise<T>
): Promise<T> {
  const sql = getDbPool();

  try {
    // Start transaction
    await sql`BEGIN`;
    logger.debug('Transaction started');

    const result = await callback(sql);

    // Commit transaction
    await sql`COMMIT`;
    logger.debug('Transaction committed');

    return result;
  } catch (error) {
    // Rollback on error
    try {
      await sql`ROLLBACK`;
    } catch {
      // Ignore rollback errors
    }
    logger.error('Transaction rolled back due to error:', error);
    throw error;
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const sql = getDbPool();
    await sql`SELECT 1`;
    logger.info('Database connection test successful');
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
}

/**
 * Close database connection
 * Note: Neon serverless connections are stateless, no explicit close needed
 */
export async function closePool(): Promise<void> {
  sql = null;
  logger.info('Database connection reference cleared');
}
