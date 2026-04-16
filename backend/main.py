from dotenv import load_dotenv
import os

# Load environment variables from backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import analyzer, admin

from backend.database import init_db

# Initialize database and migrate rules
init_db()

app = FastAPI(title="Chemical Safety Checker AI")

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyzer.router, tags=["Analysis"])
app.include_router(admin.router, tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Chemical Safety Checker AI API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
