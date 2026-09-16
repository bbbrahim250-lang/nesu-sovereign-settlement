from fastapi import FastAPI, APIRouter, BackgroundTasks, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from emailer import send_membership_emails  # noqa: E402  (needs .env loaded first)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------------------------------------------------------------------------
# Domain constants — canonical region keys and membership tiers (USD).
# Fees are settled off-app (wire transfer under a signed agreement); the app
# only records the membership request.
# ---------------------------------------------------------------------------
REGIONS = ["europe", "united_states", "algeria", "middle_east_gulf", "brics", "africa"]
TIERS = {
    "bronze": 50_000_000,
    "silver": 250_000_000,
    "gold": 500_000_000,
    "diamond": 1_000_000_000,
    "platinum": 10_000_000_000,
}


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class MembershipCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    institution: str = Field(min_length=1, max_length=200)
    country: str = Field(min_length=1, max_length=200)
    email: EmailStr
    message: Optional[str] = Field(default=None, max_length=1000)
    tier: str
    region: str


class Membership(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    institution: str
    country: str
    email: str
    message: Optional[str] = None
    tier: str
    amount_usd: int
    region: str
    status: str = "pending_review"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    deleted_at: Optional[str] = None


class Certificate(BaseModel):
    id: str
    name: str
    institution: str
    region: str
    tier: str
    amount_usd: int
    status: str
    date: str


class Totals(BaseModel):
    total: int
    by_region: Dict[str, int]


@api_router.get("/")
async def root():
    return {"message": "NESU API"}


@api_router.get("/memberships/totals", response_model=Totals)
async def get_totals():
    by_region = {r: 0 for r in REGIONS}
    total = 0
    cursor = db.memberships.find({"deleted_at": None}, {"_id": 0, "region": 1})
    async for doc in cursor:
        if doc.get("region") in by_region:
            by_region[doc["region"]] += 1
        total += 1
    return Totals(total=total, by_region=by_region)


@api_router.post("/memberships", response_model=Certificate)
async def create_membership(payload: MembershipCreate, background: BackgroundTasks):
    if payload.region not in REGIONS:
        raise HTTPException(status_code=422, detail="Invalid region")
    if payload.tier not in TIERS:
        raise HTTPException(status_code=422, detail="Invalid tier")

    membership = Membership(
        name=payload.name.strip(),
        institution=payload.institution.strip(),
        country=payload.country.strip(),
        email=str(payload.email),
        message=(payload.message.strip() if payload.message else None),
        tier=payload.tier,
        amount_usd=TIERS[payload.tier],
        region=payload.region,
    )
    await db.memberships.insert_one(membership.model_dump())
    # Confirmation to the applicant + notification to the institutional team,
    # sent after the response so a mail outage never blocks the request.
    background.add_task(send_membership_emails, membership.model_dump())
    return Certificate(
        id=membership.id,
        name=membership.name,
        institution=membership.institution,
        region=membership.region,
        tier=membership.tier,
        amount_usd=membership.amount_usd,
        status=membership.status,
        date=membership.created_at,
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
