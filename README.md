# 🌐 Social Media Health & Status Aggregator

A full-stack, real-time social platform health monitoring dashboard featuring automated 30-second background cron polling, ping latency telemetry, official incident aggregation, and a modern dark-themed UI built with React, Vite, Tailwind CSS, and Lucide React.

[![Status](https://img.shields.io/badge/Status-Operational-10b981?style=for-the-badge&logo=statuspage)](https://github.com/AnshikaBansal787/Social_Media_Health_Aggregator)
[![Node Version](https://img.shields.io/badge/Node-v18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## ⚡ Key Highlights

- **Background Automated Cron Poller**: Built with `node-cron`, periodically sweeping edge endpoints every 30 seconds (`*/30 * * * * *`).
- **Ping Latency & Reliability Telemetry**: Real-time roundtrip timing (`ms`), status verification, and dynamic performance classification (`Operational`, `Degraded`, `Down`).
- **Multi-Service Incident Feed**: Aggregates official status page notifications and incident bulletins (Discord, Reddit, GitHub, WhatsApp, Instagram, YouTube, Twitter/X, Telegram).
- **Latency Sparklines**: Visualizes last 15 health checks for each service directly on the platform cards.
- **Synchronized 30s Countdown Widget**: Interactive timer ring showing when the next background poll will occur, with pause/resume controls and on-demand polling.
- **Modern Dark-Mode UI**: Implemented with Tailwind CSS (`bg-slate-950` base, glassmorphic panels, glowing status dots, and crisp typography).
- **Keyboard Shortcuts**: Press <kbd>R</kbd> anywhere on the dashboard for instant manual refresh.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Target Platforms
        P1["Discord API / Statuspage"]
        P2["Reddit API / Statuspage"]
        P3["GitHub API / Statuspage"]
        P4["WhatsApp / Meta Edge"]
        P5["Instagram / Meta Edge"]
        P6["YouTube / Google Edge"]
        P7["Twitter/X & Telegram"]
    end

    subgraph Node.js Backend [Port 5000]
        CRON["cronPoller.js\n(node-cron: */30 * * * * *)"]
        POLLER["statusPoller.js\n(Axios + latency probe + cache)"]
        CONF["platformConfig.js\n(Endpoints & metadata)"]
        ROUTES["statusRoutes.js\n(GET /api/status, POST /refresh)"]
        SERVER["server.js\n(Express + CORS)"]

        CRON -->|Every 30s or on startup| POLLER
        CONF --> POLLER
        POLLER -->|Parallel HTTP Ping & API calls| Target Platforms
        ROUTES -->|Reads cached data| POLLER
        SERVER --> ROUTES
    end

    subgraph React Frontend [Port 5173 - Vite]
        HOOK["useStatusData.js\n(30s countdown & polling state)"]
        APP["App.jsx\n(Search, Category Filter, Layout)"]
        HEADER["Header.jsx\n(Live status & Refresh)"]
        COUNTDOWN["TimerCountdown.jsx\n(Radial SVG ring)"]
        STATS["StatsOverview.jsx\n(4 KPI Metric cards)"]
        CARDS["PlatformCard.jsx\n(Latency, sparklines, badges)"]
        FEED["IncidentFeed.jsx\n(Bulletins & severity)"]

        HOOK -->|Axios via Vite proxy| ROUTES
        APP --> HEADER
        APP --> STATS
        APP --> COUNTDOWN
        APP --> CARDS
        APP --> FEED
    end
```

---

## 📁 Project Structure

```text
Social_Media_Health_Aggregator/
├── backend/
│   ├── src/
│   │   ├── jobs/
│   │   │   └── cronPoller.js          # Background 30s node-cron scheduler
│   │   ├── routes/
│   │   │   └── statusRoutes.js        # Express routes (/api/status, /refresh)
│   │   ├── services/
│   │   │   ├── platformConfig.js      # Monitored platforms & endpoints
│   │   │   └── statusPoller.js        # Health checking, ping measurement & cache
│   │   └── server.js                  # Express app listening on Port 5000
│   ├── .env.example                   # Template for backend environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx             # Top bar with live status dot & refresh button
│   │   │   ├── IncidentFeed.jsx       # Incident bulletins with severity filter
│   │   │   ├── PlatformCard.jsx       # Individual platform card with sparkline & ping
│   │   │   ├── PlatformIcons.jsx      # Clean brand SVG icons
│   │   │   ├── StatsOverview.jsx      # System health, latency & uptime summary
│   │   │   └── TimerCountdown.jsx     # 30-second circular countdown widget
│   │   ├── hooks/
│   │   │   └── useStatusData.js       # Periodic polling, countdown state & refetching
│   │   ├── App.jsx                    # Main dashboard layout with category filters
│   │   ├── index.css                  # Dark mode, glassmorphism & glow styles
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js                 # Vite configuration with backend proxy
│   └── package.json
│
├── package.json                       # Monorepo root runner
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ or v24+ recommended)
- **npm**: v9.0.0 or later
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/AnshikaBansal787/Social_Media_Health_Aggregator.git
cd Social_Media_Health_Aggregator
```

### 2. Install Dependencies

You can install both backend and frontend dependencies in their respective folders:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Setup Environment Variables

Copy the example environment file for the backend:

```bash
cd ../backend
cp .env.example .env
```

*(Default `PORT=5000` is already configured)*

### 4. Running the Application

Open two terminal windows:

#### Terminal 1 — Backend (Port 5000):
```bash
cd backend
npm start
# Or for live auto-reload during development:
npm run dev
```

The backend server will start on `http://localhost:5000` and immediately execute an initial ping sweep across all monitored platforms.

#### Terminal 2 — Frontend (Port 5173 - Vite):
```bash
cd frontend
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 REST API Reference

The backend runs on **Port 5000** and provides the following endpoints:

### 1. `GET /api/status`
Returns aggregated health metrics, response latencies, platform states, and recent incidents.

**Response Structure (`200 OK`):**
```json
{
  "success": true,
  "timestamp": "2026-10-11T08:31:30.971Z",
  "summary": {
    "totalPlatforms": 8,
    "operationalCount": 8,
    "degradedCount": 0,
    "downCount": 0,
    "avgLatencyMs": 234,
    "overallStatus": "Operational",
    "systemHealthScore": 100
  },
  "platforms": [
    {
      "id": "discord",
      "name": "Discord",
      "category": "Chat & Gaming",
      "website": "https://discord.com",
      "status": "Operational",
      "statusMessage": "Responsive (200) in 66ms",
      "httpStatusCode": 200,
      "latencyMs": 66,
      "uptimePercent": 100,
      "lastChecked": "2026-10-11T08:31:30.710Z",
      "latencyHistory": [
        { "timestamp": "...", "latency": 84, "status": "Operational" },
        { "timestamp": "...", "latency": 66, "status": "Operational" }
      ]
    }
  ],
  "incidents": [
    {
      "id": "inc-meta-1",
      "platformId": "instagram",
      "platformName": "Instagram",
      "title": "Intermittent Feed Refresh Delay in EMEA Region",
      "status": "Monitoring",
      "impact": "minor",
      "startedAt": "2026-10-11T07:46:29.504Z",
      "updatedAt": "2026-10-11T08:19:29.505Z",
      "message": "Engineers deployed a mitigation patch for CDN edge routing..."
    }
  ]
}
```

### 2. `POST /api/status/refresh`
Forces an immediate re-check of all platforms without waiting for the next cron cycle and returns freshly collected status data.

### 3. `GET /api/status/platforms/:id`
Retrieves granular metrics, latency trend history, and incidents isolated for a single platform (e.g., `/api/status/platforms/whatsapp`).

### 4. `GET /api/health`
Basic health probe checking backend service uptime.

---

## 🎨 Frontend Features

1. **Header Component**:
   - Live operational badge with pulsing emerald/amber/rose indicators.
   - Last sync timestamp and interactive manual refresh button.
2. **Stats Overview Cards**:
   - System health score percentage bar.
   - Total monitored vs. online services ratio.
   - Average ping latency in milliseconds.
   - Total active incident logs.
3. **Timer Countdown Widget**:
   - Animated SVG circular gauge counting down from 30 seconds.
   - Pause / Resume auto-polling button.
   - Instant "Poll Now" action.
4. **Platform Cards**:
   - Service identity & brand logo (WhatsApp, Instagram, YouTube, X, Discord, Reddit, GitHub, Telegram).
   - Operational status badge (Operational / Degraded / Down).
   - Ping latency gauge (Fast < 200ms, Moderate 200–500ms, High > 500ms).
   - Interactive latency micro-chart (sparkline bar chart showing ping fluctuations).
   - HTTP status code chip (e.g., `HTTP 200`).
   - Links to official websites and external status pages.
5. **Incident Feed Panel**:
   - Searchable status update feed with filter toggles (`All`, `Active`, `Resolved`).
   - Incident severity indicators (`Critical`, `Major`, `Minor`, `None`).
   - Timestamp and engineering mitigation notes.
6. **Search & Category Filters**:
   - Real-time search across service names and descriptions.
   - Category filtering (`Messaging`, `Social Media`, `Streaming & Video`, `Chat & Gaming`, `Developer Platform`, etc.).

---

## 🛠️ Monitored Platforms

| Platform | Category | Check Type | Endpoint Verified |
| :--- | :--- | :--- | :--- |
| **WhatsApp** | Messaging | HTTP Head/Get | `web.whatsapp.com` |
| **Instagram** | Social Media | HTTP Head/Get | `instagram.com` |
| **YouTube** | Streaming & Video | HTTP Head/Get | `youtube.com` |
| **Twitter / X** | Social Media | HTTP Head/Get | `x.com` |
| **Discord** | Chat & Gaming | Statuspage API + Ping | `discordstatus.com/api/v2/summary.json` |
| **Reddit** | Community | Statuspage API + Ping | `redditstatus.com/api/v2/summary.json` |
| **GitHub** | Developer Platform | Statuspage API + Ping | `githubstatus.com/api/v2/summary.json` |
| **Telegram** | Messaging | HTTP Head/Get | `web.telegram.org` |

---

## 💻 Tech Stack Summary

- **Backend**: Node.js, Express, Axios, Node-Cron, CORS, Dotenv
- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide React, Axios
- **Design System**: Slate-950 dark theme, glassmorphic panels, glowing neon accents, Plus Jakarta Sans typography

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
