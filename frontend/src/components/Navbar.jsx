import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6 text-gray-600" />
          <h1 className="text-lg font-semibold text-gray-900">VidyaMitra</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 btn-secondary px-3 py-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
