const API_BASE = '/api' // Vite proxy to backend at localhost:8000

async function callGemini(prompt) {
  const res = await fetch(`${API_BASE}/gemini/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `API error (${res.status})`)
  }

  const data = await res.json()
  return data.text || ''
}

export async function analyzeResumeWithGemini(rawText) {
  const prompt = `
You are an expert ATS resume analyzer. Analyze the following resume text and respond ONLY with valid JSON.

The JSON shape must be:
{
  "name": string | null,
  "email": string | null,
  "phone": string | null,
  "skills": string[],
  "education": string[],
  "experience": string[],
  "projects": string[],
  "score": number,
  "summary": string,
  "suggestions": {
    "missingSkills": string[],
    "formatting": string[],
    "ats": string[],
    "sections": string[]
  }
}

Resume text:
"""${rawText.slice(0, 12000)}"""
`
  const text = await callGemini(prompt)
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Failed to parse resume analysis')
    return JSON.parse(match[0])
  }
}

export async function generateQuizQuestions(topic, count = 8) {
  const prompt = `
Generate ${count} multiple-choice quiz questions on the topic "${topic}".
Return ONLY valid JSON in the following format:
[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correctIndex": number,
    "explanation": "string"
  },
  ...
]
`
  const text = await callGemini(prompt)
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('Failed to parse quiz')
    return JSON.parse(match[0])
  }
}

export async function generateInterviewQuestions(topic, count = 10) {
  const prompt = `
Generate ${count} interview practice questions for the role/skill "${topic}".
Return ONLY valid JSON in the following format:
[
  {
    "question": "string",
    "answer": "concise model answer",
    "difficulty": "Beginner" | "Intermediate" | "Advanced"
  },
  ...
]
`
  const text = await callGemini(prompt)
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('Failed to parse interview questions')
    return JSON.parse(match[0])
  }
}

export async function analyzeFeedbackSentiment(textInput) {
  const prompt = `
Classify the sentiment of the following feedback as "positive", "neutral", or "negative" and provide a short justification.
Return ONLY valid JSON:
{
  "sentiment": "positive" | "neutral" | "negative",
  "reason": "string"
}

Feedback:
"""${textInput.slice(0, 4000)}"""
`
  const text = await callGemini(prompt)
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Failed to parse sentiment')
    return JSON.parse(match[0])
  }
}
