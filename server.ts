import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory / Document DB State for MERN Backend
let db = {
  profile: {
    id: 'user_1',
    name: 'Rohit Kumar',
    email: 'rohitkumrr14@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Full Stack Developer',
    targetCompanyType: 'FAANG',
    targetCompanies: ['Google', 'Amazon', 'Microsoft', 'Uber'],
    targetInterviewMonth: 'February 2027',
    dailyStudyTargetHours: 3.5,
    xp: 4850,
    level: 4,
    careerWealthScore: 78,
    currentStreak: 12,
    longestStreak: 21,
    lastActiveDate: new Date().toISOString().split('T')[0],
    onboarded: true,
    createdAt: '2026-06-01',
  },
  tasks: [
    {
      id: 'task_1',
      subjectId: 'DSA',
      topic: 'Sliding Window & Two Pointers',
      title: 'Solve 3 Longest Substring & Container with Most Water variations',
      description: 'Focus on identifying shrinking condition for variable-length window.',
      estimatedMinutes: 60,
      actualMinutes: 55,
      priority: 'High',
      status: 'completed',
      deadline: 'Today',
      isDailyMission: true,
      difficulty: 'Medium',
      completedAt: new Date().toISOString(),
      xpReward: 120,
    },
    {
      id: 'task_2',
      subjectId: 'MERN',
      topic: 'Express Middleware & Async Errors',
      title: 'Build custom JWT auth middleware & centralized error handler',
      description: 'Implement refresh token rotation and rate limiting with Redis.',
      estimatedMinutes: 45,
      actualMinutes: 40,
      priority: 'High',
      status: 'completed',
      deadline: 'Today',
      isDailyMission: true,
      difficulty: 'Medium',
      completedAt: new Date().toISOString(),
      xpReward: 100,
    },
    {
      id: 'task_3',
      subjectId: 'System Design',
      topic: 'Consistent Hashing & Partitioning',
      title: 'Deep dive into virtual nodes and replication factor distribution',
      description: 'Review DynamoDB & Cassandra partition keys and rebalancing.',
      estimatedMinutes: 50,
      priority: 'High',
      status: 'pending',
      deadline: 'Today',
      isDailyMission: true,
      difficulty: 'Hard',
      xpReward: 150,
    },
    {
      id: 'task_4',
      subjectId: 'Core CS',
      topic: 'Database Indexes (B-Tree vs Hash)',
      title: 'Index fragmentation, composite indexes, and EXPLAIN ANALYZE',
      description: 'Understand B+ Tree page splits, clustered vs secondary indexes.',
      estimatedMinutes: 40,
      priority: 'Medium',
      status: 'pending',
      deadline: 'Today',
      isDailyMission: true,
      difficulty: 'Medium',
      xpReward: 90,
    },
    {
      id: 'task_5',
      subjectId: 'Behavioral',
      topic: 'Conflict with Senior Engineer',
      title: 'Refine STAR Story #2 on resolving architectural dispute',
      description: 'Frame disagreement constructively using data and benchmark tests.',
      estimatedMinutes: 30,
      priority: 'Medium',
      status: 'pending',
      deadline: 'Tomorrow',
      isDailyMission: false,
      difficulty: 'Easy',
      xpReward: 60,
    },
  ],
  dsaProblems: [
    {
      id: 'dsa_1',
      title: 'Longest Substring Without Repeating Characters',
      topic: 'Sliding Window',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
      status: 'Solved',
      confidence: 'High',
      solvedCount: 3,
      lastPracticed: '2026-08-14',
      pattern: 'Dynamic Sliding Window with Hash Map Index Pointer',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(min(N, M))',
      keyTakeaway: 'Store char -> lastIndex + 1 to jump start pointer instantly.',
      companies: ['Amazon', 'Google', 'Microsoft', 'Bloomberg'],
      isCore150: true,
    },
    {
      id: 'dsa_2',
      title: 'Container With Most Water',
      topic: 'Two Pointers',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
      status: 'Solved',
      confidence: 'High',
      solvedCount: 2,
      lastPracticed: '2026-08-12',
      pattern: 'Opposite Ends Two Pointers',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      keyTakeaway: 'Always move the pointer with the smaller height to maximize area potential.',
      companies: ['Amazon', 'Meta', 'Google', 'Apple'],
      isCore150: true,
    },
    {
      id: 'dsa_3',
      title: 'Course Schedule II',
      topic: 'Graphs & BFS/DFS',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/',
      status: 'Solved',
      confidence: 'Medium',
      solvedCount: 2,
      lastPracticed: '2026-08-10',
      pattern: 'Topological Sort / Kahn Algorithm',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
      keyTakeaway: 'Calculate in-degree array, push 0 in-degree nodes into queue, detect cycles if processed count < V.',
      companies: ['Amazon', 'Microsoft', 'Uber', 'Robinhood'],
      isCore150: true,
    },
    {
      id: 'dsa_4',
      title: 'LRU Cache',
      topic: 'Design / Linked List + Hash Map',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
      status: 'Solved',
      confidence: 'High',
      solvedCount: 4,
      lastPracticed: '2026-08-13',
      pattern: 'Doubly Linked List + Hash Map',
      timeComplexity: 'O(1) Get & Put',
      spaceComplexity: 'O(Capacity)',
      keyTakeaway: 'Use dummy head and tail nodes to eliminate edge case null checking during node re-linking.',
      companies: ['Amazon', 'Google', 'Microsoft', 'Apple', 'Meta'],
      isCore150: true,
    },
  ],
  roadmap: [],
  behavioral: [],
  mocks: [],
  companies: [],
  weights: {
    DSA: 30,
    MERN: 20,
    SystemDesign: 15,
    CoreCS: 15,
    Projects: 10,
    LLD: 5,
    Behavioral: 5,
  },
  sessions: [],
};

