import { UserRole } from '@/types';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const mockUsers: MockUser[] = [
  {
    id: 'd1',
    name: 'Global Ed Foundation',
    email: 'donor@smartscholar.io',
    password: 'Donor@123',
    role: 'donor',
  },
  {
    id: 's1',
    name: 'Amara Okafor',
    email: 'student@smartscholar.io',
    password: 'Student@123',
    role: 'student',
  },
  {
    id: 'admin1',
    name: 'NGO Admin',
    email: 'admin@smartscholar.io',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    id: 'inst1',
    name: 'University Rep',
    email: 'institution@smartscholar.io',
    password: 'Institution@123',
    role: 'institution',
  },
  {
    id: 'v1',
    name: 'Document Verifier',
    email: 'verifier@smartscholar.io',
    password: 'Verifier@123',
    role: 'verifier',
  },
];
