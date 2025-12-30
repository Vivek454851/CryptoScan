#!/bin/bash

# CryptoScan Deployment Script
# This script helps deploy the CryptoScan application

set -e

echo "🚀 CryptoScan Deployment Script"
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create environment file if it doesn't exist
if [ ! -f "CryptoScan/.env.local" ]; then
    echo "📝 Creating environment file..."
    cp CryptoScan/.env.example CryptoScan/.env.local 2>/dev/null || {
        echo "⚠️  .env.example not found. Creating basic .env.local..."
        cat > CryptoScan/.env.local << EOF
MONGODB_URI=mongodb://admin:password123@mongodb:27017/cryptoscan?authSource=admin
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
ML_API_URL=http://ml-api:8000
EOF
    }
    echo "✅ Environment file created at CryptoScan/.env.local"
    echo "⚠️  Please review and update the environment variables as needed"
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   ML API: http://localhost:8000"
echo "   ML API Docs: http://localhost:8000/docs"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down"
