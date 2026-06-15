# THE SELECT TRADERS — PRD

## Original Problem
Competitive peer-to-peer trading platform (Landing + Client + Admin). React + FastAPI + MongoDB. Mock data only — no real broker / Stripe / KYC.

## Brand
Lime green #B4E04C + soft purple #A78BFA on off-white #FAFAF7. Satoshi font. Modern fintech aesthetic.

## What's Built

### v4.7 (2026-02-15) — Multi Trader mechanics corrected (CURRENT)
- **Group stage is NOT head-to-head anymore**. All 4 traders in a group trade simultaneously for a single fixed timeline (1 or 5 trading days). Top 2 by **equity at end of timeline** advance to R16.
- **Knockouts (R16/QF/SF/Final)** are sealed 1v1 matches over the same 1- or 5-trading-day timeline — both traders trade their own account, **highest equity at the buzzer advances**. No real-time interaction.
- **Tiebreaker** (equity exact tie): max equity reached during the stage, then min drawdown.
- **Updated everywhere**: `/products/tournament` model + rules + FAQ; in-app Tournament bracket page group cards now show **Rank by equity** (not W-D-L) with "TOP 2 BY EQUITY ADVANCE" caption; journey card details now read "Rank N/4 by equity" instead of "2-1-0"; seed groups recalculated with `advanced=top2 by equity`; ProductSuite card detail says "Equity-based progression"; `_build_journey` updated.

### v4.6 (2026-02-15) — Dedicated FAQ page
- **New `/faq` route** with comprehensive product-segmented FAQ — 69 detailed Q&As across 8 sections in order: **General** (10) · **1v1 Duel** (11) · **Trading Royale** (9) · **Multi Trader** (8) · **Tag Team** (7) · **Community Battles** (6) · **Affiliate Program** (8) · **Trading & MT5** (10).
- **Sticky desktop sidebar** with active-section highlighting based on scroll position. **Mobile horizontal-scroll pill selector** below the hero.
- **Live search** at the top of the page filters questions + answers in real-time across all sections with `<mark>` highlight on matches; empty-state shown when nothing matches.
- **Animated accordions** (Framer Motion AnimatePresence) for question expand/collapse.
- **Landing FAQ section converted to slim teaser** linking to `/faq` with topic pills and "See full FAQ" CTA.
- **Nav FAQ link** is now a Router Link to `/faq` (no more in-page scroll).
- **Tests**: 12/12 frontend Playwright tests pass — page load, hero copy, sidebar items + counts, accordions, search + highlight, empty-state, anchor nav, back-to-landing, mobile responsive, regression of Affiliate/Products dropdown.

### v4.5 (2026-02-15) — Dark landing + standalone Affiliate nav
- **Entire landing page rebuilt in the dark, graphics-first aesthetic** — base `#0F0F12`, elevated surfaces `#16161D`, lime + purple accents, mono labels. Every section (Hero, Mission, Problem, ProductSuite, HowItWorks, Pricing, slim Affiliate teaser, FAQ, Terms, Ticker, Footer) now matches the product-page treatment.
- **Landing now uses `ProductNav`** (dark variant) instead of the cream `Nav`, with hash-scroll preserved on landing and cross-page navigation when on other routes.
- **Affiliate moved out of the Products dropdown** — Products menu now lists exactly 5 items (1v1 Duel, Trading Royale, Multi Trader, Tag Team, Community Battles). **Affiliate is its own standalone top-level nav item** that routes directly to `/products/affiliate` (no more scrolling to a `#affiliate` section).
- **Mobile-tested**: at 390px width, layout has no horizontal scroll, hamburger menu opens cleanly, hero text wraps gracefully.
- **Tests**: 12/12 frontend Playwright tests pass — dark theme verified (computed bg `rgb(15,15,18)`), dropdown content verified, Router Link on Affiliate verified, mobile responsiveness verified, all app routes regression-tested.

### v4.4 (2026-02-15) — Graphics-first product pages
- Each of the 6 dedicated product pages was rebuilt around a signature infographic — **Equity Curve Clash** (Duel), **Elimination Timeline** (Royale), **Leaderboard Race** (Multi Trader), **Team Connection Viz** (Tag Team), **Tug Of War** (Community), **Affiliate Tree** (Affiliate). All on a unified dark canvas with Framer Motion staggered reveals, lime+purple accent system, kinetic CTA marquees, bento rule grids, and tier ladders/pyramids replacing tables.
- New shared building blocks: `ProductNav`, `ProductPrimitives` (StatStrip, SectionHeader, NeonBeam, BentoRuleCard, KineticMarquee, BottomCTA, StatPyramid, TierLadder, BackToLanding), `ProductInfographics` (all 6 signature visuals).

