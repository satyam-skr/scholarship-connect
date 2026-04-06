import { Transaction } from '@/types';

export const transactions: Transaction[] = [
  { id: 'tx1', txHash: '0x8a3f...e7b2', donor: 'Global Ed Foundation', student: 'Amara Okafor', amount: 5000, status: 'completed', timestamp: '2024-01-15T10:30:00Z', type: 'donation', blockNumber: 18234567 },
  { id: 'tx2', txHash: '0x1c9d...a4f8', donor: 'Global Ed Foundation', student: 'Kwame Mensah', amount: 3000, status: 'completed', timestamp: '2024-02-20T14:15:00Z', type: 'donation', blockNumber: 18345678 },
  { id: 'tx3', txHash: '0x5e2b...d1c3', donor: 'Global Ed Foundation', student: 'Fatima Al-Rashid', amount: 4500, status: 'completed', timestamp: '2024-03-10T09:00:00Z', type: 'donation', blockNumber: 18456789 },
  { id: 'tx4', txHash: '0x7f4a...b9e1', donor: 'System', student: 'Amara Okafor', amount: 1000, status: 'completed', timestamp: '2024-04-01T16:45:00Z', type: 'milestone_reward', blockNumber: 18567890 },
  { id: 'tx5', txHash: '0x3d8c...f2a7', donor: 'Global Ed Foundation', student: 'Priya Sharma', amount: 3500, status: 'confirmed', timestamp: '2024-05-18T11:20:00Z', type: 'donation', blockNumber: 18678901 },
  { id: 'tx6', txHash: '0x9b1e...c5d4', donor: 'System', student: 'Fatima Al-Rashid', amount: 2000, status: 'pending', timestamp: '2024-06-22T08:30:00Z', type: 'fund_release' },
  { id: 'tx7', txHash: '0x2a6f...e8b3', donor: 'Global Ed Foundation', student: 'Kwame Mensah', amount: 2800, status: 'completed', timestamp: '2024-07-14T13:00:00Z', type: 'donation', blockNumber: 18789012 },
  { id: 'tx8', txHash: '0x4c3d...a1f9', donor: 'System', student: 'Priya Sharma', amount: 500, status: 'failed', timestamp: '2024-08-01T15:10:00Z', type: 'fund_release' },
];
