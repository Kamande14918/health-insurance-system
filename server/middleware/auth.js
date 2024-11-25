import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Check if JWT_SECRET is loaded

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.error('Access denied. No token provided.');
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    console.log('Token:', token); // Log the token for debugging
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log the decoded token for debugging
    const userId = decoded.id;

    // Fetch user details from the database
    const query = 'SELECT id, national_id FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err || results.length === 0) {
        console.error('Invalid token or user not found:', err);
        return res.status(401).send('Invalid token.');
      }

      req.user = {
        id: results[0].id,
        national_id: results[0].national_id
      };

      next();
    });
  } catch (ex) {
    console.error('Invalid token:', ex);
    res.status(400).send('Invalid token.');
  }
};

export default authMiddleware;
