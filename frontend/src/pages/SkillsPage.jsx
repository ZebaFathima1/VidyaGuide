import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle, Target, Upload } from 'lucide-react'
import { recordCourseStarted } from '../utils/progressTracker'
import { loadResumeSkillsFromSupabase } from '../utils/supabaseClient'

const SKILL_VIDEOS = {
  'Full Stack Developer': 'https://www.youtube.com/watch?v=8hly31xKli0',
  'Data Scientist': 'https://www.youtube.com/watch?v=GwIo3gDZCVQ',
  'DevOps Engineer': 'https://www.youtube.com/watch?v=6xJ8bfgZ4bE',
  'Cloud Architect': 'https://www.youtube.com/watch?v=Gk0HzkzvPVk',
  'React': 'https://www.youtube.com/watch?v=bMknfKXIFA8',
  'Node.js': 'https://www.youtube.com/watch?v=Oe421EPjeBE',
  'Docker': 'https://www.youtube.com/watch?v=6xJ8bfgZ4bE',
  'AWS': 'https://www.youtube.com/watch?v=ulprqHHWlng',
  'Python': 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
  'ML/AI': 'https://www.youtube.com/watch?v=GwIo3gDZCVQ',
  'Kubernetes': 'https://www.youtube.com/watch?v=6xJ8bfgZ4bE',
  'CI/CD': 'https://www.youtube.com/watch?v=6xJ8bfgZ4bE',
  'Terraform': 'https://www.youtube.com/watch?v=6xJ8bfgZ4bE',
  'Statistics': 'https://www.youtube.com/watch?v=GwIo3gDZCVQ',
  'Tableau': 'https://www.youtube.com/watch?v=6xJ8bfgZ4bE',
  'Azure': 'https://www.youtube.com/watch?v=Gk0HzkzvPVk',
  'GCP': 'https://www.youtube.com/watch?v=Gk0HzkzvPVk',
  'Architecture': 'https://www.youtube.com/watch?v=Gk0HzkzvPVk',
  'Security': 'https://www.youtube.com/watch?v=Gk0HzkzvPVk',
}

const DOMAIN_DEFINITIONS = [
  {
    id: 'fullstack',
    name: 'Full Stack Developer',
    description: 'Web development with frontend & backend',
    icon: '🌐',
    skills: ['React', 'Node.js', 'SQL', 'Docker', 'AWS'],
  },
  {
    id: 'datascience',
    name: 'Data Scientist',
    description: 'Machine learning and analytics',
    icon: '📊',
    skills: ['Python', 'ML/AI', 'SQL', 'Statistics', 'Tableau'],
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    description: 'Infrastructure and deployment',
    icon: '⚙️',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
  },
  {
    id: 'cloud',
    name: 'Cloud Architect',
    description: 'Cloud infrastructure design',
    icon: '☁️',
    skills: ['AWS', 'Azure', 'GCP', 'Architecture', 'Security'],
  },
]

/**
 * Match user skills against a domain's required skills.
 * A skill "matches" if the user skill name contains the domain skill
 * keyword (case-insensitive) or vice-versa.
 */
function matchSkills(userSkillNames, domainSkills) {
  const current = []
  const missing = []

  domainSkills.forEach((ds) => {
    const found = userSkillNames.some(
      (us) =>
        us.toLowerCase().includes(ds.toLowerCase()) ||
        ds.toLowerCase().includes(us.toLowerCase())
    )
    if (found) current.push(ds)
    else missing.push(ds)
  })

  const match = Math.round((current.length / domainSkills.length) * 100)
  return { current, missing, match }
}

function loadResumeSkills() {
  try {
    const raw = localStorage.getItem('resumeSkills')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null
  } catch {
    return null
  }
}

