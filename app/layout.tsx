import React from 'react';
import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibeSpace — Trải Nghiệm Văn Hóa & Giải Trí Không Giới Hạn',
  description: 'Khám phá các sự kiện âm nhạc, triển lãm, workshop và lễ hội độc đáo tại Việt Nam.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <AntdRegistry>
          {/* ── Navbar ── */}
          <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            background: 'rgba(2, 11, 24, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(56, 139, 253, 0.12)',
          }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 34, height: 34,
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 900, color: '#fff',
                boxShadow: '0 0 16px rgba(37,99,235,0.5)',
              }}>V</div>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: '#e8f0fe',
                letterSpacing: '-0.02em',
              }}>VibeSpace</span>
            </Link>

            {/* Nav links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[
                { href: '/',         label: 'Trang chủ' },
                { href: '/events',   label: 'Sự kiện'   },
                { href: '/contact',  label: 'Liên hệ'   },
                { href: '/login',    label: 'Đăng nhập' },
                { href: '/register', label: 'Đăng ký'   },
                { href: '/profile',  label: 'Hồ sơ'     },
                { href: '/admin',    label: '⚙️ Admin'   },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="vs-nav-link"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#a8bfe8',
                    transition: 'all 0.18s ease',
                    whiteSpace: 'nowrap',
                  }}

                >
                  {label}
                </Link>
              ))}

              {/* CTA Button */}
              <Link href="/events" style={{
                marginLeft: 8,
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                boxShadow: '0 0 16px rgba(37,99,235,0.35)',
                transition: 'all 0.2s ease',
              }}>
                Đặt vé ngay
              </Link>
            </nav>
          </header>

          {/* ── Main ── */}
          <main style={{ paddingTop: 64, minHeight: '100vh' }}>
            {children}
          </main>

          {/* ── Footer ── */}
          <footer style={{
            background: 'rgba(4, 17, 31, 0.95)',
            borderTop: '1px solid rgba(56,139,253,0.1)',
            padding: '40px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 20, fontWeight: 800,
              color: '#e8f0fe', marginBottom: 8, letterSpacing: '-0.02em',
            }}>VibeSpace</div>
            <p style={{ color: '#3d5a80', fontSize: 13 }}>
              © 2026 VibeSpace — Nền tảng kết nối Sự kiện Văn Hóa & Giải Trí Việt Nam
            </p>
            <a href="tel:0329868715" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginTop: 12, padding: '8px 20px',
              background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: 999, color: '#60a5fa', fontSize: 14, fontWeight: 700,
              textDecoration: 'none',
            }}>
              📞 0329 868 715
            </a>
            <div style={{ marginTop: 16, display: 'flex', gap: 24, justifyContent: 'center' }}>
              {['Về chúng tôi', 'Điều khoản', 'Chính sách', 'Liên hệ'].map(t => (
                <a key={t} href={t === 'Liên hệ' ? '/contact' : '#'} style={{ fontSize: 13, color: '#3d5a80', cursor: 'pointer', textDecoration: 'none' }}>{t}</a>
              ))}
            </div>
          </footer>
        </AntdRegistry>
      </body>
    </html>
  );
}
