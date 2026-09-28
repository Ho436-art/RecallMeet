from uuid import UUID

from hindsight_client import Hindsight

from app.core.config import settings


def get_user_bank_id(user_id: UUID | str) -> str:
    """
    Creates a stable Hindsight memory bank for one RecallMeet user.

    The bank ID is derived only from the authenticated user's ID.
    """
    return f"recallmeet:user:{user_id}"


def get_hindsight_client() -> Hindsight:
    return Hindsight(
        base_url="https://api.hindsight.vectorize.io",
        api_key=settings.HINDSIGHT_API_KEY
    )


def store_project_memory(
    user_id: UUID | str,
    content: str,
    context: str = "RecallMeet project memory"
):
    client = get_hindsight_client()

    try:
        return client.retain(
            bank_id=get_user_bank_id(user_id),
            content=content,
            context=context
        )
    finally:
        client.close()


def recall_project_memory(
    user_id: UUID | str,
    query: str
):
    client = get_hindsight_client()

    try:
        return client.recall(
            bank_id=get_user_bank_id(user_id),
            query=query
        )
    except Exception:
        # Bank may not exist yet if no feedback has been submitted,
        # or Hindsight API returned 404 Not Found.
        return None
    finally:
        client.close()