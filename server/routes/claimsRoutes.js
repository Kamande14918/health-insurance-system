import express from 'express';
import { db } from '../config/database.js';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Submit a new claim
router.post('/submit-claim', authMiddleware, upload.single('documents'), async (req, res) => {
  const { claimType, claimAmount, description } = req.body;
  const documents = req.file;
  const userId = req.user.id;

  if (!claimType || !claimAmount || !description) {
    return res.status(400).send('All fields are required');
  }

  try {
    // Fetch national_id from users table
    const userQuery = 'SELECT national_id FROM users WHERE id = ?';
    db.query(userQuery, [userId], (err, userResults) => {
      if (err || userResults.length === 0) {
        console.error('User not found:', err);
        return res.status(404).send('User not found');
      }

      const nationalId = userResults[0].national_id;

      // Insert claim into claims table
      const claimQuery = 'INSERT INTO claims (user_id, claim_type, claim_amount, description, documents) VALUES (?, ?, ?, ?, ?)';
      db.query(claimQuery, [userId, claimType, claimAmount, description, documents ? documents.buffer : null], (err, claimResults) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Database query error');
        }
        res.status(201).send('Claim submitted successfully');
      });
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).send('Error submitting claim');
  }
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
