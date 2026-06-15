"""Seed data — populates the DB with realistic demo content on startup if empty."""
from __future__ import annotations
import random
from datetime import datetime, timedelta, timezone

from models import (
    User, Duel, DuelRules, RoyaleLobby, Tournament, Team, Transaction,
    Notification, MatchResult, LinkedAccount,
)
import database as db


def _now():
    return datetime.now(timezone.utc)


def _iso(dt: datetime) -> str:
    return dt.isoformat()


DEMO_USERS_SEED = [
    {"username": "TradeFury", "full_name": "Riley Chen", "email": "riley@example.com", "plan": "PRO", "tier": "Gold", "global_rank": 142, "win_rate": 62.4, "matches_played": 84, "wins": 52, "losses": 32, "win_streak": 4, "best_streak": 9, "best_trade": 3420, "worst_drawdown": -1840, "balance": 12480.5, "pending": 3200, "lifetime_earned": 48720, "country": "🇺🇸", "kyc_status": "not_started"},
    {"username": "GoldHands", "full_name": "Jonas Weber", "email": "jonas@example.com", "plan": "PRO", "tier": "Diamond", "global_rank": 38, "win_rate": 71.2, "matches_played": 156, "wins": 111, "losses": 45, "win_streak": 7, "best_streak": 14, "balance": 24800, "lifetime_earned": 112400, "country": "🇩🇪"},
    {"username": "StealthAlpha", "full_name": "Maya Park", "email": "maya@example.com", "plan": "PRO", "tier": "Elite", "global_rank": 12, "win_rate": 76.8, "matches_played": 220, "balance": 41200, "lifetime_earned": 218000, "country": "🇰🇷"},
    {"username": "PaperHandsNoMore", "full_name": "Felix Cole", "email": "felix@example.com", "plan": "FREE", "tier": "Silver", "global_rank": 401, "win_rate": 54.1, "matches_played": 41, "balance": 1840, "lifetime_earned": 7600, "country": "🇨🇦"},
    {"username": "FXSamurai", "full_name": "Hiro Tanaka", "email": "hiro@example.com", "plan": "PRO", "tier": "Gold", "global_rank": 188, "win_rate": 60.5, "matches_played": 92, "balance": 9120, "lifetime_earned": 38400, "country": "🇯🇵"},
    {"username": "CryptoKing", "full_name": "Aisha Khan", "email": "aisha@example.com", "plan": "FREE", "tier": "Bronze", "global_rank": 920, "win_rate": 48.3, "matches_played": 28, "balance": 540, "lifetime_earned": 2200, "country": "🇦🇪"},
    {"username": "TradeNova", "full_name": "Lucia Rossi", "email": "lucia@example.com", "plan": "PRO", "tier": "Diamond", "global_rank": 71, "win_rate": 68.7, "matches_played": 134, "balance": 18400, "lifetime_earned": 84200, "country": "🇮🇹"},
    {"username": "MarketBeast", "full_name": "Owen Reilly", "email": "owen@example.com", "plan": "FREE", "tier": "Gold", "global_rank": 251, "win_rate": 57.2, "matches_played": 73, "balance": 4220, "lifetime_earned": 18900, "country": "🇮🇪"},
    {"username": "RileyJess", "full_name": "Jess Park", "email": "jess@example.com", "plan": "PRO", "tier": "Gold", "global_rank": 198, "win_rate": 61.0, "matches_played": 60, "balance": 6200, "country": "🇺🇸"},
    {"username": "MoCapital", "full_name": "Mo Ibrahim", "email": "mo@example.com", "plan": "PRO", "tier": "Silver", "global_rank": 320, "win_rate": 55.8, "matches_played": 48, "balance": 3100, "country": "🇪🇬"},
]


async def is_empty() -> bool:
    n = await db.users().count_documents({})
    return n == 0


