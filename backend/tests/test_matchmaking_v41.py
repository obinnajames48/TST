"""Backend tests for v4.1 1v1 Duel matchmaking flow.

Endpoints covered:
- POST /api/duels/enter
- GET /api/duels/queue/{id}
- POST /api/duels/queue/{id}/cancel
- POST /api/duels/{id}/ready
- GET /api/duels/{id}/mt5
- Regression: /api/duels/live, /api/duels/open, /api/me, /api/wallet, /api/dashboard, /api/duels/spawn
"""
import os
import time
from datetime import datetime, timedelta, timezone

import pytest
import requests
from pymongo import MongoClient

def _load_frontend_env():
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                k, _, v = line.strip().partition("=")
                if k == "REACT_APP_BACKEND_URL":
                    return v
    except Exception:
        pass
    return None


BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or _load_frontend_env() or "").rstrip("/")
assert BASE_URL, "REACT_APP_BACKEND_URL is not set"
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "select_traders")


# ---------- Fixtures ----------

@pytest.fixture(scope="session")
def mongo():
    return MongoClient(MONGO_URL)[DB_NAME]


def _client(username=None):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    if username:
        s.headers["X-Username"] = username
    return s


@pytest.fixture
def trade_fury():
    return _client("TradeFury")


@pytest.fixture
def mo_capital():
    return _client("MoCapital")


def _cleanup_active_duels(mongo, username):
    """Cancel any in-flight duels for a given user so each test starts fresh."""
    u = mongo.users.find_one({"username": username}, {"id": 1})
    if not u:
        return
    mongo.duels.update_many(
        {"$or": [{"trader_a_id": u["id"]}, {"trader_b_id": u["id"]}],
         "status": {"$in": ["queueing", "paired", "starting"]}},
        {"$set": {"status": "cancelled", "void_reason": "test cleanup"}},
    )


def _balance(client):
    return client.get(f"{BASE_URL}/api/wallet").json()["balance"]


def _topup(client, amount, method="card"):
    return client.post(f"{BASE_URL}/api/wallet/deposit", json={"amount": amount, "method": method})


# ---------- Regression smoke ----------

class TestRegressionSmoke:
    def test_me(self, trade_fury):
        r = trade_fury.get(f"{BASE_URL}/api/me")
        assert r.status_code == 200
        assert r.json()["username"] == "TradeFury"

    def test_wallet(self, trade_fury):
        r = trade_fury.get(f"{BASE_URL}/api/wallet")
        assert r.status_code == 200
        assert "balance" in r.json()

    def test_duels_live(self, trade_fury):
        r = trade_fury.get(f"{BASE_URL}/api/duels/live")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_duels_open(self, trade_fury):
        r = trade_fury.get(f"{BASE_URL}/api/duels/open")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_dashboard(self, trade_fury):
        r = trade_fury.get(f"{BASE_URL}/api/dashboard")
        assert r.status_code == 200
        assert "user" in r.json()

    def test_legacy_spawn(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        r = trade_fury.post(f"{BASE_URL}/api/duels/spawn", json={"account_size": 5000})
        assert r.status_code == 200
        assert "duel_id" in r.json()


# ---------- POST /api/duels/enter ----------

class TestDuelEnter:
    def test_enter_deducts_wallet_and_queues(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        # ensure enough balance
        bal_before = _balance(trade_fury)
        if bal_before < 60:
            _topup(trade_fury, 200)
            bal_before = _balance(trade_fury)

        r = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 5000})
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["status"] == "queueing"
        assert body["entry_fee"] == 60
        assert body["prize"] == 100
        assert body["account_size"] == 5000
        assert "duel_id" in body
        assert "pairing_expires_at" in body

        # pairing_expires_at ~5 min ahead
        exp = datetime.fromisoformat(body["pairing_expires_at"])
        delta = (exp - datetime.now(timezone.utc)).total_seconds()
        assert 4 * 60 - 10 <= delta <= 5 * 60 + 10, f"pairing window={delta}s"

        # wallet decreased exactly $60
        bal_after = _balance(trade_fury)
        assert bal_before - bal_after == 60

        _cleanup_active_duels(mongo, "TradeFury")

    def test_enter_insufficient_balance_402(self, mongo):
        # Use an existing seeded user (not TradeFury / MoCapital which are used elsewhere)
        username = "RileyJess"
        client = _client(username)
        _cleanup_active_duels(mongo, username)
        u = mongo.users.find_one({"username": username})
        if not u:
            pytest.skip(f"{username} not seeded")
        orig = u.get("balance", 0)
        mongo.users.update_one({"id": u["id"]}, {"$set": {"balance": 0}})
        try:
            r = client.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 5000})
            assert r.status_code == 402, r.text
            assert "insufficient" in r.json()["detail"].lower()
        finally:
            mongo.users.update_one({"id": u["id"]}, {"$set": {"balance": orig}})

    def test_enter_double_entry_409(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        if _balance(trade_fury) < 120:
            _topup(trade_fury, 300)
        r1 = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 5000})
        assert r1.status_code == 200
        r2 = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 5000})
        assert r2.status_code == 409
        _cleanup_active_duels(mongo, "TradeFury")

    def test_enter_invalid_account_size(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        r = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 1234})
        assert r.status_code == 400


