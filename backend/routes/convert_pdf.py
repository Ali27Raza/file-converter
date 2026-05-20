import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, BASE_URL, PDF_TO_OUTPUT_FORMATS
from utils import remove_file
from services import convert_pdf_to_images, convert_pdf_to_word

convert_pdf_bp = Blueprint("convert_pdf", __name__)


@convert_pdf_bp.route("/convert-pdf", methods=["POST"])
def convert_pdf_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    if not filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only .pdf files are allowed"}), 400

    output_format = request.form.get("outputFormat", "jpg").lower().strip()
    if output_format not in PDF_TO_OUTPUT_FORMATS:
        return jsonify({"error": f"outputFormat must be one of: {', '.join(PDF_TO_OUTPUT_FORMATS)}"}), 400

    input_path = output_path = None
    try:
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(input_path)
        base_name = os.path.splitext(filename)[0]

        if output_format in {"word", "docx"}:
            output_filename = f"{base_name}.docx"
            output_path = os.path.join(UPLOAD_FOLDER, output_filename)
            convert_pdf_to_word(input_path, output_path)
            page_count = None
            response_format = "docx"
            package_type = "file"
        else:
            ext = "jpg" if output_format in {"jpg", "jpeg"} else "png"
            output_filename, output_path, response_format, page_count = convert_pdf_to_images(
                input_path, UPLOAD_FOLDER, base_name, ext
            )
            package_type = "zip" if output_filename.lower().endswith(".zip") else "file"

        if not os.path.exists(output_path):
            return jsonify({"error": "Conversion failed - output file not created"}), 500

        remove_file(input_path)

        return jsonify({
            "downloadUrl": f"{BASE_URL}/uploads/{output_filename}",
            "filename": output_filename,
            "outputFormat": response_format,
            "pageCount": page_count,
            "packageType": package_type,
        })

    except Exception as e:
        remove_file(input_path)
        remove_file(output_path)
        return jsonify({"error": f"Conversion failed: {str(e)}"}), 500
