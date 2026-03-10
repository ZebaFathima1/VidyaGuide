import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Sidebar({ isOpen, setIsOpen }) {
  const links = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/resume', label: 'Resume', icon: '📄' },
    { path: '/skills', label: 'Skills', icon: '🎯' },
    { path: '/training', label: 'Training', icon: '📚' },
    { path: '/quiz', label: 'Quiz', icon: '❓' },
    { path: '/interview', label: 'Interview', icon: '🎤' },
    { path: '/jobs', label: 'Jobs', icon: '💼' },
    { path: '/progress', label: 'Progress', icon: '📊' },
    { path: '/feedback', label: 'Feedback', icon: '💬' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } overflow-y-auto`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 -top-3 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-xl">{link.icon}</span>
            {isOpen && <span className="text-sm">{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
