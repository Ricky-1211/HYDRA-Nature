import { Router } from 'express';
import {
  getCareers,
  getCareerBySlug,
  applyForJob,
  createCareer,
  updateCareer,
  deleteCareer,
  getApplications,
  updateApplicationStatus,
} from '../controllers/careerController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getCareers);
router.get('/:slug', getCareerBySlug);
router.post('/apply', applyForJob);

// Admin routes
router.post('/', protect, authorize('admin'), createCareer);
router.put('/:id', protect, authorize('admin'), updateCareer);
router.delete('/:id', protect, authorize('admin'), deleteCareer);
router.get('/admin/applications', protect, authorize('admin'), getApplications);
router.put('/admin/applications/:id', protect, authorize('admin'), updateApplicationStatus);

export default router;
