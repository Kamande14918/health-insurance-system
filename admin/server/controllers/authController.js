// admin/server/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Register admin
export const registerAdmin = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = 'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    res.send('Admin registered successfully');
  });
};

// Login admin
export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM admins WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      console.error('Admin not found:', err);
      return res.status(401).send('Invalid email or password');
    }

    const admin = results[0];
    const validPassword = bcrypt.compareSync(password, admin.password);

    if (!validPassword) {
      return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.send({ token });
  });
};