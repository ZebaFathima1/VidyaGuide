import { saveProgressToSupabase } from './supabaseClient'

const STORAGE_KEY = 'vidyamitraProgress'

function readProgress() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeProgress(data) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    // Async sync to Supabase (fire-and-forget)
    saveProgressToSupabase(data).catch(() => {})
  } catch {
    // ignore storage errors
  }
}

export function getProgress() {
  return readProgress()
}

export function updateProgress(patch) {
  const current = readProgress()
  const updated = { ...current, ...patch }
  writeProgress(updated)
  return updated
}

export function incrementCounter(field) {
  const current = readProgress()
  const value = typeof current[field] === 'number' ? current[field] + 1 : 1
  const updated = { ...current, [field]: value }
  writeProgress(updated)
  return updated
}

export function recordCourseStarted(title) {
  const current = readProgress()
  const courses = new Set(current.coursesStarted || [])
  courses.add(title)
  const updated = updateProgress({ coursesStarted: Array.from(courses) })
  // update count only if newly added
  if (!current.coursesStarted?.includes(title)) {
    incrementCounter('coursesStartedCount')
  }
  return updated
}

export function recordQuizCompleted(topic) {
  const current = readProgress()
  const quizzes = new Set(current.quizzesCompleted || [])
  quizzes.add(topic)
  updateProgress({ quizzesCompleted: Array.from(quizzes) })
  incrementCounter('quizzesCompletedCount')
}

export function recordInterviewPracticed(topic) {
  const current = readProgress()
  const sessions = current.interviewSessions || []
  sessions.push({ topic, at: new Date().toISOString() })
  updateProgress({ interviewSessions: sessions.slice(-50) })
  incrementCounter('interviewSessionsCount')
}
