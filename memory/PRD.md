# THE SELECT TRADERS — Product Requirements

## Original Problem Statement
Build a full-stack competitive trading platform — peer-to-peer competitive trading where traders compete against each other (not the broker) using platform-allocated trading accounts. Three areas: Landing Page, Client Area, Admin Portal.

## User Choices (locked)
- Stack: React + FastAPI + MongoDB
- Scope strategy: Landing first, then iterate
- Market data: Simulated
- Payments: Mocked, add Stripe later
- Auth: JWT + Emergent Google (deferred — no auth gate yet)

## Brand Identity
- Wordmark "The Select Traders" (Title Case)
- Lime green `#B4E04C` (primary) + soft purple `#A78BFA` (accent)
- Off-white `#FAFAF7` base, ink `#0F0F12`
- Typography: Satoshi (Fontshare) + Geist Mono
- Direction: Modern fintech (Mercury/Ramp/Wise/Linear)

## What's Been Implemented

### v1 (deprecated) — Dark esports landing
- Scrapped after user redirection.

### v2 (2026-02-06) — Modern fintech landing page
- Hero with live duel preview, mission/vision, problem, bento product grid, deep-dive product sections, pricing, FAQ, T&C, ticker, footer with closing CTA.

### v3 (2026-02-08) — Client Area scaffold
- **Layout**: `ClientLayout` with sticky sidebar + topbar (search, notifications, Pro upgrade pill, avatar). Mobile drawer for sidebar.
- **Routing**: All routes under `/app/*` wired in `App.js`.
- **Mock data**: `/app/frontend/src/lib/mockData.js` (user, matches, leaderboards, transactions, notifications, charts).
- **Pages built**:
  - `/app` Dashboard — 4 KPI cards, earnings area chart, dark active-match card, live matches widget, upcoming tournaments, recent results table
  - `/app/duel` 1v1 Duel Centre — Broadcast / Spawn / Create tabs with Pro-styled custom duel cards, 8 spawn account sizes, full create-duel form with leverage/DD/instruments + live preview card. Spawn flow modal cycles through 4 phases (searching → paired → activating → starting) and lands on `/app/match/4781`.
  - `/app/royale` Trading Royale — filter pills, lobby cards with progress bars + live leaderboard with "You" highlighting
  - `/app/tournament` Multi Trader — tournament cards + bracket view with 8 group-stage tables and 5-stage prize distribution
  - `/app/tagteam` Tag Team — team cards with rosters, active match split view, Create Team dialog with capital-split validation
  - `/app/stats` My Stats — KPIs + earnings chart + format pie + market bar + match history
  - `/app/wallet` Wallet — balance/pending/lifetime KPIs, KYC banner, deposit (Card/Bank/Crypto), withdraw, transactions table
  - `/app/settings` Settings — 6 tabs (Profile, Account, Notifications, Subscription, KYC, Linked). Username locked.
  - `/app/notifications` Notifications inbox
  - `/app/community` Community Battles coming-soon page with email capture
  - `/app/match/:matchId` Match — full-screen overlay with timer, two trader columns, equity area chart, trades feed
- **Landing CTAs** (Nav, Hero) wired to `/app` for "Sign in" / "Get started" / "Start competing".
- **Testing**: Iteration 2 frontend success rate 100%. Three minor cosmetic fixes applied (uncontrolled email input → defaultValue, capital-split sum colour decoupled from name validation).

## Prioritised Backlog

### P0 — Auth + Real backend
- JWT auth (immutable username) + Emergent Google social login (call integration_playbook_expert_v2)
- Backend endpoints replacing mockData consumers (matches, lobbies, tournaments, teams, wallet, notifications)
- Protect /app/* routes

### P1
- Real spawn matchmaking (WebSocket / polling)
- Wallet — Stripe test mode for deposits + subscription
- KYC document upload (object storage)
- Real-time chart data (push or polling)
- Community Battles waitlist endpoint

### P2 — Admin Portal
- `/admin/*` with separate login + audit log
- User/Duel/Royale/Tournament/Finance/Disputes/KYC/Announcements management

## Next Tasks
1. Wire auth flow (JWT + Emergent Google) + protect /app/*
2. Build out backend endpoints + replace mock data
3. Add `/terms` full page
4. Begin Admin Portal scaffold
