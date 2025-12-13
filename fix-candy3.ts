import { executeQuery } from './lib/db';

executeQuery(
  `UPDATE merchant_submissions SET osm_node_id = 13359666904 WHERE id = '630ca3d5-b199-4734-937e-801e02f973b5'`
).then((r) => {
  console.log('✅ Updated Candy\'s Collection Hub');
  console.log(r);
  process.exit(0);
});
