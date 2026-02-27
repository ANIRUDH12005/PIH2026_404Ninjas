from google import genai
import os
import json

# 🔐 Load API key from .env
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Load schemes
with open("schemes.json", "r") as f:
    schemes = json.load(f)

# Dynamic user input
user_profile = {
    "age": 23,
    "income": 200000,
    "occupation": "Student",
    "state": "Maharashtra"
}

# ---------------------------------------------------
# ✅ STEP 1: FILTER SCHEMES LOCALLY (NO LLM COST)
# ---------------------------------------------------

filtered_schemes = []

for scheme in schemes:
    eligibility = scheme["eligibility"]

    # Age check
    if not (eligibility["min_age"] <= user_profile["age"] <= eligibility["max_age"]):
        continue

    # Income check (None means no income limit)
    if eligibility["max_income"] is not None:
        if user_profile["income"] > eligibility["max_income"]:
            continue

    # Occupation check
    if eligibility["occupation_required"].lower() != user_profile["occupation"].lower():
        continue

    # If all conditions pass
    filtered_schemes.append(scheme)

# ---------------------------------------------------
# ✅ STEP 2: SEND ONLY FILTERED SCHEMES TO GEMINI
# ---------------------------------------------------

results = []

for scheme in filtered_schemes:

    prompt = f"""
    User Profile:
    {user_profile}

    Scheme:
    {scheme}

    The system has already checked eligibility rules.
    Generate:

    1. A simple explanation
    2. Required documents checklist
    3. Application tips

    Return JSON:
    {{
    "scheme_name": "...",
    "explanation": "...",
    "documents_required": ["..."],
    "tips": "..."
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={"response_mime_type": "application/json"}
    )

    try:
        results.append(json.loads(response.text))
    except json.JSONDecodeError:
        print(f"⚠ Could not parse JSON for scheme: {scheme['name']}")

# ---------------------------------------------------
# ✅ FINAL OUTPUT
# ---------------------------------------------------

print(json.dumps(results, indent=2))