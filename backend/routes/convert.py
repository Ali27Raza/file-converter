import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, BASE_URL
from utils import allowed_file, get_extension, remove_file
from services import convert_to_pdf

convert_bp = Blueprint("convert", __name__)


@convert_bp.route("/convert", methods=["POST"])
def convert_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type"}), 400

    input_path = output_path = None
    try:
        filename = secure_filename(file.filename)
        extension = get_extension(filename)
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        output_filename = os.path.splitext(filename)[0] + ".pdf"
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)

        file.save(input_path)
        convert_to_pdf(input_path, output_path, extension)

        if not os.path.exists(output_path):
            return jsonify({"error": "Conversion failed - output file not created"}), 500

        remove_file(input_path)

        return jsonify({
            "downloadUrl": f"{BASE_URL}/uploads/{output_filename}",
            "filename": output_filename,
            "outputFormat": "pdf",
        })

    except Exception as e:
        remove_file(input_path)
        remove_file(output_path)
        return jsonify({"error": f"Conversion failed: {str(e)}"}), 500
