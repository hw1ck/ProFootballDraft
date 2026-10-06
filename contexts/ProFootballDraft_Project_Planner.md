ProFootballDraft

Project Planner

Product plan, feature scope, user flow, and action items

# 1. Landing / Game Overview

First screen a new visitor sees before signing in.

Catchy headline/tagline.

Short explanation of ProFootballDraft.

Overview of game modes.

Example player cards/team.

How it works.

Sign in / Play button.

Goal: make the user think, “This looks fun. I want to play this with my friends.”

# 2. Authentication

Users create an account or sign in before accessing the main game.

Maintain profile, game history, statistics, friends, previous rooms, and achievements eventually.

Exact authentication provider is not decided.

# 3. User Dashboard

Main hub after login.

Play section with game modes.

Recent Rooms for recent/current games.

Profile summary: games played, wins, best squad OVR, win rate, favorite player, favorite formation.

Friends: friends/online users and quick game joining.

# 4. Game Modes

Simple Draft — straightforward player draft to build the strongest team.

TOTY — special draft focused on elite/top players.

Live Season Fantasy — players/value/evaluation influenced by current-season performance.

Favorite Builder — relaxed dream/favorite team building without the same competitive restrictions.

Exact rules still need to be defined later.

# 5. Game Mode Information Screen

Show a short explanation before room creation.

Show number of players, draft rounds, draft style, squad size, evaluation method, and relevant rules.

Options: Create Room / Join Room.

# 6. Room / Lobby System

User creates a game and becomes host.

System creates a room with a room code, e.g. X7K29.

Friends join using the room code; invite link can be added eventually.

Lobby shows the host and all players.

Players wait until the host starts.

# 7. Host Controls

Host can start the game.

Host can remove a player.

Host can configure game settings.

Host can see who is ready.

Host controls the lobby/game start, not gameplay advantages.

# 8. Game Settings

Host configures rules where the selected mode allows.

Number of players.

Draft order: Random / Snake / Fixed.

Squad: Starting XI / XI + Bench.

Formation: Any / Fixed.

Draft timer: 15 sec / 30 sec / 60 sec / No timer.

Evaluation: OVR / OVR + Chemistry / OVR + Tactical Fit / Custom.

Not every mode needs every setting.

# 9. Draft / Player Picking

Main gameplay phase.

Users take turns selecting footballers.

Available players depend on the game mode.

Picked players become unavailable to others.

Different draft systems can be used, such as snake, random turns, or mode-specific mechanics.

Timed selections may be used.

# 10. Mobile-First Player Cards

Basic card: player name, position, OVR, main attributes, club, nation, and player image.

Example stats: PAC, SHO, PAS, DRI, DEF, PHY.

Tapping a card opens the detailed player profile.

Draft screen stays fast/simple; deeper information is behind a tap.

# 11. EA FC-Style Player Data

Core part of ProFootballDraft.

Player data includes OVR, position, Pace, Shooting, Passing, Dribbling, Defending, Physical, detailed attributes, preferred positions, club, nation, height, foot, PlayStyles, etc.

Exact data source/API is not yet finalized.

# 12. Team Building Phase

After the draft, the user builds the actual team.

Starting XI, bench, formation, player positions, captain, tactics, and strategy.

Drafting good players alone is not enough; team construction matters.

# 13. Position Suitability

Players have different effectiveness by position.

Example: Mbappé — ST 91, LW 91, RW 88, CAM 80.

Putting a player in an unsuitable position reduces the effective rating.

Adds post-draft strategy.

# 14. Chemistry / Team Synergy

Potentially a custom system, not exact EA FC chemistry.

Factors: club, nation, league, position, and playstyle.

Could produce a Team Synergy score, e.g. 87.

Playstyle examples: possession, counter attack, high press.

# 15. Tactical Fit

Final team is not judged only by OVR.

Potential factors: player quality, position fit, chemistry/synergy, tactical fit, and squad balance.

Example evaluation: Player Quality 91; Position Fit 89; Chemistry 86; Tactical Fit 92; Squad Balance 88; Final Rating 89.4.

A team with slightly weaker players can win through better team construction.

# 16. Team Lock

User presses LOCK TEAM.

After locking, no changes are allowed.

Status shown per player: Locked / Building.

Once everyone locks, evaluation starts.

# 17. Final Evaluation

Every team receives a final score/rating.

Potential components: Squad OVR, position fit, chemistry, tactical fit, squad balance, and mode-specific factors.

Exact scoring math remains to be designed.

# 18. Final Leaderboard

Shows final rankings.

Example: 1st Hrithwik 91.7; 2nd Rahul 90.9; 3rd Arjun 88.4; 4th Karthik 86.7.

Definitive game result.

# 19. Detailed Team Analysis

Shows why a team received its rating.

Components: Squad OVR, Synergy, Tactical Fit, Position Fit, Balance, and Final Rating.

Makes scoring feel legitimate.

