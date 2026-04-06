import { Router } from 'express';
import { donorController } from '../controllers/donorController';
import { requireAuth } from '../middlewares/auth';
import { allowRoles } from '../middlewares/rbac';
import { asyncHandler } from '../middlewares/asyncHandler';

export const donorRoutes = Router();

donorRoutes.use(requireAuth, allowRoles('donor', 'admin'));

donorRoutes.get('/:donorId/donations', asyncHandler(donorController.getDonations));
donorRoutes.get('/:donorId/total-donated', asyncHandler(donorController.getTotalDonated));
donorRoutes.get('/:donorId/scholarships', asyncHandler(donorController.getScholarships));
donorRoutes.get('/:donorId/students-funded', asyncHandler(donorController.getStudentsFunded));
donorRoutes.get('/:donorId/donations-by-field', asyncHandler(donorController.getDonationsByField));
donorRoutes.get('/:donorId/donations-over-time', asyncHandler(donorController.getDonationsOverTime));
donorRoutes.post('/:donorId/donations', asyncHandler(donorController.createDonation));
