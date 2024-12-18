import express from 'express';
import { generateReport } from '../controllers/reportsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/generate', authMiddleware, generateReport);

export default router;