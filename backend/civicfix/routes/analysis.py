from flask import Blueprint, g, jsonify

from ..security import login_required
from ..services import complaints as svc
from ..utils import payload

bp = Blueprint("analysis", __name__, url_prefix="/api/analysis")


@bp.post("")
@login_required()
def analyze():
    return jsonify(svc.analyze_draft(g.account, payload()))
