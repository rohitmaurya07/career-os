import React from 'react';
import { Home, CheckSquare, Map, Binary, MoreHorizontal } from 'lucide-react';
import { soundService } from '../services/audio';

export type TabType = 'home' | 'tasks' | 'roadmap' | 'dsa' | 'more';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingTasksCount: number;
  dsaTodoCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  dsaTodoCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home, badge: 0 },
    { id: 'tasks' as TabType, label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'roadmap' as TabType, label: 'Roadmap', icon: Map, badge: 0 },
    { id: 'dsa' as TabType, label: 'DSA', icon: Binary, badge: dsaTodoCount },
    { id: 'more' as TabType, label: 'Hub', icon: MoreHorizontal, badge: 0 },
  ];

  const handleTabClick = (tabId: TabType) => {
    soundService.playTap();
    setActiveTab(tabId);
  };

  return (
    <nav className="fixed bottom-3 left-3 right-3 max-w-lg mx-auto z-40 md:hidden pointer-events-auto">
      <div className="bg-[#121622]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Material 3 active background pill */}
              <div
                className={`relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-[#5A0E24] shadow-md shadow-[#5A0E24]/50 scale-105' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-white scale-110' : 'text-slate-400'}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center border border-[#121622]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-rose-200 font-semibold' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
