import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

export default function Navbar({ onLogout, session }) {
  const navigate = useNavigate()

  const user = session?.user
  const rawName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User'
  const userName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="logo-container hover:opacity-75 transition-opacity"
            title="Go to Home"
          >
            <img
              src="/assets/logo.jpeg"
              alt="VidyaMitra Logo"
              className="nav-logo"
            />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100"
            title="View Profile"
          >
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">{userName}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 btn-secondary px-3 py-2 font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
