// admin/server/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Register admin
const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO admins (email, password) VALUES (?, ?)';
    await db.query(query, [email, hashedPassword]);
    res.send('Admin registered successfully');
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Database query error');
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [adminResult] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (adminResult.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = adminResult[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '3h' }); // Set token expiration to 3 hours
    res.json({ token });
  } catch (err) {
    console.error('Error logging in admin:', err);
    res.status(500).json({ message: 'Error logging in admin' });
  }
};

// Update claim status
const updateClaimStatus = async (req, res) => {
  const { claimId, status } = req.body;

  if (!claimId || !status) {
    return res.status(400).send('Claim ID and status are required');
  }

  try {
    const query = 'UPDATE claims SET status = ? WHERE id = ?';
    await db.query(query, [status, claimId]);
    res.status(200).send('Claim status updated successfully');
  } catch (err) {
    console.error('Error updating claim status:', err);
    res.status(500).send('Error updating claim status');
  }
};

// Generate report
const generateReport = async (req, res) => {
  const { startDate, endDate, format } = req.query;

  try {
    const query = `
      SELECT * FROM claims
      WHERE created_at BETWEEN ? AND ?
    `;
    const [results] = await db.query(query, [startDate, endDate]);

    if (format === 'csv') {
      const { Parser } = await import('json2csv');
      const parser = new Parser();
      const csv = parser.parse(results);
      res.header('Content-Type', 'text/csv');
      res.attachment('report.csv');
      return res.send(csv);
    } else if (format === 'pdf') {
      const PDFDocument = (await import('pdfkit')).default;
      const doc = new PDFDocument();
      res.header('Content-Type', 'application/pdf');
      res.attachment('report.pdf');
      doc.pipe(res);
      results.forEach((claim) => {
        doc.text(JSON.stringify(claim));
        doc.moveDown();
      });
      doc.end();
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).send('Error generating report');
  }
};

export { registerAdmin, loginAdmin, updateClaimStatus, generateReport };