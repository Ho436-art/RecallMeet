import json
from datetime import date
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.commitment import Commitment
from app.models.meeting import Meeting
from app.models.project import Project
from app.models.user import User
from app.schemas.analysis import MeetingAnalysisResponse
from app.schemas.meeting import MeetingResponse
from app.services.llm_service import analyze_transcript


router = APIRouter(
    prefix="/meetings",
    tags=["Meetings"]
)


# --------------------------------------------------
# CREATE MEETING
# --------------------------------------------------

@router.post(
    "",
    response_model=MeetingResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_meeting(
    project_id: UUID = Form(...),
    title: str = Form(...),
    meeting_date: date = Form(...),
    transcript_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.scalar(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id
        )
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    transcript_bytes = await transcript_file.read()

    try:
        transcript = transcript_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcript file must be a UTF-8 text file"
        )

    if not transcript.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcript file cannot be empty"
        )

    meeting = Meeting(
        user_id=current_user.id,
        project_id=project_id,
        title=title,
        meeting_date=meeting_date,
        transcript=transcript
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return meeting


# --------------------------------------------------
# GET ALL MEETINGS
# --------------------------------------------------

@router.get(
    "",
    response_model=list[MeetingResponse]
)
def get_meetings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    meetings = db.scalars(
        select(Meeting)
        .where(
            Meeting.user_id == current_user.id
        )
        .order_by(
            Meeting.meeting_date.desc()
        )
    ).all()

    return meetings


# --------------------------------------------------
# GET ONE MEETING
# --------------------------------------------------

@router.get(
    "/{meeting_id}",
    response_model=MeetingResponse
)
def get_meeting(
    meeting_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    meeting = db.scalar(
        select(Meeting).where(
            Meeting.id == meeting_id,
            Meeting.user_id == current_user.id
        )
    )

    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting not found"
        )

    return meeting


# --------------------------------------------------
# ANALYZE MEETING WITH GROQ
# --------------------------------------------------

@router.post(
    "/{meeting_id}/analyze",
    response_model=MeetingAnalysisResponse
)
def analyze_meeting(
    meeting_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    meeting = db.scalar(
        select(Meeting).where(
            Meeting.id == meeting_id,
            Meeting.user_id == current_user.id
        )
    )

    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting not found"
        )

    # Send transcript to Groq
    analysis = analyze_transcript(
        meeting.transcript
    )

    # Save meeting-level analysis
    meeting.summary = analysis["summary"]

    meeting.decisions = "\n".join(
        analysis["decisions"]
    )

    meeting.unresolved_issues = "\n".join(
        analysis["unresolved_issues"]
    )

    # Remove existing commitments for this meeting.
    # This prevents duplicate commitments if the
    # same meeting is analyzed again.
    db.query(Commitment).filter(
        Commitment.meeting_id == meeting.id
    ).delete(
        synchronize_session=False
    )

    # Create structured commitments
    for item in analysis["commitments"]:

        due_date = item.get("due_date")

        commitment = Commitment(
            user_id=current_user.id,
            project_id=meeting.project_id,
            meeting_id=meeting.id,
            description=item["description"],
            owner_name=item["owner_name"],
            due_date=due_date,
            status="pending"
        )

        db.add(commitment)

    db.commit()
    db.refresh(meeting)

    return MeetingAnalysisResponse(
        summary=meeting.summary,
        decisions=meeting.decisions,
        unresolved_issues=meeting.unresolved_issues,
        commitments=json.dumps(
            analysis["commitments"]
        )
    )