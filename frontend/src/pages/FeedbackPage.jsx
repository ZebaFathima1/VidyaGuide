import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { analyzeFeedbackSentiment } from '../utils/geminiClient'
import { saveFeedbackToSupabase } from '../utils/supabaseClient'
import { supabase } from '../utils/supabaseClient'

export default function FeedbackPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [sentiment, setSentiment] = useState(null)

  // Pre-fill from Supabase session
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata
        setName(meta?.full_name || session.user.email?.split('@')[0] || '')
        setEmail(session.user.email || '')
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name?.trim()) { setError('Please enter your name'); return }
    if (!email?.trim()) { setError('Please enter your email'); return }
    if (rating < 1 || rating > 5) { setError('Please select a rating (1-5 stars)'); return }
    if (!feedback?.trim()) { setError('Please enter your feedback'); return }

    setLoading(true)
    let sentimentResult = null
    try {
      sentimentResult = await analyzeFeedbackSentiment(feedback.trim())
      setSentiment(sentimentResult)
    } catch (err) {
      console.error('Sentiment analysis failed', err)
    }

    // Save to Supabase
    const { error: saveError } = await saveFeedbackToSupabase({
      name: name.trim(),
      email: email.trim(),
      rating,
      message: feedback.trim(),
      sentiment: sentimentResult?.sentiment || null,
      sentimentReason: sentimentResult?.reason || null,
    })

    if (saveError) {
      console.warn('Supabase feedback save failed:', saveError)
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">💬 Feedback</h1>
          <p className="text-gray-600 text-lg">We value your opinion</p>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 text-center py-16">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-700 mb-2">Thank you for your feedback!</h2>
          <p className="text-gray-600 mb-6">Your response has been saved. We appreciate your time!</p>
          {sentiment && (
            <div className="inline-block px-4 py-2 rounded-lg bg-white border border-gray-200 mb-4">
              <p className="text-sm text-gray-600">
                AI Sentiment:{' '}
                <span className={`font-bold ${
                  sentiment.sentiment === 'positive' ? 'text-green-600' :
                  sentiment.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>{sentiment.sentiment}</span>
              </p>
              {sentiment.reason && <p className="text-xs text-gray-500 mt-1">{sentiment.reason}</p>}
            </div>
          )}
          <button
            onClick={() => { setSubmitted(false); setRating(0); setFeedback(''); setSentiment(null) }}
            className="btn-primary px-6 py-2"
          >
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">💬 Feedback</h1>
        <p className="text-gray-600 text-lg">Share your experience and help us improve VidyaMitra</p>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1–5 stars)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition"
                >
                  <Star
                    className={`w-10 h-10 ${
                      (hoverRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''} selected` : 'Click to rate'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Feedback / Comments</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="input w-full min-h-[120px]"
              placeholder="Tell us what you think..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Feedback</>}
          </button>
        </form>
      </div>
    </div>
  )
}
