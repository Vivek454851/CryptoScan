#!/usr/bin/env python3
"""
Integration test for CryptoScan application
"""
import requests
import json
import time
import sys

def test_ml_api():
    """Test the ML API directly"""
    print("🔍 Testing ML API...")
    try:
        # Test health endpoint
        response = requests.get("http://127.0.0.1:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ ML API health check passed")
        else:
            print(f"❌ ML API health check failed: {response.status_code}")
            return False
        
        # Test prediction endpoint
        test_data = {"text": "4d2f8b5c3e1a9f7b"}
        response = requests.post(
            "http://127.0.0.1:8000/predict",
            json=test_data,
            timeout=5
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ ML API prediction successful: {result.get('algorithm', 'N/A')}")
            return True
        else:
            print(f"❌ ML API prediction failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ ML API not accessible - make sure it's running on port 8000")
        return False
    except Exception as e:
        print(f"❌ ML API test failed: {e}")
        return False

def test_frontend_api():
    """Test the frontend API proxy"""
    print("🔍 Testing Frontend API...")
    try:
        test_data = {"text": "QWxhZGRpbjpvcGVuIHNlc2FtZQ=="}
        response = requests.post(
            "http://localhost:3000/api/predict",
            json=test_data,
            timeout=5
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Frontend API proxy successful: {result.get('algorithm', 'N/A')}")
            return True
        else:
            print(f"❌ Frontend API proxy failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Frontend API not accessible - make sure it's running on port 3000")
        return False
    except Exception as e:
        print(f"❌ Frontend API test failed: {e}")
        return False

def test_frontend_pages():
    """Test frontend pages"""
    print("🔍 Testing Frontend Pages...")
    try:
        # Test main page
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Main page accessible")
        else:
            print(f"❌ Main page failed: {response.status_code}")
            return False
        
        # Test analyze page
        response = requests.get("http://localhost:3000/analyze", timeout=5)
        if response.status_code == 200:
            print("✅ Analyze page accessible")
            return True
        else:
            print(f"❌ Analyze page failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Frontend pages not accessible - make sure frontend is running on port 3000")
        return False
    except Exception as e:
        print(f"❌ Frontend pages test failed: {e}")
        return False

def main():
    print("🚀 Starting CryptoScan Integration Tests...")
    print("=" * 50)
    
    # Test ML API
    ml_api_ok = test_ml_api()
    print()
    
    # Test Frontend API
    frontend_api_ok = test_frontend_api()
    print()
    
    # Test Frontend Pages
    frontend_pages_ok = test_frontend_pages()
    print()
    
    # Summary
    print("=" * 50)
    print("📊 Test Results:")
    print(f"ML API: {'✅ PASS' if ml_api_ok else '❌ FAIL'}")
    print(f"Frontend API: {'✅ PASS' if frontend_api_ok else '❌ FAIL'}")
    print(f"Frontend Pages: {'✅ PASS' if frontend_pages_ok else '❌ FAIL'}")
    
    if ml_api_ok and frontend_api_ok and frontend_pages_ok:
        print("\n🎉 All tests passed! Integration is working correctly.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