async def seed_all():
    if not await is_empty():
        return False
    now = _now()

    # ----- USERS -----
    users_map = {}
    for u in DEMO_USERS_SEED:
        user = User(**u)
        doc = user.model_dump()
        doc["created_at"] = _iso(doc["created_at"])
        await db.users().insert_one(doc)
        users_map[user.username] = user

    # ----- DUELS (4 live) -----
    duel_specs = [
        ("TradeFury", "GoldHands", 100000, False, 0.62, 0.42),   # current user winning
        ("StealthAlpha", "PaperHandsNoMore", 250000, True, 0.58, 0.55),  # custom Pro
        ("FXSamurai", "CryptoKing", 50000, False, 0.46, 0.58),
        ("TradeNova", "MarketBeast", 25000, False, 0.55, 0.48),
    ]
    duel_tiers = {5000: (60, 100), 10000: (125, 200), 25000: (280, 500), 50000: (550, 1000),
                  100000: (1100, 2000), 250000: (2800, 5000), 500000: (5500, 10000), 1000000: (11000, 20000)}

    for a_name, b_name, acc, is_custom, drift_a, drift_b in duel_specs:
        entry, prize = duel_tiers[acc]
        duration_hours = 24 if acc >= 50000 else 4
        # stagger start times so timers vary
        started = now - timedelta(minutes=random.randint(15, 90))
        ends = started + timedelta(hours=duration_hours)
        duel = Duel(
            type="custom" if is_custom else "standard",
            trader_a_id=users_map[a_name].id,
            trader_b_id=users_map[b_name].id,
            creator_id=users_map[a_name].id if is_custom else None,
            account_size=acc,
            entry_fee=entry,
            prize=prize,
            status="live",
            started_at=started,
            ends_at=ends,
            drift_a=drift_a,
            drift_b=drift_b,
            spectator_base=random.randint(40, 480),
            rules=DuelRules(
                leverage="1:100" if is_custom else "1:50",
                daily_dd=10 if is_custom else 15,
                max_dd=20,
                timeline=f"{duration_hours}h",
            ),
        )
        doc = duel.model_dump()
        doc["started_at"] = _iso(doc["started_at"])
        doc["ends_at"] = _iso(doc["ends_at"])
        await db.duels().insert_one(doc)

    # ----- ROYALE LOBBIES -----
    timeline_map = {"5min": 300, "10min": 600, "15min": 900, "30min": 1800, "1h": 3600,
                    "4h": 14400, "24h": 86400, "36h": 129600, "48h": 172800, "72h": 259200}
    lobby_specs = [
        (50, "24h", "filling", 47, 12),     # filling, starts in 12 min
        (20, "1h", "live", 20, 0, 12),       # live 12 min in (phase 1, halfway through)
        (10, "5min", "filling", 6, 0),       # filling, no specific start
        (50, "72h", "filling", 12, 0),
        (20, "4h", "filling", 15, 120),      # starts in 2h
        (10, "30min", "live", 10, 0, 22),    # live 22 min in (phase 2, mid eliminations)
    ]
    for spec in lobby_specs:
        size, timeline, status, joined, starts_min = spec[:5]
        # optional "minutes since start" for live lobbies (phase demo)
        live_elapsed_min = spec[5] if len(spec) > 5 else None
        starts_at = now + timedelta(minutes=starts_min) if starts_min else None
        if status == "live":
            elapsed = live_elapsed_min or 27
            started_at = now - timedelta(minutes=elapsed)
        else:
            started_at = None
        ends_at = (started_at + timedelta(seconds=timeline_map[timeline])) if started_at else None
        participants = list(users_map.values())[:joined] if joined else []
        lobby = RoyaleLobby(
            size=size,
            timeline=timeline,
            timeline_seconds=timeline_map[timeline],
            participant_ids=[u.id for u in participants],
            status=status,
            starts_at=starts_at,
            started_at=started_at,
            ends_at=ends_at,
        )
        doc = lobby.model_dump()
        for k in ("starts_at", "started_at", "ends_at"):
            if doc.get(k):
                doc[k] = _iso(doc[k])
        await db.royale_lobbies().insert_one(doc)

    # ----- TOURNAMENTS -----
    user_ids = [u.id for u in users_map.values()]
    other_user_ids = [u.id for u in users_map.values() if u.username != "TradeFury"]
    tradefury_id = users_map["TradeFury"].id

    def make_groups(active_user_id: str, week_1_done: bool):
        groups = []
        for label in "ABCDEFGH":
            rows = []
            for i in range(4):
                u_id = active_user_id if (label == "A" and i == 0) else random.choice(user_ids)
                if week_1_done:
                    w, d, l = random.choice([(3, 0, 0), (2, 1, 0), (1, 0, 2), (0, 1, 2)])
                    equity = random.randint(-5000, 14000)
                    advanced = (w >= 2)
                else:
                    w, d, l = 0, 0, 0
                    equity = 0
                    advanced = False
                rows.append({
                    "user_id": u_id,
                    "w": w, "d": d, "l": l,
                    "equity": equity,
                    "advanced": advanced,
                })
            groups.append({"label": label, "rows": rows})
        return groups

    def _make_completed_groups(me_id: str, me_advances: bool):
        """Build groups where 'advanced' = top 2 by equity.

        Multi Trader group stage: all 4 traders trade simultaneously for the
        same fixed timeline (1 or 5 trading days). The top 2 by equity at end
        of timeline advance — there are no head-to-head matches in the group.
        """
        groups = []
        # Group A — featured group containing the demo user
        my_equity = 8200 if me_advances else -1400
        opp_equities = [9100, 4300, -2200] if me_advances else [11200, 6400, 3100]
        rows_a = [{"user_id": me_id, "w": 0, "d": 0, "l": 0,
                   "equity": my_equity, "advanced": False}]  # set later
        for i in range(3):
            opp = other_user_ids[(i + 1) % len(other_user_ids)]
            rows_a.append({"user_id": opp, "w": 0, "d": 0, "l": 0,
                           "equity": opp_equities[i], "advanced": False})
        rows_a.sort(key=lambda r: r["equity"], reverse=True)
        for idx, r in enumerate(rows_a):
            r["advanced"] = idx < 2
        groups.append({"label": "A", "rows": rows_a})
        # Groups B-H — random equities, top 2 advance
        for label in "BCDEFGH":
            rows = []
            for i in range(4):
                u_id = other_user_ids[(i * 3 + ord(label)) % len(other_user_ids)]
                rows.append({"user_id": u_id, "w": 0, "d": 0, "l": 0,
                             "equity": random.randint(-5000, 14000),
                             "advanced": False})
            rows.sort(key=lambda r: r["equity"], reverse=True)
            for idx, r in enumerate(rows):
                r["advanced"] = idx < 2
            groups.append({"label": label, "rows": rows})
        return groups

    def _bracket_for_user(tournament_id: str, exit_stage: str, account_size: int):
        """Build a completed bracket where the demo user exits at `exit_stage`.

        exit_stage in: "R16", "QF", "SF", "Final", "Champion"
        Returns: bracket dict + winner_id + the demo user's per-stage results.
        """
        stages_order = ["R16", "QF", "SF", "Final"]
        # Determine when the user loses
        loses_at_index = {"R16": 0, "QF": 1, "SF": 2, "Final": 3, "Champion": None}[exit_stage]

        bracket = {s: [] for s in stages_order}
        my_matches = []
        my_id = tradefury_id
        # Pre-allocate opponents for each round (unique per stage)
        opp_pool = [u for u in other_user_ids]
        random.shuffle(opp_pool)
        my_pnl_total = 0
        for i, stage in enumerate(stages_order):
            opp_id = opp_pool[i % len(opp_pool)]
            user_wins = (loses_at_index is None) or (i < loses_at_index)
            if user_wins:
                pnl_a = random.randint(800, 2400)
                pnl_b = random.randint(-1200, 500)
            else:
                pnl_a = random.randint(-1400, 300)
                pnl_b = random.randint(900, 2200)
            winner_id = my_id if user_wins else opp_id
            match = {
                "match_id": f"{tournament_id}-{stage}-MY",
                "user_a": my_id, "user_b": opp_id,
                "pnl_a": pnl_a, "pnl_b": pnl_b,
                "winner_id": winner_id, "completed": True,
                "date_label": (now - timedelta(days=(4 - i) * 2 + 8)).strftime("%b %d"),
                "account_size": account_size,
            }
            bracket[stage].append(match)
            my_matches.append({"stage": stage, "match": match})
            my_pnl_total += pnl_a
            if not user_wins:
                # Fill remaining stages without the demo user
                remaining_winner = opp_id
                for j in range(i + 1, len(stages_order)):
                    rs = stages_order[j]
                    next_opp = opp_pool[(j + 7) % len(opp_pool)]
                    pa = random.randint(-1400, 2200)
                    pb = random.randint(-1400, 2200)
                    win_a = pa > pb
                    bracket[rs].append({
                        "match_id": f"{tournament_id}-{rs}-NXT",
                        "user_a": remaining_winner, "user_b": next_opp,
                        "pnl_a": pa, "pnl_b": pb,
                        "winner_id": remaining_winner if win_a else next_opp,
                        "completed": True,
                        "date_label": (now - timedelta(days=(4 - j) * 2 + 8)).strftime("%b %d"),
                        "account_size": account_size,
                    })
                    remaining_winner = remaining_winner if win_a else next_opp
                tournament_winner_id = remaining_winner
                break
        else:
            tournament_winner_id = my_id

        # Add "filler" matches per stage so each stage has more than one match
        # (just to show the full bracket — pure decoration)
        stage_slots = {"R16": 8, "QF": 4, "SF": 2, "Final": 1}
        for stage in stages_order:
            existing = len(bracket[stage])
            for k in range(stage_slots[stage] - existing):
                a = opp_pool[(k * 2 + 1) % len(opp_pool)]
                b = opp_pool[(k * 2 + 2) % len(opp_pool)]
                if a == b:
                    b = opp_pool[(k * 2 + 4) % len(opp_pool)]
                pa = random.randint(-1500, 2500)
                pb = random.randint(-1500, 2500)
                win_a = pa > pb
                bracket[stage].append({
                    "match_id": f"{tournament_id}-{stage}-F{k}",
                    "user_a": a, "user_b": b,
                    "pnl_a": pa, "pnl_b": pb,
                    "winner_id": a if win_a else b,
                    "completed": True,
                    "date_label": (now - timedelta(days=(4 - stages_order.index(stage)) * 2 + 8)).strftime("%b %d"),
                    "account_size": account_size,
                })

        return bracket, tournament_winner_id, my_pnl_total

    # 1. Completed tournament — TradeFury reached SF (3rd place)
    spring_id = "T-SPRING"
    spring_bracket, spring_winner, _ = _bracket_for_user(spring_id, "SF", 50000)
    spring_groups = _make_completed_groups(tradefury_id, me_advances=True)
    spring_t = Tournament(
        id=spring_id,
        name="Spring Classic 2026",
        stage="Completed",
        start_date="Jan 5",
        prize_pool=50000,
        registered_ids=user_ids,
        groups=spring_groups,
        bracket=spring_bracket,
        winner_id=spring_winner,
        account_size=50000,
    )
    await db.tournaments().insert_one(spring_t.model_dump())

    # 2. Completed tournament — TradeFury eliminated in R16
    bronze_id = "T-BRONZE"
    bronze_bracket, bronze_winner, _ = _bracket_for_user(bronze_id, "R16", 25000)
    bronze_groups = _make_completed_groups(tradefury_id, me_advances=True)
    bronze_t = Tournament(
        id=bronze_id,
        name="Bronze Cup 2026",
        stage="Completed",
        start_date="Dec 10",
        prize_pool=25000,
        registered_ids=user_ids,
        groups=bronze_groups,
        bracket=bronze_bracket,
        winner_id=bronze_winner,
        account_size=25000,
    )
    await db.tournaments().insert_one(bronze_t.model_dump())

    # 3. Ongoing — in Group Stage
    diamond_t = Tournament(
        name="Diamond Open 2026",
        stage="Group Stage",
        start_date="Feb 12",
        prize_pool=120000,
        registered_ids=user_ids[:24],
        groups=_make_completed_groups(tradefury_id, me_advances=True),
        account_size=100000,
    )
    await db.tournaments().insert_one(diamond_t.model_dump())

    # 4. Registration-open
    feb_open_t = Tournament(
        name="February Open",
        stage="Registration",
        start_date="Feb 25",
        prize_pool=12800,
        registered_ids=user_ids[:6],
        account_size=10000,
    )
    await db.tournaments().insert_one(feb_open_t.model_dump())

    # ----- TEAMS -----
    team_specs = [
        {"name": "Alpha", "format": "3v3", "captain": "TradeFury",
         "members": ["TradeFury", "RileyJess", "MoCapital"], "splits": [400000, 350000, 250000], "total": 1000000,
         "wins": 4, "losses": 1},
        {"name": "Capital", "format": "5v5", "captain": "MoCapital",
         "members": ["MoCapital", "TradeFury", "FXSamurai", "TradeNova", "RileyJess"],
         "splits": [200000, 200000, 200000, 200000, 200000], "total": 1000000, "wins": 2, "losses": 3},
    ]
    for t in team_specs:
        team = Team(
            name=t["name"],
            format=t["format"],
            captain_id=users_map[t["captain"]].id,
            member_ids=[users_map[n].id for n in t["members"]],
            splits=t["splits"],
            total_account=t["total"],
            wins=t["wins"],
            losses=t["losses"],
        )
        await db.teams().insert_one(team.model_dump())

    # ----- TRANSACTIONS for current user -----
    tx_seed = [
        ("Prize", 1000, "completed", "Duel #4779", 5),
        ("Entry Fee", -550, "completed", "Duel #4779", 5),
        ("Deposit", 500, "completed", "Card •••4242", 6),
        ("Prize", 500, "completed", "Duel #4756", 7),
        ("Withdrawal", -2000, "processing", "Bank •••1184", 8),
        ("Entry Fee", -280, "completed", "Duel #4731", 10),
    ]
    for type_, amount, status, ref, days_ago in tx_seed:
        tx = Transaction(
            user_id=tradefury_id, type=type_, amount=amount,
            status=status, reference=ref,
            created_at=now - timedelta(days=days_ago),
        )
        doc = tx.model_dump()
        doc["created_at"] = _iso(doc["created_at"])
        await db.transactions().insert_one(doc)

    # ----- NOTIFICATIONS -----
    notif_seed = [
        ("pair", "Opponent found", "You've been paired with @FXSamurai for a $50K Duel.", True, 0.03),
        ("prize", "Prize credited", "$1,000 added to your wallet for Duel #4779.", True, 1),
        ("tournament", "Tournament starting soon", "February Open registration closes in 2 days.", False, 5),
        ("system", "KYC reminder", "Complete KYC before your first withdrawal.", False, 24),
    ]
    for type_, title, body, unread, hours_ago in notif_seed:
        n_obj = Notification(
            user_id=tradefury_id, type=type_, title=title, body=body, unread=unread,
            created_at=now - timedelta(hours=hours_ago),
        )
        doc = n_obj.model_dump()
        doc["created_at"] = _iso(doc["created_at"])
        await db.notifications().insert_one(doc)

    # ----- MATCH RESULTS (recent history) -----
    results_seed = [
        ("1v1 Duel", "@FXSamurai", 50000, 850, "win", 1000, 240, 2),
        ("Royale 50p", "Lobby R-2188", 5000, -45, "loss", 0, 90, 3),
        ("1v1 Duel", "@StealthAlpha", 25000, 410, "win", 500, 180, 4),
        ("Tag Team 3v3", "Team Beta", 100000, 1240, "win", 800, 360, 5),
        ("1v1 Duel", "@TradeNova", 10000, -180, "loss", 0, 120, 7),
    ]
    for fmt, opp, acc, pnl, result, prize, duration, days_ago in results_seed:
        mr = MatchResult(
            user_id=tradefury_id, match_id=f"M-{random.randint(4000,4999)}",
            format=fmt, opponent=opp, account_size=acc, pnl=pnl, result=result,
            prize=prize, duration_minutes=duration,
            date_label=(now - timedelta(days=days_ago)).strftime("%b %d"),
            created_at=now - timedelta(days=days_ago),
        )
        doc = mr.model_dump()
        doc["created_at"] = _iso(doc["created_at"])
        await db.match_results().insert_one(doc)

    # ----- LINKED ACCOUNTS -----
    for la_spec in [
        {"label": "Bank •••1184", "type": "Bank", "country": "🇺🇸", "is_default": True},
        {"label": "USDT (TRC20) •••f7c2", "type": "Crypto", "country": "—", "is_default": False},
    ]:
        la = LinkedAccount(user_id=tradefury_id, **la_spec)
        await db.linked_accounts().insert_one(la.model_dump())

    return True
