"""Unified Analysis Orchestrator Service for CivicFix.

Coordinates modular sub-services:
  - image_analysis
  - text_analysis
  - priority_service
  - risk_assessment
  - duplicate_detection
  - department_service

Provides backward-compatible outputs for existing routes and templates
while exposing a rich, structured AI-ready contract for future models.
"""
from typing import Any, Dict, List, Optional

from .department_service import DepartmentRecommendationService
from .duplicate_detection import DuplicateDetectionService
from .image_analysis import ImageAnalysisService
from .priority_service import PriorityService
from .risk_assessment import RiskAssessmentService
from .text_analysis import TextAnalysisService


class AnalysisService:
    def __init__(self):
        self.image_service = ImageAnalysisService()
        self.text_service = TextAnalysisService()
        self.priority_service = PriorityService()
        self.risk_service = RiskAssessmentService()
        self.duplicate_service = DuplicateDetectionService()
        self.department_service = DepartmentRecommendationService()

    def analyze_complaint(
        self,
        *,
        title: str,
        description: str,
        category: str,
        days: int,
        has_image: bool = False,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None,
        duplicate_candidates: Optional[List[Any]] = None,
        voice_transcript: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Execute the end-to-end analysis pipeline."""
        candidates = duplicate_candidates or []

        # 1. Text & NLP analysis
        text_res = self.text_service.analyze_text(title, description, voice_transcript)
        title_tokens = self.text_service.tokenize(title)

        # 2. Image analysis
        image_res = self.image_service.analyze_image(
            image_bytes=image_bytes,
            file_path=image_path,
            declared_category=category,
        )

        # 3. Duplicate detection
        dup_res = self.duplicate_service.find_duplicates(
            target_title=title,
            target_tokens=title_tokens,
            candidates=candidates,
            tokenize_fn=self.text_service.tokenize,
        )

        # 4. Priority assessment
        prio_res = self.priority_service.assess_priority(
            title=title,
            description=description,
            category=category,
            days=days,
            urgent_indicators=text_res["urgent_indicators"],
            serious_indicators=text_res["serious_indicators"],
        )

        # 5. Risk assessment
        risk_res = self.risk_service.assess_risk(
            category=category,
            days=days,
            urgent_indicators=text_res["urgent_indicators"],
            serious_indicators=text_res["serious_indicators"],
            has_duplicates=dup_res["is_duplicate_candidate"],
        )

        # 6. Department recommendation
        dept_res = self.department_service.recommend_department(category, title, description)

        # State determination
        analysis_status = "rule_based" if text_res["status"] == "rule_based" else "completed"

        return {
            # Backward-compatible shape for existing UI and tests
            "classification": category,
            "priority": prio_res["priority"],
            "suggestedDepartment": dept_res["recommended_department"],
            "duplicateOf": dup_res["duplicate_of"],
            "imageState": (
                "Image attached. Automatic image classification is not connected in this prototype."
                if has_image
                else "No image provided."
            ),
            "state": "simulated",
            # AI-ready structured contract
            "analysis_status": analysis_status,
            "predicted_category": category,
            "confidence": None,  # Honest: no fabricated ML confidence
            "risk_score": risk_res["risk_score"],
            "risk_level": risk_res["risk_level"],
            "recommended_department": dept_res["recommended_department"],
            "duplicate_candidates": dup_res["matches"],
            "model_version": "civicfix-modular-v1.0",
            "error_message": None,
            "details": {
                "text": text_res,
                "image": image_res,
                "priority": prio_res,
                "risk": risk_res,
                "duplicate": dup_res,
                "department": dept_res,
            },
        }


# Singleton instance for application reuse
default_analysis_service = AnalysisService()
