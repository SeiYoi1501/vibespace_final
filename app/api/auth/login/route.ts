import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: 'Vui lòng nhập email và mật khẩu.' }, { status: 400 });
    const user = db.users.findByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash)))
      return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
    const token = await createToken(user.id, user.email);
    const res = NextResponse.json({
      message: 'Đăng nhập thành công!',
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
    res.cookies.set('vs_token', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 60*60*24*7, path: '/',
    });
    return res;
  } catch { return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 }); }
}
