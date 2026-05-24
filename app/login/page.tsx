'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router=useRouter();
  const searchParams=useSearchParams();
  const redirect=searchParams.get('redirect')??'/profile';
  const [form,setForm]=useState({email:'',password:''});
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState('');

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data=await res.json();
      if(!res.ok){setError(data.error??'Đăng nhập thất bại.');return;}
      setSuccess(`Chào mừng, ${data.user.fullName}!`);
      setTimeout(()=>{router.push(redirect);router.refresh();},1200);
    } catch{setError('Lỗi kết nối.');}
    finally{setLoading(false);}
  }

  return (
    <div style={{minHeight:'calc(100vh - 64px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px',fontFamily:"'DM Sans',sans-serif",position:'relative'}}>
      {/* bg grid */}
      <div style={{position:'fixed',inset:0,zIndex:0,backgroundImage:'linear-gradient(rgba(37,99,235,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.04) 1px,transparent 1px)',backgroundSize:'50px 50px',pointerEvents:'none'}}/>

      <div className="anim-up" style={{width:'100%',maxWidth:440,position:'relative',zIndex:1}}>
        {/* Card */}
        <div style={{background:'rgba(7,24,40,0.95)',border:'1px solid rgba(56,139,253,0.2)',borderRadius:24,overflow:'hidden',boxShadow:'0 0 60px rgba(37,99,235,0.12)',backdropFilter:'blur(16px)'}}>
          <div style={{height:3,background:'linear-gradient(90deg,#2563eb,#06b6d4)'}}/>
          <div style={{padding:'36px 36px 40px'}}>
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{width:52,height:52,background:'linear-gradient(135deg,#2563eb,#1d4ed8)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,margin:'0 auto 16px',boxShadow:'0 0 20px rgba(37,99,235,0.4)'}}>🔐</div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:'#e8f0fe',margin:'0 0 6px',letterSpacing:'-0.02em'}}>Đăng nhập</h1>
              <p style={{color:'#3d5a80',fontSize:14}}>Chào mừng trở lại VibeSpace!</p>
            </div>

            {error&&<div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#ef4444',padding:'12px 16px',borderRadius:12,fontSize:14,fontWeight:600,marginBottom:20}}>{error}</div>}
            {success&&<div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',color:'#10b981',padding:'12px 16px',borderRadius:12,fontSize:14,fontWeight:600,marginBottom:20}}>✓ {success}</div>}

            <form onSubmit={handleSubmit}>
              {[{label:'Email',name:'email',type:'email',ph:'email@example.com'},{label:'Mật khẩu',name:'password',type:'password',ph:'Nhập mật khẩu'}].map(f=>(
                <div key={f.name} style={{marginBottom:18}}>
                  <label style={{display:'block',fontSize:13,fontWeight:600,color:'#a8bfe8',marginBottom:7}}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.name as keyof typeof form]}
                    onChange={e=>setForm(p=>({...p,[f.name]:e.target.value}))}
                    required style={{width:'100%',padding:'13px 16px',background:'rgba(4,17,31,0.8)',border:'1px solid rgba(56,139,253,0.15)',borderRadius:12,color:'#e8f0fe',fontSize:14,transition:'border-color 0.2s,box-shadow 0.2s'}}
                    onFocus={e=>{e.target.style.borderColor='rgba(59,130,246,0.5)';e.target.style.boxShadow='0 0 16px rgba(37,99,235,0.15)';}}
                    onBlur={e=>{e.target.style.borderColor='rgba(56,139,253,0.15)';e.target.style.boxShadow='none';}}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'#fff',border:'none',borderRadius:14,fontWeight:800,fontSize:15,cursor:'pointer',boxShadow:'0 0 24px rgba(37,99,235,0.35)',marginTop:4,opacity:loading?0.75:1,transition:'all 0.2s'}}>
                {loading?'Đang đăng nhập...':'Đăng nhập →'}
              </button>
            </form>

            <p style={{textAlign:'center',marginTop:24,fontSize:14,color:'#3d5a80'}}>
              Chưa có tài khoản?{' '}
              <Link href="/register" style={{color:'#60a5fa',fontWeight:700}}>Đăng ký miễn phí</Link>
            </p>
          </div>
        </div>
      </div>
      <style>{`input::placeholder{color:#2a3f58;}`}</style>
    </div>
  );
}
