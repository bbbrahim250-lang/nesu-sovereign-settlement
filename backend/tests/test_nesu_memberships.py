"""Backend tests for NESU Membership endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://nesu-settlement.preview.emergentagent.com").rstrip("/")

VALID_TIERS = {
    "bronze": 50_000_000,
    "silver": 250_000_000,
    "gold": 500_000_000,
    "diamond": 1_000_000_000,
    "platinum": 10_000_000_000,
}
VALID_REGIONS = ["europe", "united_states", "algeria", "middle_east_gulf", "brics", "africa"]

created_ids: list[str] = []


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Totals endpoint ---
class TestTotals:
    def test_totals_ok(self, api):
        r = api.get(f"{BASE_URL}/api/memberships/totals")
        assert r.status_code == 200
        data = r.json()
        assert "total" in data and "by_region" in data
        for k in VALID_REGIONS:
            assert k in data["by_region"], f"missing region {k}"
        assert isinstance(data["total"], int)


# --- Membership creation: all tiers + amount_usd values ---
class TestMembershipCreate:
    @pytest.mark.parametrize("tier,amount", list(VALID_TIERS.items()))
    def test_create_each_tier(self, api, tier, amount):
        payload = {
            "name": f"TEST_{tier}_user",
            "institution": "TEST Institute",
            "country": "Testland",
            "email": f"test_{tier}@example.com",
            "message": "TEST",
            "tier": tier,
            "region": "europe",
        }
        r = api.post(f"{BASE_URL}/api/memberships", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["tier"] == tier
        assert data["amount_usd"] == amount
        assert data["status"] == "pending_review"
        assert data["name"] == payload["name"]
        assert data["institution"] == payload["institution"]
        assert data["region"] == "europe"
        assert "id" in data and "date" in data
        created_ids.append(data["id"])


# --- Totals increment after POST ---
class TestTotalsIncrement:
    def test_totals_increment_per_region(self, api):
        before = api.get(f"{BASE_URL}/api/memberships/totals").json()
        region = "africa"
        payload = {
            "name": "TEST_region_inc",
            "institution": "TEST",
            "country": "TX",
            "email": "inc@example.com",
            "tier": "bronze",
            "region": region,
        }
        r = api.post(f"{BASE_URL}/api/memberships", json=payload)
        assert r.status_code == 200
        created_ids.append(r.json()["id"])
        after = api.get(f"{BASE_URL}/api/memberships/totals").json()
        assert after["total"] == before["total"] + 1
        assert after["by_region"][region] == before["by_region"][region] + 1


# --- Validation failures (422) ---
class TestValidation:
    def _base(self, **over):
        p = {
            "name": "TEST_val",
            "institution": "I",
            "country": "C",
            "email": "val@example.com",
            "tier": "bronze",
            "region": "europe",
        }
        p.update(over)
        return p

    def test_invalid_tier_string(self, api):
        r = api.post(f"{BASE_URL}/api/memberships", json=self._base(tier="gold2"))
        assert r.status_code == 422

    def test_numeric_tier(self, api):
        r = api.post(f"{BASE_URL}/api/memberships", json=self._base(tier=1))
        assert r.status_code == 422

    def test_invalid_region(self, api):
        r = api.post(f"{BASE_URL}/api/memberships", json=self._base(region="mars"))
        assert r.status_code == 422

    def test_invalid_email(self, api):
        r = api.post(f"{BASE_URL}/api/memberships", json=self._base(email="not-an-email"))
        assert r.status_code == 422

    def test_missing_required(self, api):
        r = api.post(f"{BASE_URL}/api/memberships", json={"tier": "bronze", "region": "europe"})
        assert r.status_code == 422


# --- Old pledge endpoints must be gone ---
class TestOldPledgesRemoved:
    def test_pledges_get_gone(self, api):
        r = api.get(f"{BASE_URL}/api/pledges")
        assert r.status_code == 404

    def test_pledges_totals_gone(self, api):
        r = api.get(f"{BASE_URL}/api/pledges/totals")
        assert r.status_code == 404

    def test_pledges_post_gone(self, api):
        r = api.post(f"{BASE_URL}/api/pledges", json={})
        assert r.status_code == 404
