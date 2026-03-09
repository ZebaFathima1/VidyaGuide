# 💡 VidyaMitra Development Guide

## 🎯 Project Standards & Best Practices

### Python Code Style (Backend)

**Follow PEP 8:**
```python
# ✅ Good
def calculate_skill_gap(current_score, target_score):
    """Calculate skill gap between current and target"""
    return target_score - current_score

# ❌ Bad
def calc_gap(cs, ts):
    return ts - cs
```

**Use Type Hints:**
```python
# ✅ Good
async def get_user(user_id: str) -> dict:
    return {"id": user_id}

# ❌ Bad
async def get_user(user_id):
    return {"id": user_id}
```

**Write Docstrings:**
```python
# ✅ Good
def parse_resume(file_path: str) -> dict:
    """
    Parse resume file and extract information.
    
    Args:
        file_path: Path to resume file (PDF/DOCX)
        
    Returns:
        Dictionary with extracted resume data
        
    Raises:
        FileNotFoundError: If file doesn't exist
    """
    pass

# ❌ Bad
def parse_resume(file_path):
    pass
```

---

### React Code Style (Frontend)

**Use Functional Components:**
```javascript
// ✅ Good
export default function MyComponent() {
  const [data, setData] = useState(null)
  
  return <div>{data}</div>
}

// ❌ Bad - using class components (legacy)
class MyComponent extends React.Component {
  // ...
}
```

**Use Hooks:**
```javascript
// ✅ Good
useEffect(() => {
  fetchData()
}, [])

// ❌ Bad - class lifecycle methods
```

**Meaningful Variable Names:**
```javascript
// ✅ Good
const [isLoading, setIsLoading] = useState(false)
const [userResume, setUserResume] = useState(null)

// ❌ Bad
const [loading, setLoading] = useState(false)
const [data, setData] = useState(null)
```

---

## 🔄 Git Workflow

### Branch Naming
```
feature/add-resume-parser
feature/improve-dashboard
bugfix/fix-login-error
docs/update-readme
```

### Commit Messages
```
# ✅ Good
git commit -m "feat: Add resume parsing with GPT-4 integration"
git commit -m "fix: Resolve CORS issues with frontend"
git commit -m "docs: Update setup guide with API keys"

# ❌ Bad
git commit -m "fixed stuff"
git commit -m "changes"
```

### Commit Often
```bash
# Make small, focused commits
git status
git add .
git commit -m "Add specific feature"
git push origin feature/my-feature
```

---

## 🧪 Testing Strategy

### Backend Testing

**Unit Tests:**
```python
# tests/test_models.py
import pytest
from app.models.user import User

def test_user_creation():
    user = User(email="test@example.com", password="hash123")
    assert user.email == "test@example.com"
```

**Integration Tests:**
```python
# tests/test_api.py
def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
```

**Run Tests:**
```bash
pytest                    # All tests
pytest -v                # Verbose
pytest tests/test_*.py   # Specific file
pytest -k "test_health"  # Specific test
```

### Frontend Testing

**Component Tests:**
```javascript
import { render } from '@testing-library/react'
import MyComponent from './MyComponent'

test('renders component', () => {
  const { getByText } = render(<MyComponent />)
  expect(getByText('Expected Text')).toBeInTheDocument()
})
```

---

## 📋 Code Review Checklist

### Before Submitting PR

- [ ] Code follows project style guides
- [ ] All tests pass locally
- [ ] No console errors/warnings
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] No hardcoded values
- [ ] No console.log() left in code
- [ ] Security: No exposed API keys
- [ ] Performance: No N+1 queries
- [ ] Accessibility: ARIA labels present

### Reviewing Others' Code

```
✓ Does it solve the problem?
✓ Is it efficient?
✓ Is it readable?
✓ Does it follow standards?
✓ Are there edge cases handled?
✓ Is error handling proper?
✓ Any security concerns?
✓ Is it well tested?
✓ Any performance issues?
```

---

## 🐛 Debugging Workflow

### Backend Debugging

**1. Check Logs:**
```bash
# Real-time logs
tail -f logs/vidyamitra.log

# Search for errors
grep "ERROR" logs/vidyamitra.log
```

**2. Add Debug Prints:**
```python
from app.core.config import DEBUG

if DEBUG:
    print("Debug info:", my_variable)
```

**3. Use Debugger:**
```python
import pdb
pdb.set_trace()  # Execution stops here
# Commands: n (next), s (step), c (continue), l (list)
```

**4. Test with Swagger:**
- Visit http://localhost:8000/docs
- Try endpoints interactively
- See request/response

### Frontend Debugging

**1. Browser DevTools (F12):**
- Console tab: JavaScript errors
- Network tab: API calls
- Storage tab: localStorage/cookies
- React DevTools extension

**2. Add Debug Logs:**
```javascript
if (import.meta.env.VITE_DEBUG) {
  console.log("Debug:", data)
}
```

**3. Debugger Statement:**
```javascript
debugger; // Pauses execution if DevTools open
```

**4. React.Profiler:**
```javascript
import { Profiler } from 'react'
<Profiler id="component" onRender={callback}>
  <Component />
</Profiler>
```

---

## 🚀 Performance Optimization

