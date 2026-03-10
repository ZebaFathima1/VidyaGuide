import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { generateInterviewQuestions } from '../utils/geminiClient'
import { getFallbackInterview } from '../utils/fallbackQuestions'
import { recordInterviewPracticed } from '../utils/progressTracker'
import { saveInterviewSessionToSupabase } from '../utils/supabaseClient'

const ROLES = ['Python Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Frontend Developer', 'Backend Engineer', 'AI/ML Engineer']

export default function InterviewPage() {
  const [role, setRole] = useState('Python Developer')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setQuestions([])
    setExpandedId(null)

    generateInterviewQuestions(role, 10)
      .then((generated) => {
        if (cancelled) return
        const qs = Array.isArray(generated) && generated.length > 0
          ? generated.map((q, i) => ({ ...q, id: i + 1 }))
          : getFallbackInterview(role).map((q, i) => ({ ...q, id: i + 1 }))
        setQuestions(qs)

        // Record in localStorage + Supabase
        recordInterviewPracticed(role)
        saveInterviewSessionToSupabase({ role, questionsCount: qs.length }).catch(console.warn)
      })
      .catch((err) => {
        if (cancelled) return
        const qs = getFallbackInterview(role).map((q, i) => ({ ...q, id: i + 1 }))
        setQuestions(qs)
        recordInterviewPracticed(role)
        saveInterviewSessionToSupabase({ role, questionsCount: qs.length }).catch(console.warn)
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [role])

  const searchFiltered = questions.filter(
    (q) =>
      (q.question || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.answer || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDifficultyColor = (d) => {
    if (!d) return 'bg-gray-100 text-gray-700'
    const diff = String(d)
    if (diff.includes('Beginner')) return 'bg-green-100 text-green-700'
    if (diff.includes('Intermediate')) return 'bg-blue-100 text-blue-700'
    if (diff.includes('Advanced')) return 'bg-purple-100 text-purple-700'
    return 'bg-gray-100 text-gray-700'
  }

  if (loading && questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">🎤 Interview Prep</h1>
          <p className="text-gray-600 text-lg">Practice with AI-generated interview questions</p>
        </div>
        <div className="card text-center py-16">
          <p className="text-xl font-semibold text-gray-700">🔄 Generating fresh interview questions...</p>
          <p className="text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">🎤 Interview Prep</h1>
        <p className="text-gray-600 text-lg">Practice with AI-generated interview questions for your target role</p>
      </div>

      {/* Role selector */}
      <div className="card">
        <p className="text-gray-600 font-semibold mb-3">Select role/skill (new questions on each load):</p>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              disabled={loading}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                role === r ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {/* Search */}
      {questions.length > 0 && (
        <div className="card">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Stats */}
      {questions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-gray-600 text-sm">Total Questions</p>
            <p className="text-3xl font-bold text-blue-600">{questions.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-gray-600 text-sm">Filtered</p>
            <p className="text-3xl font-bold text-green-600">{searchFiltered.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-gray-600 text-sm">Role</p>
            <p className="text-2xl font-bold text-purple-600">{role}</p>
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-3">
        {searchFiltered.map((q) => (
          <div
            key={q.id}
            className="card cursor-pointer hover:shadow-lg transition border-l-4 border-blue-500"
            onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty || 'N/A'}
                  </span>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{role}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{q.question}</h3>
              </div>
              {expandedId === q.id
                ? <ChevronUp className="w-6 h-6 text-blue-600 flex-shrink-0 ml-4" />
                : <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />}
            </div>
            {expandedId === q.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-gray-900 leading-relaxed">{q.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length > 0 && searchFiltered.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No questions match your search.</p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-6">
        <h4 className="font-bold text-lg text-gray-900 mb-3">💡 Interview Tips</h4>
        <ul className="space-y-2 text-gray-700">
          <li>✅ <strong>Communicate clearly:</strong> Explain your thought process</li>
          <li>✅ <strong>Ask clarifying questions:</strong> Understand requirements before answering</li>
          <li>✅ <strong>Test your solution:</strong> Walk through examples and edge cases</li>
          <li>✅ <strong>Discuss trade-offs:</strong> Show awareness of different approaches</li>
          <li>✅ <strong>Practice regularly:</strong> Refresh the page for new questions</li>
        </ul>
      </div>
    </div>
  )
}
