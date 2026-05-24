import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password } = await req.json();
    if (!fullName || !email || !password)
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: 'Mật khẩu phải từ 6 ký tự trở lên.' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: 'Địa chỉ email không hợp lệ.' }, { status: 400 });
    if (db.users.findByEmail(email))
      return NextResponse.json({ error: 'Email này đã được đăng ký.' }, { status: 409 });
    const passwordHash = await hashPassword(password);
    const user = db.users.create({ fullName, email, passwordHash });
    return NextResponse.json(
      { message: 'Đăng ký thành công!', user: { id: user.id, fullName: user.fullName, email: user.email } },
      { status: 201 }
    );
  } catch { return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 }); }
}
