from spire.presentation import Presentation as PptPresentation, FileFormat as PptFileFormat


def convert_powerpoint_to_pdf(input_path, output_path):
    presentation = PptPresentation()
    try:
        presentation.LoadFromFile(input_path)
        presentation.SaveToFile(output_path, PptFileFormat.PDF)
    finally:
        presentation.Dispose()
