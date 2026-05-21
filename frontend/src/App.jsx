import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { SeoHead } from "./components/SeoHead";
import { HomePage } from "./pages/HomePage";
import { ImageToPdfPage } from "./pages/ImageToPdfPage";
import { WordToImagePage } from "./pages/WordToImagePage";
import { WordToPdfPage } from "./pages/WordToPdfPage";
import { ExcelToPdfPage } from "./pages/ExcelToPdfPage";
import { PowerPointToPdfPage } from "./pages/PowerPointToPdfPage";
import { PdfToWordPage } from "./pages/PdfToWordPage";
import { PdfToImagePage } from "./pages/PdfToImagePage";
import { InPageToPdfPage } from "./pages/InPageToPdfPage";
import { InPageToImagePage } from "./pages/InPageToImagePage";
import { About } from "./pages/About";
import { Help } from "./pages/Help";
import { Blog } from "./pages/Blog";
import { BlogArticlePage } from "./pages/BlogArticlePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ChatBot } from "./components/ChatBot";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminBlogList } from "./pages/admin/AdminBlogList";
import { AdminBlogEditor } from "./pages/admin/AdminBlogEditor";

const SEO_BY_ROUTE = {
  "/": {
    title: "FileForge — Free Online File Converter",
    description: "Convert Word, Excel, PowerPoint, PDF, InPage, and images online for free. Fast, secure, and easy file conversion.",
  },
  "/word-to-pdf": {
    title: "Word to PDF Converter — Free & Fast | FileForge",
    description: "Convert DOC and DOCX files to PDF online in seconds with FileForge. No signup required.",
  },
  "/word-to-image": {
    title: "Word to Image Converter (JPG/PNG) | FileForge",
    description: "Convert Word documents (DOC, DOCX) into JPG or PNG images quickly and securely.",
  },
  "/image-to-pdf": {
    title: "Image to PDF Converter — JPG, PNG, WebP, GIF | FileForge",
    description: "Turn your images into PDF files online. Supports JPG, PNG, WebP, and GIF formats.",
  },
  "/excel-to-pdf": {
    title: "Excel to PDF Converter (XLS/XLSX) | FileForge",
    description: "Convert Excel spreadsheets to high-quality PDF files instantly.",
  },
  "/powerpoint-to-pdf": {
    title: "PowerPoint to PDF Converter (PPT/PPTX) | FileForge",
    description: "Convert PowerPoint slides to PDF with layout preserved. Fast and reliable.",
  },
  "/pdf-to-word": {
    title: "PDF to Word Converter — Editable DOCX | FileForge",
    description: "Convert PDF files into editable Word DOCX documents online.",
  },
  "/pdf-to-image": {
    title: "PDF to Image Converter — JPG/PNG | FileForge",
    description: "Convert PDF pages to image files in JPG or PNG format in just a few clicks.",
  },
  "/inpage-to-pdf": {
    title: "InPage to PDF Converter (.inp) | FileForge",
    description: "Convert InPage (.inp) files to PDF quickly with FileForge.",
  },
  "/inpage-to-image": {
    title: "InPage to Image Converter (.inp to JPG/PNG) | FileForge",
    description: "Convert InPage documents into JPG or PNG images.",
  },
  "/about": {
    title: "About FileForge",
    description: "Learn about FileForge and our mission to make file conversion simple, fast, and secure.",
  },
  "/help": {
    title: "Help Center — FileForge",
    description: "Find answers to common file conversion questions and troubleshooting steps.",
  },
  "/blog": {
    title: "FileForge Blog — Conversion Tips & Guides",
    description: "Read guides and tips for PDF, Word, Excel, PowerPoint, and image conversions.",
  },
};

const ROUTE_FAQS = {
  "/word-to-pdf": [
    { q: "Can I convert DOCX to PDF?", a: "Yes, DOC and DOCX are supported." },
    { q: "Is Word to PDF conversion free?", a: "Yes, this converter is free to use." },
  ],
  "/word-to-image": [
    { q: "What outputs are available?", a: "JPG and PNG output formats are available." },
    { q: "Can I upload DOC files?", a: "Yes, both DOC and DOCX are supported." },
  ],
  "/image-to-pdf": [
    { q: "Which image files are accepted?", a: "JPG, JPEG, PNG, WebP, and GIF are supported." },
    { q: "Is image quality preserved?", a: "The converter is designed to keep visual quality strong." },
  ],
  "/pdf-to-word": [
    { q: "Is output editable?", a: "Yes, output is provided in editable DOCX format." },
    { q: "Can this handle long PDFs?", a: "Longer files are supported, depending on complexity." },
  ],
  "/pdf-to-image": [
    { q: "Can I export PDF pages as PNG?", a: "Yes, PNG and JPG export are supported." },
    { q: "Is this useful for previews?", a: "Yes, PDF-to-image is ideal for previews and sharing." },
  ],
};

const ROUTE_LABELS = {
  "/": "Home",
  "/word-to-pdf": "Word to PDF",
  "/word-to-image": "Word to Image",
  "/image-to-pdf": "Image to PDF",
  "/excel-to-pdf": "Excel to PDF",
  "/powerpoint-to-pdf": "PowerPoint to PDF",
  "/pdf-to-word": "PDF to Word",
  "/pdf-to-image": "PDF to Image",
  "/inpage-to-pdf": "InPage to PDF",
  "/inpage-to-image": "InPage to Image",
  "/about": "About",
  "/help": "Help",
  "/blog": "Blog",
};

function toFaqSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

function toBreadcrumbSchema(pathname) {
  const routeLabel = ROUTE_LABELS[pathname];
  if (!routeLabel || pathname === "/") return null;
  const siteUrl = (import.meta.env.VITE_SITE_URL || "https://yourwebsite.com").replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: routeLabel, item: `${siteUrl}${pathname}` },
    ],
  };
}

function PublicLayout() {
  const location = useLocation();
  const seo = SEO_BY_ROUTE[location.pathname] || {
    title: "Page Not Found | FileForge",
    description: "The page you requested could not be found.",
    robots: "noindex,nofollow",
  };

  const faqSchema = toFaqSchema(ROUTE_FAQS[location.pathname]);
  const breadcrumbSchema = toBreadcrumbSchema(location.pathname);
  const routeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "FileForge",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ];
  if (faqSchema) routeSchemas.push(faqSchema);
  if (breadcrumbSchema) routeSchemas.push(breadcrumbSchema);

  return (
    <>
      <SeoHead
        pathname={location.pathname}
        title={seo.title}
        description={seo.description}
        robots={seo.robots || "index,follow"}
        jsonLd={routeSchemas}
      />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,255,71,0.08) 0%, transparent 70%), var(--bg)",
      }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/image-to-pdf" element={<ImageToPdfPage />} />
            <Route path="/word-to-image" element={<WordToImagePage />} />
            <Route path="/word-to-pdf" element={<WordToPdfPage />} />
            <Route path="/excel-to-pdf" element={<ExcelToPdfPage />} />
            <Route path="/powerpoint-to-pdf" element={<PowerPointToPdfPage />} />
            <Route path="/pdf-to-word" element={<PdfToWordPage />} />
            <Route path="/pdf-to-image" element={<PdfToImagePage />} />
            <Route path="/inpage-to-pdf" element={<InPageToPdfPage />} />
            <Route path="/inpage-to-image" element={<InPageToImagePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticlePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ChatBot />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin routes — standalone, no Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog"
            element={
              <ProtectedRoute>
                <AdminBlogList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/new"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/edit/:slug"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />
          {/* Public site */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
