import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}; 