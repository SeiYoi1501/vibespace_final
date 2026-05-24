'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Stats { totalEvents:number; totalUsers:number; totalBookings:number; totalRevenue:number; }
interface Admin { fullName:string; email:string; }

const fmt = (p:number) => p.toLocaleString('vi-VN') + '₫';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin]   = useState<Admin|null>(null);
  const [stats, setStats]   = useState<Stats|null>(null);
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
    <div style={s.page}>
      <AdminNav admin={admin} onLogout={handleLogout} />
      <div style={s.content}>
        <div style={{ marginBottom:32 }}>
          <p style={s.eyebrow}>⚙️ Tổng quan</p>
          <h1 style={s.heading}>Dashboard</h1>
          <p style={{ color:'#3d5a80', fontSize:14 }}>Chào mừng trở lại, <strong style={{color:'#60a5fa'}}>{admin?.fullName}</strong></p>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { icon:'🎭', label:'Sự kiện', value: stats?.totalEvents ?? 0, color:'#3b82f6', link:'/admin/events' },
            { icon:'👥', label:'Người dùng', value: stats?.totalUsers ?? 0, color:'#8b5cf6', link:'/admin/users' },
            { icon:'🎟️', label:'Đơn đặt vé', value: stats?.totalBookings ?? 0, color:'#06b6d4', link:'/admin/bookings' },
            { icon:'💰', label:'Doanh thu', value: fmt(stats?.totalRevenue ?? 0), color:'#10b981', link:'/admin' },
          ].map(item => (
            <Link key={item.label} href={item.link} style={{ textDecoration:'none' }}>
              <div style={{ ...s.statCard, borderColor:`${item.color}30` }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{item.icon}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:item.color, marginBottom:4 }}>{item.value}</div>
                <div style={{ fontSize:13, color:'#3d5a80' }}>{item.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ marginBottom:16 }}>
          <h2 style={s.sectionTitle}>Thao tác nhanh</h2>
        </div>
        <div style={s.actionsGrid}>
          {[
            { icon:'➕', label:'Thêm sự kiện mới', desc:'Tạo sự kiện và publish ngay', href:'/admin/events/new', color:'#2563eb' },
            { icon:'📋', label:'Quản lí sự kiện', desc:'Xem, sửa, xoá sự kiện', href:'/admin/events', color:'#7c3aed' },
            { icon:'👤', label:'Danh sách users', desc:'Xem tất cả người dùng', href:'/admin/users', color:'#0891b2' },
            { icon:'📊', label:'Đơn đặt vé', desc:'Xem tất cả booking', href:'/admin/bookings', color:'#059669' },
          ].map(a => (
            <Link key={a.label} href={a.href} style={{ textDecoration:'none' }}>
              <div style={{ ...s.actionCard, '--accent':a.color } as React.CSSProperties}>
                <div style={{ fontSize:32, marginBottom:12 }}>{a.icon}</div>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:'#e8f0fe', margin:'0 0 4px' }}>{a.label}</p>
                <p style={{ fontSize:13, color:'#3d5a80', margin:0 }}>{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{css}</style>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

export function AdminNav({ admin, onLogout }: { admin:Admin|null; onLogout:()=>void }) {
  return (
    <div style={{ background:'rgba(4,17,31,0.98)', borderBottom:'1px solid rgba(220,38,38,0.15)', padding:'0 32px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(16px)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:24 }}>
        <Link href="/admin" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:30, height:30, background:'linear-gradient(135deg,#dc2626,#f97316)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>⚙️</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'#e8f0fe' }}>Admin</span>
        </Link>
        <nav style={{ display:'flex', gap:4 }}>
          {[
            { href:'/admin', label:'Dashboard' },
            { href:'/admin/events', label:'Sự kiện' },
            { href:'/admin/users', label:'Users' },
            { href:'/admin/bookings', label:'Bookings' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ padding:'5px 12px', borderRadius:8, fontSize:13, color:'#a8bfe8', fontWeight:500, transition:'all 0.15s' }}
              onMouseEnter={e=>(e.currentTarget.style.background='rgba(220,38,38,0.15)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <Link href="/" target="_blank" style={{ fontSize:12, color:'#3d5a80', fontWeight:600 }}>← Về trang chủ</Link>
        <span style={{ fontSize:13, color:'#3d5a80' }}>{admin?.email}</span>
        <button onClick={onLogout} style={{ padding:'6px 14px', background:'rgba(220,38,38,0.12)', border:'1px solid rgba(220,38,38,0.25)', borderRadius:8, color:'#ef4444', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export function AdminLoader() {
  return (
    <div style={{ minHeight:'100vh', background:'#020b18', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(220,38,38,0.3)', borderTopColor:'#dc2626', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
      <p style={{ color:'#3d5a80', fontSize:14 }}>Đang tải...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string,React.CSSProperties> = {
  page:    { minHeight:'100vh', background:'#020b18', fontFamily:"'DM Sans',sans-serif",
             backgroundImage:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(220,38,38,0.06) 0%, transparent 60%)' },
  content: { maxWidth:1100, margin:'0 auto', padding:'40px 32px 80px' },
  eyebrow: { fontSize:12, fontWeight:700, letterSpacing:'0.12em', color:'#dc2626', textTransform:'uppercase', marginBottom:6 },
  heading: { fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, color:'#e8f0fe', letterSpacing:'-0.02em', margin:'0 0 6px' },
  sectionTitle: { fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:'#e8f0fe', margin:'0 0 16px', letterSpacing:'-0.01em' },
  statsGrid:  { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginBottom:40 },
  statCard:   { background:'rgba(7,24,40,0.9)', border:'1px solid', borderRadius:20, padding:'24px', cursor:'pointer', transition:'transform 0.2s, box-shadow 0.2s', backdropFilter:'blur(12px)' },
  actionsGrid:{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 },
  actionCard: { background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.12)', borderRadius:20, padding:'24px', cursor:'pointer', transition:'all 0.2s', backdropFilter:'blur(12px)' },
};

const css = `
  a > div:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
