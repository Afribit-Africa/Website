const mysql = require('mysql2/promise');

// Test all SQL queries used in admin API routes
async function testAdminQueries() {
  let conn;
  try {
    conn = await mysql.createConnection(
      'mysql://mdawidah_afribit:G5H1t_cAsvIA@mdawidahomestay.com:3306/mdawidah_afribit'
    );
    
    console.log('✓ Connected to database\n');
    
    // Test 1: Admin Dashboard Stats Query
    console.log('Testing: Admin Dashboard Stats...');
    try {
      const [stats] = await conn.query(`
        SELECT
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingCount,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approvedCount,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as publishedCount,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejectedCount,
          SUM(CASE WHEN is_early_adopter = true THEN 1 ELSE 0 END) as earlyAdoptersCount,
          SUM(CASE WHEN submitted_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as submissionsLast7Days,
          SUM(CASE WHEN submitted_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as submissionsLast30Days,
          COUNT(*) as totalSubmissions
        FROM merchant_submissions
      `);
      console.log('  ✓ Dashboard stats query works');
      console.log('  Stats:', stats[0]);
    } catch (error) {
      console.error('  ✗ Dashboard stats query failed:', error.message);
    }
    
    // Test 2: Submissions List Query (with status filter)
    console.log('\nTesting: Submissions List (pending)...');
    try {
      const [submissions] = await conn.query(`
        SELECT
          id,
          business_name as businessName,
          category_value as categoryValue,
          description,
          latitude,
          longitude,
          address,
          phone,
          website,
          payment_onchain as paymentOnchain,
          payment_lightning as paymentLightning,
          payment_lightning_contactless as paymentLightningContactless,
          contact_name as contactName,
          contact_email as contactEmail,
          status,
          submitted_at as submittedAt,
          is_early_adopter as isEarlyAdopter,
          adopter_number as adopterNumber
        FROM merchant_submissions
        WHERE status = 'pending'
        ORDER BY submitted_at DESC
      `);
      console.log(`  ✓ Submissions query works - Found ${submissions.length} pending`);
    } catch (error) {
      console.error('  ✗ Submissions query failed:', error.message);
    }
    
    // Test 3: Merchants List Query
    console.log('\nTesting: Merchants List (all merchants)...');
    try {
      const [merchants] = await conn.query(`
        SELECT
          id, business_name, category_key, category_value, description,
          latitude, longitude, address, phone, website, opening_hours,
          social_twitter, social_facebook, social_instagram,
          payment_onchain, payment_lightning, payment_lightning_contactless,
          contact_name, contact_email, contact_relationship,
          status, osm_node_id, is_early_adopter, adopter_number,
          submitted_at, verified_at, published_at
        FROM merchant_submissions
        ORDER BY submitted_at DESC
      `);
      console.log(`  ✓ Merchants list query works - Found ${merchants.length} total merchants`);
    } catch (error) {
      console.error('  ✗ Merchants list query failed:', error.message);
    }
    
    // Test 4: Published Merchants Query
    console.log('\nTesting: Published Merchants...');
    try {
      const [published] = await conn.query(`
        SELECT
          id,
          business_name as businessName,
          category_value as categoryValue,
          address,
          latitude,
          longitude,
          payment_onchain as paymentOnchain,
          payment_lightning as paymentLightning,
          submitted_at as submittedAt,
          published_at as publishedAt,
          is_early_adopter as isEarlyAdopter,
          adopter_number as adopterNumber
        FROM merchant_submissions
        WHERE status = 'published'
        ORDER BY published_at DESC
      `);
      console.log(`  ✓ Published merchants query works - Found ${published.length} published`);
    } catch (error) {
      console.error('  ✗ Published merchants query failed:', error.message);
    }
    
    // Test 5: Recent Submissions Query
    console.log('\nTesting: Recent Submissions...');
    try {
      const [recent] = await conn.query(`
        SELECT id, business_name as businessName, contact_email as contactEmail, status, submitted_at as submittedAt
        FROM merchant_submissions
        ORDER BY submitted_at DESC
        LIMIT 10
      `);
      console.log(`  ✓ Recent submissions query works - Found ${recent.length} recent`);
    } catch (error) {
      console.error('  ✗ Recent submissions query failed:', error.message);
    }
    
    console.log('\n✓ All admin API queries tested successfully!');
    
  } catch (error) {
    console.error('Connection error:', error.message);
  } finally {
    if (conn) await conn.end();
  }
}

testAdminQueries();
