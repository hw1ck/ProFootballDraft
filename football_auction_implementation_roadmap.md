# Football Auction Platform — Step-by-Step Coding Implementation Roadmap

---

## 1. Project Overview and Objectives

### 1.1 Project Objective
Build a real-time multiplayer **Football Auction** web application where 2 to 6 managers compete in live, timed player auctions to construct 18-man football squads from curated competition pools (Premier League, La Liga, Serie A, Bundesliga, UEFA Champions League, FIFA World Cup, and Global). Completed squads are evaluated on overall rating, positional fit, team chemistry, and tactical alignment to determine match winners, update Ranked ELO ratings, track transfer habits, and award multi-tiered achievements.

### 1.2 Scope & Core Functional Pillars
1. **Authentication & Manager Profiles**: Persistent user identity, ELO rating, global rank, split Casual/Ranked statistics, squad score trend line (last 3 games), transfer habits intelligence (average spend, bargains, overpays, record signings, formation usage), 16-badge achievement matrix, and match history log.
2. **Matchmaking & Room Configurator**: Instant public queue (`Play Now` filtered by competition and Casual/Ranked mode), live refreshing open public rooms list (5-second poll/push interval), 6-character invite code entry, and custom room host configurator.
3. **Pre-Auction Lobby**: Real-time seat roster (2–6 seats), room parameter badges, 1-click code/link copying, and enforced minimum quorum gate ($\ge 2$ managers) to start the auction.
4. **Authoritative Live Auction Engine**: Sequential player lot presentation, server-authoritative countdown clock (15s, 20s, 30s, 45s), anti-snipe protection (bids in the last 3s reset the clock to 5s), quick-bid increments (`+10`, `+25`, `+50`, `+100`), custom numeric bid input, keyboard shortcuts (`1-4` and `S`), dynamic Maximum Bid reserve enforcement, live manager statuses (`THINKING`, `SKIPPED`, `HIGHEST BIDDER`), host pause control, and real-time activity feed.
5. **Post-Auction Settlement & Progression**: Squad valuation, tactical/chemistry scoring (0–100 scale), ELO rating adjustments for Ranked matches, transfer habit aggregation, and achievement unlock evaluation.

### 1.3 Final Deliverables
- **Backend Server**: Real-time WebSocket + REST API server handling authentication, database persistence, room state machines, authoritative timers, and post-match scoring.
- **Database Schema & Seed Data**: Relational schema for users, matches, rooms, achievements, and player pools (seeded with the exact 7 competition pools for the `2026-27` season).
- **Frontend Web Client**: Responsive dark-themed SPA matching the verified UI layouts, interactive bidding controls, keyboard shortcut bindings, and audio synthesis/playback toggle.
- **Automated Test Suite**: Unit tests for mathematical formulas (Max Bid, Bargain detection, ELO, Squad Scoring), integration tests for WebSocket room lifecycles, and E2E multi-client bidding tests.

---

## 2. Requirements and Constraints

### 2.1 Verified Functional & Mathematical Rules
Every implementation step must strictly enforce these verified rules extracted from the application specification:

| Rule / Constraint | Verified Specification | Formula / Parameters |
| :--- | :--- | :--- |
| **Squad Size ($N_{\text{total}}$)** | Mandatory 18-man squad per manager | $N_{\text{total}} = 18$ |
| **Opening / Min Bid ($C_{\text{min}}$)** | Every lot opens at 10 coins | $C_{\text{min}} = 10$ |
| **Max Bid Safety Constraint** | Must reserve 10 coins per remaining empty slot | $\text{Max Bid} = \text{Balance} - ((18 - N_{\text{current}} - 1) \times 10)$ |
| **Quick Bid Increments** | Fixed increment buttons & hotkeys `1–4` | `+10`, `+25`, `+50`, `+100` |
| **Skip Action** | Button & hotkey `S` to pass on current lot | Marks manager as skipped for current lot |
| **Anti-Snipe Rule** | Optional room toggle (enabled by default) | If bid placed when $t_{\text{remaining}} \le 3\text{s}$, reset $t_{\text{remaining}} \leftarrow 5\text{s}$ |
| **Competition Pools (`2026-27`)** | 7 selectable player pools | PL (162), La Liga (114), Serie A (138), Bundesliga (112), UCL (314), WC (508), Global (569) |
| **Room Capacities** | Configurable manager count | $2, 3, 4, 5, \text{or } 6$ (Quorum to start: $\ge 2$) |
| **Starting Budgets** | Configurable starting coin purse | $500, 750, 1000, 1500, \text{or } 2000$ |
| **Bid Timers** | Configurable turn duration per lot | $15\text{s}, 20\text{s}, 30\text{s}, \text{or } 45\text{s}$ |
| **Bargain Threshold** | Acquisition price vs. Estimated Value ($V_{\text{est}}$) | $\text{Price} \le \frac{1}{3} V_{\text{est}}$ (unlocks *Bargain Hunter* & increments Bargains) |
| **Achievements** | 16 total badges across Bronze, Silver, Gold | Evaluated post-match against match/career state |

---

## 3. Existing Codebase, Technical Context & Unknowns

### 3.1 Observed Technical Context
- **Deployment Target**: Visual evidence (`football-auction-v3n1.onrender.com/room/TC3K68`) confirms deployment as a web service on **Render** using client-side routing (`/room/:code`).
- **Real-Time Architecture**: Sub-second timer synchronization, live manager status pills (`THINKING`), and instant `SOLD!` overlays require a persistent full-duplex WebSocket connection alongside standard HTTP endpoints.

### 3.2 Reference Tech Stack Selection
Because only visual client evidence was provided (no existing repository files are mounted in the workspace), this roadmap standardizes on a production-ready **TypeScript Monorepo** stack ideally suited for Render deployment. *(If adapting to an existing repo, map these modules to your chosen framework)*:
- **Runtime & Language**: Node.js ($\ge 20.\text{x}$) + TypeScript ($5.\text{x}$) across shared, backend, and frontend packages.
- **Backend**: Express.js (REST API) + Socket.IO (real-time rooms & state sync) + Prisma ORM (PostgreSQL) + in-memory authoritative Room State Manager.
- **Frontend**: React 18 + Vite + Tailwind CSS + Zustand (client state) + Lucide Icons + Recharts/SVG (Squad Score trend chart).
- **Testing**: Vitest (Unit & Integration) + Playwright (Multi-context E2E WebSocket testing).

### 3.3 Documented Unknowns & Architectural Resolutions
Before writing code, the following unverified backend behaviors must be explicitly defined and standardized so developers do not guess during implementation:

| Unverified Behavior (Unknown) | Standardized Engineering Resolution for Implementation |
| :--- | :--- |
| **1. Unsold Lots** (What happens when the timer expires with 0 bids or all managers skip?) | **Resolution**: Mark lot as `UNSOLD`, emit `lot:unsold` event in the Live Auction Feed, and advance to the next lot. If the pool exhausts before all managers reach 18 players, auto-assign lowest-OVR unsold pool players at $C_{\text{min}} = 10$ coins per remaining slot. |
| **2. Quick-Bid Calculation Semantics** (Does clicking `+10` on an opening bid of `10` with "No bids yet" bid `10` or `20`?) | **Resolution**: As verified in the UI (`OPENING BID 10`, `No bids yet`, button shows `+10` on top and `10` as the resulting target value underneath; `+25` shows `25`), when `currentBid === 0` (no bids placed yet), the buttons submit absolute bids of `10`, `25`, `50`, `100` (provided $\ge C_{\text{min}}$). Once an active bid $B_{\text{active}}$ exists, the buttons submit $B_{\text{active}} + \Delta$ (`+10`, `+25`, `+50`, `+100`). |
| **3. Overpay Classification** (Profile tracks `Overpays` count alongside `Bargains`) | **Resolution**: While Bargain is strictly verified as $\text{Price} \le \frac{1}{3} V_{\text{est}}$, Overpay is standardized as $\text{Price} \ge 2.0 \times V_{\text{est}}$ (configurable via `OVERPAY_MULTIPLIER = 2.0` in shared constants). |
| **4. Post-Auction Lineup & Scoring Formula** (Tactics pitch screen was not in screenshots, though profile/achievements reference formations, chemistry $\ge 80$, tactics $\ge 97$, and Starting XI OVR $\ge 86$) | **Resolution**: Implement a post-auction **Squad Builder / Auto-Tactics Engine** that selects the optimal formation (e.g., `4-3-3`, `4-1-2-1-2`, `4-4-2`, `3-5-2`) or allows the manager 60 seconds to arrange their 18 players. Compute final `Squad Score` ($0\text{--}100$) as a weighted composite: $0.55 \times \text{StartingXI\_OVR} + 0.25 \times \text{ChemistryScore} + 0.20 \times \text{TacticsFitScore}$. |
| **5. Multi-Player Ranked ELO Math** (Rooms have 2 to 6 managers) | **Resolution**: Use pairwise multiplayer ELO ($K = 32$) where each manager's ELO delta is the average of pairwise expected vs. actual outcomes against every other manager in the room, starting at base ELO `1200`. |
| **6. Disconnection Handling** | **Resolution**: If a manager disconnects mid-auction, retain their seat and purse for 60 seconds; treat them as auto-passing on lots while disconnected. If the host disconnects, transfer host privileges (`Pause` capability) to the next connected seat. |

