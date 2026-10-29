import threading
import time
from collections import deque
from functools import wraps

from flask import current_app, g, request, session

from .errors import ApiError
from .extensions import db
from .models import Authority, Citizen

SAFE_METHODS = frozenset({"GET", "HEAD", "OPTIONS"})


class LoginLimiter:
    """Sliding-window count of failed logins per key.

    Per-process only. Behind several workers, move this to Redis.
    """

    def __init__(self):
        self._lock = threading.Lock()
        self._failures = {}

    def _recent(self, key, window):
        q = self._failures.get(key)
        if q is None:
            return None
        now = time.monotonic()
        while q and now - q[0] > window:
            q.popleft()
        if not q:
            self._failures.pop(key, None)
            return None
        return q

    def is_blocked(self, key):
        limit = current_app.config["LOGIN_MAX_FAILURES"]
        window = current_app.config["LOGIN_WINDOW_SECONDS"]
        with self._lock:
            q = self._recent(key, window)
            return q is not None and len(q) >= limit

    def record_failure(self, key):
        with self._lock:
            self._failures.setdefault(key, deque()).append(time.monotonic())

    def reset(self, key):
        with self._lock:
            self._failures.pop(key, None)


def login_limiter():
    return current_app.extensions["login_limiter"]


def current_account():
    """The signed-in citizen or approved authority, or None. Cached per request."""
    if "account" in g:
        return g.account
    account = None
    uid = session.get("uid")
    role = session.get("role")
    if uid and role == "citizen":
        account = db.session.get(Citizen, uid)
    elif uid and role == "authority":
        account = db.session.get(Authority, uid)
        # A session from an approved account stops working if the account is no longer approved.
        if account is not None and account.verification != "approved":
            account = None
    g.account = account
    return account


def login_required(role=None):
    def decorator(view):
        @wraps(view)
        def wrapper(*args, **kwargs):
            account = current_account()
            if account is None:
                raise ApiError("Please log in to continue.", 401)
            if role and account.role != role:
                raise ApiError("You do not have permission to do this.", 403)
            return view(*args, **kwargs)

        return wrapper

    return decorator


def install_security(app):
    @app.before_request
    def _check_origin():
        # Session cookies are SameSite=Lax. As a second layer, reject state-changing requests from other sites.
        if request.method in SAFE_METHODS or not request.path.startswith("/api/"):
            return None
        origin = request.headers.get("Origin")
        if origin and origin not in current_app.config["CORS_ORIGINS"]:
            raise ApiError("This request came from a site that is not allowed.", 403)
        return None

    @app.after_request
    def _security_headers(resp):
        resp.headers.setdefault("X-Content-Type-Options", "nosniff")
        resp.headers.setdefault("X-Frame-Options", "DENY")
        resp.headers.setdefault("Referrer-Policy", "same-origin")
        if request.path.startswith("/api/"):
            resp.headers["Cache-Control"] = "no-store"
        return resp
