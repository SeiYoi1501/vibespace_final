/**
 * lib/store.ts
 * In-memory mock store — thay thế localStorage.
 * Khi có DB thật, chỉ cần đổi các hàm bên dưới sang Prisma/Supabase.
 */

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  location: string;
  price: number;
  imageUrl: string;
  availableSeats: number;
  tags: string[];
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  snapshot: {
    title: string;
    date: string;
    location: string;
    price: number;
    imageUrl: string;
    category: string;
  };
}

// ─── In-memory collections ────────────────────────────────────────────────────

const users: User[]     = [];
const bookings: Booking[] = [];

// ─── Users DB ─────────────────────────────────────────────────────────────────

export const db = {
  users: {
    findByEmail: (email: string) => users.find(u => u.email === email) ?? null,
    findById:    (id: string)    => users.find(u => u.id    === id)    ?? null,
    create: (data: Omit<User, 'id' | 'createdAt'>): User => {
      const user: User = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      users.push(user);
      return user;
    },
  },

  events: {
    all:      ()           => mockEvents,
    findById: (id: string) => mockEvents.find(e => e.id === id) ?? null,
    search:   (query: string, category?: string) => {
      const q = query.toLowerCase();
      return mockEvents.filter(e => {
        const matchQ = !q ||
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some(t => t.toLowerCase().includes(q));
        return matchQ && (!category || e.category === category);
      });
    },
  },
};

// ─── Bookings DB ──────────────────────────────────────────────────────────────

export const bookingDb = {
  create: (data: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const event = mockEvents.find(e => e.id === data.eventId);
    if (event) event.availableSeats = Math.max(0, event.availableSeats - data.quantity);
    const booking: Booking = { ...data, id: `BK${Date.now()}`, createdAt: new Date().toISOString() };
    bookings.push(booking);
    return booking;
  },
  findByUser: (userId: string) =>
    bookings.filter(b => b.userId === userId).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
  findById: (id: string) => bookings.find(b => b.id === id) ?? null,
  cancel: (id: string, userId: string): Booking | null => {
    const b = bookings.find(bk => bk.id === id && bk.userId === userId);
    if (!b || b.status === 'cancelled') return null;
    b.status = 'cancelled';
    const event = mockEvents.find(e => e.id === b.eventId);
    if (event) event.availableSeats += b.quantity;
    return b;
  },
};

// ─── Mock Events (15 sự kiện) ─────────────────────────────────────────────────

