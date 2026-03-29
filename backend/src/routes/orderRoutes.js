import express from 'express';
import { createOrder, getMyOrders, cancelOrder } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order routes require login now

router.route('/').post(createOrder);
router.route('/me').get(getMyOrders);
router.route('/:id/cancel').patch(cancelOrder);

export default router;
