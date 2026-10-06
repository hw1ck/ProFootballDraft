# ProFootballDraft — Locker Room & Synergy System
## Production Implementation Specification

**Document status:** Core game-mechanic specification  
**Scope:** Post-draft Locker Room, squad construction, player placement, synergy, tactical fit, team balance, and team-rating preparation  
**Audience:** AI coding assistants, frontend/backend engineers, game-system designers, QA engineers  
**Implementation goal:** An AI assistant should be able to use this document as the source of truth for implementing the Locker Room experience and its underlying game logic without having to reinterpret the core mechanic.

---

# 1. Core Design Principle

The Locker Room is the strategic phase that follows the player draft.

The central product idea is:

> **Drafting acquires talent. The Locker Room turns that talent into a functioning football team.**

The user must not win simply by drafting the players with the highest OVR.

The user should be rewarded for:

- Selecting the right Starting XI
- Putting players in suitable positions
- Choosing an appropriate formation
- Creating complementary player relationships
- Creating complementary football roles
- Avoiding role conflicts and structural weaknesses
- Building a tactically coherent team
- Maintaining team balance

The Locker Room therefore functions as a **team-building puzzle**, not merely a chemistry screen or squad display.

The intended gameplay loop is:

```text
DRAFT
  ↓
LOCKER ROOM
  ↓
CHOOSE / CHANGE FORMATION
  ↓
BUILD STARTING XI
  ↓
OPTIMIZE PLAYER POSITIONS
  ↓
CREATE / DISCOVER SYNERGIES
  ↓
IMPROVE TACTICAL FIT
  ↓
IMPROVE TEAM BALANCE
  ↓
LOCK TEAM
  ↓
FINAL EVALUATION
```

---

# 2. Scope

## 2.1 In Scope

The Locker Room system must support:

1. Starting XI construction
2. Bench management
3. Formation selection
4. Formation switching
5. Player placement
6. Drag-and-drop player placement
7. Accessible non-drag placement
8. Player swapping
9. Player removal from Starting XI
10. Position suitability
11. Player roles
12. Player playstyles/traits
13. Player-to-player synergy
14. Small-unit synergy
15. Team-level synergy
16. Club/country/league connections
17. Complementary role detection
18. Role conflict detection
19. Tactical identity
20. Tactical fit
21. Team balance
22. Team-rating preview
23. Explainable feedback
24. Synergy visualization
25. Team locking
26. Validation before locking

## 2.2 Explicitly Out of Scope for the Initial Version

Do NOT introduce these systems unless a later game-design decision explicitly adds them:

- Manual chemistry-link assignment
- Chemistry consumables
- Chemistry styles
- Contracts
- Player morale
- Player stamina simulation
- Player salaries
- Transfers during the Locker Room
- Real-time football simulation
- Dozens of manual tactical sliders
- Football Manager-style detailed instructions
- Manual assignment of microscopic player instructions
- Manual chemistry calculations by the user
- Complex match simulation
- Training systems
- Player development systems

The Locker Room must remain understandable and fast.

---

# 3. Player Data Requirements

The Locker Room depends on structured player data.

Every drafted player should expose, directly or through a normalized domain model, at least:

## 3.1 Identity

```text
playerId
name
image
clubId
clubName
countryId
countryName
leagueId
leagueName
```

## 3.2 Rating

```text
overallRating
pace
shooting
passing
dribbling
defending
physical
```

Additional detailed attributes may exist in the player database but should not all be displayed simultaneously.

## 3.3 Position Data

A player should have:

```text
primaryPositions[]
secondaryPositions[]
positionRatings[]
```

Example:

```text
ST: 91
LW: 91
RW: 88
CAM: 80
```

The game must NOT assume that the player's global OVR is identical at every position.

## 3.4 Role Data

Each player should have one or more functional football roles.

Example:

```text
roles:
  - Orchestrator
  - DeepPlaymaker
```

A player may have:

- Primary role
- Secondary role
- Supporting traits

## 3.5 Playstyle / Trait Data

Example:

```text
traits:
  - TempoController
  - ProgressivePasser
  - PressResistant
```

