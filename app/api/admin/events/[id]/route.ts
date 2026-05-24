/**
 * GET    /api/admin/events/:id  — xem chi tiết
 * PUT    /api/admin/events/:id  — cập nhật sự kiện
 * DELETE /api/admin/events/:id  — xoá sự kiện
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { eventAdminDb } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const { id } = await params;
  const event = eventAdminDb.findById(id);
  if (!event) return NextResponse.json({ error: 'Không tìm thấy sự kiện.' }, { status: 404 });
  return NextResponse.json({ event });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const { id } = await params;
  try {
    const body = await req.json();
    if (body.price          !== undefined) body.price          = Number(body.price);
    if (body.availableSeats !== undefined) body.availableSeats = Number(body.availableSeats);
    if (body.tags && !Array.isArray(body.tags))
      body.tags = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    const event = eventAdminDb.update(id, body);
    if (!event) return NextResponse.json({ error: 'Không tìm thấy sự kiện.' }, { status: 404 });
    return NextResponse.json({ event });
  } catch {
    return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const { id } = await params;
  const ok = eventAdminDb.delete(id);
  if (!ok) return NextResponse.json({ error: 'Không tìm thấy sự kiện.' }, { status: 404 });
  return NextResponse.json({ message: 'Đã xoá sự kiện.' });
}
