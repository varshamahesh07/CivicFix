from datetime import datetime, timezone

from flask import request

from .errors import ApiError


def utcnow():
    """Naive UTC timestamp for storage (SQLite has no timezone support)."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def iso(dt):
    """Format like JavaScript's Date.toISOString(), which the frontend sorts and displays."""
    if dt is None:
        return None
    return dt.strftime("%Y-%m-%dT%H:%M:%S") + f".{dt.microsecond // 1000:03d}Z"


def payload():
    """Request fields as a dict. Accepts JSON bodies and multipart/form-data (used for file uploads)."""
    if request.is_json:
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            raise ApiError("Send the request body as a JSON object.", 400)
        return data
    return request.form.to_dict()