### Backend

**1. Database:**
```python
# ❌ Bad - N+1 queries
users = db.query(User).all()
for user in users:
    resume = db.query(Resume).filter(Resume.user_id == user.id).first()

# ✅ Good - Join queries
users_with_resume = db.query(User).join(Resume).all()
```

**2. Caching:**
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_job_roles():
    return db.query(JobRole).all()
```

**3. Async Operations:**
```python
# ✅ Good - Non-blocking
async def upload_resume(file):
    # Process file
    return result
```

### Frontend

**1. Code Splitting:**
```javascript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./Heavy'))

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

**2. Memoization:**
```javascript
import { memo } from 'react'

const MyComponent = memo(({ data }) => {
  return <div>{data}</div>
})
```

**3. Images:**
```javascript
// ✅ Use next-gen formats
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="description" />
</picture>
```

---

## 🛡️ Security Best Practices

### Secrets Management
```python
# ✅ Good - Use environment variables
API_KEY = os.getenv("OPENAI_API_KEY")

# ❌ Bad - Hardcoded secrets
API_KEY = "sk-abc123xyz"
```

### Input Validation
```python
# ✅ Good - Validate inputs
from pydantic import EmailStr

class User(BaseModel):
    email: EmailStr  # Automatically validates email
    age: int = Field(..., gt=0, lt=150)

# ❌ Bad - No validation
user = User(email=user_input, age=user_input)
```

### SQL Injection Prevention
```python
# ✅ Good - Use ORM or parameterized queries
user = db.query(User).filter(User.email == email).first()

# ❌ Bad - String concatenation
query = f"SELECT * FROM users WHERE email = {email}"
```

### CORS Configuration
```python
# ✅ Good - Restrict origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
)

# ❌ Bad - Allow all origins
allow_origins=["*"]
```

---

## 📚 Documentation Standards

### Docstring Format (Backend)
```python
def evaluate_resume(resume_text: str, target_role: str) -> dict:
    """
    Evaluate resume against a target job role.
    
    Uses GPT-4 to analyze skills, experience, and gaps
    compared to the target position requirements.
    
    Args:
        resume_text: Parsed resume content as string
        target_role: Target job position (e.g., "Data Science")
        
    Returns:
        Dictionary containing:
        - score: Evaluation score (0-100)
        - skills: Identified skills
        - gaps: Skill gaps identified
        - recommendations: Improvement suggestions
        
    Raises:
        ValueError: If resume_text is empty
        APIError: If GPT-4 API call fails
        
    Example:
        >>> result = evaluate_resume(resume, "Data Scientist")
        >>> print(result['score'])
        85
    """
```

### JSDoc Format (Frontend)
```javascript
/**
 * Fetches user resume analysis from backend.
 * 
 * @async
 * @param {string} userId - The user ID to fetch resume for
 * @returns {Promise<Object>} Resume analysis object
 * @throws {Error} If API request fails
 * 
 * @example
 * const analysis = await getResumeAnalysis("user123")
 * console.log(analysis.score)
 */
async function getResumeAnalysis(userId) {
  // Implementation
}
```

---

## 🔧 Useful Development Tools

### Backend Tools
```bash
# Format code
pip install black
black app/

# Lint code
pip install flake8
flake8 app/

# Type checking
pip install mypy
mypy app/

# Security check
pip install bandit
bandit -r app/
```

### Frontend Tools
```bash
# Format code
npm run format

# Lint code
npm run lint

# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
```

### General Tools
```bash
# API testing
Postman or Insomnia

# Version control
Git with GitHub/GitLab

# Environment management
DotEnv files

# Documentation
Swagger/OpenAPI

# Monitoring
Sentry (error tracking)
New Relic (performance)
```

---

## 📞 Getting Help

### When Stuck

1. **Check the docs:**
   - Project README files
   - API documentation at `/docs`
   - External library documentation

2. **Search existing issues:**
   - GitHub issues
   - Stack Overflow
   - Documentation

3. **Debug systematically:**
   - Reproduce the issue
   - Isolate the problem
   - Check error messages
   - Review recent changes

4. **Ask for help:**
   - Team members
   - Code reviews
   - Discussion forums

---

## ✅ Pre-Deployment Checklist

### Backend
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database migrations done
- [ ] Security scan passed
- [ ] Performance optimized
- [ ] Logging configured
- [ ] API documented
- [ ] CORS configured for production

### Frontend
- [ ] All tests passing
- [ ] No console errors
- [ ] Build succeeds
- [ ] No broken links
- [ ] Responsive design tested
- [ ] API URLs updated
- [ ] Environment variables set
- [ ] Analytics configured if needed
- [ ] Performance optimized

---

## 🎓 Learning Resources

### Python/FastAPI
- Real Python (https://realpython.com)
- FastAPI official tutorial
- Miguel Grinberg's Flask tutorials

### React
- Official React documentation
- Scrimba React course
- React Patterns

### Databases
- SQL Zoo
- PostgreSQL documentation
- Database design principles

### Web Development
- MDN Web Docs
- CSS-Tricks
- Dev.to articles

---

**Remember: Clean code is a team sport! 🏟️**

Write code that your teammates (and future you) will be grateful for!
