from flask import Blueprint, g, jsonify, request, session

from ..security import login_required
from ..serializers import user_json
from ..services import accounts
from ..utils import payload

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _start_session(account):
    session.clear()  # new session ID on login, so an old one cannot be reused
    session.permanent = True
    session["uid"] = account.id
    session["role"] = account.role


@bp.post("/citizen/register")
def citizen_register():
    account = accounts.register_citizen(payload())
    u = user_json(account, "citizen")
    return jsonify({**u, "user": u}), 201  # registration does not sign in, as in the demo


@bp.post("/authority/register")
def authority_register():
    accounts.register_authority(payload(), request.files.get("idDocument"))
    return jsonify({"status": "pending"}), 201


@bp.post("/citizen/login")
def citizen_login():
    account = accounts.login("citizen", payload())
    _start_session(account)
    u = user_json(account, "citizen")
    return jsonify({**u, "user": u})


@bp.post("/authority/login")
def authority_login():
    account = accounts.login("authority", payload())
    _start_session(account)
    u = user_json(account, "authority")
    return jsonify({**u, "user": u})


@bp.post("/logout")
def logout():
    session.clear()
    return jsonify({"status": "logged_out"})


@bp.get("/me")
@login_required()
def me():
    return jsonify(user_json(g.account, g.account.role))


@bp.patch("/profile")
@login_required("citizen")
def update_profile():
    account = accounts.update_citizen_profile(g.account, payload())
    return jsonify(user_json(account, "citizen"))
