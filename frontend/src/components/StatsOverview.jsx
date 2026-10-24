import React from 'react';
import { ShieldCheck, Server, Gauge, AlertCircle, TrendingUp } from 'lucide-react';

export function StatsOverview({ summary, platformsCount, incidentsCount }) {
  const operationalCount = summary?.operationalCount ?? 0;
  const totalPlatforms = summary?.totalPlatforms || platformsCount || 0;
  const degradedCount = summary?.degradedCount ?? 0;
  const downCount = summary?.downCount ?? 0;
  const avgLatency = summary?.avgLatencyMs ?? 0;
  const healthScore = summary?.systemHealthScore ?? (totalPlatforms > 0 ? Math.round((operationalCount / totalPlatforms) * 100) : 100);

  const getLatencyColor = (latency) => {
    if (latency <= 0 || latency >= 7000) return 'text-rose-400';
    if (latency <= 850) return 'text-emerald-400';
    return 'text-amber-400';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall System Health */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            System Health
          </span>
          <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {healthScore}%
          </span>
          <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> Nominal
          </span>
        </div>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* 2. Operational Platforms Ratio */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Monitored Services
          </span>
          <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
            <Server className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {operationalCount}
            <span className="text-lg text-slate-500 font-normal">/{totalPlatforms}</span>
          </span>
          <span className="text-xs font-medium text-slate-400">
            Online
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {operationalCount} Ok
          </span>
          {degradedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> {degradedCount} Degraded
            </span>
          )}
          {downCount > 0 && (
            <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> {downCount} Down
            </span>
          )}
        </div>
      </div>

      {/* 3. Average Ping Latency */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Avg Ping Latency
          </span>
          <div className="p-2 rounded-xl bg-violet-950/60 border border-violet-500/30 text-violet-400">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold font-mono tracking-tight ${getLatencyColor(avgLatency)}`}>
            {avgLatency}
          </span>
          <span className="text-xs font-semibold font-mono text-slate-400">ms</span>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Operational: &lt;850ms &bull; Degraded: &gt;850ms &bull; Down: &gt;7s
        </p>
      </div>

      {/* 4. Active Incident Notices */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Incident Notices
          </span>
          <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {incidentsCount}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Active / Recent Logs
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Live announcements from official feeds & incident telemetry
        </p>
      </div>
    </div>
  );
}
