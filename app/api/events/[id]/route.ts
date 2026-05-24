import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = db.events.findById(id);
  if (!event) return NextResponse.json({ error: 'Không tìm thấy sự kiện.' }, { status: 404 });
  return NextResponse.json({ event });
}
