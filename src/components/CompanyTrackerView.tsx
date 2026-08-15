import React, { useState } from 'react';
import { CompanyTarget, ApplicationStatus } from '../types';
import { Building2, Plus, DollarSign, Calendar, CheckCircle2, ChevronRight, X, ExternalLink } from 'lucide-react';
import { soundService } from '../services/audio';

interface CompanyTrackerViewProps {
  companies: CompanyTarget[];
  onUpdateCompany: (updated: CompanyTarget) => void;
  onAddCompany: (newCompany: CompanyTarget) => void;
}

export const CompanyTrackerView: React.FC<CompanyTrackerViewProps> = ({
  companies,
  onUpdateCompany,
  onAddCompany,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('Software Development Engineer II');
  const [tier, setTier] = useState<'FAANG' | 'Tier-1 Product' | 'Top MNC'>('FAANG');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [referralStatus, setReferralStatus] = useState<'None' | 'Requested' | 'Secured'>('Requested');
  const [salaryRange, setSalaryRange] = useState('$185,000 - $230,000');
  const [notes, setNotes] = useState('Heavy focus on Distributed Systems & Graph Algorithms.');

  const statuses: ApplicationStatus[] = [
    'Wishlist',
    'Applied',
    'Online Assessment',
    'Technical Screen',
    'System Design / LLD',
    'Onsite / Final Loop',
    'Offer',
    'Rejected',
  ];

  const filteredCompanies = companies.filter(
    (c) => selectedStatusFilter === 'All' || c.status === selectedStatusFilter
  );

  const handleStatusUpdate = (company: CompanyTarget, newStatus: ApplicationStatus) => {
    soundService.playTaskPop();
    const updated: CompanyTarget = {
      ...company,
      status: newStatus,
    };
    onUpdateCompany(updated);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundService.playLevelUp();

    const newCompany: CompanyTarget = {
      id: `comp_${Date.now()}`,
      name: name.trim(),
      tier: tier,
      role: role.trim(),
      status: status,
      referralStatus: referralStatus,
      targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      salaryRange: salaryRange.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onAddCompany(newCompany);
    setName('');
    setShowAddModal(false);
  };

  const getStatusColor = (st: ApplicationStatus) => {
    switch (st) {
      case 'Offer':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-700';
      case 'Onsite / Final Loop':
      case 'System Design / LLD':
        return 'text-purple-300 bg-purple-950/80 border-purple-700';
      case 'Technical Screen':
      case 'Online Assessment':
        return 'text-amber-300 bg-amber-950/80 border-amber-700';
      case 'Applied':
        return 'text-blue-300 bg-blue-950/80 border-blue-700';
      case 'Rejected':
        return 'text-slate-400 bg-slate-900 border-slate-700';
      case 'Wishlist':
      default:
        return 'text-slate-300 bg-slate-800 border-white/10';
    }
  };

  return (
    <div className="p-4 space-y-3 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-rose-400" />
            FAANG & MNC Pipeline
          </h2>
          <p className="text-xs text-slate-400">Target Companies & Application Stage Tracker</p>
        </div>

        <button
          onClick={() => {
            soundService.playTap();
            setShowAddModal(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Target
        </button>
      </div>

      {/* Filter Status Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {['All', ...statuses].map((st) => (
          <button
            key={st}
            onClick={() => {
              soundService.playTap();
              setSelectedStatusFilter(st);
            }}
            className={`px-3 py-1 rounded-lg font-medium border transition-all whitespace-nowrap ${
              selectedStatusFilter === st
                ? 'bg-rose-950 text-rose-200 border-rose-700'
                : 'bg-[#121622] text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Companies List */}
      <div className="space-y-2.5">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="bg-[#121622] border border-white/10 p-3.5 rounded-2xl shadow-sm hover:border-slate-700 transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{company.name}</h3>
                  <span className="text-[9px] bg-rose-950/80 text-rose-300 border border-rose-800/40 px-1.5 py-0.2 rounded font-semibold font-mono">
                    {company.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">{company.role}</p>
              </div>

              {/* Status Badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border font-mono ${getStatusColor(company.status)}`}>
                {company.status}
              </span>
            </div>

            {/* Compensation & Referral pills */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
              {company.salaryRange && (
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-900/30 font-mono text-[10px]">
                  <DollarSign className="w-3 h-3" /> {company.salaryRange}
                </span>
              )}
              <span className="bg-slate-800/80 px-2 py-0.5 rounded-md text-[10px] text-slate-300 border border-white/5">
                Referral: <strong className="text-white">{company.referralStatus}</strong>
              </span>
              {company.targetDate && (
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Target: {company.targetDate}
                </span>
              )}
            </div>

            {/* Notes */}
            {company.notes && (
              <p className="text-[11px] bg-[#0A0D15] text-slate-300 p-2 rounded-xl border border-white/5 font-sans leading-relaxed">
                📌 {company.notes}
              </p>
            )}

            {/* Quick Status Selector */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
              <span className="text-slate-500">Update Stage:</span>
              <select
                value={company.status}
                onChange={(e) => handleStatusUpdate(company, e.target.value as ApplicationStatus)}
                className="bg-[#0A0D15] text-xs text-slate-200 border border-white/10 rounded-lg px-2 py-1 focus:outline-none"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-[#121622] border border-white/10 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-2.5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Add Target Company Pipeline</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Company Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Google / Stripe / Datadog"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as typeof tier)}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="FAANG">FAANG / Big Tech</option>
                  <option value="Tier-1 Product">Tier-1 Product Unicorn</option>
                  <option value="Top MNC">Top MNC / Fintech</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Application Stage</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE-2 (Backend / Full Stack)"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Referral Status</label>
                <select
                  value={referralStatus}
                  onChange={(e) => setReferralStatus(e.target.value as typeof referralStatus)}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="None">None</option>
                  <option value="Requested">Requested via Blind / LinkedIn</option>
                  <option value="Secured">Secured by Employee</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Target Comp Range</label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="$180k - $220k"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Interview Notes & Round Details</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key rounds: 2 DSA + 1 HLD + 1 LLD Machine Coding..."
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Track Company
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
