import { db } from '../config/database.js';
import { initiateMobileMoneyPayment } from '../services/paymentService.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Function to handle subscription
const subscribeUser = async (req, res) => {
  const { userId, subscriptionType } = req.body;

  try {
    // Update user's subscription type in the database
    await db.query('UPDATE users SET payment_schedule = ? WHERE id = ?', [subscriptionType, userId]);

    // Initiate mobile money payment
    const paymentResponse = await initiateMobileMoneyPayment(userId, subscriptionType);

    // Send confirmation email
    const [userResult] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
    const userEmail = userResult[0].email;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Subscription Confirmation',
      text: `Dear ${userEmail},\n\nYour subscription for ${subscriptionType} has been successfully processed. Thank you for subscribing!\n\nBest regards,\nYour Company`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending confirmation email:', error);
      } else {
        console.log('Confirmation email sent:', info.response);
      }
    });

    res.status(200).json({ message: 'Subscription successful', paymentResponse });
  } catch (err) {
    console.error('Error subscribing user:', err);
    res.status(500).send('Error subscribing user');
  }
};

export { subscribeUser };