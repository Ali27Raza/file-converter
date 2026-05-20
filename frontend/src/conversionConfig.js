export const FORMAT_MAP = {
  // Office → PDF
  doc:  { label: "Word",       outputs: ["pdf", "jpg", "png"], category: "document" },
  docx: { label: "Word",       outputs: ["pdf", "jpg", "png"], category: "document" },
  inp:  { label: "InPage",     outputs: ["pdf", "jpg", "png"], category: "document" },
  xls:  { label: "Excel",      outputs: ["pdf"],               category: "document" },
  xlsx: { label: "Excel",      outputs: ["pdf"],               category: "document" },
  ppt:  { label: "PowerPoint", outputs: ["pdf", "jpg", "png"], category: "document" },
  pptx: { label: "PowerPoint", outputs: ["pdf", "jpg", "png"], category: "document" },
  // Images
  jpg:  { label: "JPEG",       outputs: ["pdf", "png", "webp", "gif"], category: "image" },
  jpeg: { label: "JPEG",       outputs: ["pdf", "png", "webp", "gif"], category: "image" },
  png:  { label: "PNG",        outputs: ["pdf", "jpg", "webp", "gif"], category: "image" },
  webp: { label: "WebP",       outputs: ["pdf", "jpg", "png", "gif"],  category: "image" },
  gif:  { label: "GIF",        outputs: ["pdf", "jpg", "png", "webp"], category: "image" },
  // PDF
  pdf:  { label: "PDF",        outputs: ["jpg", "png", "docx"],        category: "pdf"   },
};

export const OUTPUT_LABELS = {
  pdf: "PDF", jpg: "JPEG", jpeg: "JPEG", png: "PNG",
  webp: "WebP", gif: "GIF", docx: "Word (.docx)",
};

/**
 * Pick the right API endpoint and FormData based on input + output.
 */
export function buildRequest(file, inputExt, outputFormat) {
  const formData = new FormData();
  formData.append("file", file);

  // PDF → anything
  if (inputExt === "pdf") {
    formData.append("outputFormat", outputFormat);
    return { endpoint: "/convert-pdf", formData };
  }

  // Image → image
  const { category } = FORMAT_MAP[inputExt] || {};
  if (category === "image" && outputFormat !== "pdf") {
    formData.append("outputFormat", outputFormat);
    return { endpoint: "/convert-image", formData };
  }

  // Doc/PPT → image
  if (category === "document" && outputFormat !== "pdf") {
    formData.append("outputFormat", outputFormat);
    return { endpoint: "/convert-doc-to-image", formData };
  }

  // Everything else → PDF
  return { endpoint: "/convert", formData };
}
