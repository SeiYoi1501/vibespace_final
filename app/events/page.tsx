'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Event { id:string; title:string; category:string; description:string; date:string; location:string; price:number; imageUrl:string; availableSeats:number; tags:string[]; }

const CC:Record<string,string>={'Âm nhạc':'#3b82f6','Triển lãm':'#8b5cf6','Workshop':'#06b6d4','Phim':'#ec4899','Ẩm thực':'#22c55e','Biểu diễn':'#f59e0b','Giải trí':'#ef4444','Sức khỏe':'#10b981'};
const cc=(c:string)=>CC[c]??'#3b82f6';
const fmt=(p:number)=>p===0?'Miễn phí':p.toLocaleString('vi-VN')+'₫';
const fmtD=(d:string)=>new Date(d).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});

export default function EventsPage() {
  const [events,setEvents]=useState<Event[]>([]);
  const [cats,setCats]=useState<string[]>([]);
  const [loading,setLoading]=useState(true);
  const [input,setInput]=useState('');
  const [query,setQuery]=useState('');
  const [cat,setCat]=useState('');

  useEffect(()=>{ fetch('/api/events/categories').then(r=>r.json()).then(d=>setCats(d.categories??[])); },[]);

  const fetch2=useCallback(async()=>{
    setLoading(true);
    const p=new URLSearchParams();
    if(query)p.set('q',query);
    if(cat)p.set('category',cat);
    const r=await fetch(`/api/events?${p}`);
    const d=await r.json();
    setEvents(d.events??[]);
    setLoading(false);
  },[query,cat]);

  useEffect(()=>{fetch2();},[fetch2]);
  useEffect(()=>{const t=setTimeout(()=>setQuery(input),350);return()=>clearTimeout(t);},[input]);

  return (
    <div style={{ minHeight:'100vh', fontFamily:"'DM Sans',sans-serif" }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(180deg,rgba(37,99,235,0.1) 0%,transparent 100%)', borderBottom:'1px solid rgba(56,139,253,0.1)', padding:'60px 40px 50px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ fontSize:12, fontWeight:700, letterSpacing:'0.12em', color:'#3b82f6', textTransform:'uppercase', marginBottom:10 }}>✦ Khám phá</p>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(32px,5vw,56px)', fontWeight:800, color:'#e8f0fe', letterSpacing:'-0.03em', marginBottom:8, lineHeight:1.1 }}>
            Tất cả sự kiện
          </h1>
          <p style={{ color:'#a8bfe8', fontSize:16, marginBottom:32 }}>{events.length} trải nghiệm đang chờ bạn</p>

          {/* Search */}
          <div style={{ position:'relative', maxWidth:540 }}>
            <span style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', fontSize:20, color:'#3d5a80', pointerEvents:'none' }}>⌕</span>
            <input value={input} onChange={e=>setInput(e.target.value)}
              placeholder="Tìm kiếm sự kiện, địa điểm, nghệ sĩ..."
              style={{ width:'100%', padding:'15px 44px 15px 50px', background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.2)', borderRadius:14, color:'#e8f0fe', fontSize:15, backdropFilter:'blur(12px)' }}
              onFocus={e=>{e.target.style.borderColor='rgba(59,130,246,0.5)';e.target.style.boxShadow='0 0 20px rgba(37,99,235,0.15)';}}
              onBlur={e=>{e.target.style.borderColor='rgba(56,139,253,0.2)';e.target.style.boxShadow='none';}}
            />
            {input&&<button onClick={()=>{setInput('');setQuery('');}} style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#3d5a80',cursor:'pointer',fontSize:16 }}>✕</button>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'36px 40px 80px' }}>
        {/* Pills */}
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4, marginBottom:28, scrollbarWidth:'none' }}>
          <button onClick={()=>setCat('')} style={{ padding:'7px 18px', borderRadius:999, whiteSpace:'nowrap', flexShrink:0, border: cat==='' ? 'none' : '1px solid rgba(56,139,253,0.2)', background: cat==='' ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'rgba(7,24,40,0.8)', color: cat==='' ? '#fff' : '#a8bfe8', fontWeight: cat==='' ? 700 : 500, fontSize:13, cursor:'pointer', boxShadow: cat==='' ? '0 0 16px rgba(37,99,235,0.3)' : 'none', transition:'all 0.18s' }}>Tất cả</button>
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(cat===c?'':c)} style={{ padding:'7px 18px', borderRadius:999, whiteSpace:'nowrap', flexShrink:0, border: cat===c ? 'none' : '1px solid rgba(56,139,253,0.2)', background: cat===c ? cc(c) : 'rgba(7,24,40,0.8)', color: cat===c ? '#fff' : '#a8bfe8', fontWeight: cat===c ? 700 : 500, fontSize:13, cursor:'pointer', boxShadow: cat===c ? `0 0 16px ${cc(c)}55` : 'none', transition:'all 0.18s' }}>{c}</button>
          ))}
        </div>

        {!loading && <p style={{ color:'#3d5a80', fontSize:13, marginBottom:24 }}>{query||cat?`Tìm thấy ${events.length} kết quả`:`${events.length} sự kiện`}</p>}

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(56,139,253,0.1)', background:'rgba(7,24,40,0.6)' }}>
                <div className="skeleton" style={{height:200}}/>
                <div style={{padding:20}}><div className="skeleton" style={{height:14,width:'40%',marginBottom:12}}/><div className="skeleton" style={{height:20,width:'80%',marginBottom:8}}/><div className="skeleton" style={{height:14,width:'60%'}}/></div>
              </div>
            ))}
          </div>
        ) : events.length===0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px' }}>
            <p style={{fontSize:48,marginBottom:12}}>🎭</p>
            <p style={{fontWeight:700,fontSize:18,color:'#e8f0fe'}}>Không tìm thấy sự kiện</p>
            <button onClick={()=>{setInput('');setQuery('');setCat('');}} style={{ marginTop:16,padding:'10px 24px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'#fff',border:'none',borderRadius:999,fontWeight:700,cursor:'pointer' }}>Xem tất cả</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
            {events.map(ev=><ECard key={ev.id} ev={ev}/>)}
          </div>
        )}
      </div>
      <style>{`input::placeholder{color:#3d5a80;} ::-webkit-scrollbar{display:none;}`}</style>
    </div>
  );
}

