from flask import Blueprint, g, jsonify, request

from ..errors import ApiError
from ..security import login_required
from ..serializers import complaint_json
from ..services import complaints as svc
from ..uploads import send_upload
from ..utils import payload

bp = Blueprint("complaints", __name__, url_prefix="/api/complaints")


@bp.get("")
@login_required()
def list_complaints():
    rows, total = svc.list_complaints(g.account, request.args)
    resp = jsonify([complaint_json(c, g.account.role) for c in rows])
    resp.headers["X-Total-Count"] = str(total)
    return resp


@bp.post("")
@login_required("citizen")
def create_complaint():
    complaint = svc.create_complaint(g.account, payload(), request.files.get("image"))
    return jsonify(complaint_json(complaint, "citizen")), 201


@bp.get("/<complaint_id>")
@login_required()
def get_complaint(complaint_id):
    complaint = svc.get_complaint(g.account, complaint_id)
    return jsonify(complaint_json(complaint, g.account.role))


@bp.patch("/<complaint_id>/status")
@login_required("authority")
def update_status(complaint_id):
    complaint = svc.update_status(g.account, complaint_id, payload())
    return jsonify(complaint_json(complaint, "authority"))


@bp.get("/<complaint_id>/image")
@login_required()
def complaint_image(complaint_id):
    complaint = svc.get_complaint(g.account, complaint_id)
    if not complaint.image_path:
        raise ApiError("No image is attached to this complaint.", 404)
    return send_upload(complaint.image_path)
