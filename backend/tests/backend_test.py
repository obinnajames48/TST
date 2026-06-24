"""Backend tests for THE SELECT TRADERS — iteration 3 (MT5 + admin matches/settlements + affiliates)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://build-continue-27.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@selecttraders.com"
ADMIN_PASSWORD = "admin-2026"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(client):
    r = client.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def admin_client(client, admin_token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"})
    return s


@pytest.fixture(scope="session")
def spawned_duel(client):
    """Spawn a 5K duel as TradeFury to use across MT5 tests."""
    r = client.post(f"{BASE_URL}/api/duels/spawn", json={"account_size": 5000},
                    headers={"X-Username": "TradeFury"})
    assert r.status_code == 200, r.text
    return r.json()


# ---------- Health ----------
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_me_default_user(self, client):
        r = client.get(f"{BASE_URL}/api/me")
        assert r.status_code == 200
        assert r.json()["username"] == "TradeFury"


# ---------- Duel get returns new MT5 / login fields ----------
class TestDuelMT5Fields:
    def test_get_duel_returns_mt5_fields(self, client, spawned_duel):
        did = spawned_duel["duel_id"]
        r = client.get(f"{BASE_URL}/api/duels/{did}", headers={"X-Username": "TradeFury"})
        assert r.status_code == 200, r.text
        data = r.json()
        for k in ("started_at", "login_confirmed_a", "login_confirmed_b", "trading_started_at"):
            assert k in data, f"missing key {k}"
        assert data["login_confirmed_a"] in (None, "")  # not yet confirmed
        assert data["login_confirmed_b"] in (None, "")
        assert data["trading_started_at"] in (None, "")
        assert data["started_at"]


# ---------- MT5 credentials endpoint ----------
class TestMT5Credentials:
    def test_mt5_creds_for_participant(self, client, spawned_duel):
        did = spawned_duel["duel_id"]
        r = client.get(f"{BASE_URL}/api/duels/{did}/mt5", headers={"X-Username": "TradeFury"})
        assert r.status_code == 200, r.text
        creds = r.json()
        assert set(creds.keys()) >= {"login", "password", "server", "platform"}
        assert creds["platform"] == "MetaTrader 5"
        assert isinstance(creds["login"], str) and len(creds["login"]) >= 6
        assert len(creds["password"]) == 10
        assert "SelectTraders-Live" in creds["server"]

    def test_mt5_deterministic(self, client, spawned_duel):
        did = spawned_duel["duel_id"]
        r1 = client.get(f"{BASE_URL}/api/duels/{did}/mt5", headers={"X-Username": "TradeFury"}).json()
        r2 = client.get(f"{BASE_URL}/api/duels/{did}/mt5", headers={"X-Username": "TradeFury"}).json()
        assert r1 == r2

    def test_mt5_forbidden_for_non_participant(self, client, spawned_duel):
        # Use a different seeded user as spectator
        users = client.get(f"{BASE_URL}/api/admin/users",
                          headers={"Authorization": "Bearer admin-secret-token-2026"}).json()
        outsider = next((u["username"] for u in users
                         if u["username"] not in ("TradeFury",
                                                  spawned_duel.get("opponent_username", ""))), None)
        assert outsider, "Could not find a non-participant user"
        r = client.get(f"{BASE_URL}/api/duels/{spawned_duel['duel_id']}/mt5",
                       headers={"X-Username": outsider})
        assert r.status_code == 403, f"Expected 403, got {r.status_code}: {r.text}"

    def test_mt5_404_unknown_duel(self, client):
        r = client.get(f"{BASE_URL}/api/duels/does-not-exist/mt5",
                       headers={"X-Username": "TradeFury"})
        assert r.status_code == 404


# ---------- Confirm login persists ----------
class TestConfirmLogin:
    def test_confirm_login_persists(self, client, spawned_duel):
        did = spawned_duel["duel_id"]
        r = client.post(f"{BASE_URL}/api/duels/{did}/confirm-login",
                        headers={"X-Username": "TradeFury"})
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["ok"] is True

        # GET to verify persistence
        d = client.get(f"{BASE_URL}/api/duels/{did}", headers={"X-Username": "TradeFury"}).json()
        # TradeFury is trader_a in spawn flow
        assert d["login_confirmed_a"], "login_confirmed_a not persisted"

    def test_confirm_login_404(self, client):
        r = client.post(f"{BASE_URL}/api/duels/nope/confirm-login",
                        headers={"X-Username": "TradeFury"})
        assert r.status_code == 404


# ---------- Admin duels list returns MT5 fields ----------
class TestAdminDuelsMT5:
    def test_admin_duels_has_mt5_fields(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/admin/duels")
        assert r.status_code == 200, r.text
        duels = r.json()
        assert isinstance(duels, list) and len(duels) > 0
        sample = duels[0]
        for k in ("started_at", "login_confirmed_a", "login_confirmed_b", "trading_started_at"):
            assert k in sample, f"missing {k}"

    def test_admin_matches_by_status_groups(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/admin/matches-by-status")
        assert r.status_code == 200, r.text
        data = r.json()
        for product in ("duels", "royale", "tournament"):
            assert product in data
            for status in ("active", "inactive", "completed"):
                assert status in data[product]
                assert isinstance(data[product][status], list)


# ---------- Admin settlements ----------
class TestAdminSettlements:
    def test_list_settlements(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/admin/settlements")
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 2  # at least the mocked extras
        sample = items[0]
        for k in ("id", "kind", "status", "trader_a", "trader_b",
                  "account_size", "prize", "winner"):
            assert k in sample, f"missing {k}"

    def test_settlement_detail_mock(self, admin_client):
        # Use mocked id from list
        items = admin_client.get(f"{BASE_URL}/api/admin/settlements").json()
        target = next((i for i in items if i["id"].startswith(("R-", "T-"))), None)
        if target:
            r = admin_client.get(f"{BASE_URL}/api/admin/settlements/{target['id']}")
            assert r.status_code == 200
            data = r.json()
            assert "summary" in data


# ---------- Open Duels (pairing only) ----------
class TestOpenDuels:
    def test_open_duels_returns_only_pairing(self, client):
        r = client.get(f"{BASE_URL}/api/duels/open", headers={"X-Username": "TradeFury"})
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        for d in items:
            assert d.get("status") == "pairing", f"Open duel has non-pairing status: {d.get('status')}"

    def test_open_duels_separate_from_live(self, client):
        opens = client.get(f"{BASE_URL}/api/duels/open", headers={"X-Username": "TradeFury"}).json()
        lives = client.get(f"{BASE_URL}/api/duels/live", headers={"X-Username": "TradeFury"}).json()
        open_ids = {d["id"] for d in opens}
        live_ids = {d["id"] for d in lives}
        assert open_ids.isdisjoint(live_ids), "Same duel appears in both lanes"


# ---------- Trading Station ----------
class TestTradingStation:
    def test_station_returns_grouped(self, client):
        r = client.get(f"{BASE_URL}/api/me/trading-station",
                       headers={"X-Username": "TradeFury"})
        assert r.status_code == 200, r.text
        data = r.json()
        assert set(data.keys()) == {"active", "pending", "completed"}
        for k in ("active", "pending", "completed"):
            assert isinstance(data[k], list)

    def test_station_active_contains_live_duels(self, client, spawned_duel):
        # spawned_duel was a live duel created for TradeFury
        data = client.get(f"{BASE_URL}/api/me/trading-station",
                          headers={"X-Username": "TradeFury"}).json()
        active_ids = {r["id"] for r in data["active"]}
        assert spawned_duel["duel_id"] in active_ids, \
            f"Spawned live duel {spawned_duel['duel_id']} not in active station rows"

    def test_station_row_schema(self, client):
        data = client.get(f"{BASE_URL}/api/me/trading-station",
                          headers={"X-Username": "TradeFury"}).json()
        rows = data["active"] + data["pending"] + data["completed"]
        assert len(rows) > 0, "Station has no rows for TradeFury"
        sample = rows[0]
        for k in ("id", "kind", "label", "status", "link"):
            assert k in sample, f"missing key {k} in station row"
        assert sample["link"].startswith("/app/")


# ---------- Landing affiliate (public via me) ----------
class TestAffiliate:
    def test_me_affiliate(self, client):
        r = client.get(f"{BASE_URL}/api/me/affiliate", headers={"X-Username": "TradeFury"})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "tiers" in data and len(data["tiers"]) == 4
        names = [t["name"] for t in data["tiers"]]
        assert names == ["Rookie", "Pro", "Elite", "Legend"]
        assert data["ref_code"]
        assert data["tier"]["name"] in names