const mockEvents: Event[] = [
  {
    id: '1', title: 'Đêm Nhạc Jazz Sài Gòn', category: 'Âm nhạc',
    description: 'Một đêm nhạc jazz đặc biệt với sự góp mặt của các nghệ sĩ hàng đầu Việt Nam. Thưởng thức những giai điệu mượt mà trong không gian sang trọng tại Opera House.',
    date: '2026-06-15T20:00:00', location: 'Opera House, Q.1, TP.HCM',
    price: 350000, imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
    availableSeats: 120, tags: ['jazz', 'âm nhạc', 'live'],
  },
  {
    id: '2', title: 'Triển Lãm Nghệ Thuật Đương Đại', category: 'Triển lãm',
    description: 'Khám phá thế giới nghệ thuật đương đại qua các tác phẩm của 30 nghệ sĩ trẻ Việt Nam. Không gian sáng tạo, đầy cảm hứng với nhiều installation art độc đáo.',
    date: '2026-06-20T09:00:00', location: 'Bảo tàng Mỹ thuật, Q.3, TP.HCM',
    price: 80000, imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
    availableSeats: 200, tags: ['nghệ thuật', 'triển lãm', 'đương đại'],
  },
  {
    id: '3', title: 'Workshop Nhiếp Ảnh Đường Phố', category: 'Workshop',
    description: 'Học cách kể chuyện bằng hình ảnh qua ống kính. Khóa học thực hành tại các con phố đặc trưng của Sài Gòn cùng nhiếp ảnh gia Trần Minh Đức.',
    date: '2026-06-22T08:00:00', location: 'Quận 3, TP.HCM',
    price: 500000, imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
    availableSeats: 20, tags: ['nhiếp ảnh', 'workshop', 'đường phố'],
  },
  {
    id: '4', title: 'Chiếu Phim Ngoài Trời: Mùa Hè Của Em', category: 'Phim',
    description: 'Buổi chiếu phim lãng mạn dưới bầu trời đêm. Mang theo chăn, đến và tận hưởng bộ phim Việt đang hot nhất 2026 giữa không gian xanh mát của công viên.',
    date: '2026-06-28T19:30:00', location: 'Công viên Tao Đàn, Q.1, TP.HCM',
    price: 120000, imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    availableSeats: 300, tags: ['phim', 'ngoài trời', 'lãng mạn'],
  },
  {
    id: '5', title: 'Lễ Hội Ẩm Thực Đường Phố', category: 'Ẩm thực',
    description: 'Hơn 50 gian hàng ẩm thực từ khắp các vùng miền Việt Nam. Trải nghiệm hương vị truyền thống và sáng tạo, kết hợp âm nhạc dân gian.',
    date: '2026-07-04T16:00:00', location: 'Phố đi bộ Nguyễn Huệ, Q.1, TP.HCM',
    price: 0, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    availableSeats: 999, tags: ['ẩm thực', 'lễ hội', 'miễn phí'],
  },
  {
    id: '6', title: 'Concert Rock Việt 2026', category: 'Âm nhạc',
    description: 'Đêm nhạc Rock Việt bùng cháy với sự tham gia của Bức Tường, Microwave và nhiều ban nhạc đình đám. Sân khấu hoành tráng, âm thanh cực đỉnh.',
    date: '2026-07-10T18:00:00', location: 'Nhà thi đấu Phú Thọ, Q.11, TP.HCM',
    price: 450000, imageUrl: 'https://images.unsplash.com/photo-1501386761578-eaa54b4ef9ac?w=800',
    availableSeats: 5000, tags: ['rock', 'concert', 'live music'],
  },
  {
    id: '7', title: 'Lớp Học Vẽ Màu Nước Cho Người Mới', category: 'Workshop',
    description: 'Bắt đầu hành trình nghệ thuật của bạn với màu nước. Giáo viên hướng dẫn tận tình, cung cấp đầy đủ dụng cụ. Phù hợp hoàn toàn cho người chưa biết vẽ.',
    date: '2026-07-12T09:00:00', location: 'Studio Palette, Q.Bình Thạnh, TP.HCM',
    price: 380000, imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    availableSeats: 15, tags: ['vẽ', 'màu nước', 'workshop'],
  },
  {
    id: '8', title: 'Đêm Thơ & Acoustic Hà Nội', category: 'Âm nhạc',
    description: 'Một buổi tối lắng đọng với thơ văn và âm nhạc acoustic. Các nhà thơ trẻ Hà Nội chia sẻ tác phẩm, xen kẽ những bài hát trong không gian ấm cúng.',
    date: '2026-07-18T19:00:00', location: 'The Workshop, Hoàn Kiếm, Hà Nội',
    price: 150000, imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
    availableSeats: 60, tags: ['thơ', 'acoustic', 'văn học'],
  },
  {
    id: '9', title: 'Festival Múa Đương Đại', category: 'Biểu diễn',
    description: 'Liên hoan múa đương đại quy tụ các đoàn múa từ Việt Nam, Hàn Quốc và Pháp. Ba đêm trình diễn với ngôn ngữ cơ thể đầy cảm xúc.',
    date: '2026-07-25T20:00:00', location: 'Nhà hát Lớn, Hoàn Kiếm, Hà Nội',
    price: 280000, imageUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800',
    availableSeats: 450, tags: ['múa', 'đương đại', 'quốc tế'],
  },
  {
    id: '10', title: 'Chợ Sách Cũ & Nghệ Thuật Độc Lập', category: 'Triển lãm',
    description: 'Thiên đường của người yêu sách và nghệ thuật độc lập. Hàng nghìn đầu sách cũ, tranh in độc lập, zine thủ công và sản phẩm sáng tạo.',
    date: '2026-08-01T08:00:00', location: 'Sân Văn Lang, Q.5, TP.HCM',
    price: 0, imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    availableSeats: 999, tags: ['sách', 'độc lập', 'miễn phí'],
  },
  {
    id: '11', title: 'Stand-up Comedy: Đêm Cười Sài Gòn', category: 'Giải trí',
    description: 'Đêm hài độc thoại với 5 comedian đang hot nhất Sài Gòn. Cười đau bụng, quên hết stress. 18+ vì nội dung có thể mạnh theo kiểu hài người lớn.',
    date: '2026-08-08T20:30:00', location: 'Cà phê Cội, Q.Phú Nhuận, TP.HCM',
    price: 200000, imageUrl: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
    availableSeats: 80, tags: ['comedy', 'hài', '18+'],
  },
  {
    id: '12', title: 'Hòa Nhạc Cổ Điển: Beethoven & Brahms', category: 'Âm nhạc',
    description: 'Dàn nhạc giao hưởng Việt Nam trình diễn các tác phẩm bất hủ. Một đêm nhạc cổ điển thuần túy trong không gian Opera House tráng lệ.',
    date: '2026-08-14T19:30:00', location: 'Opera House, Q.1, TP.HCM',
    price: 600000, imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800',
    availableSeats: 500, tags: ['cổ điển', 'giao hưởng', 'beethoven'],
  },
  {
    id: '13', title: 'Workshop Làm Gốm Thủ Công', category: 'Workshop',
    description: 'Tự tay nặn và nung gốm theo phong cách truyền thống Việt Nam. Giữ lại sản phẩm của mình sau khi nung. Không cần kinh nghiệm.',
    date: '2026-08-20T14:00:00', location: 'Xưởng Gốm Thủ Đô, Cầu Giấy, Hà Nội',
    price: 420000, imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
    availableSeats: 12, tags: ['gốm', 'thủ công', 'truyền thống'],
  },
  {
    id: '14', title: 'Liên Hoan Phim Ngắn Độc Lập', category: 'Phim',
    description: 'Chiếu 20 phim ngắn xuất sắc nhất của các đạo diễn trẻ Việt Nam. Giao lưu trực tiếp với đạo diễn sau mỗi phim.',
    date: '2026-08-28T17:00:00', location: 'Rạp Galaxy, Q.Tân Bình, TP.HCM',
    price: 100000, imageUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800',
    availableSeats: 180, tags: ['phim ngắn', 'độc lập', 'điện ảnh'],
  },
  {
    id: '15', title: 'Yoga & Thiền Định Bình Minh', category: 'Sức khỏe',
    description: 'Đón bình minh với yoga và thiền định bên bờ sông Sài Gòn. Giáo viên 10 năm kinh nghiệm hướng dẫn. Phù hợp mọi cấp độ.',
    date: '2026-09-05T05:30:00', location: 'Bến Bạch Đằng, Q.1, TP.HCM',
    price: 80000, imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    availableSeats: 40, tags: ['yoga', 'thiền', 'sức khỏe'],
  },
];

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface Admin {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'admin';
  createdAt: string;
}

