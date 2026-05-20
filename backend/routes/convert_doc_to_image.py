import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, BASE_URL, WORD_EXTENSIONS, POWERPOINT_EXTENSIONS
from utils import get_extension, remove_file
from services import convert_to_pdf, convert_pdf_to_images

convert_doc_to_image_bp = Blueprint("convert_doc_to_image", __name__)


@convert_doc_to_image_bp.route("/convert-doc-to-image", methods=["POST"])
def convert_doc_to_image():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    extension = get_extension(filename)
    if extension not in (WORD_EXTENSIONS | POWERPOINT_EXTENSIONS):
        return jsonify({"error": "Only .doc, .docx, .ppt, .pptx files are allowed"}), 400

    output_format = request.form.get("outputFormat", "jpg").lower().strip()
    if output_format not in {"jpg", "jpeg", "png"}:
        return jsonify({"error": "outputFormat must be one of: jpg, jpeg, png"}), 400

    input_path = pdf_path = output_path = None
    try:
        filename_no_ext = os.path.splitext(filename)[0]
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(input_path)

        pdf_filename = f"{filename_no_ext}_temp.pdf"
        pdf_path = os.path.join(UPLOAD_FOLDER, pdf_filename)
        convert_to_pdf(input_path, pdf_path, extension)

        if not os.path.exists(pdf_path):
            return jsonify({"error": "Intermediate PDF conversion failed"}), 500

        ext = "jpg" if output_format in {"jpg", "jpeg"} else "png"
        output_filename, output_path, response_format, page_count = convert_pdf_to_images(
            pdf_path, UPLOAD_FOLDER, filename_no_ext, ext
        )
        package_type = "zip" if output_filename.lower().endswith(".zip") else "file"

        if not os.path.exists(output_path):
            return jsonify({"error": "Image conversion failed"}), 500

        remove_file(input_path)
        remove_file(pdf_path)

        return jsonify({
            "downloadUrl": f"{BASE_URL}/uploads/{output_filename}",
            "filename": output_filename,
            "outputFormat": response_format,
            "pageCount": page_count,
            "packageType": package_type,
        })

    except Exception as e:
        remove_file(input_path)
        remove_file(pdf_path)
        remove_file(output_path)
        return jsonify({"error": f"Conversion failed: {str(e)}"}), 500
