from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from spire.doc import Document, ToPdfParameterList
from spire.xls import Workbook as XlsWorkbook, FileFormat as XlsFileFormat
from spire.presentation import Presentation as PptPresentation, FileFormat as PptFileFormat
from PIL import Image, ImageSequence
import os
import io
import zipfile

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
WORD_EXTENSIONS = {"doc", "docx"}
EXCEL_EXTENSIONS = {"xls", "xlsx"}
POWERPOINT_EXTENSIONS = {"ppt", "pptx"}
IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}
ALLOWED_EXTENSIONS = WORD_EXTENSIONS | EXCEL_EXTENSIONS | POWERPOINT_EXTENSIONS | IMAGE_EXTENSIONS
PDF_EXTENSION = "pdf"
PDF_TO_OUTPUT_FORMATS = {"jpg", "jpeg", "png", "word", "docx"}
IMAGE_TO_OUTPUT_FORMATS = {"jpg", "jpeg", "png", "webp", "gif"}

if not os.path.exists(UPLOAD_FOLDER):
	os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
	return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_extension(filename):
	return filename.rsplit(".", 1)[1].lower()


def convert_word_to_pdf(input_path, output_path):
	document = Document()
	try:
		document.LoadFromFile(input_path)
		parameters = ToPdfParameterList()
		parameters.CreateWordBookmarks = True
		document.SaveToFile(output_path, parameters)
	finally:
		document.Close()


def convert_excel_to_pdf(input_path, output_path):
	workbook = XlsWorkbook()
	try:
		workbook.LoadFromFile(input_path)
		workbook.SaveToFile(output_path, XlsFileFormat.PDF)
	finally:
		workbook.Dispose()


def convert_powerpoint_to_pdf(input_path, output_path):
	presentation = PptPresentation()
	try:
		presentation.LoadFromFile(input_path)
		presentation.SaveToFile(output_path, PptFileFormat.PDF)
	finally:
		presentation.Dispose()


def convert_image_to_pdf(input_path, output_path):
	with Image.open(input_path) as image:
		if getattr(image, "is_animated", False) and getattr(image, "n_frames", 1) > 1:
			frames = []
			for frame in ImageSequence.Iterator(image):
				frames.append(frame.convert("RGB"))

			first_frame, remaining_frames = frames[0], frames[1:]
			first_frame.save(
				output_path,
				"PDF",
				resolution=100.0,
				save_all=True,
				append_images=remaining_frames,
			)
		else:
			image.convert("RGB").save(output_path, "PDF", resolution=100.0)


def convert_to_pdf(input_path, output_path, extension):
	if extension in WORD_EXTENSIONS:
		convert_word_to_pdf(input_path, output_path)
	elif extension in EXCEL_EXTENSIONS:
		convert_excel_to_pdf(input_path, output_path)
	elif extension in POWERPOINT_EXTENSIONS:
		convert_powerpoint_to_pdf(input_path, output_path)
	elif extension in IMAGE_EXTENSIONS:
		convert_image_to_pdf(input_path, output_path)
	else:
		raise ValueError(f"Unsupported file type: .{extension}")


def convert_pdf_to_images(input_path, output_dir, base_name, output_format):
	try:
		import fitz  # type: ignore[import-not-found]  # PyMuPDF
	except Exception as import_error:
		raise RuntimeError("PyMuPDF is not installed. Please install pymupdf.") from import_error

	pdf_document = fitz.open(input_path)
	try:
		if pdf_document.page_count == 0:
			raise ValueError("Input PDF has no pages")

		image_ext = "jpg" if output_format in {"jpg", "jpeg"} else "png"
		page_count = pdf_document.page_count

		if page_count == 1:
			output_filename = f"{base_name}.{image_ext}"
			output_path = os.path.join(output_dir, output_filename)

			page = pdf_document.load_page(0)
			pixmap = page.get_pixmap(dpi=200)
			image = Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGB")
			if image_ext == "jpg":
				image.save(output_path, "JPEG", quality=95)
			else:
				image.save(output_path, "PNG")

			return output_filename, output_path, image_ext, page_count

		zip_filename = f"{base_name}_{image_ext}_pages.zip"
		zip_path = os.path.join(output_dir, zip_filename)
		with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
			for page_index in range(page_count):
				page = pdf_document.load_page(page_index)
				pixmap = page.get_pixmap(dpi=200)
				image = Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGB")

				image_filename = f"{base_name}_page_{page_index + 1}.{image_ext}"
				image_output_path = os.path.join(output_dir, image_filename)
				if image_ext == "jpg":
					image.save(image_output_path, "JPEG", quality=95)
				else:
					image.save(image_output_path, "PNG")

				archive.write(image_output_path, arcname=image_filename)
				os.remove(image_output_path)

		return zip_filename, zip_path, image_ext, page_count
	finally:
		pdf_document.close()


