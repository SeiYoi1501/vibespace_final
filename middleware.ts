import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Bảo vệ /admin (trừ /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('vs_admin_token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));
    const payload = await verifyToken(token);
    if (!payload) {
      const res = NextResponse.redirect(new URL('/admin/login', req.url));
      res.cookies.delete('vs_admin_token');
      return res;
    }
  }

  // ── Bảo vệ /profile
  if (pathname.startsWith('/profile')) {
    const token = req.cookies.get('vs_token')?.value;
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    const payload = await verifyToken(token);
    if (!payload) {
      const res = NextResponse.redirect(new URL('/login', req.url));
      res.cookies.delete('vs_token');
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};
