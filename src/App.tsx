import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  SubjectInfo,
  SubjectId,
  TaskItem,
  DSAProblem,
  RoadmapMonth,
  BehavioralStory,
  MockInterview,
  CompanyTarget,
  Achievement,
  ReadinessWeights,
  HeatmapDay,
} from './types';
import { AppStore } from './services/storage';
import { soundService } from './services/audio';
import { AppNavbar } from './components/AppNavbar';
import { BottomNav, TabType } from './components/BottomNav';
import { CareerWealthHero } from './components/CareerWealthHero';
import { TodayMissionCard } from './components/TodayMissionCard';
import { SubjectStatsGrid } from './components/SubjectStatsGrid';
import { StreakHeatmap } from './components/StreakHeatmap';
import { TasksView } from './components/TasksView';
import { DSATrackerView } from './components/DSATrackerView';
import { RoadmapView } from './components/RoadmapView';
import { BehavioralView } from './components/BehavioralView';
import { MockInterviewsView } from './components/MockInterviewsView';
import { CompanyTrackerView } from './components/CompanyTrackerView';
import { AnalyticsView } from './components/AnalyticsView';
import { StudyTimerModal } from './components/StudyTimerModal';
import { TiersModal } from './components/TiersModal';
import { AchievementsModal } from './components/AchievementsModal';
import { WeeklyReviewModal } from './components/WeeklyReviewModal';
import { SmartPlanModal } from './components/SmartPlanModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { ImportExportModal } from './components/ImportExportModal';
import {
  Sparkles,
  Trophy,
  Flame,
  Calendar,
  Wand2,
  BarChart3,
  Users,
  Video,
  Building2,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Zap,
  RotateCcw,
  Target,
  ChevronRight,
  ShieldAlert,
  Smartphone,
  Wifi,
  ArrowUpDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'ach_1',
    title: 'First Step to FAANG',
    description: 'Completed your very first career prep task.',
    icon: 'Sparkles',
    unlocked: true,
    unlockedDate: '2026-06-02',
    xpReward: 50,
  },
  {
    id: 'ach_2',
    title: '7-Day Unbroken Momentum',
    description: 'Maintained a 7-day consistent study streak.',
    icon: 'Flame',
    unlocked: true,
    unlockedDate: '2026-06-08',
    xpReward: 100,
  },
  {
    id: 'ach_3',
    title: 'Iron Discipline (14 Days)',
    description: 'Maintained 14 days without missing a single day.',
    icon: 'Flame',
    unlocked: true,
    unlockedDate: '2026-06-15',
    xpReward: 150,
  },
  {
    id: 'ach_4',
    title: '30-Day Elite Habit',
    description: 'Achieve a 30-day streak of daily engineering progress.',
    icon: 'Trophy',
    unlocked: false,
    xpReward: 300,
  },
  {
    id: 'ach_5',
    title: 'Algorithmic Explorer (25 Solved)',
    description: 'Solved 25 quality DSA problems across core patterns.',
    icon: 'Binary',
    unlocked: true,
    unlockedDate: '2026-07-01',
    xpReward: 120,
  },
  {
    id: 'ach_6',
    title: 'Centurion of Code (100 Solved)',
    description: 'Solve 100 DSA problems across LeetCode & GFG.',
    icon: 'Binary',
    unlocked: false,
    xpReward: 250,
  },
  {
    id: 'ach_7',
    title: 'System Architect',
    description: 'Master distributed systems, caching, and database sharding.',
    icon: 'Server',
    unlocked: false,
    xpReward: 200,
  },
  {
    id: 'ach_8',
    title: 'Design Pattern Pro',
    description: 'Complete all Low-Level Design machine coding challenges.',
    icon: 'Boxes',
    unlocked: false,
    xpReward: 180,
  },
  {
    id: 'ach_9',
    title: 'STAR Storyteller',
    description: 'Draft and practice 8+ STAR behavioral interview stories.',
    icon: 'Award',
    unlocked: true,
    unlockedDate: '2026-08-01',
    xpReward: 100,
  },
];

