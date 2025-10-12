#!/usr/bin/env python3
"""
Startup script for the Cipher Algorithm Detection API
"""
import uvicorn
import sys
import os

if __name__ == "__main__":
    # Ensure we're in the correct directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("🚀 Starting Cipher Algorithm Detection API...")
    print("📁 Working directory:", os.getcwd())
    print("🔍 Model file exists:", os.path.exists("cipher_model.pkl"))
    
    try:
        uvicorn.run(
            "app:app",
            host="127.0.0.1",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
