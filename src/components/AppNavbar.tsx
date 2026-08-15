import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Download,
  Calendar,
  Wand2,
  Home,
  CheckSquare,
  Map,
  Binary,
  MoreHorizontal,
  Wifi,
  WifiOff,
  Trophy,
  ArrowUpDown,
} from 'lucide-react';
import { TabType } from './BottomNav';
import { soundService } from '../services/audio';
import { pwaManager } from '../services/pwa';
import { UserProfile } from '../types';

interface AppNavbarProps {
  user: UserProfile;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingTasksCount: number;
  dsaTodoCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenSmartPlan: () => void;
  onOpenWeeklyReview: () => void;
  onOpenPWAInstall: () => void;
  onOpenTiersModal: () => void;
  onOpenAchievements: () => void;
  onOpenImportExport: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  pendingTasksCount,
  dsaTodoCount,
  soundEnabled,
  setSoundEnabled,
  onOpenSmartPlan,
  onOpenWeeklyReview,
  onOpenPWAInstall,
  onOpenTiersModal,
  onOpenAchievements,
  onOpenImportExport,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(pwaManager.getIsOnline());

  useEffect(() => {
    const unsubscribe = pwaManager.subscribe(() => {
      setIsOnline(pwaManager.getIsOnline());
    });
    return () => unsubscribe();
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.enabled = next;
    if (next) soundService.playTap();
  };

  const navItems = [
    { id: 'home' as TabType, label: 'Dashboard', icon: Home, badge: 0 },
    { id: 'tasks' as TabType, label: 'Daily Missions', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'roadmap' as TabType, label: '7-Mo Roadmap', icon: Map, badge: 0 },
    { id: 'dsa' as TabType, label: 'DSA Bank', icon: Binary, badge: dsaTodoCount },
    { id: 'more' as TabType, label: 'Prep Hub', icon: MoreHorizontal, badge: 0 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0E17]/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Target Information */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundService.playTap();
                setActiveTab('home');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              {/* <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5A0E24] via-rose-700 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-rose-950/60 group-hover:scale-105 transition-transform">
                CF
              </div> */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base tracking-tight group-hover:text-rose-300 transition-colors">
                    CareerForge
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-[#5A0E24]/60 text-rose-200 border border-rose-500/30 px-1.5 py-0.5 rounded font-mono font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    MERN • PWA
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>
                    Target: <strong className="text-slate-200">{user.targetCompanyType}</strong> ({user.targetInterviewMonth})
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop & Tablet Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121622]/80 border border-white/10 p-1 rounded-xl">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => {
                    soundService.playTap();
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-[#5A0E24] text-white shadow-sm shadow-[#5A0E24]/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Metrics & Tool Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Career Wealth Score Quick Badge */}
            <button
              onClick={() => {
                soundService.playTap();
                onOpenTiersModal();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1A2030] border border-white/10 transition-colors text-xs"
              title="Career Wealth Readiness Score"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono font-black text-white">{user.careerWealthScore}%</span>
            </button>

            {/* Streak Counter Quick Badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-rose-950/40 border border-amber-500/30 text-xs font-semibold text-amber-300"
              title={`${user.currentStreak} Day Unbroken Preparation Streak`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{user.currentStreak}d</span>
            </div>

            {/* Import / Export Backup Data */}
            <button
              id="btn-navbar-import-export"
              onClick={() => {
                soundService.playTap();
                onOpenImportExport();
              }}
              className="p-2 rounded-xl bg-[#141824] hover:bg-[#1A2030] border border-white/10 text-rose-300 hover:text-rose-200 transition-colors"
              title="Import / Export Data Backup (JSON)"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            {/* Achievements Trophy */}
            <button
              onClick={() => {
                soundService.playTap();
                onOpenAchievements();
              }}
              className="p-2 rounded-xl bg-[#141824] hover:bg-[#1A2030] border border-white/10 text-amber-300 hover:text-amber-200 transition-colors"
              title="View Achievements & XP"
            >
              <Trophy className="w-4 h-4" />
            </button>

            {/* AI Smart Strategy Plan */}
            <button
              id="btn-navbar-smart-plan"
              onClick={() => {
                soundService.playTap();
                onOpenSmartPlan();
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5A0E24]/60 hover:bg-[#5A0E24] border border-rose-600/40 text-rose-200 text-xs font-semibold transition-all shadow-sm shadow-rose-950/40"
              title="AI Daily Strategy Calibration"
            >
              <Wand2 className="w-3.5 h-3.5 text-rose-300" />
              <span>AI Strategy</span>
            </button>

            {/* Weekly Retrospective */}
            <button
              id="btn-navbar-weekly-audit"
              onClick={() => {
                soundService.playTap();
                onOpenWeeklyReview();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1A2030] border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              title="Weekly Preparation Retrospective"
            >
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xl:inline">Weekly Audit</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                soundEnabled
                  ? 'bg-rose-950/40 text-rose-300 border-rose-800/40 hover:bg-rose-900/40'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
              }`}
              title={soundEnabled ? 'Audio FX Enabled' : 'Audio Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* PWA Install Button */}
            <button
              onClick={() => {
                soundService.playTap();
                onOpenPWAInstall();
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#5A0E24] to-rose-700 hover:brightness-110 text-white border border-rose-500/40 transition-all flex items-center gap-1.5 shadow-sm shadow-rose-950/40"
              title="PWA Offline & Install App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install PWA</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
