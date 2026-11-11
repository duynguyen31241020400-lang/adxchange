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

## Font tiêu đề

- So sánh Anton / Barlow Condensed / Oswald trên `/dev/font-check` với câu tiếng Việt.
- Cả 3 hiển thị dấu ổn trong screenshot; **mặc định giữ Anton (Chữ 1)** theo brief.

## Ảnh / Drive

- Tải được folder Drive `1iQV3gbPPmL_e2BS4Lo7wr3Rm7pOX2rTW` bằng `gdown --folder` vào `assets-raw/`.
- Lỗi 1 file Google Doc/Sheet: `ADX – Thông tin xây dựng Website` (cần quyền “Anyone with the link” hoặc tải thủ công).
- Banner `roadshow-xe-ban-tai-toshiba.png` không có đúng tên → fallback `roadshow-toshiba-dmx-01.jpg`.
- Nestea / Chuyện Nhà: không có ảnh dự án rõ trong Drive dump → cover placeholder nền tối.
- Video OOH 163MB nằm trong `assets-raw/03. Video/` (gitignored), không seed vào Media.

## Upload size

- Payload 3.93 `UploadConfig` không còn `limits.fileSize` → chặn 15MB bằng hook `beforeValidate` trên Media.

## Deploy

- Ưu tiên Netlify theo brief; nếu function limit → Railway.
- Môi trường agent hiện không có Netlify/Railway/Neon/R2 credentials → chưa deploy production trong PR này; cần August cấp env rồi `pnpm seed` trên DB prod.
