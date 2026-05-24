'use client';
import React from 'react';
import Link from 'next/link';

interface Admin { fullName?: string; email?: string; }

export function AdminNav({ admin, onLogout }: { admin: Admin | null; onLogout: () => void }) {
  return (
    <div style={{ background: 'rgba(4,17,31,0.98)', borderBottom: '1px solid rgba(220,38,38,0.15)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#dc2626,#f97316)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚙️</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: '#e8f0fe' }}>Admin</span>
        </Link>
        <nav style={{ display: 'flex', gap: 4 }}>
          {[
            { href: '/admin', label: 'Dashboard' },
            { href: '/admin/events', label: 'Sự kiện' },
            { href: '/admin/users', label: 'Users' },
            { href: '/admin/bookings', label: 'Bookings' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              style={{ padding: '5px 12px', borderRadius: 8, fontSize: 13, color: '#a8bfe8', fontWeight: 500 }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/" target="_blank" style={{ fontSize: 12, color: '#3d5a80', fontWeight: 600 }}>← Về trang chủ</Link>
        <span style={{ fontSize: 13, color: '#3d5a80' }}>{admin?.email}</span>
        <button onClick={onLogout} style={{ padding: '6px 14px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export function AdminLoader() {
  return (
    <div style={{ minHeight: '100vh', background: '#020b18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(220,38,38,0.3)', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#3d5a80', fontSize: 14 }}>Đang tải...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
