import React, { useState } from 'react';
import { RoadmapMonth, RoadmapTopic, TaskItem } from '../types';
import { Map, CheckCircle2, Circle, Sparkles, ChevronRight, BookOpen, Layers, Plus, Target } from 'lucide-react';
import { soundService } from '../services/audio';

interface RoadmapViewProps {
  roadmap: RoadmapMonth[];
  onToggleTopic: (monthId: string, topicId: string) => void;
  onAddTaskFromTopic?: (task: Partial<TaskItem>) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  onToggleTopic,
  onAddTaskFromTopic,
}) => {
  const [selectedMonthId, setSelectedMonthId] = useState<string>(roadmap[0]?.id || 'month_08');

  const currentMonth = roadmap.find((m) => m.id === selectedMonthId) || roadmap[0];

  const handleTopicCheck = (topicId: string) => {
    soundService.playTaskPop();
    onToggleTopic(currentMonth.id, topicId);
  };

  const handleCreateTaskFromPractice = (itemTitle: string) => {
    soundService.playLevelUp();
    onAddTaskFromTopic?.({
      title: itemTitle,
      subjectId:
        currentMonth.monthName === 'AUGUST'
          ? 'MERN'
          : currentMonth.monthName === 'SEPTEMBER' || currentMonth.monthName === 'OCTOBER'
          ? 'System Design'
          : currentMonth.monthName === 'NOVEMBER'
          ? 'LLD'
          : currentMonth.monthName === 'DECEMBER'
          ? 'Core CS'
          : 'Company Prep',
      topic: `${currentMonth.monthName} Curriculum`,
      estimatedMinutes: 60,
      priority: 'High',
      status: 'pending',
      deadline: 'Today',
      isDailyMission: true,
    });
  };

  return (
    <div className="p-4 space-y-3 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Map className="w-5 h-5 text-rose-400" />
            Interactive Career Roadmap
          </h2>
          <p className="text-xs text-slate-400">7-Month Structured FAANG Preparation Trajectory</p>
        </div>
      </div>

      {/* Horizontal Month Tabs Selector (Android pill carousel) */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {roadmap.map((month) => {
          const isSelected = month.id === selectedMonthId;
          const completedCount = month.topics.filter((t) => t.completed).length;
          const totalCount = month.topics.length;
          const pct = Math.round((completedCount / totalCount) * 100);

          return (
            <button
              key={month.id}
              id={`roadmap-tab-${month.id}`}
              onClick={() => {
                soundService.playTap();
                setSelectedMonthId(month.id);
              }}
              className={`p-2.5 rounded-2xl border text-left min-w-[100px] flex-shrink-0 transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-[#5A0E24] to-[#3B0716] border-rose-500 text-white shadow-lg shadow-rose-950/40 scale-102'
                  : 'bg-[#121622] border-white/10 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-80">
                {month.monthName.slice(0, 3)}
              </span>
              <p className="text-xs font-bold text-white truncate mt-0.5">{month.theme.split('+')[0]}</p>
              <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                <span>{pct}%</span>
                <span className="text-[9px] opacity-70">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Month Detail Hero Card */}
      <div className="bg-[#121622] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold uppercase tracking-wider">
              <span>{currentMonth.monthName} FOCUS</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">{currentMonth.theme}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{currentMonth.focusDescription}</p>
          </div>

          <div className="bg-[#0A0D15] px-3 py-1.5 rounded-xl border border-white/5 text-right font-mono flex-shrink-0">
            <span className="text-base font-black text-rose-300">
              {Math.round(
                (currentMonth.topics.filter((t) => t.completed).length / currentMonth.topics.length) * 100
              )}
              %
            </span>
            <p className="text-[9px] text-slate-500">Curriculum</p>
          </div>
        </div>

        {/* Continuous Focus Pills */}
        <div className="bg-[#0A0D15] p-2.5 rounded-xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
            Continuous Daily Cadence
          </p>
          <div className="flex flex-wrap gap-1.5">
            {currentMonth.continuousFocus.map((focus, i) => (
              <span
                key={i}
                className="text-[11px] bg-rose-950/60 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded-lg font-medium"
              >
                ⚡ {focus}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Core Syllabus Checklist */}
      <div className="bg-[#121622] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            Core Topics & Competency Checklist
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            {currentMonth.topics.filter((t) => t.completed).length} of {currentMonth.topics.length} Mastered
          </span>
        </div>

        <div className="space-y-1.5">
          {currentMonth.topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleTopicCheck(topic.id)}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                topic.completed
                  ? 'bg-[#0E1119] border-emerald-950/50 text-slate-400'
                  : 'bg-[#181D29] border-white/10 hover:border-slate-700 text-slate-100'
              }`}
            >
              <button
                id={`btn-toggle-topic-${topic.id}`}
                className="mt-0.5 text-rose-400 flex-shrink-0"
              >
                {topic.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
              </button>
              <span className={`text-xs font-medium ${topic.completed ? 'line-through text-slate-500' : ''}`}>
                {topic.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Machine Coding / System Design Case Studies */}
      <div className="bg-[#121622] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          High-Yield Practice & Architecture Challenges
        </h4>

        <div className="space-y-2">
          {currentMonth.practiceItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#181D29] border border-white/10 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#0A0D15] text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center border border-white/5">
                  #{idx + 1}
                </span>
                <span className="text-slate-200 font-medium">{item}</span>
              </div>

              <button
                onClick={() => handleCreateTaskFromPractice(item)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#5A0E24] text-slate-300 hover:text-white border border-white/5 text-[11px] font-medium flex items-center gap-1 transition-colors flex-shrink-0"
                title="Add to today's study plan"
              >
                <Plus className="w-3 h-3" />
                <span>Plan</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
