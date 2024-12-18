import express from 'express';
import { stkPush, handleCallback, getPaymentHistory } from '../controllers/mpesaController.js';

const router = express.Router();

router.post('/stkpush', stkPush);
router.post('/callback', handleCallback);
router.get('/history/:user_id', getPaymentHistory);

export default router;
