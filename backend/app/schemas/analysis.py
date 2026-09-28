from pydantic import BaseModel


class MeetingAnalysisResponse(BaseModel):
    summary: str
    decisions: str
    unresolved_issues: str
    commitments: str