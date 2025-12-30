# CryptoScan Deployment Guide

This guide provides multiple deployment options for the CryptoScan application.

## 🏗️ Architecture Overview

The CryptoScan application consists of:
- **Frontend**: Next.js application (port 3000)
- **ML API**: FastAPI service (port 8000)
- **Database**: MongoDB (port 27017)

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for VPS/Server)

Perfect for deploying on a VPS, dedicated server, or local development.

#### Prerequisites
- Docker and Docker Compose installed
- At least 2GB RAM
- 10GB free disk space

#### Quick Deploy
```bash
# Clone the repository
git clone <your-repo-url>
cd CryptoScan-main

# Run the deployment script
# On Linux/Mac:
chmod +x deploy.sh
./deploy.sh

# On Windows:
deploy.bat
```

#### Manual Deploy
```bash
# 1. Create environment file
cp CryptoScan/.env.example CryptoScan/.env.local

# 2. Edit environment variables
nano CryptoScan/.env.local

# 3. Build and start services
docker-compose up -d

# 4. Check status
docker-compose ps
```

#### Environment Variables
Update `CryptoScan/.env.local`:
```env
MONGODB_URI=mongodb://admin:password123@mongodb:27017/cryptoscan?authSource=admin
NEXTAUTH_SECRET=your-secure-secret-key
NEXTAUTH_URL=http://localhost:3000
ML_API_URL=http://ml-api:8000
```

#### Access Points
- Frontend: http://localhost:3000
- ML API: http://localhost:8000
- ML API Docs: http://localhost:8000/docs

---

### Option 2: Vercel + Railway (Cloud Deployment)

Deploy the frontend on Vercel and ML API on Railway.

#### Frontend on Vercel

1. **Prepare the frontend**:
   ```bash
   cd CryptoScan
   npm install
   npm run build
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the root directory to `CryptoScan`
   - Add environment variables:
     ```
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=your-secure-secret
     MONGODB_URI=your-mongodb-atlas-uri
     ML_API_URL=https://your-railway-app.railway.app
     ```

#### ML API on Railway

1. **Prepare the ML API**:
   ```bash
   cd ml_api
   # Ensure requirements.txt is present
   ```

2. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub
   - Select the `ml_api` folder
   - Railway will auto-detect Python and install dependencies
   - The `railway.json` config will handle the deployment

3. **Update CORS settings**:
   Edit `ml_api/app.py` to include your Vercel domain:
   ```python
   origins = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
       "https://your-app.vercel.app"  # Add your Vercel domain
   ]
   ```

---

### Option 3: Render (Full Stack)

Deploy both services on Render.

#### Frontend on Render

1. **Create Web Service**:
   - Connect GitHub repository
   - Root directory: `CryptoScan`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Environment variables:
     ```
     NODE_ENV=production
     NEXTAUTH_URL=https://your-app.onrender.com
     NEXTAUTH_SECRET=your-secure-secret
     MONGODB_URI=your-mongodb-uri
     ML_API_URL=https://your-ml-api.onrender.com
     ```

#### ML API on Render

1. **Create Web Service**:
   - Root directory: `ml_api`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - Environment variables:
     ```
     PYTHON_VERSION=3.9.16
     ```

---

### Option 4: DigitalOcean App Platform

Deploy as a multi-service app on DigitalOcean.

1. **Create App Spec** (`app.yaml`):
   ```yaml
   name: cryptoscan
   services:
   - name: frontend
     source_dir: /CryptoScan
     github:
       repo: your-username/your-repo
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: NEXTAUTH_URL
       value: https://your-app.ondigitalocean.app
     - key: NEXTAUTH_SECRET
       value: your-secure-secret
     - key: MONGODB_URI
       value: your-mongodb-uri
     - key: ML_API_URL
       value: https://your-ml-api.ondigitalocean.app
   
   - name: ml-api
     source_dir: /ml_api
     github:
       repo: your-username/your-repo
       branch: main
     run_command: uvicorn app:app --host 0.0.0.0 --port $PORT
     environment_slug: python
     instance_count: 1
     instance_size_slug: basic-xxs
   
   databases:
   - name: mongodb
     engine: MONGODB
     version: "5"
   ```

2. **Deploy**:
   - Go to DigitalOcean App Platform
   - Create app from GitHub
   - Upload the `app.yaml` spec

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Cloud)

1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a new cluster
3. Create database user
4. Get connection string
5. Update `MONGODB_URI` in your environment variables

### Local MongoDB (Docker)

Included in the Docker Compose setup:
```yaml
mongodb:
  image: mongo:7.0
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: password123
```

---

## 🔧 Environment Variables Reference

### Frontend (Next.js)
```env
# Required
NEXTAUTH_SECRET=your-secure-secret-key
NEXTAUTH_URL=https://your-domain.com
MONGODB_URI=mongodb://user:pass@host:port/db
ML_API_URL=https://your-ml-api-domain.com

# Optional
RESEND_API_KEY=your-email-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### ML API (FastAPI)
```env
# Usually not required for basic deployment
# CORS origins are configured in app.py
```

---

## 🚨 Security Considerations

### Production Checklist
- [ ] Change default passwords
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Set up proper database authentication
- [ ] Configure firewall rules
- [ ] Enable database backups

### Environment Security
```bash
# Generate secure secret
openssl rand -base64 32

# Use MongoDB Atlas for production
# Never expose database credentials in code
```

---

## 📊 Monitoring & Maintenance

### Health Checks
- Frontend: `GET /` (should return 200)
- ML API: `GET /health` (should return 200)
- Database: Check connection in logs

### Logs
```bash
# Docker Compose
docker-compose logs -f

# Individual services
docker-compose logs -f frontend
docker-compose logs -f ml-api
docker-compose logs -f mongodb
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🆘 Troubleshooting

### Common Issues

1. **Services not starting**:
   - Check Docker is running
   - Verify ports are not in use
   - Check environment variables

2. **Frontend can't connect to ML API**:
   - Verify `ML_API_URL` is correct
   - Check CORS configuration
   - Ensure ML API is running

3. **Database connection issues**:
   - Verify `MONGODB_URI` format
   - Check database credentials
   - Ensure database is accessible

4. **Build failures**:
   - Check Node.js/Python versions
   - Verify all dependencies are installed
   - Check for syntax errors

### Debug Commands
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs [service-name]

# Access container shell
docker-compose exec [service-name] sh

# Test ML API
curl http://localhost:8000/health

# Test frontend
curl http://localhost:3000
```

---

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify environment variables
3. Ensure all services are running
4. Check network connectivity
5. Review this documentation

For additional help, check the main README.md and SETUP.md files.
