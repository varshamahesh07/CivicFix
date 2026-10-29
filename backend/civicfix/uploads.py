"""Upload handling. Type is decided by file signature (magic bytes), never by the client's declared MIME type."""
import os
import uuid

from flask import current_app, send_from_directory

from .errors import ApiError

IMAGE_KINDS = ("jpg", "png", "webp")
ID_KINDS = ("pdf", "jpg", "png")
MIME_TYPES = {"jpg": "image/jpeg", "png": "image/png", "webp": "image/webp", "pdf": "application/pdf"}


def detect_kind(head):
    if head.startswith(b"\xff\xd8\xff"):
        return "jpg"
    if head.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return "webp"
    if head.startswith(b"%PDF-"):
        return "pdf"
    return None


def read_validated_upload(storage, allowed, max_bytes, label):
    data = storage.read(max_bytes + 1)
    if not data:
        raise ApiError("The selected file is empty.")
    if len(data) > max_bytes:
        raise ApiError(f"This file is too large. The limit is {max_bytes // (1024 * 1024)} MB.")
    kind = detect_kind(data)
    if kind not in allowed:
        raise ApiError(f"Unsupported file type. Please upload {label}.")
    return data, kind


def save_upload(data, kind, folder):
    """Store under a random name so user-supplied file names never touch the filesystem path."""
    rel = f"{folder}/{uuid.uuid4().hex}.{kind}"
    full = os.path.join(current_app.config["UPLOAD_FOLDER"], rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "wb") as fh:
        fh.write(data)
    return rel


def remove_upload(rel):
    try:
        os.remove(os.path.join(current_app.config["UPLOAD_FOLDER"], rel))
    except OSError:
        pass


def send_upload(rel):
    kind = rel.rsplit(".", 1)[-1]
    return send_from_directory(
        current_app.config["UPLOAD_FOLDER"], rel, mimetype=MIME_TYPES[kind], max_age=0
    )
