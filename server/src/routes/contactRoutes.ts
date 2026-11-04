import { Router } from 'express';
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
} from '../controllers/contactController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/', submitContact);

// Admin routes
router.get('/', protect, authorize('admin'), getAllContacts);
router.put('/:id/status', protect, authorize('admin'), updateContactStatus);

export default router;
