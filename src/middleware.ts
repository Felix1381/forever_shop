import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Skip NextAuth for admin routes - they use custom authentication
    if (pathname.startsWith('/admin')) {
      return NextResponse.next();
    }

    // Check if user is trying to access protected API routes
    if (pathname.startsWith('/api/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 403 }
        );
      }
    }

    if (pathname.startsWith('/api/user')) {
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized - Authentication required' },
          { status: 401 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes and admin routes (admin uses custom auth)
        if (
          pathname.startsWith('/api/auth') ||
          pathname === '/' ||
          pathname.startsWith('/auth') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon') ||
          pathname.startsWith('/admin')
        ) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Exclude /admin routes - they use custom authentication
    // '/admin/:path*',  // Commented out - admin uses custom auth
    '/api/user/:path*',
    '/dashboard/:path*'
  ]
};
