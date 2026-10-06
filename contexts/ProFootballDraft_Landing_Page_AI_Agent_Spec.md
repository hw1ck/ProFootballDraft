# ProFootballDraft — Landing Page Implementation Specification

## Document purpose

This document is the implementation specification for the **ProFootballDraft landing page**.

It is intended to be attached to an AI coding/design agent together with the existing Figma design/export. The agent must use this document and the supplied Figma reference as the source of truth for the landing-page implementation.

**Primary objective:** reproduce the existing landing-page design and content direction faithfully while making the page production-ready, responsive, accessible, reusable, and mobile-first.

**Important:** This is a landing page only. Do not implement the authenticated dashboard, lobby, draft engine, team builder, leaderboard logic, or other product screens as full application features. The landing page may visually demonstrate those concepts using static/mock data.

---

# 1. Non-negotiable design instruction

## Preserve the existing design

The supplied Figma design is the visual reference.

Do **not** redesign the page into a different visual style.

Do not:
- replace the visual identity;
- introduce a different theme;
- change the overall composition without a functional reason;
- introduce unrelated colors;
- introduce unrelated typography;
- turn the page into a generic football website;
- add unnecessary marketing sections;
- replace the product/game UI demonstrations with generic stock imagery.

The existing design language must become the **global design language for the entire ProFootballDraft website**, not only this landing page.

This means the same:
- colors;
- typography;
- font family;
- font weights;
- border language;
- radii;
- spacing system;
- button language;
- card language;
- icon style;
- background treatment;
- status/label treatment;
- player-card visual language;
- headings;
- text hierarchy;
- responsive behavior;
- interaction language

must be reusable on future authenticated/game pages.

If a value is available from the supplied Figma file, prefer that exact value over inventing a replacement.

Where exact Figma values are unavailable from the supplied export, define the value as a named design token so it can be replaced later without changing component code.

Figma Dev Mode/Inspect is designed to expose properties such as layout, colors, typography, text strings, styles, variables, assets, and component information; use the actual Figma file as the authoritative source when those values are available. [Figma Dev Mode reference](https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode)

---

# 2. Product identity

## Product

**ProFootballDraft**

## Product category

A multiplayer football drafting and team-building game.

## Core product idea

Players draft footballers, build a squad from their drafted players, optimize positions/synergy/tactics, lock their team, and compete against friends.

## Core product loop

**Draft → Build → Optimize → Compete**

The landing page should make this loop understandable without explaining every internal game rule.

## Emotional goal

A new visitor should leave the page thinking:

> “This looks fun. I want to play this with my friends.”

## Primary conversion

Get the visitor to start/join a draft.

Primary CTA language:
- **Play Now**
- **Join Draft**

Secondary CTA:
- **Join a Room**

---

# 3. Source-of-truth content

The supplied Figma export currently contains the following landing-page content:

- ProFootballDraft
- Sign In
- LIVE DRAFT #409
- countdown
- player-card demonstration featuring Erling Haaland
- 91 ST
- Manchester City • Norway
- FINISHER
- PAC 89
- SHO 93
- PHY 88
- Pick 4 of 16 • Classic
- TURN: YOUR PICK
- DRAFT. BUILD.
- WIN.
- “Draft with friends, build a winning squad, and prove who built the best team.”
- Play Now — Join Draft
- JOIN A ROOM
- DRAFT WITH FRIENDS
- “Five cards. One choice. Draft 16 players in Classic Draft. Every pick shapes your squad.”
- PICK YOUR CARD ROUND 3 / 16
- TOP PICK 91
- ST 90
- CM 88
- RW
- Haaland / FINISHER
- Bellingham / BOX-TO-BOX
- Saka / WINGER
- BUILD YOUR SQUAD
- “Big names aren’t enough. Find the right positions, discover synergies, and turn your drafted talent into a winning XI.”
- formation: 4-3-3
- ATTACKING
- role/position labels
- SYNERGY
- HOW TO PLAY
- “Three simple steps: draft, build, and rank.”
- 01 Pick a Draft
- “Classic Draft, Merge Draft, and more.”
- 02 Draft with Friends
- “Draft 16 players, then build your XI in the Locker Room.”
- 03 Rank Your Squad
- “Lock your team. Once everyone locks, the final rankings settle the rivalry.”
- PLAY TOGETHER
- “Create a room, invite friends with a code, and start a draft together.”
- ROOM LOBBY 3 / 4 JOINED
- #X7K29
- COPY
- JD / MK / SL
- “Host starts the draft.”
- READY TO BUILD YOUR WINNING SQUAD?
- “Join a room, draft 16 players, and see how your squad ranks.”
- Join Draft
- ProFootballDraft
- Terms
- Privacy
- Support
- Discord
- Community

