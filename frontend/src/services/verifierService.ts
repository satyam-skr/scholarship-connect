import { api } from '@/services/api';
import { Milestone, Document } from '@/types';

export const verifierService = {
  getPendingMilestones: (): Promise<Milestone[]> =>
    api.get<Milestone[]>('/verifier/milestones/pending'),

  getAllMilestones: (): Promise<Milestone[]> => api.get<Milestone[]>('/verifier/milestones'),

  getPendingDocuments: (): Promise<(Document & { studentName: string })[]> =>
    api.get<(Document & { studentName: string })[]>('/verifier/documents/pending'),

  approveMilestone: (id: string): Promise<{ success: boolean; id: string }> =>
    api.post<{ success: boolean; id: string }>(`/verifier/milestones/${id}/approve`),

  releaseFunds: (milestoneId: string): Promise<{ success: boolean; milestoneId: string; txHash: string }> =>
    api.post<{ success: boolean; milestoneId: string; txHash: string }>(`/verifier/milestones/${milestoneId}/release-funds`),
};
