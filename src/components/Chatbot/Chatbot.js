// src/components/Chatbot/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

// ============================================================
// FREE API: Google Gemini API (gemini-1.5-flash model)
// Get your free key at: https://aistudio.google.com/app/apikey
// ============================================================
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System context for the chatbot
const SYSTEM_PROMPT = `You are a helpful AI assistant for NextConvertIFile, a free online file conversion website. 
Your name is "ConvertBot" and you help users with:

1. HOW TO CONVERT FILES (step-by-step):
   - Step 1: Go to the homepage and drag & drop your file OR click "Choose File"
   - Step 2: Select your desired output format from the dropdown (e.g., PDF, DOCX, JPG)
   - Step 3: Click the "Convert" button and wait a few seconds
   - Step 4: Click "Download Now" to save your converted file
   - Files are available for 24 hours after conversion

2. SUPPORTED FORMATS:
   Documents: PDF, DOCX (Word), XLSX (Excel), PPTX (PowerPoint), TXT, HTML, EPUB, ODS
   Images: JPG, PNG, WEBP, GIF, BMP, SVG, HEIC, TIFF
   Audio: MP3, WAV, M4A, AAC, FLAC, OGG
   Video: MP4, AVI, MOV, MKV, WMV, FLV
   Spreadsheets: XLSX, CSV, ODS
   Total: 200+ supported formats

3. UPLOAD HELP - Common issues:
   - File too large: Free plan supports up to 50MB. Try compressing first or upgrade to Pro (1GB limit)
   - Format not supported: Check our Tools page for all 50+ supported conversion types
   - Upload stuck: Try refreshing the page, use a different browser, or clear cache
   - Slow upload: Check your internet connection or try a smaller file

4. DOWNLOAD ASSISTANCE:
   - After conversion, click the blue "Download Now" button
   - If download doesn't start: check browser's download settings or popup blocker
   - File missing: Files expire after 24 hours — you'll need to convert again
   - Wrong format: Go back and re-convert selecting the correct output format
   - Share link: Use the "Share" button to copy a shareable download link

5. FAQs — answer these EXACTLY:
   Q: Is this free?
   A: Yes! Basic conversions are completely free with no registration required. We offer a Pro plan ($9.99/month) for unlimited conversions, larger files, and bulk processing.
   
   Q: Is my data safe?
   A: Absolutely. All files are encrypted with 256-bit SSL during transfer. Files are automatically deleted from our servers after 2 hours (or 24 hours for download links). We never share or access your files.
   
   Q: How long does conversion take?
   A: Most conversions complete in 5–30 seconds depending on file size. Large video files may take 1–2 minutes.
   
   Q: What is the maximum file size?
   A: Free plan: 50MB per file. Pro plan: 1GB per file. Business plan: 10GB per file.
   
   Q: Which formats are supported?
   A: We support 200+ formats including PDF, Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, WEBP, MP4, MP3, and many more. Check our Tools page for the full list.
   
   Q: Do I need to create an account?
   A: No! You can convert files without any registration. Creating a free account lets you save conversion history.

Always be friendly, concise, and helpful. If someone asks something unrelated to file conversion, politely redirect them to file conversion topics. 
Respond in the same language the user writes in (if they write in Urdu/Roman Urdu, respond in Roman Urdu mixed with English).
Keep responses short and to the point — use bullet points when listing steps or formats.`;

const QUICK_SUGGESTIONS = [
  { icon: '📋', text: 'How to convert a file?' },
  { icon: '📁', text: 'What formats are supported?' },
  { icon: '⚠️', text: 'File upload not working' },
  { icon: '⬇️', text: 'How to download converted file?' },
  { icon: '🆓', text: 'Is this free to use?' },
  { icon: '🔒', text: 'Is my data safe?' },
];

function TypingIndicator() {
  return (
    <div className="chat-message bot-message typing-message">
      <div className="bot-avatar">
        <BotIcon />
      </div>
      <div className="message-bubble typing-bubble">
        <span className="dot" /><span className="dot" /><span className="dot" />
      </div>
    </div>
  );
}

function BotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="8" width="18" height="12" rx="4" fill="white" opacity="0.9"/>
      <rect x="8" y="4" width="8" height="6" rx="2" fill="white" opacity="0.9"/>
      <circle cx="9" cy="14" r="1.5" fill="#2563eb"/>
      <circle cx="15" cy="14" r="1.5" fill="#2563eb"/>
      <path d="M9 18h6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="1" y="11" width="2" height="4" rx="1" fill="white" opacity="0.7"/>
      <rect x="21" y="11" width="2" height="4" rx="1" fill="white" opacity="0.7"/>
    </svg>
  );
}

