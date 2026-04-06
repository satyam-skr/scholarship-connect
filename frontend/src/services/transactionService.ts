import { api } from '@/services/api';
import { Transaction } from '@/types';

export const transactionService = {
  getAll: (): Promise<Transaction[]> => api.get<Transaction[]>('/transactions'),
  getByStatus: (status: Transaction['status']): Promise<Transaction[]> =>
    api.get<Transaction[]>(`/transactions/status/${status}`),
};
