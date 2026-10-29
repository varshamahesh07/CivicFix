import io
from datetime import datetime

from conftest import ORIGIN, PNG, complaint_payload, login

H = {"Origin": ORIGIN}


def test_role_filtering_and_privacy(citizen, citizen2, authority):
    mine = citizen.get("/api/complaints").get_json()
    theirs = citizen2.get("/api/complaints").get_json()
    everything = authority.get("/api/complaints").get_json()
    assert len(mine) == 4 and len(theirs) == 3 and len(everything) == 7
    assert {c["citizenId"] for c in mine} == {"c-1"}
    assert {c["citizenId"] for c in theirs} == {"c-2"}


def test_citizen_view_hides_internal_fields(citizen, authority):
    row = citizen.get("/api/complaints/CF-2026-0003").get_json()
    for hidden in ("citizenContact", "analysis", "riskScore", "suggestedDepartment"):
        assert hidden not in row
    full = authority.get("/api/complaints/CF-2026-0003").get_json()
    assert full["citizenContact"]["email"] == "citizen@demo.civicfix"
    assert full["analysis"]["state"] == "simulated"
    assert full["suggestedDepartment"] == "Drainage & Sewerage"


def test_citizen_cannot_see_or_touch_others(citizen, citizen2):
    assert citizen2.get("/api/complaints/CF-2026-0001").status_code == 404  # same response as a missing ID
    assert citizen2.get("/api/complaints/CF-2026-9999").status_code == 404
    r = citizen2.patch("/api/complaints/CF-2026-0001/status", json={"status": "Ongoing", "note": "x"}, headers=H)
    assert r.status_code == 403


def test_create_complaint_and_sequence_ids(citizen, authority):
    r = citizen.post("/api/complaints", json=complaint_payload(), headers=H)
    assert r.status_code == 201
    body = r.get_json()
    assert body["id"] == f"CF-{datetime.now().year}-0008" if datetime.now().year == 2026 else body["id"].startswith("CF-")
    assert body["status"] == "Registered" and body["statusHistory"][0]["by"] == "System"
    assert "analysis" not in body  # citizens do not get the internal analysis
    assert body["citizenName"] == "Demo Citizen"

    r2 = citizen.post("/api/complaints", json=complaint_payload(title="Another road problem here"), headers=H)
    assert r2.get_json()["id"] != body["id"]

    listed = citizen.get("/api/complaints").get_json()
    assert sum(1 for c in listed if c["id"] == body["id"]) == 1
    assert authority.get(f"/api/complaints/{body['id']}").get_json()["priority"] in ("Critical", "High", "Medium", "Low")


def test_validation_messages_match_frontend(citizen):
    r = citizen.post("/api/complaints", json={}, headers=H)
    assert r.status_code == 400
    assert r.get_json()["message"] == "Give the complaint a short title."
    assert "Select a category." in r.get_json()["errors"].values()

    r = citizen.post("/api/complaints", json=complaint_payload(issueDurationDays=-3), headers=H)
    assert r.status_code == 400 and "Enter a whole number of days" in r.get_json()["message"]

    r = citizen.post("/api/complaints", json=complaint_payload(description="too short"), headers=H)
    assert "at least 20 characters" in r.get_json()["message"]


def test_authority_only_actions(citizen, authority):
    r = citizen.patch("/api/complaints/CF-2026-0001/status", json={"status": "Ongoing", "note": "x"}, headers=H)
    assert r.status_code == 403
    r = authority.patch("/api/complaints/CF-2026-0001/status", json={"status": "Ongoing", "note": "Crew assigned."}, headers=H)
    assert r.status_code == 200 and r.get_json()["status"] == "Ongoing"


def test_status_rules(authority):
    # Same status with no note is rejected.
    r = authority.patch("/api/complaints/CF-2026-0002/status", json={"status": "Ongoing", "note": ""}, headers=H)
    assert r.status_code == 400 and "Choose a different status" in r.get_json()["message"]
    # Denial requires a reason.
    r = authority.patch("/api/complaints/CF-2026-0001/status", json={"status": "Denied", "note": ""}, headers=H)
    assert r.status_code == 400 and "reason for denial" in r.get_json()["message"]
    # Invalid status.
    r = authority.patch("/api/complaints/CF-2026-0001/status", json={"status": "Shipped", "note": "x"}, headers=H)
    assert r.status_code == 400 and r.get_json()["message"] == "Invalid status."


