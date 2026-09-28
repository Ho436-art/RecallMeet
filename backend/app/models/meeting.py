from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, ForeignKey, Text, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    project_id: Mapped[UUID] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    meeting_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    transcript: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    decisions: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    unresolved_issues: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="meetings"
    )

    project = relationship(
        "Project",
        back_populates="meetings"
    )

    participants = relationship(
        "Participant",
        back_populates="meeting",
        cascade="all, delete-orphan"
    )

    commitments = relationship(
        "Commitment",
        back_populates="meeting",
        cascade="all, delete-orphan"
    )