'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event { id:string; title:string; category:string; description:string; date:string; location:string; price:number; imageUrl:string; availableSeats:number; tags:string[]; }
interface Booking { id:string; quantity:number; totalPrice:number; status:string; createdAt:string; snapshot:{ title:string; date:string; location:string; price:number; imageUrl:string; category:string; }; }

const fmt=(p:number)=>p===0?'Miễn phí':p.toLocaleString('vi-VN')+'₫';
const fmtD=(d:string)=>new Date(d).toLocaleDateString('vi-VN',{weekday:'long',day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});
const STEPS=['Chi tiết','Chọn vé','Xác nhận','Hoàn tất'];

export default function EventDetailPage() {
  const {id}=useParams<{id:string}>();
  const router=useRouter();
  const [event,setEvent]=useState<Event|null>(null);
  const [loading,setLoading]=useState(true);
  const [step,setStep]=useState(0);
  const [qty,setQty]=useState(1);
  const [booking,setBooking]=useState<Booking|null>(null);
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState('');

  useEffect(()=>{ fetch(`/api/events/${id}`).then(r=>r.json()).then(d=>{setEvent(d.event??null);setLoading(false);}).catch(()=>setLoading(false)); },[id]);

  async function handleBook() {
    setSubmitting(true); setError('');
    try {
      const res=await fetch('/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({eventId:id,quantity:qty})});
      const data=await res.json();
      if(res.status===401){router.push(`/login?redirect=/events/${id}`);return;}
      if(!res.ok){setError(data.error??'Đặt vé thất bại.');return;}
      setBooking(data.booking); setStep(3);
    } catch{setError('Lỗi kết nối.');}
    finally{setSubmitting(false);}
  }

  if(loading) return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
      <div style={{width:40,height:40,border:'3px solid rgba(37,99,235,0.3)',borderTopColor:'#3b82f6',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
      <p style={{color:'#a8bfe8'}}>Đang tải...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
  if(!event) return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
      <p style={{fontSize:48}}>🎭</p>
      <p style={{fontSize:20,fontWeight:700,color:'#e8f0fe'}}>Không tìm thấy sự kiện</p>
      <Link href="/events" style={{color:'#3b82f6',fontWeight:600}}>← Quay lại danh sách</Link>
    </div>
  );

  const total=event.price*qty;
  const soldOut=event.availableSeats===0;

  return (
    <div style={{minHeight:'100vh',fontFamily:"'DM Sans',sans-serif"}}>
      {/* Top bar */}
      <div style={{background:'rgba(4,17,31,0.95)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(56,139,253,0.1)',padding:'14px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <Link href="/events" style={{color:'#a8bfe8',fontSize:14,fontWeight:600}}>← Tất cả sự kiện</Link>
        {/* Step bar */}
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          {STEPS.map((l,i)=>(
            <React.Fragment key={l}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <div style={{width:24,height:24,borderRadius:'50%',background:i<=step?'linear-gradient(135deg,#2563eb,#1d4ed8)':'rgba(7,24,40,0.8)',border:i<=step?'none':'1px solid rgba(56,139,253,0.2)',color:i<=step?'#fff':'#3d5a80',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>
                  {i<step?'✓':i+1}
                </div>
                <span style={{fontSize:12,color:i<=step?'#60a5fa':'#3d5a80',fontWeight:i===step?700:400}}>{l}</span>
              </div>
              {i<STEPS.length-1&&<div style={{width:32,height:1,background:i<step?'#2563eb':'rgba(56,139,253,0.15)'}}/>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {step<3 ? (
        <div style={{display:'grid',gridTemplateColumns:'1fr 400px',gap:32,maxWidth:1100,margin:'0 auto',padding:'40px 32px',alignItems:'start'}}>
          {/* Left */}
          <div>
            <div style={{position:'relative',borderRadius:20,overflow:'hidden',height:380}}>
              <img src={event.imageUrl} alt={event.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(2,11,24,0.7) 0%,transparent 50%)'}}/>
              <span style={{position:'absolute',top:16,left:16,background:'#2563eb',color:'#fff',fontSize:12,fontWeight:700,padding:'5px 14px',borderRadius:999}}>{event.category}</span>
              {event.price===0&&<span style={{position:'absolute',top:16,right:16,background:'#10b981',color:'#fff',fontSize:11,fontWeight:800,padding:'5px 12px',borderRadius:999}}>MIỄN PHÍ</span>}
            </div>
            <div style={{paddingTop:28}}>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(24px,3vw,36px)',fontWeight:800,color:'#e8f0fe',margin:'0 0 20px',letterSpacing:'-0.02em',lineHeight:1.15}}>{event.title}</h1>
              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
                {[['📅',fmtD(event.date)],['📍',event.location],['🪑',`${event.availableSeats} chỗ còn trống`]].map(([ic,tx])=>(
                  <div key={tx} style={{display:'flex',alignItems:'flex-start',gap:10}}>
                    <span style={{fontSize:16,flexShrink:0}}>{ic}</span>
                    <span style={{fontSize:14,color:'#a8bfe8'}}>{tx}</span>
                  </div>
                ))}
              </div>
              <p style={{fontSize:15,color:'#a8bfe8',lineHeight:1.75,marginBottom:24}}>{event.description}</p>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {event.tags.map(t=>(
                  <span key={t} style={{fontSize:12,color:'#3b82f6',background:'rgba(37,99,235,0.12)',border:'1px solid rgba(37,99,235,0.2)',padding:'4px 12px',borderRadius:999}}>#{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{background:'rgba(7,24,40,0.95)',border:'1px solid rgba(56,139,253,0.2)',borderRadius:24,boxShadow:'0 0 40px rgba(37,99,235,0.1)',position:'sticky',top:24,overflow:'hidden',backdropFilter:'blur(16px)'}}>
            {/* panel top accent */}
            <div style={{height:3,background:'linear-gradient(90deg,#2563eb,#06b6d4)'}}/>
            <div style={{padding:'28px 28px'}}>
              {step===0&&<Panel0 event={event} soldOut={soldOut} onNext={()=>setStep(1)}/>}
              {step===1&&<Panel1 event={event} qty={qty} setQty={setQty} total={total} onBack={()=>setStep(0)} onNext={()=>setStep(2)}/>}
              {step===2&&<Panel2 event={event} qty={qty} total={total} submitting={submitting} error={error} onBack={()=>setStep(1)} onConfirm={handleBook}/>}
            </div>
          </div>
        </div>
      ):(
        booking&&<DoneStep booking={booking}/>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

function Panel0({event,soldOut,onNext}:{event:Event;soldOut:boolean;onNext:()=>void}) {
  return (
    <>
      <p style={{fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#3d5a80',marginBottom:6}}>Giá vé</p>
      <p style={{fontFamily:"'Syne',sans-serif",fontSize:38,fontWeight:800,color:'#e8f0fe',letterSpacing:'-0.02em',marginBottom:20}}>
        {event.price===0?<span style={{color:'#10b981'}}>Miễn phí</span>:<>{event.price.toLocaleString('vi-VN')}<span style={{fontSize:16,fontWeight:400,color:'#3d5a80'}}>₫ / người</span></>}
      </p>
      {soldOut ? (
        <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#ef4444',padding:'14px',borderRadius:12,textAlign:'center',fontWeight:700,marginBottom:16}}>🚫 Hết vé</div>
      ) : (
        <>
          <div style={{height:6,background:'rgba(56,139,253,0.1)',borderRadius:999,overflow:'hidden',marginBottom:8}}>
            <div style={{height:'100%',width:`${Math.min(100,(1-event.availableSeats/500)*100)}%`,background:'linear-gradient(90deg,#2563eb,#06b6d4)',borderRadius:999}}/>
          </div>
          <p style={{fontSize:12,color:'#3d5a80',marginBottom:20}}>Còn {event.availableSeats} chỗ</p>
          <button onClick={onNext} style={{width:'100%',padding:'15px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'#fff',border:'none',borderRadius:14,fontWeight:800,fontSize:15,cursor:'pointer',boxShadow:'0 0 24px rgba(37,99,235,0.4)',transition:'all 0.2s'}}>
            Đặt vé ngay →
          </button>
        </>
      )}
      <div style={{height:1,background:'rgba(56,139,253,0.1)',margin:'24px 0'}}/>
      {['Xác nhận ngay tức thì','Đổi / hoàn vé trước 24h','Vé điện tử qua email'].map(t=>(
        <p key={t} style={{fontSize:13,color:'#3d5a80',marginBottom:8}}>✓ {t}</p>
      ))}
    </>
  );
}

function Panel1({event,qty,setQty,total,onBack,onNext}:{event:Event;qty:number;setQty:(n:number)=>void;total:number;onBack:()=>void;onNext:()=>void}) {
  return (
    <>
      <p style={{fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#3d5a80',marginBottom:6}}>Chọn số lượng vé</p>
      <h3 style={{fontSize:16,fontWeight:700,color:'#e8f0fe',marginBottom:24,lineHeight:1.3}}>{event.title}</h3>
      <div style={{display:'flex',alignItems:'center',border:'1px solid rgba(56,139,253,0.2)',borderRadius:14,overflow:'hidden',marginBottom:24}}>
        <button onClick={()=>setQty(Math.max(1,qty-1))} style={{width:56,height:56,background:'rgba(7,24,40,0.8)',border:'none',fontSize:22,color:'#60a5fa',cursor:'pointer',transition:'background 0.15s'}}>−</button>
        <span style={{flex:1,textAlign:'center',fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:'#e8f0fe'}}>{qty}</span>
        <button onClick={()=>setQty(Math.min(Math.min(10,event.availableSeats),qty+1))} style={{width:56,height:56,background:'rgba(7,24,40,0.8)',border:'none',fontSize:22,color:'#60a5fa',cursor:'pointer'}}>+</button>
      </div>
      <div style={{background:'rgba(4,17,31,0.8)',border:'1px solid rgba(56,139,253,0.1)',borderRadius:12,padding:16,marginBottom:4}}>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'#a8bfe8',padding:'6px 0'}}><span>{(event.price).toLocaleString('vi-VN')}₫ × {qty}</span><span>{(event.price*qty).toLocaleString('vi-VN')}₫</span></div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'#a8bfe8',padding:'6px 0'}}><span>Phí dịch vụ</span><span style={{color:'#10b981'}}>Miễn phí</span></div>
        <div style={{display:'flex',justifyContent:'space-between',padding:'12px 0 0',borderTop:'1px solid rgba(56,139,253,0.1)',marginTop:4}}>
          <span style={{fontWeight:800,color:'#e8f0fe'}}>Tổng cộng</span>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:900,color:'#60a5fa'}}>{event.price===0?'Miễn phí':`${total.toLocaleString('vi-VN')}₫`}</span>
        </div>
      </div>
      <div style={{display:'flex',gap:10,marginTop:20}}>
        <button onClick={onBack} style={{padding:'14px 20px',background:'transparent',border:'1px solid rgba(56,139,253,0.2)',borderRadius:14,color:'#a8bfe8',fontWeight:600,fontSize:14,cursor:'pointer'}}>← Quay lại</button>
        <button onClick={onNext} style={{flex:1,padding:'14px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'#fff',border:'none',borderRadius:14,fontWeight:800,fontSize:15,cursor:'pointer',boxShadow:'0 0 20px rgba(37,99,235,0.35)'}}>Tiếp tục →</button>
      </div>
    </>
  );
}

function Panel2({event,qty,total,submitting,error,onBack,onConfirm}:{event:Event;qty:number;total:number;submitting:boolean;error:string;onBack:()=>void;onConfirm:()=>void}) {
  const fmtD2=(d:string)=>new Date(d).toLocaleDateString('vi-VN',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});
  return (
    <>
      <p style={{fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#3d5a80',marginBottom:14}}>Xác nhận đơn đặt vé</p>
      <div style={{display:'flex',gap:12,alignItems:'center',background:'rgba(4,17,31,0.8)',border:'1px solid rgba(56,139,253,0.1)',borderRadius:14,padding:14,marginBottom:20}}>
        <img src={event.imageUrl} style={{width:60,height:60,objectFit:'cover',borderRadius:10,flexShrink:0}} alt=""/>
        <div>
          <p style={{fontWeight:800,fontSize:15,margin:'0 0 4px',color:'#e8f0fe'}}>{event.title}</p>
          <p style={{fontSize:12,color:'#3d5a80',margin:0}}>📅 {fmtD2(event.date)}</p>
          <p style={{fontSize:12,color:'#3d5a80',margin:'2px 0 0'}}>📍 {event.location}</p>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'#a8bfe8',padding:'8px 0'}}><span>Số lượng</span><span style={{fontWeight:700,color:'#e8f0fe'}}>{qty} vé</span></div>
      <div style={{display:'flex',justifyContent:'space-between',padding:'12px 0 0',borderTop:'1px solid rgba(56,139,253,0.2)',marginTop:4}}>
        <span style={{fontWeight:800,color:'#e8f0fe'}}>Tổng tiền</span>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:900,color:'#60a5fa'}}>{event.price===0?'Miễn phí':`${total.toLocaleString('vi-VN')}₫`}</span>
      </div>
      {error&&<div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#ef4444',padding:'12px',borderRadius:10,fontSize:14,fontWeight:600,margin:'14px 0'}}>{error}</div>}
      <p style={{fontSize:12,color:'#3d5a80',margin:'16px 0 20px'}}>Bằng cách xác nhận, bạn đồng ý với Điều khoản sử dụng và Chính sách hoàn vé của VibeSpace.</p>
      <div style={{display:'flex',gap:10}}>
        <button onClick={onBack} disabled={submitting} style={{padding:'14px 20px',background:'transparent',border:'1px solid rgba(56,139,253,0.2)',borderRadius:14,color:'#a8bfe8',fontWeight:600,fontSize:14,cursor:'pointer'}}>← Quay lại</button>
        <button onClick={onConfirm} disabled={submitting} style={{flex:1,padding:'14px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'#fff',border:'none',borderRadius:14,fontWeight:800,fontSize:15,cursor:'pointer',opacity:submitting?0.7:1,boxShadow:'0 0 20px rgba(37,99,235,0.35)'}}>
          {submitting?'⏳ Đang xử lý...':'✓ Xác nhận & Đặt vé'}
        </button>
      </div>
    </>
  );
}

function DoneStep({booking}:{booking:Booking}) {
  const fmtD2=(d:string)=>new Date(d).toLocaleDateString('vi-VN',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});
  const fmt2=(p:number)=>p===0?'Miễn phí':p.toLocaleString('vi-VN')+'₫';
  return (
    <div style={{maxWidth:520,margin:'48px auto',padding:'0 24px'}}>
      <div style={{background:'rgba(7,24,40,0.95)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:24,overflow:'hidden',boxShadow:'0 0 60px rgba(37,99,235,0.15)'}}>
        <div style={{height:3,background:'linear-gradient(90deg,#2563eb,#06b6d4)'}}/>
        {/* Head */}
        <div style={{background:'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(6,182,212,0.15))',padding:'40px 32px 32px',textAlign:'center',borderBottom:'1px dashed rgba(56,139,253,0.2)'}}>
          <div style={{width:60,height:60,background:'linear-gradient(135deg,#10b981,#059669)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,color:'#fff',margin:'0 auto 16px',fontWeight:900,boxShadow:'0 0 24px rgba(16,185,129,0.4)'}}>✓</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",color:'#e8f0fe',fontSize:24,fontWeight:800,margin:'0 0 6px',letterSpacing:'-0.02em'}}>Đặt vé thành công!</h2>
          <p style={{color:'#3d5a80',fontSize:14}}>Cảm ơn bạn đã chọn VibeSpace</p>
        </div>
        {/* Body */}
        <div style={{padding:'28px 32px 32px'}}>
          <img src={booking.snapshot.imageUrl} style={{width:'100%',height:160,objectFit:'cover',borderRadius:12,marginBottom:18,display:'block',border:'1px solid rgba(56,139,253,0.1)'}} alt=""/>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:'#e8f0fe',margin:'0 0 20px',letterSpacing:'-0.01em'}}>{booking.snapshot.title}</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:24}}>
            {[['NGÀY',fmtD2(booking.snapshot.date)],['ĐỊA ĐIỂM',booking.snapshot.location],['SỐ VÉ',`${booking.quantity} vé`],['TỔNG TIỀN',fmt2(booking.totalPrice)]].map(([l,v])=>(
              <div key={l}>
                <p style={{fontSize:10,fontWeight:700,letterSpacing:'0.1em',color:'#3d5a80',textTransform:'uppercase',marginBottom:3}}>{l}</p>
                <p style={{fontSize:14,fontWeight:600,color:l==='TỔNG TIỀN'?'#60a5fa':'#a8bfe8'}}>{v}</p>
              </div>
            ))}
          </div>
          {/* Barcode */}
          <div style={{textAlign:'center',background:'rgba(4,17,31,0.8)',border:'1px solid rgba(56,139,253,0.1)',borderRadius:14,padding:'20px 16px'}}>
            <p style={{fontSize:13,fontWeight:700,fontFamily:'monospace',color:'#60a5fa',marginBottom:12,letterSpacing:'0.05em'}}>{booking.id}</p>
            <div style={{display:'flex',gap:2,justifyContent:'center',alignItems:'flex-end',marginBottom:8}}>
              {Array.from({length:32}).map((_,i)=>( <div key={i} style={{width:3,background:'#3b82f6',borderRadius:1,height:[18,28,22,32,16,26,20,30,24,20][i%10],opacity:0.7+Math.random()*0.3}}/> ))}
            </div>
            <p style={{fontSize:11,color:'#3d5a80'}}>Xuất trình mã này tại cửa vào</p>
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:12,marginTop:20,flexWrap:'wrap'}}>
        <Link href="/events" style={{flex:1,textAlign:'center',padding:'14px',background:'rgba(7,24,40,0.9)',border:'1px solid rgba(56,139,253,0.2)',borderRadius:14,color:'#a8bfe8',fontWeight:700,fontSize:14,minWidth:140}}>Khám phá thêm</Link>
        <Link href="/profile" style={{flex:1,textAlign:'center',padding:'14px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',borderRadius:14,color:'#fff',fontWeight:700,fontSize:14,minWidth:140,boxShadow:'0 0 20px rgba(37,99,235,0.35)'}}>Xem lịch sử đặt vé</Link>
      </div>
    </div>
  );
}
