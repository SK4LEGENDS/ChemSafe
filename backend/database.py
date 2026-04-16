import os
import json
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DB_PATH = os.path.join(os.path.dirname(__file__), "safety.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Rule(Base):
    __tablename__ = "rules"
    id = Column(Integer, primary_key=True, index=True)
    chemicals = Column(JSON)  # List of chemical names (lowercase)
    risk = Column(String)     # Safe, Caution, Dangerous
    explanation = Column(Text)
    precautions = Column(JSON) # List of strings

class ChatLog(Base):
    __tablename__ = "chat_logs"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_message = Column(Text)
    ai_response = Column(JSON)

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Check if we need to migrate rules.json
    db = SessionLocal()
    if db.query(Rule).count() == 0:
        rules_json_path = os.path.join(os.path.dirname(__file__), "data", "rules.json")
        if os.path.exists(rules_json_path):
            with open(rules_json_path, "r") as f:
                data = json.load(f)
                for r in data.get("rules", []):
                    rule = Rule(
                        chemicals=[c.lower().strip() for c in r["chemicals"]],
                        risk=r["risk"],
                        explanation=r["explanation"],
                        precautions=r["precautions"]
                    )
                    db.add(rule)
                db.commit()
    db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
