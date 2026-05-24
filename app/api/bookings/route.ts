import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db, bookingDb } from '@/lib/store';

async function getUser(req: NextRequest) {
  const token = req.cookies.get('vs_token')?.value;
  if (!token) return null;
  const p = await verifyToken(token);
  return p ? db.users.findById(p.userId) : null;
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  return NextResponse.json({ bookings: bookingDb.findByUser(user.id) });
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Vui lòng đăng nhập để đặt vé.' }, { status: 401 });
  const { eventId, quantity } = await req.json();
  if (!eventId || !quantity || quantity < 1 || quantity > 10)
    return NextResponse.json({ error: 'Số lượng vé không hợp lệ (1–10).' }, { status: 400 });
  const event = db.events.findById(eventId);
  if (!event) return NextResponse.json({ error: 'Sự kiện không tồn tại.' }, { status: 404 });
  if (event.availableSeats < quantity)
    return NextResponse.json({ error: `Chỉ còn ${event.availableSeats} chỗ trống.` }, { status: 409 });
  const booking = bookingDb.create({
    userId: user.id, eventId, quantity,
    totalPrice: event.price * quantity,
    status: 'confirmed',
    snapshot: { title: event.title, date: event.date, location: event.location, price: event.price, imageUrl: event.imageUrl, category: event.category },
  });
  return NextResponse.json({ booking }, { status: 201 });
}
