import { api } from '@/services/api';
import { Donation, Scholarship, Student } from '@/types';

export const donorService = {
  getDonations: (donorId: string): Promise<Donation[]> =>
    api.get<Donation[]>(`/donors/${donorId}/donations`),

  getTotalDonated: (donorId: string): Promise<number> =>
    api.get<number>(`/donors/${donorId}/total-donated`),

  getScholarships: (donorId: string): Promise<Scholarship[]> =>
    api.get<Scholarship[]>(`/donors/${donorId}/scholarships`),

  getStudentsFunded: (donorId: string): Promise<Student[]> =>
    api.get<Student[]>(`/donors/${donorId}/students-funded`),

  getDonationsByField: (donorId: string): Promise<{ name: string; value: number }[]> =>
    api.get<{ name: string; value: number }[]>(`/donors/${donorId}/donations-by-field`),

  getDonationsOverTime: (donorId: string): Promise<{ month: string; amount: number }[]> =>
    api.get<{ month: string; amount: number }[]>(`/donors/${donorId}/donations-over-time`),
};
