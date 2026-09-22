const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'nearserve',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Test pool connection asynchronously
  pool.getConnection()
    .then((conn) => {
      console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'nearserve');
      conn.release();
    })
    .catch((err) => {
      console.warn('⚠️  MySQL connection note:', err.message);
      console.log('ℹ️  NearServe backend will use resilient fallback handlers if MySQL is offline.');
    });
} catch (error) {
  console.warn('⚠️  MySQL pool initialization note:', error.message);
}

module.exports = pool;
