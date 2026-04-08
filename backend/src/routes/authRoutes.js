import express from 'express';
import { login, register, requestOTP, verifyOTP, checkUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-user', checkUser);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

export default router;
