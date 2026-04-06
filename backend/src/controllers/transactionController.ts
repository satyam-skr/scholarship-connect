import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { transactionInclude } from '../services/ledgerService';
import { toTransactionDTO } from '../services/mappers';

const statusSchema = z.enum(['pending', 'confirmed', 'completed', 'failed']);

export const transactionController = {
  getAll: async (_req: Request, res: Response) => {
    const rows = await prisma.ledgerTransaction.findMany({
      include: transactionInclude,
      orderBy: { timestamp: 'desc' },
    });

    return res.json(rows.map(toTransactionDTO));
  },

  getByStatus: async (req: Request, res: Response) => {
    const parsed = statusSchema.safeParse(req.params.status);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const rows = await prisma.ledgerTransaction.findMany({
      where: { status: parsed.data },
      include: transactionInclude,
      orderBy: { timestamp: 'desc' },
    });

    return res.json(rows.map(toTransactionDTO));
  },
};
