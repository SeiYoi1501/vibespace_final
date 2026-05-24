/**
 * GET  /api/admin/events  — lấy tất cả sự kiện (kèm stats)
 * POST /api/admin/events  — tạo sự kiện mới
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { eventAdminDb } from '@/lib/store';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  return NextResponse.json({ events: eventAdminDb.all(), total: eventAdminDb.all().length });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const body = await req.json();
    const { title, category, description, date, location, price, imageUrl, availableSeats, tags } = body;

    if (!title || !category || !description || !date || !location)
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc.' }, { status: 400 });

    const event = eventAdminDb.create({
      title, category, description, date, location,
      price:          Number(price)          || 0,
      availableSeats: Number(availableSeats) || 100,
      imageUrl:       imageUrl || 'https://images.unsplash.com/photo-1501386761578-eaa54b4ef9ac?w=800',
      tags:           Array.isArray(tags) ? tags : (tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean),
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 });
  }
}
