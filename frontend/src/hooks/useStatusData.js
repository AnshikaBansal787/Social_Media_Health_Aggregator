import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const POLL_INTERVAL_SECONDS = 30;
// Uses relative /api for Vite proxy, or localhost:5000 if accessed directly
const API_BASE = import.meta.env.VITE_API_URL || '';

export function useStatusData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);
  const [secondsUntilNextPoll, setSecondsUntilNextPoll] = useState(POLL_INTERVAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);

  // Keep a ref to seconds to avoid stale closures in intervals
  const secondsRef = useRef(POLL_INTERVAL_SECONDS);
  secondsRef.current = secondsUntilNextPoll;

  const fetchStatus = useCallback(async (isManual = false) => {
    try {
      if (isManual) {
        setIsRefreshing(true);
      }
      setError(null);

      // If manual refresh, call the server's refresh trigger
      const endpoint = isManual ? `${API_BASE}/api/status/refresh` : `${API_BASE}/api/status`;
      const method = isManual ? 'post' : 'get';

      const response = await axios({
        method,
        url: endpoint,
        timeout: 10000
      });

      if (response.data && response.data.success) {
        setData(response.data);
        setLastRefreshedAt(new Date());
        setSecondsUntilNextPoll(POLL_INTERVAL_SECONDS);
      } else {
        throw new Error(response.data?.error || 'Invalid API response format');
      }
    } catch (err) {
      console.error('[useStatusData] Polling error:', err);
      const message =
        err.response?.data?.error ||
        err.message ||
        'Unable to reach backend status service on port 5000';
      setError(message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchStatus(false);
  }, [fetchStatus]);

  // Countdown timer effect (ticks every second)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSecondsUntilNextPoll((prev) => {
        if (prev <= 1) {
          fetchStatus(false);
          return POLL_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, fetchStatus]);

  const manualRefresh = useCallback(() => {
    return fetchStatus(true);
  }, [fetchStatus]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const resetCountdown = useCallback(() => {
    setSecondsUntilNextPoll(POLL_INTERVAL_SECONDS);
  }, []);

  return {
    data,
    loading,
    isRefreshing,
    error,
    lastRefreshedAt,
    secondsUntilNextPoll,
    totalPollInterval: POLL_INTERVAL_SECONDS,
    isPaused,
    manualRefresh,
    togglePause,
    resetCountdown
  };
}
