import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  deleteReview,
} from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, createReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

export default router;
