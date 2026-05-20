import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { OnPageSeoContent } from "../components/OnPageSeoContent";

const ALLOWED = ["inp"]; // placeholder extension for InPage

export function InPageToPdfPage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-[var(--bg)]">
      <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        <div className="md:flex-1 mb-8 md:mb-0">
          <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--accent)', background: 'rgba(232,255,71,0.06)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
            <span className="font-semibold">INPAGE → PDF</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
            Convert <span className="text-[var(--accent)]">InPage</span><br />to PDF.
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)]">INPAGE → PDF</p>
        </div>

        <div className="w-full md:w-96">
          <ConverterWidget allowedInputExts={ALLOWED} forcedOutputFormat="pdf" />
        </div>
      </div>

      <OnPageSeoContent
        toolName="InPage to PDF Converter"
        intro="Convert .inp files into PDF for easy sharing, printing, and archival use."
        steps={[
          "Upload your InPage (.inp) document.",
          "Start conversion to PDF.",
          "Download the generated PDF file.",
        ]}
        faqs={[
          { q: "What input file is supported?", a: "This tool supports .inp files." },
          { q: "Why might conversion fail?", a: "InPage conversion requires proper backend support and environment setup." },
          { q: "Is the output shareable?", a: "Yes, PDF output can be shared and opened widely." },
        ]}
        relatedLinks={[
          { to: "/inpage-to-image", label: "InPage to Image" },
          { to: "/pdf-to-word", label: "PDF to Word" },
        ]}
        trustNote="Designed for users who need modern, portable output from InPage documents."
        updatedAt="May 2026"
      />
    </div>
  );
}
