# CORS Fix Applied - Flask marketDataService

## Problem Identified

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:8010/price/crypto/bitcoin' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Root Cause:**
The Flask `marketDataService` (Python) was not configured to allow Cross-Origin requests from the React frontend running on `localhost:5173`.

---

## Solution Applied

### Step 1: Added Flask-CORS Dependency

**File Modified:** `marketDataService/requirements.txt`

Added the following line:
```
Flask-CORS
```

This package allows Flask to handle CORS (Cross-Origin Resource Sharing) headers.

---

### Step 2: Updated Flask App Configuration

**File Modified:** `marketDataService/src/app/__init__.py`

**Changes:**

1. **Added import statement** (line 2):
```python
from flask_cors import CORS
```

2. **Added CORS configuration** (lines 10-11):
```python
app = Flask(__name__)
# Allow requests from our frontend
CORS(app, origins="http://localhost:5173")
```

**Complete Updated Section:**
```python
from flask import Flask, request, jsonify
from flask_cors import CORS  # ← NEW
from .clients.stock_client import search_stocks, get_stock_price
from .clients.mf_client import search_mutual_funds, get_mutual_fund_nav
from .clients.crypto_client import search_crypto, get_crypto_price
from .clients.nps_client import search_nps, get_nps_nav
from .clients.metals_client import get_gold_price, get_silver_price

app = Flask(__name__)
# Allow requests from our frontend  # ← NEW
CORS(app, origins="http://localhost:5173")  # ← NEW
```

---

## How to Apply the Fix

### Option 1: Quick Restart (Recommended)

```bash
# Stop all services
docker-compose down

# Rebuild and start all services
docker-compose up --build
```

The `--build` flag ensures Docker rebuilds the `marketDataService` container with the new dependencies.

### Option 2: Rebuild Only marketDataService

```bash
# Stop services
docker-compose down

# Rebuild just the market data service
docker-compose build marketdataservice

# Start everything
docker-compose up
```

---

## Verification Steps

### 1. Check Services Are Running

```bash
docker ps
```

You should see all services running:
- mysql
- kafka
- zookeeper
- authservice
- userservice
- portfolioservice
- expenseservice
- marketdataservice ← This one should be rebuilt

### 2. Check marketDataService Health

Open browser or use curl:
```bash
curl http://localhost:8010/health
```

Expected response: `OK`

### 3. Test CORS from Browser

1. Open frontend: `http://localhost:5173`
2. Open browser Developer Tools (F12)
3. Navigate to the Dashboard
4. Check the **Console** tab

**Before Fix:**
```
❌ CORS policy: No 'Access-Control-Allow-Origin' header...
```

**After Fix:**
```
✅ No CORS errors!
✅ Network requests succeed
```

### 4. Check Network Tab

1. Open **Network** tab in DevTools
2. Look for requests to `localhost:8010`
3. Click on any request
4. Go to **Headers** section
5. Check **Response Headers**

You should now see:
```
Access-Control-Allow-Origin: http://localhost:5173
```

---

## What CORS Does

CORS (Cross-Origin Resource Sharing) is a security feature that:

1. **Prevents unauthorized access** - Websites can't make requests to your API without permission
2. **Allows specific origins** - We explicitly allow `localhost:5173` (our frontend)
3. **Adds response headers** - Flask now sends `Access-Control-Allow-Origin` headers

### Why We Need It

- **Frontend:** `http://localhost:5173` (React/Vite)
- **Backend:** `http://localhost:8010` (Flask)
- **Different origins!** → Browser blocks by default
- **CORS config** → Tells browser it's okay

---

## Troubleshooting

### Issue: Still seeing CORS errors after rebuild

**Solution:**
1. Completely stop Docker:
   ```bash
   docker-compose down
   docker system prune -f
   ```

2. Rebuild from scratch:
   ```bash
   docker-compose build --no-cache marketdataservice
   docker-compose up
   ```

### Issue: Flask-CORS not installed

**Check inside container:**
```bash
docker exec -it marketdataservice pip list | grep Flask-CORS
```

Expected output: `Flask-CORS   [version number]`

If not found:
```bash
docker exec -it marketdataservice pip install Flask-CORS
docker-compose restart marketdataservice
```

### Issue: Other services have CORS errors

**Spring Boot Services** (Java):
These are already configured with CORS in `AppConfig.java`:
- authservice
- userservice  
- portfolioservice
- expenseservice

All have this config:
```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

### Issue: Need to allow additional frontend URLs

**To allow multiple origins**, update the CORS config:

```python
# In src/app/__init__.py
CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-production-domain.com"
])
```

---

## Production Considerations

### Current Setup (Development)
```python
CORS(app, origins="http://localhost:5173")
```
✅ Good for local development
❌ Won't work in production

### Production Setup

Use environment variable:

```python
import os

# In src/app/__init__.py
allowed_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
CORS(app, origins=allowed_origins)
```

Then in `docker-compose.yml`:
```yaml
marketdataservice:
  environment:
    CORS_ORIGINS: "https://your-frontend.com,https://www.your-frontend.com"
```

---

## Summary

✅ **Problem:** CORS blocking frontend requests to Flask service
✅ **Solution:** Added Flask-CORS package and configuration
✅ **Files Changed:** 
   - `requirements.txt` (added Flask-CORS)
   - `src/app/__init__.py` (added import and config)

✅ **Next Steps:**
   1. Run `docker-compose down`
   2. Run `docker-compose up --build`
   3. Test frontend - CORS errors should be gone!

---

## Additional Resources

- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Understanding CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

The fix is minimal but crucial for frontend-backend communication! 🎉
