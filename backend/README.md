# NextConvertIFile Backend

A small backend service to convert Word files to PDF using CloudConvert.

## Setup

1. Open a terminal in `backend/`
2. Run `npm install`
3. Copy or update `.env` with your CloudConvert API key:

```
CLOUDCONVERT_API_KEY=your_cloudconvert_api_key_here
```

## Run

```bash
npm start
```

## Usage

Send a POST request to `http://localhost:4000/convert` with form-data:

- field name: `file`
- file: a `.docx` or `.doc` Word document

The response will contain a JSON object with `downloadUrl` for the converted PDF.
