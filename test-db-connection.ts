import { executeQuery } from './lib/db';

async function testDbConnection() {
  try {
    console.log('Testing database connection...');

    const result = await executeQuery('SELECT 1 as test');
    console.log('✅ Database connection successful:', result);

    // Test merchant_submissions table
    const tableCheck = await executeQuery(`
      SELECT COUNT(*) as count
      FROM merchant_submissions
      WHERE status = 'published'
    `);
    console.log('✅ Merchant submissions table accessible:', tableCheck);

    // Check table structure
    const columns = await executeQuery(`
      SHOW COLUMNS FROM merchant_submissions
    `);
    console.log('\n📋 Table structure:');
    console.log(columns);

    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testDbConnection();
