import 'dotenv/config';

const OSM_API_URL = process.env.OSM_API_URL || 'https://api.openstreetmap.org/api/0.6';
const OSM_ACCESS_TOKEN = process.env.OSM_ACCESS_TOKEN;

console.log('🔍 Testing OSM Authentication...\n');
console.log('API URL:', OSM_API_URL);
console.log('Token (first 20 chars):', OSM_ACCESS_TOKEN?.substring(0, 20) + '...');
console.log('\n📡 Making test request to /api/0.6/user/details...\n');

async function testAuth() {
  try {
    console.log('Full URL:', `${OSM_API_URL}/user/details`);
    console.log('Full token:', OSM_ACCESS_TOKEN);
    console.log('Authorization header:', `Bearer ${OSM_ACCESS_TOKEN}`);

    const response = await fetch(`${OSM_API_URL}/user/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
      },
    });

    console.log('Status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Authentication successful!');
      console.log('User:', data.user.display_name);
      console.log('ID:', data.user.id);
    } else {
      const error = await response.text();
      console.log('❌ Authentication failed');
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

testAuth();
