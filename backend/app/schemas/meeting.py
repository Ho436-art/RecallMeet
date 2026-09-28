from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class MeetingResponse(BaseModel):
    id: UUID
    project_id: UUID
    title: str
    meeting_date: date
    transcript: str
    summary: str | None
    decisions: str | None
    unresolved_issues: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }