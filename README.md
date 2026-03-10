# 🎓 Trợ lý học toán lớp 4 - Cùng Cô Nguyễn Thị Ngọc Điệp

Ứng dụng Web Chatbot hỗ trợ học sinh lớp 4 giải quyết các bài toán liên quan đến đơn vị đo khối lượng (tấn, tạ, yến,...). Chatbot được tích hợp trí tuệ nhân tạo **Google Gemini 2.5 Flash**, hỗ trợ trò chuyện bằng văn bản, giọng nói và đặc biệt là tính năng tải ảnh bài tập lên để hỏi đáp.

![Demo](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Backend-Python%20Flask-blue)
![Gemini](https://img.shields.io/badge/AI_Model-Gemini%202.5%20Flash-orange)

## ✨ Tính năng nổi bật

- Giải đáp bài tập toán học qua tin nhắn.
- Tự động gợi ý các câu hỏi học tập xoay quanh: 1 tấn bằng bao nhiêu, cộng trừ khối lượng...
- Trò chuyện và nhận diện qua Giọng nói (Microphone).
- Hỗ trợ tải File ảnh (Vision) để AI tự đọc đề bài và hướng dẫn giải.

## 🛠 Hướng dẫn chạy ở máy cá nhân (Local)

### 1. Cài đặt môi trường

Chắc chắn rằng máy bạn đã cài đặt Python (phiên bản 3.9 trở lên). Sau đó mở Terminal/Command Prompt trong thư mục dự án:

```bash
# Cài đặt các thư viện yêu cầu
pip install -r requirements.txt
```

### 2. Cấu hình API Key của Google Gemini

Tạo một tệp tin mang tên `.env` nằm ở thư mục gốc của dự án nếu chưa có.
Lấy API Key miễn phí từ [Google AI Studio](https://aistudio.google.com/app/apikey) và điền vào theo mẫu sau:

```env
API_KEY_GEMINI=AIzaSy... (Điền key của bạn vào đây)
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Khởi chạy Server

```bash
# Khởi động backend Flask
python api/index.py
```

Sau khi Terminal báo thành công, mở trình duyệt lên và truy cập vào địa chỉ: **[http://localhost:5000](http://localhost:5000)**

---

## 🚀 Hướng dẫn triển khai miễn phí (Deploy) lên Vercel

Dự án này đã được thiết kế sẵn sàng 100% để phục vụ trên hệ thống Serverless của **Vercel** (với tệp `vercel.json` đi kèm).

1. Đăng ký/Đăng nhập vào [Vercel](https://vercel.com/).
2. Kết nối tài khoản GitHub của bạn và chọn dự án `chat_bot_use_gemini` để Import.
3. Trong bước cấu hình trước khi Deploy, mở phần **Environment Variables** (Biến môi trường) và thêm key:
   - **Name**: `API_KEY_GEMINI`
   - **Value**: *(Dán mã API Key của Google Gemini ở bước trên vào đây)*
4. Nhấn **Deploy** và chờ khoảng 30s. Bạn sẽ nhận được 1 đường dẫn chia sẻ (Domain public) chatbot xịn xò của chính mình.

## 📦 Cấu trúc Thư mục

```text
├── api/
│   └── index.py            # Backend Python Flask Serverless
├── static/
│   ├── css/style.css       # Giao diện CSS
│   └── js/script.js        # File xử lý Javascript Front-end
├── index.html              # Trang chủ giao diện Web
├── requirements.txt        # Các gói thư viện phụ thuộc Python
├── vercel.json             # File cấu hình deploy Vercel
└── .env                    # (Nên chặn bởi gitignore) Chứa API Key
```

## Khác
> Trợ lý được thiết kế tuỳ chỉnh dành riêng cho các em học sinh lớp 4 của Cô Ngọc Điệp, giọng điệu phản hồi sẽ thân thiện, rõ ràng, luôn có ví dụ trực quan đính kèm. Khuyến khích sử dụng chế độ Chat bằng giọng nói để trải nghiệm trực quan nhất!
