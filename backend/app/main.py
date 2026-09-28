from fastapi import FastAPI
from sqlalchemy import text
from app.api.projects import router as projects_router
from app.api.meetings import router as meetings_router
from app.api.auth import router as auth_router
from app.db.session import engine
from app.api.commitments import router as commitments_router
from app.api.preparation import router as preparation_router
from app.api.feedback import router as feedback_router

app = FastAPI(
    title="RecallMeet API",
    description="Backend API for RecallMeet",
    version="0.1.0"
)


app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(meetings_router)
app.include_router(commitments_router)
app.include_router(preparation_router)
app.include_router(feedback_router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RecallMeet API"
    }


@app.get("/health/db")
def database_health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
            "result": result.scalar()
        }