The exported page therefore already establishes the intended product-story structure and should not be replaced with an unrelated landing-page concept.

---

# 4. Required landing-page information architecture

The page should follow this conceptual order:

1. Global navigation
2. Hero
3. Draft demonstration
4. Build Your Squad
5. Strategic evaluation / “not just OVR” explanation
6. Game Modes
7. How to Play
8. Play Together / multiplayer room
9. Final CTA
10. Footer

Do not add sections merely to make the page longer.

Every section must contribute to:
- understanding the product;
- understanding the gameplay loop;
- demonstrating strategic depth;
- demonstrating multiplayer;
- converting the visitor.

---

# 5. Global navigation

## Content

Brand:
**ProFootballDraft**

Navigation/action:
- Sign In

Primary action:
- Play Now / Join Draft

## Behavior

Mobile-first.

On small screens:
- prioritize brand;
- prioritize primary CTA and/or menu access;
- avoid a crowded horizontal navigation.

On larger screens:
- use the Figma composition as reference;
- preserve the existing hierarchy.

The navigation must remain visible and usable without obstructing content.

---

# 6. Hero section

## Required headline

**DRAFT. BUILD. WIN.**

This is the main brand statement.

## Required supporting copy

Use:

**Draft with friends, build a winning squad, and prove who built the best team.**

## Clarifying product descriptor

Add a concise descriptor if it can be incorporated without disrupting the existing Figma composition:

**A multiplayer football drafting and team-building game.**

This descriptor exists to immediately answer “what is this?” for a first-time visitor.

Do not replace the main headline with a long sentence.

## CTAs

Primary:
**Play Now — Join Draft**

Secondary:
**Join a Room**

## Hero product demonstration

Preserve the existing football-game UI demonstration rather than replacing it with a generic football image.

The reference includes:
- LIVE DRAFT #409
- countdown;
- player card;
- Haaland;
- Manchester City • Norway;
- FINISHER;
- PAC/SHO/PHY;
- Pick 4 of 16;
- Classic;
- TURN: YOUR PICK.

These are illustrative landing-page mock data, not live game state.

The UI should look like a real product preview but must not imply that the landing page is connected to an actual live draft unless the backend really exists.

---

# 7. Draft demonstration section

## Section message

The user should understand:

**Every pick matters.**

## Heading

**DRAFT WITH FRIENDS**

## Copy

**Five cards. One choice. Draft 16 players in Classic Draft. Every pick shapes your squad.**

## Demonstration

Show a representative selection containing:
- Haaland — FINISHER
- Bellingham — BOX-TO-BOX
- Saka — WINGER

Example metadata:
- TOP PICK 91
- ST 90
- CM 88
- RW

## Supporting label

**PICK YOUR CARD — ROUND 3 / 16**

## Implementation

This is a visual demonstration only.

Do not build actual multiplayer draft logic into the landing page.

If interaction is implemented, it should be lightweight and deterministic:
- card hover/tap state;
- selection highlight;
- optional mock round change;
- no authentication required.

The landing page must remain fast.

---

# 8. Build Your Squad section

## Heading

**BUILD YOUR SQUAD**

## Copy

Use the existing idea:

**Big names aren’t enough. Find the right positions, discover synergies, and turn your drafted talent into a winning XI.**

## Demonstration

The section should visually communicate:
- formation;
- player positions;
- role;
- team structure;
- synergy.

Reference formation:
**4-3-3**

