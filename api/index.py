from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Lấy đường dẫn thư mục gốc (chứa api, static, index.html)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__, static_folder=os.path.join(BASE_DIR, 'static'), static_url_path='/static')

GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

@app.route('/')
def index():
    # File HTML render trên thư mục cha
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    api_key = os.environ.get('API_KEY_GEMINI')
    model_name = os.environ.get('GEMINI_MODEL', 'gemini-2.5-flash')

    if not api_key:
        return jsonify({'error': 'API_KEY_GEMINI is missing from .env'}), 500

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Invalid request JSON.'}), 400

    message = data.get('message')
    image = data.get('image')

    contents = []

    # Handle images + text
    if image:
        contents = [{
            'parts': [
                {'text': message or 'Hãy phân tích và mô tả nội dung của hình ảnh này một cách chi tiết.'},
                {
                    'inline_data': {
                        'mime_type': image.get('mimeType'),
                        'data': image.get('data')
                    }
                }
            ]
        }]
    # Handle text only
    elif message:
        contents = [{
            'parts': [{'text': message}]
        }]
    else:
        return jsonify({'error': 'Thiếu nội dung tin nhắn hoặc hình ảnh.'}), 400

    url = f"{GEMINI_API_BASE}/{model_name}:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    payload = {'contents': contents}

    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()

        if not response.ok:
            error_msg = response_data.get('error', {}).get('message', 'Lỗi không xác định từ Gemini API')
            print('[Gemini API Error]', response_data)
            return jsonify({'error': error_msg}), response.status_code

        # Extract reply from response
        candidates = response_data.get('candidates', [])
        if not candidates:
            return jsonify({'error': 'Không nhận được phản hồi hợp lệ từ Gemini API.'}), 500
        
        reply = candidates[0].get('content', {}).get('parts', [{}])[0].get('text')
        
        if not reply:
            return jsonify({'error': 'Không nhận được phản hồi hợp lệ từ Gemini API.'}), 500

        return jsonify({'reply': reply})

    except Exception as e:
        print('[Server Error]', e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
