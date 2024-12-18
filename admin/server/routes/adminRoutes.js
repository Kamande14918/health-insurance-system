import express from 'express';
import { getUsersWithClaimsAndPayments, updateClaimStatus, generateReport } from '../controllers/adminControllers.js';
import { registerAdmin, loginAdmin } from '../controllers/authController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';


const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protect routes below this line
router.use(adminMiddleware);

router.put('/claims/status/:id', updateClaimStatus);
router.get('/reports', generateReport);
router.get('/users-with-claims-and-payments', getUsersWithClaimsAndPayments);

export default router;