const INITIAL_COMPANIES_LIST: CompanyTarget[] = [
  {
    id: 'c_01',
    name: 'Google',
    role: 'Software Engineer (L3 / Early Career)',
    tier: 'FAANG',
    status: 'Online Assessment',
    referralStatus: 'Secured',
    salaryRange: '$140k - $175k / ₹35-45 LPA',
    location: 'Bangalore / Mountain View',
    appliedDate: '2026-08-01',
    notes: 'Completed OA with 2/2 test cases passing. Waiting for recruiter call.',
    interviewDates: [{ stage: 'OA', date: '2026-08-05' }],
  },
  {
    id: 'c_02',
    name: 'Microsoft',
    role: 'Software Development Engineer I',
    tier: 'FAANG',
    status: 'Technical Screen',
    referralStatus: 'Secured',
    salaryRange: '$135k - $165k / ₹30-40 LPA',
    location: 'Hyderabad / Redmond',
    appliedDate: '2026-08-03',
    notes: 'Technical Round 1 scheduled for next week. Focus on Trees and System Design basics.',
    interviewDates: [
      { stage: 'OA', date: '2026-08-08' },
      { stage: 'Technical Screen', date: '2026-08-22' },
    ],
  },
  {
    id: 'c_03',
    name: 'Amazon',
    role: 'SDE-1 (AWS Services)',
    tier: 'FAANG',
    status: 'Applied',
    referralStatus: 'Secured',
    salaryRange: '$145k - $180k / ₹32-44 LPA',
    location: 'Seattle / Bangalore',
    appliedDate: '2026-08-02',
    notes: 'Recruiter call passed. Online Assessment portal link received.',
    interviewDates: [{ stage: 'Phone Screen', date: '2026-08-10' }],
  },
  {
    id: 'c_04',
    name: 'Uber',
    role: 'Software Engineer I (Core Logistics)',
    tier: 'Tier-1 Product',
    status: 'Wishlist',
    referralStatus: 'Requested',
    salaryRange: '$150k - $185k / ₹38-48 LPA',
    location: 'San Francisco / Bangalore',
    appliedDate: '2026-08-04',
    notes: 'Referred by Senior Engineer. Profile under hiring manager review.',
  },
  {
    id: 'c_05',
    name: 'Atlassian',
    role: 'Graduate Software Engineer',
    tier: 'Tier-1 Product',
    status: 'Wishlist',
    referralStatus: 'Requested',
    salaryRange: '$130k - $160k / ₹30-40 LPA',
    location: 'Sydney / Bangalore',
    appliedDate: '2026-08-05',
    notes: 'Preparing LLD machine coding for Jira/Confluence scale problem statements.',
  },
];