export default function SkillsPage() {
  const navigate = useNavigate()
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [resumeSkills, setResumeSkills] = useState(null)

  useEffect(() => {
    async function fetchSkills() {
      // Try Supabase first (cloud, per-user), fall back to localStorage
      const cloudSkills = await loadResumeSkillsFromSupabase()
      if (cloudSkills) {
        setResumeSkills(cloudSkills)
        // Keep localStorage in sync
        localStorage.setItem('resumeSkills', JSON.stringify(cloudSkills))
      } else {
        setResumeSkills(loadResumeSkills())
      }
    }
    fetchSkills()
  }, [])

  // Skills shown in "Your Current Skills" section
  const myCurrentSkills = resumeSkills
    ? resumeSkills.map((s) => ({
        name: s.name,
        level: s.level || 'Intermediate',
        proficiency: Math.round(s.proficiency),
      }))
    : []

  const userSkillNames = myCurrentSkills.map((s) => s.name)

  // Compute domains with live match percentages
  const domains = DOMAIN_DEFINITIONS.map((def) => {
    const { current, missing, match } = matchSkills(userSkillNames, def.skills)
    return { ...def, current, missing, match }
  })

  const selectedDomainData = domains.find((d) => d.id === selectedDomain)

  const hasResume = resumeSkills !== null

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">🎯 Skills Assessment</h1>
        <p className="text-gray-600 text-lg">Discover your strengths, identify gaps, and match job roles</p>
      </div>

      {/* No resume uploaded yet */}
      {!hasResume && (
        <div className="card border-2 border-dashed border-blue-300 text-center py-12">
          <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Resume Uploaded Yet</h3>
          <p className="text-gray-600 mb-6">
            Upload your resume on the Resume Analysis page to see your personalized skills here.
          </p>
          <button
            onClick={() => navigate('/resume')}
            className="btn-primary px-8 py-3 text-base font-semibold"
          >
            📄 Go to Resume Analysis →
          </button>
        </div>
      )}

      {/* Current Skills */}
      {hasResume && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            ⭐ Your Current Skills
          </h3>
          {myCurrentSkills.length === 0 ? (
            <p className="text-gray-500 italic">
              No recognised tech skills found in your resume. Try uploading a resume with specific technology keywords.
            </p>
          ) : (
            <div className="space-y-4">
              {myCurrentSkills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-900">{skill.name}</span>
                    <span className="text-sm text-blue-600 font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Domain Selection */}
      {hasResume && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🎪 Explore Job Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedDomain === domain.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-2xl mb-1">{domain.icon}</div>
                    <h4 className="font-bold text-gray-900">{domain.name}</h4>
                    <p className="text-sm text-gray-600">{domain.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{domain.match}%</div>
                    <p className="text-xs text-gray-600">Match</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Domain Details */}
      {selectedDomainData && (
        <div className="space-y-6">
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600">
            <h3 className="text-2xl font-bold mb-4">{selectedDomainData.name}</h3>
            <p className="text-gray-700 mb-4">{selectedDomainData.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Match Score */}
              <div>
                <p className="text-gray-600 text-sm mb-2">Your Match Score</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`text-4xl font-bold ${
                      selectedDomainData.match >= 70
                        ? 'text-green-600'
                        : selectedDomainData.match >= 50
                        ? 'text-yellow-600'
                        : 'text-orange-600'
                    }`}
                  >
                    {selectedDomainData.match}%
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        selectedDomainData.match >= 70
                          ? 'bg-green-500'
                          : selectedDomainData.match >= 50
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${selectedDomainData.match}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Skills Count */}
              <div>
                <p className="text-gray-600 text-sm mb-2">Skills Overview</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-3xl font-bold text-green-600">{selectedDomainData.current.length}</p>
                    <p className="text-sm text-gray-600">Have</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-orange-600">{selectedDomainData.missing.length}</p>
                    <p className="text-sm text-gray-600">Need</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card border-l-4 border-green-500">
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> Skills You Have
              </h4>
              <div className="space-y-2">
                {selectedDomainData.current.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">{skill}</span>
                  </div>
                ))}
                {selectedDomainData.current.length === 0 && (
                  <p className="text-gray-500 italic">Build these from scratch</p>
                )}
              </div>
            </div>

            <div className="card border-l-4 border-orange-500">
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" /> Skills to Learn
              </h4>
              <div className="space-y-2">
                {selectedDomainData.missing.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-gray-900">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card text-center hover:shadow-lg transition cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <div className="text-4xl mb-2">📚</div>
              <h4 className="font-bold text-lg mb-1">Start Learning Path</h4>
              <p className="text-sm text-gray-600 mb-3">Curated courses for this role</p>
              <button
                onClick={() => {
                  recordCourseStarted(selectedDomainData.name)
                  const url =
                    SKILL_VIDEOS[selectedDomainData.name] ||
                    SKILL_VIDEOS[selectedDomainData.missing[0]] ||
                    'https://www.youtube.com/results?search_query=' +
                      encodeURIComponent(selectedDomainData.name + ' tutorial')
                  window.open(url, '_blank', 'noopener,noreferrer')
                }}
                className="btn-primary text-sm py-2"
              >
                Begin →
              </button>
            </div>
            <div className="card text-center hover:shadow-lg transition cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="text-4xl mb-2">📈</div>
              <h4 className="font-bold text-lg mb-1">Track Progress</h4>
              <p className="text-sm text-gray-600 mb-3">Monitor your improvement</p>
              <button onClick={() => navigate('/progress')} className="btn-primary text-sm py-2">
                View →
              </button>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 font-semibold mb-2">💡 Recommendation:</p>
            <p className="text-blue-800">
              {selectedDomainData.match >= 70
                ? `You're very well positioned for a ${selectedDomainData.name} role! Focus on deepening expertise in your missing skills.`
                : selectedDomainData.match >= 50
                ? `You have a solid foundation for ${selectedDomainData.name}. Prioritize learning the key missing skills to accelerate your transition.`
                : `${selectedDomainData.name} is an interesting path for you. Start with foundational skills and build gradually.`}
            </p>
          </div>
        </div>
      )}

      {/* Summary Info Boxes */}
      {hasResume && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-3xl mb-2">✅</div>
            <h4 className="font-bold mb-1">{myCurrentSkills.length} Skills Identified</h4>
            <p className="text-sm text-gray-600">Based on your resume</p>
          </div>
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="font-bold mb-1">
              {selectedDomainData ? `${selectedDomainData.missing.length} Skill Gap${selectedDomainData.missing.length !== 1 ? 's' : ''}` : 'Select a Role'}
            </h4>
            <p className="text-sm text-gray-600">
              {selectedDomainData ? 'For selected domain' : 'To see skill gaps'}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-bold mb-1">{domains.length} Job Roles</h4>
            <p className="text-sm text-gray-600">Matched to your profile</p>
          </div>
        </div>
      )}

      {/* Re-upload prompt */}
      {hasResume && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between gap-4">
          <p className="text-purple-900 font-semibold">
            💜 Skills are based on your uploaded resume. Re-upload anytime to refresh.
          </p>
          <button
            onClick={() => navigate('/resume')}
            className="btn-primary text-sm py-2 whitespace-nowrap"
          >
            📄 Update Resume
          </button>
        </div>
      )}
    </div>
  )
}
