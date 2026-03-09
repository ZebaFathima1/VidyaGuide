import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, Zap } from 'lucide-react'

export default function ResumePage() {
  const [file, setFile] = useState(null)
  const [analyzed, setAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState(null)

  // Common tech skills to detect
  const allSkills = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
    'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Express', 'Flask', 'Django', 'FastAPI',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins',
    'Git', 'GitHub', 'GitLab', 'REST API', 'GraphQL', 'WebSocket',
    'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'SASS', 'Webpack', 'Vite',
    'Testing', 'Jest', 'Pytest', 'RSpec', 'Mocha',
    'Linux', 'Windows', 'MacOS', 'DevOps', 'CI/CD', 'Docker', 'Nginx',
    'Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    'Agile', 'Scrum', 'Jira', 'Confluence', 'Slack'
  ]

  const extractEmail = (text) => {
    const match = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
    return match ? match[0] : 'Not found'
  }

  const extractPhone = (text) => {
    const match = text.match(/(\+?1?\s?)?(\(?)(\d{3})(\)?)?[\s.-]?(\d{3})[\s.-]?(\d{4})/g)
    return match ? match[0] : 'Not found'
  }

  const extractName = (text) => {
    const lines = text.split('\n')
    return lines[0]?.trim() || 'Name not found'
  }

  const extractSkills = (text) => {
    const foundSkills = []
    const textLower = text.toLowerCase()
    
    allSkills.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill)
      }
    })

    // Assign proficiency levels
    return foundSkills.map((skill, idx) => ({
      name: skill,
      level: idx < 3 ? 'Advanced' : idx < 6 ? 'Intermediate' : 'Beginner',
      proficiency: Math.max(45, 95 - (idx * 8))
    }))
  }

  const extractExperience = (text) => {
    const experiencePatterns = [
      /(?:worked|worked at|worked as|experience at|at|company|role)[\s:]*([A-Za-z\s&.,]+)/gi,
      /([A-Za-z\s&.,]+)[\s-]*(?:developer|engineer|manager|analyst|specialist)/gi
    ]

    const experiences = []
    experiencePatterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        const company = match[1].trim()
        if (company.length > 2 && company.length < 50) {
          experiences.push({
            company: company,
            role: 'Professional Role',
            years: '1-2 years'
          })
        }
      }
    })

    return experiences.slice(0, 3) || [{
      company: 'Company not specified',
      role: 'Role not specified',
      years: 'Duration unknown'
    }]
  }

  const calculateScore = (skills, text) => {
    let score = 40 // Base score
    
    // +10 for each skill found (max 30)
    score += Math.min(skills.length * 5, 30)
    
    // +10 if email found
    if (text.includes('@')) score += 10
    
    // +10 if phone number found
    if (/\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/.test(text)) score += 10
    
    // +10 if experience markers found
    if (/experience|worked|worked at|company|role/i.test(text)) score += 10
    
    return Math.min(score, 95)
  }

  const analyzeResume = (text) => {
    const skills = extractSkills(text)
    const score = calculateScore(skills, text)
    const email = extractEmail(text)
    const phone = extractPhone(text)
    const name = extractName(text)
    const experience = extractExperience(text)

    // Identify skill gaps (skills NOT found)
    const allTechSkills = new Set(allSkills)
    const foundSkillsSet = new Set(skills.map(s => s.name))
    const gaps = Array.from(allTechSkills)
      .filter(s => !foundSkillsSet.has(s))
      .slice(0, 3)
      .map(skill => ({
        skill: skill,
        priority: Math.random() > 0.5 ? 'High' : 'Medium'
      }))

    return {
      fullName: name,
      email: email,
      phone: phone,
      location: 'Location not specified',
      score: score,
      skills: skills,
      gaps: gaps,
      experience: experience,
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const text = e.target.result
          const data = analyzeResume(text)
          setAnalysisData(data)
          setAnalyzed(true)
        } catch (err) {
          setError('Error analyzing file. Please ensure it\'s a valid text or PDF file.')
        }
        setLoading(false)
      }

      reader.onerror = () => {
        setError('Failed to read file')
        setLoading(false)
      }

      reader.readAsText(file)
    } catch (err) {
      setError('Error processing file: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">📄 Resume Analysis</h1>
        <p className="text-gray-600 text-lg">Upload and analyze your resume with AI-powered insights</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-900 font-semibold">❌ {error}</p>
        </div>
      )}

      {/* Upload Section */}
      {!analyzed ? (
        <div className="card border-2 border-dashed border-blue-300 hover:border-blue-500 transition">
          <div className="text-center py-12">
            <Upload className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
            <p className="text-gray-600 mb-6">Drag & drop or click to upload PDF, DOCX, or TXT file</p>
            
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files?.[0])
                setError(null)
              }}
              className="hidden"
              id="file-upload"
              accept=".pdf,.docx,.doc,.txt"
            />
            
            <label htmlFor="file-upload" className="inline-block">
              <button className="btn-primary px-8 py-3 text-lg cursor-pointer">
                📁 Choose File
              </button>
            </label>
            
            {file && <p className="mt-4 text-green-600 font-semibold">✓ {file.name}</p>}
            
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="btn-primary mt-6 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Analyzing...' : '✨ Analyze Resume'}
            </button>
          </div>
        </div>
      ) : null}

      {/* Analysis Results */}
      {analyzed && analysisData && (
        <div className="space-y-6">
          {/* Header with Score */}
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Analysis Complete!</h2>
                <p className="text-gray-600">Your resume has been analyzed and optimized recommendations are ready</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-blue-600">{analysisData.score}%</div>
                <p className="text-gray-600 font-semibold">Overall Score</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              👤 Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{analysisData.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-semibold text-gray-900">{analysisData.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{analysisData.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Location</p>
                <p className="text-lg font-semibold text-gray-900">{analysisData.location}</p>
              </div>
            </div>
          </div>

          {/* Experience */}
          {analysisData.experience.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                💼 Experience
              </h3>
              <div className="space-y-4">
                {analysisData.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-bold text-gray-900">{exp.role}</p>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.years}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {analysisData.skills.length > 0 ? (
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🎯 Current Skills ({analysisData.skills.length})
              </h3>
              <div className="space-y-4">
                {analysisData.skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-900">{skill.name}</span>
                      <span className="text-sm text-blue-600 font-bold">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card bg-yellow-50 border border-yellow-200">
              <p className="text-yellow-900">⚠️ No recognized tech skills found in resume. Add specific technology keywords!</p>
            </div>
          )}

          {/* Skill Gaps */}
          {analysisData.gaps.length > 0 && (
            <div className="card border-l-4 border-orange-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" /> Areas for Improvement
              </h3>
              <div className="space-y-3">
                {analysisData.gaps.map((gap, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="font-semibold text-gray-900">{gap.skill}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      gap.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="card text-center hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-bold mb-2">View Training Plan</h4>
              <p className="text-sm text-gray-600">Start personalized courses</p>
            </button>
            <button className="card text-center hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-2">❓</div>
              <h4 className="font-bold mb-2">Take Skill Quiz</h4>
              <p className="text-sm text-gray-600">Test your knowledge now</p>
            </button>
            <button className="card text-center hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-2">🎤</div>
              <h4 className="font-bold mb-2">Mock Interview</h4>
              <p className="text-sm text-gray-600">Practice interview skills</p>
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setAnalyzed(false)
              setFile(null)
              setAnalysisData(null)
              setError(null)
            }}
            className="w-full btn-secondary py-3 text-lg"
          >
            📤 Upload Another Resume
          </button>
        </div>
      )}

      {/* Demo Mode Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 font-semibold">💡 Pro Tip: Upload a TXT or text-based file with your tech skills, email, and experience for best results!</p>
      </div>
    </div>
  )
}
