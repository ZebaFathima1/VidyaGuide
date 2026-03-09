# 🛠️ VidyaMitra Backend Documentation

> FastAPI Backend for AI-Powered Career Intelligence Platform

## Overview

The VidyaMitra backend is built with **FastAPI**, a modern, fast web framework for building APIs with Python. It handles:

- ✅ AI-powered resume parsing and analysis
- ✅ Skill evaluation and gap identification
- ✅ Personalized training plan generation
- ✅ Quiz and assessment management
- ✅ Mock interview simulation
- ✅ Job recommendations
- ✅ User progress tracking
- ✅ Real-time data synchronization

---

## 🚀 Quick Start

### 1. Create Virtual Environment
```bash
cd backend
python -m venv .venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
.venv\Scripts\Activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
# Copy template and fill in your API keys
copy .env.example .env
# Edit .env with your actual credentials
```

### 5. Run Development Server
```bash
python -m uvicorn app.main:app --reload
```

Server starts at: `http://localhost:8000`

---

## 📡 API Endpoints

### Health Check
```bash
GET /                    # Root status
GET /health             # Detailed health check
GET /api/v1/status     # API component status
```

### Authentication (To be implemented)
```
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
POST   /api/auth/refresh       # Refresh JWT token
POST   /api/auth/logout        # User logout
```

### Resume Processing
```
POST   /api/resume/parse       # Parse resume file
GET    /api/resume/{user_id}   # Get resume analysis
PUT    /api/resume/{user_id}   # Update resume
```

### Skill Evaluation
```
POST   /api/evaluate/skills        # Evaluate skills
GET    /api/evaluate/{user_id}     # Get skill report
```

### Training Plans
```
POST   /api/plan/generate      # Generate training plan
GET    /api/plan/{plan_id}     # Get plan details
PUT    /api/plan/{plan_id}     # Update plan
```

### Quiz & Assessment
```
GET    /api/quiz/available     # List available quizzes
POST   /api/quiz/start         # Start quiz
POST   /api/quiz/submit        # Submit answers
GET    /api/quiz/results       # Get quiz results
```

### Mock Interview
```
POST   /api/interview/start    # Start interview
POST   /api/interview/answer   # Submit answer
GET    /api/interview/feedback # Get feedback
```

### Job Recommendations
```
GET    /api/jobs/recommendations   # Get job list
GET    /api/jobs/{job_id}         # Job details
```

### Progress Tracking
```
GET    /api/progress/{user_id}    # User progress
GET    /api/progress/analytics    # Analytics dashboard
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                      # FastAPI app initialization
│   ├── config.py                    # Configuration settings
│   ├── models/
│   │   ├── user.py                 # User data models
│   │   ├── resume.py               # Resume models
│   │   ├── training.py             # Training plan models
│   │   └── assessment.py           # Quiz/Interview models
│   ├── routers/
│   │   ├── auth.py                 # Authentication routes
│   │   ├── resume.py               # Resume routes
│   │   ├── evaluate.py             # Skill evaluation routes
│   │   ├── plan.py                 # Training plan routes
│   │   ├── quiz.py                 # Quiz routes
│   │   ├── interview.py            # Interview routes
│   │   ├── jobs.py                 # Job recommendation routes
│   │   └── progress.py             # Progress tracking routes
│   ├── core/
│   │   ├── auth.py                 # JWT authentication
│   │   ├── database.py             # Database connection
│   │   └── security.py             # Security utilities
│   ├── services/
│   │   ├── ai_service.py           # OpenAI integration
│   │   ├── youtube_service.py     # YouTube API integration
│   │   ├── supabase_service.py    # Supabase integration
│   │   └── external_apis.py       # Other API integrations
│   └── utils/
│       ├── validators.py           # Input validation
│       ├── parsers.py              # Resume parsing
│       └── helpers.py              # Helper functions
├── requirements.txt               # Python dependencies
├── .env.example                  # Environment template
└── README.md                     # This file
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and populate:

| Variable | Description | Source |
|----------|-------------|--------|
| `OPENAI_API_KEY` | GPT-4 API key | https://platform.openai.com |
| `GOOGLE_API_KEY` | Google Cloud API key | https://console.cloud.google.com |
| `YOUTUBE_API_KEY` | YouTube Data API key | https://console.cloud.google.com |
| `SUPABASE_URL` | Supabase project URL | https://app.supabase.com |
| `SUPABASE_KEY` | Supabase API key | https://app.supabase.com |
| `PEXELS_API_KEY` | Pexels API key | https://www.pexels.com/api |
| `NEWS_API_KEY` | News API key | https://newsapi.org |
| `EXCHANGE_API_KEY` | Exchange Rate API key | https://exchangerate-api.com |

---

## 🧪 Testing

### Run Tests
```bash
pytest
```

### Run with Coverage
```bash
pytest --cov=app
```

### Run Specific Test File
```bash
pytest tests/test_resume.py -v
```

---

## 📖 API Documentation

Access interactive API docs:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI Schema:** http://localhost:8000/openapi.json

---

## 🔐 Authentication

The backend uses **JWT (JSON Web Tokens)** for authentication:

1. User registers/logs in → receives JWT token
2. Token stored in frontend (localStorage/sessionStorage)
3. Token sent in authorization header for protected routes
4. Backend validates token on each request

**Token Structure:**
```javascript
{
  "sub": "user_id",
  "email": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890
}
```

---

## 🤖 AI Integration

### OpenAI GPT-4
```python
# Resume Analysis
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "Analyze this resume..."},
        {"role": "user", "content": resume_text}
    ]
)

# Mock Interview Question Generation
questions = generate_interview_questions(job_role, difficulty)

# Feedback Generation
feedback = generate_interview_feedback(answers, job_role)
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE,
    password_hash VARCHAR,
    full_name VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    file_url VARCHAR,
    parsed_data JSONB,
    analysis_score FLOAT,
    created_at TIMESTAMP
);
```

### Skills Table
```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    skill_name VARCHAR,
    proficiency_level VARCHAR,
    gap_score FLOAT,
    created_at TIMESTAMP
);
```

---

## 🚨 Error Handling

All API responses follow this format:

```json
{
  "status": "success|error",
  "data": { /* response data */ },
  "message": "Human readable message"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🐛 Debugging

### Enable Debug Mode
In `.env`:
```
DEBUG=True
LOG_LEVEL=DEBUG
```

### View Logs
```bash
tail -f logs/vidyamitra.log
```

---

## 🔄 Deployment

### Production Setup
1. Use a production ASGI server (Gunicorn, Uvicorn with systemd)
2. Set `DEBUG=False`
3. Use environment-specific `.env`
4. Enable HTTPS/SSL
5. Set up database backups
6. Configure logging and monitoring

### Docker Deployment
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

---

## 📝 Code Style

- Follow **PEP 8** guidelines
- Use type hints for functions
- Write docstrings for all functions
- Use meaningful variable names
- Keep functions focused and small

---

## 🤝 Contributing

1. Create a feature branch
2. Write tests for new features
3. Ensure all tests pass
4. Submit pull request

---

## 📞 Support

- 📧 Email: backend@vidyamitra.com
- 🐛 Report Issues: [GitHub Issues](https://github.com/vidyamitra/issues)

---

**Happy API Development! 🚀**
