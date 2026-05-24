'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNav, AdminLoader } from '../page';

interface User { id:string; fullName:string; email:string; createdAt:string; }

export default function AdminUsersPage() {
  const router = useRouter();
  const [admin, setAdmin]   = useState(null);
  const [users, setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/auth/me').then(r=>r.json()),
      fetch('/api/admin/users').then(r=>r.json()),
    ]).then(([a,u]) => { setAdmin(a.admin); setUsers(u.users??[]); setLoading(false); });
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/auth/me',{method:'DELETE'});
    router.push('/admin/login');
  }

  const filtered = users.filter(u =>
    !search || u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLoader />;

  return (
    <div style={s.page}>
      <AdminNav admin={admin} onLogout={handleLogout} />
      <div style={s.content}>
        <div style={{ marginBottom:32 }}>
          <p style={s.eyebrow}>👥 Quản lí</p>
          <h1 style={s.heading}>Người dùng ({users.length})</h1>
        </div>

        <div style={{ position:'relative', maxWidth:400, marginBottom:24 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#3d5a80' }}>⌕</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm theo tên hoặc email..."
            style={{ width:'100%', padding:'11px 16px 11px 40px', background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.15)', borderRadius:12, color:'#e8f0fe', fontSize:14, boxSizing:'border-box' }} />
        </div>

        <div style={s.tableWrap}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(56,139,253,0.1)' }}>
                {['#','Họ tên','Email','Ngày đăng ký'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'#3d5a80', letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u,i) => (
                <tr key={u.id} style={{ borderBottom:'1px solid rgba(56,139,253,0.06)' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(37,99,235,0.05)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td style={{ padding:'14px 16px', fontSize:13, color:'#3d5a80' }}>{i+1}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:36, height:36, background:'linear-gradient(135deg,#2563eb,#06b6d4)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', flexShrink:0 }}>
                        {u.fullName?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize:14, fontWeight:600, color:'#e8f0fe' }}>{u.fullName}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:13, color:'#a8bfe8' }}>{u.email}</td>
                  <td style={{ padding:'14px 16px', fontSize:13, color:'#3d5a80' }}>
                    {new Date(u.createdAt).toLocaleDateString('vi-VN',{day:'2-digit',month:'long',year:'numeric'})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div style={{ textAlign:'center', padding:'60px', color:'#3d5a80' }}>
              <p style={{ fontSize:32, marginBottom:8 }}>👤</p>
              <p>Chưa có người dùng nào{search?` khớp "${search}"`:''}</p>
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
  content: { maxWidth:1000, margin:'0 auto', padding:'40px 32px 80px' },
  eyebrow: { fontSize:12, fontWeight:700, letterSpacing:'0.12em', color:'#dc2626', textTransform:'uppercase', marginBottom:6 },
  heading: { fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#e8f0fe', letterSpacing:'-0.02em', margin:0 },
  tableWrap: { background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.12)', borderRadius:20, overflow:'hidden', backdropFilter:'blur(12px)' },
};
