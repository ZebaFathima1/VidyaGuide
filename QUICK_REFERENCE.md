# 📚 VidyaMitra Quick Reference Guide

## ⚡ Quick Commands

### Backend Commands

```bash
# Activate virtual environment
.venv\Scripts\Activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python -m uvicorn app.main:app --reload

# Run on different port
python -m uvicorn app.main:app --reload --port 8001

# Format code
pip install black && black app/

# Lint code
pip install flake8 && flake8 app/

# Run tests
pytest
```

### Frontend Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📁 File Structure Quick Reference

### Important Backend Files

```
app/
├── main.py              The backend entry point - START HERE
├── core/
│   └── config.py       All configuration in one place
├── routers/            Add API endpoints here
├── models/             Define data structures here
└── services/           Business logic here
```

### Important Frontend Files

```
src/
├── main.jsx            React entry point
├── App.jsx             Main app component
├── pages/              Add new pages here
├── components/         Reusable components here
├── utils/api.js        API configuration
└── utils/              Helper functions
```

---

## 🚀 Common Development Tasks

### Adding a New API Endpoint

1. **Create router file** in `backend/app/routers/myfeature.py`:
```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/myendpoint")
async def my_endpoint():
    return {"message": "Hello"}
```

2. **Register in** `backend/app/main.py`:
```python
from app.routers import myfeature
app.include_router(myfeature.router, prefix="/api/myfeature", tags=["My Feature"])
```

3. **Test at** http://localhost:8000/docs

---

### Adding a New React Page

1. **Create page component** in `frontend/src/pages/MyPage.jsx`:
```javascript
export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  )
}
```

2. **Add route in** `frontend/src/App.jsx`:
```javascript
import MyPage from './pages/MyPage'

// Inside <Routes>:
<Route path="/mypage" element={<MyPage />} />
```

3. **Add navigation in** `frontend/src/components/Sidebar.jsx`:
```javascript
{ path: '/mypage', label: 'My Page', icon: '✨' }
```

---

## 🔑 Environment Variables

### Backend `.env` Essentials

```env
# Required for basic functionality
OPENAI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
DATABASE_URL=sqlite:///vidyamitra.db

# Optional but recommended
DEBUG=True
SECRET_KEY=your-secret-key
```

### Frontend `.env` Essentials

```env
# Required
VITE_API_URL=http://localhost:8000

# Optional
VITE_DEBUG=false
```

---

## 🐛 Debugging Tips

### Backend Debugging

**Check logs:**
```bash
# See all output
tail -f logs/vidyamitra.log
```

**Test API directly:**
```bash
# Visit this in browser
http://localhost:8000/docs

# Or use curl
curl http://localhost:8000/health
```

**Common issues:**
```
Port 8000 in use?
→ Use different port: --port 8001

Module not found?
→ Activate venv & reinstall: pip install -r requirements.txt

API returns error?
→ Check .env file has all keys
```

### Frontend Debugging

**Open browser DevTools:** Press `F12`

**Check Network tab:**
- See all API calls
- Check response status
- View errors

**Check Console tab:**
- See JavaScript errors
- See API errors

**Check Application tab:**
- View localStorage (auth token)
- Check if token is stored

---

## 📊 API Endpoint Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/resume/parse` | Parse resume |
| GET | `/evaluate/{user_id}` | Get skill evaluation |
| POST | `/plan/generate` | Generate training plan |
| POST | `/quiz/start` | Start quiz |
| GET | `/quiz/results` | Get quiz results |
| POST | `/interview/start` | Start interview |
| GET | `/progress/{user_id}` | Get progress |

> **Full API docs:** http://localhost:8000/docs

---

## 🎨 Frontend Component Usage

### Using API

```javascript
import api from '../utils/api'

// GET request
const data = await api.get('/resume/123')

// POST request
const result = await api.post('/quiz/submit', {
  answers: ['A', 'B', 'C']
})

// Handle errors
try {
  const data = await api.get('/resume/123')
} catch (error) {
  console.error('Failed:', error.message)
}
```

### Using State

```javascript
import { useState } from 'react'

function MyComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  return <div>{loading ? 'Loading...' : data}</div>
}
```

### Using Tailwind

```javascript
<div className="p-6 bg-white rounded-lg shadow-lg">
  <h1 className="text-2xl font-bold text-blue-600">Title</h1>
  <p className="text-gray-600 mt-2">Description</p>
</div>
```

---

## 📦 Dependencies Overview

### Backend Key Packages

```
fastapi          - Web framework
uvicorn          - ASGI server
sqlalchemy       - Database ORM
pydantic         - Data validation
openai           - AI integration
python-jose      - JWT tokens
```

### Frontend Key Packages

```
react            - UI library
react-router-dom - Routing
axios            - HTTP client
tailwindcss      - Styling
zustand          - State management
recharts         - Charts
```

---

## 🚀 Performance Tips

### Backend

- ✅ Use indexes on frequently queried columns
- ✅ Cache API responses
- ✅ Use async/await for I/O operations
- ✅ Limit query results with pagination
- ✅ Use connection pooling

### Frontend

- ✅ Lazy load images
- ✅ Code split routes
- ✅ Minify CSS/JS
- ✅ Cache API responses
- ✅ Use React.memo for expensive components

---

## 📱 Responsive Design Classes

```
Grid:           grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Display:        hidden md:block
Sizing:         w-full md:w-1/2 lg:w-1/3
Spacing:        p-4 md:p-6 lg:p-8
Text:           text-sm md:text-base lg:text-lg
```

---

## 🧪 Testing Code Templates

### Backend Test Example

```python
def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

### Frontend Test Example

```javascript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

test('renders heading', () => {
  render(<MyComponent />)
  expect(screen.getByText('Heading')).toBeInTheDocument()
})
```

---

## 🔗 Useful Links

| Resource | Link |
|----------|------|
| FastAPI Docs | https://fastapi.tiangolo.com |
| React Docs | https://react.dev |
| Tailwind Docs | https://tailwindcss.com |
| Python JSONSchema | https://pydantic-docs.helpmanual.io |
| OpenAI API | https://platform.openai.com/docs |
| Vite Guide | https://vitejs.dev |

---

## ✅ Deployment Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Update `SECRET_KEY` with strong value
- [ ] Verify all API keys are set
- [ ] Run tests and fix failures
- [ ] Update CORS origins for production domain
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure database backups
- [ ] Set up logging and monitoring
- [ ] Create user documentation

---

## 💡 Pro Tips

1. **Use VS Code REST Client** - Test APIs without Postman
2. **Use React DevTools** - Debug React state easily
3. **Use Browser DevTools** - Network tab is your friend
4. **Commit frequently** - Git makes debugging easier
5. **Write tests early** - Catch bugs before production
6. **Document as you code** - Future you will thank current you

---

**Happy Coding! 🎉**

For detailed information, check:
- [README.md](README.md) - Main project guide
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup steps
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [backend/README.md](backend/README.md) - Backend details
- [frontend/README.md](frontend/README.md) - Frontend details
