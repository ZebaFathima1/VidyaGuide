// Fallback questions when Gemini API/backend is unavailable

export const FALLBACK_QUIZ = {
  Python: [
    { question: 'What is the output of: print(2 ** 3)?', options: ['6', '8', '9', '5'], correctIndex: 1, explanation: '** is exponentiation. 2^3 = 8.' },
    { question: 'Which is NOT a Python data type?', options: ['Dictionary', 'Array', 'Set', 'Tuple'], correctIndex: 1, explanation: 'Python uses lists, not Array.' },
    { question: 'What does len() return?', options: ['Code length', 'Number of elements', 'String length only', 'Nothing'], correctIndex: 1, explanation: 'len() returns the number of elements.' },
    { question: 'What is a list comprehension?', options: ['Reading lists', 'Concise way to create lists', 'List comments', 'Comparing lists'], correctIndex: 1, explanation: 'List comprehension creates lists concisely.' },
    { question: 'What keyword defines a function?', options: ['func', 'def', 'function', 'fn'], correctIndex: 1, explanation: 'def is used to define functions in Python.' },
    { question: 'What is None?', options: ['Zero', 'Empty string', 'Null/absence of value', 'False'], correctIndex: 2, explanation: 'None represents the absence of a value.' },
    { question: 'Which creates a tuple?', options: ['[]', '{}', '()', '<>'], correctIndex: 2, explanation: 'Tuples use parentheses ().' },
    { question: 'What does range(5) produce?', options: ['[0,1,2,3,4]', '0 to 4 (iterable)', '5 numbers', 'Error'], correctIndex: 1, explanation: 'range(5) yields 0,1,2,3,4.' },
  ],
  'Data Structures': [
    { question: 'Array access by index is:', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctIndex: 2, explanation: 'Array access is constant time O(1).' },
    { question: 'Which uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correctIndex: 1, explanation: 'Stack is Last In First Out.' },
    { question: 'BST search average time?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 2, explanation: 'Balanced BST search is O(log n).' },
    { question: 'Linked list insert at head?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctIndex: 1, explanation: 'Insert at head is O(1).' },
    { question: 'Hash table lookup average?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctIndex: 1, explanation: 'Hash table lookup is O(1) average.' },
    { question: 'Which uses FIFO?', options: ['Stack', 'Queue', 'Heap', 'Tree'], correctIndex: 1, explanation: 'Queue is First In First Out.' },
    { question: 'Merge sort time complexity?', options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'], correctIndex: 2, explanation: 'Merge sort is O(n log n).' },
    { question: 'Dynamic Programming avoids?', options: ['Loops', 'Recursion', 'Recomputation', 'Variables'], correctIndex: 2, explanation: 'DP stores results to avoid recomputation.' },
  ],
  'AI Concepts': [
    { question: 'What is Machine Learning?', options: ['Manual programming', 'Learning from data', 'Only for robots', 'A software type'], correctIndex: 1, explanation: 'ML learns patterns from data.' },
    { question: 'Supervised learning uses?', options: ['Unlabeled data', 'Labeled data', 'No data', 'Random data'], correctIndex: 1, explanation: 'Supervised learning needs labeled data.' },
    { question: 'Neural networks mimic?', options: ['Circuits', 'Human brain', 'Databases', 'Web servers'], correctIndex: 1, explanation: 'Neural nets are inspired by the brain.' },
    { question: 'Overfitting means?', options: ['Training slow', 'Model learns noise', 'Too much RAM', 'Wrong algorithm'], correctIndex: 1, explanation: 'Overfitting = model memorizes training noise.' },
    { question: 'Classification is?', options: ['Unsupervised', 'Supervised', 'Reinforcement', 'None'], correctIndex: 1, explanation: 'Classification is supervised learning.' },
    { question: 'What is backpropagation?', options: ['Data flow', 'Weight update algorithm', 'Neuron type', 'Layer name'], correctIndex: 1, explanation: 'Backprop updates weights using gradients.' },
    { question: 'Clustering is?', options: ['Supervised', 'Unsupervised', 'Both', 'Neither'], correctIndex: 1, explanation: 'Clustering finds patterns in unlabeled data.' },
    { question: 'What is a feature?', options: ['Model output', 'Input variable', 'Error type', 'Layer'], correctIndex: 1, explanation: 'Features are input variables to the model.' },
  ],
  Databases: [
    { question: 'What does SQL stand for?', options: ['Simple Query', 'Structured Query Language', 'System Quality', 'Sequential Query'], correctIndex: 1, explanation: 'SQL = Structured Query Language.' },
    { question: 'Which filters records?', options: ['SORT', 'FILTER', 'WHERE', 'FIND'], correctIndex: 2, explanation: 'WHERE clause filters records.' },
    { question: 'Normalization reduces?', options: ['Speed', 'Redundancy', 'Security', 'Size'], correctIndex: 1, explanation: 'Normalization reduces data redundancy.' },
    { question: 'PRIMARY KEY does?', options: ['First column', 'Uniquely identifies rows', 'Sorts data', 'Backup'], correctIndex: 1, explanation: 'Primary key uniquely identifies each row.' },
    { question: 'JOIN combines?', options: ['Columns', 'Rows from tables', 'Databases', 'Queries'], correctIndex: 1, explanation: 'JOIN combines rows from multiple tables.' },
    { question: 'INDEX improves?', options: ['Storage', 'Query speed', 'Security', 'Backup'], correctIndex: 1, explanation: 'Index speeds up lookups.' },
    { question: 'ACID ensures?', options: ['Speed', 'Data integrity', 'Backup', 'Replication'], correctIndex: 1, explanation: 'ACID ensures transaction reliability.' },
    { question: 'NoSQL includes?', options: ['MySQL', 'MongoDB', 'PostgreSQL', 'SQLite'], correctIndex: 1, explanation: 'MongoDB is a NoSQL database.' },
  ],
  'Web Development': [
    { question: 'HTML stands for?', options: ['Hyper Tool', 'HyperText Markup Language', 'Home Tool', 'Hyperlink Text'], correctIndex: 1, explanation: 'HTML = HyperText Markup Language.' },
    { question: 'CSS is for?', options: ['Logic', 'Styling and layout', 'Database', 'Server'], correctIndex: 1, explanation: 'CSS styles and layouts web pages.' },
    { question: 'React is?', options: ['Language', 'JS library for UIs', 'Database', 'Server'], correctIndex: 1, explanation: 'React is a JavaScript UI library.' },
    { question: 'REST API uses?', options: ['XML only', 'HTTP methods', 'Binary', 'FTP'], correctIndex: 1, explanation: 'REST uses HTTP methods (GET, POST, etc).' },
    { question: 'JavaScript runs?', options: ['Server only', 'Browser (and Node)', 'Database', 'OS'], correctIndex: 1, explanation: 'JS runs in browser and Node.js.' },
    { question: 'What is DOM?', options: ['Database', 'Document Object Model', 'Design pattern', 'Data type'], correctIndex: 1, explanation: 'DOM represents the HTML document.' },
    { question: 'async/await handles?', options: ['Loops', 'Asynchronous code', 'Styles', 'Routing'], correctIndex: 1, explanation: 'async/await handles promises.' },
    { question: 'npm is?', options: ['Node package manager', 'New project manager', 'Network protocol', 'Database'], correctIndex: 0, explanation: 'npm = Node Package Manager.' },
  ],
}

export const FALLBACK_INTERVIEW = {
  'Python Developer': [
    { question: 'Explain the difference between list and tuple in Python.', answer: 'Lists are mutable (can be changed), tuples are immutable. Lists use [], tuples use (). Tuples can be dictionary keys; lists cannot. Tuples are faster for fixed data.', difficulty: 'Beginner' },
    { question: 'What are decorators in Python?', answer: 'Decorators are functions that modify other functions or classes. They use @syntax. Common uses: logging, timing, authentication. You wrap a function and return the wrapper.', difficulty: 'Intermediate' },
    { question: 'Explain list comprehension with an example.', answer: 'List comprehension creates lists concisely. Example: [x*2 for x in range(5)] gives [0,2,4,6,8]. Syntax: [expr for item in iterable if condition].', difficulty: 'Beginner' },
    { question: 'What are generators and why use them?', answer: 'Generators use yield instead of return. They produce values lazily, one at a time, saving memory. Use for large datasets or infinite sequences. range() is a generator.', difficulty: 'Intermediate' },
    { question: 'What is the GIL (Global Interpreter Lock)?', answer: 'The GIL allows only one thread to execute Python bytecode at a time. It simplifies memory management but limits CPU-bound multithreading. Use multiprocessing for CPU-bound work.', difficulty: 'Advanced' },
    { question: 'Explain *args and **kwargs.', answer: '*args collects positional arguments into a tuple. **kwargs collects keyword arguments into a dict. Use for flexible function signatures.', difficulty: 'Intermediate' },
    { question: 'What is the difference between == and is?', answer: '== compares values. is compares object identity (same object in memory). Use is for None checks: if x is None.', difficulty: 'Beginner' },
    { question: 'How does Python handle memory management?', answer: 'Python uses reference counting and garbage collection. Objects are automatically freed when no references remain. The gc module handles circular references.', difficulty: 'Advanced' },
    { question: 'What is a context manager?', answer: 'Context managers handle setup/teardown with with statement. Implement __enter__ and __exit__. Used for files, locks, connections. Example: with open(f) as file.', difficulty: 'Intermediate' },
    { question: 'Explain the difference between shallow and deep copy.', answer: 'Shallow copy creates new object but copies references to nested objects. Deep copy recursively copies all nested objects. Use copy.deepcopy() for full independence.', difficulty: 'Intermediate' },
  ],
  'Full Stack Developer': [
    { question: 'What is the difference between REST and GraphQL?', answer: 'REST uses fixed endpoints; clients get full responses. GraphQL lets clients request exactly the fields needed. REST is simpler; GraphQL reduces over-fetching.', difficulty: 'Intermediate' },
    { question: 'Explain JWT and how it works.', answer: 'JWT is a stateless auth token. Structure: Header.Payload.Signature. Server signs payload; client sends token. No server-side session storage needed.', difficulty: 'Intermediate' },
    { question: 'What is the purpose of middleware?', answer: 'Middleware runs between request and response. Used for auth, logging, CORS, error handling. Express/Node and Django/Flask both support middleware.', difficulty: 'Beginner' },
    { question: 'How do you optimize a slow React app?', answer: 'Use React.memo, useMemo, useCallback. Code splitting with lazy(). Virtualize long lists. Profile with React DevTools. Avoid unnecessary re-renders.', difficulty: 'Intermediate' },
    { question: 'What is database connection pooling?', answer: 'Reuses database connections instead of creating new ones per request. Improves performance. Libraries like pg-pool (PostgreSQL) implement this.', difficulty: 'Intermediate' },
    { question: 'Explain CORS.', answer: 'CORS (Cross-Origin Resource Sharing) allows browsers to make requests to different origins. Server sends Access-Control-Allow-Origin header. Preflight requests for non-simple requests.', difficulty: 'Intermediate' },
    { question: 'What is server-side rendering (SSR)?', answer: 'Rendering HTML on the server for each request. Improves SEO and initial load. Next.js, Nuxt support SSR. Contrast with client-side only (SPA).', difficulty: 'Intermediate' },
    { question: 'How do you handle authentication in a SPA?', answer: 'Store JWT in httpOnly cookie or memory. Send with requests. Refresh tokens for long sessions. Never store in localStorage for XSS-sensitive apps.', difficulty: 'Intermediate' },
    { question: 'What is the difference between SQL and NoSQL?', answer: 'SQL: relational, structured, ACID. NoSQL: flexible schema, horizontal scaling. Use SQL for complex queries; NoSQL for scale/flexibility.', difficulty: 'Beginner' },
    { question: 'Explain microservices vs monolith.', answer: 'Monolith: single deployable unit. Microservices: small, independent services. Microservices enable independent scaling and deployment but add complexity.', difficulty: 'Intermediate' },
  ],
}

FALLBACK_INTERVIEW['Data Scientist'] = FALLBACK_INTERVIEW['Python Developer']
FALLBACK_INTERVIEW['DevOps Engineer'] = FALLBACK_INTERVIEW['Full Stack Developer']
FALLBACK_INTERVIEW['Frontend Developer'] = FALLBACK_INTERVIEW['Full Stack Developer']
FALLBACK_INTERVIEW['Backend Engineer'] = FALLBACK_INTERVIEW['Full Stack Developer']
FALLBACK_INTERVIEW['AI/ML Engineer'] = FALLBACK_INTERVIEW['Python Developer']

// Get fallback for any topic/role
export function getFallbackQuiz(topic) {
  return FALLBACK_QUIZ[topic] || FALLBACK_QUIZ.Python
}

export function getFallbackInterview(role) {
  return FALLBACK_INTERVIEW[role] || FALLBACK_INTERVIEW['Python Developer']
}
