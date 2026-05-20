def convert_pdf_to_word(input_path, output_path):
    try:
        from pdf2docx import Converter as PdfToDocxConverter
    except ImportError as e:
        raise RuntimeError("pdf2docx is not installed. Run: pip install pdf2docx") from e

    converter = PdfToDocxConverter(input_path)
    try:
        converter.convert(output_path, start=0, end=None)
    finally:
        converter.close()
