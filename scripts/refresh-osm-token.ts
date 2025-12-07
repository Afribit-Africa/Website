/**
 * OAuth2 Token Generator for OpenStreetMap
 *
 * This script helps you generate a fresh OAuth2 access token for OSM API.
 *
 * Usage:
 *   1. Run: npx tsx scripts/refresh-osm-token.ts
 *   2. Follow the browser prompt to authorize
 *   3. The script will automatically update .env.local with new tokens
 */

import { createServer } from 'http';
import { parse } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

const OSM_DEV_SERVER = 'https://master.apis.dev.openstreetmap.org';
const REDIRECT_URI = 'https://afribit.africa/api/auth/osm/callback';
const PORT = 3001;

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

async function refreshToken() {
  // Load env variables
  const envPath = join(process.cwd(), '.env.local');
  let envContent = readFileSync(envPath, 'utf-8');

  const CLIENT_ID = process.env.OSM_CLIENT_ID;
  const CLIENT_SECRET = process.env.OSM_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.OSM_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Missing OSM_CLIENT_ID or OSM_CLIENT_SECRET in .env.local');
    process.exit(1);
  }

  // If we have a refresh token, try to refresh it
  if (REFRESH_TOKEN) {
    console.log('🔄 Found existing refresh token, attempting to refresh...');

    try {
      const response = await fetch(`${OSM_DEV_SERVER}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: REFRESH_TOKEN,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      });

      if (response.ok) {
        const tokens = await response.json() as TokenResponse;

        // Update .env.local
        envContent = envContent.replace(
          /OSM_ACCESS_TOKEN="[^"]*"/,
          `OSM_ACCESS_TOKEN="${tokens.access_token}"`
        );
        envContent = envContent.replace(
          /OSM_REFRESH_TOKEN="[^"]*"/,
          `OSM_REFRESH_TOKEN="${tokens.refresh_token}"`
        );

        writeFileSync(envPath, envContent, 'utf-8');

        console.log('✅ Successfully refreshed access token!');
        console.log(`   Access token: ${tokens.access_token.substring(0, 20)}...`);
        console.log(`   Expires in: ${tokens.expires_in} seconds (${Math.floor(tokens.expires_in / 3600)} hours)`);
        console.log('   Updated .env.local');

        return;
      }
    } catch (error) {
      console.log('⚠️  Refresh failed, will generate new token via OAuth flow');
    }
  }

  // No refresh token or refresh failed - do full OAuth flow
  console.log('🔐 Starting OAuth2 authorization flow...');
  console.log('   This will open your browser to authorize the application.');

  const state = Math.random().toString(36).substring(7);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const authUrl = `${OSM_DEV_SERVER}/oauth2/authorize?` + new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'read_prefs write_api write_notes',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  // Create temporary server to receive callback
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url || '', true);

    if (parsedUrl.pathname === '/callback') {
      const code = parsedUrl.query.code as string;
      const returnedState = parsedUrl.query.state as string;

      if (returnedState !== state) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>Error: State mismatch</h1><p>Please try again.</p>');
        server.close();
        return;
      }

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>Error: No authorization code</h1><p>Please try again.</p>');
        server.close();
        return;
      }

      try {
        // Exchange code for token
        const tokenResponse = await fetch(`${OSM_DEV_SERVER}/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code_verifier: codeVerifier,
          }),
        });

        if (!tokenResponse.ok) {
          const error = await tokenResponse.text();
          throw new Error(`Token exchange failed: ${error}`);
        }

        const tokens = await tokenResponse.json() as TokenResponse;

        // Update .env.local
        envContent = envContent.replace(
          /OSM_ACCESS_TOKEN="[^"]*"/,
          `OSM_ACCESS_TOKEN="${tokens.access_token}"`
        );
        envContent = envContent.replace(
          /OSM_REFRESH_TOKEN="[^"]*"/,
          `OSM_REFRESH_TOKEN="${tokens.refresh_token}"`
        );

        writeFileSync(envPath, envContent, 'utf-8');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>Success</title></head>
            <body style="font-family: system-ui; padding: 40px; text-align: center;">
              <h1 style="color: green;">✅ Authorization Successful!</h1>
              <p>Access token has been saved to .env.local</p>
              <p>You can close this window and return to your terminal.</p>
            </body>
          </html>
        `);

        console.log('\n✅ Successfully obtained access token!');
        console.log(`   Access token: ${tokens.access_token.substring(0, 20)}...`);
        console.log(`   Refresh token: ${tokens.refresh_token.substring(0, 20)}...`);
        console.log(`   Expires in: ${tokens.expires_in} seconds (${Math.floor(tokens.expires_in / 3600)} hours)`);
        console.log('   Updated .env.local');
        console.log('\n🚀 You can now run: npx tsx scripts/publish-verified-to-osm.ts');

        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1000);

      } catch (error) {
        console.error('❌ Error exchanging code for token:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>Error</h1><p>Failed to obtain access token. Check console for details.</p>');
        server.close();
        process.exit(1);
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(PORT, () => {
    console.log(`   Callback server listening on http://localhost:${PORT}`);
    console.log('   Opening browser...\n');

    // Open browser using platform-specific command
    const platform = process.platform;
    const openCommand = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';

    exec(`${openCommand} "${authUrl}"`, (error) => {
      if (error) {
        console.error('   Could not open browser automatically.');
        console.log(`\n   Please open this URL manually:\n   ${authUrl}\n`);
      }
    });
  });
}

// PKCE helpers
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(hash));
}

function base64URLEncode(buffer: Uint8Array): string {
  const base64 = Buffer.from(buffer).toString('base64');
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Run
refreshToken().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
