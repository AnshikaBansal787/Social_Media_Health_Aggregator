import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import statusRoutes from './routes/statusRoutes.js';
import { startCronJob, stopCronJob } from './jobs/cronPoller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (port 5173) and production
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Social Media Health & Status Aggregator Backend',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Primary status routes
app.use('/api/status', statusRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Social Media Health & Status Aggregator API',
    version: '1.0.0',
    endpoints: {
      status: 'GET /api/status',
      refresh: 'POST /api/status/refresh',
      platform: 'GET /api/status/platforms/:id',
      health: 'GET /api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Social Media Health & Status Aggregator API`);
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(` Status endpoint: http://localhost:${PORT}/api/status`);
  console.log(`=======================================================`);

  // Start background cron monitoring (every 30 seconds)
  startCronJob();
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  stopCronJob();
  server.close(() => {
    console.log('Server closed. Process terminated.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;
