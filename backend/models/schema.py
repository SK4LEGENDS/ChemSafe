from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AnalyzeRequest(BaseModel):
    chemicals: List[str]
    session_id: Optional[str] = None

class Interaction(BaseModel):
    pair: List[str]
    risk: str
    explanation: str

class AnalyzeResponse(BaseModel):
    risk: str
    explanation: str
    precautions: List[str]
    interactions: List[Interaction]
    report: Optional[Dict[str, Any]] = None
