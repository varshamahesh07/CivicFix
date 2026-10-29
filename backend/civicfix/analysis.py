"""Rule-based demo analysis and modular service bridge.

Maintains backward-compatibility with tests while leveraging the modular analysis layer.
"""
from .services.analysis import default_analysis_service
from .services.analysis.duplicate_detection import DUPLICATE_THRESHOLD, DuplicateDetectionService
from .services.analysis.priority_service import PriorityService
from .services.analysis.text_analysis import TextAnalysisService

_text_svc = TextAnalysisService()
_dup_svc = DuplicateDetectionService()


def similarity(a, b):
    """Word-overlap (Jaccard) similarity between two titles."""
    return _dup_svc.compute_similarity(_text_svc.tokenize(a), _text_svc.tokenize(b))


def priority_for(title, description, category, days):
    t_res = _text_svc.analyze_text(title, description)
    res = PriorityService.assess_priority(
        title=title,
        description=description,
        category=category,
        days=days,
        urgent_indicators=t_res["urgent_indicators"],
        serious_indicators=t_res["serious_indicators"],
    )
    return res["priority"]


def analyze(*, title, description, category, days, has_image, duplicate_candidates, voice_transcript=None):
    """Bridge function delegating to the unified AnalysisService."""
    return default_analysis_service.analyze_complaint(
        title=title,
        description=description,
        category=category,
        days=days,
        has_image=has_image,
        duplicate_candidates=duplicate_candidates,
        voice_transcript=voice_transcript,
    )
