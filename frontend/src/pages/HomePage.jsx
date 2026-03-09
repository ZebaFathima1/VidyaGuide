import { useEffect, useState } from 'react'

export default function HomePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Fetch user data from API
    // const fetchUser = async () => { ... }
  }, [])

  return (
    <div className="fade-in">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">Welcome to VidyaMitra</h1>
      <p className="text-lg text-gray-600 mb-8">Your AI-Powered Career Intelligence Platform</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Resume Score', value: '85%', icon: '📄' },
          { title: 'Skills Assessed', value: '12', icon: '🎯' },
          { title: 'Quizzes Completed', value: '5', icon: '✅' },
          { title: 'Interview Progress', value: '3/10', icon: '🎤' },
        ].map((stat, index) => (
          <div key={index} className="card">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">📄 Resume Analysis</h2>
          <p className="text-gray-600 mb-4">Upload your resume for AI-powered analysis and skill gap identification.</p>
          <button className="btn-primary">Analyze Resume</button>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">🎯 Skill Assessment</h2>
          <p className="text-gray-600 mb-4">Evaluate your current skills against job market demands.</p>
          <button className="btn-primary">Start Assessment</button>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">📚 Training Plans</h2>
          <p className="text-gray-600 mb-4">Get personalized learning paths tailored to your goals.</p>
          <button className="btn-primary">View Plans</button>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">🎤 Mock Interviews</h2>
          <p className="text-gray-600 mb-4">Practice interviews with AI feedback and scoring.</p>
          <button className="btn-primary">Start Interview</button>
        </div>
      </div>
    </div>
  )
}
