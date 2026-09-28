from app.core.config import settings
from app.services.hindsight_service import (
    get_hindsight_client,
    get_user_bank_id,
)

USER_ID = "664031b7-4a22-4b47-9a60-060069891c27"


client = get_hindsight_client()

try:
    bank_id = get_user_bank_id(USER_ID)

    print("User-specific bank:")
    print(bank_id)

    print("\nStoring Apollo project memory...")

    result = client.retain(
        bank_id=bank_id,
        content=(
            "Apollo project context: The client requested API documentation "
            "before the next meeting. Harini committed to send the API "
            "documentation by September 30, 2026. The authentication flow "
            "remains unresolved. The client has concerns about the project "
            "timeline."
        ),
        context="Apollo project meeting"
    )

    print("\nMemory stored successfully!")
    print(result)

    print("\nRecalling Apollo memory...")

    recalled = client.recall(
        bank_id=bank_id,
        query=(
            "What should I know before the next Apollo project meeting?"
        )
    )

    print("\n===== USER-SPECIFIC MEMORY =====")

    for memory in recalled.results:
        print(f"- {memory.text}")

finally:
    client.close()