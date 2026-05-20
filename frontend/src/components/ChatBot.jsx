import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { FaRobot } from "react-icons/fa";
import { FiDownload, FiFileText, FiMessageCircle, FiPaperclip, FiSend, FiX } from "react-icons/fi";
import { FORMAT_MAP, buildRequest, OUTPUT_LABELS } from "../conversionConfig";
import { downloadFile } from "../utils/downloadFile";

const API_BASE = "http://localhost:5000";

const FORMAT_KEYWORDS = {
  pdf:  ["pdf"],
  docx: ["word", "docx", "doc"],
  jpg:  ["jpg", "jpeg"],
  png:  ["png"],
  webp: ["webp"],
  gif:  ["gif"],
};

function parseOutputFormat(text) {
  const lower = text.toLowerCase();
  for (const [fmt, keywords] of Object.entries(FORMAT_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return fmt;
  }
  return null;
}

function getExt(file) {
  return file.name.split(".").pop().toLowerCase();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function BotIcon() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: "rgba(0,0,0,0.48)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 16, flexShrink: 0,
    }}>
      <FaRobot aria-hidden="true" />
    </div>
  );
}

function MessageBubble({ msg, progress, converting }) {
  const isUser = msg.from === "user";

  async function handleDownload() {
    await downloadFile(msg.downloadUrl, msg.filename);
  }

  const bubbleBaseStyle = {
    background: "var(--surface)",
    borderRadius: "12px 12px 12px 2px",
    padding: "12px 14px",
    maxWidth: "min(100%, 100%)",
    fontSize: 13,
    color: "var(--text)",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  const textBubbleStyle = {
    background: isUser ? "rgba(232,255,71,0.08)" : "var(--surface)",
    border: isUser ? "1px solid rgba(232,255,71,0.22)" : "none",
    borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
    padding: "12px 14px",
    maxWidth: "100%",
    fontSize: 13,
    color: "var(--text)",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  if (msg.type === "file") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <div style={{
          ...textBubbleStyle,
          display: "flex",
          alignItems: "center",
          gap: 10,
          maxWidth: "min(92%, 100%)",
        }}>
          <FiFileText size={22} aria-hidden="true" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", wordBreak: "break-all" }}>
              {msg.fileName}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              {formatBytes(msg.fileSize)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (msg.type === "progress") {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, width: "100%" }}>
        <BotIcon />
        <div style={{ ...bubbleBaseStyle, flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 10 }}>{msg.text}</div>
          <div style={{
            height: 6, background: "var(--border)",
            borderRadius: 3, overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${converting ? progress : 100}%`,
              background: "linear-gradient(90deg, var(--accent), var(--accent-dim))",
              borderRadius: 3,
              transition: "width 0.3s ease",
            }} />
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5 }}>
            {converting ? `${progress}%` : "Complete"}
          </div>
        </div>
      </div>
    );
  }

  if (msg.type === "download") {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, width: "100%" }}>
        <BotIcon />
        <div style={{ ...bubbleBaseStyle, flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 12 }}>{msg.text}</div>
          <button
            type="button"
            onClick={handleDownload}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "var(--accent)", color: "#0a0a0f",
              padding: "9px 18px", borderRadius: 10,
              textDecoration: "none", fontWeight: 700, fontSize: 13,
              border: "none", cursor: "pointer",
              maxWidth: "100%",
            }}
          >
            <FiDownload aria-hidden="true" /> Download {msg.filename}
          </button>
        </div>
      </div>
    );
  }

  // Regular text message
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 8, width: "100%" }}>
      {!isUser && <BotIcon />}
      <div style={{ ...textBubbleStyle, maxWidth: "min(90%, 100%)" }}>
        {msg.text}
      </div>
    </div>
  );
}

const GREETING = {
  id: 0,
  from: "bot",
  type: "text",
  text: "Hi! I'm your file conversion assistant.\n\nUpload a file and tell me what format you'd like — I'll convert it instantly.\n\nExample: \"convert my PDF to Word\" or just drop a file here!",
};

export function ChatBot() {
  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState([GREETING]);
  const [inputText, setInputText]   = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingFormat, setPendingFormat] = useState(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress]     = useState(0);
  const [dragging, setDragging]     = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef   = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addMsg(msg) {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), ...msg }]);
  }

  function botSay(text) {
    addMsg({ from: "bot", type: "text", text });
  }

  async function startConversion(file, outputFormat) {
    const inputExt = getExt(file);

    if (!FORMAT_MAP[inputExt]) {
      botSay(`Sorry, .${inputExt} files aren't supported.\n\nSupported: Word, Excel, PowerPoint, PDF, InPage (.inp), and images (JPG, PNG, WebP, GIF).`);
      return;
    }

    if (!FORMAT_MAP[inputExt].outputs.includes(outputFormat)) {
      const supported = FORMAT_MAP[inputExt].outputs
        .map((f) => OUTPUT_LABELS[f] || f.toUpperCase())
        .join(", ");
      botSay(`Can't convert ${FORMAT_MAP[inputExt].label} → ${OUTPUT_LABELS[outputFormat] || outputFormat.toUpperCase()}.\n\nAvailable outputs for ${FORMAT_MAP[inputExt].label}: ${supported}`);
      setPendingFormat(null);
      return;
    }

    const progressId = Date.now();
    addMsg({
      id: progressId,
      from: "bot",
      type: "progress",
      text: `Converting "${file.name}" to ${OUTPUT_LABELS[outputFormat] || outputFormat.toUpperCase()}…`,
    });

    setConverting(true);
    setProgress(0);
    setPendingFile(null);
    setPendingFormat(null);

    const { endpoint, formData } = buildRequest(file, inputExt, outputFormat);

    try {
      const response = await axios.post(`${API_BASE}${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 85));
        },
      });

      setProgress(100);
      setConverting(false);

      const { downloadUrl, filename } = response.data;
      addMsg({
        from: "bot",
        type: "download",
        text: `Done! Your ${OUTPUT_LABELS[outputFormat] || outputFormat.toUpperCase()} file is ready.`,
        downloadUrl,
        filename,
      });
    } catch (err) {
      setConverting(false);
      const msg = err.response?.data?.error || err.message || "Unknown error";
      botSay(`Conversion failed: ${msg}\n\nPlease try again.`);
    }
  }

  async function handleFileSelect(file) {
    if (!file || converting) return;

    const inputExt = getExt(file);

    if (!FORMAT_MAP[inputExt]) {
      botSay(`Unsupported file type ".${inputExt}".\n\nI can handle: Word, Excel, PowerPoint, PDF, InPage (.inp), and images (JPG, PNG, WebP, GIF).`);
      return;
    }

    setPendingFile(file);
    addMsg({ from: "user", type: "file", fileName: file.name, fileSize: file.size });

    if (pendingFormat) {
      await startConversion(file, pendingFormat);
    } else {
      const supported = FORMAT_MAP[inputExt].outputs
        .map((f) => OUTPUT_LABELS[f] || f.toUpperCase())
        .join(", ");
      botSay(`Got "${file.name}" (${FORMAT_MAP[inputExt].label}).\n\nWhat format would you like?\nAvailable: ${supported}`);
    }
  }

  async function handleSend() {
    const text = inputText.trim();
    if (!text || converting) return;

    addMsg({ from: "user", type: "text", text });
    setInputText("");

    const detectedFormat = parseOutputFormat(text);

    if (pendingFile) {
      if (detectedFormat) {
        await startConversion(pendingFile, detectedFormat);
      } else {
        const inputExt = getExt(pendingFile);
        const supported = FORMAT_MAP[inputExt].outputs
          .map((f) => OUTPUT_LABELS[f] || f.toUpperCase())
          .join(", ");
        botSay(`I have your file ready but couldn't detect a target format.\n\nAvailable: ${supported}\n\nTry: "convert to PDF" or "to Word"`);
      }
      return;
    }

    if (detectedFormat) {
      setPendingFormat(detectedFormat);
      botSay(`Got it! I'll convert to ${OUTPUT_LABELS[detectedFormat] || detectedFormat.toUpperCase()}.\n\nNow please upload your file.`);
      return;
    }

    botSay(`I'm here to help convert files!\n\nTry:\n• "convert to PDF" then upload a file\n• Upload a file first, then tell me the format\n• Or drop a file directly in this chat`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [pendingFormat, converting]);

  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function clearPendingFile() {
    setPendingFile(null);
    botSay("File cleared. Upload a new file whenever you're ready.");
  }

  const canSend = inputText.trim().length > 0 && !converting;

  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, left: 16, zIndex: 1000, display: "flex", justifyContent: "flex-end", pointerEvents: "none" }}>
      {isOpen && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            width: "min(420px, calc(100vw - 32px))",
            height: "min(72vh, 620px)",
            maxHeight: "calc(100vh - 32px)",
            background: "var(--bg)",
            border: `1px solid ${dragging ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 16,
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "border-color 0.2s",
            pointerEvents: "auto",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "rgba(0,0,0,0.28)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>
                <FaRobot aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0a0a0f" }}>
                  FileForge Assistant
                </div>
                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.55)" }}>
                    {converting ? "Converting…" : <span style={{ color: "#1f8f3a" }}>Online · Ready to convert</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(0,0,0,0.12)",
                border: "none", borderRadius: "50%",
                padding: "8px 8px", cursor: "pointer",
                color: "#0a0a0f", fontSize: 14, fontWeight: 700,
                transition: "transform 0.18s ease, background 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.background = "rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(0,0,0,0.12)";
              }}
              ><FiX aria-hidden="true" /></button>
          </div>

          {/* Drag overlay */}
          {dragging && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(232,255,71,0.06)",
              border: "2px dashed var(--accent)",
              borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 10, pointerEvents: "none",
            }}>
              <div style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
                Drop file here
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px",
            display: "flex", flexDirection: "column", gap: 10,
            minHeight: 0,
          }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} progress={progress} converting={converting} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Pending file chip */}
          {pendingFile && !converting && (
            <div style={{
              margin: "0 12px",
              padding: "7px 12px",
              background: "rgba(232,255,71,0.08)",
              border: "1px solid rgba(232,255,71,0.2)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontSize: 12, color: "var(--muted)",
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <FiPaperclip aria-hidden="true" /> {pendingFile.name}
              </span>
              <button
                onClick={clearPendingFile}
                style={{
                  background: "none", border: "none",
                  cursor: "pointer", color: "var(--muted)",
                  fontSize: 13, lineHeight: 1,
                }}
              >Clear</button>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "10px 12px 12px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={converting}
                title="Upload file"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10, padding: "9px 11px",
                  cursor: converting ? "not-allowed" : "pointer",
                  color: "var(--muted)", fontSize: 16, flexShrink: 0,
                  opacity: converting ? 0.5 : 1,
                }}
              ><FiPaperclip aria-hidden="true" /></button>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={converting}
                placeholder='e.g. "convert to PDF"…'
                rows={1}
                style={{
                  flex: 1,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  color: "var(--text)",
                  fontSize: 13,
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  lineHeight: 1.4,
                  opacity: converting ? 0.5 : 1,
                  minWidth: 0,
                }}
              />

              <button
                onClick={handleSend}
                disabled={!canSend}
                style={{
                  background: canSend ? "var(--accent)" : "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "9px 13px",
                  cursor: canSend ? "pointer" : "not-allowed",
                  color: canSend ? "#0a0a0f" : "var(--muted)",
                  fontWeight: 700, fontSize: 16, flexShrink: 0,
                  transition: "background 0.15s",
                }}
              ><FiSend aria-hidden="true" /></button>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, textAlign: "center" }}>
              Drop files anywhere in this chat · Enter to send
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #d1e33a 0%, #93a71b 100%)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isOpen ? 22 : 26,
          boxShadow: "0 4px 20px rgba(232,255,71,0.35)",
          transition: "transform 0.2s, box-shadow 0.2s",
          pointerEvents: "auto",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(232,255,71,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,255,71,0.35)";
        }}
        title={isOpen ? "Close assistant" : "Open file conversion assistant"}
      >
        {isOpen ? <FiMessageCircle aria-hidden="true" /> : <FaRobot aria-hidden="true" />}
      </button>
    </div>
  );
}
