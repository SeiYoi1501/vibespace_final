'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Giả lập gửi — sau này kết nối email thật
    setSent(true);
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", paddingBottom: 80 }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(37,99,235,0.12) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,139,253,0.1)',
        padding: '60px 40px 50px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#3b82f6', textTransform: 'uppercase', marginBottom: 10 }}>✦ Liên hệ</p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: '#e8f0fe', letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.1 }}>
          Kết nối với chúng tôi
        </h1>
        <p style={{ color: '#a8bfe8', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
          Có câu hỏi về sự kiện hoặc cần hỗ trợ? Đừng ngại liên hệ — chúng tôi luôn sẵn sàng giúp bạn.
        </p>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

          {/* ── Thông tin liên hệ ── */}
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#e8f0fe', marginBottom: 24, letterSpacing: '-0.01em' }}>
              Thông tin liên hệ
            </h2>

            {/* Phone — nổi bật nhất */}
            <a href="tel:0329868715" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.15))',
                border: '1px solid rgba(59,130,246,0.35)',
                borderRadius: 20,
                padding: '24px 28px',
                display: 'flex', alignItems: 'center', gap: 18,
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(37,99,235,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{
                  width: 52, height: 52, flexShrink: 0,
                  background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                  borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                  boxShadow: '0 0 20px rgba(37,99,235,0.4)',
                }}>📞</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>Gọi ngay</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#e8f0fe', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                    0329 868 715
                  </p>
                  <p style={{ fontSize: 13, color: '#3d5a80', margin: 0 }}>Hỗ trợ 8:00 – 22:00 hàng ngày</p>
                </div>
              </div>
            </a>

            {/* Zalo */}
            <a href="https://zalo.me/0329868715" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
              <div style={{
                background: 'rgba(7,24,40,0.9)', border: '1px solid rgba(56,139,253,0.15)',
                borderRadius: 16, padding: '18px 22px',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(56,139,253,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 44, height: 44, background: '#0068FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>💬</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#3d5a80', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>Zalo</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#e8f0fe', margin: 0 }}>0329 868 715</p>
                </div>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:contact@vibespace.vn" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
              <div style={{
                background: 'rgba(7,24,40,0.9)', border: '1px solid rgba(56,139,253,0.15)',
                borderRadius: 16, padding: '18px 22px',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(56,139,253,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 44, height: 44, background: 'rgba(37,99,235,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✉️</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#3d5a80', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>Email</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#e8f0fe', margin: 0 }}>contact@vibespace.vn</p>
                </div>
              </div>
            </a>

            {/* Địa chỉ */}
            <div style={{
              background: 'rgba(7,24,40,0.9)', border: '1px solid rgba(56,139,253,0.15)',
              borderRadius: 16, padding: '18px 22px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 44, height: 44, background: 'rgba(37,99,235,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📍</div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#3d5a80', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>Địa chỉ</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#e8f0fe', margin: 0 }}>TP. Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>

            {/* Giờ làm việc */}
            <div style={{ background: 'rgba(7,24,40,0.6)', border: '1px solid rgba(56,139,253,0.08)', borderRadius: 14, padding: '18px 22px', marginTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#a8bfe8', marginBottom: 10 }}>🕐 Giờ hỗ trợ</p>
              {[
                ['Thứ 2 – Thứ 6', '8:00 – 22:00'],
                ['Thứ 7 – Chủ nhật', '9:00 – 21:00'],
              ].map(([day, time]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: '#3d5a80' }}>{day}</span>
                  <span style={{ color: '#60a5fa', fontWeight: 600 }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Form gửi tin nhắn ── */}
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#e8f0fe', marginBottom: 24, letterSpacing: '-0.01em' }}>
              Gửi tin nhắn
            </h2>

            {sent ? (
              <div style={{
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 20, padding: '40px 32px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#e8f0fe', marginBottom: 8 }}>Đã gửi thành công!</h3>
                <p style={{ color: '#a8bfe8', fontSize: 14, marginBottom: 20 }}>Chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                  style={{ padding: '10px 24px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 999, color: '#10b981', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <div style={{
                background: 'rgba(7,24,40,0.9)', border: '1px solid rgba(56,139,253,0.15)',
                borderRadius: 20, overflow: 'hidden', backdropFilter: 'blur(12px)',
              }}>
                <div style={{ height: 3, background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }} />
                <div style={{ padding: '28px' }}>
                  <form onSubmit={handleSubmit}>
                    {[
                      { label: 'Họ và tên', name: 'name', type: 'text', ph: 'Nguyễn Văn A' },
                      { label: 'Email của bạn', name: 'email', type: 'email', ph: 'email@example.com' },
                    ].map(f => (
                      <div key={f.name} style={{ marginBottom: 18 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a8bfe8', marginBottom: 7 }}>{f.label}</label>
                        <input type={f.type} placeholder={f.ph} required
                          value={form[f.name as keyof typeof form]}
                          onChange={set(f.name as keyof typeof form)}
                          style={{ width: '100%', padding: '12px 14px', background: 'rgba(4,17,31,0.8)', border: '1px solid rgba(56,139,253,0.15)', borderRadius: 12, color: '#e8f0fe', fontSize: 14, boxSizing: 'border-box' }}
                          onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 14px rgba(37,99,235,0.12)'; }}
                          onBlur={e =>  { e.target.style.borderColor = 'rgba(56,139,253,0.15)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    ))}

                    <div style={{ marginBottom: 22 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a8bfe8', marginBottom: 7 }}>Nội dung</label>
                      <textarea placeholder="Bạn cần hỗ trợ gì? Hỏi về sự kiện, đặt vé nhóm, hợp tác..." required rows={5}
                        value={form.message} onChange={set('message')}
                        style={{ width: '100%', padding: '12px 14px', background: 'rgba(4,17,31,0.8)', border: '1px solid rgba(56,139,253,0.15)', borderRadius: 12, color: '#e8f0fe', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; }}
                        onBlur={e =>  { e.target.style.borderColor = 'rgba(56,139,253,0.15)'; }}
                      />
                    </div>

                    <button type="submit" style={{
                      width: '100%', padding: '14px',
                      background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                      color: '#fff', border: 'none', borderRadius: 14,
                      fontWeight: 800, fontSize: 15, cursor: 'pointer',
                      boxShadow: '0 0 24px rgba(37,99,235,0.35)',
                    }}>
                      📨 Gửi tin nhắn
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Gọi nhanh CTA */}
            <div style={{
              marginTop: 16,
              background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 14, padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
            }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#a8bfe8', margin: '0 0 2px' }}>Cần hỗ trợ ngay?</p>
                <p style={{ fontSize: 12, color: '#3d5a80', margin: 0 }}>Gọi trực tiếp để được phản hồi nhanh nhất</p>
              </div>
              <a href="tel:0329868715" style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg,#2563eb,#06b6d4)',
                color: '#fff', borderRadius: 12,
                fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap',
                boxShadow: '0 0 16px rgba(37,99,235,0.3)',
              }}>
                📞 0329 868 715
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: #2a3f58; }
        * { box-sizing: border-box; }
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
