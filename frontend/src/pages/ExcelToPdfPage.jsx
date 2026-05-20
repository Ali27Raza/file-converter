import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { OnPageSeoContent } from "../components/OnPageSeoContent";

const ALLOWED = ["xls", "xlsx"];

export function ExcelToPdfPage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-[var(--bg)]">
      <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        <div className="md:flex-1 mb-8 md:mb-0">
          <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--accent)', background: 'rgba(232,255,71,0.06)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
            <span className="font-semibold">EXCEL → PDF</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
            Convert <span className="text-[var(--accent)]">Excel sheets</span><br />to PDF.
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)]">XLS · XLSX → PDF</p>
        </div>

        <div className="w-full md:w-96">
          <ConverterWidget allowedInputExts={ALLOWED} forcedOutputFormat="pdf" />
        </div>
      </div>

      <OnPageSeoContent
        toolName="Excel to PDF Converter"
        intro="Convert XLS and XLSX spreadsheets to PDF for cleaner sharing, print-ready output, and archiving."
        steps={[
          "Upload your Excel file (XLS or XLSX).",
          "Convert to PDF in one click.",
          "Download the final PDF file.",
        ]}
        faqs={[
          { q: "Are XLS and XLSX both supported?", a: "Yes, both formats are accepted." },
          { q: "Why convert Excel to PDF?", a: "PDF helps preserve layout for sharing and printing." },
          { q: "Do I need software installed?", a: "No extra software is needed on the frontend side." },
        ]}
        relatedLinks={[
          { to: "/powerpoint-to-pdf", label: "PowerPoint to PDF" },
          { to: "/word-to-pdf", label: "Word to PDF" },
        ]}
        trustNote="Great for invoices, reports, and spreadsheet snapshots."
        updatedAt="May 2026"
      />
    </div>
  );
}
