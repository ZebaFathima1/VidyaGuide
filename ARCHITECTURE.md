# 🏗️ VidyaMitra System Architecture

## Overview

VidyaMitra is a full-stack application with a **FastAPI backend** and **React frontend**, powered by AI through OpenAI's GPT-4 and integrated with multiple external APIs.

---

## 🎯 Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│           User Interface (React.js)                 │
│  - Dashboard, Resume, Skills, Training, Quiz, etc   │
└────────────────┬────────────────────────────────────┘
                 │ HTTP/REST API (Axios)
                 ▼
┌─────────────────────────────────────────────────────┐
│        FastAPI Backend (Python)                     │
│  - Authentication, API Routers, Business Logic      │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────┼────────┬────────────┬─────────────┐
        ▼        ▼        ▼            ▼             ▼
    ┌────────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌────────┐
    │Database│ │OpenAI│ │Google    │ │Supabase  │ │External│
    │SQLite/ │ │GPT-4 │ │YouTube   │ │Database  │ │APIs    │
    │Pexpand │ │      │ │Pexels    │ │Auth      │ │(News)  │
    └────────┘ └──────┘ └──────────┘ └──────────┘ └────────┘
```

---

## 📊 Component Breakdown

### Frontend (React.js)

**Pages:**
- `LoginPage` - User authentication
- `HomePage` - Dashboard & overview
- `ResumePage` - Resume upload & analysis
- `SkillsPage` - Skill evaluation & visualization
- `TrainingPage` - Training plan display
- `QuizPage` - Assessment interface
- `InterviewPage` - Mock interview simulator
- `JobsPage` - Job recommendations
- `ProgressPage` - Analytics dashboard

**Components:**
- `Navbar` - Top navigation bar
- `Sidebar` - Navigation sidebar
- `Cards` - Reusable card components
- `LoadingSpinner` - Loading indicator
- `Modal` - Modal dialogs

**Utilities:**
- `api.js` - Axios API client
- `auth.js` - Authentication helpers
- `validators.js` - Input validation

---

### Backend (FastAPI)

**Core Modules:**
```
app/
├── main.py
│   ├── FastAPI initialization
│   ├── CORS middleware
│   ├── Router registration
│   └── Error handlers
│
├── core/
│   ├── config.py - Configuration management
│   ├── auth.py - JWT authentication
│   ├── database.py - Database connection
│   └── security.py - Security utilities
│
├── routers/
│   ├── auth.py - Authentication endpoints
│   ├── resume.py - Resume parsing
│   ├── evaluate.py - Skill evaluation
│   ├── plan.py - Training plans
│   ├── quiz.py - Quiz management
│   ├── interview.py - Interview simulation
│   ├── jobs.py - Job recommendations
│   └── progress.py - Progress tracking
│
├── models/
│   ├── user.py - User data models
│   ├── resume.py - Resume models
│   ├── training.py - Training models
│   └── assessment.py - Quiz/Interview models
│
└── services/
    ├── ai_service.py - OpenAI integration
    ├── youtube_service.py - YouTube API
    ├── supabase_service.py - Supabase integration
    └── external_apis.py - Other API calls
```

---

## 🔌 API Flow Diagram

### Resume Upload & Analysis Flow

```
┌─────────────┐
│User - Browser│
│ (React App) │
└──────┬──────┘
       │ POST /resume/parse (File)
       ▼
┌──────────────────────────┐
│   FastAPI Backend        │
│ resume.py router         │
└──────┬───────────────────┘
       │
       ├──→ Parse resume (PDF/DOCX)
       │
       ├──→ Extract text & sections
       │
       └──→ Call OpenAI GPT-4
               │
               ├──→ Analyze skills
               ├──→ Identify gaps
               └──→ Generate recommendations
               │
               ▼
        ┌────────────────┐
        │ OpenAI API     │
        │ (GPT-4)        │
        └────────────────┘
       │
       ├──→ Store analysis in Supabase
       │      └──→ ┌──────────────────┐
       │           │ Supabase DB      │
       │           │ (PostgreSQL)     │
       │           └──────────────────┘
       │
       └──→ Return results to frontend
               │
               ▼
           ┌──────────────┐
           │React Frontend│
           │Display results
           └──────────────┘
