import {
  UserProfile,
  SubjectInfo,
  TaskItem,
  DSAProblem,
  RoadmapMonth,
  BehavioralStory,
  MockInterview,
  CompanyApplication,
  AchievementItem,
  ReadinessWeights,
  HeatmapDay,
  AppNotificationSettings,
  StudySession,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_DSA_PROBLEMS,
  INITIAL_ROADMAP,
  INITIAL_BEHAVIORAL_STORIES,
  INITIAL_MOCK_INTERVIEWS,
  INITIAL_COMPANY_APPLICATIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_DEFAULT_WEIGHTS,
  generateInitialHeatmap,
} from '../data/initialData';

import { INITIAL_TASKS } from '../data/initial-daily-tasks-faang';

const KEYS = {
  USER: 'careerforge_user',
  SUBJECTS: 'careerforge_subjects',
  TASKS: 'careerforge_tasks',
  DSA: 'careerforge_dsa',
  ROADMAP: 'careerforge_roadmap',
  BEHAVIORAL: 'careerforge_behavioral',
  MOCK: 'careerforge_mock',
  COMPANIES: 'careerforge_companies',
  ACHIEVEMENTS: 'careerforge_achievements',
  WEIGHTS: 'careerforge_weights',
  HEATMAP: 'careerforge_heatmap',
  SESSIONS: 'careerforge_sessions',
  NOTIFICATIONS: 'careerforge_notifications',
};

export class AppStore {
  public static getUser(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_USER;
  }

