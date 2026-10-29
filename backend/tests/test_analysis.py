import pytest
from civicfix.services.analysis import AnalysisService, default_analysis_service
from civicfix.services.analysis.department_service import DepartmentRecommendationService
from civicfix.services.analysis.duplicate_detection import DuplicateDetectionService
from civicfix.services.analysis.image_analysis import ImageAnalysisService
from civicfix.services.analysis.priority_service import PriorityService
from civicfix.services.analysis.risk_assessment import RiskAssessmentService
from civicfix.services.analysis.text_analysis import TextAnalysisService


class DummyCandidate:
    def __init__(self, cid, title):
        self.id = cid
        self.title = title


def test_image_analysis_service_honest_reporting():
    svc = ImageAnalysisService()
    # No image
    res_none = svc.analyze_image()
    assert res_none["status"] == "unavailable"
    assert res_none["confidence"] is None

    # Image provided but no ML model weights configured
    res_unconfigured = svc.analyze_image(image_bytes=b"fake-bytes")
    assert res_unconfigured["status"] == "model_not_configured"
    assert res_unconfigured["confidence"] is None
    assert "not configured" in res_unconfigured["message"]


def test_text_analysis_and_urgency_indicators():
    svc = TextAnalysisService()
    res = svc.analyze_text(
        title="Live electric wire exposed near school gate",
        description="A live wire sparked and could cause an accident or fire.",
        voice_transcript="children walk here every day",
    )
    assert res["status"] == "rule_based"
    assert "live wire" in res["urgent_indicators"]
    assert "school" in res["urgent_indicators"]
    assert "child" in res["urgent_indicators"]
    assert res["has_voice_transcript"] is True


def test_priority_service_scoring():
    svc = PriorityService()
    # Critical test (score >= 3)
    p_crit = svc.assess_priority(
        title="Emergency",
        description="Electric hazard",
        category="Public Safety",
        days=20,
        urgent_indicators=["electric", "live wire"],
        serious_indicators=["unsafe"],
    )
    assert p_crit["priority"] == "Critical"
    assert p_crit["priority_score"] >= 3

    # Low test
    p_low = svc.assess_priority(
        title="Minor litter",
        description="Some papers",
        category="Other",
        days=2,
        urgent_indicators=[],
        serious_indicators=[],
    )
    assert p_low["priority"] == "Low"


def test_risk_assessment_scale_and_interpretation():
    svc = RiskAssessmentService()
    res = svc.assess_risk(
        category="Public Safety",
        days=15,
        urgent_indicators=["live wire", "school"],
        serious_indicators=["unsafe"],
        has_duplicates=True,
    )
    assert 0 <= res["risk_score"] <= 100
    assert res["risk_level"] in ("Low", "Moderate", "High", "Severe")
    assert res["scale_info"]["min"] == 0
    assert res["scale_info"]["max"] == 100
    assert len(res["factors"]) > 0


def test_duplicate_detection_logic():
    svc = DuplicateDetectionService()
    text_svc = TextAnalysisService()

    candidates = [
        DummyCandidate("CF-2026-0001", "Deep pothole on Main Road near Bus Stop 4"),
        DummyCandidate("CF-2026-0002", "Street light broken on 5th avenue"),
    ]

    target = "Deep pothole near Bus Stop 4 on Main Road"
    tokens = text_svc.tokenize(target)

    res = svc.find_duplicates(target, tokens, candidates, text_svc.tokenize)
    assert res["is_duplicate_candidate"] is True
    assert res["duplicate_of"] == "CF-2026-0001"
    assert res["similarity_score"] >= 0.5


def test_department_recommendation():
    svc = DepartmentRecommendationService()
    rec = svc.recommend_department("Streetlights")
    assert rec["recommended_department"] == "Electrical & Street Lighting"
    assert rec["can_override"] is True


def test_unified_analysis_service():
    svc = AnalysisService()
    res = svc.analyze_complaint(
        title="Open sewer overflow on Main Street",
        description="Sewage water is overflowing onto pedestrian walkway",
        category="Drainage and Sewage",
        days=5,
        has_image=True,
    )
    assert res["classification"] == "Drainage and Sewage"
    assert res["suggestedDepartment"] == "Drainage & Sewerage"
    assert res["analysis_status"] == "rule_based"
    assert res["risk_score"] is not None
    assert "details" in res
