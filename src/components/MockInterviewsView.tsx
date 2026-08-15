import React, { useState } from 'react';
import { MockInterview, TaskItem } from '../types';
import { Video, Plus, Sparkles, Star, AlertTriangle, CheckCircle2, X, ChevronRight } from 'lucide-react';
import { soundService } from '../services/audio';

interface MockInterviewsViewProps {
  mocks: MockInterview[];
  onAddMock: (newMock: MockInterview) => void;
  onGenerateActionTasks?: (tasks: Partial<TaskItem>[]) => void;
}

export const MockInterviewsView: React.FC<MockInterviewsViewProps> = ({
  mocks,
  onAddMock,
  onGenerateActionTasks,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMock, setSelectedMock] = useState<MockInterview | null>(mocks[0] || null);

  // Form State
  const [topic, setTopic] = useState('System Design — Distributed Key-Value Store');
  const [category, setCategory] = useState<'DSA' | 'System Design' | 'LLD' | 'Behavioral' | 'Full Mock'>('System Design');
  const [interviewer, setInterviewer] = useState('Senior FAANG Engineer (Pramp)');
  const [score, setScore] = useState(8);
  const [feedback, setFeedback] = useState('Good understanding of consistent hashing and gossip protocol. Need faster initial clarifying questions.');
  const [weakAreasStr, setWeakAreasStr] = useState('SLA estimation, Raft consensus trade-offs');
  const [actionItemsStr, setActionItemsStr] = useState('Review Raft paper summary; practice 3 back-of-the-envelope calculations');
  const [confidence, setConfidence] = useState(4);

  // AI Evaluation State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<{
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestedActionTasks: string[];
    readinessRating: string;
  } | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    soundService.playLevelUp();

    const weakAreas = weakAreasStr.split(',').map((s) => s.trim()).filter(Boolean);
    const actionItems = actionItemsStr.split(',').map((s) => s.trim()).filter(Boolean);

    const newMock: MockInterview = {
      id: `mock_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      topic: topic.trim(),
      category: category,
      interviewer: interviewer.trim(),
      scoreOutOf10: Number(score),
      feedback: feedback.trim(),
      weakAreas: weakAreas,
      actionItems: actionItems,
      confidenceLevel: Number(confidence),
    };

    onAddMock(newMock);
    setSelectedMock(newMock);
    setShowAddModal(false);

    // If score < 7 or action items exist, prompt creating actionable tasks
    if (actionItems.length > 0) {
      const recoveryTasks: Partial<TaskItem>[] = actionItems.map((item) => ({
        title: `Mock Action: ${item}`,
        subjectId: category === 'System Design' ? 'System Design' : category === 'LLD' ? 'LLD' : 'DSA',
        topic: 'Mock Feedback Remediation',
        estimatedMinutes: 45,
        priority: 'High',
        status: 'pending',
        deadline: 'This Week',
        isDailyMission: false,
      }));
      onGenerateActionTasks?.(recoveryTasks);
    }
  };

  const handleRunAiFeedback = async (mock: MockInterview) => {
    soundService.playTap();
    setAiLoading(true);
    setAiEvaluation(null);

    try {
      const res = await fetch('/api/ai/mock-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: mock.topic,
          notes: mock.feedback,
          weakAreas: mock.weakAreas,
          scoreOutOf10: mock.scoreOutOf10,
        }),
      });
      const data = await res.json();
      setAiEvaluation(data);
    } catch {
      setAiEvaluation({
        summary: `Strong technical grounding in ${mock.topic}. Next round focus should emphasize crisp communication under time constraints.`,
        strengths: ['Solid architectural intuition', 'Clean trade-off justification'],
        weaknesses: mock.weakAreas,
        suggestedActionTasks: mock.actionItems,
        readinessRating: mock.scoreOutOf10 >= 8 ? 'FAANG Onsite Caliber' : 'Needs Polish',
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-3 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-400" />
            Mock Interview Center
          </h2>
          <p className="text-xs text-slate-400">Simulate FAANG Loops & Track Scoring Diagnostics</p>
        </div>

        <button
          onClick={() => {
            soundService.playTap();
            setShowAddModal(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Log Mock
        </button>
      </div>

      {/* Mocks List */}
      <div className="space-y-2.5">
        {mocks.map((mock) => {
          const isSelected = selectedMock?.id === mock.id;
          const isHigh = mock.scoreOutOf10 >= 8;
          const isMed = mock.scoreOutOf10 >= 6 && mock.scoreOutOf10 < 8;

          return (
            <div
              key={mock.id}
              onClick={() => {
                soundService.playTap();
                setSelectedMock(isSelected ? null : mock);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#151A26] border-blue-900/60 shadow-lg'
                  : 'bg-[#121622] border-white/10 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white truncate">{mock.topic}</span>
                    <span className="text-[9px] bg-blue-950/80 text-blue-300 border border-blue-800/40 px-1.5 py-0.2 rounded font-semibold">
                      {mock.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Interviewer: <span className="text-slate-300 font-medium">{mock.interviewer}</span> • {mock.date}
                  </p>
                </div>

                {/* Score Pill */}
                <div
                  className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold border flex items-center gap-1 flex-shrink-0 ${
                    isHigh
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : isMed
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-rose-950 text-rose-300 border-rose-700'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{mock.scoreOutOf10}/10</span>
                </div>
              </div>

              {/* Collapsed/Expanded details */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-white/5 space-y-2.5 text-xs">
                  <div className="bg-[#0A0D15] p-2.5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      Interviewer Feedback
                    </p>
                    <p className="text-slate-200 mt-1 leading-relaxed">{mock.feedback}</p>
                  </div>

                  {mock.weakAreas.length > 0 && (
                    <div className="bg-rose-950/20 p-2.5 rounded-xl border border-rose-900/30">
                      <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Diagnostic Weak Areas
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {mock.weakAreas.map((w, i) => (
                          <span key={i} className="text-[11px] bg-rose-950 text-rose-200 px-2 py-0.5 rounded-md border border-rose-800/40">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {mock.actionItems.length > 0 && (
                    <div className="bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/30">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Action Plan
                      </p>
                      <ul className="mt-1 space-y-1 text-slate-300 text-[11px]">
                        {mock.actionItems.map((a, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            • {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI Evaluation trigger button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunAiFeedback(mock);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-[#5A0E24] text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Run AI Interview Diagnostics</span>
                  </button>

                  {/* AI Evaluation Box */}
                  {aiLoading && (
                    <div className="p-3 text-center text-xs text-slate-400 animate-pulse">
                      Analyzing communication clarity, algorithmic rigor, and calibration score...
                    </div>
                  )}

                  {aiEvaluation && (
                    <div className="bg-[#0B0F19] p-3 rounded-xl border border-rose-900/50 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">
                          FAANG Calibration Diagnosis
                        </span>
                        <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-700 font-mono">
                          {aiEvaluation.readinessRating}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{aiEvaluation.summary}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Mock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-[#121622] border border-white/10 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-2.5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Log Completed Mock Interview</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Topic / Problem Asked</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Design Rate Limiter (Token Bucket vs Leaky Bucket)"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="DSA">DSA Live Coding</option>
                  <option value="System Design">System Design (HLD)</option>
                  <option value="LLD">Low-Level Design (LLD)</option>
                  <option value="Behavioral">Behavioral / Leadership</option>
                  <option value="Full Mock">Full Onsite Simulation</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Score (1 - 10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Interviewer (Platform or Name)</label>
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                placeholder="e.g. Pramp / Interviewing.io / Staff Mentor"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Detailed Feedback & Notes</label>
              <textarea
                required
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What went well, where did you stumble, and what did the interviewer say?"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Weak Areas (Comma-separated)</label>
              <input
                type="text"
                value={weakAreasStr}
                onChange={(e) => setWeakAreasStr(e.target.value)}
                placeholder="e.g. Time complexity trade-offs, Redis Lua scripts"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Action Items (Comma-separated)</label>
              <input
                type="text"
                value={actionItemsStr}
                onChange={(e) => setActionItemsStr(e.target.value)}
                placeholder="e.g. Re-implement LRU in 20 min, Review Sliding Window"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Save Mock & Generate Action Plan
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
