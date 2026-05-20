import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, BASE_URL
from utils import remove_file
from services.inpage_converter import convert_inp_to_pdf, is_inpage_installed

convert_inpage_bp = Blueprint("convert_inpage", __name__)


@convert_inpage_bp.route("/check-inpage", methods=["GET"])
def check_inpage():
    """Frontend can call this to show/hide the InPage option."""
    return jsonify({"installed": is_inpage_installed()})


@convert_inpage_bp.route("/convert-inpage", methods=["POST"])
def convert_inpage_file():
    if not is_inpage_installed():
        return jsonify({
            "error": "InPage is not installed on this server."
        }), 503

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith(".inp"):
        return jsonify({"error": "Only .inp files are allowed"}), 400

    input_path = output_path = None
    try:
        filename    = secure_filename(file.filename)
        input_path  = os.path.join(UPLOAD_FOLDER, filename)
        output_name = os.path.splitext(filename)[0] + ".pdf"
        output_path = os.path.join(UPLOAD_FOLDER, output_name)

        file.save(input_path)
        convert_inp_to_pdf(input_path, output_path)

        if not os.path.exists(output_path):
            return jsonify({"error": "Conversion failed"}), 500

        remove_file(input_path)

        return jsonify({
            "downloadUrl": f"{BASE_URL}/uploads/{output_name}",
            "filename":    output_name,
            "outputFormat": "pdf",
        })

    except Exception as e:
        remove_file(input_path)
        remove_file(output_path)
        return jsonify({"error": str(e)}), 500