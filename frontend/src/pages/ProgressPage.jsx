import { useState, useEffect } from 'react'
import { TrendingUp, Flame, CheckCircle } from 'lucide-react'
import { getProgress } from '../utils/progressTracker'
import { loadProgressSummaryFromSupabase } from '../utils/supabaseClient'
import { supabase } from '../utils/supabaseClient'

const COURSE_LIST = [
  { id: 1, name: 'Python Fundamentals', modules: 12 },
  { id: 2, name: 'Web Development with React', modules: 18 },
  { id: 3, name: 'Data Structures Essentials', modules: 15 },
  { id: 4, name: 'Machine Learning Basics', modules: 14 },
  { id: 5, name: 'Database Design & SQL', modules: 13 },
  { id: 6, name: 'Backend Development with Node.js', modules: 16 },
]

export default function ProgressPage() {
  const [displayName, setDisplayName] = useState('Learner')
  const [progress, setProgress] = useState(getProgress())
  const [quizResults, setQuizResults] = useState([])
  const [interviewSessions, setInterviewSessions] = useState([])
  const [resumeSkills, setResumeSkills] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // Get name from Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata
        const name = meta?.full_name || session.user.email?.split('@')[0] || 'Learner'
        setDisplayName(name.charAt(0).toUpperCase() + name.slice(1))
      }
    })

    // Load full progress from Supabase
    loadProgressSummaryFromSupabase().then((summary) => {
      if (summary) {
        if (summary.progress && Object.keys(summary.progress).length > 0) {
          setProgress(summary.progress)
        }
        setQuizResults(summary.quizResults || [])
        setInterviewSessions(summary.interviewSessions || [])
        if (summary.resumeSkills?.length > 0) {
          setResumeSkills(summary.resumeSkills)
        }
        if (summary.fullName) {
          setDisplayName(summary.fullName.charAt(0).toUpperCase() + summary.fullName.slice(1))
        }
      }
      setDataLoaded(true)
    })
  }, [])

  const coursesStarted = progress.coursesStarted || []
  const quizzesCompleted = progress.quizzesCompleted || []
  const interviewCount = progress.interviewSessionsCount || interviewSessions.length || 0
  const quizzesCount = quizResults.length > 0 ? quizResults.length : quizzesCompleted.length
  const coursesCount = coursesStarted.length

  const courses = COURSE_LIST.map(c => ({
    ...c,
    completed: coursesStarted.includes(c.name),
    progress: coursesStarted.includes(c.name) ? 100 : 0,
  }))

  // Use real resume skills if available, else empty
  const skills = resumeSkills.length > 0
    ? resumeSkills.map(s => ({
        name: s.name,
        level: s.level || 'Intermediate',
        proficiency: Math.round(s.proficiency || 70),
      }))
    : []

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Start your first course', icon: '🚀', unlocked: coursesCount >= 1 },
    { id: 2, name: 'Python Master', description: 'Complete Python Fundamentals', icon: '🐍', unlocked: coursesStarted.includes('Python Fundamentals') },
    { id: 3, name: 'Quiz Taker', description: 'Complete 1 quiz', icon: '⚡', unlocked: quizzesCount >= 1 },
    { id: 4, name: 'Quiz Legend', description: 'Complete 5 quizzes', icon: '🏆', unlocked: quizzesCount >= 5 },
    { id: 5, name: 'Interview Prep', description: 'Practice interview questions', icon: '💻', unlocked: interviewCount >= 1 },
    { id: 6, name: 'Interview Pro', description: 'Practice 5+ interview sessions', icon: '🌐', unlocked: interviewCount >= 5 },
    { id: 7, name: 'Multi-Topic Learner', description: 'Complete quizzes in 3+ topics', icon: '🤖', unlocked: quizzesCount >= 3 },
    { id: 8, name: 'Course Explorer', description: 'Start 3+ courses', icon: '📚', unlocked: coursesCount >= 3 },
  ]

  const overallProgress = Math.min(100, (coursesCount * 15 + quizzesCount * 10 + interviewCount * 5) || 10)

  const stats = [
    { label: 'Courses Started', value: coursesCount, icon: '📚' },
    { label: 'Courses Completed', value: courses.filter(c => c.completed).length, icon: '✅' },
    { label: 'Quizzes Completed', value: quizzesCount, icon: '⭐' },
    { label: 'Interview Sessions', value: interviewCount, icon: '🎤' },
    { label: 'Achievements Earned', value: achievements.filter(a => a.unlocked).length, icon: '🏅' },
    { label: 'Overall Progress', value: `${overallProgress}%`, icon: '📊' },
  ]

  const dailyActivity = [
    { day: 'Mon', hours: 1 + Math.min(coursesCount + quizzesCount, 3) },
    { day: 'Tue', hours: 1.5 + Math.min(quizzesCount, 2) },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 2 },
    { day: 'Fri', hours: 2 + Math.min(interviewCount, 2) },
    { day: 'Sat', hours: 2.5 },
    { day: 'Sun', hours: 1.5 },
  ]
  const maxHours = Math.max(...dailyActivity.map(d => d.hours), 1)

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">📊 My Progress</h1>
        <p className="text-gray-600 text-lg">Track your learning journey and celebrate your achievements</p>
      </div>

      {/* Welcome Card */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {displayName}! 👋</h2>
            <p className="text-gray-600 mb-3">Track your learning progress in real time</p>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-1">Overall Progress</p>
              <div className="w-64 bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
              </div>
              <p className="text-sm text-gray-600 mt-1">{overallProgress}% Complete</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-orange-600">{quizzesCount}</p>
              <p className="text-xs text-gray-600">Quizzes Done</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">{interviewCount}</p>
              <p className="text-xs text-gray-600">Interviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="card bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-purple-600">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Weekly Activity</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {dailyActivity.map((activity, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-200 rounded-t hover:bg-blue-400 transition" style={{ height: `${(activity.hours / maxHours) * 120}px` }} />
              <p className="text-xs font-bold text-gray-600 mt-2">{activity.day}</p>
              <p className="text-xs text-gray-500">{activity.hours}h</p>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Progress */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Course Progress</h3>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{course.name}</h4>
                  <p className="text-sm text-gray-600">{course.completed ? course.modules : 0} of {course.modules} modules</p>
                </div>
                {course.completed && <CheckCircle className="w-6 h-6 text-green-600" />}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${course.completed ? 'bg-green-600' : 'bg-blue-600'}`} style={{ width: `${course.progress}%` }} />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                <span>{course.progress}%</span>
                {course.completed && <span className="text-green-600 font-semibold">Started ✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Matrix — from resume */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Skills Proficiency</h3>
        {skills.length === 0 ? (
          <p className="text-gray-500 italic">
            {dataLoaded
              ? 'Upload your resume to see your skill proficiency here.'
              : 'Loading skills...'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-900">{skill.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    skill.level === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                    skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>{skill.level}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all" style={{ width: `${skill.proficiency}%` }} />
                </div>
                <p className="text-xs text-gray-600 mt-1">{skill.proficiency}%</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz Results — real data from Supabase */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">⭐ Quiz Results</h3>
        {quizResults.length === 0 ? (
          <p className="text-gray-500">Complete quizzes to see your scores here.</p>
        ) : (
          <div className="space-y-2">
            {quizResults.map((quiz, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{quiz.topic}</p>
                  <p className="text-xs text-gray-600">
                    {quiz.score}/{quiz.total} correct · {new Date(quiz.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                  quiz.percentage >= 90 ? 'bg-green-100 text-green-700' :
                  quiz.percentage >= 70 ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {quiz.percentage}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interview Sessions — real data from Supabase */}
      {interviewSessions.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎤 Interview Sessions</h3>
          <div className="space-y-2">
            {interviewSessions.map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{session.role}</p>
                  <p className="text-xs text-gray-600">
                    {session.questions_count} questions · {new Date(session.practiced_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span className="text-green-600 font-semibold text-sm bg-green-50 px-3 py-1 rounded-full">✓ Practiced</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg text-center transition transform hover:scale-105 ${
                achievement.unlocked
                  ? 'bg-yellow-50 border-2 border-yellow-400'
                  : 'bg-gray-100 border-2 border-gray-300 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h4 className="font-bold text-sm text-gray-900 mb-1">{achievement.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
              {achievement.unlocked
                ? <p className="text-xs text-green-600 font-semibold">✓ Unlocked</p>
                : <p className="text-xs text-gray-600">Locked</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 rounded-lg p-6">
        <h4 className="font-bold text-lg text-gray-900 mb-3">🎯 Your Learning Goals</h4>
        <ul className="space-y-2 text-gray-700">
          <li><strong>📅 Short-term:</strong> Complete React course by end of March</li>
          <li><strong>📅 Mid-term:</strong> Master Data Structures & Algorithms (90%+)</li>
          <li><strong>📅 Long-term:</strong> Transition to Software Engineer role</li>
          <li><strong>🔥 Streak Goal:</strong> Maintain 30-day learning streak</li>
        </ul>
      </div>
    </div>
  )
}
