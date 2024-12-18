import { db } from '../config/database.js';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

// Function to generate reports
const generateReport = async (req, res) => {
  const { startDate, endDate, format, userId } = req.query;

  try {
    let query = `
      SELECT u.username, u.email, c.id AS claim_id, c.claim_type, c.claim_amount, c.description, c.status, c.created_at
      FROM users u
      LEFT JOIN claims c ON u.id = c.user_id
      WHERE 1=1
    `;
    const queryParams = [];

    if (startDate) {
      query += ' AND c.created_at >= ?';
      queryParams.push(startDate);
    }

    if (endDate) {
      query += ' AND c.created_at <= ?';
      queryParams.push(endDate);
    }

    if (userId) {
      query += ' AND u.id = ?';
      queryParams.push(userId);
    }

    const [results] = await db.query(query, queryParams);

    if (results.length === 0) {
      return res.status(404).send('No data found for the given criteria');
    }

    if (format === 'csv') {
      const fields = ['claim_id', 'claim_type', 'claim_amount', 'description', 'status', 'created_at'];
      const parser = new Parser({ fields });
      const csv = parser.parse(results);
      res.header('Content-Type', 'text/csv');
      res.attachment('report.csv');
      return res.send(csv);
    } else if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 30 });
      res.header('Content-Type', 'application/pdf');
      res.attachment('report.pdf');
      doc.pipe(res);

      // Add Report Title
      doc.fontSize(18).text('Claims Report', { align: 'center', underline: true });
      doc.moveDown();

      // Add Report Generated Details
      const { username, email } = results[0];
      doc.fontSize(12).text(`Report Generated For: ${username}`, { align: 'left' });
      doc.text(`Email: ${email}`);
      doc.moveDown(2);

      // Table Headers
      const headers = [
        { label: 'Claim ID', width: 70 },
        { label: 'Claim Type', width: 100 },
        { label: 'Description', width: 150 },
        { label: 'Claim Amount', width: 100 },
        { label: 'Status', width: 100 },
        { label: 'Created At', width: 150 },
      ];

      // Print Header Row with Borders
      doc.font('Helvetica-Bold').fontSize(10);
      headers.forEach((header, i) => {
        doc.text(header.label, {
          width: header.width,
          align: 'left',
          continued: i !== headers.length - 1,
        });
      });
      doc.moveDown();

      // Draw header borders
      let y = doc.y;
      doc.moveTo(30, y).lineTo(570, y).stroke();

      // Print Table Rows with Borders
      doc.font('Helvetica').fontSize(10);
      results.forEach((claim) => {
        headers.forEach((header, i) => {
          let text = claim[header.label.toLowerCase().replace(' ', '_')] || 'N/A';
          if (header.label === 'Created At') {
            text = new Date(claim.created_at).toLocaleString();
          }
          doc.text(text, {
            width: header.width,
            align: 'left',
            continued: i !== headers.length - 1,
          });
        });
        doc.moveDown();

        // Draw row borders
        y = doc.y;
        doc.moveTo(30, y).lineTo(570, y).stroke();
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

export { generateReport };