```

### Quiz & Interview Flow

```
┌─────────────┐
│User Quiz/   │
│Interview    │
└──────┬──────┘
       │ GET /quiz/start or POST /interview/start
       ▼
┌────────────────────────┐
│FastAPI Backend         │
│ quiz.py/interview.py   │
└──────┬─────────────────┘
       │
       ├──→ Generate questions (GPT-4)
       ├──→ Store question context
       └──→ Send questions to frontend
               │
               ▼
           ┌──────────────┐
           │React Frontend│
           │Display Q&A   │
           └──────┬───────┘
                  │ POST /quiz/submit or POST /interview/answer
                  ▼
           ┌────────────────────────┐
           │Process user responses  │
           │Generate feedback (GPT-4)
           └──────┬─────────────────┘
                  │
                  ├──→ Calculate score
                  ├──→ Generate feedback
                  └──→ Store results in Supabase
                       │
                       ▼
                   ┌──────────────────┐
                   │Supabase DB       │
                   └──────────────────┘
```

---

## 🗄️ Database Schema

### Users Table
```sql
users (
  id: UUID PRIMARY KEY
  email: VARCHAR UNIQUE
  password_hash: VARCHAR
  full_name: VARCHAR
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```

### Resumes Table
```sql
resumes (
  id: UUID PRIMARY KEY
  user_id: UUID REFERENCES users(id)
  file_url: VARCHAR
  parsed_data: JSONB
  skills: JSONB
  gaps: JSONB
  score: FLOAT
  created_at: TIMESTAMP
)
```

### Skills Table
```sql
skills (
  id: UUID PRIMARY KEY
  user_id: UUID REFERENCES users(id)
  skill_name: VARCHAR
  proficiency: ENUM (Beginner, Intermediate, Advanced)
  gap_score: FLOAT
  created_at: TIMESTAMP
)
```

### Training Plans Table
```sql
training_plans (
  id: UUID PRIMARY KEY
  user_id: UUID REFERENCES users(id)
  job_role: VARCHAR
  courses: JSONB
  duration_days: INT
  progress: INT (0-100)
  created_at: TIMESTAMP
  completed_at: TIMESTAMP
)
```

### Quiz Results Table
```sql
quiz_results (
  id: UUID PRIMARY KEY
  user_id: UUID REFERENCES users(id)
  domain: VARCHAR
  questions_count: INT
  score: INT
  time_taken: INT
  created_at: TIMESTAMP
)
```

### Interview Results Table
```sql
interview_results (
  id: UUID PRIMARY KEY
  user_id: UUID REFERENCES users(id)
  job_role: VARCHAR
  score: INT
  feedback: TEXT
  areas_improvement: JSONB
  created_at: TIMESTAMP
)
```

---

## 🔐 Authentication Flow

```
┌──────────────┐
│User          │
│(Login)       │
└──────┬───────┘
       │ POST /auth/login
       │ (email, password)
       ▼
┌──────────────────────────┐
│Backend Validation        │
│- Hash password           │
│- Compare with DB         │
└──────┬───────────────────┘
       │
       ✓ Valid
       │
       ├──→ Generate JWT Token
       │    - Header: {alg, typ}
       │    - Payload: {sub, email, exp}
       │    - Signature: HS256
       │
       └──→ Return token to frontend
               │
               ▼
           ┌────────────────────────┐
           │Store token in browser  │
           │localStorage/sessionStorage
           └────────┬───────────────┘
                    │
                    │ Future API calls
                    │ Include: Authorization: Bearer <token>
                    │
                    ▼
           ┌────────────────────────┐
           │Backend validates token │
           │in every request        │
           └────────────────────────┘
```

---

## 🎯 Data Flow: Resume to Job Recommendation

```
1. UPLOAD RESUME
   └──→ Parse & Extract Skills
       └──→ AI Analysis (GPT-4)
           └──→ Generate Skill Gaps

2. SKILL EVALUATION
   └──→ Evaluate against Target Role
       └──→ Identify Strengths & Weaknesses
           └──→ Score Competencies

3. GENERATE TRAINING PLAN
   └──→ Recommend Courses (YouTube)
       └──→ Create Learning Path
           └──→ Set Timelines

4. TRACK PROGRESS
   └──→ Monitor Quiz Scores
       └──→ Track Interview Results
           └──→ Update Skills Level

5. RECOMMEND JOBS
   └──→ Match Skills to Job Requirements
       └──→ Filter by Interests
           └──→ Display Relevant Positions
```

---

## 🚀 Deployment Architecture

### Local Development
```
Developer Machine
├── Terminal 1: Backend (.venv active)
│   └── uvicorn app.main:app --reload (Port 8000)
│
└── Terminal 2: Frontend (npm)
    └── npm run dev (Port 5173)
```

### Production Deployment
```
Cloud Provider (AWS/Heroku/Railway)
├── Backend Container
│   ├── FastAPI Application
│   ├── Gunicorn/Uvicorn
│   └── Environment Variables
│
├── Database
│   └── PostgreSQL (Supabase)
│
├── Frontend Static Hosting
│   ├── Vercel/Netlify
│   └── CDN for assets
│
└── API Gateway
    └── HTTPS/SSL
```

---

## 📊 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI Components |
| **Frontend Styling** | Tailwind CSS | Responsive Design |
| **Frontend HTTP** | Axios | API Calls |
| **Frontend Build** | Vite | Fast Dev Server |
| **Backend** | FastAPI | REST API Framework |
| **Backend Server** | Uvicorn | ASGI Server |
| **Backend Auth** | JWT | Token Authentication |
| **Database** | Supabase (PostgreSQL) | Cloud Database |
| **AI/ML** | OpenAI GPT-4 | Task Intelligence |
| **External APIs** | YouTube, Google, Pexels, News | Content & Data |

---

## 🔄 Request-Response Cycle

```
USER ACTION (React)
       │
       ▼
FRONTEND STATE UPDATE
       │
       ▼
API CALL (axios)
       │
SENDING: Headers + Token + Data
       │
       ▼
BACKEND VALIDATION
├── Check Authentication
├── Validate Input
└── Check Permissions
       │
       ▼
BUSINESS LOGIC
├── Process Request
├── Call AI/External APIs
└── Database Operations
       │
       ▼
RESPONSE GENERATION
└── Format Data
       │
       ▼
SEND RESPONSE
       │
SENDING: Status Code + Headers + Data
       │
       ▼
FRONTEND RECEIVES
├── Parse Response
├── Update State
├── Display UI
└── Handle Errors

---

## 🛡️ Security Layers

1. **Authentication**
   - JWT tokens
   - Password hashing (bcrypt)

2. **Authorization**
   - Role-based access control
   - Token scope validation

3. **Data Protection**
   - HTTPS/SSL in production
   - Input validation
   - SQL injection prevention
   - CORS restrictions

4. **API Security**
   - Rate limiting
   - Request size limits
   - Timeout protection

---

## 📈 Scalability Considerations

**Current:**
- Single server deployment
- SQLite local database

**Future:**
- Load balancing for multiple backend instances
- PostgreSQL with connection pooling
- API rate limiting and caching
- CDN for frontend assets
- WebSocket for real-time features
- Message queue for async tasks

---

## 🎓 Learning Outcomes

This architecture demonstrates:
- ✓ Full-stack web development
- ✓ REST API design
- ✓ Database design
- ✓ Authentication & authorization
- ✓ AI integration
- ✓ External API consumption
- ✓ Frontend state management
- ✓ DevOps & deployment basics

---

**VidyaMitra: Intelligent Career Development Through AI 🚀**
