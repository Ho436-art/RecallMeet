from app.services.llm_service import analyze_transcript


transcript = """
Priya discussed the API integration requirements.

The client requested API documentation before the next meeting.

Harini agreed to send the API documentation by September 30, 2026.

The team still needs to resolve the authentication flow.

The client also raised concerns about the project timeline.
"""


result = analyze_transcript(transcript)

print("\n===== AI ANALYSIS =====\n")
print(result)