# ---------- Peer pairing ----------

class TestPeerPairing:
    def test_two_users_pair_at_same_tier(self, trade_fury, mo_capital, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        _cleanup_active_duels(mongo, "MoCapital")
        # Ensure both have funds
        if _balance(trade_fury) < 300:
            _topup(trade_fury, 500)
        if _balance(mo_capital) < 300:
            _topup(mo_capital, 500)

        r1 = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})
        assert r1.status_code == 200
        assert r1.json()["status"] == "queueing"
        duel_id = r1.json()["duel_id"]

        r2 = mo_capital.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})
        assert r2.status_code == 200
        body2 = r2.json()
        assert body2["status"] == "paired"
        assert body2["duel_id"] == duel_id  # peer's duel was promoted

        # Poll queue state from TradeFury's view
        q = trade_fury.get(f"{BASE_URL}/api/duels/queue/{duel_id}").json()
        assert q["status"] == "paired"
        assert q["opponent"] is not None
        assert q["opponent"]["username"] == "MoCapital"
        assert q["opponent"]["is_bot"] is False
        assert q["ready_deadline"]
        rd = datetime.fromisoformat(q["ready_deadline"])
        delta = (rd - datetime.now(timezone.utc)).total_seconds()
        assert 2 * 60 - 10 <= delta <= 3 * 60 + 10

        _cleanup_active_duels(mongo, "TradeFury")
        _cleanup_active_duels(mongo, "MoCapital")


# ---------- Ready up ----------

class TestReadyFlow:
    def test_ready_sets_timestamp_and_transitions_to_starting(self, trade_fury, mo_capital, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        _cleanup_active_duels(mongo, "MoCapital")
        if _balance(trade_fury) < 300:
            _topup(trade_fury, 500)
        if _balance(mo_capital) < 300:
            _topup(mo_capital, 500)

        r1 = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})
        duel_id = r1.json()["duel_id"]
        mo_capital.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})

        # TradeFury ready
        ra = trade_fury.post(f"{BASE_URL}/api/duels/{duel_id}/ready")
        assert ra.status_code == 200
        assert ra.json()["you_ready"] is True
        assert ra.json()["opponent_ready"] is False

        # MoCapital ready → status should become "starting"
        rb = mo_capital.post(f"{BASE_URL}/api/duels/{duel_id}/ready")
        assert rb.status_code == 200
        body = rb.json()
        assert body["status"] == "starting"
        assert body["trade_starts_at"] is not None

        _cleanup_active_duels(mongo, "TradeFury")
        _cleanup_active_duels(mongo, "MoCapital")

    def test_ready_non_participant_forbidden(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        if _balance(trade_fury) < 200:
            _topup(trade_fury, 300)
        r1 = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 5000})
        duel_id = r1.json()["duel_id"]
        outsider = _client("StealthAlpha")
        r = outsider.post(f"{BASE_URL}/api/duels/{duel_id}/ready")
        assert r.status_code in (403, 409)
        _cleanup_active_duels(mongo, "TradeFury")


