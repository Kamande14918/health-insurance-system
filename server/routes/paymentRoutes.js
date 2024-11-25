import express from 'express';
import { db } from '../config/database.js';
import authMiddleware from '../middleware/auth.js';
import { initiateSTKPush } from '../config/mpesa.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { phoneNumber, amount, accountReference, transactionDesc } = req.body;
  const userId = req.user.id;

  try {
    const response = await initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc);
    const query = 'INSERT INTO payments (user_id, phone_number, amount, account_reference, transaction_desc, status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [userId, phoneNumber, amount, accountReference, transactionDesc, 'Pending'], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Database query error');
      }
      res.status(201).send('Payment initiated successfully');
    });
  } catch (error) {
    console.error('Error initiating payment:', error.response ? error.response.data : error.message);
    res.status(500).send('Error initiating payment');
  }
});

router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT * FROM payments WHERE user_id = ?';
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
