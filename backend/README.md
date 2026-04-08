# Python Backend for Multi-Format to PDF Conversion

This backend converts multiple file types to PDF using Spire libraries and Pillow:

- Word: `.doc`, `.docx`
- Excel: `.xls`, `.xlsx`
- PowerPoint: `.ppt`, `.pptx`
- Images: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

It also converts PDF files to other formats:

- PDF to image: `.jpg`, `.png` (all pages; multi-page PDFs are returned as a `.zip` of page images)
- PDF to Word: `.docx`

And image files between formats:

- `.jpg` / `.jpeg` / `.png` / `.webp` / `.gif` to each other

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

Upload a supported file to convert to PDF.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body: file (supported document/image)

**Response:**

```json
{
  "downloadUrl": "http://localhost:5000/uploads/converted.pdf",
  "filename": "converted.pdf",
  "outputFormat": "pdf"
}
```

### POST /convert-pdf

Upload a `.pdf` file and provide `outputFormat` in form-data.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file` (PDF file)
  - `outputFormat` (`jpg`, `jpeg`, `png`, `word`, or `docx`)

**Response:**

```json
{
  "downloadUrl": "http://localhost:5000/uploads/converted.jpg",
  "filename": "converted.jpg",
  "outputFormat": "jpg"
}
```

### POST /convert-image

Upload an image file and provide `outputFormat` in form-data.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file` (image file: jpg/jpeg/png/webp/gif)
  - `outputFormat` (`jpg`, `jpeg`, `png`, `webp`, or `gif`)

## Requirements

- Python 3.7+
- Spire.Doc Python package
- Spire.XLS Python package
- Spire.Presentation Python package
- Pillow Python package
- PyMuPDF Python package
- pdf2docx Python package
