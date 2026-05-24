# 🎭 VibeSpace

> **Nền tảng trải nghiệm Văn Hóa & Giải Trí Không Giới Hạn**  
> Khám phá, đặt vé và tham gia các sự kiện âm nhạc, triển lãm, workshop độc đáo tại Việt Nam.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Ant Design](https://img.shields.io/badge/Ant%20Design-6.4-1677ff?style=flat-square&logo=antdesign)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

---

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🎟️ **Đặt vé trực tuyến** | Luồng booking 3 bước, vé điện tử có mã barcode |
| 🔐 **Xác thực bảo mật** | Mật khẩu hash SHA-256, JWT cookie httpOnly |
| 🎭 **15 sự kiện** | Âm nhạc, triển lãm, workshop, phim, ẩm thực... |
| 🔍 **Tìm kiếm & lọc** | Tìm theo từ khóa, lọc theo thể loại |
| ⚙️ **Admin Panel** | Thêm/sửa/xóa sự kiện, quản lý users & bookings |
| 📞 **Liên hệ** | Trang liên hệ với form gửi tin nhắn |
| 🌙 **Dark theme** | Giao diện xanh dương đen sang trọng |
| 📱 **Responsive** | Tương thích mobile & desktop |

---

## 🖼️ Giao diện

```
Trang chủ      → /
Sự kiện        → /events
Chi tiết + Đặt vé → /events/[id]
Đăng nhập      → /login
Đăng ký        → /register
Hồ sơ          → /profile
Liên hệ        → /contact
Admin Dashboard → /admin
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js 18+
- npm hoặc yarn

### Các bước

```bash
# 1. Clone project
git clone https://github.com/SeiYoi1501/vibespace_final.git
cd vibespace_final

# 2. Cài dependencies
npm install

# 3. Tạo file môi trường
cp .env.example .env.local
# Sửa JWT_SECRET trong file .env.local

# 4. Chạy development
npm run dev
```

Mở trình duyệt tại **http://localhost:3000**

---

## ⚙️ Biến môi trường

Tạo file `.env.local` ở thư mục gốc:

```env
JWT_SECRET=your-secret-key-change-in-production
ADMIN_SETUP_KEY=vibespace-admin-setup-2026
```

---

## 👤 Tạo tài khoản Admin

Sau khi chạy server, gọi API sau (dùng Thunder Client hoặc Postman):

```http
POST http://localhost:3000/api/admin/auth/register
Content-Type: application/json

{
  "fullName": "Admin VibeSpace",
  "email": "admin@vibespace.vn",
  "password": "your-password",
  "setupKey": "vibespace-admin-setup-2026"
}
```

Sau đó đăng nhập tại **http://localhost:3000/admin/login**

---

## 📁 Cấu trúc dự án

```
vibespace_final/
├── app/
│   ├── page.tsx              # Trang chủ
│   ├── events/
│   │   ├── page.tsx          # Danh sách sự kiện
│   │   └── [id]/page.tsx     # Chi tiết + Đặt vé
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── profile/page.tsx      # Lịch sử đặt vé
│   ├── contact/page.tsx      # Liên hệ
│   ├── admin/                # Admin Panel
│   │   ├── page.tsx          # Dashboard
│   │   ├── events/           # Quản lý sự kiện
│   │   ├── users/            # Quản lý users
│   │   └── bookings/         # Quản lý bookings
│   └── api/                  # API Routes
│       ├── auth/             # Đăng ký, đăng nhập, logout
│       ├── events/           # CRUD sự kiện
│       ├── bookings/         # Đặt vé, huỷ vé
│       └── admin/            # API dành cho admin
├── lib/
│   ├── store.ts              # In-memory database (15 events)
│   ├── auth.ts               # Hash password + JWT
│   └── adminGuard.ts         # Middleware bảo vệ API admin
├── data/
│   └── events.ts             # EventType interface
└── middleware.ts             # Bảo vệ route /admin & /profile
```

---

## 🛠️ Công nghệ sử dụng

- **[Next.js 16](https://nextjs.org/)** — App Router, API Routes, Middleware
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety
- **[Ant Design 6](https://ant.design/)** — UI Components
- **[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)** — Mã hoá mật khẩu & JWT (không cần thư viện ngoài)

---

## 🌐 Deploy lên Vercel

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Hoặc kết nối GitHub repo với **[vercel.com](https://vercel.com)** để tự động deploy.

Nhớ thêm **Environment Variables** trong Vercel Dashboard:
- `JWT_SECRET`
- `ADMIN_SETUP_KEY`

---

## 📞 Liên hệ

**VibeSpace Support**  
📱 **0329 868 715**  
💬 Zalo: [0329868715](https://zalo.me/0329868715)  
🌐 Website: [vibespace.vercel.app](https://vibespace.vercel.app)  
🕐 Hỗ trợ: 8:00 – 22:00 hàng ngày

---

## 📄 License

MIT © 2026 VibeSpace
