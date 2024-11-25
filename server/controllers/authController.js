import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../database/schema'; // Adjust the path as necessary

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Database query error');
      }
      res.status(201).send('User registered successfully');
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
};

export const login = (req, res) => {
  const { username, password } = req.body;

  // Query the database for the user
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    if (results.length === 0) {
      return res.status(400).send('Invalid username or password');
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).send('Invalid username or password');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret_key', { expiresIn: '1h' });
    res.send({ token });
  });
};