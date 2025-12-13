/**
 * Exchange OSM Production Authorization Code for Access Token
 *
 * This script exchanges an authorization code for access tokens on PRODUCTION OSM
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const OSM_PROD_SERVER = 'https://www.openstreetmap.org';
const CLIENT_ID = 'dh70EP1vG00kfFz1_3om17Rr6bRQ6sMRJD0t5Bjx0CA';
const CLIENT_SECRET = 'GnMq_MH6pFT_TEvxNZvSkFGRUoiWVpdDIQRCGitKdM4';
const REDIRECT_URI = 'https://afribit.africa/api/auth/osm/callback'; // Registered callback URL

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  created_at: number;
}

async function exchangeCode(authCode: string) {
  console.log('🔄 Exchanging authorization code for PRODUCTION access token...');

  try {
    const response = await fetch(`${OSM_PROD_SERVER}/oauth2/token`, {
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
      process.exit(1);
    }

    const tokens = await response.json() as TokenResponse;

    // Update .env.local with new tokens
    const envPath = join(process.cwd(), '.env.local');
    let envContent = readFileSync(envPath, 'utf-8');

    envContent = envContent.replace(
      /OSM_ACCESS_TOKEN="[^"]*"/,
      `OSM_ACCESS_TOKEN="${tokens.access_token}"`
    );

    if (tokens.refresh_token) {
      envContent = envContent.replace(
        /OSM_REFRESH_TOKEN="[^"]*"/,
        `OSM_REFRESH_TOKEN="${tokens.refresh_token}"`
      );
    }

    writeFileSync(envPath, envContent, 'utf-8');

    console.log('\n✅ Successfully obtained PRODUCTION access token!');
    console.log(`   Access token: ${tokens.access_token.substring(0, 40)}...`);
    if (tokens.refresh_token) {
      console.log(`   Refresh token: ${tokens.refresh_token.substring(0, 40)}...`);
    }
    console.log(`   Token type: ${tokens.token_type}`);
    console.log(`   Expires in: ${tokens.expires_in} seconds (${Math.floor(tokens.expires_in / 3600)} hours)`);
    console.log(`   Scope: ${tokens.scope}`);
    console.log('\n   ✅ Updated .env.local with new tokens');
    console.log('\n🚀 You can now publish Ruth Shop and other merchants to OSM:');
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
  console.log('📋 Steps to get authorization code:\n');
  console.log('1. Open this URL in your browser:');
  console.log(`   ${OSM_PROD_SERVER}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=read_prefs+write_api\n`);
  console.log('2. Click "Authorize" (you may need to log in first)');
  console.log('3. Copy the authorization code shown');
  console.log('4. Run this script with the code:\n');
  console.log('   npx tsx get-osm-token.ts YOUR_CODE_HERE\n');
  process.exit(1);
}

exchangeCode(authCode);
