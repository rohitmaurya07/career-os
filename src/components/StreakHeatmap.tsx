import React, { useState } from 'react';
import { Flame, Calendar, RefreshCw, Trophy, Shield, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeatmapDay, TaskItem } from '../types';
import { soundService } from '../services/audio';

interface StreakHeatmapProps {
  currentStreak: number;
  longestStreak: number;
  heatmap: HeatmapDay[];
  onApplyRecoveryPlan?: (recoveryTasks: Partial<TaskItem>[]) => void;
}

export const StreakHeatmap: React.FC<StreakHeatmapProps> = ({
  currentStreak,
  longestStreak,
  heatmap,
  onApplyRecoveryPlan,
}) => {
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryApplied, setRecoveryApplied] = useState(false);

  // Take the last 70 days (10 weeks) for clean mobile/tablet grid layout
  const recentDays = heatmap.slice(-70);

  // Calculate stats
  const totalCompletedDays = heatmap.filter((d) => d.count > 0).length;
  const consistencyPercent = Math.round((totalCompletedDays / heatmap.length) * 100);

  const getColorClass = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-rose-950/80 border-rose-900/60';
      case 2:
        return 'bg-rose-800 border-rose-700';
      case 3:
        return 'bg-rose-600 border-rose-500 shadow-[0_0_6px_rgba(225,29,72,0.4)]';
      case 4:
        return 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]';
      case 0:
      default:
        return 'bg-[#181C26] border-white/5';
    }
  };

  const handleApplyRecovery = () => {
    soundService.playLevelUp();
    const recoveryTasks: Partial<TaskItem>[] = [
      {
        title: 'Recovery: Solve 2 Core DSA Problems',
        subjectId: 'DSA',
        topic: 'Recovery Sprint',
        estimatedMinutes: 60,
        priority: 'High',
        status: 'pending',
        deadline: 'Today',
        isDailyMission: true,
      },
      {
        title: 'Recovery: 45 min Core CS Revision',
        subjectId: 'Core CS',
        topic: 'Recovery Sprint',
        estimatedMinutes: 45,
        priority: 'Medium',
        status: 'pending',
        deadline: 'Today',
        isDailyMission: true,
      },
      {
        title: 'Recovery: 60 min Focused Project Work',
        subjectId: 'Projects',
        topic: 'Recovery Sprint',
        estimatedMinutes: 60,
        priority: 'Medium',
        status: 'pending',
        deadline: 'Today',
        isDailyMission: true,
      },
    ];

    onApplyRecoveryPlan?.(recoveryTasks);
    setRecoveryApplied(true);
    setTimeout(() => {
      setShowRecoveryModal(false);
      setRecoveryApplied(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-[#131622] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Streak Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-900/40">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-white font-mono tracking-tight">
                {currentStreak} Day Streak
              </span>
              <span className="text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800/40 px-1.5 py-0.2 rounded font-semibold">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Longest: <span className="text-amber-300 font-mono font-bold">{longestStreak} days</span> • Consistency: {consistencyPercent}%
            </p>
          </div>
        </div>

        {/* Recovery Mode Trigger Button */}
        <button
          id="btn-recovery-mode"
          onClick={() => {
            soundService.playTap();
            setShowRecoveryModal(true);
          }}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-[#5A0E24] text-slate-300 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3 h-3 text-rose-400" />
          <span className="text-[11px]">Recovery</span>
        </button>
      </div>

      {/* GitHub-Style 70-Day Heatmap Matrix */}
      <div className="bg-[#090C13] p-3 rounded-xl border border-white/5 mb-2.5">
        <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2 font-mono uppercase">
          <span>10 Weeks Activity Matrix</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-[#181C26] border border-white/5"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-950 border border-rose-900/60"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-800 border border-rose-700"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-600 border border-rose-500"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-amber-400 border border-amber-300"></div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid (7 rows for days of week, 10 columns for weeks) */}
        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1 justify-between">
          {recentDays.map((day, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-sm border transition-transform hover:scale-125 cursor-pointer ${getColorClass(
                day.level
              )}`}
              title={`${day.date}: ${day.count} tasks completed (${day.studyMinutes}m focus)`}
            />
          ))}
        </div>
      </div>

      {/* Motivational Consistency Guarantee */}
      <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
        Missing one day never erases your accumulated career equity.
      </p>

      {/* Recovery Mode Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-rose-900/50 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3 relative">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#5A0E24] flex items-center justify-center text-white">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Gentle Recovery Mode</h4>
                <p className="text-[11px] text-slate-400">Zero shame. Stacking days starts today.</p>
              </div>
            </div>

            <div className="bg-[#0A0D15] p-3 rounded-xl border border-white/5 space-y-1.5 text-xs">
              <p className="text-slate-300 font-medium">
                You never need to restart from scratch. Here is your structured recovery sprint for today:
              </p>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li className="flex items-center gap-1.5 text-rose-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> 2 Core DSA Problems (60 min)
                </li>
                <li className="flex items-center gap-1.5 text-rose-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> 45 min Core CS Revision
                </li>
                <li className="flex items-center gap-1.5 text-rose-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> 60 min Portfolio Project Sprint
                </li>
              </ul>
            </div>

            {recoveryApplied ? (
              <div className="bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs py-2 rounded-xl text-center font-bold">
                ✓ Recovery tasks added to Today&apos;s Mission!
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                >
                  Close
                </button>
                <button
                  id="btn-confirm-apply-recovery"
                  type="button"
                  onClick={handleApplyRecovery}
                  className="flex-1 py-2 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Apply Recovery
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