The exact final PlayStyle taxonomy is a separate design task.

## 3.6 Functional Characteristics

The synergy engine should eventually be able to evaluate characteristics such as:

```text
creativeContribution
progression
chanceCreation
ballRetention
ballCarrying
defensiveCoverage
pressing
movement
finishing
width
buildUp
aerialThreat
transitionAbility
positionalDiscipline
```

These values can be derived from player attributes, roles, and playstyles rather than necessarily being manually stored.

---

# 4. Locker Room UI Structure

The Locker Room is divided into five conceptual areas.

## 4.1 Football Pitch

The pitch is the primary workspace.

It displays:

- Current formation
- Eleven position slots
- Starting players
- Player cards
- Position labels
- Synergy indicators
- Optional connection lines
- Structural feedback

The pitch should be the visual focus.

## 4.2 Formation Selector

The user can select a supported formation.

Examples:

- 4-3-3
- 4-2-3-1
- 3-4-3
- 4-4-2
- etc.

The formation system must be data-driven.

Do not hard-code formation behavior directly into UI components.

A formation should be represented as data describing:

```text
formationId
name
positions[]
positionCoordinates
positionGroups
structuralRelationships
```

Example conceptual data:

```json
{
  "id": "4-3-3",
  "positions": [
    "GK",
    "LB",
    "LCB",
    "RCB",
    "RB",
    "CDM",
    "LCM",
    "RCM",
    "LW",
    "ST",
    "RW"
  ]
}
```

The actual coordinate and zone representation should be implementation-specific.

## 4.3 Starting XI

Exactly eleven slots exist for a complete Starting XI.

Every slot has:

```text
slotId
requiredPosition
playerId | null
```

A player may occupy only one Starting XI slot at a time.

## 4.4 Bench

All drafted players not currently in the Starting XI remain on the bench.

The bench is the source of players available for substitution into the XI.

The system must never lose a drafted player because of a UI move.

Moving:

```text
Bench → XI
```

must automatically update:

```text
Bench
Starting XI
Player assignment
Synergy
Position fit
Team metrics
```

Moving:

```text
XI → Bench
```

must do the inverse.

## 4.5 Team Overview

Display a concise summary:

```text
TEAM RATING       91.4

Squad Quality      92
Position Fit       94
Synergy            89
Tactical Fit       91
Balance            90
```

The exact final scoring weights are intentionally not finalized in this document.

These values should be produced by a centralized evaluation engine rather than independently calculated by UI components.

---

# 5. Player Placement

The system must support two equivalent placement methods.

## 5.1 Drag and Drop

User drags a player card onto a position.

The system:

1. Identifies the target position slot.
2. Validates the move.
3. Determines whether the target is occupied.
4. Swaps players if appropriate.
5. Updates the player's position.
6. Recalculates affected metrics.
7. Updates synergy feedback.

## 5.2 Select and Place

This is required for mobile and accessibility.

Flow:

```text
Tap player
↓
Player becomes selected
↓
Tap available position
↓
Player is placed
```

If the target position is occupied:

```text
Selected player
      ↓
Occupied position
      ↓
Swap / confirm replacement
```

Do not make drag-and-drop the only way to construct a team.

---

# 6. Position Suitability

Position suitability is independent from synergy.

A player's OVR represents their general quality.

Their effective position rating represents how suitable they are for the specific position.

Example:

```text
Player OVR: 91

ST: 91
LW: 91
RW: 88
CAM: 80
```

Therefore:

```text
Player Quality ≠ Position Fit
```

## 6.1 Position Fit States

The UI should simplify the underlying numeric calculation into three primary states:

### Natural — Green

Player is highly suited to the position.

### Adaptable — Yellow

Player can perform adequately but is not optimal.

### Out of Position — Red

Player is significantly unsuitable.

The exact thresholds should be configuration-driven.

Do not hard-code thresholds throughout UI code.

## 6.2 Position Fit Consequence

Position suitability should influence the final team evaluation.

It should not directly modify the player's database OVR.

Instead, evaluation should use an effective contribution or position-fit score.

---

# 7. Synergy Architecture

