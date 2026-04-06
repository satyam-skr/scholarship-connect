import type { Request, Response } from 'express';
import { z } from 'zod';
import { login, signup } from '../services/authService';
import { prisma } from '../prisma/client';
import { toUserDTO } from '../services/mappers';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(['donor', 'student', 'admin', 'institution', 'verifier']),
});

export const authController = {
  login: async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const result = await login(parsed.data.email, parsed.data.password);
    if (!result.success) {
      return res.status(401).json(result);
    }
    return res.json(result);
  },

  signup: async (req: Request, res: Response) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const result = await signup(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
      parsed.data.role
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  },

  me: async (req: Request, res: Response) => {
    if (!req.auth) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.auth.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(toUserDTO(user));
  },
};
