import express from 'express';
import { validatePincode } from '../controllers/locationController.js';

const router = express.Router();

router.get('/pincode/:pincode', validatePincode);

export default router;