---

## 4. Implementation Strategy and Dependency Overview

### 4.1 Phased Execution Order
```
Phase 1: Workspace, Shared Types & Mathematical Domain Rules
   ├── Step 1: Monorepo & Tooling Setup
   ├── Step 2: Shared Contracts, Constants & Enums
   └── Step 3: Pure Domain Math Engine (Max Bid, Valuation, Scoring, ELO)
          │
          ▼
Phase 2: Database Schema, Seed Pipeline & Auth/Profile APIs
   ├── Step 4: Prisma Schema & PostgreSQL Setup
   ├── Step 5: Player Pool Seed Pipeline (569 Global Players & 7 Pools)
   ├── Step 6: Authentication & Session Middleware
   └── Step 7: Profile, Leaderboard & Achievement Evaluation Services
          │
          ▼
Phase 3: Real-Time Room Lobby & Authoritative Auction Engine
   ├── Step 8: Room Manager & Matchmaking Queue Service
   ├── Step 9: Authoritative Auction State Machine & Timer Loop
   └── Step 10: WebSocket Event Controllers & Post-Match Settlement
          │
          ▼
Phase 4: Frontend Application & Real-Time UI Surfaces
   ├── Step 11: Frontend Shell, Routing, Auth Context & Audio Manager
   ├── Step 12: Matchmaking Hub & Custom Room Configurator UI
   ├── Step 13: Pre-Auction Lobby UI
   ├── Step 14: Live Auction Stage, Card Renderer, Bidding Controls & Hotkeys
   └── Step 15: Sold Overlay, Post-Match Summary & Profile/Analytics UI
          │
          ▼
Phase 5: End-to-End Integration, Edge-Case Hardening & Final Verification
   ├── Step 16: Multi-Client WebSocket Integration & Concurrency Testing
   └── Step 17: E2E Playwright Suite & Production Readiness Verification
```

### 4.2 Parallelization Opportunities
- **Sequential Bottlenecks**: Step 2 (Shared Contracts) must precede Steps 3–15. Step 4 (Database) must precede Steps 5–10. Step 9 (Auction Engine) must precede Step 10.
- **Parallelizable Work**:
  - Once **Step 2 (Shared Contracts)** is complete, frontend static components in **Steps 11, 12, 13, and 15** can be built in parallel with backend **Steps 4–9** using mock data matching the shared TypeScript interfaces.
  - **Step 3 (Pure Domain Math)** has zero I/O dependencies and can be implemented and unit-tested immediately after Step 2.

---

## 5. Prerequisites and Environment Setup

Before starting Step 1, ensure the local machine has:
- [ ] **Node.js**: `v20.11.0` or higher (`node -v`)
- [ ] **Package Manager**: `npm` (`v10+`) or `pnpm` (`v9+`)
- [ ] **PostgreSQL**: Local instance or Docker container running PostgreSQL 15+ on port `5432`
- [ ] **Git**: Initialized repository

---

## 6. Step-by-Step Coding Implementation

---

### Phase 1: Workspace, Shared Types & Mathematical Domain Rules

---

#### Step 1: Initialize Monorepo Structure and Development Tooling
- **Objective**: Establish a clean workspace with `shared`, `server`, and `client` packages so TypeScript interfaces, WebSocket payload types, and mathematical validation rules are shared without drift between frontend and backend.
- **Prerequisites**: Node.js and npm installed.
- **Coding Actions**:
  - [ ] 1.1 Create root directory `football-auction` and initialize `package.json` with npm workspaces (`packages/shared`, `packages/server`, `packages/client`).
  - [ ] 1.2 Create `tsconfig.base.json` at the root with strict type-checking enabled (`"strict": true`, `"noImplicitAny": true`, `"exactOptionalPropertyTypes": true`).
  - [ ] 1.3 Scaffold `packages/shared`, `packages/server`, and `packages/client` directories with their respective `package.json` and `tsconfig.json` files.
  - [ ] 1.4 Install root dev dependencies: `typescript`, `vitest`, `eslint`, `prettier`, `concurrently`.
- **Files Affected**:
  - `package.json` (new — workspace orchestration scripts `dev`, `build`, `test`, `typecheck`)
  - `tsconfig.base.json` (new — base compiler configuration)
  - `packages/shared/package.json` & `packages/shared/tsconfig.json` (new)
  - `packages/server/package.json` & `packages/server/tsconfig.json` (new)
  - `packages/client/package.json` & `packages/client/tsconfig.json` (new)
  - `.gitignore` & `.env.example` (new)
- **Dependencies & Integration**: Foundation for all subsequent steps.
- **Verification**:
  - Run `npm install` at root.
  - Run `npm run typecheck` across workspaces.
- **Acceptance Criteria**:
  - [ ] Workspace packages resolve `@football-auction/shared` imports cleanly without build errors.
- **Potential Issues**:
  - *Issue*: Vite or Node failing to resolve TypeScript workspace paths. *Resolution*: Export both `"types": "./src/index.ts"` and compiled `"main": "./dist/index.js"` in `packages/shared/package.json`.

---

#### Step 2: Implement Shared Constants, Domain Types & WebSocket Contracts
- **Objective**: Define the exact constants, competition pools, room settings, player attributes, achievement definitions, and strongly typed Socket.IO client/server events verified from the specification.
- **Prerequisites**: Step 1 completed.
- **Coding Actions**:
  - [ ] 2.1 Create `packages/shared/src/constants.ts` defining exact room configuration options, timer limits, budget options, competition pool metadata, and the 16 achievement metadata records.
  - [ ] 2.2 Create `packages/shared/src/types.ts` defining `PlayerCard`, `RoomConfig`, `ManagerSeat`, `AuctionLotState`, `RoomState`, `ProfileStats`, and `AchievementProgress`.
  - [ ] 2.3 Create `packages/shared/src/socket-events.ts` defining `ClientToServerEvents` and `ServerToClientEvents` interfaces for Socket.IO.
  - [ ] 2.4 Export all modules from `packages/shared/src/index.ts`.
- **Files Affected**:
  - `packages/shared/src/constants.ts` (new)
  - `packages/shared/src/types.ts` (new)
  - `packages/shared/src/socket-events.ts` (new)
  - `packages/shared/src/index.ts` (new)
- **Implementation Details & Code Example**:
```typescript
// packages/shared/src/constants.ts
export const SQUAD_SIZE = 18;
export const MIN_OPENING_BID = 10;
export const ANTI_SNIPE_THRESHOLD_SECONDS = 3;
export const ANTI_SNIPE_RESET_SECONDS = 5;
export const MIN_MANAGERS_TO_START = 2;
export const QUICK_BID_INCREMENTS = [10, 25, 50, 100] as const;
export const ROOM_SIZES = [2, 3, 4, 5, 6] as const;
export const STARTING_BUDGETS = [500, 750, 1000, 1500, 2000] as const;
export const BID_TIMERS = [15, 20, 30, 45] as const;
export const SEASONS = ['2026-27'] as const;

export type CompetitionId =
  | 'PREMIER_LEAGUE'
  | 'LA_LIGA'
  | 'SERIE_A'
  | 'BUNDESLIGA'
  | 'CHAMPIONS_LEAGUE'
  | 'WORLD_CUP'
  | 'GLOBAL';

export const COMPETITIONS: Record<CompetitionId, { name: string; shortCode: string; expectedPoolSize: number }> = {
  PREMIER_LEAGUE: { name: 'Premier League', shortCode: 'PL', expectedPoolSize: 162 },
  LA_LIGA: { name: 'La Liga', shortCode: 'LL', expectedPoolSize: 114 },
  SERIE_A: { name: 'Serie A', shortCode: 'SA', expectedPoolSize: 138 },
  BUNDESLIGA: { name: 'Bundesliga', shortCode: 'BL', expectedPoolSize: 112 },
  CHAMPIONS_LEAGUE: { name: 'UEFA Champions League', shortCode: 'UCL', expectedPoolSize: 314 },
  WORLD_CUP: { name: 'FIFA World Cup', shortCode: 'WC', expectedPoolSize: 508 },
  GLOBAL: { name: 'Global — All Players', shortCode: 'GLB', expectedPoolSize: 569 },
};
```
- **Verification**:
  - Run `npm run typecheck --workspace=@football-auction/shared`.
