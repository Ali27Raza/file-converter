import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { OnPageSeoContent } from "../components/OnPageSeoContent";

const ALLOWED = ["jpg", "jpeg", "png", "webp", "gif"];

export function ImageToPdfPage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-[var(--bg)]">
      <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        <div className="md:flex-1 mb-8 md:mb-0">
          <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--accent)', background: 'rgba(232,255,71,0.06)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
            <span className="font-semibold">IMAGE TO PDF</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
            Convert <span className="text-[var(--accent)]">images</span><br />to PDF.
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)]">JPG · PNG · WebP · GIF to PDF</p>
        </div>

        <div className="w-full md:w-96">
          <ConverterWidget allowedInputExts={ALLOWED} forcedOutputFormat="pdf" />
        </div>
      </div>

      <OnPageSeoContent
        toolName="Image to PDF Converter"
        intro="Combine or convert JPG, PNG, WebP, and GIF images into high-quality PDF files for easy sharing."
        steps={[
          "Upload a supported image file.",
          "Click convert to generate your PDF.",
          "Download the final PDF document.",
        ]}
        faqs={[
          { q: "Which image formats are supported?", a: "JPG, JPEG, PNG, WebP, and GIF are supported." },
          { q: "Will image quality be reduced?", a: "The tool aims to preserve visual quality during conversion." },
          { q: "Can I convert from mobile?", a: "Yes, the converter works on modern mobile browsers." },
        ]}
        relatedLinks={[
          { to: "/pdf-to-image", label: "PDF to Image" },
          { to: "/word-to-pdf", label: "Word to PDF" },
        ]}
        trustNote="Fast conversion flow for common image-to-document use cases."
        updatedAt="May 2026"
      />
    </div>
  );
}
