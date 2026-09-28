from uuid import UUID

from pydantic import BaseModel


class PreparationResponse(BaseModel):
    project_id: UUID
    project_name: str
    preparation: str