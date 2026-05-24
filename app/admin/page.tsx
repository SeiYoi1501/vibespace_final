'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav, AdminLoader } from './_components';

interface Stats { totalEvents: number; totalUsers: number; totalBookings: number; totalRevenue: number; }
interface Admin { fullName: string; email: string; }
const fmt = (p: number) => p.toLocaleString('vi-VN') + '₫';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/auth/me').then(r => r.json()),
      fetch('/api/admin/stats').then(r => r.json()),
    ]).then(([a, s]) => {
      if (a.admin) setAdmin(a.admin);
      if (s.stats) setStats(s.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/auth/me', { method: 'DELETE' });
    router.push('/admin/login');
  }

  if (loading) return <AdminLoader />;

  return (
    <div style={{ minHeight: '100vh', background: '#020b18', fontFamily: "'DM Sans',sans-serif" }}>
      <AdminNav admin={admin} onLogout={handleLogout} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#dc2626', textTransform: 'uppercase', marginBottom: 6 }}>⚙️ Tổng quan</p>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, color: '#e8f0fe', letterSpacing: '-0.02em', margin: '0 0 6px' }}>Dashboard</h1>
          <p style={{ color: '#3d5a80', fontSize: 14 }}>Chào mừng trở lại, <strong style={{ color: '#60a5fa' }}>{admin?.fullName}</strong></p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { icon: '🎭', label: 'Sự kiện',     value: stats?.totalEvents   ?? 0,           color: '#3b82f6', link: '/admin/events'   },
            { icon: '👥', label: 'Người dùng',  value: stats?.totalUsers    ?? 0,           color: '#8b5cf6', link: '/admin/users'    },
            { icon: '🎟️', label: 'Đơn đặt vé', value: stats?.totalBookings ?? 0,           color: '#06b6d4', link: '/admin/bookings' },
            { icon: '💰', label: 'Doanh thu',   value: fmt(stats?.totalRevenue ?? 0),       color: '#10b981', link: '/admin'          },
          ].map(item => (
            <Link key={item.label} href={item.link} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(7,24,40,0.9)', border: `1px solid ${item.color}30`, borderRadius: 20, padding: '24px', backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'transform 0.2s' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: item.color, marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontSize: 13, color: '#3d5a80' }}>{item.label}</div>
              </div>
            </Link>
          ))}
        </div>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: '#e8f0fe', margin: '0 0 16px', letterSpacing: '-0.01em' }}>Thao tác nhanh</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
          {[
            { icon: '➕', label: 'Thêm sự kiện mới',  desc: 'Tạo và publish sự kiện',    href: '/admin/events/new',  color: '#2563eb' },
            { icon: '📋', label: 'Quản lí sự kiện',   desc: 'Xem, sửa, xoá sự kiện',    href: '/admin/events',      color: '#7c3aed' },
            { icon: '👤', label: 'Danh sách users',    desc: 'Xem tất cả người dùng',     href: '/admin/users',       color: '#0891b2' },
            { icon: '📊', label: 'Đơn đặt vé',         desc: 'Xem tất cả booking',        href: '/admin/bookings',    color: '#059669' },
          ].map(a => (
            <Link key={a.label} href={a.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(7,24,40,0.9)', border: '1px solid rgba(56,139,253,0.12)', borderRadius: 20, padding: '24px', backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icon}</div>
                <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: '#e8f0fe', margin: '0 0 4px' }}>{a.label}</p>
                <p style={{ fontSize: 13, color: '#3d5a80', margin: 0 }}>{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
