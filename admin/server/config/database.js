// admin/server/config/database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Create a connection pool
const db = mysql.createPool(dbConfig);

// Test the database connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Connected to the database as id ' + connection.threadId);
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

export { db };