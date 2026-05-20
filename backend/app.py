import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from config import UPLOAD_FOLDER
from routes import convert_bp, convert_pdf_bp, convert_doc_to_image_bp, convert_image_bp, blog_bp

app = Flask(__name__)
CORS(app)

# Ensure uploads directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Register blueprints
app.register_blueprint(convert_bp)
app.register_blueprint(convert_pdf_bp)
app.register_blueprint(convert_doc_to_image_bp)
app.register_blueprint(convert_image_bp)
app.register_blueprint(blog_bp)
    # convert_inpage blueprint not present/implemented


@app.route("/")
def home():
    return "Backend is Running!"


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(
        UPLOAD_FOLDER,
        filename,
        as_attachment=True,
        download_name=filename,
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
