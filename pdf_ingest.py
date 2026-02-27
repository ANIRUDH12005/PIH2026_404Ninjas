import os
import chromadb
from chromadb.config import Settings
from google import genai
from dotenv import load_dotenv
from pypdf import PdfReader
import uuid

# Load API key
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Persistent Chroma
chroma_client = chromadb.Client(
    Settings(
        persist_directory="./chroma_db",
        is_persistent=True
    )
)

collection = chroma_client.get_or_create_collection(name="gov_schemes")

# ----------------------------
# 🔹 Load PDF
# ----------------------------
reader = PdfReader("sample_scheme.pdf")

full_text = ""
for page in reader.pages:
    full_text += page.extract_text() + "\n"

# ----------------------------
# 🔹 Chunking
# ----------------------------
def chunk_text(text, chunk_size=500):
    chunks = []
    words = text.split()
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

chunks = chunk_text(full_text)

# ----------------------------
# 🔹 Embed & Store Chunks
# ----------------------------
for chunk in chunks:

    embedding_response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=[chunk]
    )

    embedding_vector = embedding_response.embeddings[0].values

    collection.add(
        documents=[chunk],
        embeddings=[embedding_vector],
        ids=[str(uuid.uuid4())]
    )

print("✅ PDF chunks embedded successfully.")