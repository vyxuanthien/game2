# Realtime Physics Quiz - Trò Chơi Trắc Nghiệm Vật Lí Nhiệt (Loại Trực Tiếp)

Hệ thống trắc nghiệm trực tuyến thời gian thực sử dụng **Node.js, Express và Socket.IO**, được thiết kế để tổ chức các cuộc thi kiến thức tương tác cao với cơ chế lọc loại qua các vòng: **50 -> 40 -> 30 -> 20 -> 10 -> 6 -> 3 -> 1 người**.

---

## 📁 Cấu trúc Thư mục Dự án

```text
realtime-physics-quiz/
├── public/
│   ├── index.html       # Giao diện thi đấu dành cho học sinh (trên điện thoại)
│   └── admin.html       # Giao diện điều khiển dành cho giáo viên / Ban tổ chức
├── server/
│   ├── config/
│   │   └── questions.json
│   ├── sockets/
│   │   └── gameSocket.js
│   └── gameManager.js
├── package.json
└── server.js
```

---

## 🚀 Hướng dẫn Đưa dự án lên GitHub và Deploy lên Render.com

### Bước 1: Tạo Repository trên GitHub
1. Truy cập [github.com](https://github.com) và đăng nhập tài khoản của bạn.
2. Tạo một Repository mới (ví dụ đặt tên: `realtime-physics-quiz`), để ở chế độ **Public** và bấm **Create repository**.
3. Giải nén file ZIP này vào một thư mục trên máy tính, mở terminal tại thư mục đó và chạy các lệnh sau:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Realtime Physics Quiz"
   git branch -M main
   git remote add origin https://github.com/TEN_TAI_KHOAN_GITHUB/realtime-physics-quiz.git
   git push -u origin main
   ```

### Bước 2: Đưa lên Render.com (Miễn phí & Hỗ trợ WebSocket tốt)
1. Truy cập [render.com](https://render.com) và đăng nhập bằng tài khoản GitHub của bạn.
2. Trên Dashboard, bấm nút **New +** ở góc trên bên phải và chọn **Web Service**.
3. Kết nối tới repository `realtime-physics-quiz` mà bạn vừa tạo trên GitHub.
4. Cấu hình thông tin dịch vụ (Service Settings):
   * **Name:** `realtime-physics-quiz`
   * **Region:** Chọn khu vực gần nhất (ví dụ: *Singapore*).
   * **Branch:** `main`
   * **Root Directory:** *(Để trống)*
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
   * **Instance Type:** Chọn **Free** (Miễn phí).
5. Bấm **Create Web Service**. 

Render sẽ tự động build và cung cấp cho bạn một đường link public (ví dụ: `https://realtime-physics-quiz.onrender.com`).