def convert_pdf_to_word(input_path, output_path):
	try:
		from pdf2docx import Converter as PdfToDocxConverter  # type: ignore[import-not-found]
	except Exception as import_error:
		raise RuntimeError("pdf2docx is not installed. Please install pdf2docx.") from import_error

	converter = PdfToDocxConverter(input_path)
	try:
		converter.convert(output_path, start=0, end=None)
	finally:
		converter.close()


def convert_image_to_image(input_path, output_path, output_format):
	with Image.open(input_path) as image:
		is_animated = getattr(image, "is_animated", False) and getattr(image, "n_frames", 1) > 1

		if output_format in {"jpg", "jpeg"}:
			base = image.convert("RGB") if not is_animated else next(ImageSequence.Iterator(image)).convert("RGB")
			base.save(output_path, "JPEG", quality=95)
		elif output_format == "png":
			base = image.convert("RGBA") if image.mode not in {"RGBA", "LA", "P"} else image.convert("RGBA")
			if is_animated:
				base = next(ImageSequence.Iterator(image)).convert("RGBA")
			base.save(output_path, "PNG")
		elif output_format == "webp":
			if is_animated:
				frames = [frame.convert("RGBA") for frame in ImageSequence.Iterator(image)]
				first_frame, remaining_frames = frames[0], frames[1:]
				first_frame.save(
					output_path,
					"WEBP",
					save_all=True,
					append_images=remaining_frames,
					quality=90,
				)
			else:
				image.convert("RGBA").save(output_path, "WEBP", quality=90)
		elif output_format == "gif":
			if is_animated:
				frames = [frame.convert("P", palette=Image.ADAPTIVE) for frame in ImageSequence.Iterator(image)]
				first_frame, remaining_frames = frames[0], frames[1:]
				first_frame.save(
					output_path,
					"GIF",
					save_all=True,
					append_images=remaining_frames,
					loop=0,
				)
			else:
				image.convert("P", palette=Image.ADAPTIVE).save(output_path, "GIF")
		else:
			raise ValueError(f"Unsupported image output format: {output_format}")


@app.route("/")
def home():
	return "Flask backend for multi-format to PDF conversion is running!"


@app.route("/convert", methods=["POST"])
def convert_file():
	if "file" not in request.files:
		return jsonify({"error": "No file part in the request"}), 400

	file = request.files["file"]
	if file.filename == "":
		return jsonify({"error": "No file selected"}), 400

	if not allowed_file(file.filename):
		return jsonify({"error": "Only .doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .webp, .gif files are allowed"}), 400

	input_path = None
	output_path = None

	try:
		filename = secure_filename(file.filename)
		extension = get_extension(filename)
		input_path = os.path.join(UPLOAD_FOLDER, filename)
		file.save(input_path)

		output_filename = os.path.splitext(filename)[0] + ".pdf"
		output_path = os.path.join(UPLOAD_FOLDER, output_filename)

		convert_to_pdf(input_path, output_path, extension)

		if not os.path.exists(output_path):
			return jsonify({"error": "Conversion failed - output file not created"}), 500

		# Remove uploaded input file after successful conversion
		os.remove(input_path)

		return jsonify(
			{
				"downloadUrl": f"http://localhost:5000/uploads/{output_filename}",
				"filename": output_filename,
				"outputFormat": "pdf",
			}
		)

	except Exception as error:
		if input_path and os.path.exists(input_path):
			os.remove(input_path)
		if output_path and os.path.exists(output_path):
			os.remove(output_path)

		return jsonify({"error": f"Conversion failed: {str(error)}"}), 500


@app.route("/convert-pdf", methods=["POST"])
def convert_pdf_file():
	if "file" not in request.files:
		return jsonify({"error": "No file part in the request"}), 400

	file = request.files["file"]
	if file.filename == "":
		return jsonify({"error": "No file selected"}), 400

	filename = secure_filename(file.filename)
	if not filename.lower().endswith(f".{PDF_EXTENSION}"):
		return jsonify({"error": "Only .pdf files are allowed for this endpoint"}), 400

	output_format = request.form.get("outputFormat", "jpg").lower().strip()
	if output_format not in PDF_TO_OUTPUT_FORMATS:
		return jsonify({"error": "outputFormat must be one of: jpg, jpeg, png, word, docx"}), 400

	input_path = None
	output_path = None

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
				input_path,
				UPLOAD_FOLDER,
				base_name,
				ext,
			)
			package_type = "zip" if output_filename.lower().endswith(".zip") else "file"

		if not os.path.exists(output_path):
			return jsonify({"error": "Conversion failed - output file not created"}), 500

		os.remove(input_path)

		return jsonify(
			{
				"downloadUrl": f"http://localhost:5000/uploads/{output_filename}",
				"filename": output_filename,
				"outputFormat": response_format,
				"pageCount": page_count,
				"packageType": package_type,
			}
		)

	except Exception as error:
		if input_path and os.path.exists(input_path):
			os.remove(input_path)
		if output_path and os.path.exists(output_path):
			os.remove(output_path)

		return jsonify({"error": f"Conversion failed: {str(error)}"}), 500


