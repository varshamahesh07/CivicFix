"""Server-side validation. Rules mirror src/utils/validation.js, so the same messages appear in both layers."""
import re

from .constants import AUTHORITY_DEPARTMENTS, CATEGORIES

_EMAIL = re.compile(r"[^\s@]+@[^\s@]+\.[^\s@]{2,}")
_PHONE = re.compile(r"\+?[0-9]{10,15}")
_DIGITS = re.compile(r"[0-9]+")
_STRONG_MSG = "Use at least 8 characters, including three of: uppercase, lowercase, number, symbol."
_MAX_PASSWORD = 256


def text(p, key):
    value = p.get(key)
    return "" if value is None else str(value)


def normalize_email(value):
    return value.strip().lower()


def normalize_phone(value):
    return "".join(ch for ch in value if ch not in " -\t\n")


def is_email(value):
    value = value.strip()
    return len(value) <= 254 and bool(_EMAIL.fullmatch(value))


def is_phone(value):
    return bool(_PHONE.fullmatch(normalize_phone(value)))


def is_whole_between(value, low, high):
    return bool(_DIGITS.fullmatch(value)) and low <= int(value) <= high


def password_problem(pw):
    if len(pw) > _MAX_PASSWORD:
        return "Password is too long."
    classes = sum(
        bool(re.search(pattern, pw))
        for pattern in (r"[A-Z]", r"[a-z]", r"[0-9]", r"[^A-Za-z0-9]")
    )
    if len(pw) < 8 or classes < 3:
        return _STRONG_MSG
    return None


def _name_age_address(p, e):
    if not text(p, "name").strip():
        e["name"] = "Enter your full name."
    age = text(p, "age").strip()
    if not age:
        e["age"] = "Enter your age."
    elif not is_whole_between(age, 13, 120):
        e["age"] = "Enter a valid age between 13 and 120."
    if not text(p, "address").strip():
        e["address"] = "Enter your residential address."


def _phone(p, e):
    phone = text(p, "phone").strip()
    if not phone:
        e["phone"] = "Enter your phone number."
    elif not is_phone(phone):
        e["phone"] = "Enter 10 to 15 digits. A leading + is allowed."


def _password(p, e):
    pw = text(p, "password")
    if not pw:
        e["password"] = "Create a password."
    else:
        problem = password_problem(pw)
        if problem:
            e["password"] = problem
    if text(p, "confirmPassword") != pw:
        e["confirmPassword"] = "Passwords do not match."


def validate_login(p):
    e = {}
    if not text(p, "identifier").strip():
        e["identifier"] = "Enter your email or ID."
    if not text(p, "password"):
        e["password"] = "Enter your password."
    return e


def validate_citizen_registration(p):
    e = {}
    _name_age_address(p, e)
    email = text(p, "email").strip()
    if not email:
        e["email"] = "Enter your email address."
    elif not is_email(email):
        e["email"] = "Enter a valid email address, such as name@example.com."
    _phone(p, e)
    _password(p, e)
    return e


def validate_authority_registration(p, has_id_document):
    e = {}
    if not text(p, "name").strip():
        e["name"] = "Enter your full name."
    if not text(p, "designation").strip():
        e["designation"] = "Enter your designation."
    if text(p, "department") not in AUTHORITY_DEPARTMENTS:
        e["department"] = "Select your department."
    if not text(p, "authorityId").strip():
        e["authorityId"] = "Enter your official employee or authority ID."
    if not has_id_document:
        e["idDocument"] = "Upload a copy of your official ID proof."
    email = text(p, "email").strip()
    if not email:
        e["email"] = "Enter your official email address."
    elif not is_email(email):
        e["email"] = "Enter a valid email address."
    _phone(p, e)
    _password(p, e)
    return e


def validate_profile(p):
    e = {}
    _name_age_address(p, e)
    _phone(p, e)
    return e


def _days(p, e):
    days = text(p, "issueDurationDays").strip() or text(p, "durationDays").strip()
    if not days:
        e["issueDurationDays"] = "Enter the number of days. Use 0 if it started today."
    elif not _DIGITS.fullmatch(days) or int(days) > 36500:
        e["issueDurationDays"] = "Enter a whole number of days (0 or more)."


def validate_complaint(p):
    e = {}
    title = text(p, "title").strip()
    if not title:
        e["title"] = "Give the complaint a short title."
    elif len(title) < 5:
        e["title"] = "The title should be at least 5 characters."
    elif len(title) > 120:
        e["title"] = "The title can be at most 120 characters."

    category = text(p, "category")
    if not category:
        e["category"] = "Select a category."
    elif category not in CATEGORIES:
        e["category"] = "Select a valid category."

    description = text(p, "description").strip()
    if not description:
        e["description"] = "Describe the problem in your own words."
    elif len(description) < 20:
        e["description"] = "Add a little more detail. Use at least 20 characters."
    elif len(description) > 2000:
        e["description"] = "The description can be at most 2000 characters."

    if not text(p, "address").strip():
        e["address"] = "Enter the address or street where the problem is."
    locality = text(p, "locality").strip() or text(p, "location").strip()
    if not locality:
        e["locality"] = "Enter the city or locality."
    landmark = text(p, "nearbyLandmark").strip() or text(p, "landmark").strip()
    if len(landmark) > 200:
        e["nearbyLandmark"] = "The landmark can be at most 200 characters."
    _days(p, e)

    lat, lng = text(p, "latitude").strip(), text(p, "longitude").strip()
    if bool(lat) != bool(lng):
        e["location"] = "Location needs both latitude and longitude."
    elif lat:
        try:
            lat_f, lng_f = float(lat), float(lng)
        except ValueError:
            e["location"] = "Location coordinates are not valid."
        else:
            if not (-90 <= lat_f <= 90 and -180 <= lng_f <= 180):
                e["location"] = "Location coordinates are out of range."
    return e


def validate_analysis_request(p):
    e = {}
    if not text(p, "title").strip():
        e["title"] = "Give the complaint a short title."
    if text(p, "category") not in CATEGORIES:
        e["category"] = "Select a category."
    if not text(p, "description").strip():
        e["description"] = "Describe the problem in your own words."
    locality = text(p, "locality").strip() or text(p, "location").strip()
    if not locality:
        e["locality"] = "Enter the city or locality."
    _days(p, e)
    return e
