// src/utils/conversionService.js
// This handles file conversion using Python backend with docx2pdf library

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// The backend currently supports Word to PDF conversion only.

export const SUPPORTED_FORMATS = {
  PDF: {
    from: ["DOCX", "DOC", "XLSX", "PPTX", "JPG", "PNG", "HTML", "TXT", "EPUB"],
    icon: "📄",
    color: "#e74c3c",
  },
  DOCX: {
    from: ["PDF", "TXT", "HTML", "ODT"],
    icon: "📝",
    color: "#2980b9",
  },
  JPG: {
    from: ["PNG", "WEBP", "GIF", "BMP", "HEIC", "PDF", "SVG"],
    icon: "🖼️",
    color: "#27ae60",
  },
  PNG: {
    from: ["JPG", "WEBP", "GIF", "BMP", "SVG", "PDF"],
    icon: "🖼️",
    color: "#8e44ad",
  },
  MP3: {
    from: ["MP4", "WAV", "M4A", "AAC", "FLAC", "OGG"],
    icon: "🎵",
    color: "#e67e22",
  },
  MP4: {
    from: ["AVI", "MOV", "MKV", "WMV", "FLV"],
    icon: "🎬",
    color: "#c0392b",
  },
  XLSX: {
    from: ["CSV", "ODS", "PDF"],
    icon: "📊",
    color: "#16a085",
  },
  WEBP: {
    from: ["JPG", "PNG", "GIF", "BMP"],
    icon: "🖼️",
    color: "#2c3e50",
  },
};

export const POPULAR_CONVERSIONS = [
  {
    from: "PDF",
    to: "DOCX",
    label: "PDF to Word",
    desc: "Extract text and images from PDF",
  },
  {
    from: "DOCX",
    to: "PDF",
    label: "Word to PDF",
    desc: "Convert .docx to high quality PDF",
  },
  {
    from: "JPG",
    to: "PDF",
    label: "JPG to PDF",
    desc: "Turn multiple images into a PDF",
  },
  {
    from: "XLSX",
    to: "PDF",
    label: "Excel to PDF",
    desc: "Spreadsheets to document format",
  },
  {
    from: "PPTX",
    to: "PDF",
    label: "PPT to PDF",
    desc: "Convert slides to PDF pages",
  },
  {
    from: "JPG",
    to: "PNG",
    label: "JPG to PNG",
    desc: "Convert images to PNG format",
  },
  {
    from: "MP4",
    to: "MP3",
    label: "MP4 to MP3",
    desc: "Extract audio from videos",
  },
  {
    from: "EPUB",
    to: "PDF",
    label: "EPUB to PDF",
    desc: "Convert ebooks to PDF",
  },
  {
    from: "HEIC",
    to: "JPG",
    label: "HEIC to JPG",
    desc: "Convert iPhone photos to JPG",
  },
];

// Convert file using backend API
export async function convertFile(file, outputFormat, userId, onProgress) {
  if (!file) {
    throw new Error("No file selected for conversion.");
  }

  if (outputFormat?.toUpperCase() !== "PDF") {
    throw new Error("This version only supports Word to PDF conversion.");
  }

  onProgress && onProgress({ stage: "uploading", percent: 10 });

  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await fetch(`${BACKEND_URL}/convert`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Conversion failed on backend.");
  }

  onProgress && onProgress({ stage: "converting", percent: 60 });
  onProgress && onProgress({ stage: "done", percent: 100 });

  return {
    success: true,
    downloadUrl: data.downloadUrl,
    filename: data.filename,
    fileSize: file.size,
    outputFormat: "PDF",
  };
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getFileExtension(filename) {
  return filename.split(".").pop().toUpperCase();
}