- **Acceptance Criteria**:
  - [ ] All 7 competitions, 5 budgets, 4 timers, 5 room sizes, and 16 achievements are strictly typed and exported.

---

#### Step 3: Implement and Unit-Test the Pure Domain Math Engine
- **Objective**: Implement deterministic functions for Maximum Bid Reserve calculation, Quick-Bid target calculation, Bargain/Overpay classification, Squad Score calculation (OVR, Chemistry, Tactics), and multiplayer ELO adjustments.
- **Prerequisites**: Step 2 completed.
- **Coding Actions**:
  - [ ] 3.1 Create `packages/shared/src/math/bidding.ts`:
    - Implement `calculateMaxBid(currentBalance: number, currentSquadCount: number, maxSquadSize = 18, minBid = 10): number`.
    - Implement `calculateQuickBidTargets(currentLeadingBid: number, maxBid: number): { increment: number; targetAmount: number; disabled: boolean }[]`.
    - Implement `validateBid(amount: number, currentLeadingBid: number, currentBalance: number, currentSquadCount: number): { valid: boolean; reason?: string }`.
  - [ ] 3.2 Create `packages/shared/src/math/valuation.ts`:
    - Implement `classifyTransfer(pricePaid: number, estimatedValue: number): 'BARGAIN' | 'OVERPAY' | 'FAIR'`.
    - Verify `isBargain`: `pricePaid <= Math.floor(estimatedValue / 3)` (or `pricePaid * 3 <= estimatedValue`).
  - [ ] 3.3 Create `packages/shared/src/math/scoring.ts`:
    - Implement `evaluateSquad(players: PlayerCard[], chosenFormation?: FormationId)` returning `{ totalScore, startingXiOvr, chemistryScore, tacticsScore, everyStarterInNaturalOrSecondaryPos, hasGoalkeeper }`.
  - [ ] 3.4 Create `packages/shared/src/math/elo.ts`:
    - Implement `calculateMultiplayerEloChanges(standings: { userId: string; currentElo: number; placement: number }[]): Record<string, number>`.
  - [ ] 3.5 Write comprehensive unit tests in `packages/shared/src/__tests__/math.test.ts`.
- **Files Affected**:
  - `packages/shared/src/math/bidding.ts` (new)
  - `packages/shared/src/math/valuation.ts` (new)
  - `packages/shared/src/math/scoring.ts` (new)
  - `packages/shared/src/math/elo.ts` (new)
  - `packages/shared/src/__tests__/math.test.ts` (new)
- **Implementation Details & Code Example**:
```typescript
// packages/shared/src/math/bidding.ts
import { SQUAD_SIZE, MIN_OPENING_BID, QUICK_BID_INCREMENTS } from '../constants';

export function calculateMaxBid(
  currentBalance: number,
  currentSquadCount: number,
  totalSlots: number = SQUAD_SIZE,
  minReservePerSlot: number = MIN_OPENING_BID
): number {
  if (currentSquadCount >= totalSlots) return 0;
  const remainingSlotsAfterCurrentLot = totalSlots - currentSquadCount - 1;
  const requiredReserve = remainingSlotsAfterCurrentLot * minReservePerSlot;
  return Math.max(0, currentBalance - requiredReserve);
}

export function calculateQuickBidTargets(currentLeadingBid: number, maxBid: number) {
  return QUICK_BID_INCREMENTS.map((inc) => {
    // When no bids exist yet (currentLeadingBid === 0), +10 bids 10, +25 bids 25, etc.
    const targetAmount = currentLeadingBid === 0 ? inc : currentLeadingBid + inc;
    return {
      increment: inc,
      targetAmount,
      disabled: targetAmount > maxBid,
    };
  });
}
```
- **Verification**:
  - Run `npx vitest run --workspace=@football-auction/shared`.
- **Acceptance Criteria**:
  - [ ] `calculateMaxBid(1000, 0)` returns exactly `830`.
  - [ ] `calculateMaxBid(990, 1)` returns `830` ($990 - 16 \times 10 = 830$).
  - [ ] `calculateQuickBidTargets(0, 830)` returns targets `[10, 25, 50, 100]`.
  - [ ] `calculateQuickBidTargets(10, 830)` returns targets `[20, 35, 60, 110]`.
  - [ ] `classifyTransfer(10, 125)` (Jérémy Doku example) and `classifyTransfer(35, 370)` (Florian Wirtz example) both return `'BARGAIN'`.

> **CHECKPOINT 1**: Do not proceed to Phase 2 until all unit tests in `packages/shared` pass (`npm test --workspace=@football-auction/shared`) and typecheck succeeds with zero errors.

---

### Phase 2: Database Schema, Seed Pipeline & Auth/Profile APIs

---

#### Step 4: Configure PostgreSQL & Prisma Database Schema
- **Objective**: Create the relational data model supporting user accounts, ELO ratings, career transfer habits, unlocked achievements, match history, and player pools.
- **Prerequisites**: Step 3 completed; PostgreSQL running locally.
- **Coding Actions**:
  - [ ] 4.1 Install Prisma in `packages/server`: `npm install prisma @prisma/client --workspace=@football-auction/server`.
  - [ ] 4.2 Create `packages/server/prisma/schema.prisma` with models:
    - `User`: `id`, `username` (unique), `passwordHash`, `elo` (default 1200), `favoriteLeague`, `preferredFormation` (default `"4-3-3"`), `createdAt`.
    - `Player`: `id`, `name`, `surname`, `overall`, `primaryPosition`, `secondaryPositions` (string array), `nationalityCode`, `nationalityName`, `clubName`, `clubCrestUrl`, `age`, `preferredFoot`, `pace`, `shooting`, `passing`, `dribbling`, `defending`, `physical`, `rarity`, `estimatedValue`, `photoUrl`, `licenseAttribution`, `competitions` (string array of `CompetitionId`), `season` (default `"2026-27"`).
    - `Match`: `id`, `roomCode`, `roomName`, `competition`, `season`, `mode` (`CASUAL` | `RANKED`), `startingBudget`, `bidTimer`, `roomSize`, `antiSnipe`, `createdAt`, `completedAt`.
    - `MatchParticipant`: `id`, `matchId`, `userId`, `placement`, `squadScore`, `startingXiOvr`, `chemistryScore`, `tacticsScore`, `formationUsed`, `totalSpent`, `bargainsCount`, `overpaysCount`, `eloBefore`, `eloAfter`.
    - `MatchSigning`: `id`, `participantId`, `playerId`, `pricePaid`, `estimatedValue`, `isBargain`, `isOverpay`.
    - `UserAchievement`: `id`, `userId`, `achievementCode`, `unlockedAt`, `matchId` (unique composite `[userId, achievementCode]`).
  - [ ] 4.3 Run initial migration: `npx prisma migrate dev --name init --schema=packages/server/prisma/schema.prisma`.
  - [ ] 4.4 Create Prisma singleton client in `packages/server/src/db/prisma.ts`.
- **Files Affected**:
  - `packages/server/prisma/schema.prisma` (new)
  - `packages/server/src/db/prisma.ts` (new)
- **Verification**:
  - Run `npx prisma validate --schema=packages/server/prisma/schema.prisma`.
  - Verify tables exist in PostgreSQL.
- **Acceptance Criteria**:
  - [ ] Database migrations apply cleanly and `@prisma/client` generates TypeScript types matching all models.

---

#### Step 5: Build the Player Pool Seed Pipeline (7 Pools, 569 Global Players)
- **Objective**: Populate the database with the `2026-27` player dataset so that querying each competition returns the exact player counts verified in the room configurator (`PL: 162`, `La Liga: 114`, `Serie A: 138`, `Bundesliga: 112`, `UCL: 314`, `WC: 508`, `Global: 569`), including verified cards such as Jérémy Doku (`82 LW`, `BE`, `Manchester City`, `24 yrs`, `Right foot`, `PAC 90, SHO 77, PAS 75, DRI 85, DEF 37, PHY 59`, `est. value 125`), Florian Wirtz (`est. value ~370`), and Pedri.
- **Prerequisites**: Step 4 completed.
- **Coding Actions**:
  - [ ] 5.1 Create `packages/server/prisma/seed-data/players-2026-27.json` (or generator module `packages/server/prisma/seed.ts`) containing 569 unique football players across all positions (`GK`, `CB`, `LB`, `RB`, `CDM`, `CM`, `CAM`, `LW`, `RW`, `ST`) with realistic attributes and estimated coin valuations ($V_{\text{est}} \in [25, 450]$).
  - [ ] 5.2 Assign competition membership tags to each player so that filtering by competition tag produces the exact counts:
    - `PREMIER_LEAGUE`: 162 players
    - `LA_LIGA`: 114 players
    - `SERIE_A`: 138 players
    - `BUNDESLIGA`: 112 players
    - `CHAMPIONS_LEAGUE`: 314 players
    - `WORLD_CUP`: 508 players
    - `GLOBAL`: all 569 players
  - [ ] 5.3 Ensure every competition pool has at least 18 Goalkeepers (`GK`) so 6-manager rooms can always satisfy the goalkeeper requirement.
  - [ ] 5.4 Configure `"prisma": { "seed": "tsx prisma/seed.ts" }` in `packages/server/package.json` and execute the seed.
