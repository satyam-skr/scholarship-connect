import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { toApplicationDTO, toScholarshipDTO, toStudentDTO } from '../services/mappers';

const createApplicationSchema = z.object({
  scholarshipId: z.string().min(1),
});

const assertStudentAccess = (req: Request, studentId: string): boolean => {
  return req.auth?.role === 'admin' || req.auth?.userId === studentId;
};

export const studentController = {
  getStudent: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!assertStudentAccess(req, id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: { include: { documents: true, academicProgress: true } },
        applications: true,
      },
    });

    if (!student || student.role !== 'student') {
      return res.json(null);
    }

    return res.json(toStudentDTO(student));
  },

  getApplications: async (req: Request, res: Response) => {
    const { studentId } = req.params;
    if (!assertStudentAccess(req, studentId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const rows = await prisma.application.findMany({
      where: { studentId },
      include: { student: true, scholarship: true, reviewedBy: true },
      orderBy: { submittedAt: 'asc' },
    });

    return res.json(rows.map(toApplicationDTO));
  },

  getAvailableScholarships: async (_req: Request, res: Response) => {
    const rows = await prisma.scholarship.findMany({
      where: { status: 'open' },
      include: { donor: true, applications: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(rows.map(toScholarshipDTO));
  },

  getReceivedFunds: async (req: Request, res: Response) => {
    const { studentId } = req.params;
    if (!assertStudentAccess(req, studentId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const profile = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
    return res.json(profile?.receivedFunds ?? 0);
  },

  createApplication: async (req: Request, res: Response) => {
    const { studentId } = req.params;
    if (!assertStudentAccess(req, studentId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const parsed = createApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const application = await prisma.application.create({
      data: {
        studentId,
        scholarshipId: parsed.data.scholarshipId,
        status: 'pending',
      },
      include: { student: true, scholarship: true, reviewedBy: true },
    });

    return res.status(201).json(toApplicationDTO(application));
  },

  uploadDocument: async (req: Request, res: Response) => {
    const { studentId } = req.params;
    if (!assertStudentAccess(req, studentId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const file = req.file;
    const type = req.body.type as 'transcript' | 'admission_letter' | 'id_proof' | 'recommendation' | undefined;
    if (!file || !type) {
      return res.status(400).json({ message: 'File and type are required' });
    }

    const profile = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const doc = await prisma.document.create({
      data: {
        studentProfileId: profile.id,
        name: file.originalname,
        type,
        filePath: file.path,
      },
    });

    return res.status(201).json({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      uploadedAt: doc.uploadedAt.toISOString().split('T')[0],
      status: doc.status,
      verifiedBy: undefined,
    });
  },
};
