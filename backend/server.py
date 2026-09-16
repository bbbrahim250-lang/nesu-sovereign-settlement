from fastapi import FastAPI, APIRouter, HTTPException
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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------------------------------------------------------------------------
# Domain constants — canonical region keys and symbolic pledge tiers.
# ---------------------------------------------------------------------------
REGIONS = ["europe", "united_states", "algeria", "middle_east_gulf", "brics", "africa"]
TIERS = [100, 1000, 10000, 100000, 1000000]


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class PledgeCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    institution: str = Field(min_length=1, max_length=200)
    country: str = Field(min_length=1, max_length=200)
    email: EmailStr
    message: Optional[str] = Field(default=None, max_length=1000)
    tier: int
    region: str


class Pledge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    institution: str
    country: str
    email: str
    message: Optional[str] = None
    tier: int
    region: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    deleted_at: Optional[str] = None


class Certificate(BaseModel):
    id: str
    name: str
    institution: str
    region: str
    tier: int
    date: str


class Totals(BaseModel):
    total: int
    by_region: Dict[str, int]


@api_router.get("/")
async def root():
    return {"message": "NESU API"}


@api_router.get("/pledges/totals", response_model=Totals)
async def get_totals():
    by_region = {r: 0 for r in REGIONS}
    total = 0
    cursor = db.pledges.find({"deleted_at": None})
    async for doc in cursor:
        pledge = Pledge(**{k: v for k, v in doc.items() if k != "_id"})
        if pledge.region in by_region:
            by_region[pledge.region] += 1
        total += 1
    return Totals(total=total, by_region=by_region)


@api_router.post("/pledges", response_model=Certificate)
async def create_pledge(payload: PledgeCreate):
    if payload.region not in REGIONS:
        raise HTTPException(status_code=422, detail="Invalid region")
    if payload.tier not in TIERS:
        raise HTTPException(status_code=422, detail="Invalid tier")

    pledge = Pledge(
        name=payload.name.strip(),
        institution=payload.institution.strip(),
        country=payload.country.strip(),
        email=str(payload.email),
        message=(payload.message.strip() if payload.message else None),
        tier=payload.tier,
        region=payload.region,
    )
    await db.pledges.insert_one(pledge.model_dump())
    return Certificate(
        id=pledge.id,
        name=pledge.name,
        institution=pledge.institution,
        region=pledge.region,
        tier=pledge.tier,
        date=pledge.created_at,
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
