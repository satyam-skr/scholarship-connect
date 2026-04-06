import { api } from '@/services/api';
import { Student, Application, Scholarship, Document } from '@/types';

export const studentService = {
  getStudent: (id: string): Promise<Student | null> =>
    api.get<Student | null>(`/students/${id}`),

  getApplications: (studentId: string): Promise<Application[]> =>
    api.get<Application[]>(`/students/${studentId}/applications`),

  getAvailableScholarships: (): Promise<Scholarship[]> =>
    api.get<Scholarship[]>('/students/scholarships/available'),

  getReceivedFunds: (studentId: string): Promise<number> =>
    api.get<number>(`/students/${studentId}/received-funds`),

  apply: (studentId: string, scholarshipId: string): Promise<Application> =>
    api.post<Application>(`/students/${studentId}/applications`, { scholarshipId }),

  uploadDocument: (studentId: string, file: File, type: Document['type']): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.upload<Document>(`/students/${studentId}/documents`, formData);
  },
};