Synergy must NOT be implemented as a single opaque "chemistry" number.

It consists of multiple layers.

## 7.1 Layer A — Player Connection

Represents natural relationships between players.

Potential factors:

- Same club
- Same country
- Same league
- Future relationship metadata

Initial implementation should prioritize:

1. Club
2. Country
3. League

These connections should support synergy but must not dominate the entire system.

Example:

```text
Same club
→ strong connection

Same country
→ moderate connection

Same league
→ weaker connection
```

Exact weights are configuration values.

## 7.2 Layer B — Role Synergy

Determines whether football responsibilities complement one another.

This is the most important unique part of ProFootballDraft.

Examples:

```text
Orchestrator + Box-to-Box
→ complementary midfield responsibilities

Playmaker + Poacher
→ creator → finisher relationship

Ball-Playing Defender + Orchestrator
→ build-up relationship

Sweeper Keeper + High Defensive Line
→ tactical compatibility
```

## 7.3 Layer C — Group / Unit Synergy

Some interactions require more than two players.

Examples:

```text
Orchestrator
+
Box-to-Box
+
Playmaker
=
Balanced Midfield Triangle
```

Other examples:

```text
Playmaker + Poacher + Inside Forward
→ attacking creation/finishing structure
```

```text
Ball-Playing CB + Ball-Winning CB + Defensive Midfielder
→ defensive/build-up structure
```

Group synergy must be evaluated at the appropriate tactical unit level.

## 7.4 Layer D — Team Synergy

The entire Starting XI must be evaluated for:

- Role distribution
- Role complementarity
- Role redundancy
- Defensive coverage
- Creativity
- Progression
- Width
- Build-up
- Transition capability
- Overall structural coherence

---

# 8. Synergy Philosophy

The following rule is mandatory:

> **More links must NOT automatically mean more synergy.**

The system rewards complementary football functions.

It should distinguish:

```text
Complementarity
```

from:

```text
Redundancy
```

and:

```text
Conflict
```

## 8.1 Complementarity

A player fills a weakness or complements the responsibilities of another.

Example:

```text
Orchestrator
+
Box-to-Box
```

The Orchestrator provides distribution.

The Box-to-Box player provides movement and defensive coverage.

Result:

```text
Positive synergy
```

## 8.2 Redundancy

Players perform very similar functions and may compete for the same responsibilities.

Example:

```text
Playmaker
+
Playmaker
+
Playmaker
```

Potential result:

```text
Creative role overlap
```

This does not necessarily mean the players become "bad".

It means the combination has diminishing value.

## 8.3 Conflict

The selected players or roles actively work against the team's structure.

Example:

```text
Very aggressive attacking fullbacks
+
Weak defensive midfield coverage
```

Potential result:

```text
Transition vulnerability
```

Another example:

```text
High defensive line
+
Slow defensive structure
```

Potential result:

```text
Vulnerability to balls behind the defensive line
```

---

# 9. Emergent Synergy System

The synergy engine should be designed so that it does not require developers to manually enumerate every possible combination.

Avoid relying solely on rules such as:

```text
Orchestrator + Box-to-Box = +5
```

Instead, players should expose functional characteristics.

Conceptually:

```text
Player
├── Roles
├── Traits
├── Strengths
├── Weaknesses
├── Preferred zones
├── Creative contribution
├── Defensive contribution
├── Progression
├── Movement
├── Build-up
└── Transition behavior
```

The synergy engine evaluates interactions between those characteristics.

Example:

```text
Player A:
Strong distribution
Weak defensive coverage

Player B:
Strong ball carrying
Strong defensive coverage
```

The engine can identify:

```text
Player B covers a weakness of Player A
```

and therefore produce positive complementarity.

This architecture makes the system expandable.

New roles and traits can be added without rebuilding the entire synergy engine.

---

# 10. Synergy Scope

Synergy exists at three scopes.

## 10.1 Pair Synergy

Two players interact.

Examples:

```text
CB ↔ CDM
Fullback ↔ Winger
Playmaker ↔ Striker
```

## 10.2 Unit Synergy

A small group interacts.

Examples:

