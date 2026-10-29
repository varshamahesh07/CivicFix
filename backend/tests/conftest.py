import io
import shutil
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from civicfix import create_app  # noqa: E402
from civicfix.extensions import db  # noqa: E402

PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d"
    "49444154789c6360f8cfc0f01f0005000201a5f6453d0000000049454e44ae426082"
)
ORIGIN = "http://localhost:5173"


@pytest.fixture
def app(tmp_path):
    upload = tmp_path / "uploads"
    app = create_app({
        "TESTING": True,
        "SECRET_KEY": "test-secret",
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{tmp_path / 'test.db'}",
        "UPLOAD_FOLDER": str(upload),
        "DEMO_SEED": True,
        "CORS_ORIGINS": [ORIGIN],
        "SESSION_COOKIE_SECURE": False,
    })
    yield app
    with app.app_context():
        db.session.remove()
        db.drop_all()
        db.engine.dispose()
    shutil.rmtree(upload, ignore_errors=True)


@pytest.fixture
def client(app):
    return app.test_client()


def login(app, role, identifier, password):
    c = app.test_client()
    path = "/api/auth/citizen/login" if role == "citizen" else "/api/auth/authority/login"
    resp = c.post(path, json={"identifier": identifier, "password": password}, headers={"Origin": ORIGIN})
    assert resp.status_code == 200, resp.get_json()
    return c


@pytest.fixture
def citizen(app):
    return login(app, "citizen", "citizen@demo.civicfix", "Citizen@123")


@pytest.fixture
def citizen2(app):
    return login(app, "citizen", "citizen2@demo.civicfix", "Citizen@123")


@pytest.fixture
def authority(app):
    return login(app, "authority", "AUTH-DEMO-001", "Authority@123")


def complaint_payload(**over):
    base = {
        "title": "Large pothole at market junction",
        "category": "Roads and Potholes",
        "description": "A large pothole near the market junction slows traffic every morning.",
        "address": "9 Market Junction",
        "locality": "Ward 5",
        "nearbyLandmark": "Nil",
        "issueDurationDays": 5,
    }
    base.update(over)
    return base


def headers():
    return {"Origin": ORIGIN}
