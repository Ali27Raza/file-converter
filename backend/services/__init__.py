from .word_converter import convert_word_to_pdf
from .inpage_converter import convert_inp_to_pdf
from .excel_converter import convert_excel_to_pdf
from .ppt_converter import convert_powerpoint_to_pdf
from .image_converter import convert_image_to_pdf, convert_image_to_image, convert_pdf_to_images
from .pdf_converter import convert_pdf_to_word
from config import WORD_EXTENSIONS, INPAGE_EXTENSIONS, EXCEL_EXTENSIONS, POWERPOINT_EXTENSIONS, IMAGE_EXTENSIONS


def convert_to_pdf(input_path, output_path, extension):
    if extension in WORD_EXTENSIONS:
        convert_word_to_pdf(input_path, output_path)
    elif extension in INPAGE_EXTENSIONS:
        convert_inp_to_pdf(input_path, output_path)
    elif extension in EXCEL_EXTENSIONS:
        convert_excel_to_pdf(input_path, output_path)
    elif extension in POWERPOINT_EXTENSIONS:
        convert_powerpoint_to_pdf(input_path, output_path)
    elif extension in IMAGE_EXTENSIONS:
        convert_image_to_pdf(input_path, output_path)
    else:
        raise ValueError(f"Unsupported file type: .{extension}")
