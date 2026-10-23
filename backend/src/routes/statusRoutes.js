import express from 'express';
import { getCachedStatus, pollAllPlatforms, isPolling } from '../services/statusPoller.js';

const router = express.Router();

/**
 * GET /api/status
 * Returns aggregated health data, response times, and latest incident notices
 */
router.get('/', async (req, res) => {
  try {
    const data = await getCachedStatus();
    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('[API /api/status] Error fetching status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve social platform health status',
      details: error.message
    });
  }
});

/**
 * POST /api/status/refresh
 * Triggers an immediate re-check of all platforms and returns fresh data
 */
router.post('/refresh', async (req, res) => {
  try {
    const freshData = await pollAllPlatforms();
    res.json({
      success: true,
      message: 'Status refreshed successfully',
      ...freshData
    });
  } catch (error) {
    console.error('[API /api/status/refresh] Refresh failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh platform status',
      details: error.message
    });
  }
});

/**
 * GET /api/status/platforms/:id
 * Returns data for a specific platform
 */
router.get('/platforms/:id', async (req, res) => {
  try {
    const data = await getCachedStatus();
    const platform = data.platforms.find(
      (p) => p.id.toLowerCase() === req.params.id.toLowerCase()
    );

    if (!platform) {
      return res.status(404).json({
        success: false,
        error: `Platform '${req.params.id}' not found`
      });
    }

    const platformIncidents = data.incidents.filter(
      (inc) => inc.platformId.toLowerCase() === req.params.id.toLowerCase()
    );

    res.json({
      success: true,
      platform,
      incidents: platformIncidents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve platform details',
      details: error.message
    });
  }
});

export default router;
