import os
from datetime import timedelta
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

load_dotenv()

from config import UPLOAD_FOLDER
from routes import convert_bp, convert_pdf_bp, convert_doc_to_image_bp, convert_image_bp, blog_bp, auth_bp

app = Flask(__name__)
CORS(app)

# JWT config
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
JWTManager(app)

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(__file__), "data", "blog_images"), exist_ok=True)

# Register blueprints
app.register_blueprint(convert_bp)
app.register_blueprint(convert_pdf_bp)
app.register_blueprint(convert_doc_to_image_bp)
app.register_blueprint(convert_image_bp)
app.register_blueprint(blog_bp)
app.register_blueprint(auth_bp)


@app.route("/")
def home():
    return "Backend is Running!"


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True, download_name=filename)


@app.route("/blog-images/<path:filename>")
def blog_image(filename):
    images_dir = os.path.join(os.path.dirname(__file__), "data", "blog_images")
    return send_from_directory(images_dir, filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
