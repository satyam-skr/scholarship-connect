import crypto from 'crypto';

export const sha256 = (value: string): string =>
  crypto.createHash('sha256').update(value).digest('hex');

export const createTxHash = (): string =>
  `0x${crypto.randomBytes(8).toString('hex')}...`;

export const computeLedgerHash = (payload: {
  id: string;
  donorId: string;
  studentId: string;
  amount: number;
  timestamp: string;
  previousHash: string;
}): string => {
  const data = `${payload.id}|${payload.donorId}|${payload.studentId}|${payload.amount}|${payload.timestamp}|${payload.previousHash}`;
  return sha256(data);
};
