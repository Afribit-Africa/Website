const OSM_PROD_SERVER = 'https://www.openstreetmap.org';
const CLIENT_ID = 'dh70EP1vG00kfFz1_3om17Rr6bRQ6sMRJD0t5Bjx0CA';
const CLIENT_SECRET = 'GnMq_MH6pFT_TEvxNZvSkFGRUoiWVpdDIQRCGitKdM4';
const REDIRECT_URI = 'https://afribit.africa/api/auth/osm/callback';

async function exchangeCode(authCode: string) {
  console.log('🔄 Exchanging authorization code...\n');

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
    console.error('❌ Failed:', await response.text());
    process.exit(1);
  }

  const tokens = await response.json();
  console.log('✅ Full token response:');
  console.log(JSON.stringify(tokens, null, 2));
  console.log('\n📋 Access Token (full):');
  console.log(tokens.access_token);
}

const code = process.argv[2];
if (!code) {
  console.error('❌ Please provide authorization code as argument');
  process.exit(1);
}

exchangeCode(code);
