/**
 * POST /api/admin/auth/login
 * Đăng nhập admin — set cookie vs_admin_token riêng
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/store';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: 'Vui lòng nhập email và mật khẩu.' }, { status: 400 });

    const admin = adminDb.findByEmail(email);
    if (!admin || !(await verifyPassword(password, admin.passwordHash)))
      return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });

    const token = await createToken(admin.id, admin.email);
    const res = NextResponse.json({
      message: 'Đăng nhập thành công!',
      admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role },
    });

    res.cookies.set('vs_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 tiếng
      path: '/',
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 });
  }
}
