const localData = [
    { "prompt": "xin chào", "completion": "Xin chào! Mình là trợ lý của cô Ngọc Điệp. Bạn có thể hỏi mình những thắc mắc về bài học vừa rồi, mình sẽ giải đáp nhé! 😊📚" },
    { "prompt": "cô là ai", "completion": "Cô là Ngọc Điệp, giáo viên Tiểu học, chuyên dạy môn Toán lớp 4. Cô rất vui được đồng hành cùng các em! 📚✨" },
    { "prompt": "cô giáo là ai", "completion": "Cô giáo của các em là cô Nguyễn Thị Ngọc Điệp, cô dạy môn Toán lớp 4." },
    { "prompt": "giới thiệu", "completion": "Chào các em! Cô là trợ lý học toán lớp 4, được tạo ra để giúp các em học toán vui vẻ và hiệu quả hơn. Cô Nguyễn Thị Ngọc Điệp luôn sẵn sàng hỗ trợ các em!" },
    { "prompt": "1 tấn bằng bao nhiêu", "completion": "1 tấn = 10 tạ = 1000 kg 📊\n\nVí dụ: Một xe tải chở 2 tấn gạo = 20 tạ = 2000 kg gạo nhé!" },
    { "prompt": "1 tạ bằng bao nhiêu", "completion": "1 tạ = 100 kg = 10 yến 📊\n\nVí dụ: Một bao gạo nặng 1 tạ = 100 kg = 10 yến" },
    { "prompt": "1 yến bằng bao nhiêu", "completion": "1 yến = 10 kg ⚖️\n\nVí dụ: 5 yến = 50 kg" },
    { "prompt": "đổi 5 tấn", "completion": "5 tấn = 50 tạ = 5000 kg 🚛\n\nCách đổi:\n- 5 tấn × 10 = 50 tạ\n- 5 tấn × 1000 = 5000 kg" },
    { "prompt": "đổi 250 kg", "completion": "250 kg = 2,5 tạ = 25 yến ⚖️\n\nCách đổi:\n- 250 kg ÷ 100 = 2,5 tạ\n- 250 kg ÷ 10 = 25 yến" },
    { "prompt": "cộng trừ khối lượng", "completion": "Khi cộng trừ các đơn vị khối lượng, các em cần:\n\n1️⃣ Đổi về cùng đơn vị\n2️⃣ Thực hiện phép tính\n3️⃣ Viết kết quả\n\nVí dụ: 2 tấn + 5 tạ = ?\n- Đổi: 2 tấn = 20 tạ\n- Tính: 20 tạ + 5 tạ = 25 tạ\n- Hoặc: 25 tạ = 2,5 tấn = 2500 kg" }
];

const allSuggestions = [
    "1 tấn bằng bao nhiêu tạ?",
    "1 tạ bằng bao nhiêu yến?",
    "1 yến bằng bao nhiêu kg?",
    "Đổi 5 tấn ra kg",
    "Đổi 250 kg ra tạ",
    "Cộng trừ các đơn vị khối lượng",
    "Bài toán về cân nặng",
    "So sánh tấn, tạ, yến",
    "Đổi đơn vị khối lượng",
    "Tính tổng khối lượng hàng hóa"
];

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const errorMessage = document.getElementById('error-message');
const previewMessage = document.getElementById('preview-message');
const imageInput = document.getElementById('image-input');
const suggestionsContainer = document.getElementById('suggestions-container');

// Kiểm tra khi trang load
window.addEventListener('load', function() {
const voiceButton = document.querySelector('button[title="Chat bằng giọng nói"]');
if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    voiceButton.style.display = 'none';
}
});

function getRandomSuggestions(exclude = []) {
    const filtered = allSuggestions.filter(s => !exclude.includes(s));
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}

function displaySuggestions(currentSuggestions) {
    suggestionsContainer.innerHTML = '';
    currentSuggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.classList.add('suggestion');
        suggestionDiv.title = suggestion;
        suggestionDiv.textContent = suggestion;
        suggestionDiv.onclick = () => {
            userInput.value = suggestion;
            sendMessage();
            const newSuggestions = getRandomSuggestions([suggestion]);
            displaySuggestions(newSuggestions);
        };
        suggestionsContainer.appendChild(suggestionDiv);
    });
}

displaySuggestions(getRandomSuggestions());

