import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { OnPageSeoContent } from "../components/OnPageSeoContent";

const ALLOWED = ["pdf"];

export function PdfToWordPage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-[var(--bg)]">
      <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        <div className="md:flex-1 mb-8 md:mb-0">
          <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--accent)', background: 'rgba(232,255,71,0.06)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
            <span className="font-semibold">PDF → WORD</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
            Convert <span className="text-[var(--accent)]">PDF</span><br />to Word.
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)]">PDF → DOCX</p>
        </div>

        <div className="w-full md:w-96">
          <ConverterWidget allowedInputExts={ALLOWED} />
        </div>
      </div>

      <OnPageSeoContent
        toolName="PDF to Word Converter"
        intro="Convert PDF files into editable DOCX files to continue editing text and structure in Word."
        steps={[
          "Upload your PDF file.",
          "Start conversion to DOCX format.",
          "Download and edit the Word file.",
        ]}
        faqs={[
          { q: "Will text remain editable?", a: "Yes, output is generated as editable DOCX." },
          { q: "Can scanned PDFs be converted?", a: "Text-based PDFs convert best; scanned files may vary." },
          { q: "Is this tool free?", a: "Yes, you can use it for free." },
        ]}
        relatedLinks={[
          { to: "/word-to-pdf", label: "Word to PDF" },
          { to: "/pdf-to-image", label: "PDF to Image" },
        ]}
        trustNote="Built for quick editing workflows from PDF to DOCX."
        updatedAt="May 2026"
      />
    </div>
  );
}
