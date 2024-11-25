const db = require('../database/schema'); // Adjust the path as necessary

const submitClaim = (req, res) => {
  const { claimType, claimAmount, description, documents } = req.body;

  db.query('INSERT INTO claims (claimType, claimAmount, description, documents) VALUES (?, ?, ?, ?)', 
    [claimType, claimAmount, description, JSON.stringify(documents)], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    res.status(201).send('Claim submitted successfully');
  });
};

const getClaims = (req, res) => {
  db.query('SELECT * FROM claims WHERE userId = ?', [req.user.id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    res.json(results);
  });
};

module.exports = {
  submitClaim,
  getClaims,
};