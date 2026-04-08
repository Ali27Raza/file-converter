from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import pypandoc

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'doc', 'docx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return 'Python backend for Word to PDF conversion is running!'

@app.route('/convert', methods=['POST'])
def convert_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Only Word files (.doc, .docx) are allowed'}), 400

    try:
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(input_path)

        # Generate output PDF path
        output_filename = os.path.splitext(filename)[0] + '.pdf'
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)

        # Convert using pypandoc
        pypandoc.convert_file(input_path, 'pdf', outputfile=output_path)

        # Check if conversion was successful
        if not os.path.exists(output_path):
            return jsonify({'error': 'Conversion failed - output file not created'}), 500

        # For simplicity, return the local file path
        # In production, you'd upload to cloud storage and return a URL
        download_url = f'http://localhost:5000/uploads/{output_filename}'

        # Clean up input file
        os.remove(input_path)

        return jsonify({
            'downloadUrl': download_url,
            'filename': output_filename,
            'outputFormat': 'pdf'
        })

    except Exception as e:
        # Clean up files on error
        if 'input_path' in locals() and os.path.exists(input_path):
            os.remove(input_path)
        if 'output_path' in locals() and os.path.exists(output_path):
            os.remove(output_path)

        return jsonify({'error': f'Conversion failed: {str(e)}'}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return app.send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)