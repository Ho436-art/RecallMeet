from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class PrepFeedbackCreate(BaseModel):
    usefulness_rating: int = Field(ge=1, le=5)
    what_was_useful: str | None = None
    what_was_missing: str | None = None
    focus_next_time: str | None = None


class PrepFeedbackResponse(BaseModel):
    id: UUID
    project_id: UUID
    usefulness_rating: int
    what_was_useful: str | None
    what_was_missing: str | None
    focus_next_time: str | None
    created_at: datetime

    model_config = {"from_attributes": True}