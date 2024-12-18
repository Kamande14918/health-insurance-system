import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';

export const registerUser = async (req, res) => {
  const { username, nationalId, email, password, phoneNumber, subscriptionType } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await db.query(
      'INSERT INTO users (username, national_id, email, password, phone_number) VALUES (?, ?, ?, ?, ?)',
      [username, nationalId, email, hashedPassword, phoneNumber]
    );

    const userId = userResult.insertId;
    const startDate = new Date();
    const endDate = subscriptionType === 'monthly' ? new Date(startDate.setMonth(startDate.getMonth() + 1)) : new Date(startDate.setFullYear(startDate.getFullYear() + 1));

    await db.query(
      'INSERT INTO subscriptions (user_id, subscription_type, start_date, end_date) VALUES (?, ?, ?, ?)',
      [userId, subscriptionType, new Date(), endDate]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [userResult] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userResult.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user_id: user.id }); // Include user_id in the response
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Error logging in user' });
  }
};

export const getUserId = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing. Please log in again." });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    res.status(200).json({ user_id: userId });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: "Invalid token. Please log in again." });
  }
};