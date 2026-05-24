import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/store';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('vs_token')?.value;
  if (!token) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Token không hợp lệ.' }, { status: 401 });
  const user = db.users.findById(payload.userId);
  if (!user) return NextResponse.json({ error: 'Không tìm thấy người dùng.' }, { status: 404 });
  return NextResponse.json({ user: { id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt } });
}
