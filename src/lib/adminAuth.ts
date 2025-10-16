import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import Admin, { IAdmin } from '@/models/Admin';
import dbConnect from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: string;
}

export const generateAdminToken = (admin: IAdmin): string => {
  return jwt.sign(
    {
      adminId: (admin._id as any).toString(),
      email: admin.email,
      role: admin.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyAdminToken = (token: string): AdminTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch (error) {
    return null;
  }
};

export const getAdminFromRequest = async (request: NextRequest): Promise<IAdmin | null> => {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return null;
    }

    const payload = verifyAdminToken(token);
    if (!payload) {
      return null;
    }

    await dbConnect();
    const admin = await Admin.findById(payload.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      return null;
    }

    return admin;
  } catch (error) {
    console.error('Error getting admin from request:', error);
    return null;
  }
};

export const requireAdmin = async (request: NextRequest, requiredRole?: string[]): Promise<IAdmin> => {
  const admin = await getAdminFromRequest(request);
  
  if (!admin) {
    throw new Error('Authentication required');
  }

  if (requiredRole && !requiredRole.includes(admin.role)) {
    throw new Error('Insufficient permissions');
  }

  return admin;
};

export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
};
