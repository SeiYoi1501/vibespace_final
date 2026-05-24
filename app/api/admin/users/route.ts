/**
 * GET /api/admin/users — danh sách tất cả users
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { eventAdminDb } from '@/lib/store';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const users = eventAdminDb.allUsers().map(u => ({
    id: u.id, fullName: u.fullName, email: u.email, createdAt: u.createdAt,
  }));
  return NextResponse.json({ users, total: users.length });
}
