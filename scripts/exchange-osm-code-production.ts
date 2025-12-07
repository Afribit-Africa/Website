/**
 * Exchange OSM Authorization Code for Access Token (PRODUCTION)
 *
 * Usage:
 *   1. Open: https://www.openstreetmap.org/oauth2/authorize?client_id=V4CLNSdiz57RbQV5WvW3QQ83gbmEInS_m0pZms9BNUs&redirect_uri=https://afribit.africa/api/auth/osm/callback&response_type=code&scope=read_prefs%20write_api%20write_notes
 *   2. Authorize and copy the code from the success page
 *   3. Run: npx tsx scripts/exchange-osm-code-production.ts "YOUR_CODE_HERE"
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const OSM_PRODUCTION = 'https://www.openstreetmap.org';
const REDIRECT_URI = 'https://afribit.africa/api/auth/osm/callback';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  created_at: number;
}

async function exchangeCode(authCode: string) {
  const envPath = join(process.cwd(), '.env.local');
  let envContent = readFileSync(envPath, 'utf-8');

  const CLIENT_ID = process.env.OSM_CLIENT_ID;
  const CLIENT_SECRET = process.env.OSM_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Missing OSM_CLIENT_ID or OSM_CLIENT_SECRET in .env.local');
    console.log('   Make sure to set these environment variables first.');
    process.exit(1);
  }

  console.log('🔄 Exchanging authorization code for access token (PRODUCTION)...');
  console.log(`   Server: ${OSM_PRODUCTION}`);
  console.log(`   Client ID: ${CLIENT_ID.substring(0, 20)}...`);
  console.log(`   Redirect URI: ${REDIRECT_URI}\n`);

  try {
    const response = await fetch(`${OSM_PRODUCTION}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Token exchange failed:', response.status);
      console.error('   Error:', errorText);

      if (response.status === 401) {
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Check if your OAuth app is registered on PRODUCTION (https://www.openstreetmap.org/oauth2/applications)');
        console.error('   2. Verify the redirect URI matches exactly: https://afribit.africa/api/auth/osm/callback');
        console.error('   3. Make sure you used the production authorization URL (not dev server)');
        console.error('   4. Authorization codes expire quickly - get a fresh one and run immediately');
      }

      process.exit(1);
    }

    const tokens = await response.json() as TokenResponse;

    // Update .env.local with new tokens
    if (envContent.includes('OSM_ACCESS_TOKEN=')) {
      envContent = envContent.replace(
        /OSM_ACCESS_TOKEN="[^"]*"[^\n]*/,
        `OSM_ACCESS_TOKEN="${tokens.access_token}"  # Production token`
      );
    } else {
      envContent += `\nOSM_ACCESS_TOKEN="${tokens.access_token}"  # Production token`;
    }

    if (tokens.refresh_token) {
      if (envContent.includes('OSM_REFRESH_TOKEN=')) {
        envContent = envContent.replace(
          /OSM_REFRESH_TOKEN="[^"]*"/,
          `OSM_REFRESH_TOKEN="${tokens.refresh_token}"`
        );
      } else {
        envContent += `\nOSM_REFRESH_TOKEN="${tokens.refresh_token}"`;
      }
    }

    writeFileSync(envPath, envContent, 'utf-8');

    console.log('\n✅ Successfully obtained PRODUCTION access token!');
    console.log(`   Access token: ${tokens.access_token.substring(0, 30)}...`);
    if (tokens.refresh_token) {
      console.log(`   Refresh token: ${tokens.refresh_token.substring(0, 30)}...`);
    }
    console.log(`   Token type: ${tokens.token_type}`);
    console.log(`   Expires in: ${tokens.expires_in} seconds (${Math.floor(tokens.expires_in / 3600)} hours)`);
    console.log(`   Scope: ${tokens.scope}`);
    console.log('\n   ✅ Updated .env.local with production token');
    console.log('\n🚀 You can now deploy to production:');
    console.log('   $env:OSM_API_URL="https://api.openstreetmap.org/api/0.6"; npx tsx scripts/deploy-production-osm.ts');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get authorization code from command line
const authCode = process.argv[2];

if (!authCode) {
  console.error('❌ No authorization code provided\n');
  console.log('📋 INSTRUCTIONS:');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('Step 1: Open this URL in your browser (PRODUCTION):');
  console.log('https://www.openstreetmap.org/oauth2/authorize?client_id=V4CLNSdiz57RbQV5WvW3QQ83gbmEInS_m0pZms9BNUs&redirect_uri=https://afribit.africa/api/auth/osm/callback&response_type=code&scope=read_prefs%20write_api%20write_notes');
  console.log('\nStep 2: Click "Authorize" to grant permissions');
  console.log('\nStep 3: Copy the authorization code from the URL or page');
  console.log('\nStep 4: Run this script with the code:');
  console.log('   npx tsx scripts/exchange-osm-code-production.ts "YOUR_CODE_HERE"');
  console.log('\n⚠️  IMPORTANT: Authorization codes expire in ~10 minutes!');
  console.log('   If you get an error, get a fresh code and try again immediately.');
  console.log('\n💡 NOTE: Your OAuth app MUST be registered on production OpenStreetMap');
  console.log('   Check: https://www.openstreetmap.org/oauth2/applications');
  process.exit(1);
}

exchangeCode(authCode);
