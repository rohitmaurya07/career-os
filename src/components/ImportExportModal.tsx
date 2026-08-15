import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  ShieldCheck,
  HardDrive,
  Copy,
  Check,
  FileCode,
  X,
} from 'lucide-react';
import { soundService } from '../services/audio';
import { AppStore } from '../services/storage';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'how-it-works'>('export');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
    stats?: any;
  }>({ type: 'idle' });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pasteJsonInput, setPasteJsonInput] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentBackupJson = AppStore.exportFullBackup();

  const handleDownloadBackup = () => {
    soundService.playTap();
    const blob = new Blob([currentBackupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareerForge_Backup_${new Date().toISOString().split('T')[0]}_v2.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    soundService.playTap();
    navigator.clipboard.writeText(currentBackupJson).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const processJsonData = (jsonStr: string) => {
    const res = AppStore.importFullBackup(jsonStr);
    if (res.success) {
      soundService.playLevelUp();
      setImportStatus({
        type: 'success',
        message: 'CareerForge backup imported successfully! All records, scores, and streak data have been restored.',
        stats: res.stats,
      });
      setTimeout(() => {
        onDataRestored();
      }, 1200);
    } else {
      soundService.playTap();
      setImportStatus({
        type: 'error',
        message: res.error || 'Failed to parse the imported JSON structure. Ensure it is a valid CareerForge backup file.',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        processJsonData(content);
      }
    };
    reader.onerror = () => {
      setImportStatus({
        type: 'error',
        message: 'Could not read file from storage disk. Please try again.',
      });
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        processJsonData(content);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteImport = () => {
    if (!pasteJsonInput.trim()) return;
    processJsonData(pasteJsonInput.trim());
  };

  const handleResetDefaults = () => {
    soundService.playTap();
    AppStore.resetToFactoryDefaults();
    setShowResetConfirm(false);
    onDataRestored();
    onClose();
  };

  return (
    <div
      id="import-export-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="import-export-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0F121A] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#141822] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5A0E24] to-rose-600 border border-rose-500/30 flex items-center justify-center text-white shadow-md">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Data Portability & Synchronization
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/40 px-1.5 py-0.5 rounded font-mono font-normal">
                  JSON Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Backup, export, restore, or transfer your complete FAANG preparation progress
              </p>
            </div>
          </div>
          <button
            id="btn-close-import-export-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#0B0E14] px-4">
          <button
            id="tab-export-data"
            onClick={() => {
              soundService.playTap();
              setActiveTab('export');
            }}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'export'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export Backup
          </button>
          <button
            id="tab-import-data"
            onClick={() => {
              soundService.playTap();
              setActiveTab('import');
            }}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'import'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import / Restore
          </button>
          <button
            id="tab-how-it-works"
            onClick={() => {
              soundService.playTap();
              setActiveTab('how-it-works');
            }}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'how-it-works'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            How This Works
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* EXPORT TAB */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141822] border border-white/5 space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Full Snapshot Generator</h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Creates an offline-safe JSON file containing your active profile, solved DSA questions, STAR behavioral stories, mock interview ratings, task status, study streaks, and customized weight parameters.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    id="btn-download-json-backup"
                    onClick={handleDownloadBackup}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#5A0E24] to-rose-600 hover:from-rose-800 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    Download .JSON Backup File
                  </button>

                  <button
                    id="btn-copy-json-clipboard"
                    onClick={handleCopyClipboard}
                    className="py-2.5 px-4 rounded-xl bg-[#1D2333] hover:bg-slate-700 border border-white/10 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Copy Raw JSON</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* JSON Preview Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>LIVE BACKUP PAYLOAD (SNAPSHOT)</span>
                  <span className="text-[10px] text-slate-500">
                    {(currentBackupJson.length / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="bg-[#0A0C12] border border-white/10 rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-[11px] text-emerald-400/90 leading-relaxed scrollbar-thin">
                  <pre>{currentBackupJson.slice(0, 1500)}...</pre>
                </div>
              </div>
            </div>
          )}

          {/* IMPORT TAB */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-white/10 hover:border-rose-500/50 bg-[#121622] hover:bg-[#161B2B]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <FileJson className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Click to Select or Drag & Drop Backup File</h4>
                  <p className="text-xs text-slate-400 mt-1">Supports any CareerForge .json export</p>
                </div>
              </div>

              {/* Paste JSON Raw Option */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Or Paste Raw JSON Backup Content:
                </label>
                <textarea
                  id="textarea-raw-json-import"
                  value={pasteJsonInput}
                  onChange={(e) => setPasteJsonInput(e.target.value)}
                  placeholder='{"user": {"name": "...", "careerWealthScore": 72}, "tasks": [...] }'
                  rows={4}
                  className="w-full bg-[#0A0C12] border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
                <button
                  id="btn-import-pasted-json"
                  disabled={!pasteJsonInput.trim()}
                  onClick={handlePasteImport}
                  className="w-full py-2.5 rounded-xl bg-[#5A0E24] hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-[#5A0E24] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Restore from Pasted JSON
                </button>
              </div>

              {/* Status Banner */}
              {importStatus.type === 'success' && (
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-start gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-emerald-300">{importStatus.message}</p>
                    {importStatus.stats && (
                      <p className="text-emerald-400/80 font-mono text-[11px]">
                        Restored {importStatus.stats.tasksCount} Tasks, {importStatus.stats.dsaCount} DSA problems, {importStatus.stats.storiesCount} STAR Stories (Score: {importStatus.stats.score}%)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {importStatus.type === 'error' && (
                <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-rose-300">{importStatus.message}</p>
                </div>
              )}

              {/* Danger Zone / Factory Reset */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300">Reset to Initial Curriculum</h4>
                  <p className="text-[11px] text-slate-500">Restore factory sample tasks, problems, and roadmaps</p>
                </div>
                {showResetConfirm ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetDefaults}
                      className="py-1 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="py-1 px-2.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="py-1.5 px-3 rounded-xl bg-red-950/40 border border-red-900/40 hover:bg-red-950 text-red-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Reset Data
                  </button>
                )}
              </div>
            </div>
          )}

          {/* HOW THIS WORKS TAB */}
          {activeTab === 'how-it-works' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="p-4 rounded-xl bg-[#141822] border border-white/5 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  1. Real-Time Dynamic Leveling Engine
                </h3>
                <p className="text-slate-400">
                  Every time you check a task, solve a LeetCode/DSA pattern, or complete a roadmap milestone, CareerForge triggers the <strong>Sync Engine</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 font-mono text-[11px]">
                  <li>Calculates weighted Subject Masteries across DSA (28%), System Design (18%), Core CS (14%), etc.</li>
                  <li>Generates your real-time <strong>Career Wealth Readiness Score</strong> (0–100%).</li>
                  <li>Dynamically assigns your Level (L1 Beginner up to L6 FAANG Ready) with instant sound FX and celebrations.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#141822] border border-white/5 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  2. Local-First Offline Storage + Express Sync
                </h3>
                <p className="text-slate-400">
                  All preparation records, mock notes, and study session minutes persist in your browser's persistent key-value store with complete offline PWA caching.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141822] border border-white/5 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  3. JSON Portability & Cross-Device Migration
                </h3>
                <p className="text-slate-400">
                  Export your backup whenever you want to switch laptops or save a weekly snapshot. Import the JSON on any device to restore your exact streak, level, and completed tasks with zero data loss.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#121620] flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Secure browser-based schema validator v2.0
          </p>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#1D2333] hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
