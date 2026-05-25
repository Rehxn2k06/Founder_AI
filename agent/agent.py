"""
Core agent logic for the Maneuver "Talk to Founder" Voice Agent.
LiveKit Agents v1.5+ API.
"""

from __future__ import annotations
import json
import logging
import os
from pathlib import Path

from livekit import rtc
from livekit.agents import Agent
from livekit.plugins import openai, deepgram, silero

from lead_store import LeadStore
from tools import build_tools

logger = logging.getLogger("maneuver.agent")

# ─── Load Knowledge Base ─────────────────────────────────────────────────────

KB_PATH = Path(__file__).parent / "knowledge_base.md"
KNOWLEDGE_BASE = KB_PATH.read_text(encoding="utf-8")

# ─── System Prompt ────────────────────────────────────────────────────────────

def build_system_prompt() -> str:
    return f"""You are Jordan Casey, the founder of Maneuver — a product studio that helps ambitious founders and early-stage startups ship polished products fast.

You're having a real conversation with someone who just landed on the Maneuver website. Your two jobs:

**Job 1 — Run a discovery call (default mode)**
Lead a natural discovery conversation. You want to understand:
- Who this person is (name, role, company)
- What they're building or trying to solve
- Where they are (idea stage, MVP, scaling?)
- Team size and whether they have technical co-founders
- Timeline — is there a deadline, a fundraise, a launch event?
- Budget range they're working with

Don't run through these like a form. Ask one thing at a time. Branch based on what they say.

As you learn each piece of information, call `update_lead_field` immediately so it shows up in the lead panel.

**Job 2 — Answer questions about Maneuver (Q&A mode)**
If the visitor asks about Maneuver — services, pricing, process, team, case studies — answer from the knowledge base below. Be conversational, not like you're reading a brochure. After answering, naturally redirect back to understanding them.

When answering about Maneuver, use the visual layer tools:
- If they ask about services → call `show_services_slide`
- If they ask about a specific service → call `show_service_detail`
- If they ask about process/how you work → call `show_process_diagram`
- If they mention pricing/cost → call `show_pricing_slide`
- If they ask about a case study → call `show_case_study`

**Tone and style:**
- Talk like a founder: curious, direct, and conversational.
- ALWAYS respond with spoken text. You must NEVER stay silent. 
- After the user speaks, acknowledge what they said and ALWAYS ask a follow-up question to keep the conversation moving.
- If you call a tool (like update_lead_field), you MUST STILL speak a response to the user.
- Keep responses short and natural.
- End with warmth. When the conversation winds down, call `end_call` to save the lead.

**Knowledge Base:**
{KNOWLEDGE_BASE}
"""


# ─── RPC Forwarder ───────────────────────────────────────────────────────────

class RPCSender:
    """Forwards tool calls to the frontend via LiveKit RPC."""

    def __init__(self, room: rtc.Room):
        self._room = room

    async def __call__(self, method: str, payload: dict) -> None:
        participants = list(self._room.remote_participants.values())
        logger.info(f"RPC [{method}] → {[p.identity for p in participants]} payload={payload}")
        if not participants:
            logger.warning(f"RPC [{method}] has NO remote participants to send to!")
            return
        for participant in participants:
            try:
                await self._room.local_participant.perform_rpc(
                    destination_identity=participant.identity,
                    method=method,
                    payload=json.dumps(payload),
                )
                logger.info(f"RPC [{method}] sent OK to {participant.identity}")
            except Exception as e:
                logger.warning(f"RPC send failed ({method}) to {participant.identity}: {e}")


# ─── Agent Factory ───────────────────────────────────────────────────────────

def create_agent(room: rtc.Room, room_name: str) -> tuple[Agent, LeadStore]:
    lead_store = LeadStore(room_name)
    rpc_sender = RPCSender(room)
    tools = build_tools(lead_store, rpc_sender)

    agent = Agent(
        instructions=build_system_prompt(),
        stt=deepgram.STT(model="nova-3", language="en-US"),
        llm=openai.LLM(
            model="Meta-Llama-3.3-70B-Instruct",
            base_url="https://api.sambanova.ai/v1",
            api_key=os.environ.get("SAMBANOVA_API_KEY", ""),
            parallel_tool_calls=False,
            _strict_tool_schema=False
        ),
        tts=deepgram.TTS(),
        vad=silero.VAD.load(min_silence_duration=1.2),
        tools=tools,
        allow_interruptions=True,
    )
    return agent, lead_store
