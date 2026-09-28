from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.commitment import Commitment
from app.models.user import User
from app.schemas.commitment import CommitmentResponse


router = APIRouter(
    prefix="/commitments",
    tags=["Commitments"]
)


# --------------------------------------------------
# GET ALL COMMITMENTS FOR CURRENT USER
# --------------------------------------------------

@router.get(
    "",
    response_model=list[CommitmentResponse]
)
def get_commitments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    commitments = db.scalars(
        select(Commitment)
        .where(
            Commitment.user_id == current_user.id
        )
        .order_by(
            Commitment.due_date.asc()
        )
    ).all()

    return commitments


# --------------------------------------------------
# GET COMMITMENTS FOR A PROJECT
# --------------------------------------------------

@router.get(
    "/project/{project_id}",
    response_model=list[CommitmentResponse]
)
def get_project_commitments(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    commitments = db.scalars(
        select(Commitment).where(
            Commitment.project_id == project_id,
            Commitment.user_id == current_user.id
        ).order_by(
            Commitment.due_date.asc()
        )
    ).all()

    return commitments


# --------------------------------------------------
# UPDATE COMMITMENT STATUS
# --------------------------------------------------

@router.patch(
    "/{commitment_id}/status",
    response_model=CommitmentResponse
)
def update_commitment_status(
    commitment_id: UUID,
    new_status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    allowed_statuses = {
        "pending",
        "in_progress",
        "completed"
    }

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid status. Use: "
                "pending, in_progress, completed"
            )
        )

    commitment = db.scalar(
        select(Commitment).where(
            Commitment.id == commitment_id,
            Commitment.user_id == current_user.id
        )
    )

    if not commitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commitment not found"
        )

    commitment.status = new_status

    db.commit()
    db.refresh(commitment)

    return commitment