- **Files Affected**:
  - `packages/server/prisma/seed.ts` (new)
  - `packages/server/src/services/playerPoolService.ts` (new — fetches and shuffles pool for a given `CompetitionId`)
- **Verification**:
  - Run `npx prisma db seed --schema=packages/server/prisma/schema.prisma`.
  - Write and run an integration test verifying `getPoolCount(compId)` matches `COMPETITIONS[compId].expectedPoolSize` for all 7 pools.
- **Acceptance Criteria**:
  - [ ] Database assertions confirm exact pool counts (`162, 114, 138, 112, 314, 508, 569`) and presence of sufficient `GK` cards in every pool.

---

#### Step 6: Implement Authentication & Session Management
- **Objective**: Provide JWT/cookie session authentication for manager login, registration, current session retrieval, and `Sign out` functionality.
- **Prerequisites**: Step 4 completed.
- **Coding Actions**:
  - [ ] 6.1 Install `express`, `cors`, `cookie-parser`, `bcryptjs`, `jsonwebtoken`, `zod` in `packages/server`.
  - [ ] 6.2 Create `packages/server/src/middleware/auth.ts` to verify JWT tokens on both HTTP requests and Socket.IO handshakes.
  - [ ] 6.3 Create `packages/server/src/routes/authRoutes.ts` with:
    - `POST /api/auth/register` (validates username, creates user with `1200` ELO, returns user + token).
    - `POST /api/auth/login` (verifies credentials, returns user + token).
    - `POST /api/auth/logout` (clears session token).
    - `GET /api/auth/me` (returns authenticated user identity).
- **Files Affected**:
  - `packages/server/src/middleware/auth.ts` (new)
  - `packages/server/src/routes/authRoutes.ts` (new)
- **Verification**:
  - Test registration, login, `/api/auth/me`, and `/api/auth/logout` with Supertest/Vitest.
- **Acceptance Criteria**:
  - [ ] Unauthenticated requests to protected routes return HTTP `401`; valid tokens attach `req.user` and authenticate Socket.IO connections.

---

