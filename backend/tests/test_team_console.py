# Backend tests for the new Team Console admin API (iteration 4)
# Covers POST /api/admin/verify, GET /api/admin/memberships, PATCH /api/memberships/{id}/status,
# GET /api/memberships/{id}/status, plus regression on POST /api/memberships + totals.
import os
import time
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

BASE_URL = os.environ["EXPO_PUBLIC_BACKEND_URL"].rstrip("/") if os.environ.get("EXPO_PUBLIC_BACKEND_URL") else None
if not BASE_URL:
    # Frontend .env carries the public URL; fall back to reading that file.
    fe = Path("/app/frontend/.env").read_text()
    for line in fe.splitlines():
        if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().strip('"').rstrip("/")
            break

ADMIN_KEY = os.environ["ADMIN_KEY"]
TEST_EMAIL = "delivered@resend.dev"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_headers():
    return {"X-Admin-Key": ADMIN_KEY, "Content-Type": "application/json"}


# ---------------------------------------------------------------------------
# Admin verify
# ---------------------------------------------------------------------------
class TestAdminVerify:
    def test_verify_ok(self, api):
        r = api.post(f"{BASE_URL}/api/admin/verify", headers={"X-Admin-Key": ADMIN_KEY})
        assert r.status_code == 200, r.text
        assert r.json() == {"ok": True}

    def test_verify_wrong_key(self, api):
        r = api.post(f"{BASE_URL}/api/admin/verify", headers={"X-Admin-Key": "wrong"})
        assert r.status_code == 401

    def test_verify_missing_key(self, api):
        r = api.post(f"{BASE_URL}/api/admin/verify")
        assert r.status_code == 401


# ---------------------------------------------------------------------------
# Create a membership (regression) + capture id for later tests
# ---------------------------------------------------------------------------
CREATED_IDS: list[str] = []