  public static saveUser(user: UserProfile) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  public static getSubjects(): SubjectInfo[] {
    try {
      const data = localStorage.getItem(KEYS.SUBJECTS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_SUBJECTS;
  }

  public static saveSubjects(subjects: SubjectInfo[]) {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  }

  public static getTasks(): TaskItem[] {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_TASKS;
  }

  public static saveTasks(tasks: TaskItem[]) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  }

  public static getDSAProblems(): DSAProblem[] {
    try {
      const data = localStorage.getItem(KEYS.DSA);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_DSA_PROBLEMS;
  }

  public static saveDSAProblems(problems: DSAProblem[]) {
    localStorage.setItem(KEYS.DSA, JSON.stringify(problems));
  }

  public static getRoadmap(): RoadmapMonth[] {
    try {
      const data = localStorage.getItem(KEYS.ROADMAP);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_ROADMAP;
  }

  public static saveRoadmap(roadmap: RoadmapMonth[]) {
    localStorage.setItem(KEYS.ROADMAP, JSON.stringify(roadmap));
  }

  public static getBehavioralStories(): BehavioralStory[] {
    try {
      const data = localStorage.getItem(KEYS.BEHAVIORAL);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_BEHAVIORAL_STORIES;
  }

  public static saveBehavioralStories(stories: BehavioralStory[]) {
    localStorage.setItem(KEYS.BEHAVIORAL, JSON.stringify(stories));
  }

  public static getMockInterviews(): MockInterview[] {
    try {
      const data = localStorage.getItem(KEYS.MOCK);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_MOCK_INTERVIEWS;
  }

  public static saveMockInterviews(mocks: MockInterview[]) {
    localStorage.setItem(KEYS.MOCK, JSON.stringify(mocks));
  }

  public static getCompanyApplications(): CompanyApplication[] {
    try {
      const data = localStorage.getItem(KEYS.COMPANIES);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_COMPANY_APPLICATIONS;
  }

  public static saveCompanyApplications(apps: CompanyApplication[]) {
    localStorage.setItem(KEYS.COMPANIES, JSON.stringify(apps));
  }

  public static getAchievements(): AchievementItem[] {
    try {
      const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_ACHIEVEMENTS;
  }

  public static saveAchievements(achievements: AchievementItem[]) {
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  public static getWeights(): ReadinessWeights {
    try {
      const data = localStorage.getItem(KEYS.WEIGHTS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_DEFAULT_WEIGHTS;
  }

  public static saveWeights(weights: ReadinessWeights) {
    localStorage.setItem(KEYS.WEIGHTS, JSON.stringify(weights));
  }

  public static getHeatmap(): HeatmapDay[] {
    try {
      const data = localStorage.getItem(KEYS.HEATMAP);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    const initial = generateInitialHeatmap();
    localStorage.setItem(KEYS.HEATMAP, JSON.stringify(initial));
    return initial;
  }

  public static saveHeatmap(heatmap: HeatmapDay[]) {
    localStorage.setItem(KEYS.HEATMAP, JSON.stringify(heatmap));
  }

  public static getStudySessions(): StudySession[] {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'sess_1',
        subjectId: 'DSA',
        topic: 'Two Pointers & Graphs',
        startTime: new Date(Date.now() - 3600000 * 3).toISOString(),
        endTime: new Date(Date.now() - 3600000 * 2).toISOString(),
        durationMinutes: 50,
        xpEarned: 100,
      },
      {
        id: 'sess_2',
        subjectId: 'Core CS',
        topic: 'TCP Handshake & HTTP/2',
        startTime: new Date(Date.now() - 3600000 * 5).toISOString(),
        endTime: new Date(Date.now() - 3600000 * 4.25).toISOString(),
        durationMinutes: 45,
        xpEarned: 90,
      },
    ];
  }

  public static saveStudySessions(sessions: StudySession[]) {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  }

  public static getNotificationSettings(): AppNotificationSettings {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return {
      dailyTaskReminder: true,
      dailyReminderTime: '09:00',
      streakReminder: true,
      streakReminderTime: '20:30',
      weeklyReviewReminder: true,
      soundEffects: true,
      hapticFeedback: true,
    };
  }

  public static saveNotificationSettings(settings: AppNotificationSettings) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(settings));
  }

  // Calculate dynamic Subject Progress percentages based on current tasks, DSA problems, and behavioral stories
  public static calculateSubjectsProgress(
    baseSubjects: SubjectInfo[],
    tasks: TaskItem[],
    dsaProblems: DSAProblem[],
    behavioralStories: BehavioralStory[],
    roadmap: RoadmapMonth[]
  ): SubjectInfo[] {
    const dsaSolved = dsaProblems.filter((p) => p.status === 'Solved').length;
    const behavioralReady = behavioralStories.filter((s) => s.status === 'Interview Ready').length;

    // Calculate roadmap topics completion ratio
    let totalRoadmapTopics = 0;
    let completedRoadmapTopics = 0;
    roadmap.forEach((m) => {
      totalRoadmapTopics += m.topics.length;
      completedRoadmapTopics += m.topics.filter((t) => t.completed).length;
    });
    const roadmapRatio = totalRoadmapTopics > 0 ? completedRoadmapTopics / totalRoadmapTopics : 0.5;

    return baseSubjects.map((subj) => {
      const subjectTasks = tasks.filter((t) => t.subjectId === subj.id);
      const completedTasks = subjectTasks.filter((t) => t.status === 'completed');
      const taskRatio = subjectTasks.length > 0 ? completedTasks.length / subjectTasks.length : 0;

      let computedPercent = subj.progressPercent;

      if (subj.id === 'DSA') {
        const dsaTarget = 100;
        const problemProgress = Math.min(100, Math.round((dsaSolved / dsaTarget) * 100));
        if (subjectTasks.length > 0) {
          computedPercent = Math.min(100, Math.max(1, Math.round(problemProgress * 0.65 + taskRatio * 35)));
        } else {
          computedPercent = problemProgress;
        }
      } else if (subj.id === 'Behavioral') {
        const storyProgress = Math.min(100, Math.round((behavioralReady / 8) * 100));
        if (subjectTasks.length > 0) {
          computedPercent = Math.min(100, Math.max(1, Math.round(storyProgress * 0.6 + taskRatio * 40)));
        } else {
          computedPercent = storyProgress;
        }
      } else if (subj.id === 'Core CS') {
        const base = 40;
        const roadmapContribution = roadmapRatio * 30;
        const taskContribution = subjectTasks.length > 0 ? taskRatio * 30 : 15;
        computedPercent = Math.min(100, Math.max(1, Math.round(base + roadmapContribution + taskContribution)));
      } else if (subj.id === 'MERN') {
        const base = 45;
        const taskContribution = subjectTasks.length > 0 ? taskRatio * 55 : 35;
        computedPercent = Math.min(100, Math.max(1, Math.round(base + taskContribution)));
      } else if (subj.id === 'LLD') {
        const base = 35;
        const taskContribution = subjectTasks.length > 0 ? taskRatio * 65 : 20;
        computedPercent = Math.min(100, Math.max(1, Math.round(base + taskContribution)));
      } else if (subj.id === 'System Design') {
        const base = 35;
        const taskContribution = subjectTasks.length > 0 ? taskRatio * 65 : 25;
        computedPercent = Math.min(100, Math.max(1, Math.round(base + taskContribution)));
      } else if (subj.id === 'Projects') {
        const base = 50;
        const taskContribution = subjectTasks.length > 0 ? taskRatio * 50 : 40;
        computedPercent = Math.min(100, Math.max(1, Math.round(base + taskContribution)));
      } else if (subjectTasks.length > 0) {
        computedPercent = Math.min(100, Math.max(5, Math.round(30 + taskRatio * 70)));
      }

      return {
        ...subj,
        progressPercent: computedPercent,
      };
    });
  }

  // Calculate dynamic Career Readiness score based on current user stats & weights
  public static calculateReadinessScore(
    subjects: SubjectInfo[],
    weights: ReadinessWeights,
    dsaProblems: DSAProblem[],
    behavioralStories: BehavioralStory[],
    roadmap: RoadmapMonth[],
    tasks?: TaskItem[]
  ): number {
    const activeSubjects = tasks
      ? this.calculateSubjectsProgress(subjects, tasks, dsaProblems, behavioralStories, roadmap)
      : subjects;

    const dsaSubject = activeSubjects.find((s) => s.id === 'DSA');
    const coreCsSubject = activeSubjects.find((s) => s.id === 'Core CS');
    const projectsSubject = activeSubjects.find((s) => s.id === 'Projects');
    const mernSubject = activeSubjects.find((s) => s.id === 'MERN');
    const lldSubject = activeSubjects.find((s) => s.id === 'LLD');
    const sysDesignSubject = activeSubjects.find((s) => s.id === 'System Design');
    const behavioralSubject = activeSubjects.find((s) => s.id === 'Behavioral');

    const dsaScore = dsaSubject?.progressPercent || 70;
    const coreCsScore = coreCsSubject?.progressPercent || 64;
    const projectsScore = projectsSubject?.progressPercent || 85;
    const mernScore = mernSubject?.progressPercent || 80;
    const lldScore = lldSubject?.progressPercent || 50;
    const sysDesignScore = sysDesignSubject?.progressPercent || 60;
    const behavioralScore = behavioralSubject?.progressPercent || 45;

    const totalWeight =
      weights.DSA +
      weights.CoreCS +
      weights.Projects +
      weights.MERN +
      weights.LLD +
      weights.SystemDesign +
      weights.Behavioral;

    if (totalWeight === 0) return 75;

    const weightedTotal =
      dsaScore * weights.DSA +
      coreCsScore * weights.CoreCS +
      projectsScore * weights.Projects +
      mernScore * weights.MERN +
      lldScore * weights.LLD +
      sysDesignScore * weights.SystemDesign +
      behavioralScore * weights.Behavioral;

    return Math.min(100, Math.max(1, Math.round(weightedTotal / totalWeight)));
  }

  // Calculate Level from Career Wealth Score (0-100)
  public static getLevelFromScore(score: number): number {
    if (score <= 20) return 1; // Beginner
    if (score <= 40) return 2; // Learner
    if (score <= 60) return 3; // Developer
    if (score <= 75) return 4; // Strong Candidate
    if (score <= 90) return 5; // Interview Ready
    return 6; // FAANG Ready
  }

  // Dynamic motivational quote generator based on streak & consistency
  public static getMotivationalQuote(streak: number, completedToday: number, totalToday: number): string {
    if (completedToday === totalToday && totalToday > 0) {
      return "Daily mission fully conquered. You're compounding career wealth every single day.";
    }
    if (streak >= 14) {
      return `🔥 ${streak}-day unbroken streak. Your discipline is separating you from 95% of candidates.`;
    }
    if (streak >= 7) {
      return 'You are building strong momentum. Keep stacking days.';
    }
    if (completedToday > 0) {
      return "Great progress today. Finish your mission to lock in today's XP boost.";
    }
    return 'Every hour of focused preparation directly accelerates your FAANG readiness.';
  }

  // Export full JSON backup
  public static exportFullBackup(): string {
    const getOptionalArray = (key: string, fallback: unknown[]) => {
      try {
        const value: unknown = JSON.parse(localStorage.getItem(key) || 'null');
        return Array.isArray(value) ? value : fallback;
      } catch {
        return fallback;
      }
    };
    const data = {
      user: this.getUser(),
      subjects: this.getSubjects(),
      tasks: this.getTasks(),
      dsa: this.getDSAProblems(),
      roadmap: this.getRoadmap(),
      behavioral: this.getBehavioralStories(),
      mock: this.getMockInterviews(),
      // These v2 collections are the active UI data. Keep legacy-key fallbacks so
      // backups created by earlier releases remain portable.
      companies: getOptionalArray('careerforge_companies_target', this.getCompanyApplications()),
      achievements: getOptionalArray('careerforge_achievements_v2', this.getAchievements()),
      weights: this.getWeights(),
      heatmap: this.getHeatmap(),
      sessions: this.getStudySessions(),
      notifications: this.getNotificationSettings(),
      version: '2.0',
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  // Import and validate JSON backup
  public static importFullBackup(jsonString: string): {
    success: boolean;
    error?: string;
    stats?: {
      tasksCount: number;
      dsaCount: number;
      storiesCount: number;
      roadmapMonths: number;
      companiesCount: number;
      score: number;
    };
  } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid file format: JSON root must be an object.' };
      }

      // Check for mandatory fields or valid schema
      if (!parsed.user && !parsed.tasks && !parsed.dsa) {
        return {
          success: false,
          error: 'Unrecognized CareerForge backup file. Missing critical profile or task structures.',
        };
      }

      if (parsed.user) this.saveUser(parsed.user);
      if (Array.isArray(parsed.subjects)) this.saveSubjects(parsed.subjects);
      if (Array.isArray(parsed.tasks)) this.saveTasks(parsed.tasks);
      if (Array.isArray(parsed.dsa)) this.saveDSAProblems(parsed.dsa);
      if (Array.isArray(parsed.roadmap)) this.saveRoadmap(parsed.roadmap);
      if (Array.isArray(parsed.behavioral)) this.saveBehavioralStories(parsed.behavioral);
      if (Array.isArray(parsed.mock)) this.saveMockInterviews(parsed.mock);
      if (Array.isArray(parsed.companies)) {
        this.saveCompanyApplications(parsed.companies);
        localStorage.setItem('careerforge_companies_target', JSON.stringify(parsed.companies));
      }
      if (Array.isArray(parsed.achievements)) {
        this.saveAchievements(parsed.achievements);
        localStorage.setItem('careerforge_achievements_v2', JSON.stringify(parsed.achievements));
      }
      if (parsed.weights) this.saveWeights(parsed.weights);
      if (Array.isArray(parsed.heatmap)) this.saveHeatmap(parsed.heatmap);
      if (Array.isArray(parsed.sessions)) this.saveStudySessions(parsed.sessions);
      if (parsed.notifications) this.saveNotificationSettings(parsed.notifications);

      return {
        success: true,
        stats: {
          tasksCount: Array.isArray(parsed.tasks) ? parsed.tasks.length : 0,
          dsaCount: Array.isArray(parsed.dsa) ? parsed.dsa.length : 0,
          storiesCount: Array.isArray(parsed.behavioral) ? parsed.behavioral.length : 0,
          roadmapMonths: Array.isArray(parsed.roadmap) ? parsed.roadmap.length : 0,
          companiesCount: Array.isArray(parsed.companies) ? parsed.companies.length : 0,
          score: parsed.user?.careerWealthScore || 0,
        },
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to parse JSON file syntax.' };
    }
  }

  // Reset to default factory initial seed
  public static resetToFactoryDefaults() {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.SUBJECTS);
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.DSA);
    localStorage.removeItem(KEYS.ROADMAP);
    localStorage.removeItem(KEYS.BEHAVIORAL);
    localStorage.removeItem(KEYS.MOCK);
    localStorage.removeItem(KEYS.COMPANIES);
    localStorage.removeItem(KEYS.ACHIEVEMENTS);
    localStorage.removeItem(KEYS.WEIGHTS);
    localStorage.removeItem(KEYS.HEATMAP);
    localStorage.removeItem(KEYS.SESSIONS);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    localStorage.removeItem('careerforge_companies_target');
    localStorage.removeItem('careerforge_achievements_v2');
  }
}
