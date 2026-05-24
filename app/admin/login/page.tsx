'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Đăng nhập thất bại.'); return; }
      router.push('/admin');
      router.refresh();
    } catch { setError('Lỗi kết nối.'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#020b18', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif",
      backgroundImage:'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.15) 0%, transparent 60%)' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, background:'linear-gradient(135deg,#dc2626,#991b1b)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 14px', boxShadow:'0 0 24px rgba(220,38,38,0.4)' }}>⚙️</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:'#e8f0fe', letterSpacing:'-0.02em', margin:'0 0 4px' }}>Admin Portal</h1>
          <p style={{ color:'#3d5a80', fontSize:14 }}>VibeSpace — Quản trị hệ thống</p>
        </div>

        <div style={{ background:'rgba(7,24,40,0.95)', border:'1px solid rgba(220,38,38,0.25)', borderRadius:24, overflow:'hidden', boxShadow:'0 0 60px rgba(220,38,38,0.08)', backdropFilter:'blur(16px)' }}>
          <div style={{ height:3, background:'linear-gradient(90deg,#dc2626,#f97316)' }}/>
          <div style={{ padding:'32px' }}>
            {error && (
              <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', padding:'12px 16px', borderRadius:12, fontSize:14, fontWeight:600, marginBottom:20 }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {[
                { label:'Email Admin', name:'email', type:'email', ph:'admin@vibespace.vn' },
                { label:'Mật khẩu', name:'password', type:'password', ph:'Nhập mật khẩu' },
              ].map(f => (
                <div key={f.name} style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#a8bfe8', marginBottom:7 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph}
                    value={form[f.name as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    required
                    style={{ width:'100%', padding:'13px 16px', background:'rgba(4,17,31,0.8)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:12, color:'#e8f0fe', fontSize:14, boxSizing:'border-box' }}
                    onFocus={e => { e.target.style.borderColor='rgba(220,38,38,0.5)'; e.target.style.boxShadow='0 0 16px rgba(220,38,38,0.12)'; }}
                    onBlur={e =>  { e.target.style.borderColor='rgba(220,38,38,0.2)'; e.target.style.boxShadow='none'; }}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#dc2626,#b91c1c)', color:'#fff', border:'none', borderRadius:14, fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 0 24px rgba(220,38,38,0.3)', opacity:loading?0.75:1, marginTop:4 }}>
                {loading ? 'Đang đăng nhập...' : '🔐 Đăng nhập Admin'}
              </button>
            </form>
          </div>
        </div>

        <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'#2a3f58' }}>
          Chưa có tài khoản admin? Xem hướng dẫn setup bên dưới ↓
        </p>
        <div style={{ background:'rgba(7,24,40,0.6)', border:'1px solid rgba(56,139,253,0.1)', borderRadius:14, padding:'16px 20px', marginTop:12 }}>
          <p style={{ fontSize:12, color:'#3d5a80', margin:'0 0 8px', fontWeight:700 }}>📋 Tạo tài khoản admin lần đầu:</p>
          <p style={{ fontSize:12, color:'#2a3f58', fontFamily:'monospace', margin:0, lineHeight:1.8 }}>
            POST /api/admin/auth/register<br/>
            {'{ "fullName":"Admin", "email":"...", "password":"...", "setupKey":"vibespace-admin-setup-2026" }'}
          </p>
        </div>
      </div>
      <style>{`input::placeholder{color:#2a3f58;} *{box-sizing:border-box;}`}</style>
    </div>
  );
}
