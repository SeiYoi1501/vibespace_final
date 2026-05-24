import { NextResponse } from 'next/server';
export async function POST() {
  const res = NextResponse.json({ message: 'Đã đăng xuất.' });
  res.cookies.delete('vs_token');
  return res;
}
