import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { donorRoutes } from './donorRoutes';
import { studentRoutes } from './studentRoutes';
import { adminRoutes } from './adminRoutes';
import { institutionRoutes } from './institutionRoutes';
import { verifierRoutes } from './verifierRoutes';
import { transactionRoutes } from './transactionRoutes';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/donors', donorRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/institution', institutionRoutes);
apiRouter.use('/verifier', verifierRoutes);
apiRouter.use('/transactions', transactionRoutes);
