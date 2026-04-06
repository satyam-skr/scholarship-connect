import { api } from '@/services/api';
import { Student } from '@/types';

export const institutionService = {
  getEnrolledStudents: (): Promise<Student[]> =>
    api.get<Student[]>('/institution/enrolled-students'),

  verifyEnrollment: (studentId: string): Promise<{ success: boolean; studentId: string }> =>
    api.post<{ success: boolean; studentId: string }>('/institution/verify-enrollment', { studentId }),

  getTotalReceivedFunds: (): Promise<number> =>
    api.get<number>('/institution/total-received-funds'),
};
