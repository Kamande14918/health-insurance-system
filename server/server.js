import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import claimsRoutes from './routes/claimsRoutes.js';
import mpesaRoutes from './routes/mpesaRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import { db } from './config/database.js'; // Ensure database connection is imported
import './tasks/subscriptionReminder.js'; // Import the subscription reminder task

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from the React frontend
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log(`Connected to the database as id ${connection.threadId}`);
    connection.release(); // Release the connection back to the pool
  }
});

// Use the routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/claims', claimsRoutes); // Claims routes
app.use('/api/mpesa', mpesaRoutes); // M-Pesa routes
app.use('/api/reports', reportsRoutes); // Reports routes

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal server error');
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
