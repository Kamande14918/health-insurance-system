import express from 'express';
import { getUsers, getClaims, updateClaimStatus, generateReport } from '../controllers/adminControllers.js';
import { registerAdmin, loginAdmin } from '../controllers/authController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin authentication routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Admin functionalities routes
router.use(adminMiddleware); // Protect routes below this line

// Users management
router.get('/users', getUsers);

// Claims management
router.get('/claims', getClaims);
router.put('/claims/:id', updateClaimStatus);

// Reports generation
router.get('/reports', generateReport);

export default router;
