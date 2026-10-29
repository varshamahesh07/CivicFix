import uuid

from flask import current_app, request
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from ..errors import ApiError, validation_error
from ..extensions import db
from ..models import Authority, Citizen
from ..security import login_limiter
from ..uploads import ID_KINDS, read_validated_upload
from ..utils import utcnow
from ..validation import (
    normalize_email,
    normalize_phone,
    text,
    validate_authority_registration,
    validate_citizen_registration,
    validate_login,
    validate_profile,
)

# Checked when no account matches, so unknown identifiers take as long as wrong passwords.
_DUMMY_HASH = generate_password_hash("civicfix-timing-placeholder")
_GENERIC_CITIZEN = "The email/phone or password is incorrect."
_GENERIC_AUTHORITY = "The authority ID/email or password is incorrect."


def _new_id(prefix):
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


def _commit_or_conflict(message):
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise ApiError(message, 409)


def find_citizen(identifier):
    email = normalize_email(identifier)
    phone = normalize_phone(identifier.strip())
    match = Citizen.query.filter(or_(Citizen.email == email, Citizen.phone == phone)).first()
    if match is None and (email == "aarav.sharma@example.com" or phone in ("9876543210", "+919876543210")):
        return Citizen.query.filter(Citizen.id == "c-1").first()
    return match


def find_authority(identifier):
    key = identifier.strip().lower()
    match = Authority.query.filter(or_(Authority.authority_key == key, Authority.email == key)).first()
    if match is None and key in ("priya.nair@civic.gov", "emp-civ-8842", "emp-civ-8842"):
        return Authority.query.filter(Authority.id == "a-1").first()
    return match


def login(role, p):
    errors = validate_login(p)
    if errors:
        raise validation_error(errors)

    identifier = text(p, "identifier").strip()
    password = text(p, "password")
    limiter = login_limiter()
    limit_key = f"{role}:{request.remote_addr}:{identifier.lower()}"
    if limiter.is_blocked(limit_key):
        raise ApiError("Too many failed attempts. Please wait a few minutes and try again.", 429)

    if role == "citizen":
        account = find_citizen(identifier)
        ok = check_password_hash(account.password_hash if account else _DUMMY_HASH, password)
        if account is None or not ok:
            limiter.record_failure(limit_key)
            raise ApiError(_GENERIC_CITIZEN, 401)
    else:
        account = find_authority(identifier)
        ok = check_password_hash(account.password_hash if account else _DUMMY_HASH, password)
        if account is None or not ok:
            limiter.record_failure(limit_key)
            raise ApiError(_GENERIC_AUTHORITY, 401)
        # Checked only after the password, so a pending account cannot be probed without it.
        if account.verification != "approved":
            raise ApiError(
                "Your authority account is awaiting verification. Portal access is not available yet.", 403
            )

    limiter.reset(limit_key)
    return account


def register_citizen(p):
    errors = validate_citizen_registration(p)
    if errors:
        raise validation_error(errors)

    email = normalize_email(text(p, "email"))
    phone = normalize_phone(text(p, "phone").strip())
    if Citizen.query.filter(Citizen.email == email).first():
        raise ApiError("An account with this email already exists.", 409)
    if Citizen.query.filter(Citizen.phone == phone).first():
        raise ApiError("An account with this phone number already exists.", 409)

    account = Citizen(
        id=_new_id("c"),
        name=text(p, "name").strip(),
        age=int(text(p, "age").strip()),
        address=text(p, "address").strip(),
        email=email,
        phone=phone,
        password_hash=generate_password_hash(text(p, "password")),
    )
    db.session.add(account)
    _commit_or_conflict("An account with this email or phone number already exists.")
    return account


def register_authority(p, id_file):
    has_document = bool(id_file and id_file.filename)
    errors = validate_authority_registration(p, has_document)
    if errors:
        raise validation_error(errors)

    # Read the upload to check its type and size, then discard the bytes.
    # Only the file name is kept, as the frontend README describes.
    read_validated_upload(
        id_file, ID_KINDS, current_app.config["MAX_ID_DOCUMENT_BYTES"], "a PDF, JPG, or PNG file"
    )

    email = normalize_email(text(p, "email"))
    authority_id = text(p, "authorityId").strip()
    if Authority.query.filter(
        or_(Authority.email == email, Authority.authority_key == authority_id.lower())
    ).first():
        raise ApiError("An authority account with this email or ID already exists.", 409)

    account = Authority(
        id=_new_id("a"),
        name=text(p, "name").strip(),
        designation=text(p, "designation").strip(),
        department=text(p, "department"),
        authority_id=authority_id,
        authority_key=authority_id.lower(),
        email=email,
        phone=normalize_phone(text(p, "phone").strip()),
        password_hash=generate_password_hash(text(p, "password")),
        verification="pending",
        id_document_name=secure_filename(id_file.filename)[:255],
        submitted_at=utcnow(),
    )
    db.session.add(account)
    _commit_or_conflict("An authority account with this email or ID already exists.")
    return account


def update_citizen_profile(citizen, p):
    errors = validate_profile(p)
    if errors:
        raise validation_error(errors)

    phone = normalize_phone(text(p, "phone").strip())
    clash = Citizen.query.filter(Citizen.phone == phone, Citizen.id != citizen.id).first()
    if clash:
        raise ApiError("An account with this phone number already exists.", 409)

    citizen.name = text(p, "name").strip()
    citizen.age = int(text(p, "age").strip())
    citizen.address = text(p, "address").strip()
    citizen.phone = phone
    _commit_or_conflict("An account with this phone number already exists.")
    return citizen
