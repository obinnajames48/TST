"""THE SELECT TRADERS — Mock backend API.

All endpoints under /api. Mongo persistence. Mock auth via X-User-Id header
(defaults to the seeded demo user @TradeFury). Live data simulated deterministically
on read — no background tasks needed.
"""
import asyncio
import logging
import os
import random
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException
from pathlib import Path
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

import database as db
from models import (
    CreateCustomDuelInput, CreateTeamInput, DepositInput, Duel, DuelRules, DuelView,
    LinkedAccount, Notification, RoyaleLobby, RoyaleLobbyView, SpawnEntry, Team, Tournament,
    Transaction, User, UserPublic, UserUpdate, WithdrawInput, CommunitySignup,
)
import seed
from simulator import (
    compute_duel_pnl, compute_earnings_trend, compute_equity_series, compute_royale_leaderboard,
    compute_spectators, compute_starts_in,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

app = FastAPI(title="The Select Traders API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def _now():
    return datetime.now(timezone.utc)


def _iso(dt):
    if isinstance(dt, str):
        return dt
    return dt.isoformat()


# ---------- Auth (mock) ----------

DEFAULT_USERNAME = "TradeFury"


async def get_current_user(x_user_id: Optional[str] = Header(default=None),
    x_username: Optional[str] = Header(default=None),
) -> dict:
    """Resolve current user from X-User-Id or X-Username header.
    Defaults to @TradeFury (seeded demo user).
    """
    if x_user_id:
        u = await db.find_one(db.users(), {"id": x_user_id})
        if u:
            return u
    if x_username:
        u = await db.find_one(db.users(), {"username": x_username})
        if u:
            return u
    u = await db.find_one(db.users(), {"username": DEFAULT_USERNAME})
    if not u:
        raise HTTPException(status_code=503, detail="System not seeded yet")
    return u


CurrentUser = Depends(get_current_user)


# ---------- Helpers ----------

async def _users_by_id(ids: List[str]) -> dict:
    if not ids:
        return {}
    docs = await db.users().find({"id": {"$in": ids}}, db.PROJECTION_NO_ID).to_list(length=len(ids))
    return {u["id"]: u for u in docs}


def _public(u: dict) -> UserPublic:
    return UserPublic(
        id=u["id"], username=u["username"],
        avatar_initial=u["username"][0].upper(),
        tier=u.get("tier", "Bronze"), plan=u.get("plan", "FREE"),
    )


def _serialize_duel(d: dict, users_map: dict, viewer_id: str) -> DuelView:
    pnl_a, pnl_b, time_left = compute_duel_pnl(d)
    ta = users_map.get(d.get("trader_a_id"))
    tb = users_map.get(d.get("trader_b_id"))
    return DuelView(
        id=d["id"],
        type=d["type"],
        trader_a=_public(ta) if ta else None,
        trader_b=_public(tb) if tb else None,
        account_size=d["account_size"],
        entry_fee=d["entry_fee"],
        prize=d["prize"],
        status=d["status"],
        pnl_a=pnl_a,
        pnl_b=pnl_b,
        time_left_seconds=time_left,
        spectators=compute_spectators(d),
        rules=DuelRules(**d.get("rules", {})),
        custom=d["type"] == "custom",
        is_yours=(d.get("trader_a_id") == viewer_id or d.get("trader_b_id") == viewer_id),
    )


async def _insert(coll, model: BaseModel):
    """Insert a Pydantic model, converting datetimes to ISO strings."""
    doc = model.model_dump()
    for k, v in list(doc.items()):
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    await coll.insert_one(doc)
    return doc


# ============================================================
# Health & Stats
# ============================================================

@api.get("/")
async def root():
    return {"name": "The Select Traders API", "status": "ok"}


@api.get("/stats/live")
async def stats_live():
    traders = await db.users().count_documents({})
    live_matches = await db.duels().count_documents({"status": "live"})
    paid_out_agg = await db.transactions().aggregate([
        {"$match": {"type": "Prize"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]).to_list(length=1)
    paid_out = paid_out_agg[0]["total"] if paid_out_agg else 0
    countries = len(await db.users().distinct("country"))
    return {
        "traders": traders + 12388,  # boost for demo plausibility
        "paid_out": round(paid_out + 2_100_000, 2),
        "countries": max(countries, 47),
        "live_matches": live_matches,
    }


# ============================================================
# User / Me
# ============================================================

@api.get("/me")
async def get_me(me: dict = CurrentUser):
    me.pop("created_at", None)
    return me


@api.patch("/me")
async def update_me(payload: UserUpdate, me: dict = CurrentUser):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return me
    await db.users().update_one({"id": me["id"]}, {"$set": updates})
    return await db.find_one(db.users(), {"id": me["id"]})


@api.get("/me/stats")
async def my_stats(me: dict = CurrentUser):
    return {
        "matches_played": me.get("matches_played", 0),
        "wins": me.get("wins", 0),
        "losses": me.get("losses", 0),
        "win_rate": me.get("win_rate", 0),
        "best_trade": me.get("best_trade", 0),
        "worst_drawdown": me.get("worst_drawdown", 0),
        "tier": me.get("tier", "Bronze"),
        "global_rank": me.get("global_rank", 9999),
        "win_streak": me.get("win_streak", 0),
        "best_streak": me.get("best_streak", 0),
        "earnings_trend": compute_earnings_trend(me),
        "win_rate_by_format": [
            {"name": "1v1 Duel", "value": 68},
            {"name": "Royale", "value": 41},
            {"name": "Multi Trader", "value": 55},
            {"name": "Tag Team", "value": 72},
        ],
        "win_rate_by_market": [
            {"name": "Forex", "value": 64},
            {"name": "Crypto", "value": 58},
            {"name": "Stocks", "value": 71},
            {"name": "Commodities", "value": 52},
        ],
    }


# ============================================================
# Dashboard
# ============================================================

@api.get("/dashboard")
async def dashboard(me: dict = CurrentUser):

    # Live duels
    duel_docs = await db.find_many(db.duels(), {"status": "live"}, sort=[("started_at", -1)], limit=8)
    user_ids = set()
    for d in duel_docs:
        if d.get("trader_a_id"): user_ids.add(d["trader_a_id"])
        if d.get("trader_b_id"): user_ids.add(d["trader_b_id"])
    users_map = await _users_by_id(list(user_ids))
    live = [_serialize_duel(d, users_map, me["id"]) for d in duel_docs]

    my_active = next((d for d in live if d.is_yours), None)

    # Upcoming tournaments
    tournaments = await db.find_many(db.tournaments(), {"stage": {"$ne": "Completed"}}, limit=3)
    upcoming = [{
        "id": t["id"], "name": t["name"], "registered": len(t.get("registered_ids", [])),
        "capacity": t["capacity"], "start_date": t["start_date"], "prize_pool": t["prize_pool"], "stage": t["stage"],
    } for t in tournaments]

    # Recent results
    results = await db.find_many(db.match_results(), {"user_id": me["id"]},
                                 sort=[("created_at", -1)], limit=5)

    trend = compute_earnings_trend(me)
    earnings_total = trend[-1]["earnings"] if trend else 0

    return {
        "user": {
            "id": me["id"], "username": me["username"], "plan": me["plan"],
            "tier": me["tier"], "global_rank": me["global_rank"],
            "win_rate": me["win_rate"], "balance": me["balance"],
            "lifetime_earned": me["lifetime_earned"], "win_streak": me.get("win_streak", 0),
            "best_streak": me.get("best_streak", 0),
        },
        "earnings_trend": trend,
        "earnings_total": earnings_total,
        "live_matches": [d.model_dump() for d in live],
        "my_active_match": my_active.model_dump() if my_active else None,
        "upcoming_tournaments": upcoming,
        "recent_results": results,
    }


# ============================================================
# Duels (1v1)
# ============================================================

@api.get("/duels/live")
async def list_live_duels(me: dict = CurrentUser):
    docs = await db.find_many(db.duels(), {"status": "live"}, sort=[("started_at", -1)])
    user_ids = {d.get("trader_a_id") for d in docs} | {d.get("trader_b_id") for d in docs}
    user_ids.discard(None)
    users_map = await _users_by_id(list(user_ids))
    return [_serialize_duel(d, users_map, me["id"]).model_dump() for d in docs]


@api.get("/duels/open")
async def list_open_duels(me: dict = CurrentUser):
    """Pairing duels (waiting for an opponent). Used by the Broadcast 'Open' lanes."""
    docs = await db.find_many(db.duels(), {"status": "pairing"}, sort=[("started_at", -1)])
    user_ids = {d.get("trader_a_id") for d in docs} | {d.get("trader_b_id") for d in docs}
    user_ids.discard(None)
    users_map = await _users_by_id(list(user_ids))
    return [_serialize_duel(d, users_map, me["id"]).model_dump() for d in docs]


@api.get("/me/trading-station")
async def my_trading_station(me: dict = CurrentUser):
    """All events involving the current user grouped by status (active / pending / completed)."""
    my_id = me["id"]
    duel_docs = await db.find_many(
        db.duels(),
        {"$or": [{"trader_a_id": my_id}, {"trader_b_id": my_id}]},
        sort=[("started_at", -1)],
        limit=200,
    )
    user_ids = {d.get("trader_a_id") for d in duel_docs} | {d.get("trader_b_id") for d in duel_docs}
    user_ids.discard(None)
    users_map = await _users_by_id(list(user_ids))

    def _row_from_duel(d):
        pnl_a, pnl_b, time_left = compute_duel_pnl(d)
        my_pnl = pnl_a if d.get("trader_a_id") == my_id else pnl_b
        opponent_id = d.get("trader_b_id") if d.get("trader_a_id") == my_id else d.get("trader_a_id")
        opponent = users_map.get(opponent_id, {})
        return {
            "id": d["id"],
            "kind": "duel-pro" if d.get("type") == "custom" else "duel-standard",
            "label": "1v1 Duel · Pro" if d.get("type") == "custom" else "1v1 Duel · Standard",
            "status": d.get("status"),
            "opponent": opponent.get("username") if opponent else "—",
            "account_size": d.get("account_size"),
            "entry_fee": d.get("entry_fee"),
            "prize": d.get("prize"),
            "pnl": my_pnl,
            "time_left_seconds": time_left,
            "started_at": d.get("started_at"),
            "link": f"/app/match/{d['id']}",
        }

    rows = [_row_from_duel(d) for d in duel_docs]

    # Royale registrations (pending lobbies the user joined)
    royale_docs = await db.find_many(
        db.royale_lobbies(),
        {"registered_ids": my_id},
        sort=[("starts_at", 1)],
        limit=50,
    )
    for r in royale_docs:
        status = "completed" if r.get("status") == "completed" else ("active" if r.get("status") == "live" else "pending")
        rows.append({
            "id": r["id"],
            "kind": "royale",
            "label": f"Trading Royale · {r.get('name', 'Lobby')}",
            "status": status,
            "opponent": f"{len(r.get('registered_ids', []))}/{r.get('capacity', 0)} traders",
            "account_size": r.get("account_size"),
            "entry_fee": r.get("entry_fee"),
            "prize": r.get("prize_pool"),
            "pnl": None,
            "time_left_seconds": compute_starts_in(r) if status == "pending" else None,
            "started_at": r.get("starts_at"),
            "link": f"/app/royale",
        })

    # Tournament registrations
    tourn_docs = await db.find_many(
        db.tournaments(),
        {"registered_ids": my_id},
        sort=[("start_date", 1)],
        limit=20,
    )
    for t in tourn_docs:
        stage = t.get("stage", "")
        status = "completed" if stage == "Completed" else ("active" if stage in ("Group Stage", "Knockout", "Final") else "pending")
        rows.append({
            "id": t["id"],
            "kind": "tournament",
            "label": f"Multi Trader · {t.get('name')}",
            "status": status,
            "opponent": f"{len(t.get('registered_ids', []))}/{t.get('capacity', 0)} registered",
            "account_size": t.get("account_size"),
            "entry_fee": t.get("entry_fee"),
            "prize": t.get("prize_pool"),
            "pnl": None,
            "time_left_seconds": None,
            "started_at": t.get("start_date"),
            "link": f"/app/tournament",
        })

    def _bucket(r):
        s = r.get("status")
        if s in ("live",) or (r["kind"] in ("royale", "tournament") and s == "active"):
            return "active"
        if s in ("completed", "voided"):
            return "completed"
        return "pending"

    grouped = {"active": [], "pending": [], "completed": []}
    for r in rows:
        grouped[_bucket(r)].append(r)

    # Sort: active by time_left asc, pending by started_at asc, completed by started_at desc
    def _key(x):
        return x.get("started_at") or ""
    grouped["active"].sort(key=lambda x: x.get("time_left_seconds") or 99999)
    grouped["pending"].sort(key=_key)
    grouped["completed"].sort(key=_key, reverse=True)

    return grouped


@api.get("/duels/{duel_id}")
async def get_duel(duel_id: str, me: dict = CurrentUser):
    d = await db.find_one(db.duels(), {"id": duel_id})
    if not d:
        raise HTTPException(status_code=404, detail="Duel not found")
    user_ids = [d.get("trader_a_id"), d.get("trader_b_id")]
    users_map = await _users_by_id([uid for uid in user_ids if uid])
    view = _serialize_duel(d, users_map, me["id"])
    series = compute_equity_series(d, points=40)
    return {
        **view.model_dump(),
        "equity_series": series,
        "started_at": d.get("started_at"),
        "login_confirmed_a": d.get("login_confirmed_a"),
        "login_confirmed_b": d.get("login_confirmed_b"),
        "trading_started_at": d.get("trading_started_at"),
    }


@api.post("/duels/spawn")
async def spawn_join(payload: dict, me: dict = CurrentUser):
    """Join the spawn queue for an account size. Simulates instant pairing for demo."""
    account_size = int(payload.get("account_size", 5000))

    # Find entry fee + prize from tier
    tiers = {5000: (60, 100), 10000: (125, 200), 25000: (280, 500), 50000: (550, 1000),
             100000: (1100, 2000), 250000: (2800, 5000), 500000: (5500, 10000), 1000000: (11000, 20000)}
    if account_size not in tiers:
        raise HTTPException(status_code=400, detail="Invalid account size")
    entry_fee, prize = tiers[account_size]

    # Pick a random opponent (not current user, excluding active duel participants)
    candidates = await db.find_many(db.users(), {"id": {"$ne": me["id"]}}, limit=20)
    opponent = random.choice(candidates) if candidates else None
    if not opponent:
        raise HTTPException(status_code=409, detail="No opponent available")

    # Create a live duel
    duration_hours = 24 if account_size >= 50000 else 4
    started = _now()
    duel = Duel(
        type="standard",
        trader_a_id=me["id"],
        trader_b_id=opponent["id"],
        account_size=account_size,
        entry_fee=entry_fee,
        prize=prize,
        status="live",
        started_at=started,
        ends_at=started + timedelta(hours=duration_hours),
        spectator_base=random.randint(20, 80),
        rules=DuelRules(timeline=f"{duration_hours}h"),
    )
    await _insert(db.duels(), duel)

    # Record entry fee transaction + notification
    tx = Transaction(user_id=me["id"], type="Entry Fee", amount=-entry_fee,
                     reference=f"Duel {duel.id}", status="completed")
    await _insert(db.transactions(), tx)

    notif = Notification(user_id=me["id"], type="pair", title="Opponent found",
                         body=f"You've been paired with @{opponent['username']} for a ${account_size:,} duel.")
    await _insert(db.notifications(), notif)

    return {
        "duel_id": duel.id,
        "opponent_username": opponent["username"],
        "account_size": account_size,
        "entry_fee": entry_fee,
        "prize": prize,
    }


# ---------- Matchmaking (v4.1): enter → queue → ready → countdown → live ----------

DUEL_TIERS = {5000: (60, 100), 10000: (125, 200), 25000: (280, 500), 50000: (550, 1000),
              100000: (1100, 2000), 250000: (2800, 5000), 500000: (5500, 10000),
              1000000: (11000, 20000)}

QUEUE_SECONDS = 5 * 60  # 5 minutes to find a peer
READY_SECONDS = 3 * 60  # 3 minutes to ready up after pairing
PRETRADE_SECONDS = 3 * 60  # 3 minutes after both ready before trading starts


def _parse_iso(value):
    if not value:
        return None
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(value)


async def _refund_trader(user_id: str, amount: int, duel_id: str, note: str):
    await db.users().update_one({"id": user_id}, {"$inc": {"balance": amount}})
    tx = Transaction(user_id=user_id, type="Refund", amount=amount,
                     reference=f"Refund {duel_id} - {note}", status="completed")
    await _insert(db.transactions(), tx)


async def _pick_bot_opponent(exclude_id: str) -> dict:
    """Pick a synthetic bot opponent — uses an existing seeded user as the bot persona."""
    candidates = await db.find_many(db.users(), {"id": {"$ne": exclude_id}}, limit=50)
    return random.choice(candidates) if candidates else None


async def _tick_duel_lifecycle(d: dict) -> dict:
    """Lazy state machine for a duel — runs on every read.

    queueing → (peer found at enter / bot at expiry) → paired
    paired   → (both ready) → starting, or (deadline) → cancelled
    starting → (countdown elapsed) → live
    """
    now = _now()
    status = d.get("status")
    duel_id = d["id"]

    if status == "queueing":
        exp = _parse_iso(d.get("pairing_expires_at"))
        if exp and now >= exp:
            # Fallback: pair with a bot opponent (option 2c)
            bot = await _pick_bot_opponent(d["trader_a_id"])
            if bot:
                ready_dl = now + timedelta(seconds=READY_SECONDS)
                await db.duels().update_one({"id": duel_id}, {"$set": {
                    "trader_b_id": bot["id"],
                    "trader_b_is_bot": True,
                    "trader_b_ready": now.isoformat(),  # bot auto-readies
                    "status": "paired",
                    "ready_deadline": ready_dl.isoformat(),
                }})
                d = await db.find_one(db.duels(), {"id": duel_id})
                status = d.get("status")
            else:
                # No users at all — cancel + refund
                await db.duels().update_one({"id": duel_id}, {"$set": {
                    "status": "cancelled",
                    "void_reason": "No opponent available",
                }})
                await _refund_trader(d["trader_a_id"], d["entry_fee"], duel_id, "no opponent")
                return await db.find_one(db.duels(), {"id": duel_id})

    if status == "paired":
        rd = _parse_iso(d.get("ready_deadline"))
        if d.get("trader_a_ready") and d.get("trader_b_ready"):
            # Both ready → transition to "starting" with 3-minute trade-start countdown
            ts = now + timedelta(seconds=PRETRADE_SECONDS)
            await db.duels().update_one({"id": duel_id}, {"$set": {
                "status": "starting",
                "trade_starts_at": ts.isoformat(),
            }})
            d = await db.find_one(db.duels(), {"id": duel_id})
            status = d.get("status")
        elif rd and now >= rd:
            # Ready deadline passed without both ready → cancel & refund ready trader(s)
            for tid_key, ready_key, is_bot_key in [
                ("trader_a_id", "trader_a_ready", None),
                ("trader_b_id", "trader_b_ready", "trader_b_is_bot"),
            ]:
                tid = d.get(tid_key)
                if not tid:
                    continue
                if is_bot_key and d.get(is_bot_key):
                    continue  # bot didn't pay
                if d.get(ready_key):
                    await _refund_trader(tid, d["entry_fee"], duel_id, "opponent not ready")
                else:
                    # Trader didn't ready — keep their entry fee (forfeit), but for
                    # this MVP we still refund to be fair. (User chose option 4b.)
                    await _refund_trader(tid, d["entry_fee"], duel_id, "match cancelled")
            await db.duels().update_one({"id": duel_id}, {"$set": {
                "status": "cancelled",
                "void_reason": "A trader did not ready up within 3 minutes",
            }})
            return await db.find_one(db.duels(), {"id": duel_id})

    if status == "starting":
        ts = _parse_iso(d.get("trade_starts_at"))
        if ts and now >= ts:
            duration_hours = 24 if d["account_size"] >= 50000 else 4
            await db.duels().update_one({"id": duel_id}, {"$set": {
                "status": "live",
                "started_at": now.isoformat(),
                "ends_at": (now + timedelta(hours=duration_hours)).isoformat(),
            }})
            d = await db.find_one(db.duels(), {"id": duel_id})

    return d


def _queue_view(d: dict, me_id: str, opponent: Optional[dict]) -> dict:
    you_is_a = d.get("trader_a_id") == me_id
    you_ready = bool(d.get("trader_a_ready") if you_is_a else d.get("trader_b_ready"))
    opp_ready = bool(d.get("trader_b_ready") if you_is_a else d.get("trader_a_ready"))
    return {
        "duel_id": d["id"],
        "status": d["status"],
        "account_size": d["account_size"],
        "entry_fee": d["entry_fee"],
        "prize": d["prize"],
        "you_are": "a" if you_is_a else "b",
        "you_ready": you_ready,
        "opponent_ready": opp_ready,
        "opponent": {
            "username": opponent["username"],
            "tier": opponent.get("tier", "Bronze"),
            "is_bot": bool(d.get("trader_b_is_bot")) and you_is_a,
        } if opponent else None,
        "pairing_expires_at": d.get("pairing_expires_at"),
        "ready_deadline": d.get("ready_deadline"),
        "trade_starts_at": d.get("trade_starts_at"),
        "void_reason": d.get("void_reason"),
    }


@api.post("/duels/enter")
async def duels_enter(payload: dict, me: dict = CurrentUser):
    """Step 1 of matchmaking: pay entry fee and join the queue (or pair instantly).

    Tries to match with an existing user already in `queueing` for the same tier.
    Otherwise creates a `queueing` duel with a 5-minute pairing window.
    """
    account_size = int(payload.get("account_size", 5000))
    if account_size not in DUEL_TIERS:
        raise HTTPException(400, detail="Invalid account size")
    entry_fee, prize = DUEL_TIERS[account_size]

    # Wallet check
    if me.get("balance", 0) < entry_fee:
        raise HTTPException(402, detail=f"Insufficient wallet balance. Need ${entry_fee} to enter this duel.")

    # Avoid double-entry while already in an in-flight duel
    existing = await db.find_one(db.duels(), {
        "$or": [{"trader_a_id": me["id"]}, {"trader_b_id": me["id"]}],
        "status": {"$in": ["queueing", "paired", "starting"]},
    })
    if existing:
        raise HTTPException(409, detail="You are already in an active matchmaking flow")

    # Deduct wallet + record entry-fee transaction
    await db.users().update_one({"id": me["id"]}, {"$inc": {"balance": -entry_fee}})
    tx = Transaction(user_id=me["id"], type="Entry Fee", amount=-entry_fee,
                     reference=f"Duel entry ${account_size:,}", status="completed")
    await _insert(db.transactions(), tx)

    # Try to match with a peer already queueing at the same tier
    peer = await db.find_one(db.duels(), {
        "status": "queueing",
        "account_size": account_size,
        "trader_a_id": {"$ne": me["id"]},
    })
    if peer:
        # Promote peer's duel to paired with me as trader_b
        ready_dl = _now() + timedelta(seconds=READY_SECONDS)
        await db.duels().update_one({"id": peer["id"]}, {"$set": {
            "trader_b_id": me["id"],
            "status": "paired",
            "ready_deadline": ready_dl.isoformat(),
            "pairing_expires_at": None,
        }})
        # Update tx reference now that we know the duel id
        await db.transactions().update_one({"id": tx.id}, {
            "$set": {"reference": f"Duel {peer['id']}"}
        })
        notif = Notification(user_id=me["id"], type="pair", title="Opponent found",
                             body=f"You've been paired for a ${account_size:,} duel. Ready up within 3 minutes.")
        await _insert(db.notifications(), notif)
        await db.notifications().insert_one({
            "id": _uid_str(),
            "user_id": peer["trader_a_id"], "type": "pair",
            "title": "Opponent found",
            "body": f"You've been paired for your ${account_size:,} duel. Ready up within 3 minutes.",
            "unread": True,
            "created_at": _now().isoformat(),
        })
        return {"duel_id": peer["id"], "status": "paired",
                "account_size": account_size, "entry_fee": entry_fee, "prize": prize}

    # Otherwise create a new queueing duel
    now = _now()
    duel = Duel(
        type="standard",
        trader_a_id=me["id"],
        account_size=account_size,
        entry_fee=entry_fee,
        prize=prize,
        status="queueing",
        started_at=now,
        ends_at=now,  # set properly when match goes live
        pairing_expires_at=now + timedelta(seconds=QUEUE_SECONDS),
        spectator_base=random.randint(20, 80),
        rules=DuelRules(timeline="24h" if account_size >= 50000 else "4h"),
    )
    await _insert(db.duels(), duel)
    await db.transactions().update_one({"id": tx.id}, {"$set": {"reference": f"Duel {duel.id}"}})
    return {"duel_id": duel.id, "status": "queueing",
            "account_size": account_size, "entry_fee": entry_fee, "prize": prize,
            "pairing_expires_at": duel.pairing_expires_at.isoformat()}


@api.get("/duels/queue/{duel_id}")
async def duels_queue_state(duel_id: str, me: dict = CurrentUser):
    """Poll the current state of a matchmaking duel. Lazily advances the state machine."""
    d = await db.find_one(db.duels(), {"id": duel_id})
    if not d:
        raise HTTPException(404, detail="Duel not found")
    if me["id"] not in (d.get("trader_a_id"), d.get("trader_b_id")):
        raise HTTPException(403, detail="Not a participant")
    d = await _tick_duel_lifecycle(d)
    # Fetch opponent
    opponent_id = d.get("trader_b_id") if d.get("trader_a_id") == me["id"] else d.get("trader_a_id")
    opponent = await db.find_one(db.users(), {"id": opponent_id}) if opponent_id else None
    return _queue_view(d, me["id"], opponent)


@api.post("/duels/queue/{duel_id}/cancel")
async def duels_queue_cancel(duel_id: str, me: dict = CurrentUser):
    """Cancel a queueing duel before pairing — full refund."""
    d = await db.find_one(db.duels(), {"id": duel_id})
    if not d:
        raise HTTPException(404, detail="Duel not found")
    if d.get("trader_a_id") != me["id"]:
        raise HTTPException(403, detail="Only the entrant can cancel the queue")
    if d.get("status") != "queueing":
        raise HTTPException(409, detail="Cannot cancel — already paired")
    await db.duels().update_one({"id": duel_id}, {"$set": {
        "status": "cancelled",
        "void_reason": "Cancelled by entrant",
    }})
    await _refund_trader(me["id"], d["entry_fee"], duel_id, "cancelled by entrant")
    return {"ok": True}


@api.post("/duels/{duel_id}/ready")
async def duels_ready(duel_id: str, me: dict = CurrentUser):
    """Mark this trader as ready in a paired duel."""
    d = await db.find_one(db.duels(), {"id": duel_id})
    if not d:
        raise HTTPException(404, detail="Duel not found")
    if me["id"] not in (d.get("trader_a_id"), d.get("trader_b_id")):
        raise HTTPException(403, detail="Not a participant")
    if d.get("status") not in ("paired", "starting"):
        raise HTTPException(409, detail=f"Cannot ready up — status is {d.get('status')}")
    key = "trader_a_ready" if d.get("trader_a_id") == me["id"] else "trader_b_ready"
    if not d.get(key):
        await db.duels().update_one({"id": duel_id}, {"$set": {key: _now().isoformat()}})
    d = await db.find_one(db.duels(), {"id": duel_id})
    d = await _tick_duel_lifecycle(d)
    opponent_id = d.get("trader_b_id") if d.get("trader_a_id") == me["id"] else d.get("trader_a_id")
    opponent = await db.find_one(db.users(), {"id": opponent_id}) if opponent_id else None
    return _queue_view(d, me["id"], opponent)





@api.post("/duels/custom")
async def create_custom_duel(payload: CreateCustomDuelInput, me: dict = CurrentUser):
    if me["plan"] != "PRO":
        raise HTTPException(status_code=403, detail="Creating custom duels requires a Pro plan")

    # Calculate hours from timeline string like "24h", "4h"
    timeline_hours = {"1h": 1, "4h": 4, "24h": 24, "36h": 36, "48h": 48, "72h": 72}.get(payload.timeline, 24)
    started = _now()
    duel = Duel(
        type="custom",
        trader_a_id=me["id"],
        creator_id=me["id"],
        account_size=payload.account_size,
        entry_fee=payload.entry_fee,
        prize=payload.entry_fee * 2,  # 2x return for custom (could be configurable)
        status="pairing",
        started_at=started,
        ends_at=started + timedelta(hours=timeline_hours),
        spectator_base=random.randint(20, 60),
        rules=DuelRules(
            leverage=payload.leverage, daily_dd=payload.daily_dd, max_dd=payload.max_dd,
            instruments=payload.instruments, account_type=payload.account_type,
            spread_type=payload.spread_type, timeline=payload.timeline,
        ),
    )
    await _insert(db.duels(), duel)
    return {"duel_id": duel.id, "status": "pairing"}


# ============================================================
# Royale lobbies
# ============================================================

@api.get("/royale/lobbies")
async def list_lobbies(size: Optional[int] = None, timeline: Optional[str] = None, me: dict = CurrentUser):
    filt = {"status": {"$ne": "completed"}}
    if size:
        filt["size"] = size
    if timeline:
        filt["timeline"] = timeline
    docs = await db.find_many(db.royale_lobbies(), filt)
    out = []
    for l in docs:
        joined = len(l.get("participant_ids", []))
        pool = int(l["size"] * l["entry_fee"] * 0.85)
        out.append(RoyaleLobbyView(
            id=l["id"], size=l["size"], joined=joined, timeline=l["timeline"],
            entry_fee=l["entry_fee"], prize_pool=pool, status=l["status"],
            starts_in=compute_starts_in(l),
            is_in=me["id"] in l.get("participant_ids", []),
        ).model_dump())
    return out


@api.get("/royale/lobbies/{lobby_id}")
async def get_lobby(lobby_id: str, me: dict = CurrentUser):
    l = await db.find_one(db.royale_lobbies(), {"id": lobby_id})
    if not l:
        raise HTTPException(status_code=404, detail="Lobby not found")
    participants = await _users_by_id(l.get("participant_ids", []))
    public_users = [_public(u).model_dump() for u in participants.values()]
    leaderboard = compute_royale_leaderboard(l, public_users) if l["status"] in ("live", "starting") else []

    # time left
    time_left = None
    if l.get("ends_at"):
        ends_at = l["ends_at"]
        if isinstance(ends_at, str):
            ends_at = datetime.fromisoformat(ends_at)
        time_left = max(0, int((ends_at - _now()).total_seconds()))

    return {
        "id": l["id"], "size": l["size"], "timeline": l["timeline"],
        "joined": len(l.get("participant_ids", [])),
        "entry_fee": l["entry_fee"], "status": l["status"],
        "prize_pool": int(l["size"] * l["entry_fee"] * 0.85),
        "starts_in": compute_starts_in(l),
        "time_left_seconds": time_left,
        "leaderboard": leaderboard,
        "is_in": me["id"] in l.get("participant_ids", []),
    }


@api.post("/royale/lobbies/{lobby_id}/join")
async def join_lobby(lobby_id: str, me: dict = CurrentUser):
    l = await db.find_one(db.royale_lobbies(), {"id": lobby_id})
    if not l:
        raise HTTPException(status_code=404, detail="Lobby not found")
    if me["id"] in l.get("participant_ids", []):
        raise HTTPException(status_code=409, detail="Already in this lobby")
    if len(l.get("participant_ids", [])) >= l["size"]:
        raise HTTPException(status_code=409, detail="Lobby is full")
    await db.royale_lobbies().update_one(
        {"id": lobby_id},
        {"$push": {"participant_ids": me["id"]}},
    )
    # entry fee
    tx = Transaction(user_id=me["id"], type="Entry Fee", amount=-l["entry_fee"],
                     reference=f"Royale {lobby_id}", status="completed")
    await _insert(db.transactions(), tx)
    return {"ok": True, "lobby_id": lobby_id}


# ============================================================
# Tournaments (Multi Trader)
# ============================================================

@api.get("/tournaments")
async def list_tournaments(me: dict = CurrentUser):
    docs = await db.find_many(db.tournaments(), {"stage": {"$ne": "Completed"}})
    return [{
        "id": t["id"], "name": t["name"],
        "registered": len(t.get("registered_ids", [])),
        "capacity": t["capacity"], "start_date": t["start_date"],
        "prize_pool": t["prize_pool"], "stage": t["stage"],
        "is_registered": me["id"] in t.get("registered_ids", []),
    } for t in docs]


@api.get("/tournaments/{tournament_id}")
async def get_tournament(tournament_id: str, me: dict = CurrentUser):
    t = await db.find_one(db.tournaments(), {"id": tournament_id})
    if not t:
        raise HTTPException(status_code=404, detail="Tournament not found")

    # hydrate group rows with usernames
    user_ids = set()
    for g in t.get("groups", []):
        for r in g.get("rows", []):
            if r.get("user_id"):
                user_ids.add(r["user_id"])
    users_map = await _users_by_id(list(user_ids))
    for g in t.get("groups", []):
        for r in g.get("rows", []):
            uid = r.get("user_id")
            u = users_map.get(uid) if uid else None
            r["username"] = u["username"] if u else "Unknown"
            r["is_you"] = uid == me["id"]
    return {
        **t,
        "is_registered": me["id"] in t.get("registered_ids", []),
        "prize_distribution": [
            {"stage": "Round of 16 qualifiers", "share": 25, "amount": int(t["prize_pool"] * 0.25)},
            {"stage": "Quarter-final qualifiers", "share": 25, "amount": int(t["prize_pool"] * 0.25)},
            {"stage": "Semi-finalists", "share": 20, "amount": int(t["prize_pool"] * 0.20)},
            {"stage": "Runner-up", "share": 15, "amount": int(t["prize_pool"] * 0.15)},
            {"stage": "Champion", "share": 15, "amount": int(t["prize_pool"] * 0.15)},
        ],
    }


@api.post("/tournaments/{tournament_id}/register")
async def register_tournament(tournament_id: str, me: dict = CurrentUser):
    t = await db.find_one(db.tournaments(), {"id": tournament_id})
    if not t:
        raise HTTPException(status_code=404, detail="Tournament not found")
    if me["id"] in t.get("registered_ids", []):
        raise HTTPException(status_code=409, detail="Already registered")
    if len(t.get("registered_ids", [])) >= t["capacity"]:
        raise HTTPException(status_code=409, detail="Tournament full")
    await db.tournaments().update_one(
        {"id": tournament_id},
        {"$push": {"registered_ids": me["id"]}},
    )
    notif = Notification(user_id=me["id"], type="tournament",
                         title="Registered for tournament",
                         body=f"You're in: {t['name']}. Starts {t['start_date']}.")
    await _insert(db.notifications(), notif)
    return {"ok": True}


# ============================================================
# Teams (Tag Team)
# ============================================================

@api.get("/teams")
async def list_teams(me: dict = CurrentUser):
    docs = await db.find_many(db.teams(), {"member_ids": me["id"]})
    out = []
    for t in docs:
        members = await _users_by_id(t.get("member_ids", []))
        captain = members.get(t.get("captain_id"))
        out.append({
            "id": t["id"], "name": t["name"], "format": t["format"],
            "total_account": t["total_account"], "splits": t["splits"],
            "role": "Captain" if t.get("captain_id") == me["id"] else "Member",
            "members": [members[mid]["username"] for mid in t.get("member_ids", []) if mid in members],
            "wins": t.get("wins", 0), "losses": t.get("losses", 0),
            "record": f"{t.get('wins', 0)}-{t.get('losses', 0)}",
        })
    return out


@api.post("/teams")
async def create_team(payload: CreateTeamInput, me: dict = CurrentUser):
    if me["plan"] != "PRO":
        raise HTTPException(status_code=403, detail="Creating a team requires a Pro plan")

    expected_slots = 3 if payload.format == "3v3" else 5
    if len(payload.splits) != expected_slots:
        raise HTTPException(status_code=400, detail=f"Need exactly {expected_slots} splits for {payload.format}")
    if sum(payload.splits) != payload.total_account:
        raise HTTPException(status_code=400,
                            detail=f"Splits must sum to ${payload.total_account:,}, got ${sum(payload.splits):,}")
    if len(payload.name) < 2:
        raise HTTPException(status_code=400, detail="Team name too short")

    # invite by username — find members that exist
    members = [me["id"]]
    for uname in payload.member_usernames:
        u = await db.find_one(db.users(), {"username": uname.lstrip("@")})
        if u and u["id"] not in members:
            members.append(u["id"])

    team = Team(name=payload.name, format=payload.format, captain_id=me["id"],
                member_ids=members[:expected_slots], splits=payload.splits,
                total_account=payload.total_account)
    await _insert(db.teams(), team)
    return {"id": team.id, "name": team.name, "members_invited": len(payload.member_usernames)}


# ============================================================
# Wallet
# ============================================================

@api.get("/wallet")
async def wallet_summary(me: dict = CurrentUser):
    return {
        "balance": me["balance"],
        "pending": me["pending"],
        "lifetime_earned": me["lifetime_earned"],
        "kyc_status": me.get("kyc_status", "not_started"),
    }


@api.post("/wallet/deposit")
async def deposit(payload: DepositInput, me: dict = CurrentUser):
    if payload.amount < 10:
        raise HTTPException(status_code=400, detail="Minimum deposit is $10")
    tx = Transaction(user_id=me["id"], type="Deposit", amount=payload.amount,
                     status="completed",
                     reference={
                         "card": "Card •••4242", "bank": "Bank •••1184", "crypto": "USDT •••f7c2",
                     }.get(payload.method, "—"))
    await _insert(db.transactions(), tx)
    await db.users().update_one({"id": me["id"]}, {"$inc": {"balance": payload.amount}})
    return {"ok": True, "transaction_id": tx.id}


@api.post("/wallet/withdraw")
async def withdraw(payload: WithdrawInput, me: dict = CurrentUser):
    if me.get("kyc_status") != "verified":
        raise HTTPException(status_code=403, detail="Complete KYC before your first withdrawal")
    if payload.amount < 10:
        raise HTTPException(status_code=400, detail="Minimum withdrawal is $10")
    if payload.amount > me["balance"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    tx = Transaction(user_id=me["id"], type="Withdrawal", amount=-payload.amount,
                     status="processing", reference="Bank •••1184")
    await _insert(db.transactions(), tx)
    await db.users().update_one({"id": me["id"]}, {"$inc": {"balance": -payload.amount}})
    return {"ok": True, "transaction_id": tx.id}


@api.get("/wallet/transactions")
async def list_transactions(limit: int = 50, me: dict = CurrentUser):
    return await db.find_many(db.transactions(), {"user_id": me["id"]},
                              sort=[("created_at", -1)], limit=limit)


# ============================================================
# Notifications
# ============================================================

@api.get("/notifications")
async def list_notifications(me: dict = CurrentUser):
    return await db.find_many(db.notifications(), {"user_id": me["id"]},
                              sort=[("created_at", -1)], limit=50)


@api.post("/notifications/mark-all-read")
async def mark_all_read(me: dict = CurrentUser):
    await db.notifications().update_many({"user_id": me["id"]}, {"$set": {"unread": False}})
    return {"ok": True}


@api.post("/notifications/{notif_id}/read")
async def mark_one_read(notif_id: str):
    await db.notifications().update_one({"id": notif_id}, {"$set": {"unread": False}})
    return {"ok": True}


# ============================================================
# Match history (My Stats)
# ============================================================

@api.get("/match-history")
async def match_history(limit: int = 50, me: dict = CurrentUser):
    return await db.find_many(db.match_results(), {"user_id": me["id"]},
                              sort=[("created_at", -1)], limit=limit)


# ============================================================
# Settings — KYC, Linked accounts
# ============================================================

@api.post("/settings/kyc/upload")
async def kyc_upload(me: dict = CurrentUser):
    await db.users().update_one({"id": me["id"]}, {"$set": {"kyc_status": "pending"}})
    return {"ok": True, "status": "pending"}


@api.get("/settings/linked-accounts")
async def list_linked(me: dict = CurrentUser):
    return await db.find_many(db.linked_accounts(), {"user_id": me["id"]})


@api.post("/settings/linked-accounts")
async def add_linked(payload: dict, me: dict = CurrentUser):
    la = LinkedAccount(
        user_id=me["id"], label=payload.get("label", "Unnamed"),
        type=payload.get("type", "Bank"), country=payload.get("country", "—"),
    )
    await _insert(db.linked_accounts(), la)
    return la.model_dump()


@api.delete("/settings/linked-accounts/{account_id}")
async def remove_linked(account_id: str, me: dict = CurrentUser):
    await db.linked_accounts().delete_one({"id": account_id, "user_id": me["id"]})
    return {"ok": True}


# ============================================================
# Community waitlist
# ============================================================

@api.post("/community/notify")
async def community_notify(payload: dict):
    email = payload.get("email", "").strip().lower()
    if "@" not in email or "." not in email:
        raise HTTPException(status_code=400, detail="Invalid email")
    existing = await db.find_one(db.community_signups(), {"email": email})
    if existing:
        return {"ok": True, "already": True}
    s = CommunitySignup(email=email, source=payload.get("source", "landing"))
    await _insert(db.community_signups(), s)
    return {"ok": True, "already": False}


# ============================================================
# App lifecycle
# ============================================================

app.include_router(api)


# ============================================================
# ADMIN API
# ============================================================

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@selecttraders.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin-2026")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "admin-secret-token-2026")

admin = APIRouter(prefix="/api/admin")


async def require_admin(authorization: Optional[str] = Header(default=None)):
    expected = f"Bearer {ADMIN_TOKEN}"
    if authorization != expected:
        raise HTTPException(status_code=401, detail="Admin authentication required")
    return True


AdminAuth = Depends(require_admin)


class AdminLogin(BaseModel):
    email: str
    password: str


async def _audit(action: str, target: str = "", meta: dict = None):
    await db.db().audit_log.insert_one({
        "id": _uid_str(),
        "action": action,
        "target": target,
        "meta": meta or {},
        "created_at": _now().isoformat(),
    })


def _uid_str():
    from uuid import uuid4 as _u
    return str(_u())


@admin.post("/login")
async def admin_login(payload: AdminLogin):
    if payload.email != ADMIN_EMAIL or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    await _audit("admin.login", target=payload.email)
    return {"token": ADMIN_TOKEN, "email": ADMIN_EMAIL}


@admin.get("/overview")
async def admin_overview(_: bool = AdminAuth):
    total_users = await db.users().count_documents({})
    active_30d = total_users  # mock — all seeded users are "active"
    live_matches = await db.duels().count_documents({"status": "live"})
    pending_wds = await db.transactions().count_documents({"type": "Withdrawal", "status": "processing"})
    pending_kyc = await db.users().count_documents({"kyc_status": "pending"})

    rev_agg = await db.transactions().aggregate([
        {"$match": {"type": {"$in": ["Entry Fee", "Subscription"]}}},
        {"$group": {"_id": None, "total": {"$sum": {"$abs": "$amount"}}}},
    ]).to_list(length=1)
    revenue_mtd = rev_agg[0]["total"] if rev_agg else 0

    # daily registrations (mock — derive from created_at)
    users_docs = await db.users().find({}, {"_id": 0, "created_at": 1}).to_list(length=1000)
    daily = {}
    for u in users_docs:
        d = (u.get("created_at") or "")[:10]
        daily[d] = daily.get(d, 0) + 1
    daily_series = [{"day": k, "count": v} for k, v in sorted(daily.items())][-30:]

    return {
        "total_users": total_users,
        "active_30d": active_30d,
        "revenue_mtd": revenue_mtd,
        "live_matches": live_matches,
        "pending_withdrawals": pending_wds,
        "pending_kyc": pending_kyc,
        "daily_registrations": daily_series,
        "revenue_breakdown": [
            {"name": "Entry fees", "value": int(revenue_mtd * 0.78)},
            {"name": "Subscriptions", "value": int(revenue_mtd * 0.18)},
            {"name": "Rake", "value": int(revenue_mtd * 0.04)},
        ],
    }


@admin.get("/users")
async def admin_list_users(_: bool = AdminAuth, q: Optional[str] = None, plan: Optional[str] = None):
    filt = {}
    if plan and plan != "all":
        filt["plan"] = plan
    if q:
        filt["$or"] = [{"username": {"$regex": q, "$options": "i"}}, {"email": {"$regex": q, "$options": "i"}}]
    return await db.find_many(db.users(), filt, sort=[("created_at", -1)], limit=100)


@admin.post("/users/{user_id}/plan")
async def admin_set_plan(user_id: str, payload: dict, _: bool = AdminAuth):
    new_plan = payload.get("plan")
    if new_plan not in ("FREE", "PRO"):
        raise HTTPException(status_code=400, detail="Invalid plan")
    await db.users().update_one({"id": user_id}, {"$set": {"plan": new_plan}})
    await _audit("user.plan_change", target=user_id, meta={"plan": new_plan})
    return {"ok": True}


@admin.post("/users/{user_id}/suspend")
async def admin_suspend(user_id: str, payload: dict, _: bool = AdminAuth):
    reason = payload.get("reason", "")
    await db.users().update_one({"id": user_id}, {"$set": {"suspended": True, "suspend_reason": reason}})
    await _audit("user.suspended", target=user_id, meta={"reason": reason})
    return {"ok": True}


@admin.post("/users/{user_id}/unsuspend")
async def admin_unsuspend(user_id: str, _: bool = AdminAuth):
    await db.users().update_one({"id": user_id}, {"$set": {"suspended": False}, "$unset": {"suspend_reason": ""}})
    await _audit("user.unsuspended", target=user_id)
    return {"ok": True}


@admin.get("/duels")
async def admin_list_duels(_: bool = AdminAuth, status: Optional[str] = None):
    filt = {}
    if status and status != "all":
        filt["status"] = status
    docs = await db.find_many(db.duels(), filt, sort=[("started_at", -1)], limit=100)
    user_ids = {d.get("trader_a_id") for d in docs} | {d.get("trader_b_id") for d in docs}
    user_ids.discard(None)
    users_map = await _users_by_id(list(user_ids))
    out = []
    for d in docs:
        pnl_a, pnl_b, time_left = compute_duel_pnl(d) if d["status"] == "live" else (d.get("final_pnl_a", 0), d.get("final_pnl_b", 0), 0)
        out.append({
            "id": d["id"], "type": d["type"], "status": d["status"],
            "trader_a": users_map.get(d.get("trader_a_id"), {}).get("username", "—"),
            "trader_b": users_map.get(d.get("trader_b_id"), {}).get("username", "—"),
            "account_size": d["account_size"], "entry_fee": d["entry_fee"], "prize": d["prize"],
            "pnl_a": pnl_a, "pnl_b": pnl_b, "time_left_seconds": time_left,
            "started_at": d.get("started_at"),
            "login_confirmed_a": d.get("login_confirmed_a"),
            "login_confirmed_b": d.get("login_confirmed_b"),
            "trading_started_at": d.get("trading_started_at"),
        })
    return out


@admin.post("/duels/{duel_id}/void")
async def admin_void_duel(duel_id: str, payload: dict, _: bool = AdminAuth):
    d = await db.find_one(db.duels(), {"id": duel_id})
    if not d:
        raise HTTPException(status_code=404, detail="Duel not found")
    reason = payload.get("reason", "no reason provided")
    await db.duels().update_one({"id": duel_id}, {"$set": {"status": "cancelled", "void_reason": reason}})
    # refund both traders
    for tid in (d.get("trader_a_id"), d.get("trader_b_id")):
        if tid:
            await db.transactions().insert_one({
                "id": _uid_str(), "user_id": tid, "type": "Refund",
                "amount": d["entry_fee"], "status": "completed",
                "reference": f"Refund for {duel_id}",
                "created_at": _now().isoformat(),
            })
    await _audit("duel.voided", target=duel_id, meta={"reason": reason})
    return {"ok": True}


@admin.get("/finance/withdrawals")
async def admin_withdrawals(_: bool = AdminAuth):
    docs = await db.transactions().find(
        {"type": "Withdrawal"}, db.PROJECTION_NO_ID
    ).sort("created_at", -1).limit(100).to_list(length=100)
    user_ids = list({d["user_id"] for d in docs if d.get("user_id")})
    users_map = await _users_by_id(user_ids)
    for d in docs:
        u = users_map.get(d.get("user_id"))
        d["username"] = u["username"] if u else "—"
        d["kyc_status"] = u.get("kyc_status", "not_started") if u else "—"
    return docs


@admin.post("/finance/withdrawals/{tx_id}/approve")
async def admin_approve_wd(tx_id: str, _: bool = AdminAuth):
    await db.transactions().update_one({"id": tx_id}, {"$set": {"status": "completed"}})
    await _audit("withdrawal.approved", target=tx_id)
    return {"ok": True}


@admin.post("/finance/withdrawals/{tx_id}/reject")
async def admin_reject_wd(tx_id: str, payload: dict, _: bool = AdminAuth):
    reason = payload.get("reason", "")
    await db.transactions().update_one({"id": tx_id}, {"$set": {"status": "rejected", "reject_reason": reason}})
    # refund balance
    tx = await db.find_one(db.transactions(), {"id": tx_id})
    if tx and tx.get("user_id"):
        await db.users().update_one({"id": tx["user_id"]}, {"$inc": {"balance": abs(tx["amount"])}})
    await _audit("withdrawal.rejected", target=tx_id, meta={"reason": reason})
    return {"ok": True}


@admin.get("/kyc")
async def admin_kyc_queue(_: bool = AdminAuth):
    return await db.find_many(db.users(), {"kyc_status": {"$in": ["pending", "not_started"]}}, limit=100)


@admin.post("/kyc/{user_id}/approve")
async def admin_approve_kyc(user_id: str, _: bool = AdminAuth):
    await db.users().update_one({"id": user_id}, {"$set": {"kyc_status": "verified"}})
    await _audit("kyc.approved", target=user_id)
    return {"ok": True}


@admin.post("/kyc/{user_id}/reject")
async def admin_reject_kyc(user_id: str, payload: dict, _: bool = AdminAuth):
    reason = payload.get("reason", "")
    await db.users().update_one({"id": user_id}, {"$set": {"kyc_status": "rejected", "kyc_reject_reason": reason}})
    await _audit("kyc.rejected", target=user_id, meta={"reason": reason})
    return {"ok": True}


@admin.get("/audit-log")
async def admin_audit_log(_: bool = AdminAuth, limit: int = 50):
    docs = await db.db().audit_log.find({}, db.PROJECTION_NO_ID).sort("created_at", -1).limit(limit).to_list(length=limit)
    return docs


@admin.get("/community-signups")
async def admin_community_signups(_: bool = AdminAuth):
    return await db.find_many(db.community_signups(), {}, sort=[("created_at", -1)], limit=200)


app.include_router(api)


# ============================================================
# EXTENSIONS (v4): MT5, login countdown, Affiliates, Settlements, Transactions
# ============================================================

# (Routes below added to the same router instances; we re-include at the bottom.)

MT5_SERVERS = ["SelectTraders-Live01", "SelectTraders-Live02", "SelectTraders-Live03"]


def _mt5_for_duel(duel_id: str, user_id: str) -> dict:
    """Deterministic mock MT5 credentials per duel-user combo."""
    seed = sum(ord(c) for c in (duel_id + user_id))
    login = 7700000 + (seed % 99999)
    pwd_pool = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
    pwd = "".join(pwd_pool[(seed * (i + 1)) % len(pwd_pool)] for i in range(10))
    return {
        "login": str(login),
        "password": pwd,
        "server": MT5_SERVERS[seed % len(MT5_SERVERS)],
        "platform": "MetaTrader 5",
    }


@api.get("/duels/{duel_id}/mt5")
async def get_mt5_creds(duel_id: str, me: dict = CurrentUser):
    d = await db.find_one(db.duels(), {"id": duel_id})
    if not d:
        raise HTTPException(404, "Duel not found")
    if me["id"] not in (d.get("trader_a_id"), d.get("trader_b_id")):
        raise HTTPException(403, "Not a participant in this duel")
    return _mt5_for_duel(duel_id, me["id"])


@api.post("/duels/{duel_id}/confirm-login")
async def confirm_mt5_login(duel_id: str, me: dict = CurrentUser):
    d = await db.find_one(db.duels(), {"id": duel_id})
    if not d:
        raise HTTPException(404, "Duel not found")
    side = "login_confirmed_a" if d.get("trader_a_id") == me["id"] else "login_confirmed_b"
    await db.duels().update_one({"id": duel_id}, {"$set": {side: _now().isoformat()}})
    # if both confirmed, mark trading_started_at
    updated = await db.find_one(db.duels(), {"id": duel_id})
    if updated.get("login_confirmed_a") and updated.get("login_confirmed_b") and not updated.get("trading_started_at"):
        await db.duels().update_one({"id": duel_id}, {"$set": {"trading_started_at": _now().isoformat()}})
    return {"ok": True, "both_confirmed": bool(updated.get("login_confirmed_a") and updated.get("login_confirmed_b"))}


# ---------- Affiliates ----------

AFFILIATE_TIERS = [
    {"name": "Rookie",  "min_refs": 0,  "min_volume": 0,      "rev_share_pct": 10, "signup_bonus": 5,  "color": "neutral"},
    {"name": "Pro",     "min_refs": 5,  "min_volume": 5000,   "rev_share_pct": 15, "signup_bonus": 10, "color": "lime"},
    {"name": "Elite",   "min_refs": 20, "min_volume": 25000,  "rev_share_pct": 20, "signup_bonus": 15, "color": "purple"},
    {"name": "Legend",  "min_refs": 50, "min_volume": 100000, "rev_share_pct": 25, "signup_bonus": 25, "color": "dark"},
]


def _calc_tier(active_refs: int, volume: float) -> dict:
    current = AFFILIATE_TIERS[0]
    nxt = AFFILIATE_TIERS[1]
    for i, t in enumerate(AFFILIATE_TIERS):
        if active_refs >= t["min_refs"] and volume >= t["min_volume"]:
            current = t
            nxt = AFFILIATE_TIERS[i + 1] if i + 1 < len(AFFILIATE_TIERS) else None
    return {"current": current, "next": nxt}


@api.get("/me/affiliate")
async def my_affiliate(me: dict = CurrentUser):
    # Mock metrics deterministic by user
    seed = sum(ord(c) for c in me["username"])
    total_refs = (seed % 30) + 7
    active_refs = max(1, total_refs - (seed % 5))
    volume = round(active_refs * 1200 + (seed % 9000), 2)
    earnings = round(volume * 0.18, 2)
    pending = round(earnings * 0.22, 2)
    tier_info = _calc_tier(active_refs, volume)
    ref_code = me["username"].lower()[:8]
    return {
        "ref_code": ref_code,
        "ref_link": f"https://selecttraders.com/?ref={ref_code}",
        "total_refs": total_refs,
        "active_refs": active_refs,
        "referred_volume": volume,
        "lifetime_earnings": earnings,
        "pending_payout": pending,
        "tier": tier_info["current"],
        "next_tier": tier_info["next"],
        "progress_to_next": {
            "refs": (active_refs / tier_info["next"]["min_refs"] * 100) if tier_info["next"] else 100,
            "volume": (volume / max(1, tier_info["next"]["min_volume"]) * 100) if tier_info["next"] else 100,
        },
        "tiers": AFFILIATE_TIERS,
    }


@api.get("/me/affiliate/referrals")
async def my_referrals(me: dict = CurrentUser):
    # Mock: show some seeded users as "referred"
    seed = sum(ord(c) for c in me["username"])
    others = await db.find_many(db.users(), {"id": {"$ne": me["id"]}}, limit=12)
    out = []
    for i, u in enumerate(others):
        engaged = (seed + i) % 4 != 0
        out.append({
            "username": u["username"],
            "joined": (_now() - timedelta(days=(i + 1) * 4)).strftime("%b %d"),
            "active": engaged,
            "matches": (i + 2) * 3 if engaged else 1,
            "volume": round((i + 1) * 480, 2) if engaged else 0,
            "earned_for_you": round(((i + 1) * 480) * 0.18, 2) if engaged else 5,
        })
    return out


@api.get("/me/affiliate/payouts")
async def my_payouts(me: dict = CurrentUser):
    seed = sum(ord(c) for c in me["username"])
    out = []
    for i in range(4):
        amt = round(((seed + i * 17) % 800) + 120, 2)
        out.append({
            "id": f"AFP-{(seed + i) % 9999}",
            "amount": amt,
            "status": "completed" if i > 0 else "processing",
            "date": (_now() - timedelta(days=i * 14 + 4)).strftime("%b %d, %Y"),
            "method": "Bank •••1184",
        })
    return out


# ---------- Admin v4 ----------

@admin.get("/transactions")
async def admin_transactions(_: bool = AdminAuth, type: Optional[str] = None, status: Optional[str] = None):
    filt = {}
    if type and type != "all":
        filt["type"] = type
    if status and status != "all":
        filt["status"] = status
    docs = await db.transactions().find(filt, db.PROJECTION_NO_ID).sort("created_at", -1).limit(200).to_list(length=200)
    user_ids = list({d.get("user_id") for d in docs if d.get("user_id")})
    users_map = await _users_by_id(user_ids)
    for d in docs:
        u = users_map.get(d.get("user_id"))
        d["username"] = u["username"] if u else "—"
    return docs


@admin.get("/settlements")
async def admin_settlements(_: bool = AdminAuth):
    """Terminal: every settled (completed/cancelled) match across products."""
    duels = await db.duels().find({"status": {"$in": ["completed", "cancelled"]}}, db.PROJECTION_NO_ID).sort("ends_at", -1).limit(50).to_list(length=50)
    items = []
    user_ids = set()
    for d in duels:
        user_ids.add(d.get("trader_a_id"))
        user_ids.add(d.get("trader_b_id"))
    users_map = await _users_by_id([u for u in user_ids if u])
    for d in duels:
        items.append({
            "id": d["id"], "kind": "Duel", "type": d.get("type", "standard"),
            "status": d["status"],
            "trader_a": users_map.get(d.get("trader_a_id"), {}).get("username", "—"),
            "trader_b": users_map.get(d.get("trader_b_id"), {}).get("username", "—"),
            "account_size": d.get("account_size", 0),
            "prize": d.get("prize", 0),
            "winner": users_map.get(d.get("winner_id"), {}).get("username", "—") if d.get("winner_id") else "—",
            "settled_at": d.get("ends_at"),
        })
    # also include some mock royale/tournament settlements for visibility
    extras = [
        {"id": "R-PAST01", "kind": "Royale", "type": "standard", "status": "completed",
         "trader_a": "—", "trader_b": "Lobby 50p", "account_size": 5000, "prize": 850,
         "winner": "StealthAlpha", "settled_at": (_now() - timedelta(days=1)).isoformat()},
        {"id": "T-PAST01", "kind": "Tournament", "type": "standard", "status": "completed",
         "trader_a": "—", "trader_b": "32-player bracket", "account_size": 50000, "prize": 18400,
         "winner": "GoldHands", "settled_at": (_now() - timedelta(days=4)).isoformat()},
    ]
    return items + extras


@admin.get("/settlements/{settlement_id}")
async def admin_settlement_detail(settlement_id: str, _: bool = AdminAuth):
    d = await db.find_one(db.duels(), {"id": settlement_id})
    if d:
        user_ids = [d.get("trader_a_id"), d.get("trader_b_id")]
        users_map = await _users_by_id([u for u in user_ids if u])
        return {
            "id": d["id"], "kind": "Duel", "summary": {
                "trader_a": users_map.get(d.get("trader_a_id"), {}).get("username", "—"),
                "trader_b": users_map.get(d.get("trader_b_id"), {}).get("username", "—"),
                "account_size": d["account_size"], "entry_fee": d["entry_fee"], "prize": d["prize"],
                "rules": d.get("rules", {}), "status": d["status"],
                "started_at": d.get("started_at"), "ends_at": d.get("ends_at"),
                "winner": users_map.get(d.get("winner_id"), {}).get("username", "—") if d.get("winner_id") else "—",
                "void_reason": d.get("void_reason"),
            },
        }
    return {"id": settlement_id, "kind": "Match", "summary": {"note": "Mock settlement — no detail persisted."}}


@admin.get("/affiliates")
async def admin_affiliates(_: bool = AdminAuth):
    """All affiliates with totals."""
    users = await db.find_many(db.users(), {}, limit=100)
    out = []
    for u in users:
        seed = sum(ord(c) for c in u["username"])
        active_refs = max(1, (seed % 30) + 2)
        volume = round(active_refs * 1200 + (seed % 9000), 2)
        earnings = round(volume * 0.18, 2)
        pending = round(earnings * 0.22, 2)
        tier = _calc_tier(active_refs, volume)["current"]
        out.append({
            "user_id": u["id"], "username": u["username"], "tier": tier["name"],
            "active_refs": active_refs, "volume": volume,
            "lifetime_earnings": earnings, "pending_payout": pending,
        })
    out.sort(key=lambda x: -x["lifetime_earnings"])
    return out[:20]


@admin.post("/affiliates/{user_id}/payout")
async def admin_affiliate_payout(user_id: str, payload: dict, _: bool = AdminAuth):
    amount = float(payload.get("amount", 0))
    await db.transactions().insert_one({
        "id": _uid_str(), "user_id": user_id, "type": "Prize", "amount": amount,
        "status": "completed", "reference": "Affiliate payout",
        "created_at": _now().isoformat(),
    })
    await db.users().update_one({"id": user_id}, {"$inc": {"balance": amount}})
    await _audit("affiliate.payout", target=user_id, meta={"amount": amount})
    return {"ok": True}


@admin.get("/matches-by-status")
async def admin_matches_by_status(_: bool = AdminAuth):
    """Grouped match counts and lists by product + status."""
    duels = await db.find_many(db.duels(), {})
    lobbies = await db.find_many(db.royale_lobbies(), {})
    tours = await db.find_many(db.tournaments(), {})
    return {
        "duels": {
            "active": [d for d in duels if d["status"] == "live"],
            "inactive": [d for d in duels if d["status"] in ("pairing", "cancelled")],
            "completed": [d for d in duels if d["status"] == "completed"],
        },
        "royale": {
            "active": [l for l in lobbies if l["status"] in ("live", "starting")],
            "inactive": [l for l in lobbies if l["status"] == "filling"],
            "completed": [l for l in lobbies if l["status"] == "completed"],
        },
        "tournament": {
            "active": [t for t in tours if t["stage"] not in ("Registration", "Completed")],
            "inactive": [t for t in tours if t["stage"] == "Registration"],
            "completed": [t for t in tours if t["stage"] == "Completed"],
        },
    }


# Now that all routes are defined, mount the routers properly.
# (FastAPI snapshots routes at include time; the earlier app.include_router(api)
#  above missed v4 routes. Re-including the same router is idempotent for our case.)
for r in list(app.routes):
    if hasattr(r, "path") and (r.path.startswith("/api/admin/transactions") or
                                r.path.startswith("/api/admin/settlements") or
                                r.path.startswith("/api/admin/affiliates") or
                                r.path.startswith("/api/admin/matches-by-status") or
                                r.path.startswith("/api/me/affiliate") or
                                r.path.startswith("/api/duels/") and "/mt5" in r.path or
                                r.path.startswith("/api/duels/") and "/confirm-login" in r.path):
        pass

# Simplest correct approach: re-include both routers so the new routes are picked up.
app.include_router(api)
app.include_router(admin)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    try:
        created = await seed.seed_all()
        logger.info(f"Seed: {'created' if created else 'already populated'}")
    except Exception as e:
        logger.exception(f"Seed failed: {e}")


@app.on_event("shutdown")
async def on_shutdown():
    pass
