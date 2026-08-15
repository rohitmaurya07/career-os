import React, { useState } from 'react';
import { Sparkles, Trophy, ChevronRight, Laptop, Monitor, Building2, Flame, Award, ShieldCheck } from 'lucide-react';
import { CHARACTER_TIERS, CharacterTier } from '../data/initialData';
import { soundService } from '../services/audio';

interface CareerWealthHeroProps {
  score: number; // 0-100
  streak: number;
  level: number;
  xp: number;
  onOpenTiersModal?: () => void;
  onOpenAchievements?: () => void;
}

export const CareerWealthHero: React.FC<CareerWealthHeroProps> = ({
  score,
  streak,
  level,
  xp,
  onOpenTiersModal,
  onOpenAchievements,
}) => {
  const currentTier: CharacterTier =
    CHARACTER_TIERS.find((t) => score >= t.minScore && score <= t.maxScore) ||
    CHARACTER_TIERS[CHARACTER_TIERS.length - 1];

  const nextTier: CharacterTier | undefined = CHARACTER_TIERS.find((t) => t.level === currentTier.level + 1);

  // SVG representation of Character + Workspace based on level
  const renderWorkspaceIllustration = () => {
    switch (currentTier.level) {
      case 1:
      case 2:
        return (
          <svg viewBox="0 0 240 140" className="w-full h-36 drop-shadow-lg">
            <defs>
              <linearGradient id="screenGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            {/* Room background */}
            <rect x="10" y="10" width="220" height="120" rx="12" fill="#141824" stroke="#334155" strokeWidth="1.5" />
            <line x1="10" y1="95" x2="230" y2="95" stroke="#1E293B" strokeWidth="2" />
            {/* Desk */}
            <rect x="40" y="85" width="160" height="10" rx="3" fill="#64748B" />
            <rect x="55" y="95" width="6" height="30" fill="#475569" />
            <rect x="179" y="95" width="6" height="30" fill="#475569" />
            {/* Single Laptop */}
            <polygon points="90,85 150,85 145,55 95,55" fill="#334155" stroke="#64748B" strokeWidth="1" />
            <rect x="98" y="58" width="44" height="24" rx="2" fill="url(#screenGrad1)" />
            {/* Code on screen */}
            <line x1="102" y1="64" x2="120" y2="64" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="102" y1="70" x2="135" y2="70" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="102" y1="76" x2="115" y2="76" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
            {/* Simple Lamp */}
            <line x1="180" y1="85" x2="180" y2="50" stroke="#94A3B8" strokeWidth="2" />
            <path d="M 172 50 L 188 50 L 184 42 L 176 42 Z" fill="#FBBF24" opacity="0.8" />
            {/* Coffee mug */}
            <rect x="65" y="77" width="8" height="8" rx="1" fill="#E2E8F0" />
            {/* Character Silhouette */}
            <circle cx="120" cy="40" r="10" fill="#94A3B8" />
            <path d="M 105 75 Q 120 52 135 75 Z" fill="#475569" />
          </svg>
        );
      case 3:
      case 4:
        return (
          <svg viewBox="0 0 240 140" className="w-full h-36 drop-shadow-xl">
            <defs>
              <linearGradient id="deskGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="screenGlow2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#1E1B4B" />
              </linearGradient>
            </defs>
            {/* Room background with acoustic panels */}
            <rect x="10" y="10" width="220" height="120" rx="12" fill="#0F131D" stroke="#5A0E24" strokeWidth="1.5" />
            {/* Modern acoustic wall art */}
            <rect x="30" y="20" width="16" height="30" rx="2" fill="#5A0E24" opacity="0.4" />
            <rect x="50" y="20" width="16" height="30" rx="2" fill="#5A0E24" opacity="0.25" />
            <line x1="10" y1="95" x2="230" y2="95" stroke="#1E293B" strokeWidth="2" />
            {/* Modern Wooden Standing Desk */}
            <rect x="30" y="85" width="180" height="8" rx="2" fill="#B45309" />
            <rect x="45" y="93" width="8" height="32" fill="#334155" />
            <rect x="187" y="93" width="8" height="32" fill="#334155" />
            {/* Dual 27" Monitors */}
            {/* Left Main Screen */}
            <rect x="70" y="42" width="55" height="36" rx="3" fill="#090D16" stroke="#475569" strokeWidth="1.5" />
            <rect x="73" y="45" width="49" height="30" rx="1" fill="url(#screenGlow2)" />
            <line x1="77" y1="52" x2="105" y2="52" stroke="#67E8F9" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="77" y1="58" x2="115" y2="58" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="77" y1="64" x2="95" y2="64" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="77" y1="70" x2="110" y2="70" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
            {/* Right Vertical Screen */}
            <rect x="130" y="36" width="30" height="46" rx="3" fill="#090D16" stroke="#475569" strokeWidth="1.5" />
            <rect x="133" y="39" width="24" height="40" rx="1" fill="#111827" />
            <line x1="137" y1="46" x2="152" y2="46" stroke="#A78BFA" strokeWidth="1" />
            <line x1="137" y1="52" x2="150" y2="52" stroke="#38BDF8" strokeWidth="1" />
            <line x1="137" y1="58" x2="148" y2="58" stroke="#4ADE80" strokeWidth="1" />
            <line x1="137" y1="64" x2="153" y2="64" stroke="#F43F5E" strokeWidth="1" />
            {/* Monitor Mounts */}
            <rect x="94" y="78" width="6" height="7" fill="#475569" />
            <rect x="142" y="82" width="5" height="3" fill="#475569" />
            {/* Ergonomic mechanical keyboard */}
            <rect x="85" y="86" width="35" height="4" rx="1" fill="#1E293B" stroke="#0284C7" strokeWidth="0.5" />
            {/* Ambient desk LED light */}
            <line x1="35" y1="85" x2="205" y2="85" stroke="#E11D48" strokeWidth="1.5" opacity="0.7" />
          </svg>
        );
      case 5:
      case 6:
      default:
        return (
          <svg viewBox="0 0 240 140" className="w-full h-36 drop-shadow-2xl">
            <defs>
              <linearGradient id="faangGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5A0E24" />
                <stop offset="50%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#0B132B" />
              </linearGradient>
              <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E11D48" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#5A0E24" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Modern Executive Tech Suite background */}
            <rect x="10" y="10" width="220" height="120" rx="14" fill="#0A0D14" stroke="#E11D48" strokeWidth="1.8" />
            <circle cx="120" cy="65" r="70" fill="url(#haloGlow)" />
            {/* Ambient neon wall line */}
            <line x1="20" y1="25" x2="220" y2="25" stroke="#E11D48" strokeWidth="1.5" opacity="0.6" strokeDasharray="6 3" />
            <text x="30" y="22" fill="#E11D48" fontSize="8" fontWeight="bold" letterSpacing="1">
              TIER-1 / FAANG COMMAND WORKSPACE
            </text>
            {/* High-End Dark Carbon Desk */}
            <rect x="25" y="83" width="190" height="8" rx="3" fill="#181D29" stroke="#334155" strokeWidth="0.8" />
            <rect x="40" y="91" width="8" height="35" fill="#0F172A" />
            <rect x="192" y="91" width="8" height="35" fill="#0F172A" />
            {/* Triple Curved Multi-Monitor setup */}
            {/* Left Screen (System Architecture) */}
            <polygon points="40,40 68,44 68,76 40,73" fill="#0D111A" stroke="#5A0E24" strokeWidth="1.2" />
            <line x1="44" y1="50" x2="64" y2="52" stroke="#38BDF8" strokeWidth="1.2" />
            <line x1="44" y1="58" x2="60" y2="60" stroke="#A78BFA" strokeWidth="1.2" />
            <line x1="44" y1="66" x2="62" y2="67" stroke="#34D399" strokeWidth="1.2" />
            {/* Center Ultrawide Screen (Algorithms / IDE) */}
            <rect x="74" y="35" width="92" height="45" rx="3" fill="#090C14" stroke="#E11D48" strokeWidth="1.8" />
            <rect x="77" y="38" width="86" height="39" rx="2" fill="url(#faangGlow)" />
            <line x1="82" y1="46" x2="125" y2="46" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="82" y1="52" x2="155" y2="52" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="82" y1="58" x2="138" y2="58" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="82" y1="64" x2="148" y2="64" stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="82" y1="70" x2="118" y2="70" stroke="#C084FC" strokeWidth="1.8" strokeLinecap="round" />
            {/* Right Screen (Live Metrics / Terminal) */}
            <polygon points="172,44 200,40 200,73 172,76" fill="#0D111A" stroke="#5A0E24" strokeWidth="1.2" />
            <line x1="176" y1="52" x2="196" y2="50" stroke="#4ADE80" strokeWidth="1.2" />
            <line x1="176" y1="60" x2="192" y2="58" stroke="#FBBF24" strokeWidth="1.2" />
            {/* Studio Light Bar over monitors */}
            <rect x="85" y="30" width="70" height="3" rx="1.5" fill="#F8FAFC" opacity="0.9" />
            {/* Premium Studio Microphone on Arm */}
            <path d="M 195 85 Q 185 65 175 60" stroke="#94A3B8" strokeWidth="2" fill="none" />
            <circle cx="175" cy="58" r="4" fill="#E11D48" />
            {/* Trophy Badge */}
            <circle cx="215" cy="18" r="10" fill="#5A0E24" stroke="#F59E0B" strokeWidth="1" />
            <text x="211" y="21" fill="#F59E0B" fontSize="10">👑</text>
          </svg>
        );
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#181C28] to-[#12151E] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Background subtle crimson atmospheric glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#5A0E24]/20 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-900/10 blur-2xl pointer-events-none rounded-full" />

      {/* Header Row: Career Wealth Title & Score */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-rose-300">
              Career Wealth Progression
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Level {currentTier.level} — {currentTier.name}
            <span className="text-sm">{currentTier.badge}</span>
          </h2>
        </div>

        {/* Wealth Metric Ring / Badge */}
        <button
          onClick={() => {
            soundService.playTap();
            onOpenTiersModal?.();
          }}
          className="flex flex-col items-end group cursor-pointer"
        >
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono tracking-tight text-white group-hover:text-rose-300 transition-colors">
              {score}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 group-hover:text-slate-200 flex items-center gap-0.5">
            View Tiers <ChevronRight className="w-3 h-3 text-rose-400" />
          </span>
        </button>
      </div>

      {/* Interactive Visual Character & Workspace Scene */}
      <div className="relative mb-3 flex items-center justify-center bg-[#090C13] rounded-xl p-2 border border-white/5 shadow-inner">
        {renderWorkspaceIllustration()}
        {/* Badge overlay on bottom right of illustration */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-slate-300 flex items-center gap-1.5 shadow-md">
          <Building2 className="w-3 h-3 text-rose-400" />
          <span>{currentTier.equipment.monitors}</span>
        </div>
      </div>

      {/* Progress Bar with Target Next Level */}
      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-slate-400 text-[11px]">
            {nextTier ? `Next: Level ${nextTier.level} (${nextTier.name})` : 'Max Tier: FAANG Ready'}
          </span>
          <span className="font-mono text-rose-300 font-semibold text-[11px]">{score} / 100 PTS</span>
        </div>

        {/* Multi-segment styled progress bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5A0E24] via-rose-600 to-amber-500 transition-all duration-700 shadow-[0_0_12px_rgba(225,29,72,0.6)]"
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
      </div>

      {/* Key Equipment / Tier Summary Pills */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-[#0E121A] p-2 rounded-xl border border-white/5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-300">
            <Laptop className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rig</p>
            <p className="text-white font-medium truncate text-[11px]">{currentTier.equipment.computer}</p>
          </div>
        </div>

        <div className="bg-[#0E121A] p-2 rounded-xl border border-white/5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status</p>
            <p className="text-white font-medium truncate text-[11px]">{currentTier.tagline.split('—')[0]}</p>
          </div>
        </div>
      </div>

      {/* Non-toxic Motivational Philosophy Quote */}
      <div className="bg-[#5A0E24]/20 border border-[#5A0E24]/50 rounded-xl px-3 py-2 text-xs flex items-center gap-2">
        <span className="text-rose-400 font-serif text-base leading-none">“</span>
        <p className="text-rose-100 font-medium text-[11px] leading-tight italic flex-1">{currentTier.quote}</p>
      </div>
    </div>
  );
};
