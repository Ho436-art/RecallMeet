from hindsight_client import Hindsight
from app.core.config import settings


client = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key=settings.HINDSIGHT_API_KEY
)

BANK_ID = "recallmeet"


print("Recalling Apollo project memory...")

try:
    result = client.recall(
        bank_id=BANK_ID,
        query=(
            "What do I need to know before the next Apollo project meeting? "
            "Include commitments, unresolved issues, client concerns, "
            "and important project context."
        )
    )

    print("\n===== HINDSIGHT RECALL =====")

    for memory in result.results:
        print(f"\n- {memory.text}")

finally:
    client.close()