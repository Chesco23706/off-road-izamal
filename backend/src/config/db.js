import pg from "pg";

const { Pool } = pg;

let pool;

export const getPool = () => {
  if (!pool) {
    const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("SUPABASE_DB_URL is not defined");
    }

    pool = new Pool({
      connectionString,
      ssl:
        process.env.SUPABASE_DB_SSL === "false"
          ? false
          : {
              rejectUnauthorized: false,
            },
      max: Number(process.env.PG_POOL_MAX || 10),
    });
  }

  return pool;
};

export const query = (text, params) => getPool().query(text, params);

const connectDatabase = async () => {
  const client = await getPool().connect();

  try {
    await client.query("select 1");
    console.log("Supabase Postgres connected");
  } finally {
    client.release();
  }
};

export default connectDatabase;