Reference tactical/role language:
- ATTACKING
- ROLE
- SYNERGY

## Product message

The visitor must understand that drafting strong players is only the first stage.

The second stage is constructing the team.

---

# 9. Strategic depth section

This section should explicitly communicate a core differentiator that is only implied in the existing design.

## Main message

**The highest-rated squad doesn’t always win.**

## Supporting message

The final team should be about more than raw player rating.

Relevant concepts:
- Player Quality
- Position Fit
- Team Synergy
- Tactical Fit
- Squad Balance

Do not reveal the exact final scoring formula on the landing page.

The goal is to communicate strategy, not expose implementation details.

## Suggested structure

Use a concise visual breakdown:

**Player Quality**
How strong are your players?

**Position Fit**
Are you using them in the right places?

**Synergy**
Do the players work together?

**Tactical Fit**
Does the squad suit the selected approach?

**Squad Balance**
Does the XI work as a complete team?

End with:

**Build smarter, not just stronger.**

---

# 10. Game Modes section

The existing design references Classic Draft, Merge Draft, and more. Give this concept a dedicated section without overloading the page.

## Heading

**CHOOSE YOUR DRAFT**

or equivalent wording that matches the visual language.

## Mode 1 — Classic Draft

**Classic Draft**

Five cards. Pick one.

Description:
Build your 16-player squad by making one choice from each five-card selection.

## Mode 2 — Merge Draft

**Merge Draft**

Two players. Two cards. One decision.

Description:
Choose one card while the other goes to your opponent.

This creates direct strategic tension between both players.

## Additional modes

The product planner also contains:
- TOTY
- Live Season Fantasy
- Favorite Builder

These should only be shown as launchable modes if their rules and implementation are actually ready.

If not ready, use:
**More modes coming.**

Do not promise features that have not been implemented.

---

# 11. How to Play section

## Heading

**HOW TO PLAY**

## Existing supporting message

The current design says:

**Three simple steps: draft, build, and rank.**

Prefer changing the wording to:

**Three simple steps: draft, build, and compete.**

Reason:
the actual flow is not “manually rank your team”; players lock their teams and the system evaluates the result.

## Step 01

### Pick a Draft

**Classic Draft, Merge Draft, and more.**

## Step 02

### Draft with Friends

**Draft 16 players, then build your XI in the Locker Room.**

## Step 03

### Compete

**Lock your team. Once everyone locks, the final rankings settle the rivalry.**

The exact visual arrangement should follow the supplied Figma reference.

---

# 12. Play Together section

## Heading

**PLAY TOGETHER**

## Copy

**Create a room, invite friends with a code, and start a draft together.**

## Lobby demonstration

Show the existing mock lobby:

**ROOM LOBBY — 3 / 4 JOINED**

Room:
**#X7K29**

Action:
**COPY**

Players:
- JD
- MK
- SL

Host state:
**Host starts the draft.**

## Product message

The visitor should understand:

Create room → share code → friends join → host starts → everyone drafts.

## Important

The room code shown on the landing page is demonstration data.

Do not make it a real joinable room.

---

# 13. Final CTA

## Heading

**READY TO BUILD YOUR WINNING SQUAD?**

## Copy

Use the existing idea:

**Join a room, draft 16 players, and see how your squad ranks.**

A slightly more competitive version may be used:

**Join a room, draft 16 players, and see how you stack up against your friends.**

## CTA

**Join Draft**

This is the final primary conversion point.

---

# 14. Footer

Brand:
**ProFootballDraft**

Links:
- Terms
- Privacy
- Support
- Discord
- Community

Copyright:
**© 2025 ProFootballDraft. All rights reserved.**

If the actual production year differs, use the current product/legal requirement instead of hard-coding an outdated year.

---

# 15. Global design system

The landing page is not allowed to have a one-off visual system.

Create a reusable global design system from the supplied Figma reference.

## Design tokens

Create tokens for at minimum:

### Colors

- background-primary
- background-secondary
- surface
- surface-elevated
- text-primary
- text-secondary
- text-muted
- border
- accent-primary
- accent-secondary
- success
- warning
- danger
- overlay

