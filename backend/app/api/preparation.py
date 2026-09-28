from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.commitment import Commitment
from app.models.meeting import Meeting
from app.models.project import Project
from app.models.user import User
from app.schemas.preparation import PreparationResponse
from app.services.preparation_service import generate_preparation


router = APIRouter(
    prefix="/projects",
    tags=["Preparation"]
)


@router.post(
    "/{project_id}/prepare",
    response_model=PreparationResponse
)
def prepare_for_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project belongs to current user
    project = db.scalar(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id
        )
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Get recent meetings for this project
    meetings = db.scalars(
        select(Meeting)
        .where(
            Meeting.project_id == project_id,
            Meeting.user_id == current_user.id
        )
        .order_by(Meeting.meeting_date.desc())
        .limit(5)
    ).all()

    # Get commitments for this project
    commitments = db.scalars(
        select(Commitment)
        .where(
            Commitment.project_id == project_id,
            Commitment.user_id == current_user.id
        )
        .order_by(Commitment.due_date.asc())
    ).all()

    # Build meeting context
    meetings_context_parts = []

    for meeting in meetings:
        meetings_context_parts.append(
            f"""
Meeting: {meeting.title}
Date: {meeting.meeting_date}

Summary:
{meeting.summary or "No summary available"}

Decisions:
{meeting.decisions or "None recorded"}

Unresolved Issues:
{meeting.unresolved_issues or "None recorded"}
"""
        )

    meetings_context = "\n".join(meetings_context_parts)

    if not meetings_context:
        meetings_context = "No previous meetings available."

    # Build commitment context
    commitments_context_parts = []

    for commitment in commitments:
        commitments_context_parts.append(
            f"""
- {commitment.description}
  Owner: {commitment.owner_name}
  Due date: {commitment.due_date or "No due date"}
  Status: {commitment.status}
"""
        )

    commitments_context = "\n".join(commitments_context_parts)

    if not commitments_context:
        commitments_context = "No commitments recorded."

    # Generate personalized preparation
    preparation = generate_preparation(
        user_id=str(current_user.id),
        project_name=project.name,
        meetings_context=meetings_context,
        commitments_context=commitments_context
    )

    return PreparationResponse(
        project_id=project.id,
        project_name=project.name,
        preparation=preparation
    )