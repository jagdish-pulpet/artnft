
import { Pool, type QueryResultRow } from 'pg';

// Ensure that Next.js loads environment variables
// For API routes and server-side code, process.env should be automatically populated
// if your .env.local file is set up correctly.

let pool: Pool | undefined;

function getPool() {
  if (!pool) {
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const dbPort = process.env.DB_PORT;

    if (!dbHost || !dbUser || !dbPassword || !dbName || !dbPort) {
      console.error('Missing one or more database environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT)');
      throw new Error('Database configuration error. Check server logs.');
    }
    
    pool = new Pool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: parseInt(dbPort, 10),
      ssl: {
        // Supabase requires SSL, but typically doesn't require a specific CA cert 
        // if your Node environment trusts common CAs.
        // For local development against Supabase, `rejectUnauthorized: false` might be needed
        // if you encounter SSL issues, but be cautious with this in production.
        // Supabase generally works well without `rejectUnauthorized: false`.
        // rejectUnauthorized: process.env.NODE_ENV !== 'production' ? false : true, 
      },
      max: 20, // Example: maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Example: how long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // Example: how long to wait for a connection from the pool
    });

    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client in pg Pool', err);
      // process.exit(-1); // Optional: exit if a critical error occurs with the pool
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T[]> {
  const currentPool = getPool();
  const start = Date.now();
  try {
    const res = await currentPool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration: `${duration}ms`, rows: res.rowCount });
    return res.rows;
  } catch (error) {
    console.error('Error executing query:', { text, params, error });
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Optional: A function to test the connection, can be called at application startup
export async function testDbConnection() {
  try {
    const rows = await query('SELECT NOW()');
    console.log('Database connection test successful:', rows);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}
