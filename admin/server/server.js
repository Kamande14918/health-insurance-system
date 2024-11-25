// admin/server/server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the admin routes
app.use('/api/admin', adminRoutes);

const PORT = process.env.ADMIN_PORT || 6000;
app.listen(PORT, () => {
  console.log(`Admin server running on port ${PORT}`);
});