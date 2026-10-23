# ProFootballDraft — Live Auction Engine & Render Deployment Guide

This project includes a real-time, WebSocket-powered Football Player Auction Arena built for **ProFootballDraft**.

---

## 🏛️ Architecture Overview

The system consists of two primary services configured for **Render**:

```
 ┌─────────────────────────────────────────────────────────────┐
 │                Render Web Service: Web Frontend             │
 │                      (Next.js 16 + React 19)                │
 │  - Live Auction Arena (/auction)                            │
 │  - Active Player Spotlight (EA FC attributes & roles)       │
 │  - Real-time Circular SVG Countdown Timer                   │
 │  - Bidding Controls & Multi-Franchise Budget Solvency       │
 │  - Web Audio API Synthesizer (ticks, bids, gavel, fanfare)  │
 │  - Standings, Squad Rosters, Draft Pool & Market Analytics  │
 └──────────────────────────────┬──────────────────────────────┘
                                │ WebSocket (Socket.IO) & REST
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                Render Web Service: Backend API              │
 │                  (Express + Socket.IO + Node.js)            │
 │  - Server-authoritative 1s tick countdown interval          │
 │  - Real-time Bid Validation & Dynamic Anti-Sniping          │
 │  - Automatic / Manual Hammer Resolution (handleSell)        │
 │  - EA FC Player Data Ingestion (CSV / Seeder)               │
 │  - /health endpoint for Render Zero-Downtime Deployments    │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Mongoose
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                       MongoDB Atlas                         │
 │      Collections: Player, Team, User, Bid, AuctionState     │
 └─────────────────────────────────────────────────────────────┘
```

---

## 🚀 1-Click Deployment to Render (Blueprint)

This repository includes a [`render.yaml`](file:///c:/Users/hrith/projects/ProFootballDraft/render.yaml) blueprint specification at the root.

### Steps to Deploy:
1. Push your code to your GitHub / GitLab repository.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect your `ProFootballDraft` repository.
5. Render will detect `render.yaml` and configure two services:
   - **`profootballdraft-api`** (Backend web service)
   - **`profootballdraft-web`** (Next.js frontend web service)
6. Set the `MONGODB_URI` environment variable for `profootballdraft-api` (e.g. from MongoDB Atlas free tier cluster: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/profootballdraft?retryWrites=true&w=majority`).
7. Click **Apply**. Render will automatically build, link environment variables via service discovery, and deploy!

---

## 💻 Local Development

You can run both the frontend and backend concurrently with one command:

### 1. Install Dependencies
```bash
# Frontend
npm install --legacy-peer-deps

# Backend
cd server && npm install && cd ..
```

### 2. Configure Environment (Optional for local)
In `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/profootballdraft
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

### 3. Run Both Services Simultaneously
```bash
npm run dev:all
```
- Frontend will open at **`http://localhost:3000`**
- Live Auction Arena is at **`http://localhost:3000/auction`**
- Backend runs at **`http://localhost:5000`** (WebSocket on port 5000)
- Health check: **`http://localhost:5000/health`**

---

## 🎮 Pre-Seeded Demo Accounts (1-Click Switcher)

Click **"Select Role"** in the top navigation bar of `/auction` to switch between:

| Role / Club | Email | Password | Starting Transfer Budget |
| :--- | :--- | :--- | :--- |
| **Chief Auctioneer (Admin)** | `admin@profootballdraft.com` | `admin123` | Full Master Controls |
| **Real Madrid CF** | `madrid@profootballdraft.com` | `manager123` | $120.0M |
| **Manchester City FC** | `city@profootballdraft.com` | `manager123` | $120.0M |
| **Arsenal FC** | `arsenal@profootballdraft.com` | `manager123` | $110.0M |
| **FC Barcelona** | `barca@profootballdraft.com` | `manager123` | $105.0M |
| **FC Bayern München** | `bayern@profootballdraft.com` | `manager123` | $115.0M |
| **Paris Saint-Germain** | `psg@profootballdraft.com` | `manager123` | $125.0M |

---

## 🛠️ Auction Rules & Engine Features

1. **Anti-Sniping Clock Extension**: Whenever a valid bid is made in the closing seconds, the server extends the timer to at least 15 seconds to give opposing managers fair time to counter-bid.
2. **Squad Cap & Budget Enforcement**: Bids are strictly rejected if a team exceeds their 11-player squad limit or bids above their available cash balance.
3. **Consecutive Self-Outbid Guard**: Teams cannot outbid themselves consecutively.
4. **Auto-Hammer on Expiration**: When the clock hits 0s, the server automatically executes `handleSell` (if there was a bidder) or `handleUnsold` (if no bids were placed).
5. **No External MP3 Dependency**: The sound synthesizer is implemented directly using the native browser Web Audio API `AudioContext` for instant sound playback without asset loading delays or broken audio paths.
