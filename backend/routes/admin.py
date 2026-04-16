from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db, Rule, ChatLog
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin"])

# Schemas for Admin
class RuleBase(BaseModel):
    chemicals: List[str]
    risk: str
    explanation: str
    precautions: List[str]

class RuleResponse(RuleBase):
    id: int
    class Config:
        from_attributes = True

class ChatLogResponse(BaseModel):
    id: int
    session_id: str
    timestamp: datetime
    user_message: str
    ai_response: dict
    
    class Config:
        from_attributes = True

@router.get("/logs", response_model=List[ChatLogResponse])
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(ChatLog).order_by(ChatLog.timestamp.desc()).all()
    return logs

@router.get("/rules", response_model=List[RuleResponse])
def get_rules(db: Session = Depends(get_db)):
    return db.query(Rule).all()

@router.post("/rules", response_model=RuleResponse)
def create_rule(rule_data: RuleBase, db: Session = Depends(get_db)):
    new_rule = Rule(
        chemicals=[c.lower().strip() for c in rule_data.chemicals],
        risk=rule_data.risk,
        explanation=rule_data.explanation,
        precautions=rule_data.precautions
    )
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    return new_rule

@router.delete("/rules/{rule_id}")
def delete_rule(rule_id: int, db: Session = Depends(get_db)):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    db.delete(rule)
    db.commit()
    return {"message": "Rule deleted successfully"}
