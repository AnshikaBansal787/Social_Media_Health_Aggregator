import React, { useState, useEffect, useMemo } from 'react';
import { useStatusData } from './hooks/useStatusData';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { TimerCountdown } from './components/TimerCountdown';
import { PlatformCard } from './components/PlatformCard';
import { IncidentFeed } from './components/IncidentFeed';
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Radio,
  CheckCircle2,
  Shield,
  Layers
} from 'lucide-react';

export default function App() {
  const {
    data,
    loading,
    isRefreshing,
    error,
    lastRefreshedAt,
    secondsUntilNextPoll,
    totalPollInterval,
    isPaused,
    manualRefresh,
    togglePause
  } = useStatusData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Operational', 'Issues'

  // Hotkey listener: 'r' to trigger manual refresh
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === 'r' || e.key === 'R') &&
        !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())
      ) {
        manualRefresh();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [manualRefresh]);

  const platforms = useMemo(() => data?.platforms || [], [data]);
  const incidents = useMemo(() => data?.incidents || [], [data]);
  const summary = data?.summary;

  // Derive categories from platforms
  const categories = useMemo(() => {
    const set = new Set(platforms.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [platforms]);

  // Filtered platforms
  const filteredPlatforms = useMemo(() => {
    return platforms.filter((platform) => {
      const matchesSearch =
        platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (platform.description &&
          platform.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || platform.category === selectedCategory;

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Operational' && platform.status === 'Operational') ||
        (statusFilter === 'Issues' && platform.status !== 'Operational');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [platforms, searchQuery, selectedCategory, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      {/* 1. Header with live status and refresh */}
      <Header
        summary={summary}
        isRefreshing={isRefreshing}
        onRefresh={manualRefresh}
        lastRefreshedAt={lastRefreshedAt}
        loading={loading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        {/* Error notification banner if backend is unreachable */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-rose-950/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">
                  Unable to connect to Status Service (Port 5000)
                </p>
                <p className="text-xs text-rose-300 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={manualRefresh}
              className="px-3 py-1.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          </div>
        )}

        {/* 2. Top Stats Overview */}
        <StatsOverview
          summary={summary}
          platformsCount={platforms.length}
          incidentsCount={incidents.length}
        />

        {/* 3. Timer Countdown Widget */}
        <TimerCountdown
          secondsLeft={secondsUntilNextPoll}
          totalSeconds={totalPollInterval}
          isPaused={isPaused}
          onTogglePause={togglePause}
          onManualRefresh={manualRefresh}
          isRefreshing={isRefreshing}
        />

        {/* 4. Main Content Area: Platforms Grid & Incident Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Platforms list and filter bar (8 cols on large screens) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Filter & Search Bar */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-3.5 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search platforms (e.g. WhatsApp)..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Status Toggle Pills */}
                <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={() => setStatusFilter('All')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                      statusFilter === 'All'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({platforms.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('Operational')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                      statusFilter === 'Operational'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Operational
                  </button>
                  <button
                    onClick={() => setStatusFilter('Issues')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                      statusFilter === 'Issues'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Issues (
                    {platforms.filter((p) => p.status !== 'Operational').length})
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Filter:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium ${
                      selectedCategory === cat
                        ? 'bg-slate-800 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Platforms Cards Grid */}
            {loading && platforms.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="glass-panel rounded-2xl p-5 border border-slate-800/80 animate-pulse space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800" />
                        <div className="space-y-1.5">
                          <div className="w-24 h-4 bg-slate-800 rounded" />
                          <div className="w-16 h-3 bg-slate-800/60 rounded" />
                        </div>
                      </div>
                      <div className="w-20 h-6 bg-slate-800 rounded-full" />
                    </div>
                    <div className="h-14 bg-slate-900/60 rounded-xl" />
                    <div className="h-8 bg-slate-950/60 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredPlatforms.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800/80">
                <Search className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-200">
                  No services matching your filter
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting your search query or category selection.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setStatusFilter('All');
                  }}
                  className="mt-4 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPlatforms.map((platform) => (
                  <PlatformCard key={platform.id} platform={platform} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Incident Feed (4 cols on large screens) */}
          <div className="lg:col-span-4 sticky top-28">
            <IncidentFeed incidents={incidents} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/90 py-6 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>
              Social Media Health & Status Aggregator &bull; Automated Edge Monitoring
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Cron Interval: 30s</span>
            <span>&bull;</span>
            <span>Backend: Port 5000</span>
            <span>&bull;</span>
            <span>Frontend: Port 5173</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
