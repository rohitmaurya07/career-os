import { TaskItem, DSAProblem, UserProfile, ReadinessWeights } from '../types';
import { AppStore } from './storage';

const API_BASE = '/api';

export class BackendApiService {
  public static async checkHealth(): Promise<{ status: string; stack?: string }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API offline or unreachable, using client offline storage:', e);
    }
    return { status: 'offline', stack: 'MERN + Tailwind CSS' };
  }

  // Profile
  public static async getProfile(): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/profile`);
      if (res.ok) {
        const data = await res.json();
        AppStore.saveUser(data);
        return data;
      }
    } catch {
      // Offline fallback
    }
    return AppStore.getUser();
  }

  public static async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    // Optimistic local update
    const current = AppStore.getUser();
    const updated = { ...current, ...profile };
    AppStore.saveUser(updated);

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to sync profile with Express backend, cached locally:', e);
    }
    return updated;
  }

  // Tasks
  public static async getTasks(): Promise<TaskItem[]> {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (res.ok) {
        const tasks = await res.json();
        AppStore.saveTasks(tasks);
        return tasks;
      }
    } catch {
      // Offline fallback
    }
    return AppStore.getTasks();
  }

  public static async createTask(task: Partial<TaskItem>): Promise<TaskItem> {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        const created = await res.json();
        const existing = AppStore.getTasks();
        AppStore.saveTasks([created, ...existing.filter((t) => t.id !== created.id)]);
        return created;
      }
    } catch (e) {
      console.warn('Backend API unreachable for createTask, saving locally:', e);
    }

    const localTask: TaskItem = {
      id: `task_${Date.now()}`,
      subjectId: task.subjectId || 'DSA',
      topic: task.topic || 'General Prep',
      title: task.title || 'New Task',
      estimatedMinutes: task.estimatedMinutes || 45,
      priority: task.priority || 'Medium',
      status: task.status || 'pending',
      deadline: task.deadline || 'Today',
      isDailyMission: task.isDailyMission ?? true,
      description: task.description || '',
      createdAt: new Date().toISOString(),
    };
    const existing = AppStore.getTasks();
    AppStore.saveTasks([localTask, ...existing]);
    return localTask;
  }

  public static async updateTask(id: string, updates: Partial<TaskItem>): Promise<void> {
    const existing = AppStore.getTasks();
    const updated = existing.map((t) => (t.id === id ? { ...t, ...updates } : t));
    AppStore.saveTasks(updated);

    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.warn('Backend API unreachable for updateTask, synced locally:', e);
    }
  }

  public static async deleteTask(id: string): Promise<void> {
    const existing = AppStore.getTasks();
    AppStore.saveTasks(existing.filter((t) => t.id !== id));

    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Backend API unreachable for deleteTask:', e);
    }
  }

  // DSA
  public static async getDSAProblems(): Promise<DSAProblem[]> {
    try {
      const res = await fetch(`${API_BASE}/dsa`);
      if (res.ok) {
        const dsa = await res.json();
        AppStore.saveDSAProblems(dsa);
        return dsa;
      }
    } catch {
      // Fallback
    }
    return AppStore.getDSAProblems();
  }

  public static async updateDSAProblem(id: string, updates: Partial<DSAProblem>): Promise<void> {
    const existing = AppStore.getDSAProblems();
    const updated = existing.map((p) => (p.id === id ? { ...p, ...updates } : p));
    AppStore.saveDSAProblems(updated);

    try {
      await fetch(`${API_BASE}/dsa/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.warn('Backend API unreachable for updateDSAProblem:', e);
    }
  }

  // Weights
  public static async getWeights(): Promise<ReadinessWeights> {
    try {
      const res = await fetch(`${API_BASE}/weights`);
      if (res.ok) {
        const weights = await res.json();
        AppStore.saveWeights(weights);
        return weights;
      }
    } catch {
      // Fallback
    }
    return AppStore.getWeights();
  }

  public static async updateWeights(weights: ReadinessWeights): Promise<void> {
    AppStore.saveWeights(weights);
    try {
      await fetch(`${API_BASE}/weights`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weights),
      });
    } catch (e) {
      console.warn('Backend API unreachable for updateWeights:', e);
    }
  }
}