const admins: Admin[] = [];

export const adminDb = {
  findByEmail: (email: string) => admins.find(a => a.email === email) ?? null,
  findById:    (id: string)    => admins.find(a => a.id    === id)    ?? null,
  create: (data: Omit<Admin, 'id' | 'createdAt' | 'role'>): Admin => {
    const admin: Admin = { ...data, role: 'admin', id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    admins.push(admin);
    return admin;
  },
  all: () => admins,
};

// ─── Event CRUD (admin) ───────────────────────────────────────────────────────

export const eventAdminDb = {
  all: () => mockEvents,

  findById: (id: string) => mockEvents.find(e => e.id === id) ?? null,

  create: (data: Omit<Event, 'id'>): Event => {
    const event: Event = { ...data, id: crypto.randomUUID() };
    mockEvents.push(event);
    return event;
  },

  update: (id: string, data: Partial<Omit<Event, 'id'>>): Event | null => {
    const idx = mockEvents.findIndex(e => e.id === id);
    if (idx === -1) return null;
    mockEvents[idx] = { ...mockEvents[idx], ...data };
    return mockEvents[idx];
  },

  delete: (id: string): boolean => {
    const idx = mockEvents.findIndex(e => e.id === id);
    if (idx === -1) return false;
    mockEvents.splice(idx, 1);
    return true;
  },

  stats: () => ({
    totalEvents:   mockEvents.length,
    totalUsers:    users.length,
    totalBookings: bookings.length,
    totalRevenue:  bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0),
  }),

  allBookings: () => bookings,
  allUsers:    () => users,
};
