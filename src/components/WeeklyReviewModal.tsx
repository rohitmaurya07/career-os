import React from 'react';
import { X, Calendar, Sparkles, CheckCircle2, TrendingUp, Binary, Clock, ShieldCheck } from 'lucide-react';
import { HeatmapDay, DSAProblem, TaskItem } from '../types';
import { soundService } from '../services/audio';

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  heatmap: HeatmapDay[];
  dsaProblems: DSAProblem[];
  tasks: TaskItem[];
  currentStreak: number;
}

export const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({
  isOpen,
  onClose,
  heatmap,
  dsaProblems,
  tasks,
  currentStreak,
}) => {
  if (!isOpen) return null;

  const past7Days = heatmap.slice(-7);
  const weeklyStudyMinutes = past7Days.reduce((acc, d) => acc + d.studyMinutes, 0);
  const weeklyHours = Math.round((weeklyStudyMinutes / 60) * 10) / 10;
  const weeklyTasksDone = past7Days.reduce((acc, d) => acc + d.count, 0);
  const solvedDsaCount = dsaProblems.filter((p) => p.status === 'Solved').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-white/10 rounded-3xl p-5 max-w-md w-full shadow-2xl max-h-[90vh] flex flex-col relative space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5A0E24] flex items-center justify-center text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Sunday Weekly Retrospective</h3>
              <p className="text-xs text-slate-400">Weekly Compound Career Wealth Audit</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0A0D15] p-3 rounded-2xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Deep Focus Time</span>
              <p className="text-lg font-black font-mono text-white">{weeklyHours} Hours</p>
              <p className="text-[10px] text-emerald-400 font-medium">Consistent daily flow</p>
            </div>

            <div className="bg-[#0A0D15] p-3 rounded-2xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tasks Delivered</span>
              <p className="text-lg font-black font-mono text-rose-300">{weeklyTasksDone} Completed</p>
              <p className="text-[10px] text-slate-400 font-mono">{currentStreak} day streak maintained</p>
            </div>
          </div>

          {/* Highlights & Victories */}
          <div className="bg-[#181D29] p-3.5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Weekly Victories
            </div>
            <ul className="space-y-1 text-slate-200 text-xs">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> Total cumulative DSA solved: {solvedDsaCount} problems.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> Mastered Distributed Systems caching & Low-Level Design patterns.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span> Zero zero-days — all scheduled milestones progressed steadily.
              </li>
            </ul>
          </div>

          {/* Next Week's Strategic Vector */}
          <div className="bg-[#5A0E24]/20 p-3.5 rounded-2xl border border-rose-900/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-rose-300 font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              Next Week&apos;s Focus Sprint
            </div>
            <p className="text-rose-100 leading-relaxed text-xs">
              Increase mock interview cadence. Conduct 2 timed 45-minute algorithmic sessions and 1 full System Design whiteboard simulation.
            </p>
          </div>

          {/* Non-toxic Motivational Philosophy Quote */}
          <div className="bg-[#090C13] p-3 rounded-xl border border-white/5 text-center text-slate-300 text-xs italic">
            “Every day of consistent preparation increases my chances of getting the career I want.”
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
        >
          Confirm & Carry Momentum Forward
        </button>
      </div>
    </div>
  );
};
