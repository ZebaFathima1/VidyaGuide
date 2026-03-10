import { useState } from 'react'
import { BookOpen, Play, Clock, BarChart3, CheckCircle } from 'lucide-react'
import { recordCourseStarted } from '../utils/progressTracker'

export default function TrainingPage() {
  const [selectedModule, setSelectedModule] = useState(null)
  const [completedModules, setCompletedModules] = useState([])

  const trainingModules = [
    {
      id: 1,
      title: 'Python Fundamentals',
      description: 'Learn basic Python syntax, variables, data types, and control flow. Start your programming journey with the most beginner-friendly language.',
      difficulty: 'Beginner',
      duration: '4 hours',
      lessons: 12,
      progress: 75,
      topics: ['Variables', 'Data Types', 'Loops', 'Functions', 'Error Handling'],
      instructor: 'Sarah Chen',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Data Structures Essentials',
      description: 'Master arrays, linked lists, stacks, queues, and trees. Essential for writing efficient code and passing technical interviews.',
      difficulty: 'Intermediate',
      duration: '6 hours',
      lessons: 15,
      progress: 45,
      topics: ['Arrays', 'Lists', 'Stacks', 'Queues', 'Trees', 'Hash Maps'],
      instructor: 'Michael Rodriguez',
      rating: 4.7
    },
    {
      id: 3,
      title: 'Web Development with React',
      description: 'Build interactive web applications using React. Learn components, hooks, state management, and modern web development practices.',
      difficulty: 'Intermediate',
      duration: '8 hours',
      lessons: 18,
      progress: 30,
      topics: ['Components', 'JSX', 'Hooks', 'State', 'Props', 'Effects'],
      instructor: 'Emily Watson',
      rating: 4.9
    },
    {
      id: 4,
      title: 'Machine Learning Basics',
      description: 'Introduction to ML concepts including supervised learning, regression, classification, and model evaluation using Python.',
      difficulty: 'Intermediate',
      duration: '7 hours',
      lessons: 14,
      progress: 20,
      topics: ['Regression', 'Classification', 'Clustering', 'Evaluation Metrics', 'Scikit-learn'],
      instructor: 'Dr. Priya Sharma',
      rating: 4.8
    },
    {
      id: 5,
      title: 'Algorithms & Problem Solving',
      description: 'Master common algorithms like sorting, searching, and dynamic programming. Critical for coding interviews and technical assessments.',
      difficulty: 'Advanced',
      duration: '9 hours',
      lessons: 20,
      progress: 0,
      topics: ['Sorting', 'Searching', 'DP', 'Greedy', 'Backtracking', 'Graphs'],
      instructor: 'James Lee',
      rating: 4.6
    },
    {
      id: 6,
      title: 'Artificial Intelligence Fundamentals',
      description: 'Explore AI concepts, neural networks, deep learning basics, and real-world AI applications in various industries.',
      difficulty: 'Intermediate',
      duration: '8 hours',
      lessons: 16,
      progress: 10,
      topics: ['Neural Networks', 'Perceptrons', 'Activation Functions', 'Backpropagation', 'CNNs'],
      instructor: 'Dr. Alex Kumar',
      rating: 4.7
    },
    {
      id: 7,
      title: 'Database Design & SQL',
      description: 'Learn SQL queries, database design principles, normalization, and how to work with relational databases efficiently.',
      difficulty: 'Beginner',
      duration: '5 hours',
      lessons: 13,
      progress: 60,
      topics: ['SELECT', 'JOINs', 'Aggregations', 'Indexing', 'Transactions', 'Design'],
      instructor: 'Marcus Thompson',
      rating: 4.8
    },
    {
      id: 8,
      title: 'System Design for Beginners',
      description: 'Understand how to design scalable systems, distributed architecture, microservices, and cloud infrastructure basics.',
      difficulty: 'Advanced',
      duration: '10 hours',
      lessons: 22,
      progress: 5,
      topics: ['Scalability', 'Load Balancing', 'Caching', 'Databases', 'Microservices', 'Cloud'],
      instructor: 'David Martinez',
      rating: 4.5
    },
    {
      id: 9,
      title: 'Backend Development with Node.js',
      description: 'Build robust server-side applications using Node.js and Express. Learn REST APIs, middleware, and database integration.',
      difficulty: 'Intermediate',
      duration: '7 hours',
      lessons: 16,
      progress: 35,
      topics: ['Express', 'REST APIs', 'Middleware', 'Authentication', 'Database Integration'],
      instructor: 'Sofia Garcia',
      rating: 4.8
    },
    {
      id: 10,
      title: 'DevOps & Cloud Computing',
      description: 'Master Docker, Kubernetes, CI/CD pipelines, and cloud platforms like AWS. Deploy applications like a professional.',
      difficulty: 'Advanced',
      duration: '9 hours',
      lessons: 19,
      progress: 15,
      topics: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Monitoring', 'Scaling'],
      instructor: 'Robert Chen',
      rating: 4.7
    }
  ]

  const toggleComplete = (moduleId) => {
    setCompletedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    )
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700'
      case 'Intermediate': return 'bg-blue-100 text-blue-700'
      case 'Advanced': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">📚 Training Modules</h1>
        <p className="text-gray-600 text-lg">Learn from industry experts. Start with beginner modules and progress to advanced topics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Modules</p>
              <p className="text-3xl font-bold text-blue-600">{trainingModules.length}</p>
            </div>
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedModules.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-purple-600">{trainingModules.filter(m => m.progress > 0 && m.progress < 100).length}</p>
            </div>
            <Play className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Rating</p>
              <p className="text-3xl font-bold text-orange-600">4.7⭐</p>
            </div>
            <BarChart3 className="w-10 h-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Selected Module Details */}
      {selectedModule && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedModule.title}</h3>
              <p className="text-gray-700 mb-4">{selectedModule.description}</p>
            </div>
            <button
              onClick={() => setSelectedModule(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-sm">Instructor</p>
              <p className="text-lg font-semibold text-gray-900">{selectedModule.instructor}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Duration & Lessons</p>
              <p className="text-lg font-semibold text-gray-900">{selectedModule.duration} • {selectedModule.lessons} lessons</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Topics Covered:</p>
            <div className="flex flex-wrap gap-2">
              {selectedModule.topics.map((topic, idx) => (
                <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600 border border-blue-200">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <button
            className="btn-primary w-full py-3 font-bold"
            onClick={() => {
              const youtubeLinks = {
                'Python Fundamentals': 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
                'Data Structures Essentials': 'https://www.youtube.com/watch?v=BBpAmxU_NQo',
                'Web Development with React': 'https://www.youtube.com/watch?v=bMknfKXIFA8',
                'Machine Learning Basics': 'https://www.youtube.com/watch?v=GwIo3gDZCVQ',
                'Algorithms & Problem Solving': 'https://www.youtube.com/watch?v=8hly31xKli0',
                'Artificial Intelligence Fundamentals': 'https://www.youtube.com/watch?v=JMUxmLyrhSk',
                'Database Design & SQL': 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
                'System Design for Beginners': 'https://www.youtube.com/watch?v=Gk0HzkzvPVk',
                'Backend Development with Node.js': 'https://www.youtube.com/watch?v=Oe421EPjeBE',
                'DevOps & Cloud Computing': 'https://www.youtube.com/watch?v=6xJ8bfgZ4bE',
              }
              recordCourseStarted(selectedModule.title)
              const url = youtubeLinks[selectedModule.title]
              if (url) {
                window.open(url, '_blank', 'noopener,noreferrer')
              }
            }}
          >
            {completedModules.includes(selectedModule.id) ? '✓ Completed - Restart' : '▶ Start Learning'}
          </button>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {trainingModules.map((module) => (
          <div 
            key={module.id}
            onClick={() => setSelectedModule(module)}
            className="card hover:shadow-lg transition cursor-pointer bg-white border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{module.title}</h3>
                <p className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </p>
              </div>
              {completedModules.includes(module.id) && <CheckCircle className="w-6 h-6 text-green-600" />}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{module.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{module.duration}</span>
              </div>
              <span className="text-yellow-500 font-semibold">{module.rating}⭐</span>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Path Info */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 rounded-lg p-6">
        <h4 className="font-bold text-lg text-gray-900 mb-3">🎯 Recommended Learning Path</h4>
        <ol className="space-y-2 text-gray-700">
          <li><strong>1. Start:</strong> Python Fundamentals → Database Design & SQL</li>
          <li><strong>2. Build:</strong> Backend Development (Node.js) OR Web Development (React)</li>
          <li><strong>3. Advance:</strong> Data Structures → Algorithms & Problem Solving</li>
          <li><strong>4. Specialize:</strong> Machine Learning OR System Design OR DevOps</li>
          <li><strong>5. Master:</strong> Artificial Intelligence & Advanced System Design</li>
        </ol>
      </div>
    </div>
  )
}
