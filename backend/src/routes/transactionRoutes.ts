import { Router } from 'express';
import { transactionController } from '../controllers/transactionController';
import { requireAuth } from '../middlewares/auth';
import { allowRoles } from '../middlewares/rbac';
import { asyncHandler } from '../middlewares/asyncHandler';

export const transactionRoutes = Router();

transactionRoutes.use(requireAuth, allowRoles('admin', 'verifier', 'donor', 'institution', 'student'));

transactionRoutes.get('/', asyncHandler(transactionController.getAll));
transactionRoutes.get('/status/:status', asyncHandler(transactionController.getByStatus));
