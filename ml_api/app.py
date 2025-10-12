# ml_api/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
from utils import featurize_text  # ✅ Import the feature extraction function

app = FastAPI(title="Cipher Algorithm Detection API")

# Allow local frontend access
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestBody(BaseModel):
    text: str

# ✅ Load the trained model and label encoder
MODEL_PATH = "cipher_model.pkl"
ENCODER_PATH = "label_encoder.pkl"  # ✅ Define the encoder path

try:
    model = joblib.load(MODEL_PATH)
    # Create label encoder with the actual algorithms from your training dataset
    from sklearn.preprocessing import LabelEncoder
    label_encoder = LabelEncoder()
    # Algorithms from your training dataset
    algorithms = ['AES', 'Blowfish', 'ChaCha20', 'DES', 'RC4', 'RSA', 'SHA-256', '3DES']
    label_encoder.fit(algorithms)
    print("✅ Model and encoder loaded successfully.")
except Exception as e:
    print("❌ Failed to load model or encoder:", e)
    model = None
    label_encoder = None


@app.post("/predict")
def predict(req: RequestBody):
    if model is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="Model or encoder not loaded")

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Ciphertext input is required")

    try:
        # ✅ Extract numerical features
        features = featurize_text(text)
        features_df = pd.DataFrame([features])

        # ✅ Predict algorithm
        encoded_pred = model.predict(features_df)[0]
        probs = model.predict_proba(features_df)[0]

        # ✅ Decode back to algorithm name
        predicted_algo = label_encoder.inverse_transform([encoded_pred])[0]

        # ✅ Top 3 predictions
        top_indices = np.argsort(probs)[::-1][:3]
        top_predictions = [
            {"label": label_encoder.inverse_transform([i])[0], "prob": float(probs[i])}
            for i in top_indices
        ]

        return {
            "algorithm": predicted_algo,
            "confidence": float(np.max(probs)),
            "top": top_predictions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "encoder_loaded": label_encoder is not None
    }


@app.get("/")
def root():
    """Root endpoint with API information"""
    return {
        "message": "Cipher Algorithm Detection API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "docs": "/docs"
        }
    }