// Lazy-initialized server-side Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// MERN REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    stack: 'MERN (MongoDB / Express / React / Node.js + Tailwind CSS)',
    app: 'CareerForge Full-Stack Backend',
    timestamp: new Date().toISOString(),
  });
});

// 2. User Profile Routes
app.get('/api/profile', (req, res) => {
  res.json(db.profile);
});

app.put('/api/profile', (req, res) => {
  db.profile = { ...db.profile, ...req.body, lastActiveDate: new Date().toISOString().split('T')[0] };
  res.json(db.profile);
});

// 3. Tasks Routes
app.get('/api/tasks', (req, res) => {
  res.json(db.tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = db.tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  db.tasks[index] = { ...db.tasks[index], ...req.body };
  res.json(db.tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.tasks = db.tasks.filter((t) => t.id !== id);
  res.json({ success: true, id });
});

// 4. DSA Problem Bank Routes
app.get('/api/dsa', (req, res) => {
  res.json(db.dsaProblems);
});

app.post('/api/dsa', (req, res) => {
  const newProblem = {
    id: `dsa_${Date.now()}`,
    status: 'Todo',
    confidence: 'Medium',
    solvedCount: 0,
    ...req.body,
  };
  db.dsaProblems.push(newProblem);
  res.status(201).json(newProblem);
});

app.put('/api/dsa/:id', (req, res) => {
  const { id } = req.params;
  const index = db.dsaProblems.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Problem not found' });
  }
  db.dsaProblems[index] = { ...db.dsaProblems[index], ...req.body };
  res.json(db.dsaProblems[index]);
});

app.delete('/api/dsa/:id', (req, res) => {
  const { id } = req.params;
  db.dsaProblems = db.dsaProblems.filter((p) => p.id !== id);
  res.json({ success: true, id });
});

// 5. Readiness Formula Weights Route
app.get('/api/weights', (req, res) => {
  res.json(db.weights);
});

app.put('/api/weights', (req, res) => {
  db.weights = { ...db.weights, ...req.body };
  res.json(db.weights);
});

// 6. Full Data Sync / Backup Routes
app.get('/api/backup', (req, res) => {
  res.json({
    profile: db.profile,
    tasks: db.tasks,
    dsaProblems: db.dsaProblems,
    weights: db.weights,
    exportedAt: new Date().toISOString(),
  });
});

app.post('/api/backup/restore', (req, res) => {
  const backup = req.body;
  if (backup.profile) db.profile = backup.profile;
  if (backup.tasks) db.tasks = backup.tasks;
  if (backup.dsaProblems) db.dsaProblems = backup.dsaProblems;
  if (backup.weights) db.weights = backup.weights;
  res.json({ success: true, message: 'Database restored successfully' });
});

// -------------------------------------------------------------
// AI Smart Features (Gemini 3.7 Flash)
// -------------------------------------------------------------

// AI Smart Plan Recommendation Endpoint
app.post('/api/ai/smart-plan', async (req, res) => {
  try {
    const { targetRole, targetCompany, dailyHours, weakSubjects, currentProgress } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        plan: [
          {
            subject: 'DSA',
            topic: 'Graphs & BFS/DFS',
            task: 'Solve 2 Medium graph traversal problems (Number of Islands / Clone Graph)',
            durationMinutes: 60,
            priority: 'High',
          },
          {
            subject: 'MERN',
            topic: 'MongoDB Indexing & Aggregation',
            task: 'Build compound indexes and test aggregation pipeline execution stats ($match, $lookup, $unwind)',
            durationMinutes: 45,
            priority: 'High',
          },
          {
            subject: 'System Design',
            topic: 'Distributed Caching',
            task: 'Design Redis cluster invalidation & TTL strategy for high-read APIs',
            durationMinutes: 45,
            priority: 'High',
          },
          {
            subject: 'Core CS',
            topic: 'OS & Concurrency',
            task: 'Review Deadlock conditions (Coffman) and Mutex vs Semaphore implementation',
            durationMinutes: 35,
            priority: 'Medium',
          },
          {
            subject: 'Behavioral',
            topic: 'STAR Story',
            task: 'Draft STAR story about handling sudden requirements changes or scope creep',
            durationMinutes: 25,
            priority: 'Medium',
          },
        ],
        motivation: 'Targeted preparation today brings you one step closer to your ' + (targetCompany || 'FAANG') + ' offer.',
      });
    }

    const prompt = `You are a Principal Engineering Career Coach for FAANG/MNC candidates specializing in the MERN Stack and System Architecture.
Generate an optimal daily study mission for a candidate with the following profile:
- Target Role: ${targetRole || 'Full Stack Developer'}
- Target Companies: ${targetCompany || 'Google, Amazon, Microsoft'}
- Daily Available Hours: ${dailyHours || 3.5} hours
- Focus / Weak Subjects: ${JSON.stringify(weakSubjects || ['MERN', 'System Design', 'LLD'])}
- Current Readiness Score: ${currentProgress || 75}%

Return a valid JSON object matching this schema:
{
  "plan": [
    {
      "subject": "DSA | MERN | System Design | LLD | Core CS | Behavioral | Projects",
      "topic": "Specific technical topic",
      "task": "Concrete actionable task description",
      "durationMinutes": number,
      "priority": "High | Medium | Low"
    }
  ],
  "motivation": "Short inspiring, non-toxic motivational quote for today"
}
Ensure the sum of durationMinutes matches approximately ${Math.round((dailyHours || 3.5) * 60)} minutes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Error generating smart plan:', error);
    res.status(500).json({ error: 'Failed to generate plan via AI' });
  }
});

// AI Mock Interview Feedback Endpoint
app.post('/api/ai/mock-feedback', async (req, res) => {
  try {
    const { interviewType, company, topic, candidateNotes } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        scoreOutOf10: 8.2,
        strengths: [
          'Clear communication of initial brute-force approach before jumping to optimal O(N) solution.',
          'Solid time and space complexity articulation.',
          'Strong full-stack architectural design with decoupled Express services and MongoDB schema design.',
        ],
        weaknesses: [
          'Missed edge cases with null/empty inputs and potential integer overflow on large datasets.',
          'Could modularize helper utility methods for cleaner readability.',
        ],
        actionItems: [
          'Always state boundary edge cases (0, 1, max_int, negative) upfront before writing code.',
          'Practice 3 similar problems under timed 35-minute constraints.',
        ],
        verdict: 'Hire (Strong SDE-1 / Solid SDE-2 baseline)',
      });
    }

    const prompt = `You are a Senior Bar Raiser Interviewer for FAANG/MNC companies (${company || 'Tier-1 Product Company'}).
Evaluate the following candidate mock interview summary for type: ${interviewType}, Topic: ${topic}:

Candidate Response & Whiteboard Notes:
"${candidateNotes}"

Provide realistic, strict, constructive FAANG interview evaluation in JSON format:
{
  "scoreOutOf10": number (e.g. 7.8),
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "actionItems": ["string", "string"],
  "verdict": "Strong Hire | Hire | Leaning Hire | Leaning No Hire"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Error generating mock feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback via AI' });
  }
});

// AI DSA Algorithmic Hint Endpoint
app.post('/api/ai/dsa-hint', async (req, res) => {
  try {
    const { problemTitle, topic, currentAttempt } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        hintLevel: 'Intuition',
        hint: `Consider using a two-pointer or sliding window technique. Notice how elements only need to be inspected once if you maintain a frequency map or monotonic queue.`,
        targetComplexity: 'O(N) Time, O(1) or O(K) Auxiliary Space',
      });
    }

    const prompt = `Provide a progressive algorithmic hint for the problem "${problemTitle}" in topic "${topic}".
User's roadblock/attempt: "${currentAttempt || 'Stuck on optimal time complexity'}".
Do NOT give away full code. Guide them with mathematical intuition, invariant, and target time/space complexity.
Return JSON:
{
  "hintLevel": "Intuition | Pattern Hint | Invariant Pointer",
  "hint": "string",
  "targetComplexity": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Error getting DSA hint:', error);
    res.status(500).json({ error: 'Failed to get hint' });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerForge MERN Server running on http://localhost:${PORT}`);
  });
}

startServer();

