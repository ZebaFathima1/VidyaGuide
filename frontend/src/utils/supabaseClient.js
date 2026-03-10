import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Auth helpers ───────────────────────────────────────────────
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ── Resume helpers ─────────────────────────────────────────────
export async function saveResumeToSupabase(analysisData) {
  const session = await getCurrentSession()
  if (!session) return { error: 'Not authenticated' }

  const { error } = await supabase.from('resume_data').upsert(
    {
      user_id: session.user.id,
      skills: analysisData.skills || [],
      score: analysisData.score,
      full_name: analysisData.fullName,
      email: analysisData.email,
      phone: analysisData.phone,
      experience: analysisData.experience || [],
      gaps: analysisData.gaps || [],
      gemini_summary: analysisData.geminiSummary || null,
      raw_analysis: analysisData.geminiRaw || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )
  return { error }
}

export async function loadResumeSkillsFromSupabase() {
  const session = await getCurrentSession()
  if (!session) return null

  const { data, error } = await supabase
    .from('resume_data')
    .select('skills, score, full_name')
    .eq('user_id', session.user.id)
    .single()

  if (error || !data) return null
  return data.skills && data.skills.length > 0 ? data.skills : null
}

// ── Progress helpers ───────────────────────────────────────────
export async function saveProgressToSupabase(progress) {
  const session = await getCurrentSession()
  if (!session) return

  await supabase.from('user_progress').upsert(
    {
      user_id: session.user.id,
      courses_started: progress.coursesStarted || [],
      quizzes_completed: progress.quizzesCompleted || [],
      interview_sessions: progress.interviewSessions || [],
      courses_started_count: progress.coursesStartedCount || 0,
      quizzes_completed_count: progress.quizzesCompletedCount || 0,
      interview_sessions_count: progress.interviewSessionsCount || 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )
}

// ── Quiz helpers ───────────────────────────────────────────────
export async function saveQuizResultToSupabase({ topic, score, total, percentage }) {
  const session = await getCurrentSession()
  if (!session) return

  await supabase.from('quiz_results').insert({
    user_id: session.user.id,
    topic,
    score,
    total,
    percentage,
  })
}

export async function loadQuizResultsFromSupabase() {
  const session = await getCurrentSession()
  if (!session) return []

  const { data } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', session.user.id)
    .order('completed_at', { ascending: false })
    .limit(20)

  return data || []
}

// ── Interview session helpers ──────────────────────────────────
export async function saveInterviewSessionToSupabase({ role, questionsCount }) {
  const session = await getCurrentSession()
  if (!session) return

  await supabase.from('interview_sessions').insert({
    user_id: session.user.id,
    role,
    questions_count: questionsCount,
  })
}

export async function loadInterviewSessionsFromSupabase() {
  const session = await getCurrentSession()
  if (!session) return []

  const { data } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('practiced_at', { ascending: false })
    .limit(20)

  return data || []
}

// ── Job application helpers ────────────────────────────────────
export async function saveJobApplicationToSupabase(applicationData) {
  const session = await getCurrentSession()

  const { error } = await supabase.from('job_applications').insert({
    user_id: session?.user?.id || null,
    job_id: applicationData.jobId,
    job_title: applicationData.jobTitle,
    company: applicationData.company,
    applicant_name: applicationData.name,
    applicant_email: applicationData.email,
    applicant_phone: applicationData.phone || null,
    resume_file_name: applicationData.resumeFileName || null,
  })
  return { error }
}

// ── Saved jobs (favourites) helpers ───────────────────────────
export async function loadSavedJobIdsFromSupabase() {
  const session = await getCurrentSession()
  if (!session) return []

  const { data } = await supabase
    .from('saved_jobs')
    .select('job_id')
    .eq('user_id', session.user.id)

  return (data || []).map(r => r.job_id)
}

export async function toggleSavedJobInSupabase(jobId, jobTitle, company, currentlySaved) {
  const session = await getCurrentSession()
  if (!session) return

  if (currentlySaved) {
    await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', session.user.id)
      .eq('job_id', jobId)
  } else {
    await supabase.from('saved_jobs').insert({
      user_id: session.user.id,
      job_id: jobId,
      job_title: jobTitle,
      company,
    })
  }
}

// ── Feedback helpers ───────────────────────────────────────────
export async function saveFeedbackToSupabase({ name, email, rating, message, sentiment, sentimentReason }) {
  const session = await getCurrentSession()

  const { error } = await supabase.from('feedback').insert({
    user_id: session?.user?.id || null,
    name,
    email,
    rating,
    message,
    sentiment: sentiment || null,
    sentiment_reason: sentimentReason || null,
  })
  return { error }
}

// ── Full progress summary for ProgressPage ────────────────────
export async function loadProgressSummaryFromSupabase() {
  const session = await getCurrentSession()
  if (!session) return null

  const [progressRes, quizRes, interviewRes, resumeRes] = await Promise.all([
    supabase.from('user_progress').select('*').eq('user_id', session.user.id).single(),
    supabase.from('quiz_results').select('*').eq('user_id', session.user.id).order('completed_at', { ascending: false }),
    supabase.from('interview_sessions').select('*').eq('user_id', session.user.id).order('practiced_at', { ascending: false }),
    supabase.from('resume_data').select('skills, full_name').eq('user_id', session.user.id).single(),
  ])

  return {
    progress: progressRes.data || {},
    quizResults: quizRes.data || [],
    interviewSessions: interviewRes.data || [],
    resumeSkills: resumeRes.data?.skills || [],
    fullName: resumeRes.data?.full_name || null,
  }
}
