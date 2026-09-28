from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.prep_feedback import PrepFeedback
from app.models.project import Project
from app.models.user import User
from app.schemas.feedback import (
    PrepFeedbackCreate,
    PrepFeedbackResponse,
)
from app.services.hindsight_service import store_project_memory

router = APIRouter(
    prefix="/projects",
    tags=["Prep Feedback"]
)


@router.post(
    "/{project_id}/feedback",
    response_model=PrepFeedbackResponse,
    status_code=status.HTTP_201_CREATED
)
def submit_prep_feedback(
    project_id: UUID,
    feedback: PrepFeedbackCreate,
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

    # Store feedback in PostgreSQL
    feedback_record = PrepFeedback(
        user_id=current_user.id,
        project_id=project.id,
        usefulness_rating=feedback.usefulness_rating,
        what_was_useful=feedback.what_was_useful,
        what_was_missing=feedback.what_was_missing,
        focus_next_time=feedback.focus_next_time
    )

    db.add(feedback_record)
    db.commit()
    db.refresh(feedback_record)

    # Convert feedback into long-term Hindsight memory
    memory_content = f"""
RecallMeet prep feedback for project: {project.name}
Project ID: {project.id}

Preparation usefulness rating:
{feedback.usefulness_rating}/5

What was useful:
{feedback.what_was_useful or "Not provided"}

What was missing:
{feedback.what_was_missing or "Not provided"}

What the agent should focus on next time:
{feedback.focus_next_time or "Not provided"}

This is user feedback about how future meeting preparation
for this project should be improved.
"""

    store_project_memory(
        user_id=current_user.id,
        content=memory_content,
        context=f"Prep feedback for {project.name}"
    )

    return feedback_record