# 20. Head-to-Head Team Comparison

Compare two teams.

Categories: Attack, Midfield, Defense, GK, Synergy, Tactical Fit, and Final.

Can explain why one team won, e.g. better midfield balance and higher team synergy.

# 21. Game Summary

Post-game summary instead of an abrupt ending.

Potential awards: Best Draft, Best Player, Best Value Pick, Best Formation, Highest Chemistry, Biggest Steal, and Best Tactical Setup.

# 22. Rematch / Replay

After the game: Play Again, Rematch, Create New Room, Return to Dashboard, and Share Results.

Rematch is useful for friend groups.

# 23. Shareable Results

Eventually allow users to share results outside the website.

Example share card: ProFootballDraft, winner, squad rating, formation, synergy, and tactical fit.

Could work for WhatsApp/Instagram.

# 24. Mobile-First Design Philosophy

Primary design target: Phone → Tablet → Desktop.

Do not design desktop-first and simply shrink it for phones.

Large touch targets.

Minimal clutter.

Bottom navigation where appropriate.

Swipeable cards.

Bottom sheets for details.

Drag-and-drop where practical.

Fast player selection.

Important information visible without excessive scrolling.

Detailed information behind taps.

Responsive layouts.

Draft screen especially needs to be fast and comfortable on a phone.

# Overall User Journey

NEW USER → LANDING / DISCOVER → SIGN IN / UP → DASHBOARD → SELECT MODE → MODE INFORMATION → CREATE ROOM or JOIN ROOM → LOBBY → GAME SETTINGS → DRAFT → TEAM BUILDING → LOCK TEAM → EVALUATION → LEADERBOARD → TEAM ANALYSIS / COMPARISON → GAME SUMMARY → REMATCH or DASHBOARD

# Core Product Loop

Draft well — Who can I get?

Build well — How do I use the players I got?

Optimize well — How do I maximize the final team rating?

# Action Items

Define the exact rules for each game mode.

Define the exact game-mode information shown before room creation.

Define the final game settings and which settings are available in each mode.

Define the exact player data fields required for EA FC-style player cards.

Finalize the player data/API source.

Define position suitability ratings/effectiveness.

Design the Chemistry / Team Synergy system.

Design the Tactical Fit system.

Define the exact final evaluation/scoring formula.

Design the team-lock flow and player status states.

Design the final leaderboard.

Design detailed team analysis and head-to-head comparison.

Define the post-game awards and summary.

Define the rematch/replay flow.

Plan the shareable results card.

Design the complete experience mobile-first.

# 25. Game Mode Draft Rules — Initial Definition

The first two draft modes use different selection mechanics. Both modes end with the same 16-player squad and continue into Team Building, Team Lock, Evaluation, and Results.

## 25.1 Classic Draft

Players: 2 or more.

Each round shows 5 player cards to each user.

Each user selects exactly 1 player card per round.

Each user completes 16 draft rounds and finishes with 16 players.

The 4 unselected cards from a user’s selection disappear and are not awarded to another user.

A player selected by one user must not be available to another user in the same draft.

The draft should provide varied card quality so users have meaningful choices rather than receiving only elite or only low-rated players.

The exact OVR ranges and probabilities are intentionally left for later tuning.

## 25.2 Merge Draft

Players: exactly 2.

Each round shows 2 player cards shared by both players.

Each player selects exactly 1 of the 2 cards.

After both selections, each player receives the card they selected; the unselected card is automatically assigned to the opponent.

Each player completes 16 rounds and finishes with 16 players.

The two cards should form a meaningful choice. They should not be generated as two completely unrelated random players.

The system should consider quality and player characteristics when creating a pair so that choosing one card has a meaningful consequence for the opponent.

The exact OVR ranges and probabilities are intentionally left for later tuning.

# 26. Curated Player Pool

The master player database may contain a very large number of footballers, but draft modes must not expose the entire database directly. Each game uses a smaller curated pool of recognizable and relevant players.

The master database stores the full available player dataset.

A separate eligibility/curation layer determines which players can enter a game mode.

The curated pool should prioritize recognizable players from major leagues while allowing notable players from other leagues and countries.

Popularity/recognition may be stored as a player-data attribute and used by draft generation.

Low-rated, obscure, inactive, duplicate, or otherwise unsuitable players should normally be excluded from the standard draft pool.

The exact size of the curated pool is not fixed yet and should be tuned based on room size, mode, and playtesting.

Draft-generation code should consume the curated pool rather than querying the entire master database directly.

# 27. Draft Card Generation System

Draft cards must be generated through a controlled system rather than pure random selection. The system should create balanced choices while preserving uncertainty and luck.

## 27.1 Player Quality Tiers

Use relative quality tiers instead of hard-coding final OVR numbers at this stage:

Elite — rare, high-impact players.

High — strong players who appear regularly enough to matter.

Good — normal useful draft options.

Average — lower-quality but still playable options.

