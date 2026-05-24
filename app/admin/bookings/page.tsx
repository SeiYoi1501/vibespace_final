'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNav, AdminLoader } from '../page';

interface Booking { id:string; userId:string; quantity:number; totalPrice:number; status:string; createdAt:string; snapshot:{ title:string; date:string; location:string; price:number; imageUrl:string; }; }

const fmt = (p:number) => p===0?'Miễn phí':p.toLocaleString('vi-VN')+'₫';

export default function AdminBookingsPage() {
  const router = useRouter();
  const [admin, setAdmin]     = useState(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<'all'|'confirmed'|'cancelled'>('all');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/auth/me').then(r=>r.json()),
      fetch('/api/admin/bookings').then(r=>r.json()),
    ]).then(([a,b]) => { setAdmin(a.admin); setBookings(b.bookings??[]); setLoading(false); });
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/auth/me',{method:'DELETE'});
    router.push('/admin/login');
  }

  const filtered = bookings.filter(b => filter==='all' || b.status===filter);
  const revenue  = bookings.filter(b=>b.status==='confirmed').reduce((s,b)=>s+b.totalPrice,0);

  if (loading) return <AdminLoader />;

  return (
    <div style={s.page}>
      <AdminNav admin={admin} onLogout={handleLogout} />
      <div style={s.content}>
        <div style={{ marginBottom:24 }}>
          <p style={s.eyebrow}>📊 Quản lí</p>
          <h1 style={s.heading}>Đơn đặt vé ({bookings.length})</h1>
        </div>

        {/* Mini stats */}
        <div style={{ display:'flex', gap:16, marginBottom:28, flexWrap:'wrap' }}>
          {[
            { label:'Tổng đơn', value:bookings.length, color:'#3b82f6' },
            { label:'Đã xác nhận', value:bookings.filter(b=>b.status==='confirmed').length, color:'#10b981' },
            { label:'Đã huỷ', value:bookings.filter(b=>b.status==='cancelled').length, color:'#ef4444' },
            { label:'Doanh thu', value:fmt(revenue), color:'#f59e0b' },
          ].map(item => (
            <div key={item.label} style={{ background:'rgba(7,24,40,0.9)', border:`1px solid ${item.color}25`, borderRadius:16, padding:'16px 22px', backdropFilter:'blur(12px)' }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:item.color }}>{item.value}</div>
              <div style={{ fontSize:12, color:'#3d5a80', marginTop:2 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {(['all','confirmed','cancelled'] as const).map(v => (
            <button key={v} onClick={()=>setFilter(v)} style={{ padding:'7px 16px', borderRadius:999, border: filter===v?'none':'1px solid rgba(56,139,253,0.15)', background: filter===v?'linear-gradient(135deg,#2563eb,#1d4ed8)':'rgba(7,24,40,0.8)', color: filter===v?'#fff':'#a8bfe8', fontWeight: filter===v?700:500, fontSize:13, cursor:'pointer' }}>
              {{ all:'Tất cả', confirmed:'Đã xác nhận', cancelled:'Đã huỷ' }[v]}
            </button>
          ))}
        </div>

        <div style={s.tableWrap}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(56,139,253,0.1)' }}>
                {['Mã đơn','Sự kiện','Người dùng','Số vé','Tổng tiền','Trạng thái','Ngày đặt'].map(h => (
                  <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#3d5a80', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ borderBottom:'1px solid rgba(56,139,253,0.06)', opacity:b.status==='cancelled'?0.65:1 }}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(37,99,235,0.04)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#3d5a80', fontFamily:'monospace' }}>{b.id}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <img src={b.snapshot.imageUrl} alt="" style={{ width:36, height:36, objectFit:'cover', borderRadius:6, flexShrink:0 }} />
                      <span style={{ fontSize:13, fontWeight:600, color:'#e8f0fe', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.snapshot.title}</span>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#a8bfe8', fontFamily:'monospace' }}>{b.userId.slice(0,8)}...</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'#a8bfe8', textAlign:'center' }}>{b.quantity}</td>
                  <td style={{ padding:'12px 14px', fontSize:14, fontWeight:700, color: b.totalPrice===0?'#10b981':'#60a5fa' }}>{fmt(b.totalPrice)}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background: b.status==='confirmed'?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.12)', color: b.status==='confirmed'?'#10b981':'#ef4444' }}>
                      {b.status==='confirmed'?'✓ Xác nhận':'✕ Đã huỷ'}
                    </span>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#3d5a80', whiteSpace:'nowrap' }}>
                    {new Date(b.createdAt).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&(
            <div style={{ textAlign:'center', padding:'60px', color:'#3d5a80' }}>
              <p style={{ fontSize:32, marginBottom:8 }}>📋</p>
              <p>Chưa có đơn đặt vé nào</p>
            </div>
          )}
        </div>
      </div>
      <style>{`*{box-sizing:border-box;}`}</style>
    </div>
  );
}

const s: Record<string,React.CSSProperties> = {
  page: { minHeight:'100vh', background:'#020b18', fontFamily:"'DM Sans',sans-serif" },
  content: { maxWidth:1200, margin:'0 auto', padding:'40px 32px 80px' },
  eyebrow: { fontSize:12, fontWeight:700, letterSpacing:'0.12em', color:'#dc2626', textTransform:'uppercase', marginBottom:6 },
  heading: { fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#e8f0fe', letterSpacing:'-0.02em', margin:0 },
  tableWrap: { background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.12)', borderRadius:20, overflow:'auto', backdropFilter:'blur(12px)' },
};
