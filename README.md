# Pan-India


Bharat.Ai– Scheme & Job Eligibility Engine
Bharat.Ai is an AI-powered government advisory platform that helps Indian citizens instantly discover:

Government schemes they are eligible for

Government job opportunities matching their profile

The platform uses Retrieval-Augmented Generation (RAG) architecture combined with Google Gemini AI to intelligently analyze user input and provide structured, explainable eligibility results.

🧠 How It Works
User enters:

Age

Income

Occupation

State

The system:

Converts the user profile into embeddings using gemini-embedding-001

Retrieves relevant government scheme chunks from ChromaDB

Injects both scheme data and job dataset into Gemini

Generates structured JSON output including:

Eligibility status

Reasoning

Required documents

Eligibility score

Job opportunities

🏗 Tech Stack
🔹 Backend
FastAPI

Google Gemini API (gemini-2.5-flash)

ChromaDB (Vector Database)

RAG Architecture

Deployed on Render

🔹 Frontend
HTML

CSS

Vanilla JavaScript

Deployed on Netlify

⚙ Architecture Flow
User Input → Embedding → Vector Search (ChromaDB)
→ Relevant Scheme Retrieval → Gemini Reasoning
→ Structured JSON Output → UI Display
🌍 Live Deployment
Backend: Render

Frontend: Netlify

Fully production-ready AI eligibility engine

🎯 Key Features
AI-powered scheme eligibility matching

Government job eligibility analysis

Document requirement extraction

Structured JSON reasoning

Confidence scoring

RAG-based scalable architecture

Production deployment

💡 Why This Project Matters
Many citizens are unaware of schemes and job opportunities they qualify for. BharatAI bridges this gap by using AI + vector search to provide personalized government assistance instantly.
