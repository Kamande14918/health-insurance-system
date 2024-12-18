import { db } from '../config/database.js';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import path from 'path';
import jwt from 'jsonwebtoken';

// Function to get users
const getUsers = async (req, res) => {
  try {
    const [results] = await db.query('SELECT username, email, national_id, created_at FROM users');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
};

// Function to get users and their claims
const getUsersWithClaims = async (req, res) => {
  try {
    const query = `
      SELECT u.username, u.email, u.national_id, u.created_at, 
             c.id AS claim_id, c.claim_type, c.claim_amount, c.description, c.status AS claim_status
      FROM users u
      LEFT JOIN claims c ON u.id = c.user_id
    `;
    const [results] = await db.query(query);
    const users = results.reduce((acc, row) => {
      const user = acc.find(u => u.national_id === row.national_id);
      if (user) {
        user.claims.push({
          claim_id: row.claim_id,
          claim_type: row.claim_type,
          claim_amount: row.claim_amount,
          description: row.description,
          claim_status: row.claim_status,
        });
      } else {
        acc.push({
          username: row.username,
          email: row.email,
          national_id: row.national_id,
          created_at: row.created_at,
          claims: row.claim_id ? [{
            claim_id: row.claim_id,
            claim_type: row.claim_type,
            claim_amount: row.claim_amount,
            description: row.description,
            claim_status: row.claim_status,
          }] : [],
        });
      }
      return acc;
    }, []);
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users with claims:', err);
    res.status(500).send('Error fetching users with claims');
  }
};

// Function to get users with claims and payments
const getUsersWithClaimsAndPayments = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.username, u.email, u.national_id, u.created_at, 
        c.id AS claim_id, c.claim_type, c.claim_amount, c.description, c.status AS claim_status,
        p.id AS payment_id, p.amount AS payment_amount, p.phone AS payment_phone, p.status AS payment_status, p.created_at AS payment_created_at
      FROM users u
      LEFT JOIN claims c ON u.id = c.user_id
      LEFT JOIN payments p ON u.id = p.user_id
    `;
    const [results] = await db.query(query);
    const users = results.reduce((acc, row) => {
      const user = acc.find(u => u.national_id === row.national_id);
      if (user) {
        if (row.claim_id) {
          user.claims.push({
            claim_id: row.claim_id,
            claim_type: row.claim_type,
            claim_amount: row.claim_amount,
            description: row.description,
            claim_status: row.claim_status,
          });
        }
        if (row.payment_id) {
          user.payments.push({
            payment_id: row.payment_id,
            payment_amount: row.payment_amount,
            payment_phone: row.payment_phone,
            payment_status: row.payment_status,
            payment_created_at: row.payment_created_at,
          });
        }
      } else {
        acc.push({
          username: row.username,
          email: row.email,
          national_id: row.national_id,
          created_at: row.created_at,
          claims: row.claim_id ? [{
            claim_id: row.claim_id,
            claim_type: row.claim_type,
            claim_amount: row.claim_amount,
            description: row.description,
            claim_status: row.claim_status,
          }] : [],
          payments: row.payment_id ? [{
            payment_id: row.payment_id,
            payment_amount: row.payment_amount,
            payment_phone: row.payment_phone,
            payment_status: row.payment_status,
            payment_created_at: row.payment_created_at,
          }] : [],
        });
      }
      return acc;
    }, []);
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users with claims and payments:', err);
    res.status(500).send('Error fetching users with claims and payments');
  }
};

// Update claim status
const updateClaimStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = 'UPDATE claims SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err, results) => {
    if (err) {
      console.error('Error updating claim status:', err);
      res.status(500).send('Error updating claim status');
    } else {
      res.status(200).send('Claim status updated successfully');
    }
  });
};

// Generate detailed report
const generateReport = (req, res) => {
  const { startDate, endDate, nationalId, format } = req.query;

  console.log('Generating report with parameters:', { startDate, endDate, nationalId, format });

  // Fetch data from the database
  let query = `
    SELECT 
      users.id AS user_id, users.username, users.email, users.national_id, profiles.phone_number, profiles.address, profiles.date_of_birth,
      claims.id AS claim_id, claims.claim_type, claims.claim_amount, claims.description, claims.created_at AS claim_created_at, claims.status AS claim_status,
      payments.id AS payment_id, payments.amount AS payment_amount, payments.status AS payment_status, payments.created_at AS payment_created_at,
      subscriptions.subscription_type, subscriptions.start_date AS subscription_start_date, subscriptions.end_date AS subscription_end_date
    FROM users
    LEFT JOIN profiles ON users.id = profiles.user_id
    LEFT JOIN claims ON users.id = claims.user_id
    LEFT JOIN payments ON users.id = payments.user_id
    LEFT JOIN subscriptions ON users.id = subscriptions.user_id
    WHERE 1=1
  `;
  const queryParams = [];

  if (startDate) {
    query += ' AND claims.created_at >= ?';
    queryParams.push(startDate);
  }

  if (endDate) {
    query += ' AND claims.created_at <= ?';
    queryParams.push(endDate);
  }

  if (nationalId) {
    query += ' AND users.national_id = ?';
    queryParams.push(nationalId);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    console.log('Query results:', results);

    if (results.length === 0) {
      console.log('No data found for the given criteria');
      return res.status(404).send('No data found for the given criteria');
    }

    if (format === 'json') {
      res.json(results);
    } else if (format === 'csv') {
      // Generate CSV report
      const csvWriter = createObjectCsvWriter({
        path: path.join(__dirname, '..', 'reports', 'user_report.csv'),
        header: [
          { id: 'user_id', title: 'User ID' },
          { id: 'username', title: 'Username' },
          { id: 'email', title: 'Email' },
          { id: 'national_id', title: 'National ID' },
          { id: 'phone_number', title: 'Phone Number' },
          { id: 'address', title: 'Address' },
          { id: 'date_of_birth', title: 'Date of Birth' },
          { id: 'claim_id', title: 'Claim ID' },
          { id: 'claim_type', title: 'Claim Type' },
          { id: 'claim_amount', title: 'Claim Amount' },
          { id: 'description', title: 'Description' },
          { id: 'claim_created_at', title: 'Claim Created At' },
          { id: 'claim_status', title: 'Claim Status' },
          { id: 'payment_id', title: 'Payment ID' },
          { id: 'payment_amount', title: 'Payment Amount' },
          { id: 'payment_status', title: 'Payment Status' },
          { id: 'payment_created_at', title: 'Payment Created At' },
          { id: 'subscription_type', title: 'Subscription Type' },
          { id: 'subscription_start_date', title: 'Subscription Start Date' },
          { id: 'subscription_end_date', title: 'Subscription End Date' },
        ],
      });

      csvWriter.writeRecords(results)
        .then(() => {
          res.download(path.join(__dirname, '..', 'reports', 'user_report.csv'));
        })
        .catch(err => {
          console.error('Error writing CSV report:', err);
          res.status(500).send('Error writing CSV report');
        });
    } else if (format === 'pdf') {
      // Generate PDF report
      const doc = new PDFDocument();
      doc.pipe(res);
      doc.text('User Report', { align: 'center' });
      results.forEach((row) => {
        doc.text(`User ID: ${row.user_id}, Username: ${row.username}, Email: ${row.email}, National ID: ${row.national_id}, Phone Number: ${row.phone_number}, Address: ${row.address}, Date of Birth: ${row.date_of_birth}`);
        doc.text(`Claim ID: ${row.claim_id}, Claim Type: ${row.claim_type}, Claim Amount: ${row.claim_amount}, Description: ${row.description}, Claim Created At: ${row.claim_created_at}, Claim Status: ${row.claim_status}`);
        doc.text(`Payment ID: ${row.payment_id}, Payment Amount: ${row.payment_amount}, Payment Status: ${row.payment_status}, Payment Created At: ${row.payment_created_at}`);
        doc.text(`Subscription Type: ${row.subscription_type}, Subscription Start Date: ${row.subscription_start_date}, Subscription End Date: ${row.subscription_end_date}`);
        doc.moveDown();
      });
      doc.end();
    } else {
      res.status(400).send('Invalid format');
    }
  });
};

export const adminLogin = async (req, res) => {
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

export { getUsers, getUsersWithClaims, getUsersWithClaimsAndPayments, updateClaimStatus, generateReport };
