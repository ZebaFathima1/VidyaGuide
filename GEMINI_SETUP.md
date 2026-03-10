# Gemini AI Setup (Quiz & Interview)

The Quiz and Interview pages use **Google Gemini API** for AI-generated questions. Because the Gemini API does not support direct browser requests (CORS), the frontend calls a **backend proxy**.

## Quick Start

### 1. Start the Backend

```bash
cd VidyaGuide/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Set Your API Key (Optional)

Create `backend/.env` and add:

```
GEMINI_API_KEY=AIzaSyAzmjPEGMqSyMZ0fkCG2uJIKEZWP0yoSR0
```

Or use `GOOGLE_API_KEY` if you already have it. The backend uses the provided key by default.

### 3. Start the Frontend

```bash
cd VidyaGuide/frontend
npm run dev
```

The frontend proxies `/api` requests to `http://localhost:8000`.

## Fallback Mode

If the backend is **not running**, the Quiz and Interview pages automatically use **built-in fallback questions** so the app still works. You'll see pre-written questions instead of AI-generated ones.

## Troubleshooting

- **"Unable to load AI quiz"** → Start the backend (`uvicorn app.main:app --reload --port 8000`)
- **API errors** → Check your `GEMINI_API_KEY` in `backend/.env`
- **CORS errors** → Ensure the backend CORS allows your frontend port (5173, 5174, etc.)
