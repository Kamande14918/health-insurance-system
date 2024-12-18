import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ken@14918',
  database: 'health_insurance_system',
  charset: 'utf8mb4', // Ensure the correct encoding is set
};

// Create a connection pool
const db = mysql.createPool(dbConfig);

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
  connection.release(); // Release the connection back to the pool
});

export { db };
