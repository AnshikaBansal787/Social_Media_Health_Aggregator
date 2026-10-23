import cron from 'node-cron';
import { pollAllPlatforms, isPolling } from '../services/statusPoller.js';

let cronTask = null;

/**
 * Initializes and starts the background polling cron job
 * Runs every 30 seconds: every 30s expression
 */
export function startCronJob() {
  console.log('[CRON] Initializing background social platform health poller (interval: 30s)...');

  // Perform an immediate initial poll so the cache is primed on startup
  pollAllPlatforms()
    .then((data) => {
      console.log(
        `[CRON] Initial health poll complete: ${data.summary.operationalCount}/${data.summary.totalPlatforms} operational (avg ping: ${data.summary.avgLatencyMs}ms)`
      );
    })
    .catch((err) => {
      console.error('[CRON] Error during initial platform health poll:', err.message);
    });

  // Schedule task to run every 30 seconds
  // node-cron supports 6-field syntax for second-level scheduling
  cronTask = cron.schedule('*/30 * * * * *', async () => {
    const timestamp = new Date().toLocaleTimeString();
    try {
      if (isPolling()) {
        console.log(`[CRON ${timestamp}] Previous poll still in progress, skipping cycle.`);
        return;
      }
      console.log(`[CRON ${timestamp}] Executing scheduled health poll for all platforms...`);
      const result = await pollAllPlatforms();
      console.log(
        `[CRON ${timestamp}] Poll finished: ${result.summary.operationalCount}/${result.summary.totalPlatforms} platforms operational. Avg latency: ${result.summary.avgLatencyMs}ms`
      );
    } catch (error) {
      console.error(`[CRON ${timestamp}] Health poll failed:`, error.message);
    }
  });

  return cronTask;
}

/**
 * Stops the scheduled cron job gracefully
 */
export function stopCronJob() {
  if (cronTask) {
    cronTask.stop();
    console.log('[CRON] Background health poller stopped.');
  }
}
