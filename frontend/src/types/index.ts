export type UserRole = 'donor' | 'student' | 'admin' | 'institution' | 'verifier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  institution: string;
  fieldOfStudy: string;
  gpa: number;
  enrollmentStatus: 'active' | 'graduated' | 'suspended';
  appliedScholarships: string[];
  receivedFunds: number;
  documents: Document[];
  academicProgress: AcademicProgress[];
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  totalDonated: number;
  activeScholarships: number;
  studentsFunded: string[];
}

export interface Scholarship {
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

export interface Donation {
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

export interface Transaction {
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

export interface Application {
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

export interface Document {
  id: string;
  name: string;
  type: 'transcript' | 'admission_letter' | 'id_proof' | 'recommendation';
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
}

export interface AcademicProgress {
  semester: string;
  gpa: number;
  credits: number;
  status: 'completed' | 'in_progress';
}

export interface Milestone {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  submittedAt: string;
  reviewedAt?: string;
}

export interface FundAllocation {
  category: string;
  amount: number;
  percentage: number;
}

export interface DashboardStats {
  label: string;
  value: string | number;
  change?: number;
  icon?: string;
}
