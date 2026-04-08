# Python Backend for Word to PDF Conversion

This backend uses the `pypandoc` library to convert Word documents to PDF.

## Setup

1. Install Python dependencies:

```bash
pip install -r requirements.txt
```

2. Run the server:

```bash
python app.py
```

The server will start on http://localhost:5000

## API

### POST /convert

Upload a Word file (.doc or .docx) to convert to PDF.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body: file (Word document)

**Response:**

```json
{
  "downloadUrl": "http://localhost:5000/uploads/converted.pdf",
  "filename": "converted.pdf",
  "outputFormat": "pdf"
}
```

## Requirements

- Python 3.7+
- Pandoc (https://pandoc.org/)