### v4.3 (2026-02-15) — Landing restructure + dedicated product pages
- **Removed** the bulky `ProductDeepDive` section from the landing page — replaced with a slim, scannable flow.
- **Simplified `Affiliate` section** on landing: single teaser card with 4 tier chips (Rookie 10% → Legend 25%), "See full program" → `/products/affiliate`, "Get your referral link" → `/app/affiliate`.
- **6 new dedicated product pages** powered by a shared `ProductPageLayout` component:
  - `/products/duel` — 1v1 Duel (8 tier prize table + 10 rules)
  - `/products/royale` — Trading Royale (two-phase elimination explained)
  - `/products/tournament` — Multi Trader (5-stage prize breakdown)
  - `/products/tagteam` — Tag Team Trading (3v3 / 5v5 formats)
  - `/products/community` — Community Battles (coming soon + notify form)
  - `/products/affiliate` — Affiliate program (full 4-tier explainer + how-payouts-work cards)
- Each page = Nav · back-to-landing · hero (eyebrow + icon + name + tagline + 4-stat grid) · "The model" · "Rules of engagement" grid · "Prize structure" table · bottom CTA strip · Footer.
- **Nav now has a Products dropdown** (hover-to-open) listing all 6 product pages with descriptions.
- **Cross-page navigation works**: clicking nav links (How it works, Pricing, FAQ) from a product page routes back to `/` with the matching hash and the landing page smoothly scrolls.
- **ProductSuite cards** on the landing page are now Links that route to each `/products/*` page.
- **Tests**: 43/43 Playwright frontend tests pass. All routes, hover dropdown, dedicated pages, slim affiliate teaser verified.

### v4.2 (2026-02-15) — Trading Station detail · Tournament journey · Royale phases
- **Trading Station detail dialog** (`/app/frontend/src/components/app/StationDetailDialog.jsx`): clicking "Account" on any Trading Station row opens a dialog with **MT5 credentials** (login/password/server/platform — plain text with copy buttons), **side-by-side equity curves** for me vs opponent (duels), or **live leaderboard** + phase banner (royales), or **journey path** + prize earned (tournaments).
- **Multi Trader journey view** (`/app/frontend/src/pages/app/Tournament.jsx`): new "My Journey" tab is default — lists every tournament I'm in with my exit stage + prize won, expandable to show per-stage path (Group → R16 → QF → SF → Final). "Expand to full bracket" reveals the complete 32-player knockout bracket with every match result + a highlighted "You" badge wherever the user appears.
- **Trading Royale two-phase elimination engine** (`/app/backend/simulator.py: compute_royale_state` + `compute_royale_leaderboard`):
  - Phase 1 = first half of timeline — all traders fighting, no eliminations
  - Phase 2 = second half — at equal intervals **rounded to nearest 30s** (`half / (n-1)`), the lowest-equity trader is eliminated, repeated until 1 winner remains
  - Real-time leaderboard with **struck-through eliminated rows + skull icon**; phase banner with countdown to next elimination
  - Lazy state computation — no background tasks
- **Seed data** (`/app/backend/seed.py`):
  - Tournament: **T-SPRING (Spring Classic 2026)** — completed, TradeFury reached **Semi-Finals** (+$4,843 prize)
  - Tournament: **T-BRONZE (Bronze Cup 2026)** — completed, TradeFury exited at **Round of 16**
  - Tournament: **Diamond Open 2026** — ongoing Group Stage
  - Tournament: **February Open** — registration open
  - Royale lobbies refreshed on each backend startup: 1h lobby anchored to "12 min in" (phase 1) and 30min lobby anchored to "22 min in" (phase 2) so the demo never drifts
- **New backend endpoints**:
  - `GET /api/me/trading-station/duel/{id}` — me/opponent objects with equity_series + MT5 creds
  - `GET /api/me/trading-station/royale/{id}` — lobby state + leaderboard + MT5
  - `GET /api/me/trading-station/tournament/{id}` — journey + MT5
  - `GET /api/royale/lobbies/{id}/state` — phase, eliminations, leaderboard
  - `GET /api/me/tournaments/journey` — list of my journeys across all registered tournaments
  - `GET /api/tournaments/{id}/bracket` — full bracket with usernames + is_you flag
- **Tournament model extended** with `bracket` (R16/QF/SF/Final matches), `winner_id`, `account_size`.
- **Bug fix**: `GET /api/me/trading-station` now correctly queries `participant_ids` (not `registered_ids`) for royale lobbies, so my royale entries actually appear in Trading Station.
- **Tests**: 63 passing pytest cases total — 23 new in `/app/backend/tests/test_journey_and_royale.py`, 40 from v4.1 matchmaking suite. 0 failures.

