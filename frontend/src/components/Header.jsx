import React from 'react';
import { Activity, RefreshCw, Radio, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

export function Header({
  summary,
  isRefreshing,
  onRefresh,
  lastRefreshedAt,
  loading
}) {
  const overallStatus = summary?.overallStatus || 'Operational';

  const getStatusBadge = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          <span>Polling Health Nodes...</span>
        </div>
      );
    }

    if (overallStatus === 'Operational') {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold glow-emerald">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>All Monitored Systems Operational</span>
        </div>
      );
    }

    if (overallStatus === 'Degraded') {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-semibold glow-amber">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Degraded Performance Detected</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs font-semibold glow-rose">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
        </span>
        <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
        <span>Service Outage Alert</span>
      </div>
    );
  };

  const formatLastRefreshed = () => {
    if (!lastRefreshedAt) return 'Pending check...';
    return lastRefreshedAt.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-lg shadow-indigo-500/25 border border-indigo-400/20">
            <Activity className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Social<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Pulse</span>
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-950/80 text-indigo-400 border border-indigo-500/30">
                Live Status
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Real-time health, ping latency & incident aggregator
            </p>
          </div>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live status badge */}
          <div className="hidden md:block">
            {getStatusBadge()}
          </div>

          {/* Last Updated Meta */}
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[11px] text-slate-400 font-medium">Last Synced</span>
            <span className="text-xs font-mono font-semibold text-slate-200">
              {formatLastRefreshed()}
            </span>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing || loading}
            aria-label="Refresh status data"
            className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-indigo-500/50 shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 text-indigo-400 transition-transform duration-700 ${
                isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'
              }`}
            />
            <span className="text-xs font-semibold hidden sm:inline">
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </span>
            <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              R
            </kbd>
          </button>
        </div>
      </div>

      {/* Mobile status banner */}
      <div className="md:hidden px-4 pb-3 flex justify-between items-center border-t border-slate-800/40 pt-2 bg-slate-950/40">
        <div>{getStatusBadge()}</div>
        <div className="text-[11px] font-mono text-slate-400">
          Sync: {formatLastRefreshed()}
        </div>
      </div>
    </header>
  );
}
