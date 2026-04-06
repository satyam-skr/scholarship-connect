import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { toApplicationDTO, toStudentDTO } from '../services/mappers';

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected', 'under_review']),
});

export const adminController = {
  getAllStudents: async (_req: Request, res: Response) => {
    const rows = await prisma.user.findMany({
      where: { role: 'student' },
      include: {
        studentProfile: { include: { documents: true, academicProgress: true } },
        applications: true,
      },
      orderBy: { name: 'asc' },
    });
    return res.json(rows.map(toStudentDTO));
  },

  getAllApplications: async (_req: Request, res: Response) => {
    const rows = await prisma.application.findMany({
      include: { student: true, scholarship: true, reviewedBy: true },
      orderBy: { submittedAt: 'desc' },
    });
    return res.json(rows.map(toApplicationDTO));
  },

  getTotalFundsDistributed: async (_req: Request, res: Response) => {
    const agg = await prisma.donation.aggregate({ _sum: { amount: true } });
    return res.json(agg._sum.amount ?? 0);
  },

  getStudentsSupported: async (_req: Request, res: Response) => {
    const rows = await prisma.donation.findMany({
      where: { studentId: { not: null } },
      select: { studentId: true },
      distinct: ['studentId'],
    });
    return res.json(rows.length);
  },

  getFundAllocations: async (_req: Request, res: Response) => {
    const grouped = await prisma.donation.groupBy({
      by: ['fieldOfStudy'],
      _sum: { amount: true },
    });

    const total = grouped.reduce(
      (sum: number, g: { _sum: { amount: number | null } }) => sum + (g._sum.amount ?? 0),
      0
    );
    return res.json(
      grouped.map((g: { fieldOfStudy: string; _sum: { amount: number | null } }) => {
        const amount = g._sum.amount ?? 0;
        return {
          category: g.fieldOfStudy,
          amount,
          percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        };
      })
    );
  },

  reviewApplication: async (req: Request, res: Response) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const { id } = req.params;
    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: parsed.data.status,
        reviewedAt: new Date(),
        reviewedById: req.auth?.userId,
      },
      include: { student: true, scholarship: true, reviewedBy: true },
    });

    return res.json(toApplicationDTO(updated));
  },
};
