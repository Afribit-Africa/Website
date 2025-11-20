const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'mdawidahomestay.com',
  port: 3306,
  user: 'mdawidah_afribit',
  password: 'G5H1t_cAsvIA',
  database: 'mdawidah_afribit'
};

async function main() {
  const connection = await mysql.createConnection(dbConfig);
  
  const [merchants] = await connection.execute(`
    SELECT business_name, latitude, longitude, status, is_early_adopter
    FROM merchant_submissions
    ORDER BY submitted_at DESC
  `);
  
  console.log(`\nTotal merchants in database: ${merchants.length}\n`);
  
  merchants.forEach((m, i) => {
    console.log(`${i + 1}. ${m.business_name}`);
    console.log(`   Status: ${m.status}, Early Adopter: ${m.is_early_adopter}`);
    console.log(`   Coords: ${m.latitude}, ${m.longitude}\n`);
  });
  
  await connection.end();
}

main();
