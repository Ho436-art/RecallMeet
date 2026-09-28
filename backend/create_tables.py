from app.db.base import Base
from app.db.session import engine
from app.models import (
    User,
    Project,
    Meeting,
    Participant,
    Commitment,
    PrepFeedback,
)


print("Creating RecallMeet database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")