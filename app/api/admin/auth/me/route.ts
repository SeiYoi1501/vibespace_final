/**
 * GET  /api/admin/auth/me     — lấy thông tin admin đang đăng nhập
 * POST /api/admin/auth/me     — dùng path này để logout cũng được (hoặc DELETE)
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { adminDb } from '@/lib/store';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('vs_admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Token không hợp lệ.' }, { status: 401 });

  const admin = adminDb.findById(payload.userId);
  if (!admin) return NextResponse.json({ error: 'Không tìm thấy admin.' }, { status: 404 });

  return NextResponse.json({ admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role } });
}

export async function DELETE() {
  const res = NextResponse.json({ message: 'Đã đăng xuất.' });
  res.cookies.delete('vs_admin_token');
  return res;
}
