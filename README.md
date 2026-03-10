# 🎓 Trợ lý học Toán Lớp 4 (Chatbot E-Learning)

Dự án Chatbot hỗ trợ học sinh lớp 4 học Toán, tích hợp AI thông qua **Google Gemini API**. 
Dự án được thiết kế để triển khai dễ dàng lên **Vercel** bằng Serverless Functions nhằm bảo mật API Key.

## ✨ Tính năng
- Hỏi đáp các bài toán lớp 4 (Đo lường, khối lượng: Tấn, tạ, yến,...).
- Hỗ trợ **nhập liệu bằng giọng nói** (Web Speech API).
- Hỗ trợ **phân tích hình ảnh** bài toán bằng AI (Gemini Vision).
- Gợi ý câu hỏi nhanh cho học sinh.
- Render công thức toán học chuẩn bằng MathJax.

---

## 🛠 Cấu trúc thư mục

```text
├── api/
│   └── chat.js          # Vercel Serverless Function (Xử lý gọi Gemini API)
├── index.html           # Giao diện chính của Chatbot (Frontend thuần)
├── vercel.json          # Cấu hình Vercel routing
├── .env                 # (Chỉ ở Local) Biến môi trường chứa GEMINI_API_KEY
├── .gitignore           # Bỏ qua các file nhạy cảm khi push lên Git
└── config.example.js    # File mẫu (không sử dụng, chỉ để tham khảo lịch sử)
```

---

## 🚀 Hướng dẫn chạy thử ở Local (Máy cá nhân)

Để chạy dự án này trên máy cá nhân mà code vẫn hoạt động đúng như khi deploy lên Vercel, bạn cần sử dụng **Vercel CLI**.

**Bước 1:** Cài đặt Vercel CLI thông qua npm:
```bash
npm install -g vercel
```

**Bước 2:** Tạo file `.env` ở thư mục gốc của dự án (ngang hàng với `index.html`) và điền API Key của bạn:
```env
GEMINI_API_KEY=AI... (Điền API Key lấy từ Google AI Studio)
GEMINI_MODEL=gemini-2.0-flash
```
*(Lưu ý: File `.env` đã được đưa vào `.gitignore` để tránh bị push nhầm lên GitHub).*

**Bước 3:** Chạy Server:
```bash
vercel dev
```
Mở trình duyệt truy cập vào `http://localhost:3000` để sử dụng.

---

## ☁️ Hướng dẫn Deploy lên Vercel (Production)

Vì dự án đã cấu hình sẵn thư mục `api/` và file `vercel.json`, việc deploy lên Vercel chỉ mất 1 phút:

1. Push toàn bộ source code này lên GitHub của bạn.
2. Đăng nhập vào [Vercel](https://vercel.com/dashboard) và nhấn **Add New... > Project**.
3. Import Repository chứa code này từ GitHub.
4. Ở bước **Configure Project**, mở rộng thẻ **Environment Variables** và thêm 2 biến sau:
   - `GEMINI_API_KEY` = `<API_KEY_CỦA_BẠN>`
   - `GEMINI_MODEL` = `gemini-2.0-flash`
5. Nhấn **Deploy** và đợi Vercel xử lý.
6. Hoàn tất! Vercel sẽ cung cấp cho bạn 1 đường link public để sử dụng chatbot.
