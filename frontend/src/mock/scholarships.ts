import { Scholarship } from '@/types';

export const scholarships: Scholarship[] = [
  { id: 'sch1', title: 'STEM Excellence Award', amount: 10000, donorId: 'd1', donorName: 'Global Ed Foundation', fieldOfStudy: 'Computer Science', status: 'awarded', applicants: ['s1', 's2'], awardedTo: 's1', createdAt: '2024-01-01' },
  { id: 'sch2', title: 'Future Innovators Grant', amount: 7500, donorId: 'd1', donorName: 'Global Ed Foundation', fieldOfStudy: 'Data Science', status: 'open', applicants: ['s4'], createdAt: '2024-03-15' },
  { id: 'sch3', title: 'Healthcare Heroes Fund', amount: 15000, donorId: 'd1', donorName: 'Global Ed Foundation', fieldOfStudy: 'Medicine', status: 'awarded', applicants: ['s3'], awardedTo: 's3', createdAt: '2024-02-01' },
  { id: 'sch4', title: 'Engineering Tomorrow', amount: 8000, donorId: 'd1', donorName: 'Global Ed Foundation', fieldOfStudy: 'Engineering', status: 'open', applicants: [], createdAt: '2024-06-01' },
];
