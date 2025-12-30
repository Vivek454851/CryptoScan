# 🚀 CryptoScan Full Deployment Steps

This guide provides complete step-by-step instructions for deploying your CryptoScan application.

## 📋 Prerequisites Checklist

Before starting deployment, ensure you have:
- [ ] Git repository with your code
- [ ] Docker Desktop installed (for local/VPS deployment)
- [ ] Node.js 18+ installed (for development)
- [ ] Python 3.8+ installed (for ML API development)
- [ ] MongoDB Atlas account (for cloud database)
- [ ] Vercel account (for frontend deployment)
- [ ] Railway/Render account (for ML API deployment)

---

## 🎯 Deployment Option 1: Docker Compose (Local/VPS)

### Step 1: Prepare Your Environment

1. **Clone/Download your project:**
   ```bash
   git clone <your-repo-url>
   cd CryptoScan-main
   ```

2. **Create environment file:**
   ```bash
   # Create the environment file
   echo "MONGODB_URI=mongodb://admin:password123@mongodb:27017/cryptoscan?authSource=admin
   NEXTAUTH_SECRET=$(openssl rand -base64 32)
   NEXTAUTH_URL=http://localhost:3000
   ML_API_URL=http://ml-api:8000" > CryptoScan/.env.local
   ```

3. **Verify files exist:**
   ```bash
   # Check all required files are present
   python test-deployment.py
   ```

### Step 2: Deploy with Docker

**Option A: Automated Deployment (Recommended)**
```bash
# For Windows
deploy.bat

# For Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

**Option B: Manual Deployment**
```bash
# 1. Build and start all services
docker-compose up -d

# 2. Check service status
docker-compose ps

# 3. View logs if needed
docker-compose logs -f
```

### Step 3: Verify Deployment

1. **Check services are running:**
   ```bash
   docker-compose ps
   ```

2. **Test endpoints:**
   - Frontend: http://localhost:3000
   - ML API: http://localhost:8000
   - ML API Docs: http://localhost:8000/docs

3. **Test the application:**
   - Go to http://localhost:3000
   - Sign up for an account
   - Try the cipher analysis feature

---

## 🌐 Deployment Option 2: Cloud Deployment (Vercel + Railway)

### Step 1: Prepare Frontend for Vercel

1. **Update CORS settings in ML API:**
   ```python
   # Edit ml_api/app.py
   origins = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
       "https://your-app-name.vercel.app",  # Replace with your Vercel domain
   ]
   ```

2. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Prepare for cloud deployment"
   git push origin main
   ```

### Step 2: Deploy ML API to Railway

