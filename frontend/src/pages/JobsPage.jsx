import { useState, useEffect } from 'react'
import { MapPin, DollarSign, Briefcase, Search, Heart, X } from 'lucide-react'
import { supabase, saveJobApplicationToSupabase, loadSavedJobIdsFromSupabase, toggleSavedJobInSupabase } from '../utils/supabaseClient'

const JOBS = [
  { id: 1, title: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$180K - $280K', type: 'Full-time', level: 'Senior', description: "Join our infrastructure team to build scalable systems. We're looking for engineers with strong fundamentals and experience with distributed systems.", skills: ['Python', 'Go', 'Distributed Systems', 'Database Design', 'System Design'], posted: '2 days ago', applicants: 156, match: 87 },
  { id: 2, title: 'AI/ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$200K - $300K+', type: 'Full-time', level: 'Mid-Senior', description: 'Help us build the next generation of AI models. Experience with deep learning, transformers, and large-scale training highly valued.', skills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Deep Learning'], posted: '1 day ago', applicants: 342, match: 75 },
  { id: 3, title: 'Frontend Developer', company: 'Airbnb', location: 'San Francisco, CA', salary: '$150K - $220K', type: 'Full-time', level: 'Mid-level', description: 'Build beautiful and performant user experiences. We use React, TypeScript, and modern web technologies.', skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Web Performance'], posted: '3 days ago', applicants: 289, match: 88 },
  { id: 4, title: 'Backend Engineer', company: 'Uber', location: 'San Francisco, CA', salary: '$160K - $250K', type: 'Full-time', level: 'Mid-level', description: 'Work on our core platform serving millions of users. Build APIs and services that power the Uber ecosystem.', skills: ['Java', 'Node.js', 'PostgreSQL', 'Microservices', 'AWS'], posted: '4 days ago', applicants: 198, match: 82 },
  { id: 5, title: 'Data Scientist', company: 'Meta (Facebook)', location: 'Menlo Park, CA', salary: '$170K - $260K', type: 'Full-time', level: 'Mid-level', description: 'Analyze vast amounts of data to inform product decisions. Strong statistics and programming background required.', skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Analysis'], posted: '1 day ago', applicants: 267, match: 79 },
  { id: 6, title: 'DevOps Engineer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$155K - $240K', type: 'Full-time', level: 'Mid-level', description: "Build and maintain infrastructure for the world's largest streaming platform. AWS and Kubernetes experience essential.", skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'], posted: '2 days ago', applicants: 134, match: 71 },
  { id: 7, title: 'Full Stack Engineer', company: 'Stripe', location: 'San Francisco, CA', salary: '$140K - $230K', type: 'Full-time', level: 'Mid-level', description: 'Build payments infrastructure. Work with both frontend and backend. We value ownership and shipping fast.', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'System Design'], posted: '5 days ago', applicants: 312, match: 85 },
  { id: 8, title: 'Junior Python Developer', company: 'Amazon', location: 'Seattle, WA', salary: '$120K - $160K', type: 'Full-time', level: 'Junior', description: "Start your career with one of the world's biggest tech companies. Mentorship and growth opportunities available.", skills: ['Python', 'SQL', 'AWS', 'Git', 'Problem Solving'], posted: '3 days ago', applicants: 456, match: 92 },
  { id: 9, title: 'Mobile Developer (iOS)', company: 'Apple', location: 'Cupertino, CA', salary: '$165K - $245K', type: 'Full-time', level: 'Mid-level', description: "Develop iOS applications for billions of users. Swift expertise and understanding of Apple's ecosystem important.", skills: ['Swift', 'iOS Development', 'Objective-C', 'UIKit', 'Xcode'], posted: '6 days ago', applicants: 201, match: 68 },
  { id: 10, title: 'Solutions Architect', company: 'Microsoft', location: 'Redmond, WA', salary: '$150K - $250K', type: 'Full-time', level: 'Senior', description: 'Help enterprises transform with Azure. Strong background in cloud architecture and consulting skills needed.', skills: ['Azure', 'Cloud Architecture', 'AWS', 'System Design', 'Communication'], posted: '4 days ago', applicants: 145, match: 76 },
]

export default function JobsPage() {
  const [favorites, setFavorites] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [selectedJob, setSelectedJob] = useState(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', resumeFile: null })
  const [applyError, setApplyError] = useState('')
  const [applyLoading, setApplyLoading] = useState(false)

  // Load session + saved jobs on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata
        setApplyForm(f => ({
          ...f,
          name: meta?.full_name || session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
        }))
      }
    })

    loadSavedJobIdsFromSupabase().then(ids => {
      if (ids.length > 0) setFavorites(ids)
    })
  }, [])

  const levels = ['All', ...new Set(JOBS.map(j => j.level))]

  const filteredJobs = JOBS.filter(job => {
    const levelMatch = selectedLevel === 'All' || job.level === selectedLevel
    const searchMatch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    return levelMatch && searchMatch
  })

  const toggleFavorite = async (job) => {
    const isSaved = favorites.includes(job.id)
    // Optimistic update
    setFavorites(prev => isSaved ? prev.filter(id => id !== job.id) : [...prev, job.id])
    await toggleSavedJobInSupabase(job.id, job.title, job.company, isSaved)
  }

  const getMatchColor = (match) => {
    if (match >= 85) return 'bg-green-100 text-green-700'
    if (match >= 75) return 'bg-blue-100 text-blue-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  const openApplyModal = (job) => {
    setSelectedJob(job)
    setShowApplyModal(true)
    setApplySuccess(false)
    setApplyError('')
    setApplyForm(f => ({ ...f, phone: '', resumeFile: null }))
  }

  const closeApplyModal = () => {
    setShowApplyModal(false)
    setApplySuccess(false)
    setApplyError('')
  }

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    setApplyError('')
    const { name, email, phone, resumeFile } = applyForm
    if (!name?.trim()) { setApplyError('Please enter your name'); return }
    if (!email?.trim()) { setApplyError('Please enter your email'); return }
    if (!phone?.trim()) { setApplyError('Please enter your phone number'); return }
    if (!resumeFile) { setApplyError('Please upload your resume'); return }

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain']
    if (!validTypes.includes(resumeFile.type) && !resumeFile.name?.match(/\.(pdf|docx?|txt)$/i)) {
      setApplyError('Resume must be PDF, DOCX, or TXT')
      return
    }

    setApplyLoading(true)
    const { error } = await saveJobApplicationToSupabase({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      resumeFileName: resumeFile.name,
    })

    if (error) {
      setApplyError('Failed to submit. Please try again.')
    } else {
      setApplySuccess(true)
    }
    setApplyLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">💼 Job Listings</h1>
        <p className="text-gray-600 text-lg">Discover amazing tech job opportunities matched to your skills</p>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job title, company, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Level Filter */}
      <div className="card">
        <p className="text-gray-600 font-semibold mb-3">Filter by experience level:</p>
        <div className="flex flex-wrap gap-2">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedLevel === level ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-gray-600 text-sm">Total Jobs</p>
          <p className="text-3xl font-bold text-blue-600">{JOBS.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <p className="text-gray-600 text-sm">Matching Your Profile</p>
          <p className="text-3xl font-bold text-purple-600">{filteredJobs.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-red-50 to-red-100">
          <p className="text-gray-600 text-sm">Saved Favourites</p>
          <p className="text-3xl font-bold text-red-600">{favorites.length}</p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`card cursor-pointer hover:shadow-lg transition border-l-4 border-blue-500 ${
              selectedJob?.id === job.id ? 'bg-blue-50 ring-2 ring-blue-400' : ''
            }`}
            onClick={() => setSelectedJob(job)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-blue-600 font-semibold text-lg">{job.company}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(job) }}
                className="transition hover:scale-110 p-1"
              >
                <Heart className={`w-6 h-6 ${favorites.includes(job.id) ? 'fill-red-600 text-red-600' : 'text-gray-400'}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /><span>{job.location}</span></div>
              <div className="flex items-center gap-2 text-gray-600"><DollarSign className="w-4 h-4" /><span>{job.salary}</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Briefcase className="w-4 h-4" /><span>{job.level}</span></div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-bold text-sm ${getMatchColor(job.match)}`}>{job.match}% Match</div>
            </div>

            <p className="text-gray-700 mb-3">{job.description}</p>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{skill}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-3">
              <span>Posted {job.posted}</span>
              <span>{job.applicants} applicants</span>
            </div>

            {selectedJob?.id === job.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={(e) => { e.stopPropagation(); openApplyModal(job) }}
                  className="btn-primary w-full py-3 font-bold"
                >
                  ⭐ Apply Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No jobs found. Try adjusting your filters.</p>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Apply for {selectedJob.title}</h3>
                <button onClick={closeApplyModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {applySuccess ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h4 className="text-2xl font-bold text-green-600 mb-2">Application Submitted!</h4>
                  <p className="text-gray-600 mb-6">Your application has been saved. We'll be in touch soon.</p>
                  <button onClick={closeApplyModal} className="btn-primary px-6 py-2">Close</button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {applyError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{applyError}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" value={applyForm.name} onChange={(e) => setApplyForm(f => ({ ...f, name: e.target.value }))} className="input w-full" placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={applyForm.email} onChange={(e) => setApplyForm(f => ({ ...f, email: e.target.value }))} className="input w-full" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" value={applyForm.phone} onChange={(e) => setApplyForm(f => ({ ...f, phone: e.target.value }))} className="input w-full" placeholder="+1 234 567 8900" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume Upload</label>
                    <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => setApplyForm(f => ({ ...f, resumeFile: e.target.files?.[0] || null }))} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
                    {applyForm.resumeFile && <p className="text-sm text-green-600 mt-1">✓ {applyForm.resumeFile.name}</p>}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={applyLoading} className="btn-primary flex-1 py-3 font-bold disabled:opacity-50">
                      {applyLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button type="button" onClick={closeApplyModal} className="btn-secondary px-4">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
