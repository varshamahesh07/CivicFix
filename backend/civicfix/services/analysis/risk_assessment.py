"""Modular Risk Assessment Service for CivicFix.

Calculates a structured municipal risk score on a transparent 0-100 scale:
  - 0-25:   Low Risk (routine maintenance)
  - 26-50:  Moderate Risk (standard municipal attention)
  - 51-75:  High Risk (elevated hazard requiring expedited action)
  - 76-100: Severe/Critical Risk (imminent safety hazard, infrastructure threat)

Clearly articulates the scoring basis without representing arbitrary numbers as
scientifically validated predictions.
"""
from typing import Any, Dict, List

# Category baseline risk weights (0 - 40)
CATEGORY_WEIGHTS = {
    "Public Safety": 35,
    "Drainage and Sewage": 28,
    "Roads and Potholes": 24,
    "Water Supply": 20,
    "Streetlights": 16,
    "Public Infrastructure": 18,
    "Garbage and Waste": 18,
    "Other": 10,
}


class RiskAssessmentService:
    @staticmethod
    def assess_risk(
        category: str,
        days: int,
        urgent_indicators: List[str],
        serious_indicators: List[str],
        has_duplicates: bool = False,
    ) -> Dict[str, Any]:
        """Compute an explainable civic risk score (0-100)."""
        base_score = CATEGORY_WEIGHTS.get(category, 15)
        factors = [f"Base risk for '{category}': +{base_score}"]

        urgency_points = 0
        if urgent_indicators:
            urgency_points = min(len(urgent_indicators) * 15, 35)
            factors.append(f"Safety hazard indicators ({', '.join(urgent_indicators)}): +{urgency_points}")

        severity_points = 0
        if serious_indicators:
            severity_points = min(len(serious_indicators) * 8, 20)
            factors.append(f"Severity indicators: +{severity_points}")

        duration_points = 0
        if days >= 30:
            duration_points = 15
            factors.append("Extended unresolved duration (>=30 days): +15")
        elif days >= 14:
            duration_points = 10
            factors.append("Substantial unresolved duration (>=14 days): +10")
        elif days >= 7:
            duration_points = 5
            factors.append("Unresolved duration (>=7 days): +5")

        duplicate_points = 0
        if has_duplicates:
            duplicate_points = 10
            factors.append("Multiple reports for same issue/locality: +10")

        total_score = min(max(base_score + urgency_points + severity_points + duration_points + duplicate_points, 0), 100)

        if total_score >= 76:
            risk_level = "Severe"
        elif total_score >= 51:
            risk_level = "High"
        elif total_score >= 26:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

        return {
            "risk_score": total_score,
            "risk_level": risk_level,
            "factors": factors,
            "scale_info": {
                "min": 0,
                "max": 100,
                "interpretation": "0-25: Low, 26-50: Moderate, 51-75: High, 76-100: Severe",
            },
            "method": "heuristic_risk_model_v1",
        }