```text
Front Three
Midfield Three
CB Pair
Fullback + Winger
CB Pair + CDM
```

## 10.3 Team Synergy

The full Starting XI is evaluated.

Examples:

```text
Does the team have enough creativity?

Does the team have enough defensive coverage?

Does the team have progression?

Does the team have width?

Does the team have transition ability?
```

The system should avoid presenting the user with dozens of independent links.

The player should primarily see the meaningful relationships.

---

# 11. Formation Interaction

Formation changes the context in which players interact.

Formation is therefore a functional mechanic, not a visual setting.

Example:

In 4-3-3:

```text
LW — ST — RW

LCM — CDM — RCM
```

In 4-2-3-1:

```text
        ST

        CAM

   LM       RM

      CM — CDM
```

The same players may have different synergy because their:

- Spatial relationships
- Responsibilities
- Supporting players
- Tactical structure

have changed.

Therefore:

> **Synergy must be evaluated against the active formation and actual positions, not only against player identities.**

---

# 12. Tactical Identity

The user should select a high-level tactical identity.

Initial examples:

- Balanced
- Possession
- High Press
- Counter Attack
- Direct Play
- Defensive / Low Block
- Wide Attack
- Fast Transition

Do not initially expose dozens of sliders.

The tactical identity is a simple user-facing choice.

The evaluation engine determines whether the Starting XI supports that identity.

---

# 13. Tactical Fit

Tactical Fit answers:

> **Can this particular team effectively execute the selected tactical identity?**

Examples:

## High Press

Potentially benefits from:

- High-energy midfielders
- Pressing attackers
- Mobile defensive structure
- Appropriate defensive pace
- Suitable goalkeeper behavior

## High Defensive Line

Potentially benefits from:

- Fast defenders
- Appropriate positioning
- Sweeper Keeper
- Defensive midfield protection

## Possession

Potentially benefits from:

- Ball retention
- Passing
- Press resistance
- Orchestration
- Creative movement

The engine should produce a tactical-fit score and explain major weaknesses.

Example:

```text
Tactical Fit: 91

🟢 Strong pressing structure
🟢 Good midfield intensity
🟡 Right side lacks defensive coverage
```

---

# 14. Team Balance

Team Balance is a team-level diagnostic.

The engine should consider:

## Attack

- Finishing
- Chance creation
- Movement
- Width
- Attacking threat

## Midfield

- Creativity
- Progression
- Ball retention
- Defensive coverage
- Transition support

## Defense

- Defensive ability
- Pace
- Physicality
- Positioning
- Coverage

## Structural Balance

- Width
- Depth
- Defensive protection
- Progression
- Creative sources
- Transition capability

Do not expose all raw metrics on the main screen.

The engine can calculate many values.

The UI should surface only the most useful information.

---

# 15. Team Rating

The Locker Room should continuously calculate a preview Team Rating.

Conceptually:

```text
Team Rating
├── Squad Quality
├── Position Fit
├── Synergy
├── Tactical Fit
└── Balance
```

Example:

```text
TEAM RATING       91.4

Squad Quality      92
Position Fit       94
Synergy            89
Tactical Fit       91
Balance            90
```

These categories are intentionally separate.

The exact weighting and final formula must be centralized in the evaluation engine and finalized later.

The UI must never independently calculate a "Team Rating" using its own formula.

---

# 16. Explainability

The system must be understandable.

Players should never receive a mysterious:

```text
Synergy: 73
```

without explanation.

The system should provide concise feedback.

Examples:

```text
🟢 Strong midfield structure

🟢 Creator + Finisher combination

🟡 Right side lacks defensive coverage

🔴 Two players overlap heavily in creative responsibility
```

The explanation system should be generated from structured evaluation reasons rather than hard-coded UI text scattered across components.

Conceptually:

```text
Evaluation Result
├── score
├── category
├── severity
├── reasonCode
├── affectedPlayers[]
└── explanation
```

Example:

```json
{
  "category": "synergy",
  "severity": "positive",
  "reasonCode": "CREATOR_FINISHER",
  "affectedPlayers": ["playerA", "playerB"],
  "scoreImpact": 3,
  "message": "Creator + Finisher combination"
}
```