# ---------- Bot fallback on pairing expiry ----------

class TestBotFallback:
    def test_bot_pairs_when_queue_expires(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        if _balance(trade_fury) < 200:
            _topup(trade_fury, 300)
        r = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 5000})
        duel_id = r.json()["duel_id"]

        # Force pairing expiry in mongo
        past = (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()
        mongo.duels.update_one({"id": duel_id}, {"$set": {"pairing_expires_at": past}})

        # Poll → should advance to paired with bot
        q = trade_fury.get(f"{BASE_URL}/api/duels/queue/{duel_id}").json()
        assert q["status"] == "paired", q
        assert q["opponent"] is not None
        assert q["opponent"]["is_bot"] is True
        assert q["opponent_ready"] is True  # bot auto-readies
        assert q["ready_deadline"]

        _cleanup_active_duels(mongo, "TradeFury")


# ---------- Live transition ----------

class TestLiveTransition:
    def test_starting_to_live_when_trade_starts_at_elapses(self, trade_fury, mo_capital, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        _cleanup_active_duels(mongo, "MoCapital")
        if _balance(trade_fury) < 300:
            _topup(trade_fury, 500)
        if _balance(mo_capital) < 300:
            _topup(mo_capital, 500)

        r1 = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})
        duel_id = r1.json()["duel_id"]
        mo_capital.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})
        trade_fury.post(f"{BASE_URL}/api/duels/{duel_id}/ready")
        mo_capital.post(f"{BASE_URL}/api/duels/{duel_id}/ready")

        # Force trade_starts_at to past
        past = (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()
        mongo.duels.update_one({"id": duel_id}, {"$set": {"trade_starts_at": past}})

        q = trade_fury.get(f"{BASE_URL}/api/duels/queue/{duel_id}").json()
        assert q["status"] == "live", q

        d = mongo.duels.find_one({"id": duel_id})
        assert d.get("started_at")

        # cleanup
        mongo.duels.update_one({"id": duel_id}, {"$set": {"status": "cancelled", "void_reason": "test cleanup"}})


# ---------- Ready timeout cancellation + refund ----------

class TestReadyTimeoutRefund:
    def test_ready_deadline_expiry_cancels_and_refunds_both(self, trade_fury, mo_capital, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        _cleanup_active_duels(mongo, "MoCapital")
        if _balance(trade_fury) < 400:
            _topup(trade_fury, 500)
        if _balance(mo_capital) < 400:
            _topup(mo_capital, 500)

        tf_before = _balance(trade_fury)
        mc_before = _balance(mo_capital)

        r1 = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})
        duel_id = r1.json()["duel_id"]
        mo_capital.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})

        # Both paid $280
        assert tf_before - _balance(trade_fury) == 280
        assert mc_before - _balance(mo_capital) == 280

        # Force ready deadline expiry without anyone readying
        past = (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()
        mongo.duels.update_one({"id": duel_id}, {"$set": {"ready_deadline": past}})

        # Poll to trigger lifecycle tick
        q = trade_fury.get(f"{BASE_URL}/api/duels/queue/{duel_id}").json()
        assert q["status"] == "cancelled", q
        assert q["void_reason"]

        # Both refunded back to original
        assert _balance(trade_fury) == tf_before
        assert _balance(mo_capital) == mc_before

    def test_bot_match_ready_timeout_only_refunds_human(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        if _balance(trade_fury) < 200:
            _topup(trade_fury, 300)
        bal_before = _balance(trade_fury)

        r = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 5000})
        duel_id = r.json()["duel_id"]
        assert bal_before - _balance(trade_fury) == 60

        # Force pairing expiry → bot pairs
        past = (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()
        mongo.duels.update_one({"id": duel_id}, {"$set": {"pairing_expires_at": past}})
        q = trade_fury.get(f"{BASE_URL}/api/duels/queue/{duel_id}").json()
        assert q["status"] == "paired"
        assert q["opponent"]["is_bot"] is True

        # Force ready deadline expiry
        mongo.duels.update_one({"id": duel_id}, {"$set": {"ready_deadline": past}})
        q = trade_fury.get(f"{BASE_URL}/api/duels/queue/{duel_id}").json()
        assert q["status"] == "cancelled"

        # Human should be refunded fully
        assert _balance(trade_fury) == bal_before


# ---------- Cancel queue ----------

class TestQueueCancel:
    def test_entrant_can_cancel_queueing_full_refund(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        if _balance(trade_fury) < 200:
            _topup(trade_fury, 300)
        bal_before = _balance(trade_fury)

        r = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 5000})
        duel_id = r.json()["duel_id"]
        assert bal_before - _balance(trade_fury) == 60

        c = trade_fury.post(f"{BASE_URL}/api/duels/queue/{duel_id}/cancel")
        assert c.status_code == 200
        # refund happened
        assert _balance(trade_fury) == bal_before

        # State is cancelled
        d = mongo.duels.find_one({"id": duel_id})
        assert d["status"] == "cancelled"

    def test_cancel_after_paired_returns_409(self, trade_fury, mo_capital, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        _cleanup_active_duels(mongo, "MoCapital")
        if _balance(trade_fury) < 300:
            _topup(trade_fury, 500)
        if _balance(mo_capital) < 300:
            _topup(mo_capital, 500)

        r1 = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})
        duel_id = r1.json()["duel_id"]
        mo_capital.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 25000})

        c = trade_fury.post(f"{BASE_URL}/api/duels/queue/{duel_id}/cancel")
        assert c.status_code == 409
        _cleanup_active_duels(mongo, "TradeFury")
        _cleanup_active_duels(mongo, "MoCapital")

    def test_non_entrant_cannot_cancel(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        if _balance(trade_fury) < 200:
            _topup(trade_fury, 300)
        r = trade_fury.post(f"{BASE_URL}/api/duels/enter", json={"account_size": 5000})
        duel_id = r.json()["duel_id"]

        outsider = _client("MoCapital")
        c = outsider.post(f"{BASE_URL}/api/duels/queue/{duel_id}/cancel")
        assert c.status_code == 403
        _cleanup_active_duels(mongo, "TradeFury")


# ---------- MT5 credentials ----------

class TestMT5:
    def test_mt5_deterministic_and_participant_only(self, trade_fury, mongo):
        _cleanup_active_duels(mongo, "TradeFury")
        # Use legacy spawn (creates live duel with both traders)
        r = trade_fury.post(f"{BASE_URL}/api/duels/spawn", json={"account_size": 5000})
        duel_id = r.json()["duel_id"]

        m1 = trade_fury.get(f"{BASE_URL}/api/duels/{duel_id}/mt5")
        assert m1.status_code == 200
        body = m1.json()
        for k in ("login", "password", "server", "platform"):
            assert k in body
        assert body["platform"] == "MetaTrader 5"

        # Deterministic — same call returns same creds
        m2 = trade_fury.get(f"{BASE_URL}/api/duels/{duel_id}/mt5")
        assert m2.json() == body

        # Non-participant should get 403
        d = mongo.duels.find_one({"id": duel_id})
        # Find a user who is neither trader_a nor trader_b
        other_user = mongo.users.find_one({
            "id": {"$nin": [d["trader_a_id"], d["trader_b_id"]]}
        })
        outsider = _client(other_user["username"])
        m3 = outsider.get(f"{BASE_URL}/api/duels/{duel_id}/mt5")
        assert m3.status_code == 403
