# ⚠️ CẢNH BÁO BẢO MẬT

## API Key đã bị lộ trong commit trước

API Key Gemini của bạn đã bị lộ trong file `config.js`:
```
AIzaSyCc6rVl5ZXOjf6Dwp9tMItOllhKzo09jwo
```

## Hành động cần làm NGAY:

### 1. Vô hiệu hóa API Key cũ
- Truy cập: https://aistudio.google.com/app/apikey
- Tìm key `AIzaSyCc6rVl5ZXOjf6Dwp9tMItOllhKzo09jwo`
- Nhấn **Delete** hoặc **Revoke** để vô hiệu hóa

### 2. Tạo API Key mới
- Tại cùng trang, nhấn **Create API Key**
- Copy key mới

### 3. Cập nhật file .env
Tạo/cập nhật file `.env` ở thư mục gốc:
```env
GEMINI_API_KEY=<KEY_MỚI_CỦA_BẠN>
GEMINI_MODEL=gemini-2.0-flash
```

### 4. Kiểm tra .gitignore
Đảm bảo file `.gitignore` có các dòng sau:
```
.env
.env.local
.env.*.local
config.js
```

### 5. Xóa lịch sử Git (Nếu đã push lên GitHub)
Nếu bạn đã push code lên GitHub, API key cũ vẫn còn trong lịch sử commit. Bạn cần:

**Cách 1: Xóa repository và tạo mới (Đơn giản nhất)**
- Xóa repository trên GitHub
- Tạo repository mới
- Push code đã fix lên

**Cách 2: Dùng BFG Repo-Cleaner (Nâng cao)**
```bash
# Cài đặt BFG
# Download từ: https://rtyley.github.io/bfg-repo-cleaner/

# Xóa file config.js khỏi lịch sử
bfg --delete-files config.js

# Dọn dẹp
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

## Các thay đổi đã được thực hiện:

✅ Xóa API key trong `config.js`
✅ Sửa chức năng upload ảnh để gọi qua `/api/chat` thay vì gọi trực tiếp Gemini API
✅ Loại bỏ các tham chiếu không cần thiết đến API key ở frontend

## Lưu ý quan trọng:

- File `config.js` không còn được sử dụng nữa, mọi cấu hình đều qua file `.env`
- API key KHÔNG BAO GIỜ được đặt trong code
- Luôn kiểm tra `.gitignore` trước khi commit
- Khi deploy lên Vercel, thêm `GEMINI_API_KEY` vào Environment Variables

---

**Sau khi hoàn thành các bước trên, bạn có thể xóa file này.**
