import os
import secrets

from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

from .config import Config
from .errors import ApiError
from .extensions import cors, db
from .security import LoginLimiter, install_security


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)

    if not app.config["SECRET_KEY"]:
        if app.config["APP_ENV"] == "production":
            raise RuntimeError("SECRET_KEY must be set when APP_ENV=production.")
        app.logger.warning("SECRET_KEY is not set. Using a random key; sessions reset on restart.")
        app.config["SECRET_KEY"] = secrets.token_hex(32)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    app.extensions["login_limiter"] = LoginLimiter()

    db.init_app(app)
    cors.init_app(
        app,
        origins=app.config["CORS_ORIGINS"],
        supports_credentials=True,  # required for the session cookie
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        expose_headers=["X-Total-Count"],
        methods=["GET", "POST", "PATCH", "OPTIONS"],
    )
    install_security(app)
    _register_error_handlers(app)
    _register_blueprints(app)

    from . import models  # noqa: F401 (registers the models with SQLAlchemy)
    from .seed import seed_demo_data

    with app.app_context():
        db.create_all()
        try:
            from sqlalchemy import inspect, text
            inspector = inspect(db.engine)
            if "complaints" in inspector.get_table_names():
                cols = [c["name"] for c in inspector.get_columns("complaints")]
                if "voice_transcript" not in cols:
                    with db.engine.connect() as conn:
                        conn.execute(text("ALTER TABLE complaints ADD COLUMN voice_transcript TEXT DEFAULT ''"))
                        conn.commit()
        except Exception:
            pass
        if app.config["DEMO_SEED"]:
            seed_demo_data()

    @app.cli.command("seed-demo")
    def seed_demo_command():
        """Load demo accounts and complaints into an empty database."""
        print("Demo data loaded." if seed_demo_data() else "Database already has data. Nothing loaded.")

    return app


def _register_blueprints(app):
    from .routes.analysis import bp as analysis_bp
    from .routes.auth import bp as auth_bp
    from .routes.complaints import bp as complaints_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(complaints_bp)
    app.register_blueprint(analysis_bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})


def _register_error_handlers(app):
    @app.errorhandler(ApiError)
    def api_error(err):
        body = {"message": err.message}
        if err.errors:
            body["errors"] = err.errors
        return jsonify(body), err.status

    @app.errorhandler(HTTPException)
    def http_error(err):
        messages = {413: "The uploaded file is too large.", 404: "Not found.", 405: "Method not allowed."}
        return jsonify({"message": messages.get(err.code, err.description)}), err.code

    @app.errorhandler(Exception)
    def unexpected(err):
        app.logger.exception("Unhandled error")
        return jsonify({"message": "Something went wrong. Please try again."}), 500
