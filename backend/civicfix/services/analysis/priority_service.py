"""Modular Priority Assessment Service for CivicFix.

Evaluates civic urgency and computes recommended priority levels (Critical,
High, Medium, Low) based on explicit civic risk factors, categories, and text
signals. Independent of HTTP handlers.
"""
from typing import Any, Dict, List


class PriorityService:
    @staticmethod
    def assess_priority(
        title: str,
        description: str,
        category: str,
        days: int,
        urgent_indicators: List[str],
        serious_indicators: List[str],
    ) -> Dict[str, Any]:
        score = 0
        factors = []

        if urgent_indicators:
            score += 2
            factors.append(f"Contains high-urgency keywords: {', '.join(urgent_indicators)}")

        if serious_indicators:
            score += 1
            factors.append(f"Contains severity keywords: {', '.join(serious_indicators)}")

        if days >= 14:
            score += 1
            factors.append(f"Problem has persisted unaddressed for {days} days")

        if category == "Public Safety":
            score += 1
            factors.append("Classified under Public Safety category")

        if score >= 3:
            level = "Critical"
        elif score == 2:
            level = "High"
        elif score == 1:
            level = "Medium"
        else:
            level = "Low"

        return {
            "priority": level,
            "priority_score": score,
            "factors": factors,
            "method": "rule_based_priority_engine_v1",
        }
