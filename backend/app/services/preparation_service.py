from groq import Groq

from app.core.config import settings
from app.services.hindsight_service import recall_project_memory


client = Groq(api_key=settings.GROQ_API_KEY)


def generate_preparation(
    user_id: str,
    project_name: str,
    meetings_context: str,
    commitments_context: str,
) -> str:

    hindsight_result = recall_project_memory(
        user_id=user_id,
        query=f"""
        Prepare me for my next meeting about the {project_name} project.

        Retrieve and prioritize:
        - important historical project context
        - previous meeting concerns
        - unresolved issues
        - commitments and deadlines
        - client concerns
        - previous preparation feedback
        - what was missing from previous preparation
        - what the user explicitly asked the agent to focus on next time
        - lessons learned from previous preparation feedback

        If previous preparation feedback exists, give it high priority
        when deciding what the preparation should emphasize.
        """
    )

    memories = []

    if hindsight_result and hasattr(hindsight_result, "results") and hindsight_result.results:
        for memory in hindsight_result.results:
            text = getattr(memory, "text", None) or (memory.get("text") if isinstance(memory, dict) else str(memory))
            if text:
                memories.append(text)

    if memories:
        hindsight_context = "\n".join(
            f"- {memory}" for memory in memories
        )
    else:
        hindsight_context = "No previous Hindsight memory recorded yet."

    prompt = f"""
You are the preparation engine for RecallMeet.

Prepare the user for their next meeting.

Project:
{project_name}

Recent meeting information:
{meetings_context}

Current commitments:
{commitments_context}

Long-term project memory from Hindsight:
{hindsight_context}

Create a concise but useful preparation briefing.

Include exactly these sections:

1. Meeting Context
2. Key Things to Know
3. Open Issues
4. Commitments to Follow Up
5. Client Concerns
6. Questions to Ask
7. Recommended Focus

Important:
- Use only information supported by the supplied context.
- Do not invent facts.
- Prioritize unresolved issues and client concerns.
- Mention commitments that may need follow-up.
- Give special attention to previous preparation feedback.
- If previous feedback says something was missing, explicitly address it.
- If the user requested a specific focus for the next meeting, prioritize it.
- Make the preparation specific to this project.
- Do not mention Hindsight or the internal system.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content