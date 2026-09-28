from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class PrepFeedback(Base):
    __tablename__ = "prep_feedback"

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

    usefulness_rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    what_was_useful: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    what_was_missing: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    focus_next_time: Mapped[str | None] = mapped_column(
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
        back_populates="feedback"
    )

    project = relationship(
        "Project",
        back_populates="feedback"
    )