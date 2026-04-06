import { Router } from 'express';
import { verifierController } from '../controllers/verifierController';
import { requireAuth } from '../middlewares/auth';
import { allowRoles } from '../middlewares/rbac';
import { asyncHandler } from '../middlewares/asyncHandler';

export const verifierRoutes = Router();

verifierRoutes.use(requireAuth, allowRoles('verifier', 'admin'));

verifierRoutes.get('/milestones/pending', asyncHandler(verifierController.getPendingMilestones));
verifierRoutes.get('/milestones', asyncHandler(verifierController.getAllMilestones));
verifierRoutes.get('/documents/pending', asyncHandler(verifierController.getPendingDocuments));
verifierRoutes.post('/milestones/:id/approve', asyncHandler(verifierController.approveMilestone));
verifierRoutes.post('/milestones/:id/release-funds', asyncHandler(verifierController.releaseFunds));
verifierRoutes.post('/documents/:id/verify', asyncHandler(verifierController.verifyDocument));
