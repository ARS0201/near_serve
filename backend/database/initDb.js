const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDb() {
  console.log('🔄 Initializing MySQL Database for NearServe...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      multipleStatements: true,
    });

    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schemaSql);
    console.log('✅ Schema created successfully.');

    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await connection.query(seedSql);
    console.log('✅ Sample data seeded successfully.');

    await connection.end();
    console.log('🎉 NearServe MySQL database is fully initialized and ready!');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.log('💡 Note: Ensure your local MySQL server is running on port 3306.');
  }
}

if (require.main === module) {
  initDb();
}

module.exports = initDb;
