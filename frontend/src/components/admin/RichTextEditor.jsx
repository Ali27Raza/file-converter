import React, { useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style/text-style";
import { Color } from "@tiptap/extension-text-style/color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import axios from "axios";
import {
  FiBold, FiItalic, FiUnderline, FiCode, FiLink, FiImage,
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiList, FiType,
} from "react-icons/fi";
import {
  MdFormatListNumbered, MdFormatQuote, MdStrikethroughS,
  MdOutlineHighlight, MdOutlineHorizontalRule,
} from "react-icons/md";

const ToolbarBtn = ({ onClick, active, title, children, disabled, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    title={title}
    className="p-1.5 rounded-lg text-sm transition-all flex items-center justify-center"
    style={{
      color: active ? "var(--accent)" : "var(--muted)",
      background: active ? "rgba(232,255,71,0.12)" : "transparent",
      opacity: disabled || loading ? 0.4 : 1,
      minWidth: 28,
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--text)"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = active ? "var(--accent)" : "var(--muted)"; }}
  >
    {loading ? (
      <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin inline-block" />
    ) : children}
  </button>
);

const Divider = () => (
  <span className="w-px self-stretch mx-1" style={{ background: "var(--border)" }} />
);

export function RichTextEditor({ content, onChange, authHeader }) {
  const imageInputRef = useRef(null);
  const [imgUploading, setImgUploading] = React.useState(false);

  const uploadImageFile = useCallback(async (file, editorInstance) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Image must be under 8 MB.");
      return;
    }
    setImgUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await axios.post("/api/admin/blog/upload-image", fd, {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
      });
      editorInstance.chain().focus().setImage({ src: res.data.url }).run();
    } catch {
      alert("Image upload failed.");
    } finally {
      setImgUploading(false);
    }
  }, [authHeader]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: "Write your blog content here…" }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose-editor focus:outline-none min-h-[320px]" },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((i) => i.type.startsWith("image/"));
        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          uploadImageFile(file, editor);
          return true;
        }
        return false;
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const triggerImageUpload = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const onImageFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file && editor) uploadImageFile(file, editor);
    e.target.value = "";
  }, [editor, uploadImageFile]);

  if (!editor) return null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--bg)" }}
    >
      {/* Hidden image file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageFileChange}
      />

      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[var(--border)]"
        style={{ background: "var(--surface)" }}
      >
        {/* Headings */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <span style={{ fontSize: 11, fontWeight: 700 }}>H1</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <span style={{ fontSize: 11, fontWeight: 700 }}>H2</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <span style={{ fontSize: 11, fontWeight: 700 }}>H3</span>
        </ToolbarBtn>

        <Divider />

        {/* Text formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <FiBold size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <FiItalic size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
          <FiUnderline size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <MdStrikethroughS size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
          <FiCode size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
          <MdOutlineHighlight size={16} />
        </ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
          <FiAlignLeft size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
          <FiAlignCenter size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
          <FiAlignRight size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          <FiList size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
          <MdFormatListNumbered size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
          <MdFormatQuote size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
          <FiType size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Link & Image */}
        <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Insert link">
          <FiLink size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={triggerImageUpload}
          loading={imgUploading}
          title="Upload image (or paste Ctrl+V)"
        >
          <FiImage size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <MdOutlineHorizontalRule size={16} />
        </ToolbarBtn>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">↩</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">↪</ToolbarBtn>
      </div>

      {/* Upload hint strip */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 text-xs border-b border-[var(--border)]"
        style={{ background: "rgba(232,255,71,0.03)", color: "var(--muted)" }}
      >
        <FiImage size={11} style={{ color: "var(--accent)" }} />
        <span>Click <strong style={{ color: "var(--text)" }}>📷</strong> to upload an image — or <kbd style={{ background: "var(--surface)", padding: "1px 5px", borderRadius: 4, border: "1px solid var(--border)" }}>Ctrl+V</kbd> to paste from clipboard</span>
      </div>

      {/* Editor body */}
      <div className="px-5 py-4">
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .prose-editor h1 { font-size: 2rem; font-weight: 800; margin: 1rem 0 0.5rem; color: var(--text); }
        .prose-editor h2 { font-size: 1.5rem; font-weight: 700; margin: 0.875rem 0 0.5rem; color: var(--text); }
        .prose-editor h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; color: var(--text); }
        .prose-editor p { margin: 0.5rem 0; color: var(--text); line-height: 1.7; }
        .prose-editor strong { font-weight: 700; color: var(--text); }
        .prose-editor em { font-style: italic; }
        .prose-editor u { text-decoration: underline; }
        .prose-editor s { text-decoration: line-through; }
        .prose-editor code { font-family: monospace; background: rgba(255,255,255,0.08); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; color: var(--accent); }
        .prose-editor pre { background: #1a1a2e; border: 1px solid var(--border); border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 0.75rem 0; }
        .prose-editor pre code { background: none; padding: 0; color: var(--text); }
        .prose-editor blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--muted); margin: 0.75rem 0; font-style: italic; }
        .prose-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; color: var(--text); }
        .prose-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; color: var(--text); }
        .prose-editor li { margin: 0.25rem 0; }
        .prose-editor a { color: var(--accent); text-decoration: underline; }
        .prose-editor img { max-width: 100%; border-radius: 8px; margin: 0.75rem 0; }
        .prose-editor hr { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
        .prose-editor mark { background: rgba(232,255,71,0.25); color: var(--text); border-radius: 2px; padding: 0 2px; }
        .prose-editor .is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--muted); pointer-events: none; float: left; height: 0; }
      `}</style>
    </div>
  );
}
