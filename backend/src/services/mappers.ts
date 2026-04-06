import {
  ApplicationDTO,
  DonationDTO,
  MilestoneDTO,
  ScholarshipDTO,
  StudentDTO,
  TransactionDTO,
  UserDTO,
} from '../types/contracts';

type DbUser = {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'student' | 'admin' | 'institution' | 'verifier';
  avatar?: string | null;
};

export const toUserDTO = (user: DbUser): UserDTO => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar ?? undefined,
});

export const toScholarshipDTO = (
  scholarship: {
    id: string;
    title: string;
    amount: number;
    donorId: string;
    donor: DbUser;
    fieldOfStudy: string;
    status: 'open' | 'closed' | 'awarded';
    applications?: Array<{ studentId: string }>;
    awardedToId?: string | null;
    createdAt: Date;
  }
): ScholarshipDTO => ({
  id: scholarship.id,
  title: scholarship.title,
  amount: scholarship.amount,
  donorId: scholarship.donorId,
  donorName: scholarship.donor.name,
  fieldOfStudy: scholarship.fieldOfStudy,
  status: scholarship.status,
  applicants: scholarship.applications?.map((a) => a.studentId) ?? [],
  awardedTo: scholarship.awardedToId ?? undefined,
  createdAt: scholarship.createdAt.toISOString().split('T')[0],
});

export const toApplicationDTO = (
  app: {
    id: string;
    studentId: string;
    scholarshipId: string;
    status: 'pending' | 'approved' | 'rejected' | 'under_review';
    submittedAt: Date;
    reviewedAt?: Date | null;
    student: DbUser;
    scholarship: { title: string };
    reviewedBy?: { id: string } | null;
  }
): ApplicationDTO => ({
  id: app.id,
  studentId: app.studentId,
  studentName: app.student.name,
  scholarshipId: app.scholarshipId,
  scholarshipTitle: app.scholarship.title,
  status: app.status,
  submittedAt: app.submittedAt.toISOString().split('T')[0],
  reviewedAt: app.reviewedAt ? app.reviewedAt.toISOString().split('T')[0] : undefined,
  reviewedBy: app.reviewedBy?.id,
});

export const toDonationDTO = (
  donation: {
    id: string;
    donorId: string;
    donor: DbUser;
    amount: number;
    date: Date;
    scholarshipId?: string | null;
    studentId?: string | null;
    student?: DbUser | null;
    fieldOfStudy: string;
  }
): DonationDTO => ({
  id: donation.id,
  donorId: donation.donorId,
  donorName: donation.donor.name,
  amount: donation.amount,
  date: donation.date.toISOString().split('T')[0],
  scholarshipId: donation.scholarshipId ?? undefined,
  studentId: donation.studentId ?? undefined,
  studentName: donation.student?.name,
  fieldOfStudy: donation.fieldOfStudy,
});

export const toStudentDTO = (
  student: DbUser & {
    studentProfile: ({
      institution: string;
      fieldOfStudy: string;
      gpa: number;
      enrollmentStatus: 'active' | 'graduated' | 'suspended';
      receivedFunds: number;
      documents: Array<{
        id: string;
        name: string;
        type: 'transcript' | 'admission_letter' | 'id_proof' | 'recommendation';
        uploadedAt: Date;
        status: 'pending' | 'verified' | 'rejected';
        verifiedById?: string | null;
      }>;
      academicProgress: Array<{
        semester: string;
        gpa: number;
        credits: number;
        status: 'completed' | 'in_progress';
      }>;
    }) | null;
    applications?: Array<{ scholarshipId: string }>;
  }
): StudentDTO => ({
  id: student.id,
  name: student.name,
  email: student.email,
  institution: student.studentProfile?.institution ?? '',
  fieldOfStudy: student.studentProfile?.fieldOfStudy ?? '',
  gpa: student.studentProfile?.gpa ?? 0,
  enrollmentStatus: student.studentProfile?.enrollmentStatus ?? 'active',
  appliedScholarships: student.applications?.map((a) => a.scholarshipId) ?? [],
  receivedFunds: student.studentProfile?.receivedFunds ?? 0,
  documents: (student.studentProfile?.documents ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    type: d.type,
    uploadedAt: d.uploadedAt.toISOString().split('T')[0],
    status: d.status,
    verifiedBy: d.verifiedById ?? undefined,
  })),
  academicProgress: (student.studentProfile?.academicProgress ?? []).map((p) => ({
    semester: p.semester,
    gpa: p.gpa,
    credits: p.credits,
    status: p.status,
  })),
});

export const toMilestoneDTO = (
  milestone: {
    id: string;
    studentId: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    amount: number;
    submittedAt: Date;
    reviewedAt?: Date | null;
    student: DbUser;
  }
): MilestoneDTO => ({
  id: milestone.id,
  studentId: milestone.studentId,
  studentName: milestone.student.name,
  description: milestone.description,
  status: milestone.status,
  amount: milestone.amount,
  submittedAt: milestone.submittedAt.toISOString().split('T')[0],
  reviewedAt: milestone.reviewedAt ? milestone.reviewedAt.toISOString().split('T')[0] : undefined,
});

export const toTransactionDTO = (
  tx: {
    id: string;
    txHash: string;
    amount: number;
    status: 'pending' | 'confirmed' | 'completed' | 'failed';
    timestamp: Date;
    type: 'donation' | 'fund_release' | 'milestone_reward';
    blockNumber?: number | null;
    donor?: DbUser | null;
    student?: DbUser | null;
  }
): TransactionDTO => ({
  id: tx.id,
  txHash: tx.txHash,
  donor: tx.donor?.name ?? 'System',
  student: tx.student?.name ?? 'System',
  amount: tx.amount,
  status: tx.status,
  timestamp: tx.timestamp.toISOString(),
  type: tx.type,
  blockNumber: tx.blockNumber ?? undefined,
});
