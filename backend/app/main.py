from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.auth import router as auth_router
from app.api.projects import router as projects_router
from app.api.meetings import router as meetings_router
from app.api.commitments import router as commitments_router
from app.api.preparation import router as preparation_router
from app.api.feedback import router as feedback_router
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

ALLOWED_ORIGINS = [
    "https://recall-meet.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all database tables exist on server startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="RecallMeet API",
    description="Backend API for RecallMeet",
    version="0.1.0",
    lifespan=lifespan
)

# Allow the Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def ensure_cors_headers(request: Request, call_next):
    origin = request.headers.get("origin")
    try:
        response = await call_next(request)
    except Exception as exc:
        headers = {}
        if origin in ALLOWED_ORIGINS:
            headers["Access-Control-Allow-Origin"] = origin
            headers["Access-Control-Allow-Credentials"] = "true"
            headers["Vary"] = "Origin"

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"},
            headers=headers
        )

    if origin in ALLOWED_ORIGINS and "access-control-allow-origin" not in response.headers:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers.add_vary_header("Origin")

    return response


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