#### Step 7: Implement Profile Analytics, Leaderboard & Achievement Engine
- **Objective**: Build the backend services that compute the exact Profile view data (Global Rank, ELO, Casual vs. Ranked split cards, Squad Score Last 3 Games trend, Transfer Habits including Best Bargain, Record Signing, and Formation bar counts, 16 Achievements status, and Recent Matches list) and the Global Leaderboard.
- **Prerequisites**: Steps 3, 4, and 6 completed.
- **Coding Actions**:
  - [ ] 7.1 Create `packages/server/src/services/achievementService.ts` implementing the 16 verified achievement rules:
    1. `FIRST_WHISTLE` (Bronze): Finish your first game.
    2. `BARGAIN_HUNTER` (Bronze): Sign a player for a third of their value (or less) ($\text{Price} \le V_{\text{est}} / 3$).
    3. `CHAMPION` (Bronze): Win a game (`placement === 1`).
    4. `ON_THE_PODIUM` (Bronze): Finish top 3 in a room of 4 or more (`placement <= 3 && participants >= 4`).
    5. `FULL_HOUSE` (Gold): Win a 6-manager room (`placement === 1 && participants === 6`).
    6. `GIANT_KILLER` (Gold): Win a ranked game against someone rated 100+ ELO above you.
    7. `UNDERDOG` (Silver): Win with the lowest-rated squad in the room (`placement === 1 && startingXiOvr === minRoomOvr`).
    8. `SHREWD_OPERATOR` (Silver): Win while spending half your budget or less (`placement === 1 && totalSpent <= startingBudget * 0.5`).
    9. `BIG_SPENDER` (Bronze): Spend 40% of your budget on a single player (`maxSingleSigningPrice >= startingBudget * 0.4`).
    10. `GALACTICOS` (Gold): Field a starting XI averaging 86+ overall (`startingXiOvr >= 86`).
    11. `PERFECT_FIT` (Silver): Every starter in a natural or secondary position.
    12. `CHEMISTRY_LAB` (Silver): Reach 80+ chemistry (`chemistryScore >= 80`).
    13. `MASTER_TACTICIAN` (Silver): Score 97+ for tactics (`tacticsScore >= 97`).
    14. `HAT_TRICK` (Silver): Win 3 games (`totalWins >= 3`).
    15. `VETERAN` (Silver): Play 10 games (`totalGames >= 10`).
    16. `ELITE_MANAGER` (Gold): Reach 1400 ranked ELO (`eloAfter >= 1400`).
  - [ ] 7.2 Create `packages/server/src/services/profileService.ts` to aggregate:
    - Global Rank (rank of user's `elo` across all users).
    - Split stats for `RANKED` and `CASUAL`: `games`, `wins`, `podiums` (`placement <= 3`), `winRate` (%), `avgScore` (1 decimal), `bestScore` (1 decimal).
    - `last3Games`: chronological array of up to 3 most recent matches (`{ matchId, squadScore, isWin, competition, playedAt }`).
    - `transferHabits`: `avgSpend`, `bargains` total, `overpays` total, `bestBargain` (highest $V_{\text{est}} - \text{pricePaid}$ ratio among bargains, formatted e.g., `Florian Wirtz — 35 for ~370`), `recordSigning` (highest `pricePaid`, formatted e.g., `Pedri — 390`), and `formations` usage counts.
  - [ ] 7.3 Create `packages/server/src/routes/profileRoutes.ts` (`GET /api/profile/:username` and `GET /api/leaderboard`).
- **Files Affected**:
  - `packages/server/src/services/achievementService.ts` (new)
  - `packages/server/src/services/profileService.ts` (new)
  - `packages/server/src/routes/profileRoutes.ts` (new)
  - `packages/server/src/__tests__/achievementService.test.ts` (new)
- **Verification**:
  - Run unit/integration tests for `achievementService.ts` verifying each of the 16 unlock conditions.
- **Acceptance Criteria**:
  - [ ] All 16 achievements unlock accurately based on match results and career counters, and `GET /api/profile/me` returns the complete payload required by the Profile UI.

> **CHECKPOINT 2**: Verify database schema migrations, 569-player seed integrity, auth routes, and achievement tests (`npm test --workspace=@football-auction/server`) before proceeding to Phase 3.

---

### Phase 3: Real-Time Room Lobby & Authoritative Auction Engine

---

#### Step 8: Implement Room Registry, Code Generator & Matchmaking Service
- **Objective**: Manage in-memory active rooms, 6-character alphanumeric room code generation (e.g., `GNP4P7`, `TC3K68`, `FBA7K2`), `Play Now` matchmaking resolution, and the `Open Public Rooms` list.
- **Prerequisites**: Steps 5 and 6 completed.
- **Coding Actions**:
  - [ ] 8.1 Create `packages/server/src/rooms/roomCodeGenerator.ts` generating collision-free 6-character uppercase alphanumeric codes (`A-Z0-9`).
  - [ ] 8.2 Create `packages/server/src/rooms/RoomManager.ts` holding active rooms in a `Map<string, AuctionRoom>` and providing:
    - `createRoom(hostUser, config: RoomConfig): AuctionRoom`
    - `joinRoom(code: string, user): AuctionRoom`
    - `leaveRoom(code: string, userId: string): void`
    - `getOpenPublicRooms(competitionFilter?: CompetitionId, mode?: 'CASUAL' | 'RANKED'): PublicRoomSummary[]`
    - `matchmakePlayNow(user, competitionFilter: CompetitionId | 'ANY', mode: 'CASUAL' | 'RANKED'): AuctionRoom` (joins the fullest open public waiting room matching the criteria, or automatically creates a new public room with default settings: `1,000` budget, `30s` timer, `4` room size, `antiSnipe: true`).
  - [ ] 8.3 Create REST endpoints in `packages/server/src/routes/roomRoutes.ts`:
    - `GET /api/rooms/public` (polled every 5s by client or pushed via socket)
    - `POST /api/rooms` (creates custom room)
    - `POST /api/rooms/play-now` (instant matchmaking)
    - `GET /api/rooms/:code` (fetches room metadata for direct invite links `/room/:code`)
- **Files Affected**:
  - `packages/server/src/rooms/roomCodeGenerator.ts` (new)
  - `packages/server/src/rooms/RoomManager.ts` (new)
  - `packages/server/src/routes/roomRoutes.ts` (new)
- **Verification**:
  - Write unit tests testing `createRoom`, `joinRoom` capacity limits (2–6 seats), `Play Now` fallback creation, and host promotion on host leave.
- **Acceptance Criteria**:
  - [ ] Room codes are 6 uppercase characters; attempting to join a full room or already-started auction returns a structured error; `Start Auction` is rejected if `connectedManagers < 2`.

---

#### Step 9: Implement the Authoritative Auction State Machine & Timer Loop
- **Objective**: Build the `AuctionRoom` class that runs the live auction loop on the server: drawing lots sequentially from the competition pool, running the 1-second tick timer, processing bids with atomic concurrency safety, enforcing Max Bid limits, applying the Anti-Snipe 3s $\rightarrow$ 5s reset, handling manager `Skip` actions, and pausing/resuming the clock.
- **Prerequisites**: Steps 3 and 8 completed.
- **Coding Actions**:
  - [ ] 9.1 Create `packages/server/src/rooms/AuctionRoom.ts` with explicit room phases: `'LOBBY' | 'AUCTION_ACTIVE' | 'AUCTION_PAUSED' | 'LOT_SOLD_TRANSITION' | 'COMPLETED'`.
  - [ ] 9.2 Implement `startAuction(requestingUserId: string)`:
    - Verify caller is host and `seats.size >= 2`.
    - Load and shuffle the player pool for `config.competition`.
    - Initialize each manager's ledger: `balance = config.startingBudget`, `spent = 0`, `squad = []`, `maxBid = calculateMaxBid(config.startingBudget, 0)`, `status = 'THINKING'`.
    - Append `"Auction starting..."` to `activityFeed` and call `advanceToNextLot()`.
  - [ ] 9.3 Implement `placeBid(userId: string, bidAmount: number)`:
    - Verify room phase is `'AUCTION_ACTIVE'`.
    - Verify manager has `< 18` players.
    - Verify if `currentBid === 0`, `bidAmount >= 10`; if `currentBid > 0`, `bidAmount > currentBid`.
    - Verify `bidAmount <= calculateMaxBid(manager.balance, manager.squad.length)`.
    - Update `currentBid = bidAmount`, `leadingBidderId = userId`.
    - Update manager statuses: leading bidder becomes `'WINNING'`, non-skipped others with sufficient maxBid become `'THINKING'`.
    - **Anti-Snipe Check**: If `config.antiSnipe && this.secondsRemaining <= 3`, set `this.secondsRemaining = 5` and log anti-snipe reset.
    - Append bid event to `activityFeed` and broadcast room delta.
  - [ ] 9.4 Implement `skipLot(userId: string)`:
    - Verify caller is not currently the `leadingBidderId`.
    - Mark manager `status = 'SKIPPED'` for the current lot.
    - If all managers except `leadingBidderId` (or all managers when `leadingBidderId === null`) have skipped or cannot afford the next bid (`maxBid <= currentBid`), immediately resolve the lot without waiting for the timer to hit 0.
  - [ ] 9.5 Implement `resolveCurrentLot()`:
    - Stop lot timer and transition to `'LOT_SOLD_TRANSITION'` for 3.5 seconds.
    - If `leadingBidderId` exists:
      - Deduct `currentBid` from winner's `balance`, add `currentBid` to `spent`, push `currentPlayer` to winner's `squad`, recompute `maxBid`.
      - Compute valuation badge (`isBargain = currentBid * 3 <= currentPlayer.estimatedValue`, `estimatedValue`).
      - Broadcast `auction:lotSold` payload (triggers the `SOLD!` overlay with buyer name, price, and `Bargain · est. value X` badge).
    - If no bids were placed:
      - Broadcast `auction:lotUnsold` and log to `activityFeed`.
    - Check completion condition: if all managers have 18 players (or pool exhausted), trigger `completeAuction()`; otherwise schedule `advanceToNextLot()` after the 3.5s `SOLD!` display window.
  - [ ] 9.6 Implement `togglePause(requestingUserId: string)` allowing the host to pause and resume the countdown timer.
- **Files Affected**:
  - `packages/server/src/rooms/AuctionRoom.ts` (new)
  - `packages/server/src/__tests__/AuctionRoom.test.ts` (new)
- **Implementation Details & Code Example**:
```typescript
// Anti-snipe & bid validation snippet inside AuctionRoom.ts
public handleBid(userId: string, requestedAmount: number): { ok: boolean; error?: string } {
  if (this.phase !== 'AUCTION_ACTIVE' || !this.currentLot) {
    return { ok: false, error: 'Bidding is not currently active.' };
  }
  const manager = this.managers.get(userId);
  if (!manager) return { ok: false, error: 'Manager not in room.' };
  if (manager.squad.length >= SQUAD_SIZE) {
    return { ok: false, error: 'Squad is already full (18/18).' };
  }

  const maxAllowed = calculateMaxBid(manager.balance, manager.squad.length);
  if (requestedAmount > maxAllowed) {
    return { ok: false, error: `Bid exceeds your max bid limit of ${maxAllowed}.` };
  }

  const minRequired = this.currentLot.currentBid === 0 ? MIN_OPENING_BID : this.currentLot.currentBid + 1;
  if (requestedAmount < minRequired) {
    return { ok: false, error: `Minimum valid bid is ${minRequired}.` };
  }

  this.currentLot.currentBid = requestedAmount;
  this.currentLot.leadingBidderId = userId;

  if (this.config.antiSnipe && this.currentLot.secondsRemaining <= ANTI_SNIPE_THRESHOLD_SECONDS) {
    this.currentLot.secondsRemaining = ANTI_SNIPE_RESET_SECONDS;
  }

  this.addFeedEntry(`${manager.username} bid ${requestedAmount} on ${this.currentLot.player.name}`);
  this.broadcastState();
  return { ok: true };
}
```
- **Verification**:
  - Run `npx vitest run packages/server/src/__tests__/AuctionRoom.test.ts` using fake timers (`vi.useFakeTimers()`).
- **Acceptance Criteria**:
  - [ ] A bid placed at `2s` remaining when `antiSnipe: true` resets `secondsRemaining` to `5s`.
  - [ ] A bid exceeding `830` on Lot 1 with `1,000` budget is rejected.
  - [ ] Winning a lot for `10` coins updates the winner's state to `990` balance, `1/18` squad slots, `17 slots left`, `spent 10`, and `max bid 830`.
  - [ ] Missing goalkeeper check sets `needsGoalkeeper: true` until at least one `GK` is acquired.

---

#### Step 10: Wire WebSocket Event Controllers & Post-Match Settlement Persistence
- **Objective**: Connect Socket.IO connections to `RoomManager` and `AuctionRoom`, support live room chat, and persist completed match results, ELO updates, transfer habits, and unlocked achievements to PostgreSQL.
- **Prerequisites**: Steps 7, 8, and 9 completed.
- **Coding Actions**:
  - [ ] 10.1 Create `packages/server/src/services/matchSettlementService.ts`:
    - When `AuctionRoom` finishes, evaluate all managers' 18-man squads using `evaluateSquad()`.
    - Rank managers by `squadScore` descending (tie-breaker: remaining coin balance).
    - If `mode === 'RANKED'`, calculate ELO deltas via `calculateMultiplayerEloChanges()` and update `User.elo`.
    - Persist `Match`, `MatchParticipant`, and `MatchSigning` records inside a single Prisma `$transaction`.
    - Run `achievementService.evaluateAndUnlock()` for each participant and include newly unlocked badges in the `auction:completed` socket event.
  - [ ] 10.2 Create `packages/server/src/socket/socketHandler.ts` handling:
    - `room:join`, `room:leave`, `room:start`, `room:pauseToggle`, `room:chat`
    - `auction:bid`, `auction:skip`
  - [ ] 10.3 Create `packages/server/src/index.ts` mounting Express routes, Socket.IO server, and health check endpoint `GET /api/health`.
- **Files Affected**:
  - `packages/server/src/services/matchSettlementService.ts` (new)
  - `packages/server/src/socket/socketHandler.ts` (new)
  - `packages/server/src/index.ts` (new)
- **Verification**:
  - Run backend server and execute socket integration test simulating a 2-manager auction through to database settlement.
- **Acceptance Criteria**:
  - [ ] Completing an auction persists match records, updates Ranked ELO, updates transfer habits, unlocks eligible achievements (e.g., `FIRST_WHISTLE`, `BARGAIN_HUNTER`), and broadcasts final standings to all room sockets.

> **CHECKPOINT 3**: All backend API routes, database persistence, and WebSocket room state machine tests must pass before building and connecting the frontend views in Phase 4.

---

### Phase 4: Frontend Application & Real-Time UI Surfaces

---

#### Step 11: Scaffold Frontend Shell, Dark Neon Theme, Auth Context & Audio Controller
- **Objective**: Set up the Vite + React + Tailwind CSS client with the exact dark stadium aesthetic (`#0a0d12` background, `#b4ff39` neon lime accents), top navigation bar (`FOOTBALL AUCTION` logo, `Play`, `Leaderboard`, `Profile`, user pill, `Sign out`, and global sound mute toggle), and Socket.IO client wrapper.
- **Prerequisites**: Steps 1, 2, and 10 completed.
- **Coding Actions**:
  - [ ] 11.1 Initialize Vite React-TS app in `packages/client` and install `react-router-dom`, `socket.io-client`, `zustand`, `tailwindcss`, `lucide-react`.
  - [ ] 11.2 Configure `tailwind.config.js` with custom color tokens (`neon: '#b8ff2c'`, `surface: '#11151c'`, `card: '#161b24'`) and sports display typography (`Anton` / `Inter` / `JetBrains Mono`).
  - [ ] 11.3 Create `packages/client/src/services/soundManager.ts` using the Web Audio API to synthesize UI sound effects (bid placed beep, final 3-second tick warning, gavel `SOLD!` chime) controlled by a persistent `isMuted` state in `localStorage`.
  - [ ] 11.4 Create `packages/client/src/store/useAuthStore.ts` and `packages/client/src/components/Navbar.tsx`.
  - [ ] 11.5 Set up client routes in `packages/client/src/App.tsx`:
    - `/login` & `/register`
    - `/play` (Matchmaking & Room Configurator)
    - `/leaderboard` (Global ELO Leaderboard)
    - `/profile` (Manager Profile, Analytics & Achievements)
    - `/room/:code` (Pre-Auction Lobby $\rightarrow$ Live Auction Floor $\rightarrow$ Post-Match Summary)
- **Files Affected**:
  - `packages/client/tailwind.config.js` (new)
  - `packages/client/src/services/soundManager.ts` (new)
  - `packages/client/src/services/socket.ts` (new)
  - `packages/client/src/store/useAuthStore.ts` (new)
  - `packages/client/src/components/Navbar.tsx` (new)
  - `packages/client/src/App.tsx` (new)
- **Verification**:
  - Run `npm run dev --workspace=@football-auction/client` and verify navigation bar, auth login flow, and audio mute toggle persistence.
- **Acceptance Criteria**:
  - [ ] Header navigation links (`Play`, `Leaderboard`, `Profile`), user avatar initial badge, `Sign out` button, and audio icon render and function identically to the specification.

---

#### Step 12: Implement the Matchmaking Hub & Custom Room Configurator (`Play` Screen)
- **Objective**: Build the `WELCOME, <USERNAME>` Matchmaking screen featuring the `PLAY NOW` quick-match bar, auto-refreshing `OPEN PUBLIC ROOMS` panel (every 5 seconds), `JOIN A ROOM` 6-character code input, and the `CREATE A ROOM` host configurator.
- **Prerequisites**: Step 11 completed.
- **Coding Actions**:
  - [ ] 12.1 Create `packages/client/src/pages/PlayPage.tsx` divided into the 4 verified functional zones:
    1. **Play Now Banner**: Competition dropdown (`Any competition` or specific league), `CASUAL` button, and highlighted `RANKED ⚡` button.
    2. **Open Public Rooms**: Polls `GET /api/rooms/public` every 5 seconds (`refreshes every 5s` indicator), showing joinable public rooms or the empty state message: *"No open public rooms right now. Press Play now to open one, or create a public room below."*
    3. **Host — Create a Room**:
       - `ROOM NAME` input defaulting to `<username>'s Auction`.
       - `COMPETITION — THE PLAYER POOL` 7-card grid showing icons, titles, and exact player counts (`162 players`, `114 players`, `138 players`, `112 players`, `314 players`, `508 players`, `569 players`).
       - `SEASON` selector pill (`2026–27`).
       - `ROOM SIZE` selector buttons (`2`, `3`, `4`, `5`, `6`; default `4`).
       - `STARTING BUDGET` coin pills (`500`, `750`, `1,000`, `1,500`, `2,000`; default `1,000`).
       - `BID TIMER` selector pills (`15s`, `20s`, `30s`, `45s`; default `30s`).
       - `MODE` toggle (`Casual` vs `Ranked ⚡`).
       - `VISIBILITY` toggle (`Private · code` vs `Public`).
       - `Anti-snipe` checkbox (`Anti-snipe — a bid in the last 3s resets the clock to 5s`, checked by default).
       - Full-width neon `CREATE ROOM` submit button.
    4. **Invited? Join a Room**: 6-character spaced uppercase input (`F B A 7 K 2` placeholder) and `JOIN` button.
- **Files Affected**:
  - `packages/client/src/pages/PlayPage.tsx` (new)
- **Verification**:
  - Create a room with custom parameters and verify redirect to `/room/:code`.
  - Test joining from a second browser window using the 6-character code.
- **Acceptance Criteria**:
  - [ ] All 7 competition cards display their exact verified player counts; `Play Now`, `Create Room`, and `Join a Room` navigate cleanly to `/room/:code`.

---

#### Step 13: Implement the Pre-Auction Lobby View
- **Objective**: Build the waiting room lobby displaying the competition banner, configuration badges (`2026-27`, `1,000 BUDGET`, `30S PER PLAYER`, `RANKED ⚡ ELO ON THE LINE`, `PUBLIC`, `18-MAN SQUADS`, `ANTI-SNIPE`), large `ROOM CODE` with `COPY CODE` and `COPY INVITE LINK` buttons, manager seat grid (`MANAGERS X/Y`), and quorum-gated `START AUCTION` button.
- **Prerequisites**: Step 12 completed.
- **Coding Actions**:
  - [ ] 13.1 Create `packages/client/src/components/room/RoomLobby.tsx`.
  - [ ] 13.2 Render the seat grid up to `config.roomSize` showing occupied manager cards (green initial avatar, username, crown icon for host, `(you)` label, green `Host` dot) and dashed `+ Open seat` placeholders for remaining seats.
  - [ ] 13.3 Implement clipboard actions for `COPY CODE` (copies 6-char code) and `COPY INVITE LINK` (copies `${window.location.origin}/room/${code}`).
  - [ ] 13.4 Render the `START AUCTION` button for the host, disabled with helper text `Need at least 2 managers` when `managers.length < 2`, and active when `managers.length >= 2`.
- **Files Affected**:
  - `packages/client/src/components/room/RoomLobby.tsx` (new)
- **Verification**:
  - Open `/room/:code` as Host (1/4 managers) $\rightarrow$ verify `START AUCTION` is disabled and shows `Need at least 2 managers`.
  - Join as second manager $\rightarrow$ verify seat `2/4` populates in real time and `START AUCTION` becomes active.
- **Acceptance Criteria**:
  - [ ] Lobby badges, copy buttons, seat grid, and 2-manager quorum gate operate in real time via Socket.IO.

---

#### Step 14: Implement the Live Auction Stage, Player Card, Bidding Panel & Hotkeys
- **Objective**: Build the three-column real-time auction interface (`YOUR SQUAD` left ledger, `NOW BIDDING` center player showcase + controls + `LIVE AUCTION FEED`, and `LIVE MANAGERS` right panel) plus the top room bar (`Lot X`, `Y in pool`, room code, `Pause`, chat, audio toggle) and keyboard shortcuts (`1–4` quick bid, `S` skip).
- **Prerequisites**: Steps 9, 10, and 13 completed.
- **Coding Actions**:
  - [ ] 14.1 Create `packages/client/src/components/room/AuctionTopBar.tsx` displaying competition badge (`PL Premier League 2026-27`), `Lot X`, `Y in pool`, room code, Host `Pause` toggle button, chat drawer button, and sound toggle.
  - [ ] 14.2 Create `packages/client/src/components/room/YourSquadLedger.tsx` (Left Panel):
    - Displays remaining coin balance, `spent X · max bid Y`, `N/18` count, `18 - N slots left`, and 18 visual progress dots.
    - Displays yellow warning banner `⚠️ You still need a goalkeeper` whenever the acquired squad contains zero `GK` players.
    - Lists acquired players (or empty state `"No players yet. Your first signing will appear here."`).
  - [ ] 14.3 Create `packages/client/src/components/room/PlayerCardShowcase.tsx`:
    - Renders the blue stylized FIFA/EA FC card with OVR (`82`), primary position (`LW`), nation code (`BE`), club crest, player cutout photo, uppercase surname (`DOKU`), club name (`MANCHESTER CITY`), 2x3 attribute grid (`PAC`, `SHO`, `PAS`, `DRI`, `DEF`, `PHY`), rarity label (`— RARE —`), and license attribution footer.
  - [ ] 14.4 Create `packages/client/src/components/room/BiddingControls.tsx`:
    - Circular SVG countdown progress ring showing remaining seconds (`13 SECONDS`), player full name (`JÉRÉMY DOKU`), nationality flag/name, age (`24 yrs`), and preferred foot (`Right foot`).
    - Current bid box showing `OPENING BID` / `CURRENT BID`, coin icon + amount (`10`), and bidder status (`No bids yet` or `Highest bidder: <username>`).
    - 4 neon quick-bid buttons (`+10`, `+25`, `+50`, `+100`) displaying the resulting total bid underneath each increment (`10`, `25`, `50`, `100` on opening lot) and disabling any button whose target exceeds `maxBid`.
    - Manual numeric input with placeholder `${minValidBid}–${maxBid}`, `BID` button, and `SKIP` button.
    - Footer hint: `Keys: 1–4 quick bid · S skip` and `Max bid <maxBid>`.
  - [ ] 14.5 Bind `window` `keydown` listener in `BiddingControls.tsx` (ignoring events when focused inside a text `<input>`):
    - Keys `'1'`, `'2'`, `'3'`, `'4'` trigger quick-bid buttons 0, 1, 2, 3 respectively.
    - Key `'s'` or `'S'` triggers `auction:skip`.
  - [ ] 14.6 Create `packages/client/src/components/room/LiveManagersPanel.tsx` (Right Panel) showing every manager's avatar, username, host crown, `YOU` badge, remaining coins, `N/18` count, and real-time status (`THINKING`, `WINNING`, `SKIPPED`), plus a modal inspector when clicked (`tap to see squads · trade`).
  - [ ] 14.7 Create `packages/client/src/components/room/LiveAuctionFeed.tsx` (Bottom Panel) rendering the chronological bulleted log (`Auction starting...`, `<user> joined`, bid events, sold events).
- **Files Affected**:
  - `packages/client/src/components/room/AuctionTopBar.tsx` (new)
  - `packages/client/src/components/room/YourSquadLedger.tsx` (new)
  - `packages/client/src/components/room/PlayerCardShowcase.tsx` (new)
  - `packages/client/src/components/room/BiddingControls.tsx` (new)
  - `packages/client/src/components/room/LiveManagersPanel.tsx` (new)
  - `packages/client/src/components/room/LiveAuctionFeed.tsx` (new)
- **Verification**:
  - Start an auction with 2 connected clients; test clicking `+10`, pressing keys `1–4`, pressing `S`, entering manual bids, and verifying the countdown ring and feed update synchronously across both browser windows.
- **Acceptance Criteria**:
  - [ ] All panels, dynamic max bid readouts (`830`), goalkeeper warnings, quick-bid sub-labels, and keyboard hotkeys (`1–4`, `S`) match the verified UI and business rules.

---

#### Step 15: Implement the `SOLD!` Overlay, Post-Match Summary & Profile/Analytics Page
- **Objective**: Build the full-screen `SOLD!` transition modal, the post-auction standings & squad evaluation view, the Global Leaderboard view, and the comprehensive Manager Profile & Achievements page.
- **Prerequisites**: Steps 7 and 14 completed.
- **Coding Actions**:
  - [ ] 15.1 Create `packages/client/src/components/room/SoldOverlayModal.tsx`:
    - Displays tilted player card on the left.
    - Displays red neon stamp `SOLD!`, player name (`JÉRÉMY DOKU`), `SOLD TO` buyer avatar + name (`YOU!` if won by current user), `FOR` coin amount (`10 COINS`), and conditional valuation pill (`🟢 Bargain · est. value 125` when `price <= estValue / 3`).
  - [ ] 15.2 Create `packages/client/src/components/room/PostAuctionSummary.tsx`:
    - Displays final room podium (`1st`, `2nd`, `3rd`), each manager's `Squad Score`, Starting XI OVR, Chemistry, Tactics score, ELO delta (for Ranked), and any newly unlocked achievements.
  - [ ] 15.3 Create `packages/client/src/pages/ProfilePage.tsx` matching the two verified Profile screenshots:
    - **Manager Identity Banner**: Large neon initial avatar, `MANAGER · YOU`, username, `Member since <Month Year> · loves <League> · plays <Formation>`, `ELO` score (`1172`), and `GLOBAL RANK` (`#3`).
    - **Split Mode Cards**: Side-by-side `RANKED ⚡` and `CASUAL` 6-metric grids (`GAMES`, `WINS`, `PODIUMS`, `WIN RATE`, `AVG SCORE`, `BEST SCORE`).
    - **Squad Score · Last 3 Games Chart**: SVG/Canvas line chart with y-axis `70, 80, 90, 100`, x-axis `oldest` to `latest`, neon green line, hollow dots for non-wins, filled dots for wins, and hover tooltip (`Filled dots are wins. Hover for details.`).
    - **Transfer Habits Card**: `AVG SPEND`, `BARGAINS`, `OVERPAYS` metric boxes; `🟢 Best bargain: <Player> — <Price> for ~<EstValue>`; `💰 Record signing: <Player> — <Price>`; and `FORMATIONS` horizontal cyan progress bars with counts (`4-3-3`, `4-1-2-1-2`).
    - **Achievements Grid (`X/16 unlocked`)**: 4x4 grid of all 16 achievements showing icon, title, description, tier (`BRONZE`, `SILVER`, `GOLD`), and either unlock date (`10/14/2026` with highlighted gold/amber border) or `LOCKED` dimmed state.
    - **Recent Matches List**: Cards showing medal icon (`1st`, `2nd`, `3rd`), competition title (`La Liga auction`, `Premier League auction`), `<N> players · <place> · <date>`, and bold squad score (`85.4`, `81.0`).
  - [ ] 15.4 Create `packages/client/src/pages/LeaderboardPage.tsx` displaying top managers ranked by ELO, win rate, and best squad score.
- **Files Affected**:
  - `packages/client/src/components/room/SoldOverlayModal.tsx` (new)
  - `packages/client/src/components/room/PostAuctionSummary.tsx` (new)
  - `packages/client/src/pages/ProfilePage.tsx` (new)
  - `packages/client/src/pages/LeaderboardPage.tsx` (new)
- **Verification**:
  - Complete a match and navigate to `/profile`. Verify that all cards, charts, transfer habits, achievement unlock counters (`X/16 unlocked`), and recent match rows render accurately from live backend data.
- **Acceptance Criteria**:
  - [ ] `SOLD!` modal renders after every won lot with accurate bargain calculation; Profile page displays every verified section, chart, habit metric, and 16-badge matrix.

> **CHECKPOINT 4**: Verify that all frontend routes build cleanly (`npm run build --workspace=@football-auction/client`) with zero TypeScript or bundler warnings.

---

### Phase 5: End-to-End Integration, Edge-Case Hardening & Final Verification

---

#### Step 16: Multi-Client Concurrency, Edge-Case Hardening & Disconnection Handling
- **Objective**: Harden the server and client against race conditions, simultaneous sub-second bids, budget exhaustion traps, and mid-auction disconnects.
- **Prerequisites**: Steps 10 and 15 completed.
- **Coding Actions**:
  - [ ] 16.1 Add server-side per-room mutex/serialization queue for incoming `auction:bid` events and validate monotonic bid increments so simultaneous bids for the same amount accept the first arrival and reject the second with a clear message.
  - [ ] 16.2 Handle keyboard shortcut suppression when the user is typing in the room chat drawer or the manual bid input box.
  - [ ] 16.3 Implement graceful reconnection: if a browser refreshes on `/room/:code` during an active auction, re-bind the user's `userId` to their existing `ManagerSeat` and immediately push the current `RoomState` snapshot.
  - [ ] 16.4 Write multi-client Socket.IO integration tests in `packages/server/src/__tests__/concurrency.test.ts` testing:
    - Two clients firing `auction:bid` within 5ms of each other.
    - Anti-snipe reset triggering repeatedly at `2s` remaining.
    - Manager attempting to bid when `squad.length === 18`.
    - Client disconnecting and reconnecting mid-lot.
- **Files Affected**:
  - `packages/server/src/rooms/AuctionRoom.ts` (modified — reconnection & strict bid serialization)
  - `packages/server/src/__tests__/concurrency.test.ts` (new)
- **Verification**:
  - Run `npx vitest run packages/server/src/__tests__/concurrency.test.ts`.
- **Acceptance Criteria**:
  - [ ] Zero race conditions on simultaneous bids; refreshing the browser mid-auction restores the exact lot, countdown, purse, and squad ledger.

---

#### Step 17: End-to-End Playwright Test Suite & Production Deployment Configuration
- **Objective**: Validate the complete system end-to-end across multiple browser contexts and configure the build and start scripts for Render deployment.
- **Prerequisites**: Step 16 completed.
- **Coding Actions**:
  - [ ] 17.1 Install and configure Playwright (`@playwright/test`) at the workspace root (`playwright.config.ts`).
  - [ ] 17.2 Write E2E test suite `e2e/auction-lifecycle.spec.ts` automating:
    1. Manager A registers and creates a Premier League room (`1,000` budget, `30s` timer, `Anti-snipe` on).
    2. Assert `START AUCTION` is disabled while Manager A is alone (`1/4`).
    3. Manager B registers in a second isolated browser context and joins via the 6-character room code.
    4. Manager A clicks `START AUCTION`.
    5. Verify Lot 1 displays `161 in pool`, `1,000` balance, `max bid 830`, and `You still need a goalkeeper`.
    6. Manager A presses hotkey `1` (bids `10`); Manager B skips (hotkey `S`).
    7. Verify `SOLD!` modal appears showing `10 COINS` and `Bargain · est. value ...`.
    8. Fast-forward/complete auction and verify `/profile` updates games count, squad score chart, recent matches, and unlocks `First Whistle` and `Bargain Hunter`.
  - [ ] 17.3 Configure Express in `packages/server/src/index.ts` to serve the built static client (`packages/client/dist`) in production mode with SPA fallback (`* -> index.html`) so `/room/:code` deep links work on Render.
  - [ ] 17.4 Create `render.yaml` Blueprint for 1-click deployment on Render (Web Service + managed PostgreSQL).
- **Files Affected**:
  - `playwright.config.ts` (new)
  - `e2e/auction-lifecycle.spec.ts` (new)
  - `packages/server/src/index.ts` (modified — static SPA serving)
  - `render.yaml` (new)
- **Verification**:
  - Run `npm run build` at root.
  - Run `npx playwright test`.
- **Acceptance Criteria**:
  - [ ] All unit, integration, and Playwright E2E tests pass (`0` failures).

---

## 7. Integration and Data Flow Summary

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React + Zustand)                         │
│                                                                            │
│  [PlayPage] ──POST /api/rooms──► Creates Room & Navigates to /room/:code   │
│                                                                            │
│  [RoomPage] ◄══Socket.IO (room:state, auction:tick, auction:lotSold)══►    │
│     ├─► YourSquadLedger (Balance, Spent, MaxBid=830, 0/18, GK Warning)     │
│     ├─► PlayerCardShowcase (OVR, Pos, Nation, Club, PAC/SHO/PAS/DRI/DEF/PHY)│
│     ├─► BiddingControls (+10/+25/+50/+100, Manual Bid, Skip, Keys 1-4 & S) │
│     └─► SoldOverlayModal ("SOLD!", Price, "Bargain · est. value X")        │
└───────────────────────────────────────┬────────────────────────────────────┘
                                        │ WebSocket / REST
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                     SERVER (Express + Socket.IO + Prisma)                  │
│                                                                            │
│  [RoomManager] ──► Manages active AuctionRoom instances in memory          │
│  [AuctionRoom] ──► Authoritative 1s clock, Anti-Snipe (<=3s -> 5s),        │
│                    MaxBid validation, Skip quorum resolution               │
│  [MatchSettlementService] ──► Computes Squad Score, Chemistry, Tactics,    │
│                               Pairwise Ranked ELO, & 16 Achievements       │
└───────────────────────────────────────┬────────────────────────────────────┘
                                        │ Prisma ORM
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE (Users, Players, Matches)            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Testing and Validation Reference Commands

