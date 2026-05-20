import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, BASE_URL, IMAGE_EXTENSIONS, IMAGE_TO_OUTPUT_FORMATS
from utils import get_extension, remove_file
from services import convert_image_to_image

convert_image_bp = Blueprint("convert_image", __name__)


@convert_image_bp.route("/convert-image", methods=["POST"])
def convert_image_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    extension = get_extension(filename)
    if extension not in IMAGE_EXTENSIONS:
        return jsonify({"error": "Only image files (.jpg, .jpeg, .png, .webp, .gif) are allowed"}), 400

    output_format = request.form.get("outputFormat", "png").lower().strip()
    if output_format not in IMAGE_TO_OUTPUT_FORMATS:
        return jsonify({"error": f"outputFormat must be one of: {', '.join(IMAGE_TO_OUTPUT_FORMATS)}"}), 400

    input_path = output_path = None
    try:
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(input_path)

        ext = "jpg" if output_format in {"jpg", "jpeg"} else output_format
        output_filename = f"{os.path.splitext(filename)[0]}.{ext}"
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)

        convert_image_to_image(input_path, output_path, ext)

        if not os.path.exists(output_path):
            return jsonify({"error": "Conversion failed - output file not created"}), 500

        remove_file(input_path)

        return jsonify({
            "downloadUrl": f"{BASE_URL}/uploads/{output_filename}",
            "filename": output_filename,
            "outputFormat": ext,
        })

    except Exception as e:
        remove_file(input_path)
        remove_file(output_path)
        return jsonify({"error": f"Conversion failed: {str(e)}"}), 500