function formatMessage(text) {
  // Convert markdown-like formatting to JSX
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i}><strong>{line.slice(2, -2)}</strong></p>;
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return <p key={i} className="bullet-line">• {line.slice(2)}</p>;
    }
    if (line.match(/^\d+\./)) {
      return <p key={i} className="numbered-line">{line}</p>;
    }
    if (line.trim() === '') return <br key={i} />;
    // Bold inline text
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = line.split(boldRegex);
    return (
      <p key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
      </p>
    );
  });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "Hi! I'm **ConvertBot** 👋\n\nI'm here to help you with:\n- File conversion guide\n- Supported formats\n- Upload & download help\n- FAQs about NextConvertIFile\n\nWhat can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  async function sendMessage(userText) {
    if (!userText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: userText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Build conversation history for context
    const newHistory = [
      ...conversationHistory,
      { role: 'user', parts: [{ text: userText.trim() }] }
    ];

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: newHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || "Sorry, I couldn't process that. Please try again!";

      // Update conversation history
      setConversationHistory([
        ...newHistory,
        { role: 'model', parts: [{ text: botReply }] }
      ]);

      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        text: botReply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      if (!isOpen) setHasNewMessage(true);

    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Fallback responses for common questions when API fails
      const fallbackText = getFallbackResponse(userText);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'bot',
        text: fallbackText,
        timestamp: new Date(),
        isError: !fallbackText
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  }

  function getFallbackResponse(question) {
    const q = question.toLowerCase();
    if (q.includes('free') || q.includes('cost') || q.includes('price')) {
      return "✅ Yes! Basic conversions are **completely free** with no registration required.\n\nPro plan ($9.99/mo) gives you unlimited conversions & larger file sizes.";
    }
    if (q.includes('safe') || q.includes('secure') || q.includes('privacy')) {
      return "🔒 Your files are **100% safe**.\n\n- 256-bit SSL encryption during transfer\n- Files auto-deleted after 2 hours\n- We never access or share your files";
    }
    if (q.includes('format') || q.includes('support')) {
      return "📁 We support **200+ formats** including:\n- Documents: PDF, DOCX, XLSX, PPTX\n- Images: JPG, PNG, WEBP, HEIC\n- Audio: MP3, WAV, FLAC\n- Video: MP4, AVI, MOV";
    }
    if (q.includes('how') || q.includes('convert') || q.includes('kaise')) {
      return "📋 **How to convert a file:**\n\n1. Drop your file on the homepage (or click Choose File)\n2. Select output format from dropdown\n3. Click **Convert** button\n4. Click **Download Now** when done!\n\nTakes only 5–30 seconds ⚡";
    }
    if (q.includes('size') || q.includes('limit') || q.includes('large')) {
      return "📦 **File size limits:**\n- Free plan: **50MB** per file\n- Pro plan: **1GB** per file\n- Business plan: **10GB** per file";
    }
    return "I'm having trouble connecting right now. Please try again in a moment, or check our FAQ section on the website for quick answers! 🙏";
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <>
      {/* Chat toggle button */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'chat-open' : ''} ${hasNewMessage ? 'has-notification' : ''}`}
        onClick={() => { setIsOpen(!isOpen); setIsMinimized(false); }}
        aria-label="Open chat assistant"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <BotIcon />
        )}
        {hasNewMessage && <span className="notification-dot" />}
        {!isOpen && <span className="chat-tooltip">Ask ConvertBot</span>}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-bot-avatar">
                <BotIcon />
              </div>
              <div>
                <p className="chat-bot-name">ConvertBot</p>
                <p className="chat-bot-status">
                  <span className="status-dot" /> Always online
                </p>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                className="chat-action-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d={isMinimized ? "M2 9l5-5 5 5" : "M2 5l5 5 5-5"} stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className="chat-action-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="chat-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message ${msg.role === 'user' ? 'user-message' : 'bot-message'} ${msg.isError ? 'error-message' : ''}`}
                  >
                    {msg.role === 'bot' && (
                      <div className="bot-avatar"><BotIcon /></div>
                    )}
                    <div className="message-content">
                      <div className="message-bubble">
                        {formatMessage(msg.text)}
                      </div>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                ))}

                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions */}
              {messages.length <= 2 && !isLoading && (
                <div className="quick-suggestions">
                  <p className="suggestions-label">Quick questions:</p>
                  <div className="suggestions-grid">
                    {QUICK_SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        className="suggestion-chip"
                        onClick={() => sendMessage(s.text)}
                      >
                        <span>{s.icon}</span> {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="chat-input-area">
                <div className="chat-input-wrap">
                  <textarea
                    ref={inputRef}
                    className="chat-input"
                    placeholder="Ask me anything about file conversion..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={isLoading}
                  />
                  <button
                    className="send-btn"
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <p className="chat-footer-note">Powered by Google Gemini AI · Free</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
