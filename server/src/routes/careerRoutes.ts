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
  deleteApplication,
  uploadResume,
} from '../controllers/careerController';
import { protect, authorize } from '../middleware/auth';
import { resumeUpload } from '../middleware/resumeUpload';

const router = Router();

// Public routes
router.get('/', getCareers);
router.post('/upload-resume', resumeUpload.single('resume'), uploadResume);
router.post('/apply', applyForJob);

// Admin application routes (MUST be defined before /:slug so "admin" isn't matched as a slug)
router.get('/admin/applications', protect, authorize('admin'), getApplications);
router.put('/admin/applications/:id', protect, authorize('admin'), updateApplicationStatus);
router.delete('/admin/applications/:id', protect, authorize('admin'), deleteApplication);

// Admin career CRUD routes
router.post('/', protect, authorize('admin'), createCareer);
router.put('/:id', protect, authorize('admin'), updateCareer);
router.delete('/:id', protect, authorize('admin'), deleteCareer);

// Single career detail by slug or id (placed last so it does not intercept specific subpaths)
router.get('/:slug', getCareerBySlug);

export default router;
