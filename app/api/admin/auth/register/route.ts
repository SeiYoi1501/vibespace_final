/**
 * POST /api/admin/auth/register
 * Tạo tài khoản admin (chỉ dùng lần đầu setup, sau nên khoá lại)
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/store';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, setupKey } = await req.json();

    // Khoá bảo vệ: phải có đúng setup key mới tạo được admin
    if (setupKey !== (process.env.ADMIN_SETUP_KEY ?? 'vibespace-admin-setup-2026')) {
      return NextResponse.json({ error: 'Setup key không đúng.' }, { status: 403 });
    }

    if (!fullName || !email || !password)
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ.' }, { status: 400 });

    if (adminDb.findByEmail(email))
      return NextResponse.json({ error: 'Email admin này đã tồn tại.' }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const admin = adminDb.create({ fullName, email, passwordHash });

    return NextResponse.json(
      { message: 'Tạo tài khoản admin thành công!', admin: { id: admin.id, email: admin.email, fullName: admin.fullName } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 });
  }
}
