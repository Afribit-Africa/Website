/**
 * Verify OSM nodes by checking the OSM API directly
 */

const OSM_API_URL = process.env.OSM_API_URL || 'https://master.apis.dev.openstreetmap.org/api/0.6';
const OSM_ACCESS_TOKEN = process.env.OSM_ACCESS_TOKEN;

interface NodeCheck {
  nodeId: string;
  businessName: string;
  exists: boolean;
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
}

async function checkOSMNode(nodeId: string, businessName: string): Promise<NodeCheck> {
  try {
    const response = await fetch(`${OSM_API_URL}/node/${nodeId}`, {
      headers: {
        'Authorization': `Bearer ${OSM_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      return {
        nodeId,
        businessName,
        exists: false,
      };
    }

    const xmlText = await response.text();

    // Parse basic info from XML
    const latMatch = xmlText.match(/lat="([^"]+)"/);
    const lonMatch = xmlText.match(/lon="([^"]+)"/);
    const tagMatches = xmlText.matchAll(/<tag k="([^"]+)" v="([^"]+)"\/>/g);

    const tags: Record<string, string> = {};
    for (const match of tagMatches) {
      tags[match[1]] = match[2];
    }

    return {
      nodeId,
      businessName,
      exists: true,
      lat: latMatch ? parseFloat(latMatch[1]) : undefined,
      lon: lonMatch ? parseFloat(lonMatch[1]) : undefined,
      tags,
    };
  } catch (error: any) {
    console.error(`Error checking node ${nodeId}:`, error.message);
    return {
      nodeId,
      businessName,
      exists: false,
    };
  }
}

async function verifyOSMNodes() {
  console.log('🔍 Verifying OSM nodes on server...\n');
  console.log(`📡 API: ${OSM_API_URL}\n`);

  if (!OSM_ACCESS_TOKEN) {
    console.error('❌ Missing OSM_ACCESS_TOKEN');
    process.exit(1);
  }

  // The 20 new nodes we created
  const newNodes = [
    { id: '4361326784', name: '3 West Butchery' },
    { id: '4361326785', name: '3 West Collection' },
    { id: '4361326786', name: '3 West Hotel' },
    { id: '4361326787', name: 'Abebo Vegez' },
    { id: '4361326788', name: 'AC Gas Suppliers' },
    { id: '4361326789', name: 'Black and White Fries Corner' },
    { id: '4361326790', name: 'Bridgeway Shop' },
    { id: '4361326791', name: "Candy's Collection Hub" },
    { id: '4361326792', name: 'Caronaliak' },
    { id: '4361326793', name: 'Galaxxy Toilet' },
    { id: '4361326794', name: 'Goreti Greens Shop' },
    { id: '4361326795', name: 'Krezzy Kicks' },
    { id: '4361326796', name: 'Mama Clear' },
    { id: '4361326797', name: 'Mama Eddy Salon' },
    { id: '4361326798', name: 'Mama Nonny Shop' },
    { id: '4361326799', name: 'Shibe' },
    { id: '4361326800', name: 'Sokoni Mboga' },
    { id: '4361326801', name: 'Soweto Car Wash' },
    { id: '4361326802', name: 'Venlavery Retail Shop' },
    { id: '4361326803', name: 'Yummy Tummy' },
  ];

  // Sample of old nodes
  const oldNodes = [
    { id: '12300462656', name: 'ABUKI DISTRIBUTORS' },
    { id: '12300515181', name: 'Arca Tech Services' },
    { id: '12300417204', name: 'BIG BROTHER CAR WASH' },
    { id: '12300462655', name: 'BIOGAS PUBLIC WASHROOMS' },
    { id: '12300467146', name: 'BLACK AND WHITE' },
  ];

  console.log('✅ Checking 20 NEW verified nodes (should exist):\n');

  let newExisting = 0;
  for (const node of newNodes) {
    const result = await checkOSMNode(node.id, node.name);
    if (result.exists) {
      console.log(`✅ ${node.name} - Node ${node.id}`);
      if (result.tags?.['afribit:verified']) {
        console.log(`   🏷️  afribit:verified = ${result.tags['afribit:verified']}`);
      }
      if (result.tags?.name) {
        console.log(`   📛 name = ${result.tags.name}`);
      }
      if (result.lat && result.lon) {
        console.log(`   📍 ${result.lat}, ${result.lon}`);
      }
      newExisting++;
    } else {
      console.log(`❌ ${node.name} - Node ${node.id} NOT FOUND`);
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n⚠️  Checking 5 OLD nodes (should NOT exist):\n`);

  let oldExisting = 0;
  for (const node of oldNodes) {
    const result = await checkOSMNode(node.id, node.name);
    if (result.exists) {
      console.log(`⚠️  ${node.name} - Node ${node.id} STILL EXISTS`);
      if (result.tags?.name) {
        console.log(`   📛 name = ${result.tags.name}`);
      }
      oldExisting++;
    } else {
      console.log(`✅ ${node.name} - Node ${node.id} deleted`);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY:');
  console.log('='.repeat(60));
  console.log(`New nodes (should be 20): ${newExisting}/20`);
  console.log(`Old nodes checked (should be 0): ${oldExisting}/5`);

  if (newExisting === 20 && oldExisting === 0) {
    console.log('\n✅ Perfect! All verified nodes exist, old nodes deleted.');
  } else {
    console.log('\n⚠️  Issue detected:');
    if (newExisting < 20) {
      console.log(`   • ${20 - newExisting} new nodes missing`);
    }
    if (oldExisting > 0) {
      console.log(`   • ${oldExisting} old nodes still exist`);
    }
  }

  console.log('\n📝 Note: This is checking the OSM DEV server.');
  console.log('   Production OSM may have different data.');
}

verifyOSMNodes().catch(console.error);
