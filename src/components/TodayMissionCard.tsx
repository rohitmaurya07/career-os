import React, { useState } from 'react';
import { Check, Plus, Clock, Zap, Target, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskItem, SubjectId } from '../types';
import { soundService } from '../services/audio';

interface TodayMissionCardProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Partial<TaskItem>) => void;
  onOpenFocusTimer: (task?: TaskItem) => void;
}

export const TodayMissionCard: React.FC<TodayMissionCardProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onOpenFocusTimer,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectId>('DSA');
  const [newMinutes, setNewMinutes] = useState(45);

  const dailyTasks = tasks.filter((t) => t.isDailyMission || t.deadline === 'Today');
  const completedCount = dailyTasks.filter((t) => t.status === 'completed').length;
  const totalCount = dailyTasks.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  // Calculate estimated total time for daily missions
  const totalMinutes = dailyTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 45), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const durationString = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;

  const handleToggle = (taskId: string, currentStatus: string) => {
    soundService.playTaskPop();
    onToggleTask(taskId);

    // If this completes the last task, trigger celebratory sound and confetti!
    if (currentStatus !== 'completed' && completedCount + 1 === totalCount) {
      soundService.playLevelUp();
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#5A0E24', '#E11D48', '#F59E0B', '#38BDF8'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundService.playTap();
    onAddTask({
      title: newTitle.trim(),
      subjectId: newSubject,
      topic: 'Daily Mission',
      estimatedMinutes: Number(newMinutes) || 45,
      priority: 'High',
      status: 'pending',
      deadline: 'Today',
      isDailyMission: true,
    });
    setNewTitle('');
    setShowAddForm(false);
  };

  const getSubjectBadgeColor = (subjectId: SubjectId) => {
    switch (subjectId) {
      case 'DSA':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/40';
      case 'MERN':
        return 'bg-teal-950/60 text-teal-300 border-teal-800/40';
      case 'System Design':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
      case 'LLD':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
      case 'Core CS':
        return 'bg-indigo-950/60 text-indigo-300 border-indigo-800/40';
      case 'Behavioral':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-full bg-[#131622] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5A0E24] flex items-center justify-center text-white">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
              Today&apos;s Mission
              {allCompleted && (
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-1.5 py-0.2 rounded-full font-semibold">
                  Complete!
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">
              Est: <span className="text-slate-200 font-mono font-medium">{durationString}</span> • +50 XP each
            </p>
          </div>
        </div>

        {/* Completed counter pill */}
        <div className="flex items-center gap-2">
          <div className="bg-[#090C13] px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 text-xs font-mono">
            <span className="font-bold text-rose-300">{completedCount}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">{totalCount}</span>
          </div>

          <button
            id="btn-add-mission-toggle"
            onClick={() => {
              soundService.playTap();
              setShowAddForm(!showAddForm);
            }}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-[#5A0E24] text-slate-300 hover:text-white transition-colors flex items-center justify-center border border-white/5"
            title="Add custom mission"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Mission Inline Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateSubmit} className="mb-3 bg-[#0A0D15] p-3 rounded-xl border border-rose-900/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300">New Mission Task</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Solve 3 Medium Binary Tree problems"
            className="w-full px-3 py-1.5 rounded-lg bg-[#141824] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value as SubjectId)}
              className="px-2 py-1.5 rounded-lg bg-[#141824] border border-white/10 text-xs text-slate-200 focus:outline-none"
            >
              <option value="DSA">DSA</option>
              <option value="MERN">MERN</option>
              <option value="System Design">System Design</option>
              <option value="LLD">LLD</option>
              <option value="Core CS">Core CS</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Projects">Projects</option>
            </select>
            <input
              type="number"
              value={newMinutes}
              onChange={(e) => setNewMinutes(Number(e.target.value))}
              placeholder="Est Minutes"
              min="10"
              max="240"
              className="px-2 py-1.5 rounded-lg bg-[#141824] border border-white/10 text-xs text-slate-200 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 rounded-lg bg-[#5A0E24] hover:bg-rose-800 text-white font-medium text-xs shadow-md transition-all"
          >
            Add to Today&apos;s Mission
          </button>
        </form>
      )}

      {/* Mission Items List */}
      <div className="space-y-2">
        {dailyTasks.map((task) => {
          const isDone = task.status === 'completed';
          return (
            <div
              key={task.id}
              className={`group flex items-start justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                isDone
                  ? 'bg-[#0E1119]/80 border-white/5 opacity-75'
                  : 'bg-[#181D29] border-white/10 hover:border-rose-700/50 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                {/* Custom animated checkbox */}
                <button
                  id={`task-check-${task.id}`}
                  onClick={() => handleToggle(task.id, task.status)}
                  className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all duration-150 flex-shrink-0 cursor-pointer ${
                    isDone
                      ? 'bg-rose-700 border-rose-600 text-white shadow-sm'
                      : 'bg-[#0D1017] border-slate-600 hover:border-rose-400'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Task Title & Details */}
                <div className="flex-1 min-w-0">
                  <p
                    onClick={() => handleToggle(task.id, task.status)}
                    className={`text-xs font-medium cursor-pointer transition-all ${
                      isDone ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-white'
                    }`}
                  >
                    {task.title}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getSubjectBadgeColor(task.subjectId)}`}>
                      {task.subjectId}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {task.estimatedMinutes}m
                    </span>
                    {task.priority === 'High' && (
                      <span className="text-[9px] text-amber-400 font-bold">★ High</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action button: Launch study timer for this task */}
              <button
                id={`btn-focus-task-${task.id}`}
                onClick={() => {
                  soundService.playTap();
                  onOpenFocusTimer(task);
                }}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-[#5A0E24] text-slate-400 hover:text-white transition-colors flex-shrink-0"
                title="Start Focus Timer for this task"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Encouraging completion banner if all done */}
      {allCompleted && (
        <div className="mt-3 bg-gradient-to-r from-[#5A0E24]/30 to-emerald-950/40 border border-rose-600/30 rounded-xl p-2.5 text-center">
          <p className="text-xs font-bold text-rose-200 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> All daily missions conquered!
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Your Career Wealth has compounded for today.</p>
        </div>
      )}
    </div>
  );
};
