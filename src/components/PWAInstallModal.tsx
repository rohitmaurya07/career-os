import React, { useState, useEffect } from 'react';
import { pwaManager } from '../services/pwa';
import {
  Download,
  X,
  Smartphone,
  WifiOff,
  Zap,
  CheckCircle2,
  Share,
  PlusSquare,
  Sparkles,
  RefreshCw,
  Laptop,
} from 'lucide-react';
import { soundService } from '../services/audio';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [isInstallable, setIsInstallable] = useState(pwaManager.isInstallable());
  const [isInstalled, setIsInstalled] = useState(pwaManager.getIsInstalled());
  const [isOnline, setIsOnline] = useState(pwaManager.getIsOnline());
  const [updateAvailable, setUpdateAvailable] = useState(pwaManager.getUpdateAvailable());
  const [installSuccess, setInstallSuccess] = useState(false);
  const isIOS = pwaManager.isIOS();

  useEffect(() => {
    const unsubscribe = pwaManager.subscribe(() => {
      setIsInstallable(pwaManager.isInstallable());
      setIsInstalled(pwaManager.getIsInstalled());
      setIsOnline(pwaManager.getIsOnline());
      setUpdateAvailable(pwaManager.getUpdateAvailable());
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    soundService.playTap();
    const outcome = await pwaManager.promptInstall();
    if (outcome === 'accepted') {
      soundService.playLevelUp();
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const handleUpdate = () => {
    soundService.playTap();
    pwaManager.applyUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-white/10 rounded-3xl p-5 max-w-md w-full shadow-2xl max-h-[90vh] flex flex-col relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5A0E24] to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-950/40">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white tracking-tight">Install Progressive Web App</h3>
                <span className="text-[9px] bg-rose-950/80 text-rose-300 border border-rose-800/40 px-1.5 py-0.2 rounded font-mono font-bold">
                  PWA
                </span>
              </div>
              <p className="text-xs text-slate-400">Install CareerForge for offline practice on mobile & desktop</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-3.5 custom-scrollbar pr-1 text-xs">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090C13] border border-white/5 font-mono">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="text-slate-300 text-[11px]">
                {isOnline ? 'Connected (Live Sync & Updates)' : 'Offline Mode (Local Storage Active)'}
              </span>
            </div>

            <span className="text-[10px] text-rose-300 font-bold">
              {isInstalled ? 'App Installed' : 'Standalone Ready'}
            </span>
          </div>

          {/* Benefits Grid */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Native PWA Features
            </h4>

            <div className="grid grid-cols-1 gap-2">
              <div className="p-2.5 rounded-xl bg-[#181D29] border border-white/5 flex items-start gap-2.5">
                <WifiOff className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-[11px]">100% Offline Capability</p>
                  <p className="text-[10px] text-slate-400">
                    Practice DSA patterns, review roadmaps, and time study sessions without an internet connection.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#181D29] border border-white/5 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-[11px]">Instant Launch & Zero Latency</p>
                  <p className="text-[10px] text-slate-400">
                    Runs in fullscreen standalone mode without browser URL bars or navigation clutter.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#181D29] border border-white/5 flex items-start gap-2.5">
                <Laptop className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-[11px]">Cross-Platform Sync</p>
                  <p className="text-[10px] text-slate-400">
                    Install on Android, iPhone/iPad, Mac, Windows, or Linux with standard app shortcuts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Update Available Banner if any */}
          {updateAvailable && (
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-300 text-xs">New Update Available</p>
                <p className="text-[10px] text-amber-400/80">Reload to apply latest features</p>
              </div>
              <button
                onClick={handleUpdate}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1 hover:bg-amber-400 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Update
              </button>
            </div>
          )}

          {/* iOS Safari Instructions */}
          {isIOS && (
            <div className="p-3.5 rounded-2xl bg-[#181D29] border border-rose-900/40 space-y-2">
              <p className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                <Share className="w-3.5 h-3.5" />
                How to install on iOS Safari:
              </p>
              <ol className="space-y-1.5 text-slate-300 text-[11px] list-decimal list-inside leading-relaxed">
                <li>
                  Tap the <strong className="text-white">Share button</strong> at the bottom of Safari.
                </li>
                <li>
                  Scroll down and select <strong className="text-white">“Add to Home Screen”</strong>{' '}
                  <PlusSquare className="w-3 h-3 inline text-rose-400" />.
                </li>
                <li>
                  Tap <strong className="text-white">“Add”</strong> in the top-right corner.
                </li>
              </ol>
            </div>
          )}

          {/* Success state */}
          {installSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 flex items-center gap-2 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>CareerForge has been successfully added to your home screen!</span>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="pt-2 border-t border-white/10 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>

          {isInstallable && !isInstalled && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#5A0E24] to-rose-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          )}

          {isInstalled && (
            <button
              type="button"
              disabled
              className="flex-1 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 opacity-90 cursor-default"
            >
              <CheckCircle2 className="w-4 h-4" />
              Installed on Device
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
