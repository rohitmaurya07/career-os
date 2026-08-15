import React, { useMemo, useState } from 'react';
import {
  TaskItem,
  SubjectId,
  TaskPriority,
} from '../types';

import {
  CheckSquare,
  Plus,
  Clock,
  Check,
  Trash2,
  Zap,
  X,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { soundService } from '../services/audio';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Partial<TaskItem>) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenFocusTimer: (task: TaskItem) => void;
}

/**
 * Subjects supported by the FAANG roadmap.
 *
 * IMPORTANT:
 * If your SubjectId type does not contain these values,
 * update SubjectId in ../types accordingly.
 */
const SUBJECTS = [
  'DSA',
  'MERN',
  'System Design',
  'LLD',
  'Core CS',
  'Behavioral',
  'Projects',
  'Mock Interviews',
  'Company Prep',
] as const;

type TaskSubject = (typeof SUBJECTS)[number];

/**
 * Convert Date -> YYYY-MM-DD
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const startOfWeek = (date: Date): Date => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = result.getDay();
  result.setDate(result.getDate() - (weekday === 0 ? 6 : weekday - 1));
  return result;
};

const isWithinRange = (date: Date | null, start: Date, end: Date): boolean => {
  if (!date) return false;
  const value = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return value >= start.getTime() && value <= end.getTime();
};

/**
 * Get today's date.
 */
const getToday = (): string => {
  return formatDate(new Date());
};

/**
 * Get tomorrow's date.
 */
const getTomorrow = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return formatDate(date);
};

/**
 * Convert task deadline into a comparable date.
 *
 * Supports:
 * - Today
 * - Tomorrow
 * - This Week
 * - YYYY-MM-DD
 */
