import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

export default function RegisterPage({ onLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const navigate = useNavigate()

  const ensureProfile = async (userId, fullName, userEmail) => {
    try {
      await supabase.from('user_profiles').upsert(
        { id: userId, full_name: fullName, email: userEmail },
        { onConflict: 'id' }
      )
    } catch {
      // Non-fatal — profile will be created by trigger or next login
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Ensure profile row exists (fallback if trigger failed)
    if (data?.user) {
      await ensureProfile(data.user.id, name, email)
    }

    // If session is present, email confirmation is disabled — go straight in
    if (data?.session) {
      navigate('/')
    } else {
      // Email confirmation required
      setInfo('✅ Account created! Please check your email to confirm, then sign in.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-medium p-8 fade-in">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <img
              src="/assets/logo.jpeg"
              alt="VidyaMitra Logo"
              className="logo"
            />
            <h1 className="text-3xl font-bold text-gray-900 mt-4">VidyaMitra</h1>
            <p className="text-gray-600 mt-2 font-medium">AI-Powered Career Mentor</p>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Create your account</h2>
          <p className="text-gray-600 mb-6 text-center">Enter your details to get started with VidyaMitra.</p>

          {/* Error / Info Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>
          )}
          {info && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg">{info}</div>
          )}

          {/* Form */}
          {!info && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Create a password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>
          )}

          {/* Link to Login */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