1. **Go to Railway.app:**
   - Visit [railway.app](https://railway.app)
   - Sign up/Login with GitHub

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set root directory to `ml_api`

3. **Configure deployment:**
   - Railway will auto-detect Python
   - It will use the `railway.json` config
   - Wait for deployment to complete

4. **Get your ML API URL:**
   - Copy the generated URL (e.g., `https://your-app.railway.app`)
   - Note this URL for frontend configuration

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import project:**
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `CryptoScan`

3. **Configure environment variables:**
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secure-secret-key-here
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cryptoscan
   ML_API_URL=https://your-app.railway.app
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Get your frontend URL

### Step 4: Update CORS and Redeploy

1. **Update ML API CORS with actual Vercel URL:**
   ```python
   # Edit ml_api/app.py
   origins = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
       "https://your-actual-app.vercel.app",  # Your real Vercel URL
   ]
   ```

2. **Commit and push:**
   ```bash
   git add ml_api/app.py
   git commit -m "Update CORS for production"
   git push origin main
   ```

3. **Railway will auto-redeploy the ML API**

### Step 5: Set Up MongoDB Atlas

1. **Create MongoDB Atlas account:**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free account

2. **Create cluster:**
   - Choose free tier (M0)
   - Select region closest to your users
   - Create cluster

3. **Configure database access:**
   - Go to "Database Access"
   - Add new database user
   - Create username/password
   - Set privileges to "Read and write to any database"

4. **Configure network access:**
   - Go to "Network Access"
   - Add IP address: `0.0.0.0/0` (allow all IPs)
   - Or add specific IPs for better security

5. **Get connection string:**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

6. **Update Vercel environment variables:**
   - Go to your Vercel project settings
   - Update `MONGODB_URI` with Atlas connection string

---

## 🔧 Deployment Option 3: Full Stack on Render

### Step 1: Deploy ML API to Render

1. **Go to Render:**
   - Visit [render.com](https://render.com)
   - Sign up/Login with GitHub

2. **Create Web Service:**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Set root directory to `ml_api`

3. **Configure service:**
   ```
   Name: cryptoscan-ml-api
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
   ```

4. **Deploy and get URL**

### Step 2: Deploy Frontend to Render

1. **Create another Web Service:**
   - Click "New +"
   - Select "Web Service"
   - Connect same GitHub repository
   - Set root directory to `CryptoScan`

2. **Configure service:**
   ```
   Name: cryptoscan-frontend
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Set environment variables:**
   ```
   NODE_ENV=production
   NEXTAUTH_URL=https://cryptoscan-frontend.onrender.com
   NEXTAUTH_SECRET=your-secure-secret
   MONGODB_URI=your-mongodb-atlas-uri
   ML_API_URL=https://cryptoscan-ml-api.onrender.com
   ```

4. **Deploy**

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Database

1. **Access your cluster:**
   - Go to MongoDB Atlas dashboard
   - Click "Browse Collections"

2. **Create database:**
   - Click "Create Database"
   - Database name: `cryptoscan`
   - Collection name: `users`

### Step 2: Configure Connection

1. **Get connection string:**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cryptoscan?retryWrites=true&w=majority
   ```

2. **Update environment variables in your deployment platform**

---

## 🔐 Security Configuration

### Step 1: Generate Secure Secrets

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Example output: aBcD1234EfGh5678IjKl9012MnOp3456QrSt7890UvWx
```

### Step 2: Configure Environment Variables

**Production Environment Variables:**
```env
# Frontend (Vercel/Render)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-generated-secret-here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cryptoscan
ML_API_URL=https://your-ml-api-domain.com

# ML API (Railway/Render)
ENVIRONMENT=production
```

### Step 3: Update CORS Settings

**For ML API (ml_api/app.py):**
```python
origins = [
    "https://your-frontend-domain.com",
    "https://your-frontend-domain.vercel.app",
    "https://your-frontend-domain.onrender.com",
]
```

---

## ✅ Post-Deployment Verification

### Step 1: Test All Endpoints

1. **Frontend:**
   - Visit your frontend URL
   - Test user registration
   - Test sign in
   - Test cipher analysis

2. **ML API:**
   - Visit `https://your-ml-api.com/health`
   - Should return: `{"status": "healthy", "model_loaded": true}`
   - Visit `https://your-ml-api.com/docs`
   - Test the `/predict` endpoint

3. **Database:**
   - Check MongoDB Atlas for new user records
   - Verify data is being stored correctly

### Step 2: Monitor Performance

1. **Check logs:**
   - Vercel: Project dashboard → Functions tab
   - Railway: Service dashboard → Deployments tab
   - Render: Service dashboard → Logs tab

2. **Monitor errors:**
   - Set up error tracking if needed
   - Check for 500 errors in logs

---

## 🚨 Troubleshooting Common Issues

### Issue 1: Frontend can't connect to ML API

**Symptoms:** Cipher analysis not working, network errors

**Solutions:**
1. Check `ML_API_URL` environment variable
2. Verify ML API is running and accessible
3. Check CORS configuration in ML API
4. Test ML API health endpoint directly

### Issue 2: Database connection errors

**Symptoms:** User registration/login failing

**Solutions:**
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas network access settings
3. Verify database user credentials
4. Check if database and collection exist

### Issue 3: ML API not loading model

**Symptoms:** ML API returns 500 errors

**Solutions:**
1. Check if `cipher_model.pkl` exists in ML API directory
2. Verify Python dependencies are installed
3. Check ML API logs for specific errors
4. Test ML API locally first

### Issue 4: CORS errors

**Symptoms:** Browser console shows CORS errors

**Solutions:**
1. Update CORS origins in `ml_api/app.py`
2. Include your exact frontend domain
3. Redeploy ML API after CORS changes
4. Check for typos in domain names

---

## 📊 Monitoring and Maintenance

### Step 1: Set Up Monitoring

1. **Health checks:**
   - Frontend: Monitor main page availability
   - ML API: Monitor `/health` endpoint
   - Database: Monitor connection status

2. **Error tracking:**
   - Set up Sentry or similar service
   - Monitor for 500 errors
   - Track user-reported issues

### Step 2: Regular Maintenance

1. **Update dependencies:**
   ```bash
   # Frontend
   cd CryptoScan
   npm update
   
   # ML API
   cd ml_api
   pip install --upgrade -r requirements.txt
   ```

2. **Monitor costs:**
   - Check Vercel usage limits
   - Monitor Railway/Render usage
   - Review MongoDB Atlas usage

3. **Backup data:**
   - MongoDB Atlas provides automatic backups
   - Consider additional backup strategies for production

---

## 🎉 Deployment Complete!

Your CryptoScan application should now be fully deployed and accessible. 

**Next Steps:**
1. Test all functionality thoroughly
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Set up SSL certificates (usually automatic)
5. Consider implementing additional security measures

**Access Points:**
- Frontend: Your deployed frontend URL
- ML API: Your deployed ML API URL
- API Documentation: `https://your-ml-api.com/docs`

For additional support, refer to the platform-specific documentation or check the logs for specific error messages.
