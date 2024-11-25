import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import claimsRoutes from './routes/claimsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});