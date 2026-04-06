import jwt from 'jsonwebtoken';
import type { UserRole } from '../types/contracts';

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is missing');
  }
  return secret;
};

export const signJwt = (payload: { userId: string; role: UserRole }): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign(payload, getSecret(), { expiresIn });
};

export const verifyJwt = (token: string): { userId: string; role: UserRole } => {
  return jwt.verify(token, getSecret()) as { userId: string; role: UserRole };
};