Execute the following commands in order to validate the workspace at each stage:

| Verification Stage | Command | Expected Result |
| :--- | :--- | :--- |
| **Type Checking** | `npm run typecheck` | `tsc --noEmit` exits with code `0` across `shared`, `server`, and `client`. |
| **Domain Math Unit Tests** | `npm test --workspace=@football-auction/shared` | All tests in `math.test.ts` (Max Bid `830`, Quick Bids, Bargain $\le \frac{1}{3}V_{\text{est}}$, ELO, Squad Score) pass. |
| **Database Seed Check** | `npx prisma db seed --schema=packages/server/prisma/schema.prisma` | Seeds 569 global players across all 7 pools with exact pool counts verified. |
| **Backend & Socket Tests** | `npm test --workspace=@football-auction/server` | Auth, Profile, 16 Achievements, Room lifecycle, Anti-Snipe, and Concurrency suites pass. |
| **Production Build** | `npm run build` | Compiles `shared`, `server`, and Vite `client` bundle with zero errors. |
| **Multi-Client E2E Tests** | `npx playwright test` | Headless Chromium multi-context auction workflow completes and verifies Profile updates. |

---

## 9. Debugging and Troubleshooting Guide

1. **Max Bid Mismatch on Client vs. Server**:
   - *Symptom*: Client UI allows clicking a quick-bid button that the server rejects.
   - *Fix*: Ensure both client and server import `calculateMaxBid` and `calculateQuickBidTargets` directly from `@football-auction/shared` rather than duplicating math logic.
