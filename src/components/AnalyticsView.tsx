import React from 'react';
import { SubjectInfo, HeatmapDay, DSAProblem } from '../types';
import { BarChart3, TrendingUp, AlertTriangle, Sparkles, CheckCircle2, PieChart, Clock, ShieldCheck } from 'lucide-react';
import { soundService } from '../services/audio';

interface AnalyticsViewProps {
  score: number;
  subjects: SubjectInfo[];
  heatmap: HeatmapDay[];
  dsaProblems: DSAProblem[];
  totalStudyMinutes: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  score,
  subjects,
  heatmap,
  dsaProblems,
  totalStudyMinutes,
}) => {
  // Identify weakest subject
  const sortedByProgress = [...subjects].sort((a, b) => a.progressPercent - b.progressPercent);
  const weakestSubject = sortedByProgress[0];
  const strongestSubject = sortedByProgress[sortedByProgress.length - 1];

  // Hours
  const totalHours = Math.round((totalStudyMinutes / 60) * 10) / 10;

  // 7-day study time trend
  const last7Days = heatmap.slice(-7);
  const maxMins = Math.max(1, ...last7Days.map((d) => d.studyMinutes));

  return (
    <div className="p-4 space-y-3 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-rose-400" />
            Readiness Diagnostics
          </h2>
          <p className="text-xs text-slate-400">FAANG Weighted Formula & Performance Analytics</p>
        </div>
      </div>

      {/* Main Composite Score Hero Card */}
      <div className="bg-gradient-to-b from-[#181D29] to-[#12151E] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
              FAANG Composite Index
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black font-mono text-white">{score}</span>
              <span className="text-xs text-slate-400 font-mono">/ 100 PTS</span>
            </div>
          </div>

          <div className="bg-[#0A0D15] px-3 py-2 rounded-xl border border-white/5 text-right font-mono">
            <span className="text-sm font-bold text-amber-400">{totalHours}h</span>
            <p className="text-[10px] text-slate-500">Total Deep Focus</p>
          </div>
        </div>

        {/* Weighted Formula Breakdown Bars */}
        <div className="space-y-2 pt-1 border-t border-white/5">
          <p className="text-[11px] text-slate-400 font-semibold">Weighted Competency Composition</p>
          {subjects.map((subj) => {
            const contribution = Math.round((subj.progressPercent * subj.targetWeight) / 100);
            return (
              <div key={subj.id} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium font-sans flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subj.color }} />
                    {subj.name} ({subj.targetWeight}% weight)
                  </span>
                  <span className="text-slate-400">
                    <strong className="text-white">{subj.progressPercent}%</strong> → +{contribution} pts
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${subj.progressPercent}%`,
                      backgroundColor: subj.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Study Focus Volume Histogram */}
      <div className="bg-[#121622] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            7-Day Focus Time Volume
          </span>
          <span className="font-mono text-slate-400 text-[11px]">Minutes per Day</span>
        </div>

        <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2 bg-[#090C13] rounded-xl border border-white/5">
          {last7Days.map((d, i) => {
            const heightPct = Math.round((d.studyMinutes / (maxMins || 1)) * 100);
            const dayLabel = new Date(d.date).toLocaleDateString([], { weekday: 'narrow' });
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <span className="text-[9px] font-mono text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.studyMinutes}m
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#5A0E24] to-rose-500 transition-all duration-300 group-hover:brightness-125"
                  style={{ height: `${Math.max(8, heightPct)}%` }}
                />
                <span className="text-[10px] font-mono text-slate-400 mt-1">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakest Area & Targeted Prescription */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#18141F] border border-purple-900/40 p-3.5 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-purple-300 font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
            Priority Focus Vector
          </div>
          <h4 className="text-sm font-bold text-white">{weakestSubject.name}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Currently at <strong className="text-rose-400 font-mono">{weakestSubject.progressPercent}%</strong>. Dedicating 45 minutes daily to {weakestSubject.name} will increase your overall Career Wealth by +3.5 pts this week.
          </p>
        </div>

        <div className="bg-[#101824] border border-blue-900/40 p-3.5 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-blue-300 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Anchor Strength
          </div>
          <h4 className="text-sm font-bold text-white">{strongestSubject.name}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Leading at <strong className="text-emerald-400 font-mono">{strongestSubject.progressPercent}%</strong>. Ready for high-velocity mock interviews and senior-level design trade-offs.
          </p>
        </div>
      </div>
    </div>
  );
};