This allows the same evaluation output to power:

- UI
- Tooltips
- Player details
- Team analysis
- Final match summary
- Debugging

---

# 17. Synergy Visualization

The pitch may show relationships between players.

Possible states:

### Green

Strong positive synergy

### Yellow

Moderate / neutral interaction

### Red

Conflict or structural weakness

The system should not show every possible relationship simultaneously.

Only meaningful relationships should be visualized.

Tapping/clicking a connection should explain it.

Example:

```text
Orchestrator ↔ Box-to-Box

Strong complementary roles

+ Midfield progression
+ Defensive coverage
```

Another:

```text
Two Advanced Playmakers

Role overlap

- Reduced role diversity
```

The visualization is an explanation layer, not the underlying game logic.

---

# 18. Information Hierarchy

The UI must remain simple for casual players.

## Default View

Show:

```text
Team Rating

Attack
Midfield
Defense

Major positive insights
Major warnings
```

Example:

```text
91.4 TEAM RATING

ATTACK       94
MIDFIELD     91
DEFENSE      87

🟢 Strong midfield structure
🟢 Front three complement each other
🟡 Right side needs defensive coverage
```

## Expanded View

When the user taps a category:

```text
Squad Quality
Position Fit
Synergy
Tactical Fit
Balance
```

## Detailed View

When the user taps a player or synergy relationship:

Show:

- Player role
- Position suitability
- Relevant traits
- Connected players
- Positive interactions
- Negative interactions
- Explanation

This creates progressive disclosure.

---

# 19. Discovery-Based Gameplay

The system should create "aha" moments.

Example:

```text
Current Team Rating: 89.8
```

User moves one player.

```text
New Team Rating: 92.1
```

The game displays:

```text
🟢 New synergy discovered

Creator → Finisher

Your new attacking structure improves
chance creation and finishing support.
```

The user should feel that they discovered a better solution rather than being told the correct answer.

---

# 20. Do Not Reveal the Entire Optimization Problem

The game should explain enough to teach the player, but not enough to solve the puzzle automatically.

Do NOT display:

```text
"Move Player A to LCM because this produces +4.7 synergy."
```

Instead:

```text
🟡 Midfield role overlap
```

or:

```text
🟢 Strong midfield complementarity
```

This preserves experimentation.

---

# 21. Locker Room User Actions

The primary actions should be limited to:

1. Change formation
2. Place player
3. Swap player
4. Remove player from XI
5. Inspect player
6. Inspect synergy
7. Change tactical identity
8. Optimize / experiment
9. Lock team

Everything else should be automatic.

---

# 22. State Model

The Locker Room should maintain a clear domain state.

Conceptually:

```text
LockerRoomState
├── roomId
├── userId
├── draftedPlayers[]
├── formationId
├── startingXI[]
├── bench[]
├── tacticalIdentity
├── playerAssignments
├── evaluation
└── lockState
```

Example:

```json
{
  "formationId": "4-3-3",
  "startingXI": [
    {
      "slotId": "ST",
      "playerId": "p001"
    }
  ],
  "bench": [
    "p012",
    "p013"
  ],
  "tacticalIdentity": "HIGH_PRESS",
  "lockState": "BUILDING"
}
```

The actual production schema may differ, but the separation of **domain state** from UI state must be preserved.

---

# 23. Evaluation Engine Architecture

Evaluation should be centralized.

Conceptually:

```text
evaluateTeam(teamState)
        ↓
validateFormation
        ↓
calculatePositionFit
        ↓
calculatePlayerConnections
        ↓
calculatePairSynergy
        ↓
calculateUnitSynergy
        ↓
calculateTeamSynergy
        ↓
calculateTacticalFit
        ↓
calculateTeamBalance
        ↓
calculateSquadQuality
        ↓
calculateFinalTeamRating
        ↓
generateExplanations
```

The frontend must not contain the authoritative scoring logic.

If the game has a backend, the backend should be authoritative for final evaluation.

The frontend may calculate temporary previews for responsiveness, but the final locked result must be validated by the authoritative evaluation engine.

