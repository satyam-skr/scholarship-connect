import { Student } from '@/types';

export const students: Student[] = [
  {
    id: 's1', name: 'Amara Okafor', email: 'amara@example.com',
    institution: 'University of Lagos', fieldOfStudy: 'Computer Science', gpa: 3.8,
    enrollmentStatus: 'active', appliedScholarships: ['sch1', 'sch2'], receivedFunds: 2500,
    documents: [
      { id: 'd1', name: 'Transcript.pdf', type: 'transcript', uploadedAt: '2024-09-15', status: 'verified', verifiedBy: 'v1' },
      { id: 'd2', name: 'Admission.pdf', type: 'admission_letter', uploadedAt: '2024-09-10', status: 'verified', verifiedBy: 'v1' },
    ],
    academicProgress: [
      { semester: 'Fall 2023', gpa: 3.7, credits: 18, status: 'completed' },
      { semester: 'Spring 2024', gpa: 3.8, credits: 16, status: 'completed' },
      { semester: 'Fall 2024', gpa: 3.9, credits: 18, status: 'in_progress' },
    ],
  },
  {
    id: 's2', name: 'Kwame Mensah', email: 'kwame@example.com',
    institution: 'University of Ghana', fieldOfStudy: 'Engineering', gpa: 3.5,
    enrollmentStatus: 'active', appliedScholarships: ['sch1'], receivedFunds: 1800,
    documents: [
      { id: 'd3', name: 'Transcript.pdf', type: 'transcript', uploadedAt: '2024-08-20', status: 'pending' },
    ],
    academicProgress: [
      { semester: 'Fall 2023', gpa: 3.4, credits: 17, status: 'completed' },
      { semester: 'Spring 2024', gpa: 3.5, credits: 15, status: 'completed' },
    ],
  },
  {
    id: 's3', name: 'Fatima Al-Rashid', email: 'fatima@example.com',
    institution: 'Cairo University', fieldOfStudy: 'Medicine', gpa: 3.9,
    enrollmentStatus: 'active', appliedScholarships: ['sch3'], receivedFunds: 4200,
    documents: [
      { id: 'd4', name: 'Transcript.pdf', type: 'transcript', uploadedAt: '2024-07-01', status: 'verified', verifiedBy: 'v1' },
      { id: 'd5', name: 'ID_Proof.pdf', type: 'id_proof', uploadedAt: '2024-07-01', status: 'verified', verifiedBy: 'v1' },
    ],
    academicProgress: [
      { semester: 'Fall 2023', gpa: 3.9, credits: 20, status: 'completed' },
      { semester: 'Spring 2024', gpa: 3.9, credits: 20, status: 'completed' },
    ],
  },
  {
    id: 's4', name: 'Priya Sharma', email: 'priya@example.com',
    institution: 'IIT Delhi', fieldOfStudy: 'Data Science', gpa: 3.6,
    enrollmentStatus: 'active', appliedScholarships: ['sch2'], receivedFunds: 1500,
    documents: [],
    academicProgress: [
      { semester: 'Fall 2024', gpa: 3.6, credits: 16, status: 'in_progress' },
    ],
  },
];
