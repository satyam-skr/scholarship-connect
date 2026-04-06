import crypto from 'crypto';
import { prisma } from '../prisma/client';
import { computeLedgerHash, createTxHash } from '../utils/hash';

type TxStatus = 'pending' | 'confirmed' | 'completed' | 'failed';
type TxType = 'donation' | 'fund_release' | 'milestone_reward';

interface CreateLedgerInput {
  donorId?: string;
  studentId?: string;
  amount: number;
  timestamp?: Date;
  status?: TxStatus;
  type: TxType;
  blockNumber?: number;
  donationId?: string;
  milestoneId?: string;
}

export const createLedgerTransaction = async (input: CreateLedgerInput) => {
  const timestamp = input.timestamp ?? new Date();
  const id = crypto.randomUUID();

  const prev = await prisma.ledgerTransaction.findFirst({
    orderBy: { timestamp: 'desc' },
  });

  const previousHash = prev?.currentHash ?? 'GENESIS';
  const currentHash = computeLedgerHash({
    id,
    donorId: input.donorId ?? 'system',
    studentId: input.studentId ?? 'system',
    amount: input.amount,
    timestamp: timestamp.toISOString(),
    previousHash,
  });

  return prisma.ledgerTransaction.create({
    data: {
      id,
      donorId: input.donorId,
      studentId: input.studentId,
      amount: input.amount,
      timestamp,
      previousHash,
      currentHash,
      txHash: createTxHash(),
      status: input.status ?? 'completed',
      type: input.type,
      blockNumber: input.blockNumber,
      donationId: input.donationId,
      milestoneId: input.milestoneId,
    },
  });
};

export const transactionInclude = {
  donor: true,
  student: true,
} as const;