The actual OVR boundaries and probability values will be defined later. The code should therefore keep these values configurable rather than embedding them throughout the draft logic.

## 27.2 Classic Draft Card Generation

Generate the quality composition for the 5-card selection first.

Select actual eligible players that satisfy the generated quality requirements.

Apply basic variety rules so a selection is not unnecessarily repetitive.

Prevent already-selected players from appearing again in the same game.

Use weighted randomness so most rounds are normal, stronger rounds occur sometimes, and rare lucky rounds can contain elite options.

Do not make every round follow the same visible quality pattern.

The overall 16-round draft should have controlled quality distribution, while the exact location of stronger opportunities remains random.

Use a soft anti-bad-luck mechanism so a player is not likely to receive a long sequence of weak selections. This should increase the chance of a stronger opportunity rather than guarantee a specific player or tier.

## 27.3 Merge Draft Card Generation

Generate a pair profile first, then select the two actual players.

Pairs should normally have enough quality or role relevance to create a meaningful decision.

Possible pair relationships include similar-quality players, strong-vs-strong choices, different-position choices, or other strategically relevant combinations.

A pair must not be designed so that one card is always obviously correct.

Use the same configurable quality tiers and weighted randomness used by the draft system, but tune the pair-generation rules specifically for two-player competition.

Prevent already-distributed players from appearing again in the same game.

The system should account for the fact that the unselected card is automatically awarded to the opponent.

## 27.4 Shared Draft Generation Principles

Luck should influence the quality of opportunities, but should not determine the winner by itself.

Players should still need to make good decisions and later optimize positions, synergy, tactics, and squad balance.

Quality distribution must be controlled across the whole draft, not independently optimized only one round at a time.

All thresholds, weights, tier probabilities, and tuning values should be configuration-driven so they can be changed without rewriting the draft engine.

The draft engine should separate player-pool eligibility, quality selection, card/pair generation, duplicate prevention, and mode-specific rules into clear responsibilities.

Classic Draft and Merge Draft should share reusable generation utilities where appropriate but retain separate mode rules rather than being implemented as one heavily conditional algorithm.

# 28. Draft System Implementation Boundary

To keep the system maintainable and easy for an AI coding agent to implement, the draft system should be separated conceptually into the following responsibilities:

Player Pool Service — provides eligible players for the selected mode.

Quality/Tier Configuration — stores configurable OVR bands and generation weights.

Card Generation Service — generates a valid Classic Draft selection.

Pair Generation Service — generates a valid Merge Draft pair.

Draft State — tracks round, available players, selections, and each user’s drafted players.

Draft Rules — validates mode-specific actions such as player count, selection count, and player availability.

Randomness/Tuning Layer — owns weighted selection and anti-bad-luck tuning so it can be adjusted independently.

Team Building receives only the finalized 16-player squad and should not need to know how the draft cards were generated.

# Updated Action Items — Draft System

Define exact rules for Classic Draft.

Define exact rules for Merge Draft.

Define the curated player-pool eligibility rules.

Define player recognition/popularity handling.

Define relative player quality tiers.

Define Classic Draft card-quality distribution and weighted probabilities.

Define Merge Draft pair-generation rules and pair-quality distribution.

Define duplicate-prevention rules.

Define soft anti-bad-luck behavior.

Tune exact OVR thresholds and probabilities through playtesting.

Keep all draft-generation thresholds and weights configurable.

# 29. Proposed Technology Stack

For the MVP, the app will be built as a single TypeScript/Next.js application to simplify maintenance and deployment.

## 29.1 Frontend
- **Next.js**
- **TypeScript**
- **React**
- **Tailwind CSS v4**
- Responsive/mobile-first UI

## 29.2 Backend
- **TypeScript / Node.js**
- API layer integrated with the Next.js ecosystem rather than Spring Boot, enabling easy deployment to Vercel.

## 29.3 Database
- **PostgreSQL**
- ORM/database layer: **Prisma** or a similar TypeScript-friendly ORM.
- Managed PostgreSQL provider (to be finalized).

## 29.4 Authentication
- A Next.js-compatible authentication solution (exact provider to be finalized).

## 29.5 Real-time / Multiplayer
For rooms, locking, live draft state, and multiplayer synchronization:
- WebSockets / realtime service
- Could use a managed realtime backend if it simplifies the MVP (exact provider to be finalized).

## 29.6 Player Data & Domain Logic
The normalized player dataset acts as the initial data source:
- Player information, Global OVR, Position ratings, Club, Country, League, Images/faces, etc.

The important Locker Room calculations (e.g., Chemistry, Tactical Fit) run in the **TypeScript backend/domain layer**, not in React:
`Player Data -> Game Rules / Config -> TypeScript Domain Models -> Evaluation Engine -> Team Evaluation -> Next.js UI`

## 29.7 Deployment
- **Frontend + API:** Vercel
- **Database:** Managed PostgreSQL provider