Use exact Figma values when available.

Do not invent a new palette if the Figma palette already provides one.

### Typography

Create tokens for:
- font-family;
- display-large;
- display-medium;
- heading-large;
- heading-medium;
- heading-small;
- body-large;
- body-medium;
- body-small;
- label;
- caption.

Preserve the exact font family from Figma.

The chosen font must be loaded consistently across the entire site.

Do not use one font for the landing page and another font for the game UI.

### Spacing

Create a consistent spacing scale.

Suggested token naming:

- space-1
- space-2
- space-3
- space-4
- space-5
- space-6
- space-8
- space-10
- space-12
- space-16
- space-20
- space-24

If the Figma file clearly uses different values, use the Figma values instead.

### Radius

Create reusable tokens:
- radius-sm
- radius-md
- radius-lg
- radius-xl
- radius-pill

### Borders

Create:
- border-width;
- border-color;
- divider-color.

### Shadows

Create reusable elevation tokens only where the existing design uses them.

Do not add decorative shadows everywhere.

---

# 16. Global component system

Build reusable components rather than creating one-off HTML blocks.

At minimum:

- Header
- Logo
- Button
- SecondaryButton
- Section
- SectionHeading
- Badge / StatusLabel
- PlayerCard
- PlayerStat
- DraftCard
- DraftSelection
- FormationPitch / TeamPreview
- PlayerPosition
- SynergyIndicator
- GameModeCard
- HowToStep
- RoomLobbyPreview
- RoomCode
- FinalCTA
- Footer
- ResponsiveContainer

Components should accept data through props rather than hard-coded duplicated markup.

---

# 17. Player card system

Player cards are a major part of the product identity and should be reusable throughout the future website.

## Required player data fields

- player name
- overall rating
- primary position
- club
- nation
- role/playstyle label
- player image
- selected state
- optional attributes

Example:
- OVR 91
- ST
- Erling Haaland
- Manchester City
- Norway
- FINISHER
- PAC 89
- SHO 93
- PHY 88

## State system

At minimum:
- default
- hover
- selected
- unavailable
- focused

Do not introduce the old three-color position suitability system.

For the product's position suitability behavior:
- correct/suitable position: normal rating;
- wrong position: small yellow indicator over the player rating;
- no red position indicator;
- no green/yellow/red position state system.

This must remain consistent when player cards are reused in future product screens.

---

# 18. Buttons

Buttons must use the global design language.

Required variants:
- primary;
- secondary;
- tertiary/text;
- icon button where needed.

States:
- default;
- hover;
- active;
- focus-visible;
- disabled;
- loading where applicable.

Primary CTA must remain visually dominant.

Touch targets must be comfortable on mobile.

---

# 19. Mobile-first requirements

This is a **mobile-first application**.

Do not design desktop first and then shrink it.

Implementation must start with the smallest supported viewport and progressively enhance the layout.

## Mobile priorities

On a phone:
1. Hero message must be immediately understandable.
2. Primary CTA must be easy to reach.
3. Product preview must remain readable.
4. Player cards must not become microscopic.
5. Sections must stack naturally.
6. Horizontal content may use controlled horizontal scrolling when appropriate.
7. No essential information may require awkward desktop-style interactions.
8. Avoid hover-dependent functionality.
9. Use large touch targets.
10. Avoid excessive text density.

The product planner explicitly defines phone → tablet → desktop as the primary design target and calls for large touch targets, minimal clutter, swipeable cards, bottom sheets where appropriate, and fast player selection.

---

# 20. Responsive behavior

Use three conceptual ranges:

## Mobile

Primary design target.

Use:
- one-column layout;
- stacked CTAs where required;
- horizontally scrollable cards only when that improves usability;
- compact but readable product previews;
- simplified navigation.

## Tablet

Allow:
- two-column compositions;
- wider card groups;
- more horizontal spacing;
- larger product demonstrations.

## Desktop

Preserve the Figma composition:
- wider content container;
- multi-column feature sections;
- larger product mockups;
- controlled maximum content width.

Do not stretch text to the full width of very large screens.

---

# 21. Responsive design rules

