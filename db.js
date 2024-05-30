import Pool from 'pg';



export const pool = new Pool.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'onepiece2409',
  port: 5432,
});
