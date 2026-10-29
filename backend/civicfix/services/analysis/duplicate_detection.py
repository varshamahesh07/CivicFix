"""Modular Duplicate Detection Service for CivicFix.

Compares complaint submissions against candidates in the same category and
locality using token Jaccard similarity.

Flagged duplicates are brought to authority attention for review; complaints are
never silently discarded solely due to similarity.
"""
from typing import Any, Dict, List, Optional, Set

DUPLICATE_THRESHOLD = 0.5


class DuplicateDetectionService:
    @staticmethod
    def compute_similarity(tokens_a: Set[str], tokens_b: Set[str]) -> float:
        if not tokens_a or not tokens_b:
            return 0.0
        return len(tokens_a & tokens_b) / len(tokens_a | tokens_b)

    def find_duplicates(
        self,
        target_title: str,
        target_tokens: Set[str],
        candidates: List[Any],
        tokenize_fn,
    ) -> Dict[str, Any]:
        """Find potential duplicates among candidates from the same category and locality."""
        best_match_id = None
        best_similarity = 0.0
        matches = []

        for candidate in candidates:
            c_title = getattr(candidate, "title", "")
            c_id = getattr(candidate, "id", "")
            c_tokens = tokenize_fn(c_title)
            sim = self.compute_similarity(target_tokens, c_tokens)
            if sim >= DUPLICATE_THRESHOLD:
                matches.append({"id": c_id, "title": c_title, "similarity": round(sim, 2)})
                if sim > best_similarity:
                    best_similarity = sim
                    best_match_id = c_id

        return {
            "duplicate_of": best_match_id,
            "is_duplicate_candidate": bool(best_match_id),
            "similarity_score": round(best_similarity, 2),
            "candidates_evaluated": len(candidates),
            "matches": matches,
            "threshold": DUPLICATE_THRESHOLD,
        }
