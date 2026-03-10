import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { supabase } from './utils/supabaseClient'

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
import FeedbackPage from './pages/FeedbackPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-semibold">Loading VidyaMitra...</p>
        </div>
      </div>
    )
  }

  const isAuthenticated = !!session

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? (
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1">
              <Navbar onLogout={handleLogout} session={session} />

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
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
            <Route path="/register" element={<RegisterPage onLogin={() => {}} />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}
