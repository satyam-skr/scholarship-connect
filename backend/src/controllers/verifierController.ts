import type { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { createLedgerTransaction } from '../services/ledgerService';
import { toMilestoneDTO } from '../services/mappers';

export const verifierController = {
  getPendingMilestones: async (_req: Request, res: Response) => {
    const rows = await prisma.milestone.findMany({
      where: { status: 'pending' },
      include: { student: true },
      orderBy: { submittedAt: 'asc' },
    });
    return res.json(rows.map(toMilestoneDTO));
  },

  getAllMilestones: async (_req: Request, res: Response) => {
    const rows = await prisma.milestone.findMany({
      include: { student: true },
      orderBy: { submittedAt: 'desc' },
    });
    return res.json(rows.map(toMilestoneDTO));
  },

  getPendingDocuments: async (_req: Request, res: Response) => {
    const rows = await prisma.document.findMany({
      where: { status: 'pending' },
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    return res.json(
      rows.map((doc: {
        id: string;
        name: string;
        type: 'transcript' | 'admission_letter' | 'id_proof' | 'recommendation';
        uploadedAt: Date;
        status: 'pending' | 'verified' | 'rejected';
        verifiedById: string | null;
        studentProfile: { user: { name: string } };
      }) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        uploadedAt: doc.uploadedAt.toISOString().split('T')[0],
        status: doc.status,
        verifiedBy: doc.verifiedById ?? undefined,
        studentName: doc.studentProfile.user.name,
      }))
    );
  },

  approveMilestone: async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.milestone.update({
      where: { id },
      data: { status: 'approved', reviewedAt: new Date() },
    });

    return res.json({ success: true, id });
  },

  releaseFunds: async (req: Request, res: Response) => {
    const { id } = req.params;
    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const tx = await createLedgerTransaction({
      donorId: undefined,
      studentId: milestone.studentId,
      amount: milestone.amount,
      type: 'fund_release',
      milestoneId: milestone.id,
      status: 'completed',
    });

    await prisma.studentProfile.updateMany({
      where: { userId: milestone.studentId },
      data: { receivedFunds: { increment: milestone.amount } },
    });

    return res.json({ success: true, milestoneId: id, txHash: tx.txHash });
  },

  verifyDocument: async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await prisma.document.update({
      where: { id },
      data: {
        status: 'verified',
        verifiedById: req.auth?.userId,
      },
    });

    return res.json({
      id: updated.id,
      name: updated.name,
      type: updated.type,
      uploadedAt: updated.uploadedAt.toISOString().split('T')[0],
      status: updated.status,
      verifiedBy: updated.verifiedById ?? undefined,
    });
  },
};
