# 🎨 VidyaMitra Frontend Documentation

> React.js Frontend for AI-Powered Career Intelligence Platform

## Overview

The VidyaMitra frontend is built with **React 18** and **Vite**, providing a fast, modern, and responsive user interface for career intelligence and skill development.

### Key Features

✨ **Interactive Dashboard** - Real-time career analytics
✨ **Resume Upload** - Easy file handling and parsing
✨ **Skill Visualization** - Gap analysis charts and graphs
✨ **Training Planner** - Personalized learning paths
✨ **Quiz System** - Knowledge assessment module
✨ **Mock Interviews** - AI-driven interview practice
✨ **Progress Tracking** - Visual progress dashboards
✨ **Responsive Design** - Works on all devices

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Copy template
copy .env.example .env

# Edit with your settings
# Ensure VITE_API_URL points to backend (http://localhost:8000)
```

### 3. Run Development Server
```bash
npm run dev
```

App opens at: `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/
│   │   ├── images/              # Static images
│   │   ├── icons/              # SVG icons
│   │   └── styles/             # Global styles
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── Sidebar.jsx         # Sidebar menu
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── LoadingSpinner.jsx  # Loading indicator
│   │   ├── Modal.jsx           # Modal component
│   │   └── Cards/              # Reusable card components
│   ├── pages/
│   │   ├── LoginPage.jsx       # Login page
│   │   ├── RegisterPage.jsx    # Registration page
│   │   ├── HomePage.jsx        # Landing page
│   │   ├── ResumePage.jsx      # Resume upload & analysis
│   │   ├── SkillsPage.jsx      # Skill evaluation
│   │   ├── TrainingPage.jsx    # Training plan display
│   │   ├── QuizPage.jsx        # Quiz interface
│   │   ├── InterviewPage.jsx   # Mock interview
│   │   ├── JobsPage.jsx        # Job recommendations
│   │   └── ProgressPage.jsx    # Progress dashboard
│   ├── utils/
│   │   ├── api.js              # API client setup
│   │   ├── auth.js             # Authentication helpers
│   │   ├── validators.js       # Input validation
│   │   └── helpers.js          # Utility functions
│   ├── store/
│   │   └── authStore.js        # Zustand auth store
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/
│   └── favicon.ico             # App favicon
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── package.json                # Dependencies
├── .env.example                # Environment template
└── README.md                   # This file
```

---

## 🎨 Key Pages

### 1. Login & Registration
- User authentication
- Password validation
- Error messages
- Remember me option

### 2. Home Page
- Welcome dashboard
- Quick stats
- Feature overview
- Call-to-action buttons

### 3. Resume Analysis
- File upload interface
- Resume parsing
- Skills extraction view
- Analysis results display

### 4. Skills Dashboard
- Current skills visualization
- Gaps identification
- Recommended courses
- Progress tracking

### 5. Training Plan
- Personalized roadmap
- Course recommendations
- Milestones tracking
- Resource links

### 6. Quiz Module
- Domain selection
- Difficulty levels
- Question display
- Answer submission
- Results analysis

### 7. Mock Interview
- Job role selection
- Question generation
- Voice/Text mode
- Real-time feedback
- Score display

### 8. Progress Tracker
- Learning analytics
- Skill improvements
- Quiz history
- Interview performance
- Overall readiness score

---

## 🔌 API Integration

### API Client Setup
```javascript
// src/utils/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
});

// Add auth token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### API Calls Example
```javascript
// Resume upload
const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/resume/parse', formData);
};

// Get progress
const getProgress = async (userId) => {
  return api.get(`/progress/${userId}`);
};
```

---

## 🧩 Component Examples

### Resume Upload Component
```javascript
import { useState } from 'react';
import api from '../utils/api';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const response = await api.post('/resume/parse', formData);
      console.log('Resume analyzed:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
```

---

## 🎨 Styling with Tailwind

All components use **Tailwind CSS** for styling. Key utility classes:

```html
<!-- Colors -->
<div class="text-blue-500 bg-blue-100"></div>

<!-- Spacing -->
<div class="p-6 m-4 mb-8"></div>

<!-- Responsive -->
<div class="w-full md:w-1/2 lg:w-1/3"></div>

<!-- Flexbox -->
<div class="flex justify-between items-center"></div>

<!-- Shadows & Borders -->
<div class="shadow-lg rounded-lg border border-gray-200"></div>
```

---

## 🔐 Authentication Flow

1. **Login/Register** → User enters credentials
2. **Backend Validation** → Server validates and returns JWT token
3. **Token Storage** → Token saved in localStorage
4. **API Requests** → Token included in Authorization header
5. **Token Refresh** → Automatic token refresh on expiry
6. **Logout** → Token removed from storage

---

## 📦 State Management

Using **Zustand** for lightweight state management:

```javascript
// store/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run with Coverage
```bash
npm test -- --coverage
```

### E2E Testing
```bash
npm run test:e2e
```

---

## ⚡ Performance Optimization

- **Code Splitting** - Route-based lazy loading
- **Image Optimization** - Compressed images
- **CSS Minification** - Tailwind purges unused styles
- **Caching** - API response caching
- **Compression** - Gzip compression

---

## 🌐 Responsive Design

Mobile-first approach using Tailwind breakpoints:

```javascript
// Example responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag & drop dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

---

## 🔄 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_API_TIMEOUT` | API request timeout (ms) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_KEY` | Supabase API key |
| `VITE_DEBUG` | Enable debug mode |

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm test            # Run tests
npm test:e2e        # Run E2E tests
```

---

## 🐛 Debugging

### View Network Requests
Open DevTools → Network tab → Check API calls

### Console Logging
```javascript
console.log('Component rendered');
console.error('Error occurred');
console.warn('Warning message');
```

### React DevTools Extension
Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools) for Chrome

---

## 📝 Code Standards

- Use functional components with hooks
- Write meaningful component names
- Add PropTypes or TypeScript
- Keep components focused
- Write reusable components
- Follow naming conventions (camelCase)

---

## 🤝 Contributing

1. Create feature branch
2. Follow code standards
3. Test your changes
4. Submit pull request

---

## 📞 Support

- 📧 Email: frontend@vidyamitra.com
- 🐛 Report Issues: [GitHub Issues](https://github.com/vidyamitra/issues)

---

**Happy Coding! 🎉**
#   V i d y a G u i d e  
 