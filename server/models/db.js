import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ken@14918',
    database: 'health_insurance_system',
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

export default db;
