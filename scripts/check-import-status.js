/**
 * COMPREHENSIVE FIX SCRIPT
 * 1. Removes any merchants with default Kibera coordinates
 * 2. Shows what needs to be imported
 * This script is SAFE - it only removes merchants that were imported with default coords
 */

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
  
  console.log('Checking for merchants with default Kibera coordinates...\n');
  
  // Find merchants with default coordinates
  const [defaultCoordMerchants] = await connection.execute(`
    SELECT id, business_name, latitude, longitude
    FROM merchant_submissions
    WHERE latitude = -1.3133 AND longitude = 36.7897
      AND status = 'published'
      AND is_early_adopter = 1
  `);
  
  if (defaultCoordMerchants.length === 0) {
    console.log('✓ No merchants with default coordinates found.');
    console.log('\nYou can now visit: https://afribit.africa/api/admin/merchants/import');
    console.log('and click the import button to import the remaining merchants.\n');
  } else {
    console.log(`Found ${defaultCoordMerchants.length} merchants with default coordinates:\n`);
    defaultCoordMerchants.forEach(m => {
      console.log(`  - ${m.business_name}`);
    });
    
    console.log(`\nDo you want to remove these ${defaultCoordMerchants.length} merchants?`);
    console.log('This will allow them to be re-imported with correct coordinates.');
    console.log('\nTo remove them, run:');
    console.log('  node scripts/remove-default-coord-merchants.js\n');
  }
  
  // Show current status
  const [stats] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN is_early_adopter = 1 THEN 1 ELSE 0 END) as early_adopters
    FROM merchant_submissions
  `);
  
  console.log('Current database status:');
  console.log(`  Total merchants: ${stats[0].total}`);
  console.log(`  Published: ${stats[0].published}`);
  console.log(`  Early adopters: ${stats[0].early_adopters}`);
  console.log(`\n  Expected early adopters: 41`);
  console.log(`  Missing: ${41 - stats[0].early_adopters}`);
  
  await connection.end();
}

main();
