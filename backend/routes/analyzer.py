from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends
from backend.database import get_db, ChatLog
from backend.models.schema import AnalyzeRequest, AnalyzeResponse
from backend.agents.safety_agent import SafetyAgent

router = APIRouter()
agent = SafetyAgent()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_chemicals(request: AnalyzeRequest, db: Session = Depends(get_db)):
    if not request.chemicals:
        raise HTTPException(status_code=400, detail="Chemical list cannot be empty")
    
    try:
        result = await agent.analyze(db, request.chemicals, request.session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions")
def get_sessions(db: Session = Depends(get_db)):
    """Return a list of unique sessions with titles derived from the first user message."""
    # Group by session_id and get the first message for each
    from sqlalchemy import func
    
    subq = db.query(
        ChatLog.session_id,
        func.min(ChatLog.timestamp).label("first_msg_time")
    ).group_by(ChatLog.session_id).subquery()
    
    sessions = db.query(ChatLog).join(
        subq,
        (ChatLog.session_id == subq.c.session_id) & (ChatLog.timestamp == subq.c.first_msg_time)
    ).order_by(ChatLog.timestamp.desc()).all()
    
    return [
        {
            "id": s.session_id,
            "title": s.user_message[:30] + ("..." if len(s.user_message) > 30 else ""),
            "timestamp": s.timestamp
        }
        for s in sessions
    ]

@router.get("/sessions/{session_id}")
def get_session_history(session_id: str, db: Session = Depends(get_db)):
    """Retrieve full history for a specific session."""
    logs = db.query(ChatLog).filter(ChatLog.session_id == session_id).order_by(ChatLog.timestamp.asc()).all()
    if not logs:
        return []
        
    history = []
    for log in logs:
        # Reconstruct the user/bot pair
        history.append({
            "role": "user",
            "content": log.user_message,
            "timestamp": log.timestamp.isoformat()
        })
        history.append({
            "role": "bot",
            "content": log.ai_response.get("explanation", ""),
            "analysis": log.ai_response,
            "timestamp": log.timestamp.isoformat()
        })
    return history

@router.delete("/sessions/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    db.query(ChatLog).filter(ChatLog.session_id == session_id).delete()
    db.commit()
    return {"message": "Session history deleted"}
