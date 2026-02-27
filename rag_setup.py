import chromadb
from chromadb.config import Settings
from google import genai
import os
from scheme_texts import schemes
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("❌ GEMINI_API_KEY not found. Check your .env file.")

# Initialize Gemini client
client = genai.Client(api_key=api_key)

# Initialize Chroma
chroma_client = chromadb.Client(
    # Settings(persist_directory="./chroma_db")
    chromadb.config.Settings(
        persist_directory="chroma_db",
        is_persistent=True
    )
)
collection = chroma_client.get_or_create_collection(name="gov_schemes")

for scheme in schemes:

    # Generate embedding using correct model
    embedding_response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=scheme["text"]
    )

    embedding_vector = embedding_response.embeddings[0].values

    # Store in Chroma
    collection.add(
        documents=[scheme["text"]],
        embeddings=[embedding_vector],
        ids=[scheme["name"]]
    )

print("✅ Embeddings stored successfully.")
chromadb.PersistentClient(path="chroma_db")