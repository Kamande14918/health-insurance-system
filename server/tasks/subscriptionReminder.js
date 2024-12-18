import cron from 'node-cron';
import { db } from '../config/database.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendReminderEmails = async () => {
  const query = `
    SELECT users.email, subscriptions.subscription_type, subscriptions.end_date
    FROM users
    JOIN subscriptions ON users.id = subscriptions.user_id
    WHERE subscriptions.end_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
  `;

  const [results] = await db.query(query);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  results.forEach((user) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Subscription Renewal Reminder',
      text: `Dear ${user.email},\n\nYour ${user.subscription_type} subscription is about to expire on ${user.end_date}. Please renew your subscription to continue enjoying our services.\n\nThank you!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  });
};

// Schedule the task to run every day at 8 AM
cron.schedule('0 8 * * *', () => {
  console.log('Running subscription reminder task');
  sendReminderEmails();
});

// Export the function for testing
export { sendReminderEmails };