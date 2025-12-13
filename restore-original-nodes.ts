import { executeQuery } from './lib/db';

// Original OSM node IDs before duplication
const originalNodes: { [key: string]: string } = {
  '3 West Butchery': '13359667002',
  '3 West Hotel': '13359666902',
  'Shibe': '13359670102',
  'Sokoni Mboga': '13359669303',
  'AC Gas Suppliers': '13359669701',
  'Candy\'s Collection Hub': '13359666904',
  'Caronaliak': '13359670001',
  'Abebo Vegez': '13359667003',
  'Yummy Tummy': '13359669702',
  'Goreti Greens Shop': '13359669302',
  'Black and White Fries Corner': '13359667004',
  'Galaxxy Toilet': '13359666905',
  '3 West Collection': '13359669301',
  'Venlavery Retail Shop': '13359670301',
  'Mama Clear': '13359666906',
  'Bridgeway Shop': '13359666903',
  'Soweto Car Wash': '13359666202',
  'Mama Nonny Shop': '13359670201',
  'Krezzy Kicks': '13359670101',
  'Mama Eddy Salon': '13359667005'
};

async function restoreOriginalNodes() {
  console.log('🔄 Restoring original OSM node IDs...\n');

  let updated = 0;
  let notFound = 0;

  for (const [businessName, originalNodeId] of Object.entries(originalNodes)) {
    try {
      const result = await executeQuery(
        `UPDATE merchant_submissions SET osm_node_id = ? WHERE business_name = ? AND status = 'published'`,
        [originalNodeId, businessName]
      );

      if ((result as any).affectedRows > 0) {
        console.log(`✅ ${businessName} → ${originalNodeId}`);
        updated++;
      } else {
        console.log(`⚠️  ${businessName} - not found in database`);
        notFound++;
      }
    } catch (error) {
      console.log(`❌ ${businessName} - Error:`, error);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Not found: ${notFound}`);
  console.log(`\n✅ Original node IDs restored!`);

  process.exit(0);
}

restoreOriginalNodes();