---

# 24. Determinism

For the same:

```text
players
+
formation
+
positions
+
tactical identity
+
game-mode rules
```

the evaluation should produce the same result.

Avoid randomness in the core Locker Room evaluation unless a specific game mode explicitly introduces it.

This is important for:

- Fairness
- Debugging
- Replays
- Leaderboards
- Anti-cheat
- Testing

---

# 25. Configuration Over Hard-Coding

The following should be configuration/data-driven:

- Formation definitions
- Position thresholds
- Role definitions
- Playstyles
- Role interactions
- Synergy weights
- Tactical identities
- Tactical requirements
- Balance categories
- Evaluation weights
- Explanation messages
- Game-mode modifiers

Avoid spreading game-balance constants throughout application code.

Conceptually:

```text
Game Rules
├── formations
├── positions
├── roles
├── playstyles
├── synergyRules
├── tacticalRules
├── balanceRules
└── evaluationWeights
```

This makes balancing possible without rewriting the application.

---

# 26. Mobile-First Requirements

The existing product is mobile-first.

The Locker Room must therefore support:

- Touch-friendly player cards
- Tap-to-select placement
- Drag-and-drop where practical
- Large position targets
- Bottom sheets for player details
- Compact team metrics
- Minimal scrolling
- Responsive pitch
- No dependency on hover
- Clear selected states

Desktop can provide additional space, but the core interaction must work on a phone.

---

# 27. Accessibility

Every drag-and-drop action must have a non-drag alternative.

Required:

- Keyboard/focus navigation where applicable
- Tap-to-select placement
- Clear focus states
- Accessible labels
- Meaningful player names
- No information conveyed through color alone
- Green/yellow/red states accompanied by text/icon/explanation

Example:

Do not rely only on:

```text
green line
```

Use:

```text
Strong synergy
```

as well.

---

# 28. Validation Rules

Before the team can be locked:

Required:

- Exactly 11 Starting XI players
- Every player belongs to the user's drafted pool
- No duplicate player in XI
- Every player has one valid position slot
- Formation exists
- Tactical identity is valid
- Team state is internally consistent

Warnings may include:

- Out-of-position players
- Poor synergy
- Weak defensive balance
- Tactical conflicts

Warnings should not necessarily prevent locking unless the game mode explicitly requires it.

The game should distinguish:

```text
ERROR
```

from:

```text
WARNING
```

Example:

```text
ERROR:
Starting XI requires 11 players.

WARNING:
Two players are significantly out of position.
```

---

# 29. Team Lock

The user presses:

```text
LOCK TEAM
```

After locking:

- Starting XI becomes immutable
- Formation becomes immutable
- Tactical identity becomes immutable
- Player assignments become immutable
- Evaluation begins

The existing product plan specifies that after locking, changes are not allowed and evaluation begins once everyone has locked. This behavior should remain authoritative for the multiplayer flow.

The UI should clearly show:

```text
LOCKED
```

and prevent further modification.

---

# 30. Multiplayer Considerations

Each player in a room has their own independent Locker Room state.

One user must never be able to modify another user's squad.

The server should maintain authoritative:

```text
room
user
drafted players
locker room state
lock state
```

Once a player locks:

```text
user.locked = true
```

When all participants are locked:

```text
allLocked = true
```

then final evaluation can proceed.

The Locker Room should not allow a user to alter their squad after their lock has been accepted.

---

# 31. Evaluation Output Contract

The evaluation engine should return structured information.

Conceptually:

```json
{
  "teamRating": 91.4,
  "squadQuality": 92,
  "positionFit": 94,
  "synergy": 89,
  "tacticalFit": 91,
  "balance": 90,
  "attack": 94,
  "midfield": 91,
  "defense": 87,
  "insights": [],
  "playerEvaluations": [],
  "synergyRelationships": [],
  "warnings": []
}
```

Player evaluation:

```json
{
  "playerId": "p001",
  "slotId": "ST",
  "positionFit": 0.98,
  "effectiveRating": 91,
  "positionState": "NATURAL"
}
```

Synergy relationship:

