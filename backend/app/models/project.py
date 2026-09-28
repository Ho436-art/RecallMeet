from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
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
        back_populates="projects"
    )

    meetings = relationship(
        "Meeting",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    commitments = relationship(
        "Commitment",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    feedback = relationship(
        "PrepFeedback",
        back_populates="project",
        cascade="all, delete-orphan"
    )