import React from 'react';
import { Timer, Pause, Play, RefreshCw, Zap } from 'lucide-react';

export function TimerCountdown({
  secondsLeft,
  totalSeconds = 30,
  isPaused,
  onTogglePause,
  onManualRefresh,
  isRefreshing
}) {
  // Calculate percentage of time elapsed (0% to 100%)
  const percentage = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  // SVG circular progress calculation
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-lg shadow-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left side: Countdown timer & info */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 40 40">
            {/* Background ring */}
            <circle
              cx="20"
              cy="20"
              r={radius}
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated active ring */}
            <circle
              cx="20"
              cy="20"
              r={radius}
              className={`transition-all duration-1000 ease-linear ${
                isPaused
                  ? 'text-amber-500'
                  : secondsLeft <= 5
                  ? 'text-indigo-400'
                  : 'text-indigo-500'
              }`}
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-slate-100">
              {secondsLeft}s
            </span>
          </div>
        </div>

        {/* Textual Description */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              Automated Health Poller
            </h3>
            {isPaused ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-600/30">
                Paused
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                Every {totalSeconds}s
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isPaused
              ? 'Auto-polling paused. Hit play to resume background health checks.'
              : `Next background sweep in ${secondsLeft} second${secondsLeft === 1 ? '' : 's'}.`}
          </p>
        </div>
      </div>

      {/* Right side: Quick Control Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Pause / Play Button */}
        <button
          onClick={onTogglePause}
          title={isPaused ? 'Resume countdown' : 'Pause countdown'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            isPaused
              ? 'bg-amber-950/40 text-amber-300 border-amber-600/40 hover:bg-amber-900/50'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          )}
        </button>

        {/* Immediate Sync Button */}
        <button
          onClick={onManualRefresh}
          disabled={isRefreshing}
          title="Force poll now"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Poll Now</span>
        </button>
      </div>
    </div>
  );
}
