from config import WORD_EXTENSIONS, INPAGE_EXTENSIONS, EXCEL_EXTENSIONS, POWERPOINT_EXTENSIONS, IMAGE_EXTENSIONS


def convert_pdf_to_word(input_path, output_path):
    from .pdf_converter import convert_pdf_to_word

    return convert_pdf_to_word(input_path, output_path)


def convert_pdf_to_images(input_path, output_dir, base_name, output_format):
    from .image_converter import convert_pdf_to_images

    return convert_pdf_to_images(input_path, output_dir, base_name, output_format)


def convert_image_to_image(input_path, output_path, output_format):
    from .image_converter import convert_image_to_image

    return convert_image_to_image(input_path, output_path, output_format)


def convert_image_to_pdf(input_path, output_path):
    from .image_converter import convert_image_to_pdf

    return convert_image_to_pdf(input_path, output_path)


def convert_to_pdf(input_path, output_path, extension):
    if extension in WORD_EXTENSIONS:
        from .word_converter import convert_word_to_pdf

        convert_word_to_pdf(input_path, output_path)
    elif extension in INPAGE_EXTENSIONS:
        from .inpage_converter import convert_inp_to_pdf

        convert_inp_to_pdf(input_path, output_path)
    elif extension in EXCEL_EXTENSIONS:
        from .excel_converter import convert_excel_to_pdf

        convert_excel_to_pdf(input_path, output_path)
    elif extension in POWERPOINT_EXTENSIONS:
        from .ppt_converter import convert_powerpoint_to_pdf

        convert_powerpoint_to_pdf(input_path, output_path)
    elif extension in IMAGE_EXTENSIONS:
        convert_image_to_pdf(input_path, output_path)
    else:
        raise ValueError(f"Unsupported file type: .{extension}")
