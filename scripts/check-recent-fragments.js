
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@127.0.0.1:5432/fluxiai?schema=public"
  });
  await client.connect();
  const res = await client.query('SELECT id, "sandboxUrl", "createdAt" FROM "Fragment" ORDER BY "createdAt" DESC LIMIT 10');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

main().catch(e => console.error(e));
