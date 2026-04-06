import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { requireAuth } from '../middlewares/auth';
import { allowRoles } from '../middlewares/rbac';
import { asyncHandler } from '../middlewares/asyncHandler';

export const adminRoutes = Router();

adminRoutes.use(requireAuth, allowRoles('admin'));

adminRoutes.get('/students', asyncHandler(adminController.getAllStudents));
adminRoutes.get('/applications', asyncHandler(adminController.getAllApplications));
adminRoutes.get('/funds-distributed', asyncHandler(adminController.getTotalFundsDistributed));
adminRoutes.get('/students-supported', asyncHandler(adminController.getStudentsSupported));
adminRoutes.get('/fund-allocations', asyncHandler(adminController.getFundAllocations));
adminRoutes.patch('/applications/:id/review', asyncHandler(adminController.reviewApplication));
