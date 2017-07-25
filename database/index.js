const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'btuser',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
