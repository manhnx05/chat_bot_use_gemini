// ============================================================
//  api/chat.js - Vercel Serverless Function
//  - Đọc GEMINI_API_KEY từ process.env (local .env hoặc Vercel Env Vars)
//  - Proxy request từ frontend đến Gemini API
//  - API key KHÔNG BAO GIỜ xuất hiện ở client/browser
// ============================================================

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

module.exports = async (req, res) => {
    // Chỉ cho phép POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Đọc API key từ biến môi trường
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    if (!apiKey) {
        return res.status(500).json({
            error: 'Chưa cấu hình GEMINI_API_KEY trong biến môi trường. Vui lòng thêm vào file .env (local) hoặc Vercel Environment Variables.'
        });
    }

    const { message, image } = req.body;

    if (!message && !image) {
        return res.status(400).json({ error: 'Thiếu nội dung tin nhắn hoặc hình ảnh.' });
    }

    // Xây dựng parts cho request
    const parts = [];

    if (message) {
        parts.push({ text: message });
    }

    if (image) {
        // image = { mimeType: 'image/jpeg', data: '<base64>' }
        if (parts.length === 0) {
            parts.push({ text: 'Hãy phân tích và mô tả nội dung của hình ảnh này một cách chi tiết.' });
        }
        parts.push({
            inline_data: {
                mime_type: image.mimeType,
                data: image.data
            }
        });
    }

    try {
        const geminiRes = await fetch(
            `${GEMINI_API_BASE}/${modelName}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts }]
                })
            }
        );

        const data = await geminiRes.json();

        if (!geminiRes.ok) {
            const errMsg = data?.error?.message || 'Lỗi không xác định từ Gemini API';
            console.error('[Gemini API Error]', data);
            return res.status(geminiRes.status).json({ error: errMsg });
        }

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) {
            return res.status(500).json({ error: 'Không nhận được phản hồi hợp lệ từ Gemini API.' });
        }

        return res.status(200).json({ reply });

    } catch (error) {
        console.error('[Server Error]', error);
        return res.status(500).json({ error: `Lỗi kết nối đến Gemini API: ${error.message}` });
    }
};
