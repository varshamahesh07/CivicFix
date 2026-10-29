"""Demo accounts and complaints, matching src/data/demoData.js. Loaded only when DEMO_SEED=1."""
from datetime import timedelta

from werkzeug.security import generate_password_hash

from .constants import DEPARTMENTS
from .extensions import db
from .models import Authority, Citizen, Complaint, IdCounter, StatusEvent
from .utils import utcnow

DEMO_CITIZENS = [
    dict(id="c-1", name="Demo Citizen", age=34, address="12 Park Street, Ward 7",
         email="citizen@demo.civicfix", phone="9876543210", password="Citizen@123"),
    dict(id="c-2", name="Sample Citizen Two", age=52, address="45 Market Road, Ward 3",
         email="citizen2@demo.civicfix", phone="9123456780", password="Citizen@123"),
]

DEMO_AUTHORITIES = [
    dict(id="a-1", name="Demo Officer", designation="Assistant Engineer", department="Roads & Infrastructure",
         authority_id="AUTH-DEMO-001", email="officer@demo.civicfix", phone="9000000001",
         password="Authority@123", verification="approved"),
    dict(id="a-2", name="Sample Pending Applicant", designation="Sanitary Inspector",
         department="Solid Waste Management", authority_id="AUTH-DEMO-002", email="pending@demo.civicfix",
         phone="9000000002", password="Pending@123", verification="pending"),
]

# history entries: (status, days ago, note, by)
DEMO_COMPLAINTS = [
    dict(id="CF-2026-0001", citizen_id="c-1", title="Deep pothole near bus stop", category="Roads and Potholes",
         description="A deep pothole has formed in the left lane near Bus Stop 4. Two-wheelers swerve into traffic to avoid it.",
         address="Main Road, near Bus Stop 4", locality="Ward 7", landmark="Bus Stop 4", days=12, priority="Medium",
         history=[("Registered", 2, "", "System")]),
    dict(id="CF-2026-0002", citizen_id="c-1", title="Uncollected garbage for a week", category="Garbage and Waste",
         description="Garbage bins behind the community hall have not been cleared for a week and smell strongly.",
         address="22 Lake View Lane", locality="Ward 7", landmark="Nil", days=7, priority="Low",
         history=[("Registered", 9, "", "System"),
                  ("Ongoing", 6, "Sanitation team has been assigned to this location.", "Demo Officer")]),
    dict(id="CF-2026-0003", citizen_id="c-1", title="Open manhole with sewage overflow", category="Drainage and Sewage",
         description="The manhole cover is missing and sewage is overflowing onto the footpath after rain. Pedestrians have to walk on the road.",
         address="Temple Street junction", locality="Ward 7", landmark="Opposite the temple gate", days=3, priority="Critical",
         history=[("Registered", 14, "", "System"),
                  ("Waiting List", 10, "Replacement cover is on order. Your complaint remains active.", "Demo Officer")]),
    dict(id="CF-2026-0004", citizen_id="c-1", title="Streetlight out on residential lane", category="Streetlights",
         description="The streetlight at the end of the lane has been out for three nights, leaving the walkway dark.",
         address="8 Chestnut Lane", locality="Ward 7", landmark="Nil", days=3, priority="High",
         history=[("Registered", 20, "", "System"),
                  ("Ongoing", 17, "Electrical team scheduled to inspect the pole.", "Demo Officer"),
                  ("Resolved", 15, "Faulty bulb and fuse replaced. Light is working again.", "Demo Officer")]),
    dict(id="CF-2026-0005", citizen_id="c-2", title="Low water pressure for three days", category="Water Supply",
         description="Water pressure has dropped sharply in our building. Upper floors receive almost no water in the mornings.",
         address="45 Market Road", locality="Ward 3", landmark="Nil", days=3, priority="Medium",
         history=[("Registered", 6, "", "System"),
                  ("Denied", 4, "This address falls outside the Ward 3 water-supply boundary. Please resubmit with an address inside the boundary, or contact the Water Works helpdesk.", "Demo Officer")]),
    dict(id="CF-2026-0006", citizen_id="c-2", title="Exposed live wire near school gate", category="Public Safety",
         description="A live electrical wire is hanging low from a utility pole beside the school gate. Children gather here in the morning.",
         address="Gate 2, Government School Road", locality="Ward 3", landmark="School Gate 2", days=1, priority="Critical",
         history=[("Registered", 1, "", "System"),
                  ("Ongoing", 0, "Emergency electrical team dispatched.", "Demo Officer")]),
    dict(id="CF-2026-0007", citizen_id="c-2", title="Broken footpath slab", category="Public Infrastructure",
         description="A concrete slab on the footpath is cracked and tilted, creating a trip hazard for older residents.",
         address="60 Market Road", locality="Ward 3", landmark="Nil", days=30, priority="Low",
         history=[("Registered", 1, "", "System")]),
]


def seed_demo_data():
    """Insert demo data only into an empty database. Returns True if anything was inserted."""
    if db.session.query(Citizen.id).first() is not None:
        return False

    now = utcnow()
    citizens = {}
    for c in DEMO_CITIZENS:
        account = Citizen(
            id=c["id"], name=c["name"], age=c["age"], address=c["address"], email=c["email"],
            phone=c["phone"], password_hash=generate_password_hash(c["password"]), is_demo=True,
        )
        citizens[c["id"]] = account
        db.session.add(account)

    for a in DEMO_AUTHORITIES:
        db.session.add(Authority(
            id=a["id"], name=a["name"], designation=a["designation"], department=a["department"],
            authority_id=a["authority_id"], authority_key=a["authority_id"].lower(), email=a["email"],
            phone=a["phone"], password_hash=generate_password_hash(a["password"]),
            verification=a["verification"], is_demo=True,
        ))

    for d in DEMO_COMPLAINTS:
        citizen = citizens[d["citizen_id"]]
        events = [
            StatusEvent(status=s, at=now - timedelta(days=ago), note=note, by_name=by)
            for s, ago, note, by in d["history"]
        ]
        last = events[-1]
        resolved = [e for e in events if e.status == "Resolved"]
        denied = [e for e in events if e.status == "Denied"]
        complaint = Complaint(
            id=d["id"], citizen_id=citizen.id, citizen_name=citizen.name,
            citizen_email=citizen.email, citizen_phone=citizen.phone,
            title=d["title"], category=d["category"], description=d["description"],
            address=d["address"], locality=d["locality"], locality_key=d["locality"].lower(),
            nearby_landmark=d["landmark"], issue_duration_days=d["days"],
            status=last.status, priority=d["priority"], risk_score=None,
            suggested_department=DEPARTMENTS[d["category"]],
            analysis_classification=d["category"], analysis_state="simulated",
            image_state="No image provided.",
            resolution_note=resolved[-1].note if resolved else "",
            decision_reason=denied[-1].note if denied else "",
            created_at=events[0].at, updated_at=last.at,
        )
        complaint.history = events
        db.session.add(complaint)

    # The seeded IDs run to CF-2026-0007, so new 2026 complaints continue from 0008.
    db.session.add(IdCounter(year=2026, value=7))
    db.session.commit()
    return True
