import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

// Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResumePage from './pages/ResumePage'
import SkillsPage from './pages/SkillsPage'
import TrainingPage from './pages/TrainingPage'
import QuizPage from './pages/QuizPage'
import InterviewPage from './pages/InterviewPage'
import JobsPage from './pages/JobsPage'
import ProgressPage from './pages/ProgressPage'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? (
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1">
              <Navbar onLogout={handleLogout} />
              
              <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-6`}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/training" element={<TrainingPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/interview" element={<InterviewPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}
