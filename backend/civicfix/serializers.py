from .utils import iso


def user_json(account, role):
    """Same shape the frontend's toUser() builds. Fields that do not apply to the role are null."""
    if role == "citizen":
        return {
            "id": account.id, "role": "citizen", "name": account.name, "email": account.email,
            "phone": account.phone, "age": account.age, "address": account.address,
            "designation": None, "department": None, "authorityId": None,
        }
    return {
        "id": account.id, "role": "authority", "name": account.name, "email": account.email,
        "phone": account.phone, "age": None, "address": None,
        "designation": account.designation, "department": account.department,
        "authorityId": account.authority_id,
    }


def complaint_json(c, viewer_role):
    data = {
        "id": c.id,
        "citizenId": c.citizen_id,
        "citizenName": c.citizen_name,
        "citizenContact": {"email": c.citizen_email, "phone": c.citizen_phone},
        "title": c.title,
        "category": c.category,
        "description": c.description,
        "voiceTranscript": getattr(c, "voice_transcript", "") or "",
        "imageName": c.image_name,
        "imagePreview": f"/api/complaints/{c.id}/image" if c.image_path else None,
        "address": c.address,
        "locality": c.locality,
        "location": c.locality,
        "nearbyLandmark": c.nearby_landmark,
        "landmark": c.nearby_landmark,
        "latitude": c.latitude,
        "longitude": c.longitude,
        "issueDurationDays": c.issue_duration_days,
        "status": c.status,
        "priority": c.priority,
        "riskScore": c.risk_score,
        "suggestedDepartment": c.suggested_department,
        "analysis": {
            "classification": c.analysis_classification,
            "state": c.analysis_state,
            "duplicateOf": c.duplicate_of,
            "imageState": c.image_state,
        },
        "createdAt": iso(c.created_at),
        "updatedAt": iso(c.updated_at),
        "statusHistory": [
            {
                "status": h.status,
                "at": iso(h.at),
                "timestamp": iso(h.at),
                "note": h.note,
                "by": h.by_name,
                "updatedBy": h.by_name,
            }
            for h in c.history
        ],
        "resolutionNote": c.resolution_note,
        "decisionReason": c.decision_reason,
        "deniedReason": c.decision_reason,
    }
    if viewer_role != "authority":
        # Citizens never see the contact snapshot, internal analysis, risk score, or routing.
        for key in ("citizenContact", "analysis", "riskScore", "suggestedDepartment"):
            data.pop(key)
    return data
