import { useState } from 'react'
import { CheckCircle, AlertCircle, TrendingUp, Target } from 'lucide-react'

export default function SkillsPage() {
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [showGaps, setShowGaps] = useState(false)

  const domains = [
    {
      id: 'fullstack',
      name: 'Full Stack Developer',
      match: 76,
      description: 'Web development with frontend & backend',
      icon: '🌐',
      skills: ['React', 'Node.js', 'SQL', 'Docker', 'AWS'],
      current: ['React', 'Node.js', 'SQL'],
      missing: ['Docker', 'AWS'],
    },
    {
      id: 'datascience',
      name: 'Data Scientist',
      match: 62,
      description: 'Machine learning and analytics',
      icon: '📊',
      skills: ['Python', 'ML/AI', 'SQL', 'Statistics', 'Tableau'],
      current: ['Python', 'SQL'],
      missing: ['ML/AI', 'Statistics', 'Tableau'],
    },
    {
      id: 'devops',
      name: 'DevOps Engineer',
      match: 58,
      description: 'Infrastructure and deployment',
      icon: '⚙️',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
      current: ['Docker'],
      missing: ['Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
    },
    {
      id: 'cloud',
      name: 'Cloud Architect',
      match: 45,
      description: 'Cloud infrastructure design',
      icon: '☁️',
      skills: ['AWS', 'Azure', 'GCP', 'Architecture', 'Security'],
      current: [],
      missing: ['AWS', 'Azure', 'GCP', 'Architecture', 'Security'],
    },
  ]

  const myCurrentSkills = [
    { name: 'React', level: 'Advanced', proficiency: 88 },
    { name: 'Python', level: 'Advanced', proficiency: 90 },
    { name: 'SQL', level: 'Intermediate', proficiency: 73 },
    { name: 'Node.js', level: 'Intermediate', proficiency: 72 },
    { name: 'Docker', level: 'Beginner', proficiency: 45 },
  ]

  const selectedDomainData = domains.find(d => d.id === selectedDomain)

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">🎯 Skills Assessment</h1>
        <p className="text-gray-600 text-lg">Discover your strengths, identify gaps, and match job roles</p>
      </div>

      {/* Current Skills */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          ⭐ Your Current Skills
        </h3>
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
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Selection */}
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
                  <div className={`text-4xl font-bold ${
                    selectedDomainData.match >= 70 ? 'text-green-600' :
                    selectedDomainData.match >= 50 ? 'text-yellow-600' :
                    'text-orange-600'
                  }`}>
                    {selectedDomainData.match}%
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        selectedDomainData.match >= 70 ? 'bg-green-500' :
                        selectedDomainData.match >= 50 ? 'bg-yellow-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${selectedDomainData.match}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Required Skills Count */}
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
            {/* Current Skills in this domain */}
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

            {/* Missing Skills */}
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
            <button className="card text-center hover:shadow-lg transition cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <div className="text-4xl mb-2">📚</div>
              <h4 className="font-bold text-lg mb-1">Start Learning Path</h4>
              <p className="text-sm text-gray-600 mb-3">Curated courses for this role</p>
              <button className="btn-primary text-sm py-2">Begin →</button>
            </button>
            <button className="card text-center hover:shadow-lg transition cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="text-4xl mb-2">📈</div>
              <h4 className="font-bold text-lg mb-1">Track Progress</h4>
              <p className="text-sm text-gray-600 mb-3">Monitor your improvement</p>
              <button className="btn-primary text-sm py-2">View →</button>
            </button>
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

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-3xl mb-2">✅</div>
          <h4 className="font-bold mb-1">5 Skills Identified</h4>
          <p className="text-sm text-gray-600">Based on your resume</p>
        </div>
        <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="text-3xl mb-2">🔄</div>
          <h4 className="font-bold mb-1">3+ Skill Gaps</h4>
          <p className="text-sm text-gray-600">For selected domain</p>
        </div>
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-3xl mb-2">🎯</div>
          <h4 className="font-bold mb-1">4 Job Roles</h4>
          <p className="text-sm text-gray-600">Matched to your profile</p>
        </div>
      </div>

      {/* Demo Mode Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-purple-900 font-semibold">💜 Demo Mode: Skills matched based on sample data. Connect to real assessment APIs for accurate evaluation!</p>
      </div>
    </div>
  )
}
