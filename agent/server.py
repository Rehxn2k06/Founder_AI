"""
FastAPI server that:
1. Issues LiveKit tokens for the frontend to join a room
2. Serves the captured leads via a /leads endpoint
"""

import json
import os
from pathlib import Path
from datetime import timedelta

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from livekit.api import AccessToken, VideoGrants
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Maneuver Voice Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LEADS_DIR = Path(__file__).parent.parent / "leads"
LEADS_DIR.mkdir(exist_ok=True)


class TokenRequest(BaseModel):
    room_name: str = "maneuver-room"
    participant_name: str = "visitor"


@app.post("/token")
async def create_token(req: TokenRequest):
    """Issue a LiveKit access token for the frontend participant."""
    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    livekit_url = os.getenv("LIVEKIT_URL")

    if not all([api_key, api_secret, livekit_url]):
        raise HTTPException(status_code=500, detail="LiveKit credentials not configured")

    token = (
        AccessToken(api_key, api_secret)
        .with_identity(req.participant_name)
        .with_name(req.participant_name)
        .with_grants(VideoGrants(room_join=True, room=req.room_name))
        .with_ttl(timedelta(hours=2))
        .to_jwt()
    )

    return {"token": token, "url": livekit_url, "room": req.room_name}


@app.get("/leads")
async def list_leads():
    """Return all captured leads."""
    leads = []
    for path in sorted(LEADS_DIR.glob("*.json"), reverse=True):
        with open(path, encoding="utf-8") as f:
            leads.append(json.load(f))
    return JSONResponse(content=leads)


@app.get("/leads/{session_id}")
async def get_lead(session_id: str):
    """Return a specific lead by session ID prefix."""
    for path in LEADS_DIR.glob(f"{session_id}*.json"):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Lead not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
