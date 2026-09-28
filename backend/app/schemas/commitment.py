from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class CommitmentResponse(BaseModel):
    id: UUID
    project_id: UUID
    meeting_id: UUID
    description: str
    owner_name: str
    due_date: date | None
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }