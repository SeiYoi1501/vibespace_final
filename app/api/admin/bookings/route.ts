/**
 * GET /api/admin/bookings — tất cả đơn đặt vé
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { eventAdminDb } from '@/lib/store';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const bookings = eventAdminDb.allBookings();
  return NextResponse.json({ bookings, total: bookings.length });
}
