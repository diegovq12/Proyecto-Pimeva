const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'onepiece2409',
  port: 5432,
});

module.exports = pool;
