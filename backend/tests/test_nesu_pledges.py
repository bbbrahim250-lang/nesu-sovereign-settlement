"""NESU backend API tests: totals + pledges endpoints."""
import os
import uuid
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

# Load frontend .env so we test the same public URL the app uses
load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")

BASE_URL = os.environ["EXPO_PUBLIC_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

REGIONS = ["europe", "united_states", "algeria", "middle_east_gulf", "brics", "africa"]
TIERS = [100, 1000, 10000, 100000, 1000000]


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _valid_payload(region="europe", tier=100, email=None):
    tag = uuid.uuid4().hex[:8]
    return {
        "name": f"TEST_User_{tag}",
        "institution": f"TEST_Inst_{tag}",
        "country": "TEST_Country",
        "email": email or f"test_{tag}@example.com",
        "tier": tier,
        "region": region,
        "message": "TEST_message",
    }


# ---------- health / root ----------
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("message") == "NESU API"


# ---------- GET /api/pledges/totals ----------
class TestTotalsShape:
    def test_totals_schema_and_regions(self, client):
        r = client.get(f"{API}/pledges/totals")
        assert r.status_code == 200
        data = r.json()
        assert "total" in data and "by_region" in data
        assert isinstance(data["total"], int)
        assert isinstance(data["by_region"], dict)
        assert set(data["by_region"].keys()) == set(REGIONS)
        for v in data["by_region"].values():
            assert isinstance(v, int) and v >= 0


# ---------- POST /api/pledges validation ----------
class TestPledgeValidation:
    def test_invalid_region(self, client):
        p = _valid_payload()
        p["region"] = "atlantis"
        r = client.post(f"{API}/pledges", json=p)
        assert r.status_code == 422, r.text

    def test_invalid_tier(self, client):
        p = _valid_payload()
        p["tier"] = 42
        r = client.post(f"{API}/pledges", json=p)
        assert r.status_code == 422, r.text

    def test_invalid_email(self, client):
        p = _valid_payload(email="not-an-email")
        r = client.post(f"{API}/pledges", json=p)
        assert r.status_code == 422, r.text

    def test_missing_required(self, client):
        r = client.post(f"{API}/pledges", json={"name": "x"})
        assert r.status_code == 422


# ---------- POST /api/pledges happy path + increment ----------
class TestPledgeCreationIncrements:
    @pytest.mark.parametrize("region", REGIONS)
    def test_create_increments_region(self, client, region):
        before = client.get(f"{API}/pledges/totals").json()
        pre_total = before["total"]
        pre_region = before["by_region"][region]

        payload = _valid_payload(region=region, tier=1000)
        r = client.post(f"{API}/pledges", json=payload)
        assert r.status_code == 200, r.text
        cert = r.json()

        # Certificate schema
        for k in ("id", "name", "institution", "region", "tier", "date"):
            assert k in cert, f"missing {k} in certificate"
        assert cert["region"] == region
        assert cert["tier"] == 1000
        assert cert["name"] == payload["name"]
        assert cert["institution"] == payload["institution"]

        after = client.get(f"{API}/pledges/totals").json()
        assert after["total"] == pre_total + 1
        assert after["by_region"][region] == pre_region + 1
        # Other regions unchanged
        for r_key in REGIONS:
            if r_key == region:
                continue
            assert after["by_region"][r_key] == before["by_region"][r_key]

    def test_totals_persist_across_requests(self, client):
        # Two separate GET calls must reflect same DB, not per-session state
        a = client.get(f"{API}/pledges/totals").json()
        # Fresh session
        b = requests.get(f"{API}/pledges/totals").json()
        assert a == b
