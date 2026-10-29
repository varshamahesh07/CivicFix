from flask import current_app
from sqlalchemy import func, or_
from werkzeug.utils import secure_filename

from ..analysis import analyze
from ..constants import CATEGORIES, PRIORITIES, STATUSES
from ..errors import ApiError, validation_error
from ..extensions import db
from ..models import Complaint, IdCounter, StatusEvent
from ..uploads import IMAGE_KINDS, read_validated_upload, remove_upload, save_upload
from ..utils import utcnow
from ..validation import text, validate_analysis_request, validate_complaint

CANDIDATE_LIMIT = 500  # duplicate check looks at the newest matches only
_IMAGE_LABEL = "JPG, PNG, or WEBP"


def _find_candidates(category, locality):
    """Only complaints in the same category and locality can be duplicates, so the query
    narrows to that set first, using the composite index."""
    return (
        Complaint.query.filter(
            Complaint.category == category, Complaint.locality_key == locality.strip().lower()
        )
        .order_by(Complaint.created_at.desc())
        .limit(CANDIDATE_LIMIT)
        .all()
    )


def _next_complaint_id(year):
    """CF-YYYY-NNNN. The counter row is locked for the duration of the transaction, so two
    simultaneous submissions cannot get the same number."""
    prefix = f"CF-{year}-"
    counter = db.session.get(IdCounter, year, with_for_update=True)
    if counter is None:
        highest = (
            db.session.query(func.max(Complaint.id)).filter(Complaint.id.like(f"{prefix}%")).scalar()
        )
        counter = IdCounter(year=year, value=int(highest.rsplit("-", 1)[1]) if highest else 0)
        db.session.add(counter)
    counter.value += 1
    db.session.flush()
    return f"{prefix}{counter.value:04d}"


def create_complaint(citizen, p, image_file):
    errors = validate_complaint(p)
    if errors:
        raise validation_error(errors)

    has_image = bool(image_file and image_file.filename)
    image = None
    if has_image:
        image = read_validated_upload(
            image_file, IMAGE_KINDS, current_app.config["MAX_IMAGE_BYTES"], _IMAGE_LABEL
        )

    title = text(p, "title").strip()
    category = text(p, "category")
    description = text(p, "description").strip()
    locality = text(p, "locality").strip() or text(p, "location").strip()
    days_val = text(p, "issueDurationDays").strip() or text(p, "durationDays").strip()
    days = int(days_val) if days_val else 1
    landmark = text(p, "nearbyLandmark").strip() or text(p, "landmark").strip() or "Nil"
    voice_transcript = text(p, "voiceTranscript").strip() or text(p, "voice_transcript").strip()
    lat_raw, lng_raw = text(p, "latitude").strip(), text(p, "longitude").strip()
    latitude = float(lat_raw) if lat_raw else None
    longitude = float(lng_raw) if lng_raw else None

    analysis = analyze(
        title=title,
        description=description,
        category=category,
        days=days,
        has_image=has_image,
        duplicate_candidates=_find_candidates(category, locality),
        voice_transcript=voice_transcript,
    )

    now = utcnow()
    saved_rel = None
    try:
        complaint_id = _next_complaint_id(now.year)
        if image:
            saved_rel = save_upload(image[0], image[1], "complaints")
        complaint = Complaint(
            id=complaint_id,
            citizen_id=citizen.id,
            citizen_name=citizen.name,
            citizen_email=citizen.email,
            citizen_phone=citizen.phone,
            title=title,
            category=category,
            description=description,
            voice_transcript=voice_transcript,
            image_name=secure_filename(image_file.filename)[:255] if has_image else "",
            image_path=saved_rel,
            address=text(p, "address").strip(),
            locality=locality,
            locality_key=locality.lower(),
            nearby_landmark=landmark,
            latitude=latitude,
            longitude=longitude,
            issue_duration_days=days,
            status="Registered",
            priority=analysis["priority"],
            risk_score=analysis.get("risk_score"),
            suggested_department=analysis["suggestedDepartment"],
            analysis_classification=analysis["classification"],
            analysis_state="simulated",
            duplicate_of=analysis["duplicateOf"],
            image_state=analysis["imageState"],
            created_at=now,
            updated_at=now,
        )
        complaint.history.append(
            StatusEvent(status="Registered", at=now, note="Complaint submitted successfully.", by_name="System")
        )
        db.session.add(complaint)
        db.session.commit()
    except Exception:
        db.session.rollback()
        if saved_rel:
            remove_upload(saved_rel)  # no orphaned files when the database write fails
        raise
    return complaint


