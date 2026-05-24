/**
 * GET /api/admin/stats — tổng quan dashboard
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { eventAdminDb } from '@/lib/store';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  return NextResponse.json({ stats: eventAdminDb.stats() });
}
