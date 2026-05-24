/**
 * lib/adminGuard.ts
 * Helper dùng chung cho tất cả API admin — xác thực cookie vs_admin_token
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { adminDb } from '@/lib/store';

export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('vs_admin_token')?.value;
  if (!token) return { admin: null, error: NextResponse.json({ error: 'Chưa đăng nhập admin.' }, { status: 401 }) };

  const payload = await verifyToken(token);
  if (!payload) return { admin: null, error: NextResponse.json({ error: 'Token không hợp lệ.' }, { status: 401 }) };

  const admin = adminDb.findById(payload.userId);
  if (!admin) return { admin: null, error: NextResponse.json({ error: 'Không tìm thấy admin.' }, { status: 403 }) };

  return { admin, error: null };
}
