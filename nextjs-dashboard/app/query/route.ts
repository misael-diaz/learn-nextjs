const { Pool } = require("pg");

async function listInvoices(connectionPool: Pool) {
  const data = await connectionPool.query(`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `);

  return data;
}

export async function GET() {

  const connectionPool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
  });

  try {
    return Response.json(await listInvoices(connectionPool));
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
