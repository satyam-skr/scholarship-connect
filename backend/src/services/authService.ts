import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import type { UserRole } from '../types/contracts';
import { signJwt } from '../utils/jwt';
import { toUserDTO } from './mappers';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Must contain a lowercase letter';
  if (!/\d/.test(password)) return 'Must contain a number';
  if (!/[@$!%*?&#]/.test(password)) return 'Must contain a special character (@$!%*?&#)';
  return null;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: 'Invalid email or password' };
  }

  const token = signJwt({ userId: user.id, role: user.role as UserRole });
  return { success: true, token, user: toUserDTO(user) };
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
) => {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return { success: false, error: 'Email already registered' };
  }

  const pwError = validatePassword(password);
  if (pwError) {
    return { success: false, error: pwError };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const created = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      role,
      passwordHash,
      ...(role === 'student'
        ? {
            studentProfile: {
              create: {
                institution: '',
                fieldOfStudy: '',
                gpa: 0,
                enrollmentStatus: 'active',
                receivedFunds: 0,
              },
            },
          }
        : {}),
    },
  });

  const token = signJwt({ userId: created.id, role: created.role as UserRole });
  return { success: true, token, user: toUserDTO(created) };
};