```json
{
  "type": "PAIR",
  "players": ["p001", "p002"],
  "category": "ROLE_COMPLEMENT",
  "strength": 0.84,
  "impact": 3,
  "reasonCode": "CREATOR_FINISHER"
}
```

The exact numerical representation can change during implementation, but the engine should expose structured results rather than returning only a final score.

---

# 32. Testing Requirements

The Locker Room system should be testable independently of the UI.

## Unit Tests

Test:

- Formation validation
- Position suitability
- Player placement
- Player swapping
- Bench management
- Club connection
- Country connection
- League connection
- Role complementarity
- Role redundancy
- Role conflict
- Pair synergy
- Unit synergy
- Team synergy
- Tactical fit
- Team balance
- Final evaluation
- Lock validation

## Example Test

Given:

```text
Player A = Orchestrator
Player B = Box-to-Box
Player C = Playmaker
Formation = 4-3-3
```

Expected:

```text
Midfield should receive positive complementarity
```

Given:

```text
Player A = Playmaker
Player B = Playmaker
Player C = Playmaker
```

Expected:

```text
Role redundancy should be detected
```

Given:

```text
High defensive line
Slow defenders
```

Expected:

```text
Tactical vulnerability should be detected
```

Tests should assert meaningful rules, not fragile UI implementation details.

---

# 33. UX Principles

The Locker Room must follow these principles.

## Principle 1 — Simple on the surface

A casual user should understand the screen within seconds.

## Principle 2 — Deep underneath

Expert users should discover meaningful interactions.

## Principle 3 — Every score should be explainable

No mysterious chemistry.

## Principle 4 — Experimentation should be rewarded

Moving players should immediately reveal consequences.

## Principle 5 — Don't punish unfamiliarity

Football terminology should be accompanied by understandable explanations.

## Principle 6 — Don't turn it into Football Manager

The game is about drafting and squad construction, not exhaustive tactical simulation.

## Principle 7 — OVR should matter, but never be everything

A great player in a bad structure can lose value.

## Principle 8 — Synergy should emerge from football logic

Do not reduce the system to arbitrary chemistry links.

---

# 34. What Makes ProFootballDraft Different

The Locker Room should establish the game's identity:

> **The best drafted squad is not necessarily the best team.**

Example:

### Team A

```text
Average OVR: 91
Synergy: 76
Tactical Fit: 79
Balance: 80
```

### Team B

```text
Average OVR: 88
Synergy: 93
Tactical Fit: 94
Balance: 92
```

Team B should have a legitimate chance to outperform Team A.

This creates the strategic question:

> "Do I draft the biggest names, or do I draft/build a team that can actually function?"

That is the central competitive identity of the game.

---

# 35. Recommended Player Experience

A typical Locker Room session should feel like:

```text
I finished drafting.
        ↓
I see my players.
        ↓
I choose a formation.
        ↓
I build an initial XI.
        ↓
The game highlights position issues.
        ↓
I fix obvious problems.
        ↓
I notice some synergy relationships.
        ↓
I experiment with player placement.
        ↓
My rating changes.
        ↓
I discover a stronger combination.
        ↓
I check tactical fit.
        ↓
I make final adjustments.
        ↓
I lock my team.
```

The user should spend their time **making football decisions**, not configuring software-like systems.

---

# 36. Implementation Priorities

The system should be implemented in the following order.

## Phase 1 — Squad Construction

Implement:

- Formation model
- Position slots
- Starting XI
- Bench
- Player placement
- Swapping
- Formation switching
- Team state

## Phase 2 — Position Fit

Implement:

- Position ratings
- Natural / Adaptable / Out-of-Position states
- Effective position rating
- Position-fit evaluation

## Phase 3 — Player Connections

Implement:

- Club
- Country
- League
- Basic connection strength

## Phase 4 — Roles & Playstyles

Implement:

- Role model
- Playstyle model
- Functional characteristics

## Phase 5 — Synergy Engine

Implement:

- Pair synergy
- Role complementarity
- Redundancy
- Conflicts
- Unit synergy
- Team synergy

## Phase 6 — Tactical Engine

Implement:

