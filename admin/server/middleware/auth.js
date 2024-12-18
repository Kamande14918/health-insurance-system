import { db } from '../config/database.js';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
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
    console.error('Error verifying admin:', err);
    res.status(500).send('Error verifying admin');
  }
};

export default authMiddleware;