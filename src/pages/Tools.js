// src/pages/Tools.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tools.css';

const ALL_TOOLS = [
  // Documents
  { from: 'PDF', to: 'DOCX', label: 'PDF to Word', category: 'Documents' },
  { from: 'PDF', to: 'XLSX', label: 'PDF to Excel', category: 'Documents' },
  { from: 'PDF', to: 'PPTX', label: 'PDF to PowerPoint', category: 'Documents' },
  { from: 'PDF', to: 'TXT', label: 'PDF to Text', category: 'Documents' },
  { from: 'DOCX', to: 'PDF', label: 'Word to PDF', category: 'Documents' },
  { from: 'XLSX', to: 'PDF', label: 'Excel to PDF', category: 'Documents' },
  { from: 'PPTX', to: 'PDF', label: 'PowerPoint to PDF', category: 'Documents' },
  { from: 'HTML', to: 'PDF', label: 'HTML to PDF', category: 'Documents' },
  { from: 'TXT', to: 'PDF', label: 'Text to PDF', category: 'Documents' },
  { from: 'EPUB', to: 'PDF', label: 'EPUB to PDF', category: 'Documents' },
  // Images
  { from: 'JPG', to: 'PNG', label: 'JPG to PNG', category: 'Images' },
  { from: 'PNG', to: 'JPG', label: 'PNG to JPG', category: 'Images' },
  { from: 'JPG', to: 'WEBP', label: 'JPG to WebP', category: 'Images' },
  { from: 'PNG', to: 'WEBP', label: 'PNG to WebP', category: 'Images' },
  { from: 'WEBP', to: 'JPG', label: 'WebP to JPG', category: 'Images' },
  { from: 'HEIC', to: 'JPG', label: 'HEIC to JPG', category: 'Images' },
  { from: 'BMP', to: 'JPG', label: 'BMP to JPG', category: 'Images' },
  { from: 'GIF', to: 'MP4', label: 'GIF to MP4', category: 'Images' },
  { from: 'SVG', to: 'PNG', label: 'SVG to PNG', category: 'Images' },
  { from: 'JPG', to: 'PDF', label: 'JPG to PDF', category: 'Images' },
  // Audio
  { from: 'MP4', to: 'MP3', label: 'MP4 to MP3', category: 'Audio/Video' },
  { from: 'WAV', to: 'MP3', label: 'WAV to MP3', category: 'Audio/Video' },
  { from: 'MP3', to: 'WAV', label: 'MP3 to WAV', category: 'Audio/Video' },
  { from: 'M4A', to: 'MP3', label: 'M4A to MP3', category: 'Audio/Video' },
  { from: 'FLAC', to: 'MP3', label: 'FLAC to MP3', category: 'Audio/Video' },
  { from: 'AVI', to: 'MP4', label: 'AVI to MP4', category: 'Audio/Video' },
  { from: 'MOV', to: 'MP4', label: 'MOV to MP4', category: 'Audio/Video' },
  { from: 'MKV', to: 'MP4', label: 'MKV to MP4', category: 'Audio/Video' },
  { from: 'WMV', to: 'MP4', label: 'WMV to MP4', category: 'Audio/Video' },
  // Spreadsheets
  { from: 'CSV', to: 'XLSX', label: 'CSV to Excel', category: 'Spreadsheets' },
  { from: 'XLSX', to: 'CSV', label: 'Excel to CSV', category: 'Spreadsheets' },
  { from: 'ODS', to: 'XLSX', label: 'ODS to Excel', category: 'Spreadsheets' },
];

const CATEGORIES = ['All', 'Documents', 'Images', 'Audio/Video', 'Spreadsheets'];

export default function Tools() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ALL_TOOLS.filter(t => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = !search || t.label.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="tools-page">
      <div className="tools-header">
        <h1>All Conversion Tools</h1>
        <p>50+ free online tools to convert any file format</p>
        <input
          type="text"
          placeholder="Search tools (e.g. PDF to Word, JPG to PNG...)"
          className="tools-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="tools-categories">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`cat-btn ${activeCategory === c ? 'active' : ''}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="all-tools-grid">
        {filtered.map(t => (
          <button
            key={t.label}
            className="tool-item"
            onClick={() => navigate(`/convert?from=${t.from}&to=${t.to}`)}
          >
            <div className="tool-item-formats">
              <span className="format-badge from">{t.from}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="format-badge to">{t.to}</span>
            </div>
            <span className="tool-item-name">{t.label}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="tools-empty">
          <p>No tools match your search. Try a different keyword.</p>
        </div>
      )}
    </div>
  );
}
