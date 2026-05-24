"""
Tool definitions for the Maneuver Voice Agent — LiveKit Agents v1.5+ API.

Each tool is a plain async function decorated with @llm.function_tool.
The tools are created as closures that capture lead_store and rpc_sender.
"""

from __future__ import annotations
from livekit.agents import llm


def build_tools(lead_store, rpc_sender) -> list:
    """Create and return all tool functions bound to the given lead_store and rpc_sender."""

    # ─── Visual Layer Tools ──────────────────────────────────────────────────

    @llm.function_tool(description="Show the overview slide listing all of Maneuver's services. Call this when the user asks what Maneuver does or what services are offered.")
    async def show_services_slide():
        """Show the services overview card grid on the frontend."""
        await rpc_sender("show_services_slide", {})
        return "Services slide displayed."

    @llm.function_tool(description="Zoom into the detail view for a specific Maneuver service. service_name must be one of: 'Product Sprint', 'Design Sprint', 'Fractional CTO', 'Scale & Iteration'.")
    async def show_service_detail(service_name: str):
        """Show detailed information card for a specific service."""
        await rpc_sender("show_service_detail", {"service": service_name})
        return f"Service detail for {service_name} displayed."

    @llm.function_tool(description="Show Maneuver's delivery process as a visual step diagram. Call this when the user asks about the process, how we work, or how a project runs.")
    async def show_process_diagram():
        """Trigger the process step diagram on the frontend."""
        await rpc_sender("show_process_diagram", {})
        return "Process diagram displayed."

    @llm.function_tool(description="Show a case study card for one of Maneuver's past projects. client_name must be one of: 'Koda', 'Lightpath', 'Fleck'.")
    async def show_case_study(client_name: str):
        """Show a case study card on the frontend."""
        await rpc_sender("show_case_study", {"client": client_name})
        return f"Case study for {client_name} displayed."

    @llm.function_tool(description="Show the pricing overview slide when the user asks about cost, pricing, or budget ranges.")
    async def show_pricing_slide():
        """Show pricing overview on the frontend."""
        await rpc_sender("show_pricing_slide", {})
        return "Pricing slide displayed."

    # ─── Lead Capture Tools ──────────────────────────────────────────────────

    @llm.function_tool(
        description=(
            "Update a specific field in the lead/discovery record as you learn information. "
            "Call this as soon as you learn a piece of info — don't wait for the end. "
            "field must be one of: name, company, role, problem, current_solution, timeline, budget, team_size, stage, notes. "
            "value is what the user said."
        )
    )
    async def update_lead_field(field: str, value: str):
        """Capture a discovery field value and push it to the live lead panel."""
        lead_store.update_field(field, value)
        await rpc_sender("update_lead_field", {"field": field, "value": value})
        return f"Captured {field}: {value}"

    @llm.function_tool(description="Mark the discovery call as complete and trigger lead persistence. Call this when the conversation naturally wraps up or the user says goodbye.")
    async def end_call():
        """Finalize and save the lead record."""
        path = await lead_store.save()
        await rpc_sender("call_ended", {"lead": lead_store.get_filled_fields()})
        return f"Lead saved to {path}. Thanks for the conversation!"

    return [
        show_services_slide,
        show_service_detail,
        show_process_diagram,
        show_case_study,
        show_pricing_slide,
        update_lead_field,
        end_call,
    ]
