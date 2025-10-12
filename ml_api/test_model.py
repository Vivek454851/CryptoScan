#!/usr/bin/env python3
"""
Direct model testing without server
"""
import joblib
import numpy as np
from sklearn.preprocessing import LabelEncoder
from utils import featurize_text

def test_model_directly():
    print("🔍 Testing model directly...")
    
    # Load model
    try:
        model = joblib.load("cipher_model.pkl")
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return False
    
    # Create label encoder with the actual algorithms from your training dataset
    algorithms = ['AES', 'Blowfish', 'ChaCha20', 'DES', 'RC4', 'RSA', 'SHA-256', '3DES']
    label_encoder = LabelEncoder()
    label_encoder.fit(algorithms)
    print("✅ Label encoder created")
    
    # Test texts
    test_texts = [
        "4d2f8b5c3e1a9f7b",  # Hex-like
        "QWxhZGRpbjpvcGVuIHNlc2FtZQ==",  # Base64
        "Hello World",  # Plain text
        "aGVsbG8gd29ybGQ=",  # Base64 encoded "hello world"
        "48656c6c6f20576f726c64",  # Hex encoded "Hello World"
    ]
    
    for text in test_texts:
        print(f"\n🔍 Testing: {text}")
        try:
            # Extract features
            features = featurize_text(text)
            print(f"Features: {features}")
            
            # Make prediction
            features_df = np.array([features]).reshape(1, -1)
            encoded_pred = model.predict(features_df)[0]
            probs = model.predict_proba(features_df)[0]
            
            # Decode prediction
            predicted_algo = label_encoder.inverse_transform([encoded_pred])[0]
            confidence = np.max(probs)
            
            print(f"✅ Predicted: {predicted_algo}")
            print(f"✅ Confidence: {confidence:.3f}")
            
            # Top 3 predictions
            top_indices = np.argsort(probs)[::-1][:3]
            print("Top 3 predictions:")
            for i, idx in enumerate(top_indices):
                algo = label_encoder.inverse_transform([idx])[0]
                prob = probs[idx]
                print(f"  {i+1}. {algo}: {prob:.3f}")
                
        except Exception as e:
            print(f"❌ Prediction failed: {e}")
    
    return True

if __name__ == "__main__":
    test_model_directly()
