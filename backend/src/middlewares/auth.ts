import type { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.auth = verifyJwt(token);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