def list_complaints(account, args):
    query = Complaint.query
    if account.role == "citizen":
        query = query.filter(Complaint.citizen_id == account.id)

    status = args.get("status", "")
    if status:
        if status not in STATUSES:
            raise ApiError("Invalid status.", 400)
        query = query.filter(Complaint.status == status)
    category = args.get("category", "")
    if category:
        if category not in CATEGORIES:
            raise ApiError("Invalid category.", 400)
        query = query.filter(Complaint.category == category)
    priority = args.get("priority", "")
    if priority:
        if priority not in PRIORITIES:
            raise ApiError("Invalid priority.", 400)
        query = query.filter(Complaint.priority == priority)

    term = args.get("q", "").strip()
    if term:
        pattern = f"%{term}%"
        conditions = [Complaint.id.ilike(pattern), Complaint.title.ilike(pattern)]
        if account.role == "authority":
            conditions.append(Complaint.citizen_name.ilike(pattern))
        query = query.filter(or_(*conditions))

    total = query.count()
    query = query.order_by(Complaint.created_at.desc(), Complaint.id.desc())

    limit = args.get("limit", type=int)
    if limit:  # pagination is opt-in, so the frontend's "load everything" calls keep working
        offset = max(args.get("offset", default=0, type=int), 0)
        query = query.limit(min(max(limit, 1), 200)).offset(offset)
    return query.all(), total


def get_complaint(account, complaint_id):
    """Citizens who do not own the complaint get the same 404 as a missing ID, so IDs cannot be probed."""
    complaint = db.session.get(Complaint, complaint_id)
    if complaint is None or (account.role == "citizen" and complaint.citizen_id != account.id):
        raise ApiError("Complaint not found.", 404)
    return complaint


def update_status(authority, complaint_id, p):
    status = text(p, "status").strip()
    note = text(p, "note").strip()
    if status not in STATUSES:
        raise ApiError("Invalid status.", 400)
    if len(note) > 500:
        raise ApiError("The note can be at most 500 characters.", 400)

    complaint = db.session.get(Complaint, complaint_id)
    if complaint is None:
        raise ApiError("Complaint not found.", 404)
    if status == complaint.status and not note:
        raise ApiError("Choose a different status or add a note before saving.", 400)
    if status == "Denied" and not note:
        raise ApiError("Enter the reason for denial. The citizen will see this note.", 400)

    now = utcnow()
    complaint.status = status
    complaint.updated_at = now
    complaint.history.append(StatusEvent(status=status, at=now, note=note, by_name=authority.name))
    if status == "Resolved":
        complaint.resolution_note = note
    if status == "Denied":
        complaint.decision_reason = note
    db.session.commit()
    return complaint


def analyze_draft(account, p):
    """Preview analysis before submitting. Duplicate matches are shown only to authorities,
    since they reveal other citizens' complaint IDs."""
    errors = validate_analysis_request(p)
    if errors:
        raise validation_error(errors)
    is_authority = account.role == "authority"
    voice_transcript = text(p, "voiceTranscript").strip() or text(p, "voice_transcript").strip()
    return analyze(
        title=text(p, "title").strip(),
        description=text(p, "description").strip(),
        category=text(p, "category"),
        days=int(text(p, "issueDurationDays").strip()),
        has_image=str(p.get("hasImage", "")).lower() in ("1", "true", "yes", "on"),
        duplicate_candidates=(
            _find_candidates(text(p, "category"), text(p, "locality")) if is_authority else []
        ),
        voice_transcript=voice_transcript,
    )
