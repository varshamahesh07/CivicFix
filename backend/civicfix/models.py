from .extensions import db
from .utils import utcnow


class Citizen(db.Model):
    __tablename__ = "citizens"
    role = "citizen"  # class attribute, not a column

    id = db.Column(db.String(40), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(300), nullable=False)
    email = db.Column(db.String(254), nullable=False, unique=True)  # stored lowercase
    phone = db.Column(db.String(16), nullable=False, unique=True)  # stored normalized
    password_hash = db.Column(db.String(255), nullable=False)
    is_demo = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)


class Authority(db.Model):
    __tablename__ = "authorities"
    role = "authority"

    id = db.Column(db.String(40), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    designation = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(120), nullable=False)
    authority_id = db.Column(db.String(60), nullable=False)
    authority_key = db.Column(db.String(60), nullable=False, unique=True)  # lowercase, for case-insensitive login
    email = db.Column(db.String(254), nullable=False, unique=True)
    phone = db.Column(db.String(16), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    verification = db.Column(db.String(20), nullable=False, default="pending", index=True)
    id_document_name = db.Column(db.String(255), nullable=False, default="")  # name only; the file is not kept
    is_demo = db.Column(db.Boolean, nullable=False, default=False)
    submitted_at = db.Column(db.DateTime, nullable=False, default=utcnow)


class IdCounter(db.Model):
    """Per-year sequence for CF-YYYY-NNNN complaint IDs. One row per year, updated atomically."""

    __tablename__ = "id_counters"
    year = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer, nullable=False, default=0)


class Complaint(db.Model):
    __tablename__ = "complaints"
    __table_args__ = (
        db.Index("ix_complaints_citizen_created", "citizen_id", "created_at"),
        db.Index("ix_complaints_duplicate_lookup", "category", "locality_key"),
    )

    id = db.Column(db.String(20), primary_key=True)
    citizen_id = db.Column(db.String(40), db.ForeignKey("citizens.id"), nullable=False)
    # Snapshot at submission time, matching the demo store.
    citizen_name = db.Column(db.String(120), nullable=False)
    citizen_email = db.Column(db.String(254), nullable=False)
    citizen_phone = db.Column(db.String(16), nullable=False)

    title = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(60), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    voice_transcript = db.Column(db.Text, nullable=True, default="")
    image_name = db.Column(db.String(255), nullable=False, default="")
    image_path = db.Column(db.String(255))  # random name under UPLOAD_FOLDER
    address = db.Column(db.String(300), nullable=False)
    locality = db.Column(db.String(120), nullable=False)
    locality_key = db.Column(db.String(120), nullable=False)
    nearby_landmark = db.Column(db.String(200), nullable=False, default="Nil")
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    issue_duration_days = db.Column(db.Integer, nullable=False)

    status = db.Column(db.String(20), nullable=False, index=True)
    priority = db.Column(db.String(10), nullable=False, index=True)
    risk_score = db.Column(db.Integer)  # null until a real risk service exists
    suggested_department = db.Column(db.String(120), nullable=False)
    analysis_classification = db.Column(db.String(60), nullable=False)
    analysis_state = db.Column(db.String(20), nullable=False, default="simulated")
    duplicate_of = db.Column(db.String(20))
    image_state = db.Column(db.String(200), nullable=False, default="")

    resolution_note = db.Column(db.Text, nullable=False, default="")
    decision_reason = db.Column(db.Text, nullable=False, default="")
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow, index=True)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    history = db.relationship(
        "StatusEvent",
        back_populates="complaint",
        order_by="StatusEvent.id",
        cascade="all, delete-orphan",
        lazy="selectin",  # one extra query for a whole list, not one per complaint
    )


class StatusEvent(db.Model):
    __tablename__ = "status_events"

    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(
        db.String(20), db.ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status = db.Column(db.String(20), nullable=False)
    at = db.Column(db.DateTime, nullable=False, default=utcnow)
    note = db.Column(db.Text, nullable=False, default="")
    by_name = db.Column(db.String(120), nullable=False, default="System")

    complaint = db.relationship("Complaint", back_populates="history")
