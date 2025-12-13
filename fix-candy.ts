import { executeQuery } from './lib/db';

executeQuery(
  `UPDATE merchant_submissions SET osm_node_id = ? WHERE business_name = ?`,
  ['13359666904', "Candy's Collection Hub"]
).then(() => {
  console.log('✅ Fixed Candy\'s Collection Hub');
  process.exit(0);
});
