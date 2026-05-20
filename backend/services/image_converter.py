import io
import os
import zipfile
from PIL import Image, ImageSequence


def convert_image_to_pdf(input_path, output_path):
    with Image.open(input_path) as image:
        if getattr(image, "is_animated", False) and getattr(image, "n_frames", 1) > 1:
            frames = [frame.convert("RGB") for frame in ImageSequence.Iterator(image)]
            frames[0].save(
                output_path, "PDF", resolution=100.0,
                save_all=True, append_images=frames[1:]
            )
        else:
            image.convert("RGB").save(output_path, "PDF", resolution=100.0)


def convert_image_to_image(input_path, output_path, output_format):
    with Image.open(input_path) as image:
        is_animated = getattr(image, "is_animated", False) and getattr(image, "n_frames", 1) > 1

        if output_format in {"jpg", "jpeg"}:
            base = (next(ImageSequence.Iterator(image)) if is_animated else image).convert("RGB")
            base.save(output_path, "JPEG", quality=95)

        elif output_format == "png":
            base = (next(ImageSequence.Iterator(image)) if is_animated else image).convert("RGBA")
            base.save(output_path, "PNG")

        elif output_format == "webp":
            if is_animated:
                frames = [f.convert("RGBA") for f in ImageSequence.Iterator(image)]
                frames[0].save(output_path, "WEBP", save_all=True, append_images=frames[1:], quality=90)
            else:
                image.convert("RGBA").save(output_path, "WEBP", quality=90)

        elif output_format == "gif":
            if is_animated:
                frames = [f.convert("P", palette=Image.ADAPTIVE) for f in ImageSequence.Iterator(image)]
                frames[0].save(output_path, "GIF", save_all=True, append_images=frames[1:], loop=0)
            else:
                image.convert("P", palette=Image.ADAPTIVE).save(output_path, "GIF")

        else:
            raise ValueError(f"Unsupported image output format: {output_format}")


def convert_pdf_to_images(input_path, output_dir, base_name, output_format):
    try:
        import fitz
    except ImportError as e:
        raise RuntimeError("PyMuPDF is not installed. Run: pip install pymupdf") from e

    pdf_document = fitz.open(input_path)
    try:
        if pdf_document.page_count == 0:
            raise ValueError("Input PDF has no pages")

        image_ext = "jpg" if output_format in {"jpg", "jpeg"} else "png"
        page_count = pdf_document.page_count

        if page_count == 1:
            output_filename = f"{base_name}.{image_ext}"
            output_path = os.path.join(output_dir, output_filename)
            page = pdf_document.load_page(0)
            pixmap = page.get_pixmap(dpi=200)
            img = Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGB")
            if image_ext == "jpg":
                img.save(output_path, "JPEG", quality=95)
            else:
                img.save(output_path, "PNG")
            return output_filename, output_path, image_ext, page_count

        zip_filename = f"{base_name}_{image_ext}_pages.zip"
        zip_path = os.path.join(output_dir, zip_filename)
        with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for i in range(page_count):
                page = pdf_document.load_page(i)
                pixmap = page.get_pixmap(dpi=200)
                img = Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGB")
                image_filename = f"{base_name}_page_{i + 1}.{image_ext}"
                image_path = os.path.join(output_dir, image_filename)
                if image_ext == "jpg":
                    img.save(image_path, "JPEG", quality=95)
                else:
                    img.save(image_path, "PNG")
                archive.write(image_path, arcname=image_filename)
                os.remove(image_path)

        return zip_filename, zip_path, image_ext, page_count
    finally:
        pdf_document.close()
