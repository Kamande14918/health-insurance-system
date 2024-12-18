import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error('No token provided');
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [results] = await db.query('SELECT * FROM admins WHERE id = ?', [decoded.id]);

    if (results.length === 0) {
      console.error('Invalid token: Admin not found');
      return res.status(401).send('Access denied. Invalid token.');
    }

    req.admin = results[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('Token expired:', err);
      return res.status(401).send('Token expired. Please log in again.');
    } else {
      console.error('Error verifying admin:', err);
      return res.status(500).send('Error verifying admin');
    }
  }
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default adminMiddleware;
export { authMiddleware };
