import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import generateToken from '../utils/tokenGenerator.js';
import express from 'express';
import multer from 'multer';
import { getUserId } from '../controllers/authController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Register a new user
router.post('/register', upload.single('biometricData'), async (req, res) => {
  const { username, nationalId, email, password, phoneNumber } = req.body;
  const biometricData = req.file;

  if (!username || !nationalId || !biometricData || !email || !password || !phoneNumber) {
    return res.status(400).send('All fields are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, national_id, biometric_data, email, password, phone_number) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [username, nationalId, biometricData.buffer, email, hashedPassword, phoneNumber], (err, results) => {
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
});

// Login a user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  // Fetch user details from the database
  const query = 'SELECT id, password FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      console.error('User not found:', err);
      return res.status(401).send('Invalid email or password.');
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send('Invalid email or password.');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

// Fetch user profile
router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access token is required');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    const userId = decoded.id;

    const query = 'SELECT email, phone_number, profile_picture FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Database query error');
      }

      if (results.length === 0) {
        return res.status(404).send('User not found');
      }

      const user = results[0];
      const profilePictureBase64 = user.profile_picture ? Buffer.from(user.profile_picture).toString('base64') : null;
      res.json({ ...user, profile_picture: profilePictureBase64 });
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Error fetching user profile');
  }
});

// Update user profile picture
router.put('/profile', upload.single('profilePicture'), async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  const profilePicture = req.file;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access token is required');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    const userId = decoded.id;

    let updateFields = [];
    let queryParams = [];

    if (profilePicture) {
      updateFields.push('profile_picture = ?');
      queryParams.push(profilePicture.buffer);
    }

    if (email) {
      updateFields.push('email = ?');
      queryParams.push(email);
    }

    if (phoneNumber) {
      updateFields.push('phone_number = ?');
      queryParams.push(phoneNumber);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      queryParams.push(hashedPassword);
    }

    if (updateFields.length > 0) {
      queryParams.push(userId);
      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      db.query(query, queryParams, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Database query error');
        }
        res.status(200).send('Profile updated successfully');
      });
    } else {
      res.status(400).send('No fields to update');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Error updating profile');
  }
});

router.get('/user-id', getUserId);

export default router;
