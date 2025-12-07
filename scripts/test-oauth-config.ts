/**
 * Test OAuth Configuration
 * Checks which OSM server your OAuth app is registered with
 */

const CLIENT_ID = process.env.OSM_CLIENT_ID;
const CLIENT_SECRET = process.env.OSM_CLIENT_SECRET;
const REDIRECT_URI = 'https://afribit.africa/api/auth/osm/callback';

async function testOAuthConfig() {
  console.log('🔍 Testing OAuth Configuration...\n');

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Missing credentials in .env.local:');
    console.error('   OSM_CLIENT_ID:', CLIENT_ID ? '✅ Set' : '❌ Missing');
    console.error('   OSM_CLIENT_SECRET:', CLIENT_SECRET ? '✅ Set' : '❌ Missing');
    process.exit(1);
  }

  console.log('✅ Credentials found:');
  console.log(`   Client ID: ${CLIENT_ID.substring(0, 20)}...`);
  console.log(`   Client Secret: ${CLIENT_SECRET.substring(0, 20)}...`);
  console.log(`   Redirect URI: ${REDIRECT_URI}\n`);

  // Test which server the app is registered with
  const servers = [
    { name: 'Production', url: 'https://www.openstreetmap.org', api: 'https://api.openstreetmap.org/api/0.6' },
    { name: 'Dev Server', url: 'https://master.apis.dev.openstreetmap.org', api: 'https://master.apis.dev.openstreetmap.org/api/0.6' }
  ];

  console.log('🔍 Checking OAuth app registration...\n');

  for (const server of servers) {
    try {
      console.log(`Testing ${server.name}...`);

      // Try to get a token with an invalid code (will fail, but the error message tells us if the app exists)
      const response = await fetch(`${server.url}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: 'test_invalid_code',
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      });

      const responseText = await response.text();

      if (response.status === 401 && responseText.includes('unknown client')) {
        console.log(`   ❌ App NOT registered on ${server.name}`);
      } else if (response.status === 400 || responseText.includes('invalid') || responseText.includes('expired')) {
        console.log(`   ✅ App IS registered on ${server.name}`);
        console.log(`      (Got expected error for invalid code - app exists!)`);
      } else {
        console.log(`   ⚠️  Unexpected response (${response.status}): ${responseText.substring(0, 100)}`);
      }

      console.log('');
    } catch (error: any) {
      console.log(`   ⚠️  Error testing ${server.name}: ${error.message}\n`);
    }
  }

  console.log('\n📋 NEXT STEPS:');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('If your app is registered on PRODUCTION:');
  console.log('1. Open: https://www.openstreetmap.org/oauth2/authorize?client_id=' + CLIENT_ID + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) + '&response_type=code&scope=read_prefs%20write_api%20write_notes');
  console.log('2. Run: npx tsx scripts/exchange-osm-code-production.ts "YOUR_CODE"\n');

  console.log('If your app is registered on DEV SERVER:');
  console.log('1. Open: https://master.apis.dev.openstreetmap.org/oauth2/authorize?client_id=' + CLIENT_ID + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) + '&response_type=code&scope=read_prefs%20write_api%20write_notes');
  console.log('2. Run: npx tsx scripts/exchange-osm-code.ts "YOUR_CODE"\n');

  console.log('If your app is NOT registered anywhere:');
  console.log('1. Register a new OAuth2 app at: https://www.openstreetmap.org/oauth2/applications/new');
  console.log('2. Set redirect URI to: https://afribit.africa/api/auth/osm/callback');
  console.log('3. Select scopes: read_prefs, write_api, write_notes');
  console.log('4. Update .env.local with new CLIENT_ID and CLIENT_SECRET');
}

testOAuthConfig();
