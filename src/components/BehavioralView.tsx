import React, { useState } from 'react';
import { BehavioralStory } from '../types';
import { Users, Plus, Star, CheckCircle, Clock, BookOpen, X, Sparkles } from 'lucide-react';
import { soundService } from '../services/audio';

interface BehavioralViewProps {
  stories: BehavioralStory[];
  onUpdateStory: (updated: BehavioralStory) => void;
  onAddStory: (newStory: BehavioralStory) => void;
}

export const BehavioralView: React.FC<BehavioralViewProps> = ({
  stories,
  onUpdateStory,
  onAddStory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(stories[0]?.id || null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Conflict Resolution');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const categories = ['All', 'Leadership', 'Conflict Resolution', 'Overcoming Failure', 'Technical Innovation', 'Delivering Results'];

  const filteredStories = stories.filter(
    (s) => selectedCategory === 'All' || s.category === selectedCategory
  );

  const handleTogglePracticed = (story: BehavioralStory) => {
    soundService.playTaskPop();
    const updated: BehavioralStory = {
      ...story,
      practiced: !story.practiced,
      lastPracticedDate: !story.practiced ? new Date().toISOString().split('T')[0] : story.lastPracticedDate,
    };
    onUpdateStory(updated);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !situation.trim()) return;
    soundService.playLevelUp();

    const newStory: BehavioralStory = {
      id: `story_${Date.now()}`,
      title: title.trim(),
      category: category,
      situation: situation.trim(),
      task: task.trim(),
      action: action.trim(),
      result: result.trim(),
      lessonsLearned: lessonsLearned.trim(),
      status: 'Draft',
      practiced: false,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onAddStory(newStory);
    setTitle('');
    setSituation('');
    setTask('');
    setAction('');
    setResult('');
    setLessonsLearned('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 space-y-3 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            STAR Story Matrix
          </h2>
          <p className="text-xs text-slate-400">FAANG Leadership Principles & Behavioral Repository</p>
        </div>

        <button
          onClick={() => {
            soundService.playTap();
            setShowAddModal(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Craft Story
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              soundService.playTap();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1 rounded-lg font-medium border transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-emerald-950 text-emerald-200 border-emerald-700'
                : 'bg-[#121622] text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Story Cards */}
      <div className="space-y-2.5">
        {filteredStories.map((story) => {
          const isExpanded = expandedStoryId === story.id;
          return (
            <div
              key={story.id}
              className={`border rounded-2xl transition-all overflow-hidden ${
                story.practiced
                  ? 'bg-[#10141D] border-emerald-900/40'
                  : 'bg-[#131622] border-white/10'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => {
                  soundService.playTap();
                  setExpandedStoryId(isExpanded ? null : story.id);
                }}
                className="p-3.5 cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePracticed(story);
                    }}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
                      story.practiced
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-[#0A0D15] border-slate-600 hover:border-emerald-400'
                    }`}
                    title={story.practiced ? 'Mark as needing practice' : 'Mark as practiced'}
                  >
                    {story.practiced && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-xs truncate">{story.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.2 rounded font-semibold">
                        {story.category}
                      </span>
                      {story.lastPracticedDate && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Practiced: {story.lastPracticedDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">
                  {isExpanded ? 'Hide STAR ▲' : 'View STAR ▼'}
                </span>
              </div>

              {/* Collapsible STAR Detail Breakdown */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-white/5 text-xs">
                  <div className="bg-[#0A0D15] p-2.5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                      S — Situation
                    </p>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">{story.situation}</p>
                  </div>

                  <div className="bg-[#0A0D15] p-2.5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">T — Task</p>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">{story.task}</p>
                  </div>

                  <div className="bg-[#0A0D15] p-2.5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                      A — Action (I did...)
                    </p>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">{story.action}</p>
                  </div>

                  <div className="bg-[#0A0D15] p-2.5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      R — Quantitative Result
                    </p>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">{story.result}</p>
                  </div>

                  {story.lessonsLearned && (
                    <div className="bg-[#5A0E24]/20 p-2.5 rounded-xl border border-rose-900/40">
                      <p className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">
                        💡 Key Takeaway / Leadership Principle
                      </p>
                      <p className="text-rose-100 mt-0.5">{story.lessonsLearned}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Story Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-[#121622] border border-white/10 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-2.5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Craft STAR Behavioral Story</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Story Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Resolving Redis connection pool exhaustion during flash sale"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Leadership">Leadership & Ownership</option>
                <option value="Conflict Resolution">Conflict Resolution</option>
                <option value="Overcoming Failure">Overcoming Failure</option>
                <option value="Technical Innovation">Technical Innovation</option>
                <option value="Delivering Results">Delivering Results Under Pressure</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Situation (Context & Stakeholders)</label>
              <textarea
                required
                rows={2}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Where were you working, what was the problem, and why was it urgent?"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Task (Your Explicit Responsibility)</label>
              <textarea
                required
                rows={2}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What was expected of you specifically?"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Action (Exact Technical/Team Steps Taken)</label>
              <textarea
                required
                rows={2}
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="What did YOU do? (Use 'I' instead of 'We')..."
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Result (Metrics, Latency, Revenue)</label>
              <textarea
                required
                rows={2}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Reduced p99 latency by 65%, rescued $50k in checkout revenue..."
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Save STAR Story
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
