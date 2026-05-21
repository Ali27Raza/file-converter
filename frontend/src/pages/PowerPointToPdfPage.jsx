import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { OnPageSeoContent } from "../components/OnPageSeoContent";

const ALLOWED = ["ppt", "pptx"];

export function PowerPointToPdfPage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-[var(--bg)]">
      <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        <div className="md:flex-1 mb-8 md:mb-0">
          <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--accent)', background: 'rgba(232,255,71,0.06)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
            <span className="font-semibold">POWERPOINT TO PDF</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
            Convert <span className="text-[var(--accent)]">PowerPoint</span><br />to PDF.
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)]">PPT · PPTX to PDF</p>
        </div>

        <div className="w-full md:w-96">
          <ConverterWidget allowedInputExts={ALLOWED} forcedOutputFormat="pdf" />
        </div>
      </div>

      <OnPageSeoContent
        toolName="PowerPoint to PDF Converter"
        intro="Convert PPT and PPTX slides into portable PDF files that are easy to share and present."
        steps={[
          "Upload your PowerPoint file.",
          "Start PDF conversion.",
          "Download your PDF slides.",
        ]}
        faqs={[
          { q: "Does it support PPTX?", a: "Yes, both PPT and PPTX are supported." },
          { q: "Why convert slides to PDF?", a: "PDF ensures consistent viewing across devices." },
          { q: "Can I open the output anywhere?", a: "Yes, PDF files are widely supported." },
        ]}
        relatedLinks={[
          { to: "/excel-to-pdf", label: "Excel to PDF" },
          { to: "/word-to-pdf", label: "Word to PDF" },
        ]}
        trustNote="A reliable way to share slide decks without formatting shifts."
        updatedAt="May 2026"
      />
    </div>
  );
}
