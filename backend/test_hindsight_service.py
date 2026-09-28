from app.services.hindsight_service import recall_project_memory


print("Testing RecallMeet Hindsight service...")

result = recall_project_memory(
    "What should I know before the next Apollo project meeting?"
)

print("\n===== RECALLMEET MEMORY =====")

for memory in result.results:
    print(f"- {memory.text}")

print("\nHindsight service test completed successfully.")