def test_full_lifecycle_visible_to_citizen(app, citizen, authority):
    cid = citizen.post("/api/complaints", json=complaint_payload(), headers=H).get_json()["id"]
    authority.patch(f"/api/complaints/{cid}/status", json={"status": "Ongoing", "note": "Road crew assigned for inspection."}, headers=H)
    authority.patch(f"/api/complaints/{cid}/status", json={"status": "Resolved", "note": "Pothole filled and surface relaid."}, headers=H)

    row = citizen.get(f"/api/complaints/{cid}").get_json()
    assert row["status"] == "Resolved"
    assert row["resolutionNote"] == "Pothole filled and surface relaid."
    notes = [h["note"] for h in row["statusHistory"]]
    assert "Road crew assigned for inspection." in notes
    assert [h["status"] for h in row["statusHistory"]] == ["Registered", "Ongoing", "Resolved"]


def test_denial_reason_visible_to_citizen(citizen, authority):
    r = authority.patch("/api/complaints/CF-2026-0002/status",
                        json={"status": "Denied", "note": "Outside our collection zone."}, headers=H)
    assert r.status_code == 200
    row = citizen.get("/api/complaints/CF-2026-0002").get_json()
    assert row["decisionReason"] == "Outside our collection zone."


def test_duplicate_detection_is_authority_only(citizen, authority):
    payload = complaint_payload(title="Deep pothole near bus stop market", category="Roads and Potholes", locality="Ward 7")
    created = citizen.post("/api/complaints", json=payload, headers=H).get_json()
    assert created["id"]
    seen = authority.get(f"/api/complaints/{created['id']}").get_json()
    assert seen["analysis"]["duplicateOf"] == "CF-2026-0001"

    preview = citizen.post("/api/analysis", json={**payload, "hasImage": False}, headers=H).get_json()
    assert preview["duplicateOf"] is None  # citizens never learn other IDs
    # Newest match wins, as in the demo store. The complaint just created is the newest match here.
    preview_auth = authority.post("/api/analysis", json={**payload, "hasImage": False}, headers=H).get_json()
    assert preview_auth["duplicateOf"] == created["id"]


def test_analysis_priority_rules(citizen):
    p = complaint_payload(title="Exposed live wire near gate", description="Live wire hanging low, children nearby.",
                          category="Public Safety", issueDurationDays=1)
    out = citizen.post("/api/analysis", json=p, headers=H).get_json()
    assert out["priority"] == "Critical"
    assert out["suggestedDepartment"] == "Public Safety Office"
    assert out["imageState"] == "No image provided."


def test_image_upload_and_access(app, citizen, citizen2, authority):
    data = {**complaint_payload(), "image": (io.BytesIO(PNG), "pothole.png")}
    r = citizen.post("/api/complaints", data=data, content_type="multipart/form-data", headers=H)
    assert r.status_code == 201, r.get_json()
    body = r.get_json()
    assert body["imageName"] == "pothole.png"
    assert body["imagePreview"] == f"/api/complaints/{body['id']}/image"

    img = citizen.get(body["imagePreview"])
    assert img.status_code == 200 and img.mimetype == "image/png" and img.data == PNG
    assert authority.get(body["imagePreview"]).status_code == 200
    assert citizen2.get(body["imagePreview"]).status_code == 404

    bad = {**complaint_payload(), "image": (io.BytesIO(b"<svg onload=alert(1)>"), "x.svg")}
    r = citizen.post("/api/complaints", data=bad, content_type="multipart/form-data", headers=H)
    assert r.status_code == 400 and "Unsupported file type" in r.get_json()["message"]


def test_no_image_endpoint_for_complaint_without_one(citizen):
    r = citizen.get("/api/complaints/CF-2026-0001/image")
    assert r.status_code == 404


def test_authority_filters_and_pagination(authority):
    r = authority.get("/api/complaints?status=Denied")
    assert [c["id"] for c in r.get_json()] == ["CF-2026-0005"]
    r = authority.get("/api/complaints?priority=Critical")
    assert {c["id"] for c in r.get_json()} == {"CF-2026-0003", "CF-2026-0006"}
    page = authority.get("/api/complaints?limit=2&offset=0").get_json()
    assert len(page) == 2
    assert authority.get("/api/complaints?limit=2&offset=0").headers["X-Total-Count"] == "7"
    assert authority.get("/api/complaints?status=Bogus").status_code == 400


def test_session_stops_working_after_logout(app, citizen):
    citizen.post("/api/auth/logout", headers=H)
    assert citizen.get("/api/complaints").status_code == 401


def test_pending_authority_session_is_rejected(app):
    # Approve the account, log in, then revoke the approval. The old session must stop working.
    from civicfix.extensions import db
    from civicfix.models import Authority

    with app.app_context():
        a = db.session.get(Authority, "a-1")
        client = login(app, "authority", "AUTH-DEMO-001", "Authority@123")
        a.verification = "pending"
        db.session.commit()
    assert client.get("/api/complaints").status_code == 401
