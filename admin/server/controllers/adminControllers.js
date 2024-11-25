import { db } from '../config/database.js';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import path from 'path';

// Get all users with their claims and payment history
export const getUsers = (req, res) => {
  const query = `
    SELECT 
      users.id AS user_id, users.username, users.email, users.national_id, users.phone_number, users.biometric_data,
      claims.id AS claim_id, claims.claim_type, claims.claim_amount, claims.description, claims.created_at AS claim_created_at, claims.status AS claim_status,
      payments.id AS payment_id, payments.amount AS payment_amount, payments.payment_method, payments.status AS payment_status, payments.created_at AS payment_created_at
    FROM users
    LEFT JOIN claims ON users.id = claims.user_id
    LEFT JOIN payments ON users.id = payments.user_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    // Transform the results into a nested structure
    const users = [];
    const userMap = {};

    results.forEach(row => {
      if (!userMap[row.user_id]) {
        userMap[row.user_id] = {
          id: row.user_id,
          username: row.username,
          email: row.email,
          national_id: row.national_id,
          phone_number: row.phone_number,
          biometric_data: row.biometric_data,
          claims: []
        };
        users.push(userMap[row.user_id]);
      }

      if (row.claim_id) {
        const claim = {
          id: row.claim_id,
          claim_type: row.claim_type,
          claim_amount: row.claim_amount,
          description: row.description,
          created_at: row.claim_created_at,
          status: row.claim_status,
          payments: []
        };

        if (row.payment_id) {
          claim.payments.push({
            id: row.payment_id,
            amount: row.payment_amount,
            payment_method: row.payment_method,
            status: row.payment_status,
            created_at: row.payment_created_at
          });
        }

        userMap[row.user_id].claims.push(claim);
      }
    });

    res.send(users);
  });
};

// Get all claims
export const getClaims = (req, res) => {
  const query = 'SELECT * FROM claims';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    res.send(results);
  });
};

// Update claim status
export const updateClaimStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = 'UPDATE claims SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    res.send('Claim status updated successfully');
  });
};

// Generate detailed report
export const generateReport = (req, res) => {
  const { startDate, endDate, nationalId, format } = req.query;

  console.log('Generating report with parameters:', { startDate, endDate, nationalId, format });

  // Fetch data from the database
  let query = `
    SELECT 
      users.id AS user_id, users.username, users.email, users.national_id, users.phone_number, users.biometric_data,
      claims.id AS claim_id, claims.claim_type, claims.claim_amount, claims.description, claims.created_at AS claim_created_at, claims.status AS claim_status,
      payments.id AS payment_id, payments.amount AS payment_amount, payments.payment_method, payments.status AS payment_status, payments.created_at AS payment_created_at
    FROM users
    LEFT JOIN claims ON users.id = claims.user_id
    LEFT JOIN payments ON users.id = payments.user_id
    WHERE claims.created_at BETWEEN ? AND ?
  `;
  const queryParams = [startDate, endDate];

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

    if (format === 'csv') {
      // Generate CSV report
      const csvWriter = createObjectCsvWriter({
        path: path.join(__dirname, '..', 'reports', 'user_report.csv'),
        header: [
          { id: 'user_id', title: 'User ID' },
          { id: 'username', title: 'Username' },
          { id: 'email', title: 'Email' },
          { id: 'national_id', title: 'National ID' },
          { id: 'phone_number', title: 'Phone Number' },
          { id: 'biometric_data', title: 'Biometric Data' },
          { id: 'claim_id', title: 'Claim ID' },
          { id: 'claim_type', title: 'Claim Type' },
          { id: 'claim_amount', title: 'Claim Amount' },
          { id: 'description', title: 'Description' },
          { id: 'claim_created_at', title: 'Claim Created At' },
          { id: 'claim_status', title: 'Claim Status' },
          { id: 'payment_id', title: 'Payment ID' },
          { id: 'payment_amount', title: 'Payment Amount' },
          { id: 'payment_method', title: 'Payment Method' },
          { id: 'payment_status', title: 'Payment Status' },
          { id: 'payment_created_at', title: 'Payment Created At' },
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
        doc.text(`User ID: ${row.user_id}, Username: ${row.username}, Email: ${row.email}, National ID: ${row.national_id}, Phone Number: ${row.phone_number}, Biometric Data: ${row.biometric_data}`);
        doc.text(`Claim ID: ${row.claim_id}, Claim Type: ${row.claim_type}, Claim Amount: ${row.claim_amount}, Description: ${row.description}, Claim Created At: ${row.claim_created_at}, Claim Status: ${row.claim_status}`);
        doc.text(`Payment ID: ${row.payment_id}, Payment Amount: ${row.payment_amount}, Payment Method: ${row.payment_method}, Payment Status: ${row.payment_status}, Payment Created At: ${row.payment_created_at}`);
        doc.moveDown();
      });
      doc.end();
    } else {
      res.status(400).send('Invalid format');
    }
  });
};
