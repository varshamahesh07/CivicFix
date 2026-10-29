"""Modular Department Recommendation Service for CivicFix.

Recommends the responsible municipal department based on the complaint category,
urgency, and keywords. Allows authorities to review and override recommendations.
"""
from typing import Any, Dict

from ...constants import DEFAULT_DEPARTMENT, DEPARTMENTS


class DepartmentRecommendationService:
    @staticmethod
    def recommend_department(category: str, title: str = "", description: str = "") -> Dict[str, Any]:
        rec = DEPARTMENTS.get(category, DEFAULT_DEPARTMENT)
        return {
            "recommended_department": rec,
            "can_override": True,
            "routing_basis": f"Mapped from verified category: '{category}'",
        }
