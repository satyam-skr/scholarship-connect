import { Router } from 'express';
import { institutionController } from '../controllers/institutionController';
import { requireAuth } from '../middlewares/auth';
import { allowRoles } from '../middlewares/rbac';
import { asyncHandler } from '../middlewares/asyncHandler';

export const institutionRoutes = Router();

institutionRoutes.use(requireAuth, allowRoles('institution', 'admin'));

institutionRoutes.get('/enrolled-students', asyncHandler(institutionController.getEnrolledStudents));
institutionRoutes.post('/verify-enrollment', asyncHandler(institutionController.verifyEnrollment));
institutionRoutes.get('/total-received-funds', asyncHandler(institutionController.getTotalReceivedFunds));