const getDeadlineDate = (deadline?: string): Date | null => {
  if (!deadline) return null;

  if (deadline === 'Today') {
    return new Date(`${getToday()}T23:59:59`);
  }

  if (deadline === 'Tomorrow') {
    return new Date(`${getTomorrow()}T23:59:59`);
  }

  if (deadline === 'This Week') {
    const date = new Date();
    const day = date.getDay();

    const diff = day === 0 ? 0 : 7 - day;

    date.setDate(date.getDate() + diff);
    date.setHours(23, 59, 59, 999);

    return date;
  }

  /**
   * Handles generated roadmap deadlines:
   * 2026-08-15
   */
  const parsed = new Date(`${deadline}T23:59:59`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Human-readable deadline.
 */
const formatDeadline = (deadline?: string): string => {
  if (!deadline) return 'No deadline';

  const today = getToday();
  const tomorrow = getTomorrow();

  if (deadline === today) return 'Today';
  if (deadline === tomorrow) return 'Tomorrow';

  if (deadline === 'Today' || deadline === 'Tomorrow') {
    return deadline;
  }

  if (deadline === 'This Week') {
    return 'This Week';
  }

  /**
   * Convert YYYY-MM-DD -> readable date.
   */
  const parsed = new Date(`${deadline}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return deadline;
  }

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Check whether a task is actually due today.
 */
const isDueToday = (task: TaskItem): boolean => {
  if (task.status === 'completed') return false;

  if (task.deadline === 'Today') {
    return true;
  }

  return task.deadline === getToday();
};

/**
 * Check whether a task is upcoming.
 */
const isUpcoming = (task: TaskItem): boolean => {
  if (task.status === 'completed') return false;

  if (task.deadline === 'Tomorrow' || task.deadline === 'This Week') {
    return true;
  }

  const deadline = getDeadlineDate(task.deadline);

  if (!deadline) return false;

  const today = new Date(`${getToday()}T00:00:00`);

  return deadline > today;
};

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenFocusTimer,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'today' | 'upcoming' | 'week' | 'month' | 'completed'
  >('today');
  const [periodOffset, setPeriodOffset] = useState(0);

  const [selectedSubject, setSelectedSubject] = useState<
    'All' | TaskSubject
  >('All');

  const [showAddModal, setShowAddModal] = useState(false);

  // -----------------------------
  // New Task Form
  // -----------------------------

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [newSubject, setNewSubject] = useState<TaskSubject>('DSA');

  const [newTopic, setNewTopic] = useState('Core Practice');

  const [newPriority, setNewPriority] =
    useState<TaskPriority>('High');

  const [newMinutes, setNewMinutes] = useState(45);

  const [newDeadline, setNewDeadline] = useState('Today');

  const [isDailyMission, setIsDailyMission] = useState(true);

  // -----------------------------
  // Filter Tasks
  // -----------------------------

  const scheduleRange = useMemo(() => {
    const today = new Date();
    if (activeSubTab === 'week') {
      const start = startOfWeek(today);
      start.setDate(start.getDate() + periodOffset * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return { start, end, label: `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` };
    }
    if (activeSubTab === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth() + periodOffset, 1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      return { start, end, label: start.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) };
    }
    return null;
  }, [activeSubTab, periodOffset]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSubject =
        selectedSubject === 'All' ||
        task.subjectId === selectedSubject;

      if (!matchesSubject) {
        return false;
      }

      if (activeSubTab === 'today') {
        return isDueToday(task);
      }

      if (activeSubTab === 'upcoming') {
        return isUpcoming(task);
      }

      if (scheduleRange) {
        return isWithinRange(getDeadlineDate(task.deadline), scheduleRange.start, scheduleRange.end);
      }

      return task.status === 'completed';
    });
  }, [tasks, selectedSubject, activeSubTab, scheduleRange]);

  // -----------------------------
  // Counts
  // -----------------------------

  const todayCount = useMemo(() => {
    return tasks.filter(isDueToday).length;
  }, [tasks]);

  const upcomingCount = useMemo(() => {
    return tasks.filter(isUpcoming).length;
  }, [tasks]);

  const completedCount = useMemo(() => {
    return tasks.filter(
      (task) => task.status === 'completed'
    ).length;
  }, [tasks]);

  const setView = (view: typeof activeSubTab) => {
    soundService.playTap();
    setActiveSubTab(view);
    if (view === 'week' || view === 'month') setPeriodOffset(0);
  };

  // -----------------------------
  // Create Task
  // -----------------------------

  const handleCreateSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      return;
    }

    soundService.playLevelUp();

    onAddTask({
      title,

      description:
        newDescription.trim() || undefined,

      subjectId: newSubject as SubjectId,

      topic:
        newTopic.trim() || 'General',

      priority: newPriority,

      estimatedMinutes:
        Math.max(5, Number(newMinutes) || 45),

      status: 'pending',

      deadline: newDeadline,

      isDailyMission,
    });

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewSubject('DSA');
    setNewTopic('Core Practice');
    setNewPriority('High');
    setNewMinutes(45);
    setNewDeadline('Today');
    setIsDailyMission(true);

    setShowAddModal(false);
  };

  // -----------------------------
  // Subject Colors
  // -----------------------------

  const getSubjectColor = (
    id: SubjectId
  ): string => {
    switch (id) {
      case 'DSA':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/40';

      case 'MERN':
        return 'text-teal-400 bg-teal-950/60 border-teal-800/40';

      case 'System Design':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/40';

      case 'LLD':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';

      case 'Core CS':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/40';

      case 'Behavioral':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';

      case 'Projects':
        return 'text-pink-400 bg-pink-950/60 border-pink-800/40';

      case 'Mock Interviews':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40';

      case 'Company Prep':
        return 'text-orange-400 bg-orange-950/60 border-orange-800/40';

      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <div className="p-4 space-y-3 pb-24">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-rose-400" />

            Task Center
          </h2>

          <p className="text-xs text-slate-400">
            Execute your FAANG preparation one task at a time.
          </p>
        </div>

        <button
          id="btn-create-task-modal"
          onClick={() => {
            soundService.playTap();
            setShowAddModal(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />

          Create Task
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 bg-[#121622] p-1 rounded-xl border border-white/10 text-xs">

        <button
          onClick={() => {
            setView('today');
          }}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'today'
              ? 'bg-[#5A0E24] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Today ({todayCount})
        </button>

        <button
          onClick={() => {
            setView('upcoming');
          }}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'upcoming'
              ? 'bg-[#5A0E24] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Upcoming ({upcomingCount})
        </button>

        <button
          onClick={() => setView('week')}
          className={`py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'week' ? 'bg-[#5A0E24] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          This Week
        </button>

        <button
          onClick={() => setView('month')}
          className={`py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'month' ? 'bg-[#5A0E24] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          By Month
        </button>

        <button
          onClick={() => {
            setView('completed');
          }}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'completed'
              ? 'bg-[#5A0E24] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Done ({completedCount})
        </button>
      </div>

      {scheduleRange && (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0E1119] px-2 py-1.5 text-xs">
          <button
            type="button"
            aria-label={`Previous ${activeSubTab}`}
            onClick={() => { soundService.playTap(); setPeriodOffset((offset) => offset - 1); }}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="flex items-center gap-1.5 font-semibold text-slate-200">
            <CalendarDays className="h-3.5 w-3.5 text-rose-400" /> {scheduleRange.label}
          </span>
          <button
            type="button"
            aria-label={`Next ${activeSubTab}`}
            onClick={() => { soundService.playTap(); setPeriodOffset((offset) => offset + 1); }}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Subject Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {['All', ...SUBJECTS].map((subject) => (
          <button
            key={subject}
            onClick={() => {
              soundService.playTap();

              setSelectedSubject(
                subject as 'All' | TaskSubject
              );
            }}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-all whitespace-nowrap ${
              selectedSubject === subject
                ? 'bg-rose-950 text-rose-200 border-rose-700'
                : 'bg-[#121622] text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">

        {filteredTasks.length === 0 ? (
          <div className="bg-[#121622] border border-white/10 rounded-2xl p-8 text-center space-y-2">

            <CheckSquare className="w-8 h-8 text-slate-600 mx-auto" />

            <p className="text-sm font-semibold text-slate-300">
              No tasks in this view
            </p>

            <p className="text-xs text-slate-500">
              {activeSubTab === 'today'
                ? "You're all caught up for today. Nice. Don't confuse that with being done forever."
                : activeSubTab === 'upcoming'
                  ? 'No upcoming tasks match the current filter.'
                  : activeSubTab === 'completed'
                    ? 'Completed tasks will appear here.'
                    : `No tasks are scheduled for this ${activeSubTab}.`}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone =
              task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`p-3 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-[#0E1119] border-white/5 opacity-75'
                    : 'bg-[#131622] border-white/10 hover:border-slate-700 shadow-sm'
                }`}
              >

                <div className="flex items-start justify-between gap-2">

                  {/* Left */}
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">

                    <button
                      type="button"
                      aria-label={
                        isDone
                          ? 'Mark task incomplete'
                          : 'Mark task complete'
                      }
                      onClick={() => {
                        soundService.playTaskPop();
                        onToggleTask(task.id);
                      }}
                      className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                        isDone
                          ? 'bg-rose-700 border-rose-600 text-white'
                          : 'bg-[#0A0D15] border-slate-600 hover:border-rose-400'
                      }`}
                    >
                      {isDone && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">

                      <p
                        onClick={() =>
                          onToggleTask(task.id)
                        }
                        className={`text-xs font-semibold cursor-pointer ${
                          isDone
                            ? 'line-through text-slate-500'
                            : 'text-slate-100 hover:text-white'
                        }`}
                      >
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">

                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getSubjectColor(
                            task.subjectId
                          )}`}
                        >
                          {task.subjectId}
                        </span>

                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-mono">
                          <Clock className="w-2.5 h-2.5" />

                          {task.estimatedMinutes}m
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">
                          Due:{' '}
                          {formatDeadline(
                            task.deadline
                          )}
                        </span>

                        {task.priority === 'High' && (
                          <span className="text-[9px] text-amber-400 font-bold">
                            ★ High Priority
                          </span>
                        )}

                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">

                    {!isDone && (
                      <button
                        type="button"
                        onClick={() => {
                          soundService.playTap();
                          onOpenFocusTimer(task);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#5A0E24] text-amber-400 hover:text-white transition-colors"
                        title="Start timer for this task"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        soundService.playTap();
                        onDeleteTask(task.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Task Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >

          <form
            onSubmit={handleCreateSubmit}
            className="bg-[#121622] border border-white/10 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3 relative"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-bold text-white text-sm">
                Create New Preparation Task
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowAddModal(false)
                }
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="space-y-2">

              {/* Title */}
              <div>
                <label className="text-[11px] text-slate-400 font-medium">
                  Task Title
                </label>

                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) =>
                    setNewTitle(e.target.value)
                  }
                  placeholder="e.g. Implement LRU Cache in TypeScript"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] text-slate-400 font-medium">
                  Description
                </label>

                <textarea
                  value={newDescription}
                  onChange={(e) =>
                    setNewDescription(e.target.value)
                  }
                  placeholder="Key concepts, test cases, or reference links..."
                  rows={2}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Subject + Priority */}
              <div className="grid grid-cols-2 gap-2">

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">
                    Subject
                  </label>

                  <select
                    value={newSubject}
                    onChange={(e) =>
                      setNewSubject(
                        e.target.value as TaskSubject
                      )
                    }
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                  >
                    {SUBJECTS.map((subject) => (
                      <option
                        key={subject}
                        value={subject}
                      >
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">
                    Priority
                  </label>

                  <select
                    value={newPriority}
                    onChange={(e) =>
                      setNewPriority(
                        e.target.value as TaskPriority
                      )
                    }
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="High">
                      High
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Low">
                      Low
                    </option>
                  </select>
                </div>

              </div>

              {/* Time + Deadline */}
              <div className="grid grid-cols-2 gap-2">

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">
                    Estimated Time
                  </label>

                  <input
                    type="number"
                    value={newMinutes}
                    onChange={(e) =>
                      setNewMinutes(
                        Number(e.target.value)
                      )
                    }
                    min={5}
                    max={300}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">
                    Deadline
                  </label>

                  <select
                    value={newDeadline}
                    onChange={(e) =>
                      setNewDeadline(
                        e.target.value
                      )
                    }
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Today">
                      Today
                    </option>

                    <option value="Tomorrow">
                      Tomorrow
                    </option>

                    <option value="This Week">
                      This Week
                    </option>
                  </select>
                </div>

              </div>

              {/* Daily Mission */}
              <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">

                <input
                  type="checkbox"
                  checked={isDailyMission}
                  onChange={(e) =>
                    setIsDailyMission(
                      e.target.checked
                    )
                  }
                  className="rounded bg-[#0A0D15] border-white/20 text-rose-600 focus:ring-0"
                />

                <span>
                  Include in Today&apos;s Mission
                  (+50 XP)
                </span>

              </label>

            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Add Task
            </button>

          </form>
        </div>
      )}

    </div>
  );
};
