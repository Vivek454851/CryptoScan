#!/usr/bin/env python3
"""
Test script for the Cipher Algorithm Detection API
"""
import requests
import json
import time

def test_api():
    base_url = "http://127.0.0.1:8000"
    
    # Test health endpoint
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test prediction endpoint
    print("\n🔍 Testing prediction endpoint...")
    test_texts = [
        "4d2f8b5c3e1a9f7b",  # Hex-like
        "QWxhZGRpbjpvcGVuIHNlc2FtZQ==",  # Base64
        "Hello World",  # Plain text
        "aGVsbG8gd29ybGQ=",  # Base64 encoded "hello world"
    ]
    
    for text in test_texts:
        print(f"\nTesting: {text}")
        try:
            response = requests.post(
                f"{base_url}/predict",
                json={"text": text},
                headers={"Content-Type": "application/json"}
            )
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"Algorithm: {result.get('algorithm', 'N/A')}")
                print(f"Confidence: {result.get('confidence', 0):.3f}")
                print(f"Top predictions: {len(result.get('top', []))}")
            else:
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"❌ Prediction failed: {e}")
    
    return True

if __name__ == "__main__":
    print("🚀 Starting API tests...")
    time.sleep(2)  # Wait for server to start
    test_api()
