import React from 'react';
import { Achievement } from '../types';
import { X, Trophy, Sparkles, CheckCircle2, Lock, Award, Flame, Binary, Server, Boxes, ShieldCheck } from 'lucide-react';
import { soundService } from '../services/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  userXp: number;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  userXp,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Binary':
        return <Binary className="w-5 h-5 text-rose-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-purple-400" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-teal-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-300" />;
      case 'Trophy':
      default:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-white/10 rounded-3xl p-5 max-w-md w-full shadow-2xl max-h-[90vh] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Milestones & Accolades</h3>
              <p className="text-xs text-slate-400">
                Unlocked: <span className="text-amber-300 font-mono font-bold">{unlockedCount}</span> of {achievements.length} • Total XP: <span className="text-rose-300 font-mono font-bold">{userXp}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 custom-scrollbar pr-1">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                item.unlocked
                  ? 'bg-[#181D29] border-amber-900/40 shadow-sm'
                  : 'bg-[#0E1119] border-white/5 opacity-55'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                  item.unlocked
                    ? 'bg-[#090C13] border-amber-500/30 shadow-md shadow-amber-950/40'
                    : 'bg-[#0A0D15] border-white/5 text-slate-600'
                }`}
              >
                {item.unlocked ? getBadgeIcon(item.icon) : <Lock className="w-4 h-4 text-slate-600" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs truncate">{item.title}</h4>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                    +{item.xpReward} XP
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.description}</p>

                {item.unlocked && item.unlockedDate && (
                  <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked on {item.unlockedDate}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors mt-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};
