import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db, bookingDb } from '@/lib/store';

async function getUser(req: NextRequest) {
  const token = req.cookies.get('vs_token')?.value;
  if (!token) return null;
  const p = await verifyToken(token);
  return p ? db.users.findById(p.userId) : null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  const { id } = await params;
  const booking = bookingDb.findById(id);
  if (!booking || booking.userId !== user.id)
    return NextResponse.json({ error: 'Không tìm thấy đơn đặt vé.' }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  const { id } = await params;
  const booking = bookingDb.cancel(id, user.id);
  if (!booking)
    return NextResponse.json({ error: 'Không thể huỷ đơn này.' }, { status: 404 });
  return NextResponse.json({ booking, message: 'Huỷ đơn thành công.' });
}
