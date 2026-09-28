from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Participant(Base):
    __tablename__ = "participants"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4
    )

    meeting_id: Mapped[UUID] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    meeting = relationship(
        "Meeting",
        back_populates="participants"
    )