2. **Timer Drift or Multiple Interval Leaks**:
   - *Symptom*: Auction countdown ticks down twice as fast after a lot finishes or after unpausing.
   - *Fix*: Always call `clearInterval(this.timerHandle)` and set `this.timerHandle = null` inside `AuctionRoom` before starting a new lot timer or transitioning to `LOT_SOLD_TRANSITION`.
3. **Hotkeys Firing While Typing in Manual Bid Input or Chat**:
   - *Symptom*: Typing `100` in the manual bid input immediately fires the `+10` quick bid when `1` is pressed.
   - *Fix*: In `BiddingControls.tsx`, check `if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;` at the top of the `keydown` handler.
4. **Direct Navigation to `/room/TC3K68` Returns 404 on Refresh**:
   - *Symptom*: Refreshing a room URL in production returns an Express 404.
   - *Fix*: Ensure the Express static catch-all route (`app.get('*', ...)`) is registered *after* all `/api/*` routes so client-side React Router handles `/room/:code`.

---

## 10. Final Verification and Completion Checklist

Mark the implementation complete only when all items below are checked:

- [ ] **Pool Integrity**: All 7 competition pools load with their exact verified player counts (`162`, `114`, `138`, `112`, `314`, `508`, `569`).
- [ ] **Room Configurator**: Supports custom room name, 7 pools, `2026-27` season, room sizes `2–6`, budgets `500–2,000`, timers `15s–45s`, Casual/Ranked modes, Private/Public visibility, and Anti-snipe toggle.
- [ ] **Pre-Auction Lobby**: Displays all room parameter pills, 6-character code, `Copy Code` & `Copy Invite Link` actions, live manager seat grid, and enforces the $\ge 2$ manager quorum on `Start Auction`.
- [ ] **Live Bidding & Safety Reserve**: Enforces opening bid of `10`, quick bids (`+10`, `+25`, `+50`, `+100`), manual bid range, keyboard hotkeys (`1–4`, `S`), and the exact Max Bid formula ($\text{Balance} - ((18 - N_{\text{current}} - 1) \times 10)$).
- [ ] **Anti-Snipe Clock**: Bids placed with $\le 3\text{s}$ remaining reliably reset the clock to $5\text{s}$.
- [ ] **Sold Modal & Bargain Detection**: Displays `SOLD!` overlay after each won lot and highlights `Bargain · est. value X` whenever $\text{Price} \le \frac{1}{3}V_{\text{est}}$.
- [ ] **Profile & 16 Achievements**: Accurately computes ELO, Global Rank, Ranked/Casual split stats, Last 3 Games trend chart, Transfer Habits (Avg Spend, Bargains, Overpays, Best Bargain, Record Signing, Formations), all 16 Bronze/Silver/Gold achievements, and Recent Matches list.
- [ ] **Automated Verification**: `npm run typecheck`, `npm test`, `npm run build`, and `npx playwright test` all pass with zero errors.