### v4.1 (2026-02-15) — 1v1 Duel matchmaking flow
- **Multi-step matchmaking flow** on `/app/duel` Spawn centre: clicking an account-size card opens a new `DuelMatchmakingDialog` (`/app/frontend/src/components/app/DuelMatchmakingDialog.jsx`) that walks the user through 5 phases — Confirm payment → Queueing (5m) → Paired (Ready up, 3m) → Starting (MT5 creds + 3m pre-trade countdown) → Live (navigates to `/app/match/:id`). Polls `/api/duels/queue/{id}` every 2s for state changes.
- **Mock wallet deduction** on entry. Insufficient balance gates the Pay button. Cancel during queue refunds in full.
- **Real peer pairing + AI fallback (option 2c)**: `POST /api/duels/enter` matches with another queueing user at the same tier instantly; if the 5-minute window expires alone, the duel is paired with an AI opponent (synthetic bot persona — auto-marked ready). Bot label shown in the Paired step.
- **Ready timeout cancellation (option 4b)**: if either trader doesn't ready up within 3 minutes, the duel is cancelled and BOTH real (non-bot) traders are refunded.
- **Lazy lifecycle state machine** in `_tick_duel_lifecycle()` runs on every poll — no background jobs. Status transitions: `queueing → paired → starting → live` (or `cancelled` on timeout/cancel).
- **New backend endpoints** on `/api/duels`: `POST /enter`, `GET /queue/{id}`, `POST /queue/{id}/cancel`, `POST /{id}/ready`. Existing `/{id}/mt5` and `/{id}/confirm-login` reused.
- **Duel model extended** (`/app/backend/models.py`) with: `pairing_expires_at`, `ready_deadline`, `trade_starts_at`, `trader_a_ready`, `trader_b_ready`, `trader_b_is_bot`, `void_reason`. `DuelStatus` literal now includes `queueing`, `paired`, `starting`.
- **Preview restored**: frontend dev server now correctly picks up `REACT_APP_BACKEND_URL` from `/app/frontend/.env` after supervisor restart (was missing → all API calls were resolving to `/app/undefined/api/...`).
- **Tests**: 40/40 pytest backend cases passing (`/app/backend/tests/test_matchmaking_v41.py` adds 21 new scenarios — peer pairing, bot fallback, ready timeout, refund math, double-entry prevention, MT5 determinism, participant-only authz).

### v4 (2026-02-09) — MT5 + 3-min countdown + Admin tabs + Landing Affiliate
- **Client Match MT5 dialog**: `/app/frontend/src/pages/app/Match.jsx` shows a non-dismissable dialog to participants only, displaying MT5 login/password/server/platform with a live 3-minute countdown. Confirm button POSTs `/api/duels/{id}/confirm-login`; both-confirmed state sets `trading_started_at` server-side. Spectators do NOT see the dialog.
- **Admin Matches tabs**: `/app/frontend/src/pages/admin/Matches.jsx` rewritten with three Tabs (Active/Inactive/Completed) and count badges. Active rows show a `Mt5Monitor` cell with remaining countdown + A/B confirmation pips. Inactive includes pairing+cancelled; Completed is completed.
- **Admin Settlements detail**: `/app/frontend/src/pages/admin/Extras.jsx::AdminSettlements` — clickable settlement rows populate a styled summary panel (trader A/B, account size, entry fee, prize, winner highlight, status, started/ended timestamps, void reason).
- **Landing Affiliate section**: `/app/frontend/src/components/landing/Affiliate.jsx` — tiered marketing block (Rookie/Pro/Elite/Legend) with rev-share %, signup bonus, ref + volume thresholds, and a CTA to `/app/affiliate`. Added 'Affiliate' link to landing nav.
- **Backend additions**: `/api/duels/{id}` and `/api/admin/duels` now return `started_at`, `login_confirmed_a/b`, `trading_started_at` for MT5 monitoring. `/api/duels/{id}/mt5` (participant-gated) + `/api/duels/{id}/confirm-login` consumed by UI.
- **Tests**: 14 pytest cases at `/app/backend/tests/backend_test.py`, 100% passing. Frontend testids all verified by testing agent.

### v3 (2026-02-08) — Robust mock backend
- 5-file backend at `/app/backend/`: `models.py` (15 Pydantic models), `database.py`, `simulator.py` (deterministic on-read live P&L), `seed.py` (idempotent), `server.py` (35+ endpoints, mock auth via X-User-Id/X-Username, default @TradeFury).
- Seeded demo state: 10 users, duels, royale lobbies, tournaments, teams, transactions, notifications.
- Live simulation: P&L/leaderboards/timers computed from seed + wall-clock — no background tasks, no DB writes per tick.

### v2 — Modern fintech landing page
### v1 (deprecated) — Dark esports landing

## Backlog

### P1 (next)
- Real auth: JWT + Emergent Google. Token → X-User-Id header.
- Active Match screen: server-driven trade feed (`/api/duels/{id}/trades` — currently sample trades).
- Auto-tick Royale lobby status: filling → starting → live → completed.
- Wallet deposit UI polish in Client Area.

### P2
- Stripe test-mode for Pro subscription + entry fees.
- Real KYC upload to object storage.
- Email transactional (Resend/SendGrid) for prize/pair/tournament alerts.
- Refactor `server.py` (>1200 lines) into `/app/backend/routes/{client,admin,affiliate}.py`.
- Community Battles functional implementation.
- Recharts width(-1) warnings on Match.jsx (cosmetic; carry-over).

## Test Credentials
See `/app/memory/test_credentials.md`. Admin: admin@selecttraders.com / admin-2026.
