# DECISIONS — ADX web v2

Các lựa chọn khi brief không nói rõ, hoặc môi trường buộc phải đổi.

## Repo

- Sửa trên repo sẵn có `duynguyen31241020400-lang/adxchange` (không tạo repo `adx-web` mới).
- Xóa prototype marketplace / coming-soon / static surfaces cũ; thay bằng site agency ADX + Payload.

## Stack phiên bản

- Brief: Next.js 15. Payload `3.93.0` peer range loại Next `15.5.x`, nên pin `next@15.4.11` (vẫn là Next 15 App Router).
- Local Postgres (apt) thay Docker/Neon khi chưa có `DATABASE_URI` production.
- Media: local disk khi thiếu R2; bật `@payloadcms/storage-s3` khi đủ biến `R2_*`.

## Nội dung / ảnh

- Map thư mục `Activation Tràng Thi` → slug `khai-truong-topzone` (giả định theo brief; cần August xác nhận).
- Khách hàng dự án xe buýt: theo bảng brief = Thế Giới Di Động, Nha Khoa Kim (thư mục Drive ghi Samsung — cần xác nhận).
- Logo ADX ruby chưa có → dùng tạm `ADXCHANGE_Horizontallogo*.png`.
- Video OOH LED 163MB không đưa vào repo; trang dự án dẫn Facebook.
- `assets-raw/` và `seed-media/` trong `.gitignore`.

## Deploy

- Ưu tiên Netlify theo brief; nếu function limit → Railway. Ghi kết quả thực tế sau khi thử deploy.
