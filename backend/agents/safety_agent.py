import os
import json
import httpx
import asyncio
from typing import List, Dict, Any, Optional
from itertools import combinations
from sqlalchemy.orm import Session
from backend.models.schema import Interaction, AnalyzeResponse
from backend.database import Rule, ChatLog

class SafetyAgent:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.models = [
            "meta-llama/llama-3.1-8b-instruct:free",
            "mistralai/mistral-7b-instruct:v0.1:free",
            "nvidia/nemotron-3-super-120b-a12b:free"
        ]

    def parse_input(self, chemicals: List[str]) -> List[str]:
        return [c.strip().lower() for c in chemicals if c.strip()]

    def generate_pairs(self, chemicals: List[str]) -> List[tuple]:
        return list(combinations(chemicals, 2))

    def check_rules(self, db: Session, pair: tuple) -> Optional[Dict[str, Any]]:
        c1, c2 = pair
        # Search for any rule that contains both chemicals
        rule = db.query(Rule).filter(
            Rule.chemicals.contains(c1),
            Rule.chemicals.contains(c2)
        ).first()
        
        if rule:
            return {
                "chemicals": rule.chemicals,
                "risk": rule.risk,
                "explanation": rule.explanation,
                "precautions": rule.precautions
            }
        return None

    async def get_llm_reasoning(self, chemicals: List[str], rule_findings: List[Dict[str, Any]], history: List[Dict[str, Any]] = []) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "explanation": "API Key missing. Showing rule-based results only.",
                "risk": "Caution",
                "precautions": ["Configure OPENROUTER_API_KEY for full AI analysis."]
            }

        # Check if the input is a general question vs a specific chemical search
        query_text = " ".join(chemicals).lower()
        is_general_query = any(word in query_text for word in ["what is", "how does", "why ", "explain", "tell me", "class", "group"])
        is_mixture = len(chemicals) > 1 and not is_general_query
        
        if is_general_query:
            prompt_content = f"""
            The user is asking a general question about chemical safety or categories: "{query_text}".
            
            Provide an educational, technical overview in JSON format:
            {{
                "risk": "Safe" | "Caution" | "Dangerous" | "Lethal",
                "explanation": "Identify the category and explain its general risks and mechanisms.",
                "precautions": ["General safety rule 1", "General safety rule 2"],
                "report": {{
                    "common_name": "Category: {query_text}",
                    "classification": "Chemical Class/Category",
                    "hazards": "General hazards associated with this category",
                    "handling": "General handling protocols",
                    "applications": "Where these are typically found or used"
                }},
                "interactions": []
            }}
            """
        elif is_mixture:
            prompt_content = f"""
            Analyze the chemical reaction and safety of mixing: {', '.join(chemicals)}.
            Findings from internal safety database: {json.dumps(rule_findings)}
            
            Provide a professional-grade Laboratory Reaction Report in JSON format:
            {{
                "risk": "Safe" | "Caution" | "Dangerous" | "Lethal",
                "explanation": "Detailed summary of clinical/chemical risk",
                "precautions": ["Precise instruction 1", "Precise instruction 2"],
                "report": {{
                    "input_chemicals": "{', '.join(chemicals)}",
                    "chemical_formulas": "Names and formulas",
                    "reaction_overview": "Summary",
                    "reaction_type": "physical or chemical",
                    "balanced_equation": "Standard chemical notation",
                    "mechanism": "Step-by-step description if applicable",
                    "observations": "Expected visual/physical indicators (gas, color, etc.)",
                    "energy_change": "Exothermic or Endothermic",
                    "conditions": "Temp, Pressure, Catalysts",
                    "products": "Substances formed",
                    "states": "Solid, Liquid, Gas, Aqueous",
                    "feasibility": "Thermodynamic/Kinetic feasibility",
                    "speed": "Slow or Fast",
                    "hazard_id": "Toxic gas, explosion, etc",
                    "ppe": ["Specific equipment names"],
                    "storage_compatibility": "Storage rules",
                    "handling": "Laboratory handling guidelines",
                    "emergency": "First aid and spill response",
                    "properties": "Acidity, pH, Flammability",
                    "industrial_relevance": "How it's used in industry",
                    "applications": "Real-world examples",
                    "environmental": "Impact and disposal",
                    "conclusion": "Final safety summary"
                }},
                "interactions": [
                    {{
                        "pair": ["chem1", "chem2"],
                        "risk": "string",
                        "explanation": "string"
                    }}
                ]
            }}
            """
        else:
            prompt_content = f"""
            Provide a comprehensive Chemical Profile for: {chemicals[0]}.
            
            Provide a professional-grade Technical Datasheet in JSON format:
            {{
                "risk": "Safe" | "Caution" | "Dangerous" | "Lethal",
                "explanation": "General overview of substance",
                "precautions": ["Safety instruction 1", "Safety instruction 2"],
                "report": {{
                    "common_name": "string",
                    "iupac_name": "string",
                    "formula": "Chemical formula",
                    "molecular_weight": "Weight in g/mol",
                    "physical_state": "Solid, Liquid, or Gas",
                    "appearance": "Color and odor",
                    "solubility": "Water and common solvents",
                    "classification": "Acid, Base, Organic, etc.",
                    "ph": "Expected pH",
                    "reactivity": "Stability and reactive nature",
                    "hazards": "Toxicity, corrosive status, etc.",
                    "symbols": ["GHS categories"],
                    "storage": "Specific storage requirements",
                    "handling": "Safe handling protocol",
                    "applications": "Common laboratory or industrial uses"
                }},
                "interactions": []
            }}
            """

        final_instructions = """
        IMPORTANT SAFETY GUIDELINES:
        - CURRENT CONTEXT: Focus ONLY on the chemicals or questions in the latest user message. Do NOT repeat previous reports if the topic has shifted.
        - 'Safe': No harmful properties or interactions.
        - 'Caution': Standard risks requiring normal lab precautions.
        - 'Dangerous': Severe hazards (Toxic, Flammable, Corrosive) or dangerous reactions.
        - 'Lethal': EXTREME hazards (Nerve gas production, immediate explosion, lethal toxicity).
        - If multiple risks exist, choose the highest (Lethal > Dangerous > Caution > Safe).
        - OMIT any field if the data is unknown or not applicable. Do NOT use placeholders.
        """

        messages = [
            {"role": "system", "content": "You are a professional chemical safety expert assistant. Provide technical, accurate data only and output JSON."},
        ]
        
        # Trim history to prevent context leakage/stiffness
        for msg in history[-3:]:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        
        messages.append({"role": "user", "content": prompt_content + "\n" + final_instructions})

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://github.com/antigravity-ai",
            "Content-Type": "application/json"
        }

        last_error = "No models responded in time"
        # Reduced first timeout to fail fast if node is slow
        timeouts = [8.0, 15.0, 20.0]
        
        for idx, model in enumerate(self.models):
            timeout = timeouts[idx] if idx < len(timeouts) else 15.0
            print(f"Attempting analysis with model: {model} (timeout: {timeout}s)")
            data = {
                "model": model,
                "messages": messages,
                "response_format": {"type": "json_object"}
            }

            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.post(self.base_url, headers=headers, json=data)
                    response.raise_for_status()
                    result = response.json()
                    content = result['choices'][0]['message']['content']
                    return json.loads(content)
            except Exception as e:
                print(f"Model {model} failed or timed out: {e}")
                last_error = "Busy or Timeout"
                continue 

        return {
            "explanation": f"The safety analysis nodes are currently under high load ({last_error}). Please retry your request.",
            "risk": "Caution",
            "precautions": ["Verify substance data manually in MSDS database.", "Try again to rotate to a fresh node."]
        }


    async def analyze(self, db: Session, raw_chemicals: List[str], session_id: Optional[str] = None) -> AnalyzeResponse:
        chemicals = self.parse_input(raw_chemicals)
        pairs = self.generate_pairs(chemicals)
        
        # Load history from DB
        history = []
        if session_id:
            logs = db.query(ChatLog).filter(ChatLog.session_id == session_id).order_by(ChatLog.timestamp.asc()).all()
            for log in logs:
                history.append({"role": "user", "content": log.user_message})
                history.append({"role": "assistant", "content": log.ai_response.get("explanation", "")})

        rule_findings = []
        for pair in pairs:
            rule = self.check_rules(db, pair)
            if rule:
                rule_findings.append({
                    "pair": list(pair),
                    "risk": rule["risk"],
                    "explanation": rule["explanation"],
                    "precautions": rule["precautions"]
                })

        # Augment with LLM
        llm_result = await self.get_llm_reasoning(chemicals, rule_findings, history)
        
        if any(f["risk"] == "Dangerous" for f in rule_findings):
            llm_result["risk"] = "Dangerous"

        interactions = []
        for intr in llm_result.get("interactions", []):
            interactions.append(Interaction(**intr))
        
        if not interactions and rule_findings:
            for f in rule_findings:
                interactions.append(Interaction(pair=f["pair"], risk=f["risk"], explanation=f["explanation"]))

        response = AnalyzeResponse(
            risk=llm_result.get("risk", "Caution"),
            explanation=llm_result.get("explanation", "Potential interaction detected."),
            precautions=llm_result.get("precautions", ["Standard safety measures apply."]),
            interactions=interactions,
            report=llm_result.get("report")
        )

        # Log to DB
        if session_id:
            new_log = ChatLog(
                session_id=session_id,
                user_message=", ".join(raw_chemicals),
                ai_response=response.dict()
            )
            db.add(new_log)
            db.commit()

        return response