function ECard({ev}:{ev:Event}) {
  const [h,setH]=useState(false);
  const color=cc(ev.category);
  return (
    <Link href={`/events/${ev.id}`} style={{textDecoration:'none'}}>
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{ borderRadius:20, overflow:'hidden', background:'rgba(7,24,40,0.9)', border: h?'1px solid rgba(59,130,246,0.45)':'1px solid rgba(56,139,253,0.12)', boxShadow: h?'0 0 32px rgba(37,99,235,0.2)':'0 2px 16px rgba(0,0,0,0.3)', transform: h?'translateY(-5px)':'translateY(0)', transition:'all 0.22s ease', cursor:'pointer' }}>
        <div style={{position:'relative',height:200,overflow:'hidden'}}>
          <img src={ev.imageUrl} alt={ev.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transform:h?'scale(1.06)':'scale(1)',transition:'transform 0.4s ease'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(2,11,24,0.6) 0%,transparent 50%)'}}/>
          <span style={{position:'absolute',top:12,left:12,background:color,color:'#fff',fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:999,letterSpacing:'0.04em'}}>{ev.category}</span>
          {ev.price===0&&<span style={{position:'absolute',top:12,right:12,background:'#10b981',color:'#fff',fontSize:11,fontWeight:800,padding:'3px 10px',borderRadius:999}}>FREE</span>}
        </div>
        <div style={{padding:'18px 20px 20px'}}>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,color:'#e8f0fe',margin:'0 0 10px',letterSpacing:'-0.01em',lineHeight:1.3}}>{ev.title}</h3>
          <p style={{fontSize:12,color:'#3d5a80',margin:'0 0 3px'}}>📅 {fmtD(ev.date)}</p>
          <p style={{fontSize:12,color:'#3d5a80',margin:'0 0 12px'}}>📍 {ev.location}</p>
          <p style={{fontSize:13,color:'#a8bfe8',lineHeight:1.55,margin:'0 0 14px'}}>{ev.description.slice(0,85)}…</p>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:17,fontWeight:800,color:ev.price===0?'#10b981':'#60a5fa',fontFamily:"'Syne',sans-serif"}}>{fmt(ev.price)}</span>
            <span style={{fontSize:12,color:ev.availableSeats<30?'#ef4444':'#3d5a80',fontWeight:600}}>{ev.availableSeats<30?`⚡ Còn ${ev.availableSeats}`:`${ev.availableSeats} chỗ`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
