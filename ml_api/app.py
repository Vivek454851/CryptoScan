# ml_api/app.py

from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import os

from utils import featurize_text, featurize_bytes

# -------------------------------
# App Init
# -------------------------------
app = FastAPI(title="Cipher Algorithm Detection API")

# -------------------------------
# CORS
# -------------------------------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://cryptoscan.vercel.app",
]

if os.getenv("ENVIRONMENT") == "development":
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Request Model
# -------------------------------
class RequestBody(BaseModel):
    text: str

# -------------------------------
# Load ML Model
# -------------------------------
MODEL_PATH = "cipher_model.pkl"

try:
    model = joblib.load(MODEL_PATH)

    from sklearn.preprocessing import LabelEncoder
    label_encoder = LabelEncoder()

    algorithms = [
        "AES", "Blowfish", "ChaCha20",
        "DES", "RC4", "RSA", "SHA-256", "3DES"
    ]
    label_encoder.fit(algorithms)

    print("✅ Model and encoder loaded successfully.")
except Exception as e:
    print("❌ Failed to load model or encoder:", e)
    model = None
    label_encoder = None

# -------------------------------
# TEXT Prediction
# -------------------------------
@app.post("/predict")
def predict(req: RequestBody):
    if model is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Ciphertext input is required")

    try:
        features = featurize_text(text)
        df = pd.DataFrame([features])

        probs = model.predict_proba(df)[0]
        pred = int(np.argmax(probs))

        return {
            "algorithm": label_encoder.inverse_transform([pred])[0],
            "confidence": float(np.max(probs))
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# -------------------------------
# FILE Prediction (FIXED)
# -------------------------------
@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    if model is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # ✅ Read file content
        content = await file.read()

        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        # ✅ Correct file size check
        if len(content) > 2 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 2MB)")

        # 🔍 Feature extraction
        features = featurize_bytes(content)
        df = pd.DataFrame([features])

        probs = model.predict_proba(df)[0]
        pred = int(np.argmax(probs))

        return {
            "filename": file.filename,
            "algorithm": label_encoder.inverse_transform([pred])[0],
            "confidence": float(np.max(probs))
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"File analysis failed: {str(e)}"
        )

# -------------------------------
# Health Check
# -------------------------------
@app.get("/health")
def health():
    return {
        "status": "healthy" if model and label_encoder else "unhealthy",
        "model_loaded": model is not None,
        "encoder_loaded": label_encoder is not None
    }
