# THE SELECT TRADERS — Product Requirements

## Original Problem Statement
Build a full-stack competitive trading platform called **THE SELECT TRADERS**.
Tagline: *"Experience The Fun Side Of Trading."* — Sub-tagline: *"Ain't you tired of trading against the broker? Trade against real people."*

The platform gamifies financial market trading into an esports-style competition with three areas:
1. **Landing Page** — Public marketing site
2. **Client Area** — Authenticated trader dashboard (Dashboard, 1v1 Duel, Royale, Multi Trader, Tag Team, Stats, Wallet, Settings)
3. **Admin Portal** — Operations management (Users, Duels, Royale, Tournaments, Finance, Disputes, KYC, Announcements)

## User Choices (locked)
- Stack: React + FastAPI + MongoDB
- Scope strategy: **Landing Page first**, then build the rest in iterations
- Market data: Simulated (mocked candle/price ticks)
- Payments: Mocked for now; add Stripe later
- Auth: Both JWT custom + Emergent Google social login (when client area is built)

## User Personas
- **Competitive Retail Trader** — wants to prove skill against peers, earn from competition
- **Pro Plan Member** — power user who creates custom duels and tournaments
- **Spectator/Newcomer** — watches live duels, learns, considers joining
- **Platform Operator** (admin) — manages users, matches, disputes, payouts

## Tech Stack
- Frontend: React (CRA + craco) + Tailwind + shadcn/ui + lucide-react + Recharts + sonner
- Backend: FastAPI + Motor (MongoDB async)
- Fonts: Unbounded (display), Outfit (body), JetBrains Mono (data/numbers)
- Brand colours: #0A0E1A bg, #0F1628 secondary, #D4AF37 gold, #00C9A7 teal, #FF4C6A red, #00E676 green

## What's Been Implemented (v1 — 2026-02)
- **Landing Page** (single-page scroll, dark/gold esports aesthetic)
  - Sticky animated navigation (scroll-blur, mobile hamburger)
  - Hero with live duel preview card + real-time mini chart (Recharts)
  - Mission & Vision two-column block + pull-quote
  - "Problem We Solve" 3-card section + "We built the third path" capstone
  - Product Suite comparison table (5 products)
  - 5 product deep-dive cards (1v1 Duel, Trading Royale, Multi Trader, Tag Team, Community Battles) with alternating left/right layout
  - Duel account/prize tier table ($5K → $1M) + Multi Trader prize distribution table
  - Community Battles email capture (toast feedback, client-side validation)
  - 4-step How It Works flow
  - Pricing: Free vs Pro with gold-glow MOST POPULAR card
  - 10-question FAQ accordion (shadcn)
  - T&C summary card + link to /terms
  - Live broadcast marquee ticker
  - Multi-column footer with social icons

## Prioritised Backlog

### P0 — Foundation
- Auth (JWT + Emergent Google) with immutable username enforcement
- Client Area shell (sidebar layout, dashboard, plan badge)
- Spawn Centre flow (mocked pairing with countdown)
- Active Match screen with simulated live P&L

### P1 — Core Client Flows
- 1v1 Duel Centre (Broadcast / Spawn / Create tabs)
- Trading Royale lobby browser + live leaderboard
- Multi Trader bracket view
- Tag Team team creation + match view
- My Stats dashboard (charts, history)
- Wallet (deposits, withdrawals, transaction history — mocked)
- Settings (profile, account, KYC stubs, notifications)
- /terms full page

### P2 — Admin Portal
- Admin login (separate)
- Overview dashboard (KPIs + activity feed)
- User Management table + actions
- Duel/Royale/Tournament management
- Financial Management + withdrawal queue
- Disputes & Support queue
- KYC review queue
- Announcements & Platform Settings

### P3 — Real integrations
- Stripe for subscriptions + entry fees
- Real market data feed (Alpha Vantage / CoinGecko)
- Email transactional (Resend/SendGrid)
- Object storage for avatars + KYC docs

## Next Tasks (for next iteration)
1. Add /terms full page route
2. Build Auth flow (sign up / sign in) — call integration playbook for both JWT + Emergent Google Auth
3. Scaffold Client Area shell + Dashboard
4. Add backend endpoint for Community Battles email capture (mongo collection `notify_signups`)
