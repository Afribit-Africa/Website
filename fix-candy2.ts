import { executeQuery } from './lib/db';

async function fix() {
  console.log('Updating Candy\'s Collection Hub...');

  const result = await executeQuery(
    `UPDATE merchant_submissions SET osm_node_id = 13359666904 WHERE business_name = "Candy's Collection Hub"`
  );

  console.log('Result:', result);

  const check = await executeQuery(
    `SELECT business_name, osm_node_id FROM merchant_submissions WHERE business_name = "Candy's Collection Hub"`
  );

  console.log('After update:', check);
  process.exit(0);
}

fix();
