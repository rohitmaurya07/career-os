export type UserRole = 'SDE-1' | 'Full Stack Developer' | 'Backend Developer' | 'Frontend Developer' | 'General SWE';
export type TargetCompanyType = 'FAANG' | 'MNC' | 'Product-Based Company' | 'Startup' | 'General SWE';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  targetRole: UserRole;
  targetCompanyType: TargetCompanyType;
  targetCompanies: string[];
  targetInterviewMonth: string; // e.g. "February 2027"
  dailyStudyTargetHours: number;
  xp: number;
  level: number;
  careerWealthScore: number; // 0 - 100
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  onboarded: boolean;
  createdAt: string;
}

export type SubjectId =
  | 'DSA'
  | 'MERN'
  | 'System Design'
  | 'LLD'
  | 'Core CS'
  | 'Behavioral'
  | 'Projects'
  | 'Mock Interviews'
  | 'Company Prep';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  iconName: string;
  color: string;
  accentColor: string;
  description: string;
  progressPercent: number;
  targetWeight: number; // For Career Readiness calculation
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'pending' | 'completed';

export interface TaskItem {
  id: string;
  subjectId: SubjectId;
  topic: string;
  title: string;
  description?: string;
  estimatedMinutes: number;
  actualMinutes?: number;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string; // 'Today' | YYYY-MM-DD
  isDailyMission: boolean;
  tags?: string[];
  completedAt?: string;
  createdAt: string;
}

export type DSADifficulty = 'Easy' | 'Medium' | 'Hard';
export type DSAStatus = 'Todo' | 'Attempted' | 'Solved' | 'Revision Required';
export type DSAPlatform = 'LeetCode' | 'GFG' | 'Codeforces' | 'InterviewBit' | 'Custom';

export interface DSAProblem {
  id: string;
  title: string;
  platform: DSAPlatform;
  difficulty: DSADifficulty;
  topic: string;
  pattern: string;
  status: DSAStatus;
  timeTakenMinutes?: number;
  attemptsCount: number;
  problemUrl?: string;
  solvedAt?: string;
  revisionDates?: string[];
  notes?: string;
  codeSnippet?: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface RoadmapMonth {
  id: string;
  monthName: string; // 'AUGUST', 'SEPTEMBER', etc.
  theme: string; // 'MERN + Projects', 'System Design', etc.
  focusDescription: string;
  topics: RoadmapTopic[];
  practiceItems: string[];
  continuousFocus: string[];
  progressPercent: number;
}

export type BehavioralCategory =
  | 'Leadership'
  | 'Ownership'
  | 'Conflict'
  | 'Failure'
  | 'Mistake'
  | 'Teamwork'
  | 'Feedback'
  | 'Pressure'
  | 'Prioritization'
  | 'Ambiguity'
  | 'Learning'
  | 'Initiative';

export type StoryStatus = 'Draft' | 'Practiced' | 'Interview Ready';

export interface BehavioralStory {
  id: string;
  title: string;
  category: BehavioralCategory | string;
  situation: string;
  task: string;
  action: string;
  result: string;
  lessonsLearned: string;
  followUpQuestions?: string[];
  status: StoryStatus;
  practiced?: boolean;
  lastPracticedDate?: string;
  updatedAt: string;
}

export type MockType = 'DSA' | 'LLD' | 'System Design' | 'Behavioral' | 'Full Loop' | 'Full Mock';

export interface MockInterview {
  id: string;
  type?: MockType;
  category?: string;
  topic?: string;
  company?: string;
  interviewer?: string;
  interviewerName?: string;
  date: string;
  durationMinutes?: number;
  scoreOutOf10: number; // e.g. 8.5
  feedback: string;
  weakAreas: string[];
  actionItems: string[];
  confidenceLevel?: number;
  createdAt?: string;
}

export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Online Assessment'
  | 'Technical Screen'
  | 'System Design / LLD'
  | 'Onsite / Final Loop'
  | 'Offer'
  | 'Rejected';

export type ApplicationStage = ApplicationStatus | string;

export interface CompanyTarget {
  id: string;
  name: string;
  role: string;
  tier: 'FAANG' | 'Tier-1 Product' | 'Top MNC';
  status: ApplicationStatus;
  referralStatus: 'None' | 'Requested' | 'Secured';
  salaryRange?: string;
  location?: string;
  appliedDate?: string;
  targetDate?: string;
  notes?: string;
  interviewDates?: { stage: string; date: string }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  xpReward: number;
}

export interface CompanyApplication {
  id: string;
  companyName: string;
  role: string;
  location?: string;
  applicationDate: string;
  currentStage: ApplicationStage;
  notes?: string;
  salaryRange?: string;
  interviewDates?: { stage: string; date: string }[];
}

export interface StudySession {
  id: string;
  subjectId: SubjectId;
  topic?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  xpEarned: number;
  notes?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'streak' | 'dsa' | 'project' | 'mock' | 'mastery';
  unlockedAt?: string;
  targetCount: number;
  currentCount: number;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // tasks/problems completed
  studyMinutes: number;
  level: 0 | 1 | 2 | 3 | 4; // intensity
}

export interface ReadinessWeights {
  DSA: number; // default 30
  CoreCS: number; // default 20
  Projects: number; // default 15
  MERN: number; // default 10
  LLD: number; // default 10
  SystemDesign: number; // default 5
  Behavioral: number; // default 10
}

export interface AppNotificationSettings {
  dailyTaskReminder: boolean;
  dailyReminderTime: string; // "09:00"
  streakReminder: boolean;
  streakReminderTime: string; // "20:00"
  weeklyReviewReminder: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
}
