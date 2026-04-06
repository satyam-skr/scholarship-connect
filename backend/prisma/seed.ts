import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { computeLedgerHash } from '../src/utils/hash';

const prisma = new PrismaClient();

async function main() {
  await prisma.ledgerTransaction.deleteMany();
  await prisma.enrollmentVerification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.academicProgress.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.application.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const users = [
    { id: 'd1', name: 'Global Ed Foundation', email: 'donor@smartscholar.io', password: 'Donor@123', role: 'donor' as const },
    { id: 's1', name: 'Amara Okafor', email: 'student@smartscholar.io', password: 'Student@123', role: 'student' as const },
    { id: 'admin1', name: 'NGO Admin', email: 'admin@smartscholar.io', password: 'Admin@123', role: 'admin' as const },
    { id: 'inst1', name: 'University Rep', email: 'institution@smartscholar.io', password: 'Institution@123', role: 'institution' as const },
    { id: 'v1', name: 'Document Verifier', email: 'verifier@smartscholar.io', password: 'Verifier@123', role: 'verifier' as const },
    { id: 's2', name: 'Kwame Mensah', email: 'kwame@example.com', password: 'Student@123', role: 'student' as const },
    { id: 's3', name: 'Fatima Al-Rashid', email: 'fatima@example.com', password: 'Student@123', role: 'student' as const },
    { id: 's4', name: 'Priya Sharma', email: 'priya@example.com', password: 'Student@123', role: 'student' as const },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash: await bcrypt.hash(user.password, 10),
      },
    });
  }

  const profiles = [
    { id: 'sp1', userId: 's1', institution: 'University of Lagos', fieldOfStudy: 'Computer Science', gpa: 3.8, enrollmentStatus: 'active' as const, receivedFunds: 2500 },
    { id: 'sp2', userId: 's2', institution: 'University of Ghana', fieldOfStudy: 'Engineering', gpa: 3.5, enrollmentStatus: 'active' as const, receivedFunds: 1800 },
    { id: 'sp3', userId: 's3', institution: 'Cairo University', fieldOfStudy: 'Medicine', gpa: 3.9, enrollmentStatus: 'active' as const, receivedFunds: 4200 },
    { id: 'sp4', userId: 's4', institution: 'IIT Delhi', fieldOfStudy: 'Data Science', gpa: 3.6, enrollmentStatus: 'active' as const, receivedFunds: 1500 },
  ];

  await prisma.studentProfile.createMany({ data: profiles });

  await prisma.document.createMany({
    data: [
      { id: 'd1doc', name: 'Transcript.pdf', type: 'transcript', uploadedAt: new Date('2024-09-15'), status: 'verified', verifiedById: 'v1', filePath: 'uploads/Transcript.pdf', studentProfileId: 'sp1' },
      { id: 'd2doc', name: 'Admission.pdf', type: 'admission_letter', uploadedAt: new Date('2024-09-10'), status: 'verified', verifiedById: 'v1', filePath: 'uploads/Admission.pdf', studentProfileId: 'sp1' },
      { id: 'd3doc', name: 'Transcript.pdf', type: 'transcript', uploadedAt: new Date('2024-08-20'), status: 'pending', filePath: 'uploads/Transcript2.pdf', studentProfileId: 'sp2' },
      { id: 'd4doc', name: 'Transcript.pdf', type: 'transcript', uploadedAt: new Date('2024-07-01'), status: 'verified', verifiedById: 'v1', filePath: 'uploads/Transcript3.pdf', studentProfileId: 'sp3' },
      { id: 'd5doc', name: 'ID_Proof.pdf', type: 'id_proof', uploadedAt: new Date('2024-07-01'), status: 'verified', verifiedById: 'v1', filePath: 'uploads/ID_Proof.pdf', studentProfileId: 'sp3' },
    ],
  });

  await prisma.academicProgress.createMany({
    data: [
      { studentProfileId: 'sp1', semester: 'Fall 2023', gpa: 3.7, credits: 18, status: 'completed' },
      { studentProfileId: 'sp1', semester: 'Spring 2024', gpa: 3.8, credits: 16, status: 'completed' },
      { studentProfileId: 'sp1', semester: 'Fall 2024', gpa: 3.9, credits: 18, status: 'in_progress' },
      { studentProfileId: 'sp2', semester: 'Fall 2023', gpa: 3.4, credits: 17, status: 'completed' },
      { studentProfileId: 'sp2', semester: 'Spring 2024', gpa: 3.5, credits: 15, status: 'completed' },
      { studentProfileId: 'sp3', semester: 'Fall 2023', gpa: 3.9, credits: 20, status: 'completed' },
      { studentProfileId: 'sp3', semester: 'Spring 2024', gpa: 3.9, credits: 20, status: 'completed' },
      { studentProfileId: 'sp4', semester: 'Fall 2024', gpa: 3.6, credits: 16, status: 'in_progress' },
    ],
  });

  await prisma.scholarship.createMany({
    data: [
      { id: 'sch1', title: 'STEM Excellence Award', amount: 10000, donorId: 'd1', fieldOfStudy: 'Computer Science', status: 'awarded', awardedToId: 's1', createdAt: new Date('2024-01-01') },
      { id: 'sch2', title: 'Future Innovators Grant', amount: 7500, donorId: 'd1', fieldOfStudy: 'Data Science', status: 'open', createdAt: new Date('2024-03-15') },
      { id: 'sch3', title: 'Healthcare Heroes Fund', amount: 15000, donorId: 'd1', fieldOfStudy: 'Medicine', status: 'awarded', awardedToId: 's3', createdAt: new Date('2024-02-01') },
      { id: 'sch4', title: 'Engineering Tomorrow', amount: 8000, donorId: 'd1', fieldOfStudy: 'Engineering', status: 'open', createdAt: new Date('2024-06-01') },
    ],
  });

  await prisma.application.createMany({
    data: [
      { id: 'app1', studentId: 's1', scholarshipId: 'sch1', status: 'approved', submittedAt: new Date('2024-01-05'), reviewedAt: new Date('2024-01-12'), reviewedById: 'admin1' },
      { id: 'app2', studentId: 's2', scholarshipId: 'sch1', status: 'under_review', submittedAt: new Date('2024-01-08') },
      { id: 'app3', studentId: 's3', scholarshipId: 'sch3', status: 'approved', submittedAt: new Date('2024-02-10'), reviewedAt: new Date('2024-02-18'), reviewedById: 'admin1' },
      { id: 'app4', studentId: 's4', scholarshipId: 'sch2', status: 'pending', submittedAt: new Date('2024-04-01') },
      { id: 'app5', studentId: 's1', scholarshipId: 'sch2', status: 'rejected', submittedAt: new Date('2024-03-20'), reviewedAt: new Date('2024-03-28'), reviewedById: 'admin1' },
    ],
  });

  await prisma.milestone.createMany({
    data: [
      { id: 'm1', studentId: 's1', description: 'Complete semester 1 with GPA > 3.5', status: 'approved', amount: 1000, submittedAt: new Date('2024-02-01'), reviewedAt: new Date('2024-02-05') },
      { id: 'm2', studentId: 's1', description: 'Submit research paper', status: 'pending', amount: 1500, submittedAt: new Date('2024-06-15') },
      { id: 'm3', studentId: 's3', description: 'Complete clinical rotation', status: 'pending', amount: 2000, submittedAt: new Date('2024-05-20') },
      { id: 'm4', studentId: 's2', description: 'Pass mid-term examinations', status: 'approved', amount: 800, submittedAt: new Date('2024-04-10'), reviewedAt: new Date('2024-04-15') },
    ],
  });

  await prisma.donation.createMany({
    data: [
      { id: 'don1', donorId: 'd1', amount: 5000, date: new Date('2024-01-15'), scholarshipId: 'sch1', studentId: 's1', fieldOfStudy: 'Computer Science' },
      { id: 'don2', donorId: 'd1', amount: 3000, date: new Date('2024-02-20'), scholarshipId: 'sch1', studentId: 's2', fieldOfStudy: 'Engineering' },
      { id: 'don3', donorId: 'd1', amount: 4500, date: new Date('2024-03-10'), scholarshipId: 'sch3', studentId: 's3', fieldOfStudy: 'Medicine' },
      { id: 'don4', donorId: 'd1', amount: 2000, date: new Date('2024-04-05'), fieldOfStudy: 'Data Science' },
      { id: 'don5', donorId: 'd1', amount: 3500, date: new Date('2024-05-18'), scholarshipId: 'sch2', studentId: 's4', fieldOfStudy: 'Data Science' },
      { id: 'don6', donorId: 'd1', amount: 6000, date: new Date('2024-06-22'), fieldOfStudy: 'Computer Science' },
      { id: 'don7', donorId: 'd1', amount: 2800, date: new Date('2024-07-14'), fieldOfStudy: 'Engineering' },
      { id: 'don8', donorId: 'd1', amount: 4000, date: new Date('2024-08-30'), fieldOfStudy: 'Medicine' },
    ],
  });

  const txSeeds: Array<{
    id: string;
    txHash: string;
    donorId?: string;
    studentId?: string;
    amount: number;
    timestamp: Date;
    type: 'donation' | 'fund_release' | 'milestone_reward';
    status: 'pending' | 'confirmed' | 'completed' | 'failed';
    blockNumber?: number;
    donationId?: string;
  }> = [
    { id: 'tx1', txHash: '0x8a3f...e7b2', donorId: 'd1', studentId: 's1', amount: 5000, status: 'completed', timestamp: new Date('2024-01-15T10:30:00Z'), type: 'donation', blockNumber: 18234567, donationId: 'don1' },
    { id: 'tx2', txHash: '0x1c9d...a4f8', donorId: 'd1', studentId: 's2', amount: 3000, status: 'completed', timestamp: new Date('2024-02-20T14:15:00Z'), type: 'donation', blockNumber: 18345678, donationId: 'don2' },
    { id: 'tx3', txHash: '0x5e2b...d1c3', donorId: 'd1', studentId: 's3', amount: 4500, status: 'completed', timestamp: new Date('2024-03-10T09:00:00Z'), type: 'donation', blockNumber: 18456789, donationId: 'don3' },
    { id: 'tx4', txHash: '0x7f4a...b9e1', studentId: 's1', amount: 1000, status: 'completed', timestamp: new Date('2024-04-01T16:45:00Z'), type: 'milestone_reward', blockNumber: 18567890 },
    { id: 'tx5', txHash: '0x3d8c...f2a7', donorId: 'd1', studentId: 's4', amount: 3500, status: 'confirmed', timestamp: new Date('2024-05-18T11:20:00Z'), type: 'donation', blockNumber: 18678901, donationId: 'don5' },
    { id: 'tx6', txHash: '0x9b1e...c5d4', studentId: 's3', amount: 2000, status: 'pending', timestamp: new Date('2024-06-22T08:30:00Z'), type: 'fund_release' },
    { id: 'tx7', txHash: '0x2a6f...e8b3', donorId: 'd1', studentId: 's2', amount: 2800, status: 'completed', timestamp: new Date('2024-07-14T13:00:00Z'), type: 'donation', blockNumber: 18789012, donationId: 'don7' },
    { id: 'tx8', txHash: '0x4c3d...a1f9', studentId: 's4', amount: 500, status: 'failed', timestamp: new Date('2024-08-01T15:10:00Z'), type: 'fund_release' },
  ];

  let previousHash = 'GENESIS';
  for (const tx of txSeeds) {
    const currentHash = computeLedgerHash({
      id: tx.id,
      donorId: tx.donorId ?? 'system',
      studentId: tx.studentId ?? 'system',
      amount: tx.amount,
      timestamp: tx.timestamp.toISOString(),
      previousHash,
    });

    await prisma.ledgerTransaction.create({
      data: {
        id: tx.id,
        txHash: tx.txHash,
        donorId: tx.donorId,
        studentId: tx.studentId,
        amount: tx.amount,
        timestamp: tx.timestamp,
        status: tx.status,
        type: tx.type,
        blockNumber: tx.blockNumber,
        donationId: tx.donationId,
        previousHash,
        currentHash,
      },
    });

    previousHash = currentHash;
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
