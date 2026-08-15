import React, { useState } from 'react';
import { DSAProblem, DSADifficulty, DSAStatus } from '../types';
import { Binary, Search, Plus, Filter, ExternalLink, Lightbulb, Clock, CheckCircle2, RotateCcw, Sparkles, X, ChevronDown } from 'lucide-react';
import { soundService } from '../services/audio';

interface DSATrackerViewProps {
  problems: DSAProblem[];
  onUpdateProblem: (updated: DSAProblem) => void;
  onAddProblem: (newProblem: DSAProblem) => void;
}

export const DSATrackerView: React.FC<DSATrackerViewProps> = ({
  problems,
  onUpdateProblem,
  onAddProblem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // AI Hint Modal State
  const [activeHintProblem, setActiveHintProblem] = useState<DSAProblem | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintData, setHintData] = useState<{ hint: string; hintLevel: string; targetComplexity: string } | null>(null);

  // New problem form state
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('Dynamic Programming');
  const [newPattern, setNewPattern] = useState('Tabulation / Memoization');
  const [newDifficulty, setNewDifficulty] = useState<DSADifficulty>('Medium');
  const [newUrl, setNewUrl] = useState('');

  // Stats calculation
  const totalSolved = problems.filter((p) => p.status === 'Solved').length;
  const easySolved = problems.filter((p) => p.status === 'Solved' && p.difficulty === 'Easy').length;
  const mediumSolved = problems.filter((p) => p.status === 'Solved' && p.difficulty === 'Medium').length;
  const hardSolved = problems.filter((p) => p.status === 'Solved' && p.difficulty === 'Hard').length;
  const revisionCount = problems.filter((p) => p.status === 'Revision Required').length;

  // Unique topics
  const topicsList = ['All', ...Array.from(new Set(problems.map((p) => p.topic)))];

  // Filtering
  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    return matchesSearch && matchesDiff && matchesStatus && matchesTopic;
  });

  const handleStatusChange = (problem: DSAProblem, newStatus: DSAStatus) => {
    soundService.playTaskPop();
    const updated: DSAProblem = {
      ...problem,
      status: newStatus,
      solvedAt: newStatus === 'Solved' ? new Date().toISOString().split('T')[0] : problem.solvedAt,
      attemptsCount: problem.attemptsCount + (newStatus === 'Solved' || newStatus === 'Attempted' ? 1 : 0),
    };
    onUpdateProblem(updated);
  };

  const handleRequestHint = async (problem: DSAProblem) => {
    soundService.playTap();
    setActiveHintProblem(problem);
    setHintLoading(true);
    setHintData(null);

    try {
      const res = await fetch('/api/ai/dsa-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          topic: problem.topic,
          currentAttempt: problem.notes || 'Looking for optimal time/space approach',
        }),
      });
      const data = await res.json();
      setHintData(data);
    } catch {
      setHintData({
        hintLevel: 'Intuition Hint',
        hint: `For "${problem.title}", look for invariant properties in subproblems. Notice how monotonic stack or two-pointers can prune unnecessary recalculations.`,
        targetComplexity: 'O(N) Time, O(1) Space',
      });
    } finally {
      setHintLoading(false);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundService.playLevelUp();
    const newProblem: DSAProblem = {
      id: `dsa_${Date.now()}`,
      title: newTitle.trim(),
      platform: 'LeetCode',
      difficulty: newDifficulty,
      topic: newTopic,
      pattern: newPattern.trim() || 'Core Algorithm',
      status: 'Todo',
      attemptsCount: 0,
      problemUrl: newUrl.trim() || undefined,
    };
    onAddProblem(newProblem);
    setNewTitle('');
    setNewUrl('');
    setShowAddModal(false);
  };

  const getDifficultyBadge = (difficulty: DSADifficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'Medium':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      case 'Hard':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/40';
    }
  };

  return (
    <div className="p-4 space-y-3 pb-24">
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Binary className="w-5 h-5 text-rose-400" />
            DSA Pattern Master
          </h2>
          <p className="text-xs text-slate-400">Target: 250 Curated FAANG & Product Problems</p>
        </div>

        <button
          id="btn-add-dsa-problem"
          onClick={() => {
            soundService.playTap();
            setShowAddModal(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Problem
        </button>
      </div>

      {/* Stats Summary Bento Card */}
      <div className="bg-[#121622] border border-white/10 rounded-2xl p-3.5 shadow-lg space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-semibold">Problems Solved</span>
          <span className="font-mono font-extrabold text-rose-300">
            {totalSolved} / 250 <span className="text-slate-500 font-normal">({Math.round((totalSolved / 250) * 100)}%)</span>
          </span>
        </div>

        {/* Breakdown bar */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-white/5">
          <div style={{ width: `${(easySolved / 250) * 100}%` }} className="bg-emerald-500 h-full" title="Easy" />
          <div style={{ width: `${(mediumSolved / 250) * 100}%` }} className="bg-amber-500 h-full" title="Medium" />
          <div style={{ width: `${(hardSolved / 250) * 100}%` }} className="bg-rose-600 h-full" title="Hard" />
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono text-[11px]">
          <div className="bg-[#0A0D15] py-1 rounded-lg border border-white/5">
            <span className="text-emerald-400 font-bold">{easySolved}</span> <span className="text-slate-500 text-[10px]">Easy</span>
          </div>
          <div className="bg-[#0A0D15] py-1 rounded-lg border border-white/5">
            <span className="text-amber-400 font-bold">{mediumSolved}</span> <span className="text-slate-500 text-[10px]">Med</span>
          </div>
          <div className="bg-[#0A0D15] py-1 rounded-lg border border-white/5">
            <span className="text-rose-400 font-bold">{hardSolved}</span> <span className="text-slate-500 text-[10px]">Hard</span>
          </div>
          <div className="bg-[#0A0D15] py-1 rounded-lg border border-white/5">
            <span className="text-purple-400 font-bold">{revisionCount}</span> <span className="text-slate-500 text-[10px]">Revise</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, patterns (e.g. Sliding Window, BFS)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131622] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {/* Difficulty filter */}
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => {
                soundService.playTap();
                setSelectedDifficulty(diff);
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all whitespace-nowrap ${
                selectedDifficulty === diff
                  ? 'bg-rose-950 text-rose-200 border-rose-700'
                  : 'bg-[#131622] text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}

          {/* Status filter */}
          {['All', 'Solved', 'Revision Required', 'Attempted', 'Todo'].map((st) => (
            <button
              key={st}
              onClick={() => {
                soundService.playTap();
                setSelectedStatus(st);
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-rose-950 text-rose-200 border-rose-700'
                  : 'bg-[#131622] text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-2">
        {filteredProblems.map((problem) => {
          const isSolved = problem.status === 'Solved';
          const isRevision = problem.status === 'Revision Required';

          return (
            <div
              key={problem.id}
              className={`p-3 rounded-xl border transition-all ${
                isSolved
                  ? 'bg-[#111520] border-emerald-950/40'
                  : isRevision
                  ? 'bg-[#1A1424] border-purple-900/40'
                  : 'bg-[#131622] border-white/10 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-100 text-xs hover:text-rose-300 transition-colors">
                      {problem.title}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getDifficultyBadge(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[9px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded border border-white/5">
                      {problem.platform}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pattern: <span className="text-slate-200 font-medium">{problem.pattern}</span> • {problem.topic}
                  </p>
                </div>

                {/* AI Hint Button */}
                <button
                  id={`btn-ai-hint-${problem.id}`}
                  onClick={() => handleRequestHint(problem)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-950 text-amber-300 border border-amber-900/30 transition-colors flex items-center gap-1 text-[10px] font-semibold flex-shrink-0"
                  title="Get AI Algorithmic Guidance"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">AI Hint</span>
                </button>
              </div>

              {/* Problem notes if available */}
              {problem.notes && (
                <p className="text-[11px] bg-[#0A0D15] text-slate-300 p-2 rounded-lg border border-white/5 mb-2 font-mono">
                  💡 {problem.notes}
                </p>
              )}

              {/* Status Action Selector */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                <div className="flex items-center gap-2">
                  <select
                    value={problem.status}
                    onChange={(e) => handleStatusChange(problem, e.target.value as DSAStatus)}
                    className="bg-[#0A0D15] text-xs text-slate-200 border border-white/10 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="Todo">Todo</option>
                    <option value="Attempted">Attempted</option>
                    <option value="Solved">Solved ✓</option>
                    <option value="Revision Required">Need Revision 🔄</option>
                  </select>

                  {problem.timeTakenMinutes && (
                    <span className="text-slate-400 text-[10px] flex items-center gap-0.5 font-mono">
                      <Clock className="w-3 h-3" /> {problem.timeTakenMinutes}m
                    </span>
                  )}
                </div>

                {problem.problemUrl && (
                  <a
                    href={problem.problemUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-rose-400 flex items-center gap-1 text-[10px]"
                  >
                    Problem Link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Hint Modal */}
      {activeHintProblem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-amber-900/50 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3 relative">
            <button
              onClick={() => setActiveHintProblem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Algorithmic Guidance</h4>
                <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{activeHintProblem.title}</p>
              </div>
            </div>

            {hintLoading ? (
              <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
                <p>Generating mathematical intuition & complexity target...</p>
              </div>
            ) : (
              hintData && (
                <div className="space-y-2.5 text-xs">
                  <div className="bg-[#0A0D15] p-3 rounded-xl border border-white/5 space-y-1.5">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      {hintData.hintLevel}
                    </span>
                    <p className="text-slate-200 leading-relaxed">{hintData.hint}</p>
                  </div>

                  <div className="flex justify-between bg-slate-900/80 px-3 py-2 rounded-xl border border-white/5 text-[11px] text-slate-300 font-mono">
                    <span>Target Complexity:</span>
                    <span className="text-rose-300 font-bold">{hintData.targetComplexity}</span>
                  </div>
                </div>
              )
            )}

            <button
              onClick={() => setActiveHintProblem(null)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
            >
              Got It, Let Me Solve It
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Problem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-[#121622] border border-white/10 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3 relative"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Add New DSA Problem</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Problem Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Alien Dictionary"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Topic</label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Arrays & Hashing">Arrays & Hashing</option>
                    <option value="Two Pointers">Two Pointers</option>
                    <option value="Sliding Window">Sliding Window</option>
                    <option value="Binary Search">Binary Search</option>
                    <option value="Trees">Trees</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Heap">Heap</option>
                    <option value="Trie">Trie</option>
                    <option value="Backtracking">Backtracking</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as DSADifficulty)}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Algorithmic Pattern</label>
                <input
                  type="text"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  placeholder="e.g. Topological Sort / Kahn's Algorithm"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Problem URL (Optional)</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Add to Problem Catalog
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