@app.route("/convert-doc-to-image", methods=["POST"])
def convert_doc_to_image():
	if "file" not in request.files:
		return jsonify({"error": "No file part in the request"}), 400

	file = request.files["file"]
	if file.filename == "":
		return jsonify({"error": "No file selected"}), 400

	filename = secure_filename(file.filename)
	extension = get_extension(filename) if "." in filename else ""
	if extension not in (WORD_EXTENSIONS | POWERPOINT_EXTENSIONS):
		return jsonify({"error": "Only .doc, .docx, .ppt, .pptx files are allowed for this endpoint"}), 400

	output_format = request.form.get("outputFormat", "jpg").lower().strip()
	if output_format not in {"jpg", "jpeg", "png"}:
		return jsonify({"error": "outputFormat must be one of: jpg, jpeg, png"}), 400

	input_path = None
	pdf_path = None
	output_path = None

	try:
		filename_no_ext = os.path.splitext(filename)[0]
		input_path = os.path.join(UPLOAD_FOLDER, filename)
		file.save(input_path)

		# Step 1: Convert Word/PPT to PDF
		pdf_filename = f"{filename_no_ext}_temp.pdf"
		pdf_path = os.path.join(UPLOAD_FOLDER, pdf_filename)
		convert_to_pdf(input_path, pdf_path, extension)

		if not os.path.exists(pdf_path):
			return jsonify({"error": "Conversion failed - PDF intermediate file not created"}), 500

		# Step 2: Convert PDF to images
		ext = "jpg" if output_format in {"jpg", "jpeg"} else "png"
		output_filename, output_path, response_format, page_count = convert_pdf_to_images(
			pdf_path,
			UPLOAD_FOLDER,
			filename_no_ext,
			ext,
		)
		package_type = "zip" if output_filename.lower().endswith(".zip") else "file"

		if not os.path.exists(output_path):
			return jsonify({"error": "Conversion failed - output file not created"}), 500

		# Cleanup temporary files
		os.remove(input_path)
		os.remove(pdf_path)

		return jsonify(
			{
				"downloadUrl": f"http://localhost:5000/uploads/{output_filename}",
				"filename": output_filename,
				"outputFormat": response_format,
				"pageCount": page_count,
				"packageType": package_type,
			}
		)

	except Exception as error:
		if input_path and os.path.exists(input_path):
			os.remove(input_path)
		if pdf_path and os.path.exists(pdf_path):
			os.remove(pdf_path)
		if output_path and os.path.exists(output_path):
			os.remove(output_path)

		return jsonify({"error": f"Conversion failed: {str(error)}"}), 500


@app.route("/convert-image", methods=["POST"])
def convert_image_file():
	if "file" not in request.files:
		return jsonify({"error": "No file part in the request"}), 400

	file = request.files["file"]
	if file.filename == "":
		return jsonify({"error": "No file selected"}), 400

	filename = secure_filename(file.filename)
	extension = get_extension(filename) if "." in filename else ""
	if extension not in IMAGE_EXTENSIONS:
		return jsonify({"error": "Only image files (.jpg, .jpeg, .png, .webp, .gif) are allowed for this endpoint"}), 400

	output_format = request.form.get("outputFormat", "png").lower().strip()
	if output_format not in IMAGE_TO_OUTPUT_FORMATS:
		return jsonify({"error": "outputFormat must be one of: jpg, jpeg, png, webp, gif"}), 400

	input_path = None
	output_path = None

	try:
		input_path = os.path.join(UPLOAD_FOLDER, filename)
		file.save(input_path)

		ext = "jpg" if output_format in {"jpg", "jpeg"} else output_format
		output_filename = f"{os.path.splitext(filename)[0]}.{ext}"
		output_path = os.path.join(UPLOAD_FOLDER, output_filename)

		convert_image_to_image(input_path, output_path, ext)

		if not os.path.exists(output_path):
			return jsonify({"error": "Conversion failed - output file not created"}), 500

		os.remove(input_path)

		return jsonify(
			{
				"downloadUrl": f"http://localhost:5000/uploads/{output_filename}",
				"filename": output_filename,
				"outputFormat": ext,
			}
		)

	except Exception as error:
		if input_path and os.path.exists(input_path):
			os.remove(input_path)
		if output_path and os.path.exists(output_path):
			os.remove(output_path)

		return jsonify({"error": f"Conversion failed: {str(error)}"}), 500


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
	return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == "__main__":
	app.run(debug=True, port=5000)