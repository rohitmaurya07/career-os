import React, { useState } from 'react';
import { UserProfile, ReadinessWeights, SubjectInfo } from '../types';
import { Sparkles, X, Target, Briefcase, Calendar, Clock, Sliders, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';
import { soundService } from '../services/audio';

interface SmartPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  weights: ReadinessWeights;
  subjects: SubjectInfo[];
  onSavePlan: (updatedUser: Partial<UserProfile>, updatedWeights: ReadinessWeights) => void;
}

export const SmartPlanModal: React.FC<SmartPlanModalProps> = ({
  isOpen,
  onClose,
  user,
  weights,
  subjects,
  onSavePlan,
}) => {
  if (!isOpen) return null;

  const [role, setRole] = useState(user.targetRole);
  const [companyType, setCompanyType] = useState(user.targetCompanyType);
  const [interviewMonth, setInterviewMonth] = useState(user.targetInterviewMonth);
  const [dailyHours, setDailyHours] = useState(user.dailyStudyTargetHours);
  const [localWeights, setLocalWeights] = useState<ReadinessWeights>({ ...weights });
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);

  const roles = ['SDE-1', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'General SWE'] as const;
  const tiers = ['FAANG', 'MNC', 'Product-Based Company', 'Startup'] as const;

  const handleApplyPreset = (tier: string) => {
    soundService.playTick();
    setAppliedPreset(tier);
    if (tier === 'FAANG') {
      setLocalWeights({
        DSA: 35,
        CoreCS: 20,
        Projects: 10,
        MERN: 10,
        LLD: 10,
        SystemDesign: 5,
        Behavioral: 10,
      });
      setDailyHours(4);
    } else if (tier === 'MNC') {
      setLocalWeights({
        DSA: 25,
        CoreCS: 25,
        Projects: 15,
        MERN: 15,
        LLD: 10,
        SystemDesign: 0,
        Behavioral: 10,
      });
      setDailyHours(3);
    } else if (tier === 'Product-Based Company') {
      setLocalWeights({
        DSA: 30,
        CoreCS: 15,
        Projects: 20,
        MERN: 15,
        LLD: 10,
        SystemDesign: 5,
        Behavioral: 5,
      });
      setDailyHours(3.5);
    } else {
      // Startup
      setLocalWeights({
        DSA: 20,
        CoreCS: 10,
        Projects: 35,
        MERN: 25,
        LLD: 5,
        SystemDesign: 0,
        Behavioral: 5,
      });
      setDailyHours(3);
    }
  };

  const handleSave = () => {
    setIsGenerating(true);
    soundService.playLevelUp();
    setTimeout(() => {
      onSavePlan(
        {
          targetRole: role,
          targetCompanyType: companyType,
          targetInterviewMonth: interviewMonth,
          dailyStudyTargetHours: dailyHours,
        },
        localWeights
      );
      setIsGenerating(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-white/10 rounded-3xl p-5 max-w-md w-full shadow-2xl max-h-[90vh] flex flex-col relative space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5A0E24] flex items-center justify-center text-rose-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Smart Strategy & Target Engine</h3>
              <p className="text-xs text-slate-400">Re-calibrate your FAANG trajectory & weighted index</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1 text-xs">
          {/* Target Role & Tier */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-rose-400" />
              Target Engineering Role
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    soundService.playTick();
                    setRole(r);
                  }}
                  className={`px-3 py-2 rounded-xl text-left font-medium transition-all ${
                    role === r
                      ? 'bg-[#5A0E24] border border-rose-500 text-white shadow-sm'
                      : 'bg-[#181D29] border border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Company Target Tiers Preset */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                Target Company Caliber (Auto-Weight Presets)
              </label>
              {appliedPreset && (
                <span className="text-[10px] text-emerald-400 font-mono">Preset loaded!</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {tiers.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setCompanyType(t);
                    handleApplyPreset(t);
                  }}
                  className={`p-2.5 rounded-xl text-left transition-all ${
                    companyType === t
                      ? 'bg-gradient-to-r from-[#5A0E24] to-[#1E2536] border border-rose-500 text-white'
                      : 'bg-[#181D29] border border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="font-bold text-white text-xs">{t}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {t === 'FAANG'
                      ? 'High DSA (35%) & Hard Core CS'
                      : t === 'Startup'
                      ? 'Heavy Full-Stack & Projects'
                      : 'Balanced Core CS & Problem Solving'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Target Month & Daily Target */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Interview Target
              </label>
              <input
                type="text"
                value={interviewMonth}
                onChange={(e) => setInterviewMonth(e.target.value)}
                placeholder="e.g. February 2027"
                className="w-full bg-[#181D29] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Daily Focus Hours
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                  className="flex-1 accent-rose-500"
                />
                <span className="font-mono font-bold text-white text-sm w-10 text-right">{dailyHours}h</span>
              </div>
            </div>
          </div>

          {/* Weighted Readiness Breakdown Adjustment */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Readiness Formula Weights (%)
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                Sum: {(Object.values(localWeights) as number[]).reduce((a: number, b: number) => a + b, 0)}%
              </span>
            </div>

            <div className="space-y-2 bg-[#090C13] p-3 rounded-2xl border border-white/5">
              {(
                [
                  { key: 'DSA', label: 'DSA & Patterns', color: '#E11D48' },
                  { key: 'CoreCS', label: 'Core CS (OS/DBMS/CN/OOP)', color: '#6366F1' },
                  { key: 'Projects', label: 'Full-Stack Portfolio Projects', color: '#F43F5E' },
                  { key: 'MERN', label: 'MERN Stack & Architecture', color: '#0D9488' },
                  { key: 'LLD', label: 'Low-Level Design (LLD/OOD)', color: '#D97706' },
                  { key: 'SystemDesign', label: 'System Design (HLD)', color: '#8B5CF6' },
                  { key: 'Behavioral', label: 'Behavioral & Leadership Stories', color: '#10B981' },
                ] as const
              ).map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-2">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5 flex-1 truncate">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 w-32">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={localWeights[item.key as keyof ReadinessWeights]}
                      onChange={(e) => {
                        setLocalWeights({
                          ...localWeights,
                          [item.key]: parseInt(e.target.value, 10),
                        });
                      }}
                      className="w-20 accent-rose-500"
                    />
                    <span className="font-mono text-white text-xs w-8 text-right">
                      {localWeights[item.key as keyof ReadinessWeights]}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-white/10 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isGenerating}
            className="flex-1 py-2.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            {isGenerating ? (
              <span className="flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5 animate-spin" /> Recalibrating...
              </span>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" /> Save & Recalibrate Plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
