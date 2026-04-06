import { Application, Milestone } from '@/types';

export const applications: Application[] = [
  { id: 'app1', studentId: 's1', studentName: 'Amara Okafor', scholarshipId: 'sch1', scholarshipTitle: 'STEM Excellence Award', status: 'approved', submittedAt: '2024-01-05', reviewedAt: '2024-01-12', reviewedBy: 'admin1' },
  { id: 'app2', studentId: 's2', studentName: 'Kwame Mensah', scholarshipId: 'sch1', scholarshipTitle: 'STEM Excellence Award', status: 'under_review', submittedAt: '2024-01-08' },
  { id: 'app3', studentId: 's3', studentName: 'Fatima Al-Rashid', scholarshipId: 'sch3', scholarshipTitle: 'Healthcare Heroes Fund', status: 'approved', submittedAt: '2024-02-10', reviewedAt: '2024-02-18', reviewedBy: 'admin1' },
  { id: 'app4', studentId: 's4', studentName: 'Priya Sharma', scholarshipId: 'sch2', scholarshipTitle: 'Future Innovators Grant', status: 'pending', submittedAt: '2024-04-01' },
  { id: 'app5', studentId: 's1', studentName: 'Amara Okafor', scholarshipId: 'sch2', scholarshipTitle: 'Future Innovators Grant', status: 'rejected', submittedAt: '2024-03-20', reviewedAt: '2024-03-28', reviewedBy: 'admin1' },
];

export const milestones: Milestone[] = [
  { id: 'm1', studentId: 's1', studentName: 'Amara Okafor', description: 'Complete semester 1 with GPA > 3.5', status: 'approved', amount: 1000, submittedAt: '2024-02-01', reviewedAt: '2024-02-05' },
  { id: 'm2', studentId: 's1', studentName: 'Amara Okafor', description: 'Submit research paper', status: 'pending', amount: 1500, submittedAt: '2024-06-15' },
  { id: 'm3', studentId: 's3', studentName: 'Fatima Al-Rashid', description: 'Complete clinical rotation', status: 'pending', amount: 2000, submittedAt: '2024-05-20' },
  { id: 'm4', studentId: 's2', studentName: 'Kwame Mensah', description: 'Pass mid-term examinations', status: 'approved', amount: 800, submittedAt: '2024-04-10', reviewedAt: '2024-04-15' },
];
