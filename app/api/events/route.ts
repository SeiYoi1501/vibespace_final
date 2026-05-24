import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
export async function GET(req: NextRequest) {
  const q        = req.nextUrl.searchParams.get('q')        ?? '';
  const category = req.nextUrl.searchParams.get('category') ?? '';
  const events   = db.events.search(q, category);
  return NextResponse.json({ events, total: events.length });
}
