import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { generateAdminToken } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Admin login attempt started');
    const { email, password } = await request.json();
    console.log('📧 Email received:', email);
    console.log('🔒 Password received:', password ? '[PROVIDED]' : '[MISSING]');

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');

    // Find admin by email
    console.log('🔍 Searching for admin with email:', email.toLowerCase());
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    console.log('👤 Admin found:', admin ? 'YES' : 'NO');
    
    if (!admin) {
      console.log('❌ Admin not found in database');
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    console.log('📋 Admin details:');
    console.log('  - Email:', admin.email);
    console.log('  - Name:', admin.name);
    console.log('  - Role:', admin.role);
    console.log('  - Active:', admin.isActive);

    // Check if admin is active
    if (!admin.isActive) {
      console.log('❌ Admin account is inactive');
      return NextResponse.json(
        { error: 'Compte désactivé' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('🔐 Verifying password...');
    const isValidPassword = await admin.comparePassword(password);
    console.log('🔍 Password verification result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password provided');
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    console.log('✅ Password verification successful');

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateAdminToken(admin);

    // Create response with token in cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
