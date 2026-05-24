'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminNav, AdminLoader } from '../../_components';

const CATEGORIES = ['Âm nhạc','Triển lãm','Workshop','Phim','Ẩm thực','Biểu diễn','Giải trí','Sức khỏe'];

interface FormData {
  title:string; category:string; description:string; date:string;
  location:string; price:string; imageUrl:string; availableSeats:string; tags:string;
}

const empty: FormData = { title:'', category:'Âm nhạc', description:'', date:'', location:'', price:'0', imageUrl:'', availableSeats:'100', tags:'' };

export default function AdminEventFormPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isNew = params.id === 'new';

  const [admin, setAdmin] = useState(null);
  const [form, setForm]   = useState<FormData>(empty);
  const [loading, setLoading]   = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/auth/me').then(r=>r.json()).then(d=>setAdmin(d.admin));

    if (!isNew) {
      fetch(`/api/admin/events/${params.id}`).then(r=>r.json()).then(d => {
        if (d.event) {
          const ev = d.event;
          setForm({
            title: ev.title, category: ev.category, description: ev.description,
            date: ev.date.slice(0,16), location: ev.location,
            price: String(ev.price), imageUrl: ev.imageUrl,
            availableSeats: String(ev.availableSeats),
            tags: Array.isArray(ev.tags) ? ev.tags.join(', ') : ev.tags,
          });
        }
        setLoading(false);
      });
    }
  }, [isNew, params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError(''); setSuccess('');
    try {
      const url    = isNew ? '/api/admin/events' : `/api/admin/events/${params.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), availableSeats: Number(form.availableSeats) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Lưu thất bại.'); return; }
      setSuccess(isNew ? 'Tạo sự kiện thành công!' : 'Cập nhật thành công!');
      setTimeout(() => router.push('/admin/events'), 1200);
    } catch { setError('Lỗi kết nối.'); }
    finally { setSubmitting(false); }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth/me', { method:'DELETE' });
    router.push('/admin/login');
  }

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  if (loading) return <AdminLoader />;

  return (
    <div style={s.page}>
      <AdminNav admin={admin} onLogout={handleLogout} />
      <div style={s.content}>
        <div style={{ marginBottom:32 }}>
          <button onClick={() => router.back()} style={{ background:'none', border:'none', color:'#3d5a80', fontSize:14, cursor:'pointer', marginBottom:12, padding:0 }}>← Quay lại</button>
          <p style={s.eyebrow}>{isNew ? '➕ Tạo mới' : '✏️ Chỉnh sửa'}</p>
          <h1 style={s.heading}>{isNew ? 'Thêm sự kiện mới' : 'Sửa sự kiện'}</h1>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:24, alignItems:'start' }}>
          {/* Form */}
          <div style={s.card}>
            <div style={{ height:3, background:'linear-gradient(90deg,#2563eb,#06b6d4)', margin:'-1px -1px 28px' }} />

            {error   && <div style={s.errorBox}>{error}</div>}
            {success && <div style={s.successBox}>✓ {success}</div>}

            <form onSubmit={handleSubmit}>
              <div style={s.grid2}>
                <Field label="Tên sự kiện *" required>
                  <input value={form.title} onChange={set('title')} required placeholder="VD: Đêm nhạc Jazz Sài Gòn" style={inp} />
                </Field>
                <Field label="Thể loại *">
                  <select value={form.category} onChange={set('category')} style={inp}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Mô tả *" required>
                <textarea value={form.description} onChange={set('description')} required rows={4}
                  placeholder="Mô tả chi tiết về sự kiện..."
                  style={{ ...inp, resize:'vertical', minHeight:100 }} />
              </Field>

              <div style={s.grid2}>
                <Field label="Ngày & giờ *">
                  <input type="datetime-local" value={form.date} onChange={set('date')} required style={inp} />
                </Field>
                <Field label="Địa điểm *">
                  <input value={form.location} onChange={set('location')} required placeholder="VD: Opera House, Q.1" style={inp} />
                </Field>
              </div>

              <div style={s.grid2}>
                <Field label="Giá vé (₫)">
                  <input type="number" value={form.price} onChange={set('price')} min={0} placeholder="0 = Miễn phí" style={inp} />
                </Field>
                <Field label="Số chỗ">
                  <input type="number" value={form.availableSeats} onChange={set('availableSeats')} min={1} style={inp} />
                </Field>
              </div>

              <Field label="URL ảnh bìa">
                <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://images.unsplash.com/..." style={inp} />
              </Field>

              <Field label="Tags (phân cách bằng dấu phẩy)">
                <input value={form.tags} onChange={set('tags')} placeholder="VD: jazz, âm nhạc, live" style={inp} />
              </Field>

              <div style={{ marginTop:24, display:'flex', gap:12 }}>
                <button type="button" onClick={() => router.back()}
                  style={{ padding:'13px 24px', background:'transparent', border:'1px solid rgba(56,139,253,0.2)', borderRadius:14, color:'#a8bfe8', fontWeight:600, cursor:'pointer' }}>
                  Huỷ
                </button>
                <button type="submit" disabled={submitting}
                  style={{ flex:1, padding:'13px', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', border:'none', borderRadius:14, fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 0 20px rgba(37,99,235,0.3)', opacity:submitting?0.75:1 }}>
                  {submitting ? 'Đang lưu...' : isNew ? '➕ Tạo sự kiện' : '💾 Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:'#3d5a80', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>Xem trước</p>
            <div style={{ background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.15)', borderRadius:20, overflow:'hidden' }}>
              <div style={{ height:180, background:'rgba(4,17,31,0.8)', position:'relative', overflow:'hidden' }}>
                {form.imageUrl
                  ? <img src={form.imageUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>(e.currentTarget.style.display='none')} />
                  : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#2a3f58', fontSize:32 }}>🖼️</div>
                }
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(2,11,24,0.7),transparent 50%)' }} />
                <span style={{ position:'absolute', top:12, left:12, background:'#2563eb', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999 }}>{form.category}</span>
              </div>
              <div style={{ padding:'16px 18px' }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:'#e8f0fe', margin:'0 0 8px' }}>{form.title||'Tên sự kiện'}</h3>
                <p style={{ fontSize:12, color:'#3d5a80', margin:'0 0 3px' }}>📅 {form.date ? new Date(form.date).toLocaleDateString('vi-VN') : '—'}</p>
                <p style={{ fontSize:12, color:'#3d5a80', margin:'0 0 12px' }}>📍 {form.location||'Địa điểm'}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:16, fontWeight:800, color: Number(form.price)===0?'#10b981':'#60a5fa' }}>
                    {Number(form.price)===0?'Miễn phí':Number(form.price).toLocaleString('vi-VN')+'₫'}
                  </span>
                  <span style={{ fontSize:12, color:'#3d5a80' }}>{form.availableSeats} chỗ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`input::placeholder,textarea::placeholder{color:#2a3f58;} select option{background:#071828;} *{box-sizing:border-box;}`}</style>
    </div>
  );
}

function Field({ label, children, required }: { label:string; children:React.ReactNode; required?:boolean }) {
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#a8bfe8', marginBottom:7 }}>
        {label}{required&&<span style={{color:'#ef4444',marginLeft:2}}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width:'100%', padding:'12px 14px', background:'rgba(4,17,31,0.8)',
  border:'1px solid rgba(56,139,253,0.15)', borderRadius:12,
  color:'#e8f0fe', fontSize:14,
};

const s: Record<string,React.CSSProperties> = {
  page: { minHeight:'100vh', background:'#020b18', fontFamily:"'DM Sans',sans-serif" },
  content: { maxWidth:1000, margin:'0 auto', padding:'40px 32px 80px' },
  eyebrow: { fontSize:12, fontWeight:700, letterSpacing:'0.12em', color:'#dc2626', textTransform:'uppercase', marginBottom:6 },
  heading: { fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:800, color:'#e8f0fe', letterSpacing:'-0.02em', margin:0 },
  card: { background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.15)', borderRadius:20, padding:'24px', backdropFilter:'blur(12px)' },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 },
  errorBox: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', padding:'12px 16px', borderRadius:12, fontSize:14, marginBottom:20 },
  successBox: { background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', color:'#10b981', padding:'12px 16px', borderRadius:12, fontSize:14, marginBottom:20 },
};
