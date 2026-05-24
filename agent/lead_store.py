import json
import os
import asyncio
from datetime import datetime
from pathlib import Path

LEADS_DIR = Path(__file__).parent.parent / "leads"
LEADS_DIR.mkdir(exist_ok=True)

class LeadStore:
    """Holds discovery data captured during a single call and persists it at the end."""

    FIELDS = [
        "name",
        "company",
        "role",
        "problem",
        "current_solution",
        "timeline",
        "budget",
        "team_size",
        "stage",          # idea / MVP / scaling / etc.
        "notes",
    ]

    def __init__(self, room_name: str):
        self.room_name = room_name
        self.session_id = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        self.data: dict = {field: None for field in self.FIELDS}
        self.transcript: list[dict] = []

    def update_field(self, field: str, value: str) -> None:
        """Update a single discovery field (called by LLM tool)."""
        if field in self.FIELDS:
            self.data[field] = value

    def add_transcript_line(self, role: str, text: str) -> None:
        self.transcript.append({
            "role": role,
            "text": text,
            "ts": datetime.utcnow().isoformat(),
        })

    def get_filled_fields(self) -> dict:
        return {k: v for k, v in self.data.items() if v is not None}

    async def save(self) -> Path:
        """Persist lead data + transcript to a JSON file."""
        payload = {
            "session_id": self.session_id,
            "room_name": self.room_name,
            "captured_at": datetime.utcnow().isoformat(),
            "lead": self.data,
            "transcript": self.transcript,
        }
        out_path = LEADS_DIR / f"{self.session_id}_{self.room_name}.json"
        await asyncio.to_thread(_write_json, out_path, payload)
        return out_path


def _write_json(path: Path, payload: dict) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
