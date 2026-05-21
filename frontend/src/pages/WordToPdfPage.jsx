import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { OnPageSeoContent } from "../components/OnPageSeoContent";

const ALLOWED = ["doc", "docx"];

export function WordToPdfPage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-[var(--bg)]">
      <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        <div className="md:flex-1 mb-8 md:mb-0">
          <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--accent)', background: 'rgba(232,255,71,0.06)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
            <span className="font-semibold">WORD TO PDF</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
            Convert <span className="text-[var(--accent)]">Word docs</span><br />to PDF.
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)]">DOC · DOCX to PDF</p>
        </div>

        <div className="w-full md:w-96">
          <ConverterWidget allowedInputExts={ALLOWED} forcedOutputFormat="pdf" />
        </div>
      </div>

      <OnPageSeoContent
        toolName="Word to PDF Converter"
        intro="Convert DOC and DOCX files into PDF while preserving readability and document structure."
        steps={[
          "Upload your DOC or DOCX file.",
          "Click convert to generate a PDF file.",
          "Download the converted PDF instantly.",
        ]}
        faqs={[
          { q: "Will formatting be preserved?", a: "Most common formatting is preserved during conversion." },
          { q: "Do I need to sign up?", a: "No signup is required to use this converter." },
          { q: "Is this free to use?", a: "Yes, conversion is free." },
        ]}
        relatedLinks={[
          { to: "/pdf-to-word", label: "PDF to Word" },
          { to: "/word-to-image", label: "Word to Image" },
        ]}
        trustNote="Your files are processed for conversion and not kept longer than needed."
        updatedAt="May 2026"
      />
    </div>
  );
}
