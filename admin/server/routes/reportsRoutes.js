import express from 'express';
import { db } from '../config/database.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get reports with filters
router.get('/', authMiddleware, (req, res) => {
  const { startDate, endDate, userId } = req.query;

  let query = 'SELECT * FROM claims WHERE 1=1';
  const queryParams = [];

  if (startDate) {
    query += ' AND created_at >= ?';
    queryParams.push(startDate);
  }

  if (endDate) {
    query += ' AND created_at <= ?';
    queryParams.push(endDate);
  }

  if (userId) {
    query += ' AND user_id = ?';
    queryParams.push(userId);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    res.json(results);
  });
});

export default router;