function readLocalList<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    const parsed: unknown = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) ? parsed as T[] : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Core App State
  const [user, setUser] = useState<UserProfile>(() => AppStore.getUser());
  const [subjects, setSubjects] = useState<SubjectInfo[]>(() => AppStore.getSubjects());
  const [tasks, setTasks] = useState<TaskItem[]>(() => AppStore.getTasks());
  const [dsaProblems, setDsaProblems] = useState<DSAProblem[]>(() => AppStore.getDSAProblems());
  const [roadmap, setRoadmap] = useState<RoadmapMonth[]>(() => AppStore.getRoadmap());
  const [behavioralStories, setBehavioralStories] = useState<BehavioralStory[]>(() => AppStore.getBehavioralStories());
  const [mockInterviews, setMockInterviews] = useState<MockInterview[]>(() => AppStore.getMockInterviews());
  const [companies, setCompanies] = useState<CompanyTarget[]>(() => readLocalList('careerforge_companies_target', INITIAL_COMPANIES_LIST));
  const [achievements, setAchievements] = useState<Achievement[]>(() => readLocalList('careerforge_achievements_v2', INITIAL_ACHIEVEMENTS_LIST));
  const [weights, setWeights] = useState<ReadinessWeights>(() => AppStore.getWeights());
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>(() => AppStore.getHeatmap());

  // UI Navigation & Modals State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [hubSection, setHubSection] = useState<'menu' | 'analytics' | 'behavioral' | 'mocks' | 'companies'>('menu');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);
  const [timerInitialTask, setTimerInitialTask] = useState<TaskItem | undefined>(undefined);
  const [isTiersOpen, setIsTiersOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState<boolean>(false);
  const [isSmartPlanOpen, setIsSmartPlanOpen] = useState<boolean>(false);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState<boolean>(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);

  // Synchronize dynamic readiness score whenever subjects or weights change
  useEffect(() => {
    const dynamicScore = AppStore.calculateReadinessScore(subjects, weights, dsaProblems, behavioralStories, roadmap);
    const calculatedLevel = AppStore.getLevelFromScore(dynamicScore);

    setUser((prev) => {
      const updated = {
        ...prev,
        careerWealthScore: dynamicScore,
        level: calculatedLevel,
      };
      AppStore.saveUser(updated);
      return updated;
    });
  }, [subjects, weights, dsaProblems, behavioralStories, roadmap]);

  // Save changes to storage
  const updateTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    AppStore.saveTasks(newTasks);
  };

  const updateDsaProblems = (newProblems: DSAProblem[]) => {
    setDsaProblems(newProblems);
    AppStore.saveDSAProblems(newProblems);
  };

  const updateRoadmap = (newRoadmap: RoadmapMonth[]) => {
    setRoadmap(newRoadmap);
    AppStore.saveRoadmap(newRoadmap);
  };

  const updateBehavioralStories = (newStories: BehavioralStory[]) => {
    setBehavioralStories(newStories);
    AppStore.saveBehavioralStories(newStories);
  };

  const updateMockInterviews = (newMocks: MockInterview[]) => {
    setMockInterviews(newMocks);
    AppStore.saveMockInterviews(newMocks);
  };

  const updateCompanies = (newCompanies: CompanyTarget[]) => {
    setCompanies(newCompanies);
    localStorage.setItem('careerforge_companies_target', JSON.stringify(newCompanies));
  };

  const updateAchievements = (newAchievements: Achievement[]) => {
    setAchievements(newAchievements);
    localStorage.setItem('careerforge_achievements_v2', JSON.stringify(newAchievements));
  };

  // Centralized engine to synchronously recalculate user level, score, XP, subject progress, and triggers
  const syncUserReadinessAndLevels = (
    currentTasks: TaskItem[],
    currentDsa: DSAProblem[],
    currentStories: BehavioralStory[],
    currentRoadmap: RoadmapMonth[],
    prevUser: UserProfile,
    xpDelta: number = 0
  ) => {
    const updatedSubjects = AppStore.calculateSubjectsProgress(
      subjects,
      currentTasks,
      currentDsa,
      currentStories,
      currentRoadmap
    );
    const newScore = AppStore.calculateReadinessScore(
      updatedSubjects,
      weights,
      currentDsa,
      currentStories,
      currentRoadmap,
      currentTasks
    );
    const newLevel = AppStore.getLevelFromScore(newScore);
    const newXp = Math.max(0, prevUser.xp + xpDelta);

    const isLevelUp = newLevel > prevUser.level;

    const updatedUser: UserProfile = {
      ...prevUser,
      careerWealthScore: newScore,
      level: newLevel,
      xp: newXp,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    setSubjects(updatedSubjects);
    AppStore.saveSubjects(updatedSubjects);

    setUser(updatedUser);
    AppStore.saveUser(updatedUser);

    if (isLevelUp) {
      soundService.playLevelUp();
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5A0E24', '#E11D48', '#F59E0B', '#10B981'],
        });
      } catch {
        // ignore
      }
    }

    return updatedUser;
  };

  // Handlers
  const handleToggleTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const isNowCompleted = target.status !== 'completed';
    const taskXp = target.priority === 'High' ? 75 : target.priority === 'Medium' ? 50 : 35;
    const xpDelta = isNowCompleted ? taskXp : -taskXp;

    const todayStr = new Date().toISOString().split('T')[0];
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: (isNowCompleted ? 'completed' : 'pending') as 'pending' | 'completed',
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    updateTasks(updated);

    // Audio feedback
    if (isNowCompleted) {
      soundService.playTaskPop();
    } else {
      soundService.playTap();
    }

    // Update heatmap for today
    const completedNow = updated.filter((t) => t.status === 'completed' && t.deadline === 'Today').length;
    setHeatmap((prev) => {
      const todayIndex = prev.findIndex((d) => d.date === todayStr);
      const nextDay: HeatmapDay = {
        date: todayStr,
        count: completedNow,
        studyMinutes: todayIndex >= 0 ? prev[todayIndex].studyMinutes : 0,
        level: (completedNow >= 4 ? 4 : completedNow >= 3 ? 3 : completedNow >= 1 ? 2 : 0) as HeatmapDay['level'],
      };
      if (todayIndex >= 0) {
        const nextHeatmap = [...prev];
        nextHeatmap[todayIndex] = nextDay;
        AppStore.saveHeatmap(nextHeatmap);
        return nextHeatmap;
      }
      const nextHeatmap = [...prev, nextDay].sort((a, b) => a.date.localeCompare(b.date));
      AppStore.saveHeatmap(nextHeatmap);
      return nextHeatmap;
    });

    // Instantly calculate and update levels, readiness score, subject progress, and XP!
    syncUserReadinessAndLevels(updated, dsaProblems, behavioralStories, roadmap, user, xpDelta);
  };

  const handleAddTask = (newTask: Partial<TaskItem>) => {
    const task: TaskItem = {
      id: `task_${Date.now()}`,
      subjectId: newTask.subjectId || 'DSA',
      topic: newTask.topic || 'General Practice',
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      estimatedMinutes: newTask.estimatedMinutes || 45,
      priority: newTask.priority || 'Medium',
      status: 'pending',
      deadline: newTask.deadline || 'Today',
      isDailyMission: newTask.isDailyMission !== undefined ? newTask.isDailyMission : true,
      createdAt: new Date().toISOString(),
    };
    const nextTasks = [task, ...tasks];
    updateTasks(nextTasks);
    syncUserReadinessAndLevels(nextTasks, dsaProblems, behavioralStories, roadmap, user, 0);
  };

  const handleDeleteTask = (taskId: string) => {
    soundService.playTap();
    const target = tasks.find((t) => t.id === taskId);
    const xpDelta = target && target.status === 'completed'
      ? -(target.priority === 'High' ? 75 : target.priority === 'Medium' ? 50 : 35)
      : 0;
    const nextTasks = tasks.filter((t) => t.id !== taskId);
    updateTasks(nextTasks);
    syncUserReadinessAndLevels(nextTasks, dsaProblems, behavioralStories, roadmap, user, xpDelta);
  };

  const handleUpdateDsaProblem = (updated: DSAProblem) => {
    const previous = dsaProblems.find((p) => p.id === updated.id);
    const list = dsaProblems.map((p) => (p.id === updated.id ? updated : p));
    updateDsaProblems(list);
    const becameSolved = updated.status === 'Solved' && previous?.status !== 'Solved';
    const becameUnsolved = updated.status !== 'Solved' && previous?.status === 'Solved';
    const xpDelta = becameSolved ? 50 : becameUnsolved ? -50 : 0;
    if (becameSolved) {
      soundService.playTaskPop();
    }
    syncUserReadinessAndLevels(tasks, list, behavioralStories, roadmap, user, xpDelta);
  };

  const handleAddDsaProblem = (newProblem: DSAProblem) => {
    const nextProblems = [newProblem, ...dsaProblems];
    updateDsaProblems(nextProblems);
    syncUserReadinessAndLevels(tasks, nextProblems, behavioralStories, roadmap, user, 25);
  };

  const handleToggleRoadmapTopic = (monthId: string, topicId: string) => {
    let toggledToComplete = false;
    const updated = roadmap.map((m) => {
      if (m.id === monthId) {
        const updatedTopics = m.topics.map((t) => {
          if (t.id === topicId) {
            const nextCompleted = !t.completed;
            if (nextCompleted) toggledToComplete = true;
            return { ...t, completed: nextCompleted };
          }
          return t;
        });
        const completedCount = updatedTopics.filter((t) => t.completed).length;
        const progressPercent = Math.round((completedCount / updatedTopics.length) * 100);
        return {
          ...m,
          topics: updatedTopics,
          progressPercent,
        };
      }
      return m;
    });
    updateRoadmap(updated);
    if (toggledToComplete) {
      soundService.playTaskPop();
    } else {
      soundService.playTap();
    }
    syncUserReadinessAndLevels(tasks, dsaProblems, behavioralStories, updated, user, toggledToComplete ? 40 : -40);
  };

  const handleOpenFocusTimer = (task?: TaskItem) => {
    soundService.playTap();
    setTimerInitialTask(task);
    setIsTimerOpen(true);
  };

  const handleCompleteTimerSession = (subjectId: SubjectId, durationMinutes: number, xpEarned: number) => {
    // Add session minutes to today's heatmap
    const todayStr = new Date().toISOString().split('T')[0];
    setHeatmap((prev) => {
      const todayIndex = prev.findIndex((d) => d.date === todayStr);
      if (todayIndex >= 0) {
        const nextHeatmap = [...prev];
        nextHeatmap[todayIndex] = {
          ...nextHeatmap[todayIndex],
          studyMinutes: nextHeatmap[todayIndex].studyMinutes + durationMinutes,
        };
        AppStore.saveHeatmap(nextHeatmap);
        return nextHeatmap;
      }
      const nextHeatmap = [...prev, {
        date: todayStr,
        count: 0,
        studyMinutes: durationMinutes,
        level: durationMinutes >= 90 ? 4 : durationMinutes >= 60 ? 3 : 1,
      } satisfies HeatmapDay].sort((a, b) => a.date.localeCompare(b.date));
      AppStore.saveHeatmap(nextHeatmap);
      return nextHeatmap;
    });

    syncUserReadinessAndLevels(tasks, dsaProblems, behavioralStories, roadmap, user, xpEarned);
  };

  const handleApplyRecoveryPlan = (recoveryTasks: Partial<TaskItem>[]) => {
    const formatted: TaskItem[] = recoveryTasks.map((t, idx) => ({
      id: `recovery_${Date.now()}_${idx}`,
      subjectId: t.subjectId || 'DSA',
      topic: t.topic || 'Recovery Sprint',
      title: t.title || 'Recovery Task',
      estimatedMinutes: t.estimatedMinutes || 45,
      priority: t.priority || 'High',
      status: 'pending',
      deadline: 'Today',
      isDailyMission: true,
      createdAt: new Date().toISOString(),
    }));
    const nextTasks = [...formatted, ...tasks];
    updateTasks(nextTasks);
    syncUserReadinessAndLevels(nextTasks, dsaProblems, behavioralStories, roadmap, user, 0);
    setActiveTab('tasks');
  };

  const handleSaveSmartPlan = (updatedUser: Partial<UserProfile>, updatedWeights: ReadinessWeights) => {
    setWeights(updatedWeights);
    AppStore.saveWeights(updatedWeights);
    const mergedUser = { ...user, ...updatedUser };
    const updatedSubjects = AppStore.calculateSubjectsProgress(
      subjects,
      tasks,
      dsaProblems,
      behavioralStories,
      roadmap
    );
    const newScore = AppStore.calculateReadinessScore(
      updatedSubjects,
      updatedWeights,
      dsaProblems,
      behavioralStories,
      roadmap,
      tasks
    );
    const newLevel = AppStore.getLevelFromScore(newScore);
    const finalizedUser: UserProfile = {
      ...mergedUser,
      careerWealthScore: newScore,
      level: newLevel,
    };
    setUser(finalizedUser);
    AppStore.saveUser(finalizedUser);
  };

  // Reload and refresh entire application state after backup import or reset
  const handleReloadAllData = () => {
    const freshUser = AppStore.getUser();
    const freshTasks = AppStore.getTasks();
    const freshDSA = AppStore.getDSAProblems();
    const freshRoadmap = AppStore.getRoadmap();
    const freshStories = AppStore.getBehavioralStories();
    const freshMocks = AppStore.getMockInterviews();
    const freshCompanies = readLocalList<CompanyTarget>('careerforge_companies_target', INITIAL_COMPANIES_LIST);
    const freshAchievements = readLocalList<Achievement>('careerforge_achievements_v2', INITIAL_ACHIEVEMENTS_LIST);
    const freshWeights = AppStore.getWeights();
    const freshHeatmap = AppStore.getHeatmap();

    setUser(freshUser);
    setTasks(freshTasks);
    setDsaProblems(freshDSA);
    setRoadmap(freshRoadmap);
    setBehavioralStories(freshStories);
    setMockInterviews(freshMocks);
    setCompanies(freshCompanies);
    setAchievements(freshAchievements);
    setWeights(freshWeights);
    setHeatmap(freshHeatmap);

    const updatedSubjects = AppStore.calculateSubjectsProgress(
      AppStore.getSubjects(),
      freshTasks,
      freshDSA,
      freshStories,
      freshRoadmap
    );
    setSubjects(updatedSubjects);
    AppStore.saveSubjects(updatedSubjects);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    soundService.playTap();
    setIsImportExportOpen(true);
  };

  // Pending counts for navigation badges
  const pendingTasksCount = tasks.filter((t) => t.status === 'pending' && (t.deadline === 'Today' || t.isDailyMission)).length;
  const dsaTodoCount = dsaProblems.filter((p) => p.status === 'Todo' || p.status === 'Revision Required').length;
  const totalStudyMinutes = heatmap.reduce((acc, d) => acc + d.studyMinutes, 0);

  // Screen Title for Status Bar
  const screenTitle =
    activeTab === 'home'
      ? 'CareerForge'
      : activeTab === 'tasks'
      ? 'Daily Missions & Tasks'
      : activeTab === 'roadmap'
      ? '7-Month FAANG Roadmap'
      : activeTab === 'dsa'
      ? 'DSA Pattern Bank'
      : 'FAANG Prep Hub';

  return (
    <div className="min-h-screen bg-[#07090D] text-slate-100 flex flex-col font-sans antialiased selection:bg-[#5A0E24] selection:text-white">
      {/* Top Navigation Bar with brand, target company, tab switcher, metrics and tools */}
      <AppNavbar
        user={user}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'more') setHubSection('menu');
        }}
        pendingTasksCount={pendingTasksCount}
        dsaTodoCount={dsaTodoCount}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenSmartPlan={() => setIsSmartPlanOpen(true)}
        onOpenWeeklyReview={() => setIsWeeklyReviewOpen(true)}
        onOpenPWAInstall={() => setIsPWAInstallOpen(true)}
        onOpenTiersModal={() => setIsTiersOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
      />

      {/* Main Responsive Viewport Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-12">
        {/* Main Tab Switcher Views */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Career Wealth Progression Hero & Streak Heatmap */}
              <div className="lg:col-span-5 xl:col-span-5 space-y-6">
                {/* 1. Career Wealth & Character Workstation Hero */}
                <CareerWealthHero
                  score={user.careerWealthScore}
                  streak={user.currentStreak}
                  level={user.level}
                  xp={user.xp}
                  onOpenTiersModal={() => setIsTiersOpen(true)}
                  onOpenAchievements={() => setIsAchievementsOpen(true)}
                />

                {/* 4. Interactive Streak Heatmap & Recovery Mechanism */}
                <StreakHeatmap
                  currentStreak={user.currentStreak}
                  longestStreak={user.longestStreak}
                  heatmap={heatmap}
                  onApplyRecoveryPlan={handleApplyRecoveryPlan}
                />
              </div>

              {/* Right Column: Today's Mission Action Checklist & Subject Readiness Matrix */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-6">
                {/* 2. Today's Mission Action Checklist */}
                <TodayMissionCard
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onOpenFocusTimer={handleOpenFocusTimer}
                />

                {/* 3. Subject Readiness Matrix Grid */}
                <SubjectStatsGrid
                  subjects={subjects}
                  onSelectSubject={(subjId) => {
                    if (subjId === 'DSA') {
                      setActiveTab('dsa');
                    } else if (subjId === 'Behavioral') {
                      setActiveTab('more');
                      setHubSection('behavioral');
                    } else if (subjId === 'Mock Interviews') {
                      setActiveTab('more');
                      setHubSection('mocks');
                    } else if (subjId === 'Company Prep') {
                      setActiveTab('more');
                      setHubSection('companies');
                    } else {
                      setActiveTab('roadmap');
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onOpenFocusTimer={(t) => handleOpenFocusTimer(t)}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={roadmap}
            onToggleTopic={handleToggleRoadmapTopic}
            onAddTaskFromTopic={handleAddTask}
          />
        )}

        {activeTab === 'dsa' && (
          <DSATrackerView
            problems={dsaProblems}
            onUpdateProblem={handleUpdateDsaProblem}
            onAddProblem={handleAddDsaProblem}
          />
        )}

        {activeTab === 'more' && (
          <div className="space-y-4">
            {/* Hub Navigation Bar */}
            {hubSection !== 'menu' && (
              <button
                onClick={() => {
                  soundService.playTap();
                  setHubSection('menu');
                }}
                className="flex items-center gap-1.5 text-xs text-rose-300 font-bold bg-[#181D29] px-3 py-1.5 rounded-xl border border-white/5 hover:bg-slate-800 transition-colors w-fit"
              >
                ← Back to FAANG Hub Menu
              </button>
            )}

            {hubSection === 'menu' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">FAANG Command Center Hub</h2>
                    <p className="text-xs text-slate-400">Advanced diagnostic, behavioral bank, mock interview simulator, and tracking modules</p>
                  </div>
                </div>

                {/* Hub Cards Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  <button
                    onClick={() => {
                      soundService.playTap();
                      setHubSection('analytics');
                    }}
                    className="p-4 bg-[#121622] hover:bg-[#181D2D] border border-white/10 hover:border-rose-900/50 rounded-2xl text-left transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-rose-300 transition-colors">
                          Readiness Diagnostics & Analytics
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          FAANG weighted index breakdown, study volume histograms, and priority vectors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/5 text-xs font-semibold text-rose-400">
                      <span>Open Analytics</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      soundService.playTap();
                      setHubSection('behavioral');
                    }}
                    className="p-4 bg-[#121622] hover:bg-[#181D2D] border border-white/10 hover:border-emerald-900/50 rounded-2xl text-left transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                          STAR Behavioral Story Bank
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Situation-Task-Action-Result leadership, conflict resolution, and impact interview bank
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/5 text-xs font-semibold text-emerald-400">
                      <span>Explore Stories</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      soundService.playTap();
                      setHubSection('mocks');
                    }}
                    className="p-4 bg-[#121622] hover:bg-[#181D2D] border border-white/10 hover:border-purple-900/50 rounded-2xl text-left transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                          Mock Simulator & AI Evaluation
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Log peer mocks, evaluate weak areas with Gemini AI, and auto-generate corrective tasks
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/5 text-xs font-semibold text-purple-400">
                      <span>Log & Evaluate</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      soundService.playTap();
                      setHubSection('companies');
                    }}
                    className="p-4 bg-[#121622] hover:bg-[#181D2D] border border-white/10 hover:border-amber-900/50 rounded-2xl text-left transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                          Target Companies Application Pipeline
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Track Google, Microsoft, Amazon, Meta pipelines, OA deadlines, and referral contacts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/5 text-xs font-semibold text-amber-400">
                      <span>View Pipelines</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>

                  {/* PWA & Offline Access Hub Item */}
                  <button
                    onClick={() => {
                      soundService.playTap();
                      setIsPWAInstallOpen(true);
                    }}
                    className="p-4 bg-[#121622] hover:bg-[#181D2D] border border-rose-900/40 rounded-2xl text-left transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm group-hover:text-rose-300 transition-colors">
                            PWA & Offline Installation
                          </h3>
                          <span className="text-[9px] bg-rose-950/70 text-rose-300 border border-rose-800/40 px-1.5 py-0.2 rounded font-mono">
                            PRO
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Install to Home Screen, offline study caching, and instant standalone launch
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/5 text-xs font-semibold text-rose-400">
                      <span>Install App</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                </div>

                {/* Quick Utilities & Backup */}
                <div className="bg-[#121622] border border-white/10 rounded-2xl p-5 space-y-3 mt-4">
                  <h3 className="font-bold text-white text-sm">Data Portability & Offline Persistence</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    All your preparation notes, solved problems, and streaks are securely saved locally on your device and synchronized with your MongoDB / Express backend.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      id="btn-hub-import-export"
                      onClick={() => {
                        soundService.playTap();
                        setIsImportExportOpen(true);
                      }}
                      className="py-2 px-4 rounded-xl bg-[#5A0E24] hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-950/40 active:scale-[0.98]"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      Import / Export Backup (JSON)
                    </button>
                    <button
                      onClick={() => {
                        soundService.playTap();
                        setIsWeeklyReviewOpen(true);
                      }}
                      className="py-2 px-4 rounded-xl bg-[#181D29] hover:bg-slate-800 border border-white/10 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-rose-400" />
                      Weekly Retrospective
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hubSection === 'analytics' && (
              <AnalyticsView
                score={user.careerWealthScore}
                subjects={subjects}
                heatmap={heatmap}
                dsaProblems={dsaProblems}
                totalStudyMinutes={totalStudyMinutes}
              />
            )}

            {hubSection === 'behavioral' && (
              <BehavioralView
                stories={behavioralStories}
                onUpdateStory={(updated) => {
                  const list = behavioralStories.map((s) => (s.id === updated.id ? updated : s));
                  updateBehavioralStories(list);
                }}
                onAddStory={(newStory) => {
                  updateBehavioralStories([newStory, ...behavioralStories]);
                }}
              />
            )}

            {hubSection === 'mocks' && (
              <MockInterviewsView
                mocks={mockInterviews}
                onAddMock={(newMock) => {
                  updateMockInterviews([newMock, ...mockInterviews]);
                }}
                onGenerateActionTasks={(generatedTasks) => {
                  const tasksToAdd: TaskItem[] = generatedTasks.map((t, idx) => ({
                    id: `mock_action_${Date.now()}_${idx}`,
                    subjectId: t.subjectId || 'Mock Interviews',
                    topic: t.topic || 'Interview Correction',
                    title: t.title || 'Corrective Practice',
                    estimatedMinutes: t.estimatedMinutes || 45,
                    priority: 'High',
                    status: 'pending',
                    deadline: 'Today',
                    isDailyMission: true,
                    createdAt: new Date().toISOString(),
                  }));
                  updateTasks([...tasksToAdd, ...tasks]);
                }}
              />
            )}

            {hubSection === 'companies' && (
              <CompanyTrackerView
                companies={companies}
                onUpdateCompany={(updated) => {
                  const list = companies.map((c) => (c.id === updated.id ? updated : c));
                  updateCompanies(list);
                }}
                onAddCompany={(newComp) => {
                  updateCompanies([newComp, ...companies]);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation for Mobile Devices */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'more') setHubSection('menu');
        }}
        pendingTasksCount={pendingTasksCount}
        dsaTodoCount={dsaTodoCount}
      />

      {/* Modals */}
      <StudyTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        initialTask={timerInitialTask}
        onCompleteSession={handleCompleteTimerSession}
      />

      <TiersModal
        isOpen={isTiersOpen}
        onClose={() => setIsTiersOpen(false)}
        currentScore={user.careerWealthScore}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
        userXp={user.xp}
      />

      <WeeklyReviewModal
        isOpen={isWeeklyReviewOpen}
        onClose={() => setIsWeeklyReviewOpen(false)}
        heatmap={heatmap}
        dsaProblems={dsaProblems}
        tasks={tasks}
        currentStreak={user.currentStreak}
      />

      <SmartPlanModal
        isOpen={isSmartPlanOpen}
        onClose={() => setIsSmartPlanOpen(false)}
        user={user}
        weights={weights}
        subjects={subjects}
        onSavePlan={handleSaveSmartPlan}
      />

      <PWAInstallModal
        isOpen={isPWAInstallOpen}
        onClose={() => setIsPWAInstallOpen(false)}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onDataRestored={handleReloadAllData}
      />
    </div>
  );
}
