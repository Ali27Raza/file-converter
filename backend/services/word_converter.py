from spire.doc import Document, ToPdfParameterList


def convert_word_to_pdf(input_path, output_path):
    document = Document()
    try:
        document.LoadFromFile(input_path)
        parameters = ToPdfParameterList()
        parameters.CreateWordBookmarks = True
        document.SaveToFile(output_path, parameters)
    finally:
        document.Close()
