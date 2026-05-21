import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { OnPageSeoContent } from "../components/OnPageSeoContent";

const ALLOWED = ["pdf"];
const IMAGE_OUTPUTS = ["jpg", "png"];

export function PdfToImagePage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-[var(--bg)]">
      <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        <div className="md:flex-1 mb-8 md:mb-0">
          <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--accent)', background: 'rgba(232,255,71,0.06)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
            <span className="font-semibold">PDF TO IMAGE</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
            Convert <span className="text-[var(--accent)]">PDF</span><br />to images.
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)]">PDF to JPG · PNG</p>
        </div>

        <div className="w-full md:w-96">
          <ConverterWidget allowedInputExts={ALLOWED} limitOutputs={IMAGE_OUTPUTS} />
        </div>
      </div>

      <OnPageSeoContent
        toolName="PDF to Image Converter"
        intro="Extract PDF pages into JPG or PNG image files for previews, slides, and quick sharing."
        steps={[
          "Upload your PDF file.",
          "Choose JPG or PNG output.",
          "Convert and download your image file(s).",
        ]}
        faqs={[
          { q: "Do all pages convert?", a: "Multi-page PDFs are processed page by page based on converter behavior." },
          { q: "PNG or JPG for better quality?", a: "PNG is usually better for sharp text; JPG gives smaller files." },
          { q: "Can I use it on mobile?", a: "Yes, this tool is mobile-friendly." },
        ]}
        relatedLinks={[
          { to: "/image-to-pdf", label: "Image to PDF" },
          { to: "/pdf-to-word", label: "PDF to Word" },
        ]}
        trustNote="Useful for turning reports and documents into visual assets quickly."
        updatedAt="May 2026"
      />
    </div>
  );
}
