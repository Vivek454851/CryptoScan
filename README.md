# CryptoScan - Cryptographic Algorithm Detection System

## 🚀 Quick Start

### 1. Install Dependencies

**Frontend (Next.js):**
```bash
cd CryptoScan
npm install
```

**ML API (Python):**
```bash
cd ml_api
pip install -r requirements.txt
```

### 2. Environment Setup

Create `CryptoScan/.env.local` with:
```env
MONGODB_URI=mongodb://localhost:27017/cryptoscan
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
ML_API_URL=http://127.0.0.1:8000
```

### 3. Start Servers

**Option 1: Use the batch script (Windows)**
```bash
start_servers.bat
```

**Option 2: Manual start**
```bash
# Terminal 1 - ML API
cd ml_api
python -c "import uvicorn; uvicorn.run('app:app', host='127.0.0.1', port=8000, log_level='info')"

# Terminal 2 - Frontend
cd CryptoScan
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **ML API**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs

## 🧪 Testing

Run the integration test:
```bash
python test_integration.py
```

## 📋 Features

- **Text Analysis**: Analyze ciphertext directly in the browser
- **File Upload**: Upload and analyze cryptographic files
- **User Authentication**: Sign up, sign in, email verification
- **Algorithm Detection**: ML-powered cryptographic algorithm detection
- **Confidence Scores**: Get confidence levels for predictions

## 🔧 Troubleshooting

1. **ML API not starting**: Check Python dependencies
2. **Frontend can't connect**: Verify ML_API_URL in .env.local
3. **Database issues**: Ensure MongoDB is running

## 📚 Documentation

See `SETUP.md` for detailed setup instructions and API documentation.
