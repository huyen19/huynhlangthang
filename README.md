# Huyền Lang Thang

Website du lịch & thiện nguyện, xây dựng bằng Next.js (App Router) + Tailwind CSS. Toàn bộ nội dung (tour, quỹ thiện nguyện, sản phẩm) lưu dạng file JSON trong thư mục `data/`.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Cấu trúc dữ liệu

- `data/site.json` — thông tin chung (tên, logo, hero, liên hệ, quỹ thiện nguyện)
- `data/tours.json` — danh sách 24 tour trekking
- `data/charity.json` — các sự kiện "Hành Trình Yêu Thương"
- `data/gallery.json` — ảnh "Khoảnh Khắc Đáng Nhớ"
- `data/products.json` + `data/categories.json` — sản phẩm cửa hàng
- `data/notices.json` — điều khoản/lưu ý dùng chung cho mọi tour

Ảnh tĩnh nằm trong `public/images/`.

## Build & Deploy

```bash
npm run build
```

Deploy trên [Vercel](https://vercel.com/new) — import trực tiếp repo GitHub này, Vercel tự nhận diện Next.js, không cần cấu hình thêm.
