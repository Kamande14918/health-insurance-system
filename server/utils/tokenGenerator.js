// server/utils/tokenGenerator.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  console.log('Generated Token:', token); // Log the generated token for debugging
  return token;
};

export default generateToken;