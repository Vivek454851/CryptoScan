# CryptoScan - Cryptographic Algorithm Detection System

## Overview

CryptoScan is a full-stack application that uses machine learning to detect cryptographic algorithms from ciphertext. The system consists of:

1. **Frontend**: Next.js application with React components
2. **Backend API**: Next.js API routes for user management and authentication
3. **ML API**: FastAPI service for cryptographic algorithm detection
4. **Database**: MongoDB for user data storage

## Project Structure

```
CryptoScan-main/
├── CryptoScan/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/               # App Router pages and API routes
│   │   ├── components/        # React components
│   │   ├── lib/              # Utility functions
│   │   └── models/           # Database models
│   └── package.json
└── ml_api/                    # Machine Learning API
    ├── app.py                # FastAPI application
    ├── utils.py              # Feature extraction utilities
    ├── cipher_model.pkl      # Trained ML model
    └── requirements.txt      # Python dependencies
```

## Features

### Frontend Features
- **User Authentication**: Sign up, sign in, email verification
- **Dashboard**: User dashboard with sidebar navigation
- **Text Analysis**: Analyze ciphertext directly in the browser
- **File Upload**: Upload and analyze cryptographic files
- **Responsive Design**: Modern UI with Tailwind CSS

### ML API Features
- **Algorithm Detection**: Predicts cryptographic algorithms from text
- **Confidence Scores**: Provides confidence levels for predictions
- **Top Predictions**: Shows top 3 algorithm candidates
- **Feature Extraction**: Analyzes text characteristics (entropy, encoding, etc.)

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB (local or cloud)

### 1. Frontend Setup (Next.js)

```bash
cd CryptoScan
npm install
```

Create environment variables:
```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/cryptoscan
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
ML_API_URL=http://127.0.0.1:8000
```

### 2. ML API Setup (FastAPI)

```bash
cd ml_api
pip install -r requirements.txt
```

### 3. Running the Application

#### Start ML API Server
```bash
cd ml_api
python -c "import uvicorn; uvicorn.run('app:app', host='127.0.0.1', port=8000, log_level='info')"
```

#### Start Frontend Server
```bash
cd CryptoScan
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- ML API: http://127.0.0.1:8000
- ML API Docs: http://127.0.0.1:8000/docs

## API Endpoints

### ML API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /predict` - Predict cryptographic algorithm

#### Predict Endpoint
```json
POST /predict
{
  "text": "4d2f8b5c3e1a9f7b"
}
```

Response:
```json
{
  "algorithm": "RSA",
  "confidence": 0.780,
  "top": [
    {"label": "RSA", "prob": 0.780},
    {"label": "Hex", "prob": 0.130},
    {"label": "Caesar", "prob": 0.090}
  ]
}
```

### Frontend API Endpoints

- `POST /api/predict` - Proxy to ML API
- `POST /api/register` - User registration
- `POST /api/auth/[...nextauth]` - Authentication
- `POST /api/otp/send` - Send OTP
- `POST /api/otp/verify` - Verify OTP

## Testing

### Test ML Model Directly
```bash
cd ml_api
python test_model.py
```

### Test ML API
```bash
cd ml_api
python test_api.py
```

### Test Frontend Integration
1. Start both servers
2. Navigate to http://localhost:3000/analyze
3. Enter ciphertext and click "Analyze Cipher"

## Model Information

The ML model is a Random Forest Classifier trained to detect:
- AES
- Blowfish
- ChaCha20
- DES
- RC4
- RSA
- SHA-256
- 3DES

### Features Used
1. Text length
2. Letter percentage
3. Digit percentage
4. Hex character percentage
5. Base64 flag
6. Shannon entropy
7. Average character ordinal
8. Space percentage

## Troubleshooting

### Common Issues

1. **ML API not starting**: Check Python dependencies are installed
2. **Frontend can't connect to ML API**: Verify ML_API_URL in environment variables
3. **Model loading errors**: Ensure cipher_model.pkl exists in ml_api directory
4. **Database connection issues**: Check MongoDB is running and MONGODB_URI is correct

### Port Conflicts
- Frontend: 3000
- ML API: 8000
- MongoDB: 27017

## Development

### Adding New Features
1. Frontend components go in `src/components/`
2. API routes go in `src/app/api/`
3. ML model improvements go in `ml_api/`

### Model Training
To retrain the model, you would need:
1. Training dataset with labeled ciphertext
2. Feature extraction pipeline
3. Model training script
4. Model serialization

## Security Notes

- Never commit API keys or secrets
- Use environment variables for configuration
- Implement proper authentication for production
- Validate all user inputs
- Use HTTPS in production

## License

This project is for educational and research purposes.
