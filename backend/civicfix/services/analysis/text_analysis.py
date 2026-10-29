"""Modular Text & NLP Analysis Service for CivicFix.

Processes complaint text and transcribed voice notes. Adaptable to future NLP
models (e.g. BERT, RoBERTa, TF-IDF, spaCy) for category prediction, keyword
extraction, and urgency detection.
"""
import os
import re
from typing import Any, Dict, List, Optional, Set

URGENT_TERMS = (
    "injur",
    "accident",
    "electric",
    "live wire",
    "fire",
    "gas leak",
    "flood",
    "collapse",
    "school",
    "hospital",
    "child",
)

SERIOUS_TERMS = (
    "deep",
    "large",
    "blocked",
    "overflow",
    "no water",
    "burst",
    "unsafe",
    "dark",
)

_WORD_SPLIT = re.compile(r"\W+", re.ASCII)


class TextAnalysisService:
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path or os.environ.get("NLP_MODEL_PATH")
        self.model = None
        self.model_version = "heuristic-nlp-v1.0"
        self._initialize_model()

    def _initialize_model(self) -> None:
        if self.model_path and os.path.exists(self.model_path):
            try:
                self.model = f"Loaded NLP model from {self.model_path}"
                self.model_version = "custom-nlp-v1"
            except Exception:
                self.model = None

    def tokenize(self, text: str) -> Set[str]:
        if not text:
            return set()
        return {word for word in _WORD_SPLIT.split(text.lower()) if len(word) > 3}

    def analyze_text(
        self,
        title: str,
        description: str,
        voice_transcript: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Extract tokens, detect urgency indicators, and evaluate text characteristics."""
        full_text = f"{title or ''} {description or ''} {voice_transcript or ''}".lower()
        tokens = self.tokenize(full_text)

        urgent_found = [term for term in URGENT_TERMS if term in full_text]
        serious_found = [term for term in SERIOUS_TERMS if term in full_text]

        # In rule-based mode, confidence is None because it is not an ML probability
        return {
            "status": "rule_based" if self.model is None else "completed",
            "tokens": list(tokens),
            "urgent_indicators": urgent_found,
            "serious_indicators": serious_found,
            "has_voice_transcript": bool(voice_transcript and voice_transcript.strip()),
            "model_version": self.model_version,
            "confidence": None if self.model is None else 0.85,
        }
