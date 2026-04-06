import { Router } from 'express';
import { studentController } from '../controllers/studentController';
import { requireAuth } from '../middlewares/auth';
import { allowRoles } from '../middlewares/rbac';
import { upload } from '../middlewares/upload';
import { asyncHandler } from '../middlewares/asyncHandler';

export const studentRoutes = Router();

studentRoutes.get('/scholarships/available', requireAuth, asyncHandler(studentController.getAvailableScholarships));
studentRoutes.get('/:id', requireAuth, allowRoles('student', 'admin'), asyncHandler(studentController.getStudent));
studentRoutes.get('/:studentId/applications', requireAuth, allowRoles('student', 'admin'), asyncHandler(studentController.getApplications));
studentRoutes.get('/:studentId/received-funds', requireAuth, allowRoles('student', 'admin'), asyncHandler(studentController.getReceivedFunds));
studentRoutes.post('/:studentId/applications', requireAuth, allowRoles('student', 'admin'), asyncHandler(studentController.createApplication));
studentRoutes.post(
  '/:studentId/documents',
  requireAuth,
  allowRoles('student', 'admin'),
  upload.single('file'),
  asyncHandler(studentController.uploadDocument)
);
