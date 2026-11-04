import { Router } from 'express';
import {
  getDashboardAnalytics,
  getAllCustomers,
} from '../controllers/adminAnalyticsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/analytics', getDashboardAnalytics);
router.get('/customers', getAllCustomers);

export default router;
