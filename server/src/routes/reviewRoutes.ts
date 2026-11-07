import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  deleteReview,
  getAllReviewsAdmin,
  toggleApproveReview,
} from '../controllers/reviewController';
import { protect, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

// Admin review management routes (MUST come before /:productId to avoid route param collision)
router.get('/admin', protect, authorize('admin'), getAllReviewsAdmin);
router.patch('/:id/approve', protect, authorize('admin'), toggleApproveReview);

// Delete review (Customer can delete their own review; Admin can delete any review)
router.delete('/:id', protect, deleteReview);

// Customer / Public review routes
router.post('/:productId', protect, createReview);
router.get('/:productId', optionalAuth, getProductReviews);

export default router;
