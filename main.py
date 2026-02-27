from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
import chromadb
from chromadb.config import Settings
import os
import json
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------
# 🔐 Load environment variables
# ---------------------------------------------------
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("❌ GEMINI_API_KEY not found. Check your .env file.")

# ---------------------------------------------------
# 🔹 Initialize FastAPI
# ---------------------------------------------------
app = FastAPI(title="AI Government Scheme Eligibility Engine")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# 🔹 Initialize Gemini Client
# ---------------------------------------------------
client = genai.Client(api_key=api_key)

# ---------------------------------------------------
# 🔹 Initialize Persistent ChromaDB
# ---------------------------------------------------
chroma_client = chromadb.Client(
    Settings(
        persist_directory="./chroma_db",
        is_persistent=True
    )
)

collection = chroma_client.get_or_create_collection(name="gov_schemes")

# ---------------------------------------------------
# 🔹 Pydantic Model
# ---------------------------------------------------
class UserProfile(BaseModel):
    age: int
    income: int
    occupation: str
    state: str

# ---------------------------------------------------
# 🔹 Eligibility Endpoint (RAG + Structured Output)
# ---------------------------------------------------
@app.post("/check")
def check_eligibility(user: UserProfile):

    # -------------------------------
    # 1️⃣ Create Query Text
    # -------------------------------
    query_text = f"""
    Age: {user.age}
    Income: {user.income}
    Occupation: {user.occupation}
    State: {user.state}
    """

    # -------------------------------
    # 2️⃣ Embed User Query
    # -------------------------------
    query_embedding_response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=[query_text]
    )

    query_vector = query_embedding_response.embeddings[0].values

    # -------------------------------
    # 3️⃣ Vector Search
    # -------------------------------
    search_results = collection.query(
        query_embeddings=[query_vector],
        n_results=4
    )

    relevant_docs = search_results.get("documents", [[]])[0]

    if not relevant_docs:
        return {
            "status": "No Match",
            "message": "No relevant schemes found based on the provided details."
        }

    # -------------------------------
    # 4️⃣ Gemini Reasoning
    # -------------------------------
    prompt = f"""
    You are an intelligent government scheme eligibility evaluator.

    User Profile:
    {user.model_dump()}

    Relevant Scheme Data:
    {relevant_docs}

    Evaluate strictly.

    Return ONLY valid JSON in this format:

    [
        {{
            "scheme_name": "string",
            "eligible": true/false,
            "reason": "clear explanation",
            "required_documents": ["list of documents"],
            "eligibility_score": 0-100
        }}
    ]
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={"response_mime_type": "application/json"}
    )

    try:
        parsed = json.loads(response.text)

        if not isinstance(parsed, list) or len(parsed) == 0:
            raise ValueError("Invalid model output format")

        # -------------------------------
        # 5️⃣ Ranking Logic
        # -------------------------------
        parsed_sorted = sorted(
            parsed,
            key=lambda x: x.get("eligibility_score", 0),
            reverse=True
        )

        best_match = parsed_sorted[0]
        others = parsed_sorted[1:]

        confidence = "High" if best_match.get("eligibility_score", 0) >= 75 else \
                     "Medium" if best_match.get("eligibility_score", 0) >= 40 else \
                     "Low"

        return {
            "status": "Success",
            "best_match": best_match,
            "other_schemes": others,
            "confidence": confidence
        }

    except Exception as e:
        return {
            "status": "Error",
            "message": "Model did not return valid JSON.",
            "raw_output": response.text
        }