/**
 * Exchange OSM Authorization Code for Access Token
 *
 * Usage:
 *   1. Open: https://master.apis.dev.openstreetmap.org/oauth2/authorize?client_id=V4CLNSdiz57RbQV5WvW3QQ83gbmEInS_m0pZms9BNUs&redirect_uri=https://afribit.africa/api/auth/osm/callback&response_type=code&scope=read_prefs%20write_api%20write_notes
 *   2. Authorize and copy the code from the success page
 *   3. Run: npx tsx scripts/exchange-osm-code.ts "YOUR_CODE_HERE"
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const OSM_DEV_SERVER = 'https://master.apis.dev.openstreetmap.org';
const REDIRECT_URI = 'https://afribit.africa/api/auth/osm/callback';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
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

  console.log('🔄 Exchanging authorization code for access token...');
  console.log(`   Using client ID: ${CLIENT_ID.substring(0, 20)}...`);

  try {
    const response = await fetch(`${OSM_DEV_SERVER}/oauth2/token`, {
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
      console.error('❌ Token exchange failed:', response.status, errorText);
      process.exit(1);
    }

    const tokens = await response.json() as TokenResponse;

    // Update .env.local with new tokens
    envContent = envContent.replace(
      /OSM_ACCESS_TOKEN="[^"]*"/,
      `OSM_ACCESS_TOKEN="${tokens.access_token}"`
    );
    envContent = envContent.replace(
      /OSM_REFRESH_TOKEN="[^"]*"/,
      `OSM_REFRESH_TOKEN="${tokens.refresh_token}"`
    );

    writeFileSync(envPath, envContent, 'utf-8');

    console.log('\n✅ Successfully obtained access token!');
    console.log(`   Access token: ${tokens.access_token.substring(0, 30)}...`);
    console.log(`   Refresh token: ${tokens.refresh_token.substring(0, 30)}...`);
    console.log(`   Token type: ${tokens.token_type}`);
    console.log(`   Expires in: ${tokens.expires_in} seconds (${Math.floor(tokens.expires_in / 3600)} hours)`);
    console.log(`   Scope: ${tokens.scope}`);
    console.log('\n   ✅ Updated .env.local with new tokens');
    console.log('\n🚀 You can now publish merchants to OSM:');
    console.log('   npx tsx scripts/publish-verified-to-osm.ts');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get authorization code from command line
const authCode = process.argv[2];

if (!authCode) {
  console.error('❌ No authorization code provided\n');
  console.log('Usage:');
  console.log('  1. Open this URL in your browser:');
  console.log('     https://master.apis.dev.openstreetmap.org/oauth2/authorize?client_id=V4CLNSdiz57RbQV5WvW3QQ83gbmEInS_m0pZms9BNUs&redirect_uri=https://afribit.africa/api/auth/osm/callback&response_type=code&scope=read_prefs%20write_api%20write_notes');
  console.log('\n  2. Authorize the application');
  console.log('\n  3. Copy the authorization code from the success page');
  console.log('\n  4. Run this script with the code:');
  console.log('     npx tsx scripts/exchange-osm-code.ts "YOUR_CODE_HERE"');
  process.exit(1);
}

// Load environment variables
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?([^"]*)"?$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim();
  }
});

exchangeCode(authCode);
