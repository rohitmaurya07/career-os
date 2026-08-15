import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Zap, Sparkles, Clock, Music, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubjectId, TaskItem } from '../types';
import { soundService } from '../services/audio';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: TaskItem;
  onCompleteSession: (subjectId: SubjectId, durationMinutes: number, xpEarned: number) => void;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
  initialTask,
  onCompleteSession,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(initialTask?.estimatedMinutes || 25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(selectedMinutes * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(initialTask?.subjectId || 'DSA');
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [ambientAudio, setAmbientAudio] = useState<boolean>(false);

  const noiseNodeRef = useRef<AudioNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Update timer whenever selectedMinutes changes while not active
  useEffect(() => {
    if (!isActive && !sessionFinished) {
      setSecondsRemaining(selectedMinutes * 60);
    }
  }, [selectedMinutes, isActive, sessionFinished]);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setSessionFinished(false);
      stopAmbientNoise();
      setAmbientAudio(false);
      return;
    }

    const minutes = initialTask?.estimatedMinutes || 25;
    setSelectedMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setSelectedSubject(initialTask?.subjectId || 'DSA');
  }, [isOpen, initialTask]);

  useEffect(() => () => stopAmbientNoise(), []);

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsRemaining === 0) {
      // Completed!
      setIsActive(false);
      setSessionFinished(true);
      stopAmbientNoise();
      soundService.playTimerComplete();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5A0E24', '#E11D48', '#F59E0B', '#38BDF8'],
        });
      } catch {
        // Safe
      }
      const xpEarned = Math.round(selectedMinutes * 2);
      onCompleteSession(selectedSubject, selectedMinutes, xpEarned);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining, selectedMinutes, selectedSubject, onCompleteSession]);

  // Ambient sound synthesizer
  const toggleAmbientNoise = () => {
    if (ambientAudio) {
      stopAmbientNoise();
      setAmbientAudio(false);
    } else {
      startAmbientNoise();
      setAmbientAudio(true);
    }
  };

  const startAmbientNoise = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create brown/pink low-frequency ambient hum
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 0.15;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;
    } catch {
      // Audio fallback
    }
  };

  const stopAmbientNoise = () => {
    try {
      if (noiseNodeRef.current) {
        (noiseNodeRef.current as AudioBufferSourceNode).stop();
        noiseNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch {
      // Safe
    }
  };

  if (!isOpen) return null;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const totalSecs = selectedMinutes * 60;
  const progressPercent = totalSecs > 0 ? ((totalSecs - secondsRemaining) / totalSecs) * 100 : 0;

  const handleReset = () => {
    soundService.playTap();
    setIsActive(false);
    setSecondsRemaining(selectedMinutes * 60);
    setSessionFinished(false);
    stopAmbientNoise();
    setAmbientAudio(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center flex flex-col items-center">
        {/* Close button */}
        <button
          id="btn-close-timer"
          onClick={() => {
            stopAmbientNoise();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {sessionFinished ? (
          /* Finished State */
          <div className="py-6 space-y-4 w-full">
            <div className="w-16 h-16 rounded-full bg-[#5A0E24] border-2 border-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-900/50 animate-bounce">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Focus Session Complete!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Deep work session in <span className="text-rose-300 font-semibold">{selectedSubject}</span>
              </p>
            </div>

            <div className="bg-[#0A0D15] p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Duration</span>
                <span className="font-mono text-white font-bold">{selectedMinutes} Minutes</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>XP Reward</span>
                <span className="font-mono text-amber-400 font-bold">+{selectedMinutes * 2} XP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Career Wealth Impact</span>
                <span className="text-emerald-400 font-semibold">+1.2% Momentum</span>
              </div>
            </div>

            <button
              id="btn-timer-another-session"
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-[#5A0E24] hover:bg-rose-800 text-white font-bold text-xs shadow-lg transition-all"
            >
              Start Another Session
            </button>
          </div>
        ) : (
          /* Active / Idle Timer State */
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="flex items-center gap-1.5 text-xs text-rose-300 font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Deep Focus Workstation
            </div>

            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
              disabled={isActive}
              className="px-3 py-1.5 rounded-xl bg-[#1A1F2C] border border-white/10 text-xs text-slate-200 focus:outline-none"
            >
              <option value="DSA">DSA & Algorithmic Practice</option>
              <option value="MERN">MERN / Full-Stack Project</option>
              <option value="System Design">System Design (HLD)</option>
              <option value="LLD">Low-Level Design (LLD)</option>
              <option value="Core CS">Core CS Fundamentals</option>
              <option value="Behavioral">Behavioral / STAR Stories</option>
            </select>

            {/* Circular Countdown Display with SVG Ring */}
            <div className="relative w-52 h-52 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90">
                {/* Background track */}
                <circle cx="104" cy="104" r="88" fill="none" stroke="#181D29" strokeWidth="8" />
                {/* Progress arc */}
                <circle
                  cx="104"
                  cy="104"
                  r="88"
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-mono tracking-tight text-white">{timeFormatted}</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  {isActive ? 'Flow State Active' : 'Ready to Focus'}
                </span>
                <span className="text-[10px] text-amber-400 font-mono mt-0.5">+{selectedMinutes * 2} XP</span>
              </div>
            </div>

            {/* Preset Time Buttons (25 min, 50 min, 90 min) */}
            {!isActive && (
              <div className="flex gap-2 w-full justify-center">
                {[25, 50, 90].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      soundService.playTap();
                      setSelectedMinutes(mins);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedMinutes === mins
                        ? 'bg-[#5A0E24] text-white border-rose-500 shadow-md'
                        : 'bg-[#181D29] text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            )}

            {/* Ambient Sound Generator Button */}
            <button
              onClick={toggleAmbientNoise}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                ambientAudio
                  ? 'bg-purple-950/60 text-purple-300 border-purple-700/50'
                  : 'bg-slate-800/60 text-slate-400 border-white/5 hover:text-slate-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>{ambientAudio ? 'Deep Brown Noise Playing' : 'Ambient Focus Noise'}</span>
            </button>

            {/* Timer Controls (Play/Pause, Reset) */}
            <div className="flex items-center gap-3 w-full pt-1">
              <button
                id="btn-timer-reset"
                onClick={handleReset}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/5"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                id="btn-timer-toggle-play"
                onClick={() => {
                  soundService.playTap();
                  setIsActive(!isActive);
                }}
                className={`flex-1 py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isActive
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-[#5A0E24] hover:bg-rose-800 shadow-rose-950/50'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 fill-white" /> Pause Session
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" /> Begin Focus Session
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
