#!/usr/bin/env python3
"""
Deployment Test Script for CryptoScan
Tests the deployment setup and configuration
"""

import os
import sys
import subprocess
import requests
import time
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists and print status"""
    if Path(filepath).exists():
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} - NOT FOUND")
        return False

def check_docker():
    """Check if Docker is installed and running"""
    try:
        result = subprocess.run(['docker', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Docker: {result.stdout.strip()}")
            return True
        else:
            print("❌ Docker: Not installed or not running")
            return False
    except FileNotFoundError:
        print("❌ Docker: Not installed")
        return False

def check_docker_compose():
    """Check if Docker Compose is available"""
    try:
        result = subprocess.run(['docker-compose', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Docker Compose: {result.stdout.strip()}")
            return True
        else:
            print("❌ Docker Compose: Not available")
            return False
    except FileNotFoundError:
        print("❌ Docker Compose: Not installed")
        return False

def test_ml_api():
    """Test ML API endpoints"""
    try:
        # Test health endpoint
        response = requests.get('http://localhost:8000/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ ML API Health: {data.get('status', 'unknown')}")
            print(f"   Model loaded: {data.get('model_loaded', False)}")
            print(f"   Encoder loaded: {data.get('encoder_loaded', False)}")
            return True
        else:
            print(f"❌ ML API Health: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ ML API: Connection failed - {e}")
        return False

def test_frontend():
    """Test frontend availability"""
    try:
        response = requests.get('http://localhost:3000', timeout=5)
        if response.status_code == 200:
            print("✅ Frontend: Accessible")
            return True
        else:
            print(f"❌ Frontend: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend: Connection failed - {e}")
        return False

def main():
    print("🚀 CryptoScan Deployment Test")
    print("=" * 40)
    
    # Check required files
    print("\n📁 Checking Required Files:")
    files_to_check = [
        ("Dockerfile.frontend", "Frontend Dockerfile"),
        ("Dockerfile.ml-api", "ML API Dockerfile"),
        ("docker-compose.yml", "Docker Compose configuration"),
        ("deploy.sh", "Linux/Mac deployment script"),
        ("deploy.bat", "Windows deployment script"),
        ("DEPLOYMENT.md", "Deployment documentation"),
        ("CryptoScan/package.json", "Frontend package.json"),
        ("ml_api/requirements.txt", "ML API requirements"),
        ("ml_api/app.py", "ML API application"),
        ("ml_api/cipher_model.pkl", "ML model file"),
    ]
    
    files_ok = True
    for filepath, description in files_to_check:
        if not check_file_exists(filepath, description):
            files_ok = False
    
    # Check Docker installation
    print("\n🐳 Checking Docker Installation:")
    docker_ok = check_docker()
    docker_compose_ok = check_docker_compose()
    
    # Check environment files
    print("\n🔧 Checking Environment Configuration:")
    env_files = [
        ("CryptoScan/.env.local", "Frontend environment"),
        ("CryptoScan/.env.example", "Frontend environment template"),
    ]
    
    env_ok = True
    for filepath, description in env_files:
        if not check_file_exists(filepath, description):
            env_ok = False
    
    # Test running services (if available)
    print("\n🌐 Testing Running Services:")
    ml_api_ok = test_ml_api()
    frontend_ok = test_frontend()
    
    # Summary
    print("\n📊 Deployment Test Summary:")
    print("=" * 40)
    
    if files_ok:
        print("✅ All required files are present")
    else:
        print("❌ Some required files are missing")
    
    if docker_ok and docker_compose_ok:
        print("✅ Docker environment is ready")
    else:
        print("❌ Docker environment needs setup")
    
    if env_ok:
        print("✅ Environment configuration is ready")
    else:
        print("⚠️  Environment configuration needs attention")
    
    if ml_api_ok and frontend_ok:
        print("✅ Services are running and accessible")
    else:
        print("ℹ️  Services are not running (this is normal if not deployed yet)")
    
    print("\n🚀 Next Steps:")
    if not files_ok:
        print("1. Ensure all required files are present")
    if not (docker_ok and docker_compose_ok):
        print("2. Install Docker and Docker Compose")
    if not env_ok:
        print("3. Create environment configuration files")
    if files_ok and docker_ok and docker_compose_ok:
        print("1. Run: ./deploy.sh (Linux/Mac) or deploy.bat (Windows)")
        print("2. Or follow the DEPLOYMENT.md guide for cloud deployment")
    
    print("\n📚 For detailed instructions, see DEPLOYMENT.md")

if __name__ == "__main__":
    main()