Do not hard-code a single desktop width and scale the entire website down.

Instead:
- use fluid containers;
- use responsive grids;
- use CSS clamp where appropriate;
- use responsive typography;
- allow components to reflow;
- preserve hierarchy rather than exact pixel positions.

The **visual hierarchy** of the Figma design is more important than forcing every desktop pixel measurement onto mobile.

---

# 22. Product demonstration behavior

Landing-page mockups should feel alive but should not become a distracting animation showcase.

Acceptable:
- subtle card selection;
- simple mock draft state;
- lightweight carousel;
- subtle status change;
- optional auto-rotation.

Avoid:
- excessive animation;
- long loading sequences;
- autoplay video as the only way to understand the section;
- interactions required to access essential information.

Animations must respect reduced-motion preferences.

---

# 23. Accessibility

The landing page must be accessible.

Requirements:
- semantic HTML;
- proper heading hierarchy;
- accessible button names;
- meaningful alt text for informative images;
- decorative images marked decorative;
- keyboard navigation;
- visible focus states;
- sufficient contrast;
- no color-only communication;
- reduced-motion support;
- logical tab order.

Interactive cards must not rely exclusively on hover.

---

# 24. Performance

The landing page is public-facing and should load quickly.

Requirements:
- optimize player/football imagery;
- use modern image formats where supported;
- lazy-load below-the-fold images where appropriate;
- avoid shipping the full game application to the landing page;
- keep mock gameplay data local;
- avoid unnecessary third-party scripts;
- avoid large animation libraries if CSS can accomplish the effect.

The landing page should not initialize authenticated game services unnecessarily.

---

# 25. Data architecture

The landing page should use mock/static data.

Create data objects for:

```text
heroDraft
featuredPlayers
draftOptions
gameModes
howToSteps
roomPreview
```

Do not scatter strings throughout JSX/components.

This makes it easy to change player names, ratings, modes, and demonstration content later.

---

# 26. Suggested React component structure

Use a structure similar to:

```text
src/
├── components/
│   ├── common/
│   │   ├── Button
│   │   ├── Container
│   │   ├── Section
│   │   └── SectionHeading
│   │
│   ├── navigation/
│   │   └── Header
│   │
│   ├── player/
│   │   ├── PlayerCard
│   │   ├── PlayerStat
│   │   └── PlayerBadge
│   │
│   ├── draft/
│   │   ├── DraftPreview
│   │   └── DraftCard
│   │
│   ├── squad/
│   │   ├── SquadPreview
│   │   ├── FormationPreview
│   │   └── SynergyIndicator
│   │
│   ├── modes/
│   │   └── GameModeCard
│   │
│   ├── multiplayer/
│   │   └── RoomLobbyPreview
│   │
│   └── footer/
│       └── Footer
│
├── sections/
│   ├── Hero
│   ├── DraftSection
│   ├── BuildSquadSection
│   ├── StrategySection
│   ├── GameModesSection
│   ├── HowToPlaySection
│   ├── PlayTogetherSection
│   └── FinalCTASection
│
├── data/
│   └── landingPageData
│
├── styles/
│   ├── tokens
│   └── globals
│
└── pages/
    └── LandingPage
```

Adapt this to the project's existing React structure if one already exists. Do not restructure a working application unnecessarily.

---

# 27. Routing

The landing page should be the public root route.

Recommended:

```text
/
```

Possible future routes:

```text
/sign-in
/dashboard
/modes
/room/:roomCode
/draft/:gameId
```

Do not implement these future routes unless requested.

For now, landing-page CTA behavior can:
- route to sign-in;
- route to a placeholder;
- or invoke the existing authentication flow if one already exists.

Never fake a successful login.

---

# 28. CTA behavior

## Play Now — Join Draft

Primary CTA.

If authentication exists:
- send the user into the intended authenticated flow.

If authentication does not exist yet:
- route to the planned sign-in/up screen or leave a clearly defined placeholder action.

## Join a Room

Should eventually lead to:
- room-code entry;
- or the relevant join-room flow.

For the landing-page implementation phase, do not implement the full room system.

---

