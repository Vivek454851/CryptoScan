@echo off
REM CryptoScan Deployment Script for Windows
REM This script helps deploy the CryptoScan application

echo 🚀 CryptoScan Deployment Script
echo ================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create environment file if it doesn't exist
if not exist "CryptoScan\.env.local" (
    echo 📝 Creating environment file...
    if exist "CryptoScan\.env.example" (
        copy "CryptoScan\.env.example" "CryptoScan\.env.local" >nul
    ) else (
        echo ⚠️  .env.example not found. Creating basic .env.local...
        (
            echo MONGODB_URI=mongodb://admin:password123@mongodb:27017/cryptoscan?authSource=admin
            echo NEXTAUTH_SECRET=your-secret-key-change-this-in-production
            echo NEXTAUTH_URL=http://localhost:3000
            echo ML_API_URL=http://ml-api:8000
        ) > "CryptoScan\.env.local"
    )
    echo ✅ Environment file created at CryptoScan\.env.local
    echo ⚠️  Please review and update the environment variables as needed
)

REM Build and start services
echo 🔨 Building and starting services...
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo.
echo 🎉 Deployment completed!
echo.
echo 📱 Access your application:
echo    Frontend: http://localhost:3000
echo    ML API: http://localhost:8000
echo    ML API Docs: http://localhost:8000/docs
echo.
echo 📊 To view logs:
echo    docker-compose logs -f
echo.
echo 🛑 To stop services:
echo    docker-compose down
echo.
pause
