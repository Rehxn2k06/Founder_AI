"""
Maneuver Voice Agent — Entry point.
LiveKit Agents v1.5+ API.
"""

import logging
from dotenv import load_dotenv
from livekit.agents import WorkerOptions, cli, JobContext, AgentSession

from agent import create_agent

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("maneuver.main")


async def entrypoint(ctx: JobContext):
    logger.info(f"Joining room: {ctx.room.name}")
    await ctx.connect()

    agent, lead_store = create_agent(ctx.room, ctx.room.name)
    session = AgentSession()

    # start() launches the session — do NOT await the return value
    # say() the greeting once the session is started via on_enter or after start
    await session.start(agent, room=ctx.room)

    await session.say(
        "Hey! I'm Jordan, founder of Maneuver. Thanks for swinging by. "
        "I'd love to hear a bit about what you're working on — "
        "what brings you here today?",
        allow_interruptions=True,
    )


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
