from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

# 1. Initialize a smaller zero-shot classification pipeline.
classifier = pipeline(
    "zero-shot-classification",
    model="valhalla/distilbart-mnli-12-1"
)

# 2. FastAPI app
app = FastAPI()

# 3. Request schema
class ClassificationRequest(BaseModel):
    text: str

# 4. Candidate labels
candidate_labels = [
    "password reset", "vpn issues", "network connectivity",
    "software installation", "hardware failure",
    "system access", "email issues",
    "application error", "account lockout"
]

# 5. Endpoint
@app.post("/classify")
def classify_ticket(request: ClassificationRequest):
    try:
        result = classifier(request.text, candidate_labels)
        return {
            "category": result['labels'][0],
            "confidence": result['scores'][0]
        }
    except Exception as e:
        return {"error": str(e)}, 500
