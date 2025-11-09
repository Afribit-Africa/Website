import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function executeQuery<T>(
  query: string,
  params?: any[]
): Promise<T> {
  const connection = getDbPool();
  const [results] = await connection.execute(query, params);
  return results as T;
}
