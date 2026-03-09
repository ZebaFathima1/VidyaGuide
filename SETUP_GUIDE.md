# 🚀 VidyaMitra Complete Setup Guide

## 📋 Step-by-Step Installation Instructions

### Prerequisites Check
Before starting, verify you have:
- [ ] Python 3.10+ installed
- [ ] Node.js 18+ (with npm 9+) installed
- [ ] VS Code or any code editor
- [ ] Git (optional, for version control)
- [ ] Internet connection for API key setup

---

## Backend Setup (FastAPI + Python)

### 1️⃣ Navigate to Backend Directory
```powershell
cd backend
```

### 2️⃣ Create Virtual Environment
```powershell
python -m venv .venv
```

### 3️⃣ Activate Virtual Environment
```powershell
.venv\Scripts\Activate
```
You should see `(.venv)` prefix in your terminal.

### 4️⃣ Install Dependencies
```powershell
pip install -r requirements.txt
```

### 5️⃣ Configure Environment Variables
```powershell
# Copy the example file
copy .env.example .env

# Open .env and fill in your API keys
# See API Keys section below for how to get them
```

### 6️⃣ Run Backend Server
```powershell
# Make sure you're in /backend directory and .venv is activated
python -m uvicorn app.main:app --reload

# You should see:
# ✅ Uvicorn running on http://127.0.0.1:8000
# 📡 Visit http://localhost:8000/docs for API documentation
```

---

## Frontend Setup (React + Node.js)

### 1️⃣ Navigate to Frontend Directory
```powershell
cd frontend
```

### 2️⃣ Install Dependencies
```powershell
npm install
```
This will take a few minutes...

### 3️⃣ Configure Environment Variables
```powershell
# Copy the example file
copy .env.example .env

# Update VITE_API_URL if backend is not on localhost:8000
```

### 4️⃣ Run Frontend Server
```powershell
npm run dev

# You should see:
# ✅ VITE server running at http://localhost:5173
# Access the app in your browser
```

---

## 🔑 Getting API Keys

### 1. OpenAI API Key (GPT-4)

1. Go to: https://platform.openai.com/api-keys
2. Sign in with your OpenAI account (create if needed)
3. Click on your profile → "API keys"
4. Click "Create new secret key"
5. Copy the key and paste into `.env` as `OPENAI_API_KEY`

> **Note:** You need a paid OpenAI account with credits

### 2. Google & YouTube API Keys

1. Visit: https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable APIs:
   - Search for "YouTube Data API v3" → Enable
   - Search for "Google Custom Search API" → Enable
4. Go to "Credentials" → Create credentials → API Key
5. Copy and paste into `.env`:
   ```
   GOOGLE_API_KEY=your-key
   YOUTUBE_API_KEY=your-key
   ```

### 3. Supabase (Database)

1. Visit: https://app.supabase.com
2. Sign up or login
3. Click "New Project"
4. Fill in project name, password, and region
5. Wait for project creation
6. Go to "Settings" → "API"
7. Copy `URL` and `anon public` key to `.env`:
   ```
   SUPABASE_URL=your-url
   SUPABASE_KEY=your-key
   ```

### 4. Pexels API (Images)

1. Visit: https://www.pexels.com/api
2. Sign in or create account
3. Go to "Dashboard"
4. Create API key
5. Add to `.env`: `PEXELS_API_KEY=your-key`

### 5. News API

1. Visit: https://newsapi.org
2. Sign up for free account
3. Go to dashboard and copy API key
4. Add to `.env`: `NEWS_API_KEY=your-key`

### 6. Exchange Rate API

1. Visit: https://www.exchangerate-api.com
2. Sign up for free account
3. Copy API key from dashboard
4. Add to `.env`: `EXCHANGE_API_KEY=your-key`

---

## 🧪 Testing the Setup

### Backend Testing

1. Open http://localhost:8000 in browser
   - Should show: `{"status": "✅ Running", ...}`

2. Visit http://localhost:8000/docs
   - Should show interactive Swagger API documentation

3. Test API health endpoint:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing | ConvertFrom-Json
   ```

### Frontend Testing

1. Open http://localhost:5173 in browser
   - Should show VidyaMitra login page

2. Try demo login:
   - Email: `demo@example.com` (any email)
   - Password: `password` (any password)
   - System will allow demo access

3. Navigate through different pages using sidebar

---

## 📁 Project Directory Structure

After setup, your project should look like:

```
vidya/
├── backend/
│   ├── .venv/                       # Virtual environment (auto-created)
│   ├── app/
│   │   ├── main.py                 # Backend app entry point
│   │   ├── routers/                # API endpoints
│   │   ├── models/                 # Data models
│   │   └── core/                   # Core functionality
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Environment variables (create manually)
│   └── README.md
│
├── frontend/
│   ├── node_modules/               # Dependencies (auto-created)
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── pages/                  # Page components
│   │   ├── utils/                  # Helper functions
│   │   ├── App.jsx                # Main app
│   │   └── main.jsx               # Entry point
│   ├── index.html                 # HTML template
│   ├── package.json               # JS dependencies
│   ├── .env                       # Environment variables (create manually)
│   └── README.md
│
└── README.md                      # Main project README

```

---

## 🐛 Troubleshooting

### Backend won't start?

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`
- **Solution:** Make sure virtual environment is activated
  ```powershell
  .venv\Scripts\Activate
  pip install -r requirements.txt
  ```

**Problem:** Port 8000 already in use
- **Solution:** Kill the process or use different port
  ```powershell
  python -m uvicorn app.main:app --reload --port 8001
  ```

### Frontend won't start?

**Problem:** `npm: command not found`
- **Solution:** Install Node.js from https://nodejs.org

**Problem:** Port 5173 already in use
- **Solution:** Use different port
  ```powershell
  npm run dev -- --port 5174
  ```

### API calls failing?

**Problem:** CORS error
- **Solution:** Check backend is running and `.env` has correct `VITE_API_URL`

**Problem:** API returns 401 Unauthorized
- **Solution:** Check token is stored in localStorage after login

### Missing API keys errors?

**Problem:** "API key not found" errors
- **Solution:** 
  1. Copy `.env.example` to `.env` again
  2. Fill in all required API keys
  3. Restart backend server
  4. Clear browser cache

---

## 🎯 Next Steps

1. **Install dependencies** - Follow backend and frontend setup
2. **Get API keys** - Follow the keys section above
3. **Run both servers** - In separate terminals
4. **Test the app** - Visit http://localhost:5173
5. **Explore the API** - Visit http://localhost:8000/docs
6. **Start developing!** - Check README files for architecture

---

## 📚 Useful Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Python Virtual Environments:** https://docs.python.org/3/tutorial/venv.html
- **npm Documentation:** https://docs.npmjs.com

---

## 💡 Tips & Best Practices

✅ Always activate virtual environment before running backend
✅ Run frontend and backend in **separate terminals**
✅ Keep `.env` files secure - never commit them to Git
✅ Use browser DevTools to debug frontend issues
✅ Check backend logs for API errors
✅ Clear browser cache if facing issues
✅ Restart servers after changing `.env` files

---

## 🆘 Need Help?

- Check the detailed README files in `/backend` and `/frontend` folders
- Review the API documentation at http://localhost:8000/docs
- Check browser console for errors (F12)
- Check backend terminal for error logs

---

**Ready to build amazing careers with AI? Let's go! 🚀**
