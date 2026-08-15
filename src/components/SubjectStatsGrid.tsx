import React from 'react';
import { SubjectInfo, SubjectId } from '../types';
import { Binary, Layers, Cpu, Boxes, Server, Users, FolderGit2, Video, Building2, ChevronRight } from 'lucide-react';
import { soundService } from '../services/audio';

interface SubjectStatsGridProps {
  subjects: SubjectInfo[];
  onSelectSubject: (subjectId: SubjectId) => void;
}

export const SubjectStatsGrid: React.FC<SubjectStatsGridProps> = ({ subjects, onSelectSubject }) => {
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Binary':
        return <Binary className="w-4 h-4 text-rose-400" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-teal-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-indigo-400" />;
      case 'Boxes':
        return <Boxes className="w-4 h-4 text-amber-400" />;
      case 'Server':
        return <Server className="w-4 h-4 text-purple-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'FolderGit2':
        return <FolderGit2 className="w-4 h-4 text-pink-400" />;
      case 'Video':
        return <Video className="w-4 h-4 text-blue-400" />;
      case 'Building2':
        return <Building2 className="w-4 h-4 text-rose-300" />;
      default:
        return <Binary className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="w-full bg-[#131622] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-white text-sm tracking-tight">Subject Readiness Matrix</h3>
          <p className="text-[11px] text-slate-400">FAANG curriculum mastery tracking</p>
        </div>
        <span className="text-[11px] text-rose-300 font-mono bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-800/30">
          Weighted Index
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {subjects.map((subject) => {
          return (
            <button
              key={subject.id}
              id={`btn-subject-${subject.id.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => {
                soundService.playTap();
                onSelectSubject(subject.id);
              }}
              className="bg-[#181D29] hover:bg-[#1F2535] border border-white/10 hover:border-rose-900/50 p-2.5 rounded-xl text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#0C0F17] flex items-center justify-center border border-white/5">
                    {getSubjectIcon(subject.iconName)}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    {subject.name.split('&')[0]}
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-rose-300">
                  {subject.progressPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${subject.progressPercent}%`,
                    backgroundColor: subject.color || '#E11D48',
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span>Weight: {subject.targetWeight}%</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rose-400 transition-opacity" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
