import express from 'express';
import multer from 'multer';
import { db } from '../config/database.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const upload = multer();

// Submit a new claim
router.post('/', authMiddleware, upload.array('documents'), (req, res) => {
  const { claimType, claimAmount, description } = req.body;
  const documents = req.files || [];
  const userId = req.user.id;
  const nationalId = req.user.national_id;

  console.log('User ID:', userId);
  console.log('National ID:', nationalId);

  if (!claimType || !claimAmount || !description) {
    console.error('Validation error: All fields are required');
    return res.status(400).send('All fields are required');
  }

  if (!nationalId) {
    console.error('Validation error: National ID is required');
    return res.status(400).send('National ID is required');
  }

  const documentPaths = documents.map(file => file.path);
  const query = 'INSERT INTO claims (user_id, national_id, claim_type, claim_amount, description, documents) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [userId, nationalId, claimType, claimAmount, description, JSON.stringify(documentPaths)], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    } else {
      console.log('Claim submitted successfully:', results);
      return res.status(201).send('Claim submitted successfully');
    }
  });
});

// Get all claims for a user
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT * FROM claims WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

export default router;
