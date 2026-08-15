import React from 'react';
import { CHARACTER_TIERS, CharacterTier } from '../data/initialData';
import { X, Sparkles, Trophy, Building2, Laptop, Monitor, CheckCircle2, Lock } from 'lucide-react';
import { soundService } from '../services/audio';

interface TiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
}

export const TiersModal: React.FC<TiersModalProps> = ({ isOpen, onClose, currentScore }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-white/10 rounded-3xl p-5 max-w-md w-full shadow-2xl max-h-[90vh] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Career Wealth Progression
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Workstation Evolution Tiers</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tiers List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 custom-scrollbar pr-1">
          {CHARACTER_TIERS.map((tier) => {
            const isUnlocked = currentScore >= tier.minScore;
            const isCurrent = currentScore >= tier.minScore && currentScore <= tier.maxScore;

            return (
              <div
                key={tier.level}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#5A0E24]/60 to-[#181C29] border-rose-500 shadow-lg shadow-rose-950/50'
                    : isUnlocked
                    ? 'bg-[#181D29] border-white/10'
                    : 'bg-[#0E1119] border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tier.badge}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">
                          Level {tier.level}: {tier.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-rose-300 font-mono font-medium">
                        {tier.minScore}% – {tier.maxScore}% Career Readiness
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isUnlocked ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5 font-mono">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{tier.tagline}</p>

                {/* Equipment specs */}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-rose-400" />
                    <span className="truncate">{tier.equipment.computer}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">{tier.equipment.monitors}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic mt-2 bg-[#090C13] p-1.5 rounded-lg border border-white/5">
                  “{tier.quote}”
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
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
