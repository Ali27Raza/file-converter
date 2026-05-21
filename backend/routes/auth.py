import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth_bp", __name__)

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "fileforge@admin2024")


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        token = create_access_token(identity=username)
        return jsonify({"token": token, "username": username})
    return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route("/api/auth/me", methods=["GET"])
@jwt_required()
def me():
    return jsonify({"user": get_jwt_identity()})
