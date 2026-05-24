'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Event {
  id: string; title: string; category: string; description: string;
  date: string; location: string; price: number; imageUrl: string;
  availableSeats: number; tags: string[];
}

const CAT_COLORS: Record<string, string> = {
  'Âm nhạc':'#3b82f6','Triển lãm':'#8b5cf6','Workshop':'#06b6d4',
  'Phim':'#ec4899','Ẩm thực':'#22c55e','Biểu diễn':'#f59e0b',
  'Giải trí':'#ef4444','Sức khỏe':'#10b981',
};
const catColor = (c: string) => CAT_COLORS[c] ?? '#3b82f6';

function fmt(p: number) { return p === 0 ? 'Miễn phí' : p.toLocaleString('vi-VN') + '₫'; }
function fmtD(d: string) {
  return new Date(d).toLocaleDateString('vi-VN',{ day:'2-digit', month:'long', year:'numeric' });
}

const CATEGORIES = ['Tất cả','Âm nhạc','Triển lãm','Workshop','Phim','Ẩm thực','Biểu diễn','Giải trí','Sức khỏe'];

export default function HomePage() {
  const [events, setEvents]     = useState<Event[]>([]);
  const [loading, setLoading]   = useState(true);
  const [cat, setCat]           = useState('Tất cả');
  const [query, setQuery]       = useState('');
  const [input, setInput]       = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (cat !== 'Tất cả') p.set('category', cat);
    const r = await fetch(`/api/events?${p}`);
    const d = await r.json();
    setEvents(d.events ?? []);
    setLoading(false);
  }, [query, cat]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  useEffect(() => { const t = setTimeout(() => setQuery(input), 350); return () => clearTimeout(t); }, [input]);

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(60px,10vw,120px) 40px clamp(80px,12vw,140px)',
        textAlign: 'center',
      }}>
        {/* grid lines bg */}
        <div style={{
          position:'absolute', inset:0, zIndex:0,
          backgroundImage:`
            linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)`,
          backgroundSize:'60px 60px',
        }} />
        {/* glow orbs */}
        <div style={{ position:'absolute', top:'20%', left:'20%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', filter:'blur(40px)', zIndex:0 }} />
        <div style={{ position:'absolute', bottom:'10%', right:'15%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter:'blur(40px)', zIndex:0 }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:800, margin:'0 auto' }}>
          <div className="anim-up" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(37,99,235,0.15)', border:'1px solid rgba(59,130,246,0.3)',
            borderRadius:999, padding:'6px 16px', marginBottom:28,
          }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#3b82f6', display:'inline-block', animation:'glow-pulse 2s infinite' }} />
            <span style={{ fontSize:13, color:'#60a5fa', fontWeight:600, letterSpacing:'0.06em' }}>NỀN TẢNG SỰ KIỆN #1 VIỆT NAM</span>
          </div>

          <h1 className="anim-up-2" style={{
            fontFamily:"'Syne', sans-serif", fontSize:'clamp(38px,7vw,84px)',
            fontWeight:800, lineHeight:1.05, letterSpacing:'-0.03em',
            color:'#e8f0fe', marginBottom:20,
          }}>
            Trải Nghiệm<br />
            <span style={{ background:'linear-gradient(135deg,#3b82f6,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Không Giới Hạn
            </span>
          </h1>

          <p className="anim-up-3" style={{ fontSize:17, color:'#a8bfe8', lineHeight:1.7, maxWidth:560, margin:'0 auto 36px' }}>
            Khám phá hàng trăm sự kiện âm nhạc, triển lãm, workshop và lễ hội đặc sắc nhất Việt Nam. Đặt vé ngay hôm nay.
          </p>

          {/* Search */}
          <div className="anim-up-4" style={{ position:'relative', maxWidth:500, margin:'0 auto 16px' }}>
            <span style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', fontSize:18, color:'#3d5a80', pointerEvents:'none' }}>⌕</span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Tìm kiếm sự kiện, nghệ sĩ, địa điểm..."
              style={{
                width:'100%', padding:'16px 48px 16px 50px',
                background:'rgba(7,24,40,0.9)', border:'1px solid rgba(56,139,253,0.25)',
                borderRadius:14, color:'#e8f0fe', fontSize:15,
                backdropFilter:'blur(12px)',
                boxShadow:'0 0 0 0 transparent',
                transition:'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor='rgba(59,130,246,0.6)'; e.target.style.boxShadow='0 0 24px rgba(37,99,235,0.2)'; }}
              onBlur={e =>  { e.target.style.borderColor='rgba(56,139,253,0.25)'; e.target.style.boxShadow='none'; }}
            />
            {input && (
              <button onClick={() => { setInput(''); setQuery(''); }}
                style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#3d5a80', fontSize:16, cursor:'pointer' }}>✕</button>
            )}
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
            <Link href="/events" style={{
              padding:'12px 28px', background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
              color:'#fff', borderRadius:12, fontWeight:700, fontSize:15,
              boxShadow:'0 0 24px rgba(37,99,235,0.4)', transition:'all 0.2s',
            }}>Khám phá ngay →</Link>
            <Link href="/register" style={{
              padding:'12px 28px', background:'rgba(37,99,235,0.1)',
              border:'1px solid rgba(59,130,246,0.3)',
              color:'#60a5fa', borderRadius:12, fontWeight:600, fontSize:15,
            }}>Đăng ký miễn phí</Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{
        display:'flex', justifyContent:'center', gap:0,
        borderTop:'1px solid rgba(56,139,253,0.1)',
        borderBottom:'1px solid rgba(56,139,253,0.1)',
        background:'rgba(7,24,40,0.5)',
        backdropFilter:'blur(8px)',
      }}>
        {[['15+','Sự kiện'],['8','Thể loại'],['2K+','Người dùng'],['5','Thành phố']].map(([n, l], i) => (
          <div key={i} style={{
            flex:1, maxWidth:180, padding:'20px 16px', textAlign:'center',
            borderRight: i < 3 ? '1px solid rgba(56,139,253,0.1)' : 'none',
          }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:'#3b82f6' }}>{n}</div>
            <div style={{ fontSize:12, color:'#3d5a80', marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── EVENTS SECTION ── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'60px 32px 80px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:'0.12em', color:'#3b82f6', textTransform:'uppercase', marginBottom:6 }}>✦ Sự kiện nổi bật</p>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#e8f0fe', letterSpacing:'-0.02em' }}>
              Đang diễn ra & sắp tới
            </h2>
          </div>
          <Link href="/events" style={{ fontSize:14, color:'#3b82f6', fontWeight:600 }}>Xem tất cả →</Link>
        </div>

        {/* Category filter */}
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4, marginBottom:32, scrollbarWidth:'none' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding:'8px 18px', borderRadius:999, whiteSpace:'nowrap', flexShrink:0,
              border: cat===c ? 'none' : '1px solid rgba(56,139,253,0.2)',
              background: cat===c ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'rgba(7,24,40,0.8)',
              color: cat===c ? '#fff' : '#a8bfe8',
              fontWeight: cat===c ? 700 : 500, fontSize:13, cursor:'pointer',
              boxShadow: cat===c ? '0 0 16px rgba(37,99,235,0.35)' : 'none',
              transition:'all 0.18s',
            }}>{c}</button>
          ))}
        </div>

        {/* Count */}
        {!loading && (
          <p style={{ color:'#3d5a80', fontSize:13, marginBottom:24 }}>
            {events.length} sự kiện {cat !== 'Tất cả' ? `trong "${cat}"` : ''}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
            {Array.from({length:6}).map((_,i) => (
              <div key={i} style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(56,139,253,0.1)', background:'rgba(7,24,40,0.6)' }}>
                <div className="skeleton" style={{ height:200 }} />
                <div style={{ padding:20 }}>
                  <div className="skeleton" style={{ height:14, width:'40%', marginBottom:12 }} />
                  <div className="skeleton" style={{ height:20, width:'80%', marginBottom:8 }} />
                  <div className="skeleton" style={{ height:14, width:'60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px' }}>
            <p style={{ fontSize:48, marginBottom:12 }}>🎭</p>
            <p style={{ fontWeight:700, fontSize:18, color:'#e8f0fe' }}>Không tìm thấy sự kiện</p>
            <button onClick={() => { setInput(''); setQuery(''); setCat('Tất cả'); }}
              style={{ marginTop:16, padding:'10px 24px', background:'#2563eb', color:'#fff', border:'none', borderRadius:999, fontWeight:700, cursor:'pointer' }}>
              Xem tất cả
            </button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
            {events.map(ev => <EventCard key={ev.id} event={ev} />)}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin:'0 32px 80px', borderRadius:24,
        background:'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(6,182,212,0.15) 100%)',
        border:'1px solid rgba(59,130,246,0.25)',
        padding:'60px 40px', textAlign:'center',
        backdropFilter:'blur(12px)',
      }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, color:'#e8f0fe', letterSpacing:'-0.02em', marginBottom:12 }}>
          Sẵn sàng khám phá?
        </h2>
        <p style={{ color:'#a8bfe8', fontSize:16, marginBottom:28 }}>Đăng ký miễn phí và đặt vé sự kiện đầu tiên của bạn ngay hôm nay.</p>
        <Link href="/register" style={{
          padding:'14px 36px', background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
          color:'#fff', borderRadius:14, fontWeight:700, fontSize:16,
          boxShadow:'0 0 32px rgba(37,99,235,0.45)', display:'inline-block',
        }}>Đăng ký ngay — Miễn phí</Link>
      </section>

      <style>{`
        @keyframes glow-pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
        input::placeholder { color: #3d5a80; }
        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const [hov, setHov] = useState(false);
  const color = catColor(event.category);
  return (
    <Link href={`/events/${event.id}`} style={{ textDecoration:'none' }}>
      <div
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          borderRadius:20, overflow:'hidden',
          background:'rgba(7,24,40,0.9)',
          border: hov ? '1px solid rgba(59,130,246,0.45)' : '1px solid rgba(56,139,253,0.12)',
          boxShadow: hov ? '0 0 32px rgba(37,99,235,0.2)' : '0 2px 16px rgba(0,0,0,0.3)',
          transform: hov ? 'translateY(-5px)' : 'translateY(0)',
          transition:'all 0.22s ease',
          cursor:'pointer',
        }}>
        {/* Image */}
        <div style={{ position:'relative', height:200, overflow:'hidden' }}>
          <img src={event.imageUrl} alt={event.title}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transform: hov ? 'scale(1.06)' : 'scale(1)', transition:'transform 0.4s ease' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(2,11,24,0.6) 0%, transparent 50%)' }} />
          <span style={{ position:'absolute', top:12, left:12, background:color, color:'#fff', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, letterSpacing:'0.04em' }}>{event.category}</span>
          {event.price===0 && <span style={{ position:'absolute', top:12, right:12, background:'#10b981', color:'#fff', fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:999 }}>FREE</span>}
        </div>
        {/* Body */}
        <div style={{ padding:'18px 20px 20px' }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color:'#e8f0fe', margin:'0 0 10px', letterSpacing:'-0.01em', lineHeight:1.3 }}>{event.title}</h3>
          <p style={{ fontSize:12, color:'#3d5a80', margin:'0 0 4px' }}>📅 {fmtD(event.date)}</p>
          <p style={{ fontSize:12, color:'#3d5a80', margin:'0 0 14px' }}>📍 {event.location}</p>
          <p style={{ fontSize:13, color:'#a8bfe8', lineHeight:1.55, margin:'0 0 14px' }}>{event.description.slice(0,85)}…</p>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:17, fontWeight:800, color: event.price===0 ? '#10b981' : '#60a5fa', fontFamily:"'Syne',sans-serif" }}>{fmt(event.price)}</span>
            <span style={{ fontSize:12, color: event.availableSeats < 30 ? '#ef4444' : '#3d5a80', fontWeight:600 }}>
              {event.availableSeats < 30 ? `⚡ Còn ${event.availableSeats}` : `${event.availableSeats} chỗ`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
