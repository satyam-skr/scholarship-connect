export type UserRole = 'donor' | 'student' | 'admin' | 'institution' | 'verifier';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface StudentDTO {
  id: string;
  name: string;
  email: string;
  institution: string;
  fieldOfStudy: string;
  gpa: number;
  enrollmentStatus: 'active' | 'graduated' | 'suspended';
  appliedScholarships: string[];
  receivedFunds: number;
  documents: DocumentDTO[];
  academicProgress: AcademicProgressDTO[];
}

export interface ScholarshipDTO {
  id: string;
  title: string;
  amount: number;
  donorId: string;
  donorName: string;
  fieldOfStudy: string;
  status: 'open' | 'closed' | 'awarded';
  applicants: string[];
  awardedTo?: string;
  createdAt: string;
}

export interface DonationDTO {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  date: string;
  scholarshipId?: string;
  studentId?: string;
  studentName?: string;
  fieldOfStudy: string;
}

export interface TransactionDTO {
  id: string;
  txHash: string;
  donor: string;
  student: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  timestamp: string;
  type: 'donation' | 'fund_release' | 'milestone_reward';
  blockNumber?: number;
}

export interface ApplicationDTO {
  id: string;
  studentId: string;
  studentName: string;
  scholarshipId: string;
  scholarshipTitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface DocumentDTO {
  id: string;
  name: string;
  type: 'transcript' | 'admission_letter' | 'id_proof' | 'recommendation';
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
}

export interface AcademicProgressDTO {
  semester: string;
  gpa: number;
  credits: number;
  status: 'completed' | 'in_progress';
}

export interface MilestoneDTO {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  submittedAt: string;
  reviewedAt?: string;
}

export interface FundAllocationDTO {
  category: string;
  amount: number;
  percentage: number;
}
