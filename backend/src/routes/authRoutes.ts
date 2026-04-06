import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/asyncHandler';

export const authRoutes = Router();

authRoutes.post('/login', asyncHandler(authController.login));
authRoutes.post('/signup', asyncHandler(authController.signup));
authRoutes.get('/me', requireAuth, asyncHandler(authController.me));
