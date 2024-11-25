import mysql from 'mysql';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ken@14918',
  database: 'social_health_insurance_system'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

export { connection as db };