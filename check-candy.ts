import { executeQuery } from './lib/db';

async function check() {
  const result = await executeQuery(
    `SELECT business_name, osm_node_id FROM merchant_submissions WHERE business_name LIKE '%Candy%'`
  );
  console.log(result);
  process.exit(0);
}

check();
