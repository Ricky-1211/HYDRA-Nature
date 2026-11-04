import { Router } from 'express';
import {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Customer authenticated routes
router.post('/razorpay', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyPaymentAndCreateOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
