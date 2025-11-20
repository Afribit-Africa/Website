const mysql = require('mysql2/promise');

async function checkSchema() {
  let conn;
  try {
    conn = await mysql.createConnection(
      'mysql://mdawidah_afribit:G5H1t_cAsvIA@mdawidahomestay.com:3306/mdawidah_afribit'
    );
    
    console.log('Connected to database');
    
    const [columns] = await conn.query('DESCRIBE merchant_submissions');
    console.log('\n=== merchant_submissions columns ===');
    columns.forEach(col => {
      console.log(`${col.Field} - ${col.Type} - Null: ${col.Null} - Default: ${col.Default}`);
    });
    
    // Count merchants
    const [countResult] = await conn.query('SELECT COUNT(*) as count FROM merchant_submissions');
    console.log(`\nTotal merchants: ${countResult[0].count}`);
    
    // Check status distribution
    const [statusResult] = await conn.query(
      'SELECT status, COUNT(*) as count FROM merchant_submissions GROUP BY status'
    );
    console.log('\nStatus distribution:');
    statusResult.forEach(row => {
      console.log(`  ${row.status}: ${row.count}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (conn) await conn.end();
  }
}

checkSchema();
