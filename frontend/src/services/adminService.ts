import { api } from '@/services/api';
import { Student, Application, FundAllocation } from '@/types';

export const adminService = {
  getAllStudents: (): Promise<Student[]> => api.get<Student[]>('/admin/students'),

  getAllApplications: (): Promise<Application[]> => api.get<Application[]>('/admin/applications'),

  getTotalFundsDistributed: (): Promise<number> =>
    api.get<number>('/admin/funds-distributed'),

  getStudentsSupported: (): Promise<number> =>
    api.get<number>('/admin/students-supported'),

  getFundAllocations: (): Promise<FundAllocation[]> => api.get<FundAllocation[]>('/admin/fund-allocations'),

  reviewApplication: (id: string, status: Application['status']): Promise<Application> =>
    api.patch<Application>(`/admin/applications/${id}/review`, { status }),
};
