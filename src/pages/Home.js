// src/pages/Home.js
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Zap, Shield, UserX, ChevronRight } from 'lucide-react';
import { POPULAR_CONVERSIONS, getFileExtension } from '../utils/conversionService';
import './Home.css';

const TOOL_ICONS = {
  PDF: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="12" height="16" rx="2" fill="#ef4444" opacity="0.2"/>
      <rect x="2" y="1" width="12" height="16" rx="2" stroke="#ef4444" strokeWidth="1.5"/>
      <path d="M5 7h6M5 10h4M5 13h5" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M10 1v4h4" fill="none" stroke="#ef4444" strokeWidth="1.2"/>
    </svg>
  ),
  DOCX: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="12" height="16" rx="2" fill="#2563eb" opacity="0.15"/>
      <rect x="2" y="1" width="12" height="16" rx="2" stroke="#2563eb" strokeWidth="1.5"/>
      <path d="M5 7h6M5 10h6M5 13h4" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  JPG: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="3" width="16" height="13" rx="2" fill="#10b981" opacity="0.15"/>
      <rect x="1" y="3" width="16" height="13" rx="2" stroke="#10b981" strokeWidth="1.5"/>
      <circle cx="6" cy="8" r="1.5" fill="#10b981"/>
      <path d="M1 13l4-4 3 3 3-3 5 4" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  PNG: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="3" width="16" height="13" rx="2" fill="#8b5cf6" opacity="0.15"/>
      <rect x="1" y="3" width="16" height="13" rx="2" stroke="#8b5cf6" strokeWidth="1.5"/>
      <circle cx="6" cy="8" r="1.5" fill="#8b5cf6"/>
      <path d="M1 13l4-4 3 3 3-3 5 4" stroke="#8b5cf6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  MP4: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="3" width="16" height="13" rx="2" fill="#ef4444" opacity="0.15"/>
      <rect x="1" y="3" width="16" height="13" rx="2" stroke="#ef4444" strokeWidth="1.5"/>
      <path d="M7 8l5 2.5-5 2.5V8z" fill="#ef4444"/>
    </svg>
  ),
  MP3: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="12" height="16" rx="2" fill="#f59e0b" opacity="0.15"/>
      <rect x="2" y="1" width="12" height="16" rx="2" stroke="#f59e0b" strokeWidth="1.5"/>
      <path d="M7 13V7l5-1v5" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="7" cy="13" r="1.5" fill="#f59e0b"/>
      <circle cx="12" cy="11" r="1.5" fill="#f59e0b"/>
    </svg>
  ),
  XLSX: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="12" height="16" rx="2" fill="#10b981" opacity="0.15"/>
      <rect x="2" y="1" width="12" height="16" rx="2" stroke="#10b981" strokeWidth="1.5"/>
      <path d="M5 5h6M5 8h6M5 11h6M5 14h4" stroke="#10b981" strokeWidth="1" strokeLinecap="round"/>
      <path d="M9 5v9" stroke="#10b981" strokeWidth="1"/>
    </svg>
  ),
  EPUB: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="12" height="16" rx="2" fill="#f59e0b" opacity="0.15"/>
      <rect x="2" y="1" width="12" height="16" rx="2" stroke="#f59e0b" strokeWidth="1.5"/>
      <path d="M5 6h6M5 9h6M5 12h3" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  HEIC: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="3" width="16" height="13" rx="2" fill="#0ea5e9" opacity="0.15"/>
      <rect x="1" y="3" width="16" height="13" rx="2" stroke="#0ea5e9" strokeWidth="1.5"/>
      <circle cx="7" cy="8" r="1.5" fill="#0ea5e9"/>
      <path d="M1 13l4-4 3 3 3-3 5 4" stroke="#0ea5e9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const FEATURES = [
  {
    icon: <Zap size={22} strokeWidth={2} />,
    title: 'Fast Processing',
    desc: 'Our cloud servers handle conversions in seconds, even for large batches.',
    color: '#2563eb'
  },
  {
    icon: <Shield size={22} strokeWidth={2} />,
    title: 'Secure & Private',
    desc: 'Files are encrypted during transfer and deleted automatically after 2 hours.',
    color: '#2563eb'
  },
  {
    icon: <UserX size={22} strokeWidth={2} />,
    title: 'No Registration',
    desc: 'Start converting right away. No email or account creation required.',
    color: '#2563eb'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [outputFormat, setOutputFormat] = useState('');
  const [draggedFile, setDraggedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setDraggedFile(file);
      if (outputFormat) {
        navigate('/convert', { state: { file, outputFormat } });
      } else {
        navigate('/convert', { state: { file } });
      }
    }
  }, [navigate, outputFormat]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 100 * 1024 * 1024
  });

  function handleConvert() {
    if (draggedFile) {
      navigate('/convert', { state: { file: draggedFile, outputFormat } });
    }
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Convert Your Files <span className="hero-accent">Instantly</span>
          </h1>
          <p className="hero-subtitle">
            Simple 3-step workflow: Upload, Convert, Download. No registration required and completely free.
          </p>

          <div className="hero-card">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="dropzone-icon">
                <Upload size={26} />
              </div>
              <p className="dropzone-title">
                {isDragActive ? 'Drop your file here...' : 'Drag & Drop your files here'}
              </p>
              <p className="dropzone-sub">Supports PDF, DOCX, PNG, JPG, and 200+ more formats</p>
              <button className="btn btn-primary btn-sm dropzone-btn" type="button">
                Choose File
              </button>
            </div>

            {/* Format selector + convert */}
            <div className="format-bar">
              <div className="format-label">Select Output Format</div>
              <div className="format-row">
                <select
                  className="format-select"
                  value={outputFormat}
                  onChange={e => setOutputFormat(e.target.value)}
                >
                  <option value="">Convert to...</option>
                  <optgroup label="Documents">
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX (Word)</option>
                    <option value="TXT">TXT</option>
                    <option value="HTML">HTML</option>
                  </optgroup>
                  <optgroup label="Images">
                    <option value="JPG">JPG</option>
                    <option value="PNG">PNG</option>
                    <option value="WEBP">WEBP</option>
                    <option value="GIF">GIF</option>
                  </optgroup>
                  <optgroup label="Audio / Video">
                    <option value="MP3">MP3</option>
                    <option value="MP4">MP4</option>
                    <option value="WAV">WAV</option>
                  </optgroup>
                  <optgroup label="Spreadsheets">
                    <option value="XLSX">XLSX (Excel)</option>
                    <option value="CSV">CSV</option>
                  </optgroup>
                </select>
                <button className="btn btn-primary" onClick={handleConvert} disabled={!draggedFile || !outputFormat}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Convert
                </button>
              </div>
            </div>
          </div>

          {/* Ad banner below converter */}
          <div className="ad-banner ad-slot">
            <span>ADVERTISEMENT BANNER</span>
          </div>
        </div>

        {/* Right sidebar ad */}
        <aside className="hero-sidebar">
          <div className="ad-slot sidebar-ad">
            <span>ADVERTISEMENT</span>
          </div>
        </aside>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-grid">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon" style={{ color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Conversions */}
      <section className="popular-section">
        <div className="container">
          <h2 className="section-title">Popular Conversions</h2>
          <div className="tools-grid">
            {POPULAR_CONVERSIONS.slice(0, 8).map((c, i) => (
              <a
                key={c.label}
                href={`/convert?from=${c.from}&to=${c.to}`}
                className="tool-card"
                onClick={e => { e.preventDefault(); navigate(`/convert?from=${c.from}&to=${c.to}`); }}
              >
                <div className="tool-icon">{TOOL_ICONS[c.from] || TOOL_ICONS.PDF}</div>
                <span className="tool-label">{c.label}</span>
              </a>
            ))}
            <button className="tool-card tool-card-more" onClick={() => navigate('/tools')}>
              <span className="more-dots">•••</span>
              <span className="tool-label">View All Tools</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-inner">
          <div className="stat">
            <span className="stat-num">50M+</span>
            <span className="stat-label">FILES CONVERTED</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">100%</span>
            <span className="stat-label">FREE FOREVER</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">SSL</span>
            <span className="stat-label">SECURE TRANSFER</span>
          </div>
        </div>
      </section>
    </div>
  );
}
