"""
Maneuver Voice Agent — Entry point.
LiveKit Agents v1.5+ API.
"""

import logging
from dotenv import load_dotenv
from livekit.agents import WorkerOptions, cli, JobContext, AgentSession

from agent import create_agent

load_dotenv()
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("maneuver.main")


async def entrypoint(ctx: JobContext):
    logger.info(f"Joining room: {ctx.room.name}")
    await ctx.connect()

    # Log who is in the room so we can verify RPC targets
    logger.info(f"Remote participants at connect: {list(ctx.room.remote_participants.keys())}")

    agent, lead_store = create_agent(ctx.room, ctx.room.name)
    session = AgentSession()

    await session.start(agent, room=ctx.room)

    # Log participants again after session starts
    logger.info(f"Remote participants after session start: {list(ctx.room.remote_participants.keys())}")

    await session.say(
        "Hey! I'm Jordan, founder of Maneuver. Thanks for swinging by. "
        "I'd love to hear a bit about what you're working on — "
        "what brings you here today?",
        allow_interruptions=True,
    )

    # Auto-save the lead when the session ends (even if end_call tool isn't called)
    @ctx.room.on("participant_disconnected")
    def on_participant_disconnected(participant):
        logger.info(f"Participant disconnected: {participant.identity} — auto-saving lead...")
        import asyncio
        asyncio.ensure_future(_auto_save(lead_store))


async def _auto_save(lead_store):
    try:
        path = await lead_store.save()
        logger.info(f"Lead auto-saved to: {path}")
    except Exception as e:
        logger.error(f"Failed to auto-save lead: {e}")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