- Tactical identities
- Tactical requirements
- Tactical fit
- Tactical warnings

## Phase 7 — Team Balance

Implement:

- Attack
- Midfield
- Defense
- Structural balance

## Phase 8 — Evaluation

Implement:

- Squad quality
- Position fit
- Synergy
- Tactical fit
- Balance
- Final Team Rating

## Phase 9 — Explainability

Implement:

- Insights
- Warnings
- Synergy explanations
- Player explanations
- Team analysis

## Phase 10 — Locking

Implement:

- Validation
- Lock state
- Multiplayer synchronization
- Final evaluation

---

# 37. Features That Should Be Designed Later

The following should NOT block the initial Locker Room implementation.

## Later: Advanced Manager System

Managers could modify:

- Tactical preferences
- Formation preferences
- Role compatibility

## Later: Dynamic Player Form

Especially relevant to Live Season Fantasy.

## Later: Mode-Specific Synergy

Different game modes may modify:

- Player availability
- Role weights
- Evaluation
- Draft rules

## Later: Advanced Tactical Archetypes

Potentially:

- Pep-style positional possession
- Klopp-style pressing
- Low-block counter
- Direct target-man system

These should be layered on top of the core engine rather than embedded into it.

---

# 38. Critical Architectural Rule

The application should separate:

```text
DOMAIN LOGIC
```

from:

```text
UI
```

and:

```text
GAME DATA
```

Recommended conceptual architecture:

```text
PLAYER DATA
     ↓
GAME RULE CONFIG
     ↓
DOMAIN MODELS
     ↓
EVALUATION ENGINE
     ↓
STRUCTURED EVALUATION RESULT
     ↓
UI
```

The UI should never be responsible for deciding:

- Whether a role combination is good
- How much synergy a player receives
- Whether a player is tactically suitable
- How Team Rating is calculated

The UI displays the authoritative result.

---

# 39. Final Definition

The ProFootballDraft Locker Room is:

> **A post-draft squad-building system where users transform their drafted players into a Starting XI by selecting formations, assigning positions, creating complementary role relationships, managing player connections, selecting a tactical identity, and optimizing overall team balance.**

Its central mechanic is:

```text
PLAYER QUALITY
       +
POSITION FIT
       +
PLAYER CONNECTION
       +
ROLE COMPLEMENTARITY
       +
UNIT SYNERGY
       +
TEAM SYNERGY
       +
TACTICAL FIT
       +
TEAM BALANCE
       =
FUNCTIONAL TEAM
```

The most important design principle is:

> **The game should reward building a coherent football team, not simply collecting the highest-rated footballers.**

The Locker Room therefore becomes the bridge between:

```text
"Who did I draft?"
```

and:

```text
"How good is the team I built?"
```

---

# 40. Open Design Decisions — Must Be Finalized Before Full Production

This document defines the architecture and behavior, but the following game-balance details still require explicit design decisions before the final scoring engine is considered complete:

1. Exact role taxonomy
2. Exact playstyle taxonomy
3. Exact player functional characteristics
4. Exact position-fit thresholds
5. Club/country/league connection weights
6. Pair-synergy rules
7. Unit-synergy rules
8. Role redundancy rules
9. Role conflict rules
10. Formation-specific interaction rules
11. Tactical identity definitions
12. Tactical-fit rules
13. Team-balance calculation
14. Synergy score normalization
15. Final Team Rating formula
16. Maximum/minimum score bounds
17. Whether synergy can ever reduce Team Rating below raw squad quality
18. How much OVR advantage can be overcome through better construction
19. How game modes modify the evaluation
20. Exact explanation/reason-code taxonomy

These should be decided **before production balancing**, but they should not be hard-coded into the UI.

---

# End State

When this system is complete, a user should be able to enter the Locker Room with a random collection of drafted players and, through experimentation, arrive at a genuinely different team depending on:

- Formation
- Player placement
- Position suitability
- Player relationships
- Roles
- Playstyles
- Complementarity
- Tactical identity
- Team balance

Two users with the exact same drafted players should therefore be capable of producing different-quality teams.

That is the intended core game mechanic of the Locker Room.
