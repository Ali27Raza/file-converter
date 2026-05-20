from spire.xls import Workbook as XlsWorkbook, FileFormat as XlsFileFormat


def convert_excel_to_pdf(input_path, output_path):
    workbook = XlsWorkbook()
    try:
        workbook.LoadFromFile(input_path)
        workbook.SaveToFile(output_path, XlsFileFormat.PDF)
    finally:
        workbook.Dispose()
