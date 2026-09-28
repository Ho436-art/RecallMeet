from app.core.config import settings


print("Groq key loaded:", bool(settings.GROQ_API_KEY))
print("Hindsight key loaded:", bool(settings.HINDSIGHT_API_KEY))