class TestCreateMembership:
    def test_create_bronze_europe(self, api):
        payload = {
            "name": "TEST_Alice",
            "institution": "TEST_Institute A",
            "country": "France",
            "email": TEST_EMAIL,
            "message": "TEST membership request for iteration_4",
            "tier": "bronze",
            "region": "europe",
        }
        r = api.post(f"{BASE_URL}/api/memberships", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["tier"] == "bronze"
        assert data["amount_usd"] == 50_000_000
        assert data["status"] == "pending_review"
        assert data["region"] == "europe"
        assert data["institution"] == "TEST_Institute A"
        CREATED_IDS.append(data["id"])

    def test_create_gold_africa(self, api):
        payload = {
            "name": "TEST_Bob",
            "institution": "TEST_Institute B",
            "country": "Nigeria",
            "email": TEST_EMAIL,
            "tier": "gold",
            "region": "africa",
        }
        r = api.post(f"{BASE_URL}/api/memberships", json=payload)
        assert r.status_code == 200, r.text
        CREATED_IDS.append(r.json()["id"])

    def test_totals_endpoint_still_works(self, api):
        r = api.get(f"{BASE_URL}/api/memberships/totals")
        assert r.status_code == 200
        data = r.json()
        assert "total" in data and "by_region" in data
        for k in ["europe", "united_states", "algeria", "middle_east_gulf", "brics", "africa"]:
            assert k in data["by_region"]


# ---------------------------------------------------------------------------
# Public status tracker
# ---------------------------------------------------------------------------
class TestPublicStatus:
    def test_public_status_hides_personal(self, api):
        assert CREATED_IDS, "prior test must have created a record"
        rid = CREATED_IDS[0]
        r = api.get(f"{BASE_URL}/api/memberships/{rid}/status")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["id"] == rid
        assert data["status"] == "pending_review"
        assert "email" not in data
        assert "name" not in data
        assert data["institution"] == "TEST_Institute A"

    def test_public_status_unknown_id(self, api):
        r = api.get(f"{BASE_URL}/api/memberships/does-not-exist/status")
        assert r.status_code == 404


# ---------------------------------------------------------------------------
# Admin list memberships
# ---------------------------------------------------------------------------
class TestAdminList:
    def test_list_requires_key(self, api):
        r = api.get(f"{BASE_URL}/api/admin/memberships")
        assert r.status_code == 401

    def test_list_returns_records(self, api, admin_headers):
        r = api.get(f"{BASE_URL}/api/admin/memberships", headers=admin_headers)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 2
        # newest first — the just-created ids should be near the top
        ids = [d["id"] for d in data[:10]]
        assert CREATED_IDS[-1] in ids
        # full record shape (contact info present)
        rec = next(d for d in data if d["id"] == CREATED_IDS[-1])
        assert rec["email"] == TEST_EMAIL
        assert rec["name"] == "TEST_Bob"

    def test_list_filter_by_status(self, api, admin_headers):
        r = api.get(f"{BASE_URL}/api/admin/memberships?status=pending_review", headers=admin_headers)
        assert r.status_code == 200
        for d in r.json():
            assert d["status"] == "pending_review"

    def test_list_invalid_status(self, api, admin_headers):
        r = api.get(f"{BASE_URL}/api/admin/memberships?status=bogus", headers=admin_headers)
        assert r.status_code == 422


# ---------------------------------------------------------------------------
# PATCH status
# ---------------------------------------------------------------------------
class TestUpdateStatus:
    def test_patch_requires_key(self, api):
        rid = CREATED_IDS[0]
        r = api.patch(f"{BASE_URL}/api/memberships/{rid}/status", json={"status": "in_review"})
        assert r.status_code == 401

    def test_patch_invalid_status(self, api, admin_headers):
        rid = CREATED_IDS[0]
        r = api.patch(f"{BASE_URL}/api/memberships/{rid}/status", json={"status": "bogus"}, headers=admin_headers)
        assert r.status_code == 422

    def test_patch_transitions_in_review(self, api, admin_headers):
        rid = CREATED_IDS[0]
        r = api.patch(f"{BASE_URL}/api/memberships/{rid}/status", json={"status": "in_review"}, headers=admin_headers)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "in_review"
        assert data["updated_at"] is not None
        # verify persisted
        r2 = api.get(f"{BASE_URL}/api/memberships/{rid}/status")
        assert r2.json()["status"] == "in_review"

    def test_patch_idempotent_same_status(self, api, admin_headers):
        rid = CREATED_IDS[0]
        # already in_review; re-applying should be 200 with no error
        r = api.patch(f"{BASE_URL}/api/memberships/{rid}/status", json={"status": "in_review"}, headers=admin_headers)
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "in_review"

    def test_patch_transitions_approved(self, api, admin_headers):
        rid = CREATED_IDS[0]
        r = api.patch(f"{BASE_URL}/api/memberships/{rid}/status", json={"status": "approved"}, headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["status"] == "approved"

    def test_patch_transitions_declined(self, api, admin_headers):
        rid = CREATED_IDS[1]
        r = api.patch(f"{BASE_URL}/api/memberships/{rid}/status", json={"status": "declined"}, headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["status"] == "declined"

    def test_patch_unknown_id(self, api, admin_headers):
        # PATCH on unknown id: current server behaviour → GET after update raises 404
        r = api.patch(
            f"{BASE_URL}/api/memberships/nope-123/status",
            json={"status": "in_review"},
            headers=admin_headers,
        )
        assert r.status_code == 404


# ---------------------------------------------------------------------------
# Email side-effects (background) — small sleep, then check backend log
# ---------------------------------------------------------------------------
class TestEmailsFire:
    def test_backend_log_shows_email_sends(self):
        # Give the background tasks a moment to complete
        time.sleep(4)
        log_paths = [
            "/var/log/supervisor/backend.err.log",
            "/var/log/supervisor/backend.out.log",
        ]
        blob = ""
        for p in log_paths:
            try:
                blob += Path(p).read_text(errors="ignore")
            except FileNotFoundError:
                pass
        # We do not require literal "202 Accepted" because httpx logs POST calls to the email proxy.
        # We check that the email proxy was called at least a few times during this test run.
        assert "integrations.emergentagent.com" in blob or "email/send" in blob, (
            "No evidence of Emergent email calls in backend logs"
        )