function findBestMatch(input) {
    const normalizedInput = input.toLowerCase().trim();
    for (let item of localData) {
        const keywords = item.prompt.split(' ');
        if (keywords.every(k => normalizedInput.includes(k))) {
            return item.completion;
        }
    }
    return null;
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading-message');
    loadingDiv.id = 'loading-message';
    loadingDiv.textContent = 'Đang xử lý...';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return loadingDiv;
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    userInput.value = '';
    previewMessage.style.display = 'none';

    // Kiểm tra local data trước
    const localResponse = findBestMatch(message);
    if (localResponse) {
        appendMessage('gemini', localResponse);
        return;
    }

    const loadingDiv = showLoading();

    try {
        // Gửi request POST tới Flask API /api/chat
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        hideLoading();

        const data = await response.json();
        if (!response.ok) {
            console.error('Lỗi server:', data);
            
            // Nếu lỗi quota, hiển thị thông báo thân thiện
            if (data.error && data.error.toLowerCase().includes('quota')) {
                appendMessage('gemini', '⚠️ Xin lỗi em, hiện tại cô đang gặp vấn đề với hệ thống AI (đã hết quota miễn phí). Em có thể:\n\n1️⃣ Hỏi các câu hỏi cơ bản về tấn, tạ, yến (cô có sẵn câu trả lời)\n2️⃣ Đợi cô cập nhật API key mới\n3️⃣ Liên hệ cô Ngọc Điệp để được hỗ trợ trực tiếp\n\nCác câu hỏi em có thể hỏi ngay:\n- "1 tấn bằng bao nhiêu?"\n- "Đổi 5 tấn ra kg"\n- "Cộng trừ khối lượng"');
            } else {
                appendMessage('gemini', `Lỗi: ${data.error || 'Không thể kết nối đến server'}`);
            }
            return;
        }

        appendMessage('gemini', data.reply);
    } catch (error) {
        hideLoading();
        console.error('Lỗi kết nối mạng:', error);
        appendMessage('gemini', `⚠️ Lỗi kết nối: ${error.message}\n\nEm có thể thử hỏi các câu hỏi cơ bản về đơn vị khối lượng nhé!\n(Trường hợp nếu bạn chưa khởi chạy NodeJS backend vui lòng chạy \`node server.js\`)`);
    }
}

function formatAIMessage(text) {
    // Loại bỏ các dấu *** không cần thiết
    text = text.replace(/\*\*\*/g, '');

    // Chuyển đổi **text** thành <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Chuyển đổi *text* thành <em>text</em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Xử lý danh sách (- hoặc •)
    text = text.replace(/^\s*[-•]\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Thay thế xuống dòng thành <br>
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');

    // Bọc các đoạn văn bằng <p> nếu chúng chứa nội dung
    if (text.includes('</p><p>')) {
        text = '<p>' + text + '</p>';
    }

    return text;
}

function appendMessage(sender, message, imageUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'gemini-message');

    if (imageUrl) {
        messageDiv.classList.add('image-message');
        const img = document.createElement('img');
        img.src = imageUrl;
        messageDiv.appendChild(img);
    }

    if (message) {
        const textDiv = document.createElement('div');
        if (sender === 'gemini') {
            textDiv.innerHTML = formatAIMessage(message);
        } else {
            textDiv.innerHTML = message.replace(/\n/g, "<br>");
        }
        messageDiv.appendChild(textDiv);
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(err => {
            console.error('Lỗi MathJax:', err);
        });
    }
}

userInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') sendMessage();
});

function startRecognition() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        alert('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.');
        return;
    }

    // Hiển thị loading "đang nghe"
    const listeningDiv = document.createElement('div');
    listeningDiv.classList.add('loading-message');
    listeningDiv.id = 'listening-message';
    listeningDiv.textContent = '🎤 Đang nghe...';
    listeningDiv.style.backgroundColor = '#e3f7e6';
    chatBox.appendChild(listeningDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'vi-VN';

    recognition.onstart = function () {
        const listeningMsg = document.getElementById('listening-message');
        if (listeningMsg) {
            listeningMsg.textContent = '🎤 Đang nghe...';
        }
    };

    recognition.onresult = function (event) {
        const voiceInput = event.results[0][0].transcript;
        userInput.value = voiceInput;
        previewMessage.innerText = `Bạn vừa nói: "${voiceInput}"`;
        previewMessage.style.display = 'block';

        // Xóa loading message
        const listeningMsg = document.getElementById('listening-message');
        if (listeningMsg) {
            listeningMsg.remove();
        }
    };

    recognition.onerror = function (event) {
        // Xóa loading message khi có lỗi
        const listeningMsg = document.getElementById('listening-message');
        if (listeningMsg) {
            listeningMsg.remove();
        }
        alert('Lỗi nhận dạng giọng nói: ' + event.error);
    };

    recognition.onend = function () {
        // Xóa loading message khi kết thúc
        const listeningMsg = document.getElementById('listening-message');
        if (listeningMsg) {
            listeningMsg.remove();
        }
    };

    recognition.start();
}

async function handleImageUpload() {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (event) {
        const base64Image = event.target.result;
        const base64Data = base64Image.split(',')[1];

        appendMessage('user', 'Bạn đã tải lên 1 hình ảnh, đợi tôi một chút...', base64Image);

        const loadingDiv = showLoading();

        try {
            // Gửi dữ liệu base64 qua Flask API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'Hãy phân tích và mô tả nội dung của hình ảnh này một cách chi tiết, đặc biệt là các bài toán.',
                    image: {
                        mimeType: file.type,
                        data: base64Data
                    }
                })
            });

            hideLoading();

            const data = await response.json();
            if (!response.ok) {
                console.error('Lỗi server:', data);
                appendMessage('gemini', `Lỗi: ${data.error || 'Không thể phân tích hình ảnh'}`);
                return;
            }

            appendMessage('gemini', data.reply);
        } catch (error) {
            hideLoading();
            console.error('Lỗi kết nối mạng:', error);
            appendMessage('gemini', `Lỗi kết nối mạng khi phân tích hình ảnh: ${error.message}\n(Trường hợp nếu bạn chưa khởi chạy NodeJS backend vui lòng chạy \`node server.js\`)`);
        }
    };

    reader.readAsDataURL(file);
}
