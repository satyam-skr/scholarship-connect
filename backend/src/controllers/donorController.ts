import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { createLedgerTransaction } from '../services/ledgerService';
import { toDonationDTO, toScholarshipDTO, toStudentDTO } from '../services/mappers';

const donationSchema = z.object({
  amount: z.number().positive(),
  fieldOfStudy: z.string().min(1),
  scholarshipId: z.string().optional(),
  studentId: z.string().optional(),
});

const assertDonorAccess = (req: Request, donorId: string): boolean => {
  return req.auth?.role === 'admin' || req.auth?.userId === donorId;
};

export const donorController = {
  getDonations: async (req: Request, res: Response) => {
    const { donorId } = req.params;
    if (!assertDonorAccess(req, donorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const rows = await prisma.donation.findMany({
      where: { donorId },
      include: { donor: true, student: true },
      orderBy: { date: 'asc' },
    });

    return res.json(rows.map(toDonationDTO));
  },

  getTotalDonated: async (req: Request, res: Response) => {
    const { donorId } = req.params;
    if (!assertDonorAccess(req, donorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const agg = await prisma.donation.aggregate({
      where: { donorId },
      _sum: { amount: true },
    });

    return res.json(agg._sum.amount ?? 0);
  },

  getScholarships: async (req: Request, res: Response) => {
    const { donorId } = req.params;
    if (!assertDonorAccess(req, donorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const rows = await prisma.scholarship.findMany({
      where: { donorId },
      include: { donor: true, applications: true },
      orderBy: { createdAt: 'asc' },
    });

    return res.json(rows.map(toScholarshipDTO));
  },

  getStudentsFunded: async (req: Request, res: Response) => {
    const { donorId } = req.params;
    if (!assertDonorAccess(req, donorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const donations = await prisma.donation.findMany({
      where: { donorId, studentId: { not: null } },
      select: { studentId: true },
    });

      const studentIdSet = new Set<string>();
      for (const donation of donations as Array<{ studentId: string | null }>) {
        if (donation.studentId) {
          studentIdSet.add(donation.studentId);
        }
      }
      const studentIds = Array.from(studentIdSet);
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds }, role: 'student' },
      include: {
        studentProfile: { include: { documents: true, academicProgress: true } },
        applications: true,
      },
      orderBy: { name: 'asc' },
    });

    return res.json(students.map(toStudentDTO));
  },

  getDonationsByField: async (req: Request, res: Response) => {
    const { donorId } = req.params;
    if (!assertDonorAccess(req, donorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const rows = await prisma.donation.groupBy({
      by: ['fieldOfStudy'],
      where: { donorId },
      _sum: { amount: true },
    });

    return res.json(
      rows.map((r: { fieldOfStudy: string; _sum: { amount: number | null } }) => ({
        name: r.fieldOfStudy,
        value: r._sum.amount ?? 0,
      }))
    );
  },

  getDonationsOverTime: async (req: Request, res: Response) => {
    const { donorId } = req.params;
    if (!assertDonorAccess(req, donorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const rows = await prisma.donation.findMany({
      where: { donorId },
      select: { amount: true, date: true },
      orderBy: { date: 'asc' },
    });

    const map = new Map<string, number>();
    for (const row of rows) {
      const month = row.date.toLocaleString('default', { month: 'short', year: '2-digit' });
      map.set(month, (map.get(month) ?? 0) + row.amount);
    }

    return res.json(Array.from(map.entries()).map(([month, amount]) => ({ month, amount })));
  },

  createDonation: async (req: Request, res: Response) => {
    const { donorId } = req.params;
    if (!assertDonorAccess(req, donorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const parsed = donationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const donor = await prisma.user.findUnique({ where: { id: donorId } });
    if (!donor || donor.role !== 'donor') {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const donation = await prisma.donation.create({
      data: {
        donorId,
        amount: parsed.data.amount,
        fieldOfStudy: parsed.data.fieldOfStudy,
        scholarshipId: parsed.data.scholarshipId,
        studentId: parsed.data.studentId,
      },
      include: { donor: true, student: true },
    });

    if (parsed.data.studentId) {
      await prisma.studentProfile.updateMany({
        where: { userId: parsed.data.studentId },
        data: { receivedFunds: { increment: parsed.data.amount } },
      });
    }

    await createLedgerTransaction({
      donorId,
      studentId: parsed.data.studentId,
      amount: parsed.data.amount,
      type: 'donation',
      donationId: donation.id,
    });

    return res.status(201).json(toDonationDTO(donation));
  },
};
