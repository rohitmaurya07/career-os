import React, { useState } from 'react';
import { TaskItem, SubjectId, TaskPriority } from '../types';
import { CheckSquare, Plus, Clock, Filter, Check, Trash2, Zap, Sparkles, X, AlertCircle } from 'lucide-react';
import { soundService } from '../services/audio';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Partial<TaskItem>) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenFocusTimer: (task: TaskItem) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenFocusTimer,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectId>('DSA');
  const [newTopic, setNewTopic] = useState('Core Practice');
  const [newPriority, setNewPriority] = useState<TaskPriority>('High');
  const [newMinutes, setNewMinutes] = useState(45);
  const [newDeadline, setNewDeadline] = useState('Today');
  const [isDailyMission, setIsDailyMission] = useState(true);

  // Filter tasks based on sub-tab and subject filter
  const filteredTasks = tasks.filter((t) => {
    const matchesSubject = selectedSubject === 'All' || t.subjectId === selectedSubject;
    if (!matchesSubject) return false;

    if (activeSubTab === 'today') {
      return (t.deadline === 'Today' || t.isDailyMission) && t.status !== 'completed';
    } else if (activeSubTab === 'upcoming') {
      return t.deadline !== 'Today' && !t.isDailyMission && t.status !== 'completed';
    } else {
      return t.status === 'completed';
    }
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundService.playLevelUp();

    onAddTask({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      subjectId: newSubject,
      topic: newTopic.trim() || 'General',
      priority: newPriority,
      estimatedMinutes: Number(newMinutes) || 45,
      status: 'pending',
      deadline: newDeadline,
      isDailyMission: isDailyMission,
    });

    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const getSubjectColor = (id: SubjectId) => {
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
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="p-4 space-y-3 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-rose-400" />
            Task Center
          </h2>
          <p className="text-xs text-slate-400">Manage daily missions and scheduled milestones</p>
        </div>

        <button
          id="btn-create-task-modal"
          onClick={() => {
            soundService.playTap();
            setShowAddModal(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Create Task
        </button>
      </div>

      {/* Segmented Sub Tabs */}
      <div className="flex bg-[#121622] p-1 rounded-xl border border-white/10 text-xs">
        <button
          id="tasks-tab-today"
          onClick={() => {
            soundService.playTap();
            setActiveSubTab('today');
          }}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'today' ? 'bg-[#5A0E24] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Today ({tasks.filter((t) => (t.deadline === 'Today' || t.isDailyMission) && t.status !== 'completed').length})
        </button>
        <button
          id="tasks-tab-upcoming"
          onClick={() => {
            soundService.playTap();
            setActiveSubTab('upcoming');
          }}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'upcoming' ? 'bg-[#5A0E24] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Upcoming ({tasks.filter((t) => t.deadline !== 'Today' && !t.isDailyMission && t.status !== 'completed').length})
        </button>
        <button
          id="tasks-tab-completed"
          onClick={() => {
            soundService.playTap();
            setActiveSubTab('completed');
          }}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'completed' ? 'bg-[#5A0E24] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Done ({tasks.filter((t) => t.status === 'completed').length})
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {['All', 'DSA', 'MERN', 'System Design', 'LLD', 'Core CS', 'Behavioral', 'Projects'].map((subj) => (
          <button
            key={subj}
            onClick={() => {
              soundService.playTap();
              setSelectedSubject(subj);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-all whitespace-nowrap ${
              selectedSubject === subj
                ? 'bg-rose-950 text-rose-200 border-rose-700'
                : 'bg-[#121622] text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#121622] border border-white/10 rounded-2xl p-8 text-center space-y-2">
            <CheckSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No tasks in this view</p>
            <p className="text-xs text-slate-500">
              {activeSubTab === 'today'
                ? "You're all caught up for today! Enjoy the momentum or plan ahead."
                : 'Create a new task to organize your upcoming roadmap.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
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
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <button
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
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        onClick={() => onToggleTask(task.id)}
                        className={`text-xs font-semibold cursor-pointer ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-100 hover:text-white'
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
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getSubjectColor(task.subjectId)}`}>
                          {task.subjectId}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-mono">
                          <Clock className="w-2.5 h-2.5" /> {task.estimatedMinutes}m
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Due: {task.deadline}
                        </span>
                        {task.priority === 'High' && (
                          <span className="text-[9px] text-amber-400 font-bold">★ High Priority</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!isDone && (
                      <button
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

      {/* Task Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-[#121622] border border-white/10 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3 relative"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Create New Preparation Task</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement LRU Cache in TypeScript"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Description (Optional)</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Key concepts, test cases, or reference links..."
                  rows={2}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectId)}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="DSA">DSA</option>
                    <option value="MERN">MERN</option>
                    <option value="System Design">System Design</option>
                    <option value="LLD">LLD</option>
                    <option value="Core CS">Core CS</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Projects">Projects</option>
                    <option value="Mock Interviews">Mock Interviews</option>
                    <option value="Company Prep">Company Prep</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Estimated Time (Min)</label>
                  <input
                    type="number"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    min="5"
                    max="300"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Deadline</label>
                  <select
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="This Week">This Week</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDailyMission}
                  onChange={(e) => setIsDailyMission(e.target.checked)}
                  className="rounded bg-[#0A0D15] border-white/20 text-rose-600 focus:ring-0"
                />
                <span>Include in Today&apos;s High-Priority Mission (+50 XP)</span>
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
