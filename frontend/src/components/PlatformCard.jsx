import React from 'react';
import { PlatformIcon } from './PlatformIcons';
import { CheckCircle2, AlertTriangle, AlertOctagon, ExternalLink, ArrowUpRight, Clock, Wifi } from 'lucide-react';

export function PlatformCard({ platform }) {
  const {
    name,
    category,
    status,
    statusMessage,
    latencyMs,
    uptimePercent,
    lastChecked,
    latencyHistory = [],
    website,
    statusPageUrl,
    httpStatusCode
  } = platform;

  // Format relative time for last checked
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  // Status badge styling
  const getStatusBadge = () => {
    switch (status) {
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Operational
          </span>
        );
      case 'Degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <AlertTriangle className="w-3.5 h-3.5" />
            Degraded
          </span>
        );
      case 'Down':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            <AlertOctagon className="w-3.5 h-3.5" />
            Down
          </span>
        );
    }
  };

  // Latency styling & speed indicator: Operational (< 850ms), Degraded (> 850ms), Down (> 7s / unreachable)
  const getLatencyStyle = (latency) => {
    if (latency <= 0 || latency >= 7000) return { color: 'text-rose-400', label: 'Down' };
    if (latency <= 850) return { color: 'text-emerald-400', label: 'Operational' };
    return { color: 'text-amber-400', label: 'Degraded' };
  };

  const latencyMeta = getLatencyStyle(latencyMs);

  // Maximum latency for sparkline normalization (min 400ms max 1500ms)
  const maxHistoryLatency = Math.max(
    ...latencyHistory.map((h) => h.latency || 0),
    400
  );

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between group transition-all duration-300">
      {/* Top row: Platform identity & Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:border-indigo-500/40 transition-colors shadow-inner">
              <PlatformIcon name={name} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight group-hover:text-indigo-200 transition-colors">
                  {name}
                </h3>
                {httpStatusCode > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    HTTP {httpStatusCode}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">{category}</span>
            </div>
          </div>

          <div>{getStatusBadge()}</div>
        </div>

        {/* Status description note */}
        <p className="mt-3 text-xs text-slate-300 line-clamp-1">
          {statusMessage || 'All operational endpoints responsive'}
        </p>

        {/* Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 py-3 px-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          {/* Latency */}
          <div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
              <Wifi className="w-3 h-3 text-slate-400" /> Ping Latency
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className={`text-lg font-bold font-mono ${latencyMeta.color}`}>
                {latencyMs > 0 ? latencyMs : '--'}
              </span>
              <span className="text-xs text-slate-500 font-mono">ms</span>
              <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-800/80 ${latencyMeta.color}`}>
                {latencyMeta.label}
              </span>
            </div>
          </div>

          {/* Uptime */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Reliability</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-slate-100">
                {uptimePercent}%
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase">
                Uptime
              </span>
            </div>
          </div>
        </div>

        {/* Latency History Micro-chart / Sparkline */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Recent Ping Trend</span>
            <span className="font-mono text-[10px]">Last {latencyHistory.length} checks</span>
          </div>
          <div className="h-9 flex items-end gap-1.5 px-2 py-1 bg-slate-950/60 rounded-lg border border-slate-800/60">
            {latencyHistory.length === 0 ? (
              <div className="w-full text-center text-[10px] text-slate-500">
                Sampling latency data...
              </div>
            ) : (
              latencyHistory.map((sample, idx) => {
                const heightPercent = Math.max(
                  15,
                  Math.min(100, Math.round((sample.latency / maxHistoryLatency) * 100))
                );
                const barColor =
                  sample.status === 'Down' || sample.latency >= 7000
                    ? 'bg-rose-500'
                    : sample.latency > 850
                    ? 'bg-amber-400'
                    : 'bg-indigo-500 hover:bg-indigo-400';

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col justify-end items-center h-full group/bar relative"
                  >
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${barColor}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 hidden group-hover/bar:flex px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-white whitespace-nowrap border border-slate-700 z-10 shadow-lg">
                      {sample.latency}ms
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer / Meta info & External link */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 text-[11px]">
          <Clock className="w-3 h-3 text-slate-500" />
          Checked {formatTimeAgo(lastChecked)}
        </span>

        <div className="flex items-center gap-2">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer noopener"
              title={`Visit ${name}`}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {statusPageUrl && (
            <a
              href={statusPageUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Status Page</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
