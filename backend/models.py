"""Pydantic models for THE SELECT TRADERS backend.

All models use string IDs (UUIDs) as the public identifier to keep the API clean.
Mongo's `_id` is excluded from queries — we project it out at the database layer.
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import List, Literal, Optional
from uuid import uuid4

from pydantic import BaseModel, Field, ConfigDict

# ---------- Helpers ----------

def _uid() -> str:
    return str(uuid4())

def _now() -> datetime:
    return datetime.now(timezone.utc)


# ---------- User ----------

class UserPublic(BaseModel):
    """Public-safe view of a user (used embedded in matches, leaderboards, etc.)."""
    model_config = ConfigDict(extra="ignore")
    id: str
    username: str
    avatar_initial: str
    tier: str
    plan: Literal["FREE", "PRO"]


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    username: str  # immutable
    full_name: str
    email: str
    country: str = "🌍"
    bio: str = ""
    plan: Literal["FREE", "PRO"] = "FREE"
    tier: Literal["Bronze", "Silver", "Gold", "Diamond", "Elite", "Legend"] = "Bronze"
    global_rank: int = 9999
    win_rate: float = 0.0
    matches_played: int = 0
    wins: int = 0
    losses: int = 0
    win_streak: int = 0
    best_streak: int = 0
    best_trade: float = 0.0
    worst_drawdown: float = 0.0
    balance: float = 0.0
    pending: float = 0.0
    lifetime_earned: float = 0.0
    kyc_status: Literal["not_started", "pending", "verified", "rejected"] = "not_started"
    twofa_enabled: bool = False
    created_at: datetime = Field(default_factory=_now)

    def to_public(self) -> UserPublic:
        return UserPublic(
            id=self.id,
            username=self.username,
            avatar_initial=self.username[0].upper(),
            tier=self.tier,
            plan=self.plan,
        )


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    email: Optional[str] = None
    twofa_enabled: Optional[bool] = None
    # username is intentionally not present — immutable


# ---------- Duel ----------

DuelStatus = Literal["pairing", "queueing", "paired", "starting", "live", "completed", "cancelled"]


class DuelRules(BaseModel):
    leverage: str = "1:100"
    daily_dd: int = 10
    max_dd: int = 20
    instruments: str = "All"
    account_type: Literal["Swap", "Swap-Free"] = "Swap-Free"
    spread_type: Literal["Raw spread", "Commission"] = "Raw spread"
    timeline: str = "24h"


class Duel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: f"D-{uuid4().hex[:6].upper()}")
    type: Literal["standard", "custom"] = "standard"
    trader_a_id: Optional[str] = None
    trader_b_id: Optional[str] = None
    creator_id: Optional[str] = None  # for custom duels
    account_size: int
    entry_fee: int
    prize: int
    status: DuelStatus = "live"
    started_at: datetime = Field(default_factory=_now)
    ends_at: datetime = Field(default_factory=_now)
    rules: DuelRules = Field(default_factory=DuelRules)
    seed_a: int = Field(default_factory=lambda: 1000 + int(uuid4().int % 9000))
    seed_b: int = Field(default_factory=lambda: 1000 + int(uuid4().int % 9000))
    drift_a: float = 0.45  # bias > 0.5 means upward drift
    drift_b: float = 0.5
    spectator_base: int = 50
    winner_id: Optional[str] = None
    final_pnl_a: Optional[float] = None
    final_pnl_b: Optional[float] = None
    # Matchmaking flow (v4.1)
    pairing_expires_at: Optional[datetime] = None  # 5m queue timer
    ready_deadline: Optional[datetime] = None  # 3m ready-up timer (after pairing)
    trade_starts_at: Optional[datetime] = None  # 3m pre-trade countdown
    trader_a_ready: Optional[str] = None  # iso ts when ready
    trader_b_ready: Optional[str] = None  # iso ts when ready
    trader_b_is_bot: bool = False
    void_reason: Optional[str] = None


# Duel as seen by the API (with live P&L computed)
class DuelView(BaseModel):
    id: str
    type: Literal["standard", "custom"]
    trader_a: Optional[UserPublic] = None
    trader_b: Optional[UserPublic] = None
    account_size: int
    entry_fee: int
    prize: int
    status: DuelStatus
    pnl_a: float
    pnl_b: float
    time_left_seconds: int
    spectators: int
    rules: DuelRules
    custom: bool
    is_yours: bool = False


class CreateCustomDuelInput(BaseModel):
    account_size: int
    entry_fee: int
    timeline: str = "24h"
    leverage: str = "1:100"
    daily_dd: int = 10
    max_dd: int = 20
    instruments: str = "All"
    account_type: Literal["Swap", "Swap-Free"] = "Swap-Free"
    spread_type: Literal["Raw spread", "Commission"] = "Raw spread"


# ---------- Spawn Queue ----------

class SpawnEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    user_id: str
    account_size: int
    entry_fee: int
    phase: Literal["searching", "paired", "activating", "starting", "completed", "expired"] = "searching"
    paired_with: Optional[str] = None
    duel_id: Optional[str] = None
    joined_at: datetime = Field(default_factory=_now)
    expires_at: datetime = Field(default_factory=_now)


# ---------- Royale Lobby ----------

LobbyStatus = Literal["filling", "starting", "live", "completed"]


class RoyaleLobby(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: f"R-{uuid4().hex[:5].upper()}")
    size: int  # 10, 20, 50
    timeline: str
    timeline_seconds: int
    participant_ids: List[str] = Field(default_factory=list)
    entry_fee: int = 20
    status: LobbyStatus = "filling"
    starts_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    seed: int = Field(default_factory=lambda: int(uuid4().int % 100000))


class RoyaleLobbyView(BaseModel):
    id: str
    size: int
    joined: int
    timeline: str
    entry_fee: int
    prize_pool: int
    status: LobbyStatus
    starts_in: str  # human-readable
    is_in: bool = False  # is the current user in this lobby


class RoyaleLeaderboardEntry(BaseModel):
    rank: int
    user: UserPublic
    equity: float
    pnl: float
    change: int  # rank change since last poll


# ---------- Tournament (Multi Trader) ----------

TournamentStage = Literal["Registration", "Group Stage", "R16", "QF", "SF", "Final", "Completed"]


class Tournament(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: f"T-{uuid4().hex[:6].upper()}")
    name: str
    capacity: int = 32
    registered_ids: List[str] = Field(default_factory=list)
    stage: TournamentStage = "Registration"
    start_date: str  # human-readable
    prize_pool: int
    groups: List[dict] = Field(default_factory=list)
    # groups format: [{ "label": "A", "rows": [{ "user_id": "x", "w": 0, "d": 0, "l": 0, "equity": 0, "advanced": bool }, ...] }, ...]


# ---------- Team (Tag Team) ----------

class Team(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    name: str
    format: Literal["3v3", "5v5"] = "3v3"
    captain_id: str
    member_ids: List[str] = Field(default_factory=list)
    splits: List[int] = Field(default_factory=list)  # capital per member, must sum to total
    total_account: int = 100000
    wins: int = 0
    losses: int = 0


class CreateTeamInput(BaseModel):
    name: str
    format: Literal["3v3", "5v5"]
    total_account: int
    splits: List[int]
    member_usernames: List[str] = Field(default_factory=list)


# ---------- Wallet Transactions ----------

TxType = Literal["Deposit", "Withdrawal", "Entry Fee", "Prize", "Refund", "Subscription"]
TxStatus = Literal["pending", "processing", "completed", "rejected"]


class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    user_id: str
    type: TxType
    amount: float  # positive for credit, negative for debit
    status: TxStatus = "completed"
    reference: str = ""
    created_at: datetime = Field(default_factory=_now)


class DepositInput(BaseModel):
    amount: float
    method: Literal["card", "bank", "crypto"]


class WithdrawInput(BaseModel):
    amount: float
    destination_id: str = "default"


# ---------- Notifications ----------

NotifType = Literal["pair", "prize", "tournament", "system", "match_start", "match_end"]


class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    user_id: str
    type: NotifType
    title: str
    body: str
    unread: bool = True
    created_at: datetime = Field(default_factory=_now)


# ---------- Community waitlist ----------

class CommunitySignup(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    email: str
    source: str = "landing"
    created_at: datetime = Field(default_factory=_now)


# ---------- Match history (completed results) ----------

class MatchResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    user_id: str
    match_id: str  # duel id / lobby id / etc
    format: str  # "1v1 Duel", "Royale 50p", "Tag Team 3v3", "Multi Trader"
    opponent: str
    account_size: int
    pnl: float
    result: Literal["win", "loss", "draw"]
    prize: float
    duration_minutes: int
    date_label: str  # human-readable
    created_at: datetime = Field(default_factory=_now)


# ---------- Linked accounts ----------

class LinkedAccount(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    user_id: str
    label: str
    type: Literal["Bank", "Crypto"]
    country: str = "—"
    is_default: bool = False


# ---------- Aggregate response shapes ----------

class StatsLive(BaseModel):
    traders: int
    paid_out: float
    countries: int
    live_matches: int


class WalletSummary(BaseModel):
    balance: float
    pending: float
    lifetime_earned: float
    kyc_status: str


class DashboardData(BaseModel):
    user: dict  # current user core fields
    earnings_trend: List[dict]
    earnings_total: float
    live_matches: List[DuelView]
    my_active_match: Optional[DuelView]
    upcoming_tournaments: List[dict]
    recent_results: List[MatchResult]
