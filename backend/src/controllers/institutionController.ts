import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { toStudentDTO } from '../services/mappers';

const verifySchema = z.object({
  studentId: z.string().min(1),
});

export const institutionController = {
  getEnrolledStudents: async (_req: Request, res: Response) => {
    const rows = await prisma.user.findMany({
      where: {
        role: 'student',
        studentProfile: { enrollmentStatus: 'active' },
      },
      include: {
        studentProfile: { include: { documents: true, academicProgress: true } },
        applications: true,
      },
      orderBy: { name: 'asc' },
    });

    return res.json(rows.map(toStudentDTO));
  },

  verifyEnrollment: async (req: Request, res: Response) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    await prisma.enrollmentVerification.create({
      data: {
        studentId: parsed.data.studentId,
        verifiedById: req.auth!.userId,
      },
    });

    return res.json({ success: true, studentId: parsed.data.studentId });
  },

  getTotalReceivedFunds: async (_req: Request, res: Response) => {
    const agg = await prisma.studentProfile.aggregate({ _sum: { receivedFunds: true } });
    return res.json(agg._sum.receivedFunds ?? 0);
  },
};
