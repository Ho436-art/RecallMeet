import json

from groq import Groq

from app.core.config import settings


client = Groq(
    api_key=settings.GROQ_API_KEY
)


def analyze_transcript(transcript: str) -> dict:
    prompt = f"""
You are the meeting intelligence engine for RecallMeet.

Analyze this meeting transcript.

Return ONLY valid JSON.
Do not use Markdown.
Do not add explanations outside the JSON.

Use exactly this structure:

{{
  "summary": "string",
  "decisions": ["string"],
  "unresolved_issues": ["string"],
  "commitments": [
    {{
      "owner_name": "string",
      "description": "string",
      "due_date": "YYYY-MM-DD or null"
    }}
  ]
}}

Rules:
- Extract only information supported by the transcript.
- If there are no decisions, return an empty array.
- If there are no unresolved issues, return an empty array.
- If there are no commitments, return an empty array.
- Use null when a commitment has no clearly stated due date.
- Do not invent owners, dates, decisions, or commitments.

Meeting transcript:

{transcript}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1
    )

    content = response.choices[0].message.content

    return json.loads(content)