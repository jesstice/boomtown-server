const { Pool } = require('pg');

export const pool = new Pool({
  host: 'localhost',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
