'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User { id:string; fullName:string; email:string; createdAt:string; }
interface Booking { id:string; quantity:number; totalPrice:number; status:'confirmed'|'cancelled'; createdAt:string; snapshot:{ title:string; date:string; location:string; price:number; imageUrl:string; category:string; }; }

const fmt=(p:number)=>p===0?'Miễn phí':p.toLocaleString('vi-VN')+'₫';
const fmtD=(d:string)=>new Date(d).toLocaleDateString('vi-VN',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});

export default function ProfilePage() {
  const router=useRouter();
  const [user,setUser]=useState<User|null>(null);
  const [bookings,setBookings]=useState<Booking[]>([]);
  const [loading,setLoading]=useState(true);
  const [cancelling,setCancelling]=useState<string|null>(null);
  const [tab,setTab]=useState<'all'|'confirmed'|'cancelled'>('all');

  useEffect(()=>{
    Promise.all([fetch('/api/auth/me').then(r=>r.json()), fetch('/api/bookings').then(r=>r.json())])
      .then(([u,b])=>{ if(u.user)setUser(u.user); if(b.bookings)setBookings(b.bookings); setLoading(false); })
      .catch(()=>setLoading(false));
  },[]);

  async function handleLogout() {
    await fetch('/api/auth/logout',{method:'POST'});
    router.push('/login'); router.refresh();
  }

  async function handleCancel(id:string) {
    if(!confirm('Bạn có chắc muốn huỷ đơn này không?')) return;
    setCancelling(id);
    const res=await fetch(`/api/bookings/${id}`,{method:'DELETE'});
    const data=await res.json();
    if(res.ok) setBookings(p=>p.map(b=>b.id===id?{...b,status:'cancelled' as const}:b));
    else alert(data.error??'Huỷ thất bại.');
    setCancelling(null);
  }

  const filtered=bookings.filter(b=>tab==='all'||b.status===tab);
  const confirmed=bookings.filter(b=>b.status==='confirmed');
  const spent=confirmed.reduce((s,b)=>s+b.totalPrice,0);

  if(loading) return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
      <div style={{width:40,height:40,border:'3px solid rgba(37,99,235,0.3)',borderTopColor:'#3b82f6',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
      <p style={{color:'#a8bfe8'}}>Đang tải...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}>
      <div style={{maxWidth:900,margin:'0 auto',padding:'40px 24px'}}>

        {/* Header card */}
        <div style={{background:'rgba(7,24,40,0.95)',border:'1px solid rgba(56,139,253,0.2)',borderRadius:24,padding:'28px 32px',marginBottom:24,backdropFilter:'blur(16px)',boxShadow:'0 0 40px rgba(37,99,235,0.08)',display:'flex',alignItems:'center',gap:20,flexWrap:'wrap',overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#2563eb,#06b6d4)'}}/>
          <div style={{width:72,height:72,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:900,color:'#fff',flexShrink:0,boxShadow:'0 0 24px rgba(37,99,235,0.4)'}}>
            {user?.fullName?.[0]?.toUpperCase()??'?'}
          </div>
          <div style={{flex:1}}>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:'#e8f0fe',margin:'0 0 4px',letterSpacing:'-0.02em'}}>{user?.fullName??'—'}</h1>
            <p style={{fontSize:14,color:'#3d5a80',margin:'0 0 2px'}}>{user?.email}</p>
            <p style={{fontSize:12,color:'#2a3f58'}}>Thành viên từ {user?fmtD(user.createdAt):'—'}</p>
          </div>
          <button onClick={handleLogout} style={{padding:'10px 20px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:12,color:'#ef4444',fontWeight:600,fontSize:14,cursor:'pointer',transition:'all 0.18s'}}>
            Đăng xuất
          </button>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
          {[['🎟️','Đơn đã đặt',confirmed.length],['💳','Tổng chi tiêu',fmt(spent)],['❤️','Yêu thích','—']].map(([ic,l,v])=>(
            <div key={String(l)} style={{background:'rgba(7,24,40,0.95)',border:'1px solid rgba(56,139,253,0.15)',borderRadius:18,padding:'20px 22px',backdropFilter:'blur(12px)'}}>
              <span style={{fontSize:24,display:'block',marginBottom:6}}>{ic}</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:'#60a5fa',display:'block'}}>{v}</span>
              <span style={{fontSize:12,color:'#3d5a80'}}>{l}</span>
            </div>
          ))}
        </div>

        {/* Booking history */}
        <div style={{background:'rgba(7,24,40,0.95)',border:'1px solid rgba(56,139,253,0.15)',borderRadius:24,padding:'28px 32px',backdropFilter:'blur(16px)',overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#2563eb,#06b6d4)'}}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:'#e8f0fe',letterSpacing:'-0.01em'}}>Lịch sử đặt vé</h2>
            <Link href="/events" style={{fontSize:14,color:'#3b82f6',fontWeight:700}}>+ Khám phá sự kiện</Link>
          </div>

          {/* Tabs */}
          <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
            {([['all','Tất cả'],['confirmed','Đã xác nhận'],['cancelled','Đã huỷ']] as const).map(([v,l])=>(
              <button key={v} onClick={()=>setTab(v)} style={{padding:'7px 16px',borderRadius:999,border: tab===v?'none':'1px solid rgba(56,139,253,0.15)', background: tab===v?'linear-gradient(135deg,#2563eb,#1d4ed8)':'rgba(4,17,31,0.8)', color: tab===v?'#fff':'#a8bfe8', fontWeight: tab===v?700:500, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6, boxShadow: tab===v?'0 0 16px rgba(37,99,235,0.3)':'none' }}>
                {l}
                <span style={{background:'rgba(255,255,255,0.15)',borderRadius:999,padding:'0 7px',fontSize:11,fontWeight:700}}>
                  {v==='all'?bookings.length:bookings.filter(b=>b.status===v).length}
                </span>
              </button>
            ))}
          </div>

          {filtered.length===0 ? (
            <div style={{textAlign:'center',padding:'60px 20px'}}>
              <p style={{fontSize:40,marginBottom:10}}>🎭</p>
              <p style={{fontWeight:700,fontSize:16,color:'#e8f0fe',marginBottom:16}}>Chưa có đơn đặt vé nào</p>
              <Link href="/events" style={{padding:'10px 24px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'#fff',borderRadius:999,fontWeight:700,fontSize:14,display:'inline-block',boxShadow:'0 0 16px rgba(37,99,235,0.3)'}}>Khám phá sự kiện ngay</Link>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {filtered.map(b=>(
                <div key={b.id} style={{display:'flex',gap:0,border:'1px solid rgba(56,139,253,0.12)',borderRadius:16,overflow:'hidden',opacity:b.status==='cancelled'?0.65:1,background:'rgba(4,17,31,0.5)',transition:'border-color 0.2s'}}>
                  <img src={b.snapshot.imageUrl} alt="" style={{width:110,height:100,objectFit:'cover',flexShrink:0}}/>
                  <div style={{flex:1,padding:'14px 16px 14px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,flexWrap:'wrap',gap:6}}>
                      <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:999,background: b.status==='cancelled'?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.1)',color: b.status==='cancelled'?'#ef4444':'#10b981',letterSpacing:'0.04em'}}>
                        {b.status==='cancelled'?'✕ Đã huỷ':'✓ Xác nhận'}
                      </span>
                      <span style={{fontSize:11,color:'#2a3f58',fontFamily:'monospace'}}>{b.id}</span>
                    </div>
                    <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:'#e8f0fe',margin:'0 0 4px',letterSpacing:'-0.01em'}}>{b.snapshot.title}</h3>
                    <p style={{fontSize:12,color:'#3d5a80',margin:'0 0 2px'}}>📅 {fmtD(b.snapshot.date)}</p>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                      <div>
                        <span style={{fontSize:12,color:'#3d5a80',marginRight:8}}>{b.quantity} vé</span>
                        <span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:'#60a5fa'}}>{fmt(b.totalPrice)}</span>
                      </div>
                      {b.status==='confirmed'&&new Date(b.snapshot.date)>new Date()&&(
                        <button onClick={()=>handleCancel(b.id)} disabled={cancelling===b.id} style={{padding:'5px 12px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,color:'#ef4444',fontSize:12,fontWeight:700,cursor:'pointer'}}>
                          {cancelling===b.id?'Đang huỷ...':'Huỷ vé'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
