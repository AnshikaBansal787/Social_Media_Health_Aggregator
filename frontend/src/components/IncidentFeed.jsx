import React, { useState } from 'react';
import { PlatformIcon } from './PlatformIcons';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Filter,
  Info
} from 'lucide-react';

export function IncidentFeed({ incidents = [] }) {
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'resolved'

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === 'active') {
      return inc.status.toLowerCase() !== 'resolved';
    }
    if (filter === 'resolved') {
      return inc.status.toLowerCase() === 'resolved';
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('resolved') || s.includes('completed')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-3 h-3" />
          Resolved
        </span>
      );
    }
    if (s.includes('monitoring')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950/80 text-indigo-400 border border-indigo-500/30">
          <Clock className="w-3 h-3" />
          Monitoring
        </span>
      );
    }
    if (s.includes('identified')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" />
          Identified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/30">
        <AlertTriangle className="w-3 h-3" />
        Investigating
      </span>
    );
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const diffMin = Math.floor((new Date() - date) / 60000);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 flex flex-col h-full shadow-lg shadow-black/20">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Live Incident Bulletins
            </h3>
            <p className="text-[11px] text-slate-400">
              Official status logs & telemetry reports
            </p>
          </div>
        </div>

        {/* Filter Pill Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({incidents.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'active'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'resolved'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Incident List */}
      <div className="mt-4 space-y-3.5 flex-1 overflow-y-auto max-h-[640px] pr-1">
        {filteredIncidents.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">
              No Current Incidents Reported
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              All monitored platforms are operating within baseline performance metrics.
            </p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all text-left group"
            >
              {/* Header meta */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                    <PlatformIcon name={incident.platformName} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    {incident.platformName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(incident.status)}
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {formatTimestamp(incident.updatedAt || incident.startedAt)}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {incident.title}
              </h4>

              {/* Message */}
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {incident.message}
              </p>

              {/* Impact Tag */}
              {incident.impact && incident.impact !== 'none' && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 uppercase tracking-wider font-semibold">
                    Impact Severity
                  </span>
                  <span
                    className={`font-semibold capitalize ${
                      incident.impact === 'critical'
                        ? 'text-rose-400'
                        : incident.impact === 'major'
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {incident.impact}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Feed Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-500" />
          Refreshes on each 30s cycle
        </span>
        <span className="text-slate-400 font-mono">
          {filteredIncidents.length} logs
        </span>
      </div>
    </div>
  );
}
