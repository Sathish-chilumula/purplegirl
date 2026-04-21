import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Protect all admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');
    const passcode = process.env.ADMIN_PASSCODE;

    if (!passcode) {
      // If no passcode is configured in env, allow access (for local dev mostly)
      return NextResponse.next(); 
    }

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Simple Basic Auth logic where password = your secure Admin passcode
      if (pwd === passcode || user === passcode) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Admin Access Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Portal - Enter Passcode"',
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