# 29. SEO/content metadata

The public landing page should include:

Title:
**ProFootballDraft — Draft. Build. Win.**

Description:
**Draft football players with your friends, build your squad, and compete to see who can build the best team.**

Use the actual final product description if product positioning changes.

Add:
- favicon;
- Open Graph title;
- Open Graph description;
- Open Graph image when the final branded asset exists.

---

# 30. Content rules

Use football/game terminology consistently.

Preferred terms:
- draft;
- player;
- squad;
- XI;
- formation;
- position;
- synergy;
- tactics;
- room;
- friends;
- lock;
- final rating;
- compete.

Avoid:
- inconsistent use of “team” and “squad” when referring to the same concept unless natural;
- generic “sports platform” language;
- corporate SaaS language;
- over-explaining algorithms.

The landing page is for players, not developers.

---

# 31. What NOT to expose on the landing page

Do not expose:
- exact final scoring formula;
- database architecture;
- player-pool algorithm;
- anti-bad-luck algorithm;
- weighted randomness;
- API implementation;
- backend details;
- authentication provider details;
- internal room state management;
- exact chemistry formula;
- implementation-specific technical terminology.

Those belong to engineering/product documentation.

---

# 32. What the landing page must communicate

By the end of the page, a first-time visitor must understand:

### 1. What is it?

A multiplayer football drafting and team-building game.

### 2. What do I do?

Draft players.

### 3. What happens next?

Build a squad.

### 4. What makes it strategic?

Positions, synergy, tactics, and squad balance matter.

### 5. Who do I play with?

Friends/other players through rooms.

### 6. What is the objective?

Build the best team and beat the other players.

### 7. What should I do now?

Play / Join a Draft.

---

# 33. Exact conceptual page flow

Implement the following narrative:

```text
DRAFT. BUILD. WIN.

        ↓

What is ProFootballDraft?
A multiplayer football drafting and
team-building game.

        ↓

DRAFT WITH FRIENDS
Five cards. One choice.
Every pick shapes your squad.

        ↓

BUILD YOUR SQUAD
Big names aren't enough.
Position + formation + synergy.

        ↓

THE HIGHEST OVR DOESN'T ALWAYS WIN
Position Fit
Synergy
Tactical Fit
Squad Balance

        ↓

CHOOSE YOUR DRAFT
Classic Draft
Merge Draft
More modes

        ↓

HOW TO PLAY
Pick a Draft
Draft with Friends
Compete

        ↓

PLAY TOGETHER
Create Room
Share Code
Draft Together

        ↓

READY TO BUILD YOUR WINNING SQUAD?

        ↓

JOIN DRAFT
```

---

# 34. Visual fidelity rules

When implementing from the supplied Figma:

1. Inspect the Figma design before coding.
2. Identify fonts.
3. Identify colors.
4. Identify spacing.
5. Identify border/radius values.
6. Identify card dimensions.
7. Identify typography hierarchy.
8. Identify reusable visual patterns.
9. Identify assets.
10. Recreate the design using reusable components.

Do not approximate a value that can be inspected directly.

Figma's Inspect/Dev Mode exposes layout, typography, colors, variables, assets and component information specifically for translating designs to code. [Figma inspecting guide](https://help.figma.com/hc/en-us/articles/22012921621015-Guide-to-inspecting)

