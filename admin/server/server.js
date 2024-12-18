// admin/server/server.js
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import cors
import adminRoutes from './routes/adminRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js'; // Import reports routes
import authRoutes from './routes/authRoutes.js'; // Assuming you have auth routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportsRoutes); // Use reports routes
app.use('/api/auth', authRoutes); // Assuming you have auth routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});