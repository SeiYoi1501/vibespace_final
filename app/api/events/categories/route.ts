import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
export async function GET() {
  const categories = [...new Set(db.events.all().map(e => e.category))].sort();
  return NextResponse.json({ categories });
}