Where Figma variables exist, preserve their semantic structure instead of replacing them with arbitrary raw values. [Figma variables in Dev Mode](https://help.figma.com/hc/en-us/articles/27882809912471-Variables-in-Dev-Mode)

---

# 35. Design-system requirement for the entire website

This landing page is the first implementation of the ProFootballDraft design system.

Therefore, do not create landing-page-only values such as:

```text
heroBlue
heroCardRadius
landingButtonColor
homepageFont
landingSectionSpacing
```

Instead create global tokens:

```text
color.*
font.*
spacing.*
radius.*
border.*
shadow.*
motion.*
```

Future pages should consume the same tokens.

The player card built for the landing page should also become the base component for:
- draft screen;
- team builder;
- player detail;
- team analysis;
- comparison;
- results.

The button system should be reusable for:
- dashboard;
- lobby;
- game;
- results;
- profile.

---

# 36. Acceptance criteria

The implementation is complete only when all of the following are true.

## Content

- [ ] Hero contains DRAFT. BUILD. WIN.
- [ ] Hero clearly explains the product.
- [ ] Primary CTA exists.
- [ ] Join Room CTA exists.
- [ ] Draft demonstration exists.
- [ ] Classic Draft explanation exists.
- [ ] Build Your Squad section exists.
- [ ] Position/synergy concept is communicated.
- [ ] Strategic evaluation section exists.
- [ ] Game Modes section exists.
- [ ] Classic Draft exists as a mode.
- [ ] Merge Draft exists as a mode or is clearly marked according to launch readiness.
- [ ] How To Play exists.
- [ ] Multiplayer room demonstration exists.
- [ ] Final CTA exists.
- [ ] Footer exists.

## Design

- [ ] Existing Figma visual identity is preserved.
- [ ] Existing typography is reused.
- [ ] Existing color system is reused.
- [ ] Existing player-card language is reused.
- [ ] Existing button language is reused.
- [ ] Existing spacing/radius/border language is reused.
- [ ] No unrelated visual theme is introduced.

## Responsive

- [ ] Mobile is the primary implementation.
- [ ] Tablet layout is responsive.
- [ ] Desktop layout preserves the Figma composition.
- [ ] No horizontal page overflow.
- [ ] No microscopic player cards.
- [ ] CTAs remain usable on touch devices.
- [ ] Text remains readable at all supported widths.

## Engineering

- [ ] Components are reusable.
- [ ] Landing-page content is data-driven.
- [ ] Design tokens are centralized.
- [ ] Player cards are reusable.
- [ ] No duplicated component implementations.
- [ ] Mock data is clearly separated from application logic.
- [ ] No real backend/game engine is required for the landing page.
- [ ] No unnecessary dependencies are introduced.

## Accessibility

- [ ] Semantic HTML.
- [ ] Keyboard navigation.
- [ ] Focus-visible states.
- [ ] Accessible button labels.
- [ ] Informative images have alt text.
- [ ] Decorative images are ignored by screen readers.
- [ ] No information is conveyed only by color.
- [ ] Reduced motion is respected.

## Performance

- [ ] Images are optimized.
- [ ] Below-fold media is lazy loaded when appropriate.
- [ ] No unnecessary game engine initialization.
- [ ] No unnecessary third-party scripts.
- [ ] Landing page remains lightweight.

---

# 37. AI-agent implementation instructions

Before making code changes:

1. Inspect the existing project.
2. Determine the framework and current architecture.
3. Do not replace the existing architecture if it already supports the required page.
4. Inspect the supplied Figma reference carefully.
5. Identify exact typography, colors, spacing, components, and assets.
6. Establish global design tokens.
7. Build/reuse shared components.
8. Build the landing page sections in the specified order.
9. Implement mobile-first.
10. Verify tablet and desktop layouts.
11. Verify accessibility.
12. Verify that no content from the specified page is missing.
13. Verify that no unrelated sections have been added.
14. Verify CTA behavior.
15. Verify visual fidelity against the supplied Figma.

Do not stop after creating a rough approximation.

The target is:

**Figma design → faithful production implementation → reusable ProFootballDraft design system.**

---

# 38. Final instruction to the AI agent

Treat the supplied Figma design as the visual source of truth and this document as the product/content/implementation specification.

Do not interpret “mobile-first” as permission to redesign the page.

Do not interpret “responsive” as permission to substantially change the visual identity.

Do not add features that are not specified.

Do not remove the existing product demonstrations.

Do not turn the page into a generic football marketing site.

The final landing page should feel like the **front door to the actual ProFootballDraft game**.

The user should see the product, understand the gameplay loop, understand that strategy matters, understand that they can play with friends, and have a clear path to start playing.

**Core message:**

> **DRAFT. BUILD. WIN.**

**Core loop:**

> **Draft → Build → Optimize → Compete**

**Core emotional hook:**

> **Build the better squad. Beat your friends.**
