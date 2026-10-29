import io

from conftest import ORIGIN, login


def test_citizen_login_by_email_and_phone(app):
    c = app.test_client()
    r = c.post("/api/auth/citizen/login", json={"identifier": "CITIZEN@demo.civicfix", "password": "Citizen@123"})
    assert r.status_code == 200 and r.get_json()["role"] == "citizen"
    r = app.test_client().post("/api/auth/citizen/login", json={"identifier": "98765 43210", "password": "Citizen@123"})
    assert r.status_code == 200 and r.get_json()["name"] == "Demo Citizen"


def test_wrong_password_and_empty_fields(app):
    c = app.test_client()
    r = c.post("/api/auth/citizen/login", json={"identifier": "citizen@demo.civicfix", "password": "WrongPass1!"})
    assert r.status_code == 401 and r.get_json()["message"] == "The email/phone or password is incorrect."
    r = c.post("/api/auth/citizen/login", json={"identifier": "", "password": ""})
    assert r.status_code == 400 and r.get_json()["message"] == "Enter your email or ID."


def test_pending_authority_cannot_log_in(app):
    c = app.test_client()
    r = c.post("/api/auth/authority/login", json={"identifier": "AUTH-DEMO-002", "password": "Pending@123"})
    assert r.status_code == 403
    assert "awaiting verification" in r.get_json()["message"]
    r = c.post("/api/auth/authority/login", json={"identifier": "AUTH-DEMO-002", "password": "nope"})
    assert r.status_code == 401  # wrong password gets the generic error, not the pending message


def test_session_lifecycle(app):
    c = app.test_client()
    assert c.get("/api/auth/me").status_code == 401
    login_resp = c.post("/api/auth/authority/login", json={"identifier": "officer@demo.civicfix", "password": "Authority@123"})
    assert login_resp.status_code == 200
    me = c.get("/api/auth/me").get_json()
    assert me["authorityId"] == "AUTH-DEMO-001" and me["role"] == "authority"
    c.post("/api/auth/logout")
    assert c.get("/api/auth/me").status_code == 401


def test_login_rate_limit(app):
    c = app.test_client()
    for _ in range(5):
        c.post("/api/auth/citizen/login", json={"identifier": "citizen@demo.civicfix", "password": "bad"})
    r = c.post("/api/auth/citizen/login", json={"identifier": "citizen@demo.civicfix", "password": "Citizen@123"})
    assert r.status_code == 429


def test_citizen_registration_validation_and_duplicates(app):
    c = app.test_client()
    base = {"name": "New Person", "age": "30", "address": "1 Lane", "email": "new@example.com",
            "phone": "+91 99999 00001", "password": "weak", "confirmPassword": "weak"}
    r = c.post("/api/auth/citizen/register", json=base)
    assert r.status_code == 400 and "at least 8 characters" in r.get_json()["message"]

    good = {**base, "password": "Strong@pass1", "confirmPassword": "Strong@pass1"}
    r = c.post("/api/auth/citizen/register", json=good)
    assert r.status_code == 201 and r.get_json()["email"] == "new@example.com"
    assert "id" in r.get_json()
    # Registration does not sign the user in, matching the demo.
    assert c.get("/api/auth/me").status_code == 401

    r = c.post("/api/auth/citizen/register", json=good)
    assert r.status_code == 409 and "email already exists" in r.get_json()["message"]

    mismatch = {**good, "email": "other@example.com", "phone": "+91 99999 00002", "confirmPassword": "Different@1"}
    r = c.post("/api/auth/citizen/register", json=mismatch)
    assert r.status_code == 400 and r.get_json()["message"] == "Passwords do not match."

    assert login(app, "citizen", "new@example.com", "Strong@pass1").get("/api/auth/me").status_code == 200


def test_authority_registration_is_pending_and_document_checked(app):
    c = app.test_client()
    form = {"name": "Ravi K", "designation": "Engineer", "department": "Water Works", "authorityId": "AUTH-NEW-7",
            "email": "ravi@city.example", "phone": "9000011111", "password": "Officer@123", "confirmPassword": "Officer@123"}

    r = c.post("/api/auth/authority/register", data=form)
    assert r.status_code == 400 and "ID proof" in r.get_json()["message"]

    r = c.post("/api/auth/authority/register",
               data={**form, "idDocument": (io.BytesIO(b"not a real id"), "id.txt")},
               content_type="multipart/form-data")
    assert r.status_code == 400 and "Unsupported file type" in r.get_json()["message"]

    r = c.post("/api/auth/authority/register",
               data={**form, "idDocument": (io.BytesIO(b"%PDF-1.4 fake"), "employee card.pdf")},
               content_type="multipart/form-data")
    assert r.status_code == 201 and r.get_json() == {"status": "pending"}

    r = app.test_client().post("/api/auth/authority/login", json={"identifier": "AUTH-NEW-7", "password": "Officer@123"})
    assert r.status_code == 403  # approval is never automatic


def test_profile_update_and_phone_clash(app, citizen, citizen2):
    r = citizen.patch("/api/auth/profile", json={"name": "Demo Renamed", "age": "35", "address": "12 Park Street",
                                               "phone": "9876543210"}, headers={"Origin": ORIGIN})
    assert r.status_code == 200 and r.get_json()["name"] == "Demo Renamed" and r.get_json()["age"] == 35

    r = citizen.patch("/api/auth/profile", json={"name": "X Y", "age": "35", "address": "a", "phone": "9123456780"},
                      headers={"Origin": ORIGIN})
    assert r.status_code == 409

    r = citizen.patch("/api/auth/profile", json={"name": "X", "age": "35", "address": "a", "phone": "9123456780"},
                      headers={"Origin": ORIGIN})
    assert r.status_code == 409


def test_cross_site_post_is_rejected(app):
    c = app.test_client()
    r = c.post("/api/auth/citizen/login", json={"identifier": "citizen@demo.civicfix", "password": "Citizen@123"},
               headers={"Origin": "https://evil.example"})
    assert r.status_code == 403
