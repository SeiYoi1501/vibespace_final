'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav, AdminLoader } from '../page';

interface Event { id:string; title:string; category:string; date:string; location:string; price:number; availableSeats:number; imageUrl:string; }

const fmt = (p:number) => p===0 ? 'Miễn phí' : p.toLocaleString('vi-VN')+'₫';
const fmtD = (d:string) => new Date(d).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});

const CC:Record<string,string>={'Âm nhạc':'#3b82f6','Triển lãm':'#8b5cf6','Workshop':'#06b6d4','Phim':'#ec4899','Ẩm thực':'#22c55e','Biểu diễn':'#f59e0b','Giải trí':'#ef4444','Sức khỏe':'#10b981'};

export default function AdminEventsPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string|null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/auth/me').then(r=>r.json()),
      fetch('/api/admin/events').then(r=>r.json()),
    ]).then(([a,e]) => { setAdmin(a.admin); setEvents(e.events??[]); setLoading(false); });
  }, []);

  async function handleDelete(id:string, title:string) {
    if (!confirm(`Xoá sự kiện "${title}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/events/${id}`, { method:'DELETE' });
    if (res.ok) setEvents(p => p.filter(e => e.id !== id));
    else alert('Xoá thất bại.');
    setDeleting(null);
  }

  async function handleLogout() {
    await fetch('/api/admin/auth/me', { method:'DELETE' });
    router.push('/admin/login');
  }

  const filtered = events.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLoader />;

  return (
    <div style={s.page}>
      <AdminNav admin={admin} onLogout={handleLogout} />
      <div style={s.content}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <p style={s.eyebrow}>📋 Quản lí</p>
            <h1 style={s.heading}>Sự kiện ({events.length})</h1>
          </div>
          <Link href="/admin/events/new" style={{ padding:'12px 24px', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', borderRadius:14, fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:8, boxShadow:'0 0 20px rgba(37,99,235,0.3)' }}>
            ➕ Thêm sự kiện mới
          </Link>
        </div>

        {/* Search */}
        <div style={{ position:'relative', maxWidth:400, marginBottom:24 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#3d5a80', fontSize:16 }}>⌕</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm sự kiện..."
            style={{ width:'100%', padding:'11px 16px 11px 42px', background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.15)', borderRadius:12, color:'#e8f0fe', fontSize:14, boxSizing:'border-box' }} />
        </div>

        {/* Table */}
        <div style={s.tableWrap}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(56,139,253,0.1)' }}>
                {['Sự kiện','Thể loại','Ngày','Giá','Chỗ trống','Thao tác'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'#3d5a80', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev.id} style={{ borderBottom:'1px solid rgba(56,139,253,0.06)', transition:'background 0.15s' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(37,99,235,0.05)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <img src={ev.imageUrl} alt="" style={{ width:44, height:44, objectFit:'cover', borderRadius:8, flexShrink:0 }} />
                      <span style={{ fontSize:14, fontWeight:600, color:'#e8f0fe', lineHeight:1.3 }}>{ev.title}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:999, background:`${CC[ev.category]??'#3b82f6'}22`, color:CC[ev.category]??'#3b82f6' }}>{ev.category}</span>
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:13, color:'#a8bfe8', whiteSpace:'nowrap' }}>{fmtD(ev.date)}</td>
                  <td style={{ padding:'14px 16px', fontSize:14, fontWeight:700, color: ev.price===0?'#10b981':'#60a5fa' }}>{fmt(ev.price)}</td>
                  <td style={{ padding:'14px 16px', fontSize:13, color: ev.availableSeats<20?'#ef4444':'#a8bfe8' }}>{ev.availableSeats}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:8 }}>
                      <Link href={`/admin/events/${ev.id}`} style={{ padding:'6px 14px', background:'rgba(37,99,235,0.12)', border:'1px solid rgba(37,99,235,0.25)', borderRadius:8, color:'#60a5fa', fontSize:13, fontWeight:600 }}>Sửa</Link>
                      <button onClick={()=>handleDelete(ev.id, ev.title)} disabled={deleting===ev.id}
                        style={{ padding:'6px 14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, color:'#ef4444', fontSize:13, fontWeight:600, cursor:'pointer', opacity:deleting===ev.id?0.6:1 }}>
                        {deleting===ev.id?'Đang xoá...':'Xoá'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'#3d5a80' }}>
              <p style={{ fontSize:40, marginBottom:12 }}>🎭</p>
              <p>Không tìm thấy sự kiện nào</p>
            </div>
          )}
        </div>
      </div>
      <style>{`input::placeholder{color:#2a3f58;} *{box-sizing:border-box;}`}</style>
    </div>
  );
}

const s: Record<string,React.CSSProperties> = {
  page: { minHeight:'100vh', background:'#020b18', fontFamily:"'DM Sans',sans-serif" },
  content: { maxWidth:1200, margin:'0 auto', padding:'40px 32px 80px' },
  eyebrow: { fontSize:12, fontWeight:700, letterSpacing:'0.12em', color:'#dc2626', textTransform:'uppercase', marginBottom:6 },
  heading: { fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#e8f0fe', letterSpacing:'-0.02em', margin:0 },
  tableWrap: { background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.12)', borderRadius:20, overflow:'hidden', backdropFilter:'blur(12px)' },
};
