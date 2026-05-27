'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NavbarClient() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Kiểm tra có cookie admin không
    fetch('/api/admin/auth/me')
      .then(r => r.json())
      .then(d => { if (d.admin) setIsAdmin(true); })
      .catch(() => {});
  }, []);

  const links = [
    { href: '/',         label: 'Trang chủ' },
    { href: '/events',   label: 'Sự kiện'   },
    { href: '/contact',  label: 'Liên hệ'   },
    { href: '/login',    label: 'Đăng nhập' },
    { href: '/register', label: 'Đăng ký'   },
    { href: '/profile',  label: 'Hồ sơ'     },
  ];

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {links.map(({ href, label }) => (
        <Link key={href} href={href} className="vs-nav-link" style={{
          padding: '6px 14px', borderRadius: 8, fontSize: 14,
          fontWeight: 500, color: '#a8bfe8', transition: 'all 0.18s ease', whiteSpace: 'nowrap',
        }}>
          {label}
        </Link>
      ))}

      {/* Chỉ hiện nút Admin nếu đang đăng nhập admin */}
      {isAdmin && (
        <Link href="/admin" style={{
          padding: '6px 14px', borderRadius: 8, fontSize: 14,
          fontWeight: 700, color: '#fca5a5', transition: 'all 0.18s ease',
          background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)',
          marginLeft: 4,
        }}>
          ⚙️ Admin
        </Link>
      )}

      {/* CTA Button */}
      <Link href="/events" style={{
        marginLeft: 8, padding: '8px 18px',
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700,
        boxShadow: '0 0 16px rgba(37,99,235,0.35)', transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}>
        Đặt vé ngay
      </Link>
    </nav>
  );
}
