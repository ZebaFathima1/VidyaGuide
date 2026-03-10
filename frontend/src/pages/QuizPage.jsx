import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react'
import { generateQuizQuestions } from '../utils/geminiClient'
import { getFallbackQuiz } from '../utils/fallbackQuestions'
import { recordQuizCompleted } from '../utils/progressTracker'
import { saveQuizResultToSupabase } from '../utils/supabaseClient'

const TOPICS = ['Python', 'Data Structures', 'AI Concepts', 'Databases', 'Web Development']

export default function QuizPage() {
  const [topic, setTopic] = useState('Python')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setQuestions([])
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setAnswered(false)

    generateQuizQuestions(topic, 8)
      .then((generated) => {
        if (cancelled) return
        setQuestions(Array.isArray(generated) && generated.length > 0 ? generated : getFallbackQuiz(topic))
      })
      .catch(() => {
        if (!cancelled) setQuestions(getFallbackQuiz(topic))
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [topic])

  // Save result to Supabase when quiz finishes
  useEffect(() => {
    if (showScore && questions.length > 0) {
      const percentage = Math.round((score / questions.length) * 100)
      saveQuizResultToSupabase({ topic, score, total: questions.length, percentage }).catch(console.warn)
    }
  }, [showScore])

  const currentQ = questions[currentQuestion]
  const correctIndex = currentQ?.correctIndex ?? currentQ?.correct ?? 0

  const handleAnswerClick = (index) => {
    if (answered || !currentQ) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === correctIndex) setScore((s) => s + 1)
  }

  const handleNext = () => {
    const next = currentQuestion + 1
    if (next < questions.length) {
      setCurrentQuestion(next)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      recordQuizCompleted(topic)
      setShowScore(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setAnswered(false)
    setLoading(true)
    setError(null)
    generateQuizQuestions(topic, 8)
      .then((generated) => {
        setQuestions(Array.isArray(generated) && generated.length > 0 ? generated : getFallbackQuiz(topic))
      })
      .catch(() => setQuestions(getFallbackQuiz(topic)))
      .finally(() => setLoading(false))
  }

  if (loading && questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">❓ Quiz</h1>
          <p className="text-gray-600 text-lg">Test your knowledge with AI-generated questions</p>
        </div>
        <div className="card text-center py-16">
          <p className="text-xl font-semibold text-gray-700">🔄 Generating fresh quiz questions with AI...</p>
          <p className="text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">❓ Quiz</h1>
        <p className="text-gray-600 text-lg">Test your knowledge with AI-generated questions across various topics</p>
      </div>

      {/* Topic selector */}
      <div className="mb-6">
        <p className="text-gray-600 font-semibold mb-3">Choose a topic (new questions each time):</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              disabled={loading}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                topic === t ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {showScore ? (
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 text-center">
          <div className="mb-6">
            <Award className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed! 🎉</h2>
            <p className="text-gray-600 mb-4">Your score has been saved to your profile.</p>
          </div>
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {questions.length ? Math.round((score / questions.length) * 100) : 0}%
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {score} out of {questions.length}
            </p>
            <div className="text-gray-600">
              {score / questions.length >= 0.8
                ? '🌟 Excellent work!'
                : score / questions.length >= 0.6
                ? '👍 Good effort!'
                : '💪 Keep practicing!'}
            </div>
          </div>
          <button
            onClick={resetQuiz}
            className="btn-primary w-full py-3 font-bold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Try Again (New Questions)
          </button>
        </div>
      ) : currentQ && !error ? (
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <div className="w-64 bg-gray-300 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-xl font-bold text-blue-600">Score: {score}</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQ.question}</h2>

          <div className="space-y-3 mb-6">
            {(currentQ.options || []).map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={answered}
                className={`w-full p-4 text-left rounded-lg font-semibold transition ${
                  selectedAnswer === index
                    ? index === correctIndex
                      ? 'bg-green-100 border-2 border-green-500 text-green-700'
                      : 'bg-red-100 border-2 border-red-500 text-red-700'
                    : answered && index === correctIndex
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : 'bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-900 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? index === correctIndex ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500'
                      : answered && index === correctIndex ? 'border-green-500 bg-green-500' : 'border-gray-400'
                  }`}>
                    {selectedAnswer === index && index === correctIndex && <CheckCircle className="w-4 h-4 text-white" />}
                    {selectedAnswer === index && index !== correctIndex && <XCircle className="w-4 h-4 text-white" />}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>

          {answered && (
            <div className={`p-4 rounded-lg mb-6 ${
              selectedAnswer === correctIndex ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className="font-semibold text-gray-900 mb-2">💡 Explanation:</p>
              <p className="text-gray-700">{currentQ.explanation || 'Well done!'}</p>
            </div>
          )}

          {answered && (
            <button onClick={handleNext} className="btn-primary w-full py-3 font-bold">
              {currentQuestion + 1 === questions.length ? 'Show Results' : 'Next Question'}
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
