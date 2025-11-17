import mysql from 'mysql2/promise';
import { logger } from './logger';

let pool: mysql.Pool | null = null;

/**
 * Get or create database connection pool
 * Includes error handling and logging
 */
export function getDbPool(): mysql.Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      const error = new Error('DATABASE_URL environment variable is not set');
      logger.error('Database configuration error:', error);
      throw error;
    }

    try {
      pool = mysql.createPool({
        uri: databaseUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });

      // Monitor connection events
      pool.on('connection', () => {
        logger.debug('New database connection established');
      });

      logger.info('Database connection pool created');
    } catch (error) {
      logger.error('Failed to create database pool:', error);
      throw error;
    }
  }

  return pool;
}

/**
 * Execute a database query with error handling
 */
export async function executeQuery<T>(
  query: string,
  params?: any[]
): Promise<T> {
  try {
    const connection = getDbPool();
    const [results] = await connection.execute(query, params);
    return results as T;
  } catch (error) {
    logger.error('Database query error:', { query, params, error });
    throw error;
  }
}

/**
 * Execute a database transaction
 * Automatically commits on success, rolls back on error
 */
export async function executeTransaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getDbPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    logger.debug('Transaction started');

    const result = await callback(connection);

    await connection.commit();
    logger.debug('Transaction committed');

    return result;
  } catch (error) {
    await connection.rollback();
    logger.error('Transaction rolled back due to error:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const pool = getDbPool();
    await pool.query('SELECT 1');
    logger.info('Database connection test successful');
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
}

/**
 * Close database connection pool
 * Should be called on application shutdown
 */
export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.end();
      pool = null;
      logger.info('Database connection pool closed');
    } catch (error) {
      logger.error('Error closing database pool:', error);
      throw error;
    }
  }
}
