import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { RichTextEditor } from "../../components/admin/RichTextEditor";
import { ImageUploadZone } from "../../components/admin/ImageUploadZone";
import {
  FiSave, FiEye, FiChevronDown, FiChevronUp, FiX, FiPlus,
  FiImage, FiLink, FiSearch, FiTag, FiInfo, FiCheckCircle,
  FiAlertCircle, FiArrowLeft,
} from "react-icons/fi";
import axios from "axios";

const EMPTY = {
  title: "",
  slug: "",
  meta_title: "",
  description: "",
  meta_description: "",
  keywords: [],
  tags: [],
  author: "FileForge Team",
  status: "published",
  published_at: new Date().toISOString().split("T")[0],
  thumbnail: "",
  image: "",
  og_title: "",
  og_description: "",
  og_image: "",
  canonical_url: "",
  content: "",
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function SectionHeader({ icon: Icon, title, open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-white/[0.02]"
    >
      <Icon size={15} className="text-[var(--accent)] flex-shrink-0" />
      <span className="font-semibold text-sm text-[var(--text)]">{title}</span>
      <span className="ml-auto text-[var(--muted)]">
        {open ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
      </span>
    </button>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {hint && <span className="text-xs text-[var(--muted)] normal-case">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, maxLength, onFocus, onBlur, ...rest }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
      onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; onFocus?.(e); }}
      onBlur={(e) => { e.target.style.borderColor = "var(--border)"; onBlur?.(e); }}
      {...rest}
    />
  );
}

function TextareaInput({ value, onChange, placeholder, maxLength, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={rows}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
      style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    />
  );
}

function TagInput({ values, onChange, placeholder }) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  };

  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && !input && values.length) remove(values.length - 1);
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 px-3 py-2 rounded-xl cursor-text min-h-[42px]"
      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
      onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
    >
      {values.map((v, i) => (
        <span
          key={i}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
          style={{ background: "rgba(232,255,71,0.1)", color: "var(--accent)" }}
        >
          {v}
          <button type="button" onClick={() => remove(i)} className="hover:text-white ml-0.5">
            <FiX size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        placeholder={values.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[100px] text-sm outline-none bg-transparent"
        style={{ color: "var(--text)" }}
      />
    </div>
  );
}

function CharCount({ current, max }) {
  const pct = (current / max) * 100;
  const color = pct > 95 ? "#f87171" : pct > 80 ? "#fbbf24" : "#22c55e";
  return (
    <span className="text-xs" style={{ color }}>
      {current}/{max}
    </span>
  );
}

export function AdminBlogEditor() {
  const { slug } = useParams();
  const isEdit = !!slug;
  const navigate = useNavigate();
  const { authHeader } = useAuth();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [slugManual, setSlugManual] = useState(false);

  // accordion state
  const [sections, setSections] = useState({
    seo: true,
    og: false,
    advanced: false,
  });

  const toggleSection = (key) =>
    setSections((s) => ({ ...s, [key]: !s[key] }));

  // Load existing post
  useEffect(() => {
    if (!isEdit) return;
    axios
      .get(`/api/admin/blog/${slug}`, { headers: authHeader })
      .then((r) => {
        setForm({ ...EMPTY, ...r.data });
        setSlugManual(true);
      })
      .catch(() => {
        showToast("Failed to load post", "error");
        navigate("/admin/blog");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const set = useCallback((key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // auto-generate slug from title if not manually set
      if (key === "title" && !slugManual) {
        next.slug = slugify(value);
      }
      return next;
    });
  }, [slugManual]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async (statusOverride) => {
    if (!form.title.trim()) { showToast("Title is required", "error"); return; }
    setSaving(true);
    const payload = {
      ...form,
      status: statusOverride || form.status,
      meta_title: form.meta_title || form.title,
      meta_description: form.meta_description || form.description,
      og_title: form.og_title || form.meta_title || form.title,
      og_description: form.og_description || form.description,
      og_image: form.og_image || form.image,
      thumbnail: form.thumbnail || form.image,
    };
    try {
      if (isEdit) {
        const r = await axios.put(`/api/admin/blog/${slug}`, payload, { headers: authHeader });
        setForm({ ...EMPTY, ...r.data });
        showToast("Post updated successfully");
        if (r.data.slug !== slug) navigate(`/admin/blog/edit/${r.data.slug}`, { replace: true });
      } else {
        const r = await axios.post("/api/admin/blog", payload, { headers: authHeader });
        showToast("Post created successfully");
        navigate(`/admin/blog/edit/${r.data.slug}`, { replace: true });
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-[var(--muted)] text-sm">
          Loading post…
        </div>
      </AdminLayout>
    );
  }

  const Panel = ({ children }) => (
    <div className="px-6 pb-6 space-y-5">{children}</div>
  );

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium"
          style={
            toast.type === "error"
              ? { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }
              : { background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }
          }
        >
          {toast.type === "error" ? <FiAlertCircle size={15} /> : <FiCheckCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/blog")}
            className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text)]">
              {isEdit ? "Edit Post" : "New Post"}
            </h1>
            {isEdit && (
              <p className="text-xs text-[var(--muted)] mt-0.5">/blog/{form.slug}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && form.status !== "draft" && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-all"
              style={{ border: "1px solid var(--border)" }}
            >
              <FiEye size={14} /> Preview
            </a>
          )}
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: saving ? "rgba(232,255,71,0.5)" : "var(--accent)", color: "#0a0a0f" }}
          >
            <FiSave size={14} />
            {saving ? "Saving…" : isEdit ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* Left: content */}
        <div className="space-y-6">
          {/* Title */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <Field label="Post Title" required>
              <textarea
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Enter a compelling blog title…"
                rows={2}
                className="w-full px-4 py-3 rounded-xl text-xl font-bold outline-none transition-all resize-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </Field>
          </div>

          {/* Content editor */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--text)]">Content</h2>
            </div>
            <div className="p-4">
              <RichTextEditor
                content={form.content}
                onChange={(html) => set("content", html)}
                authHeader={authHeader}
              />
            </div>
          </div>

          {/* SEO section */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <SectionHeader
              icon={FiSearch}
              title="SEO & Meta Information"
              open={sections.seo}
              onToggle={() => toggleSection("seo")}
            />
            {sections.seo && (
              <Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    label="Meta Title"
                    hint={<CharCount current={form.meta_title.length} max={60} />}
                  >
                    <TextInput
                      value={form.meta_title}
                      onChange={(e) => set("meta_title", e.target.value)}
                      placeholder="SEO title (defaults to post title)"
                      maxLength={60}
                    />
                  </Field>
                  <Field label="Slug / URL" required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">/blog/</span>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => { setSlugManual(true); set("slug", slugify(e.target.value)); }}
                        placeholder="post-url-slug"
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                      />
                    </div>
                  </Field>
                </div>

                <Field
                  label="Meta Description"
                  hint={<CharCount current={form.meta_description.length} max={160} />}
                >
                  <TextareaInput
                    value={form.meta_description}
                    onChange={(e) => set("meta_description", e.target.value)}
                    placeholder="A concise summary for search engines (120–160 characters recommended)…"
                    maxLength={160}
                    rows={3}
                  />
                </Field>

                <Field label="Post Description (Excerpt)">
                  <TextareaInput
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Short excerpt displayed on the blog listing page…"
                    rows={2}
                  />
                </Field>

                <Field label="Keywords" hint="Press Enter or comma to add">
                  <TagInput
                    values={form.keywords}
                    onChange={(v) => set("keywords", v)}
                    placeholder="Add keywords…"
                  />
                </Field>

                <Field label="Tags" hint="Press Enter or comma to add">
                  <TagInput
                    values={form.tags}
                    onChange={(v) => set("tags", v)}
                    placeholder="Add tags…"
                  />
                </Field>

                <Field label="Canonical URL" hint="Leave blank to use default">
                  <div className="relative">
                    <FiLink size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <TextInput
                      value={form.canonical_url}
                      onChange={(e) => set("canonical_url", e.target.value)}
                      placeholder="https://yoursite.com/blog/…"
                    />
                  </div>
                </Field>
              </Panel>
            )}
          </div>

          {/* Open Graph */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <SectionHeader
              icon={FiInfo}
              title="Open Graph / Social Sharing"
              open={sections.og}
              onToggle={() => toggleSection("og")}
            />
            {sections.og && (
              <Panel>
                <p className="text-xs text-[var(--muted)] -mt-2 mb-1">
                  Controls how the post appears when shared on Facebook, Twitter, LinkedIn, etc.
                  Leave blank to inherit from SEO fields.
                </p>
                <Field
                  label="OG Title"
                  hint={<CharCount current={form.og_title.length} max={60} />}
                >
                  <TextInput
                    value={form.og_title}
                    onChange={(e) => set("og_title", e.target.value)}
                    placeholder="Social share title…"
                    maxLength={60}
                  />
                </Field>
                <Field
                  label="OG Description"
                  hint={<CharCount current={form.og_description.length} max={200} />}
                >
                  <TextareaInput
                    value={form.og_description}
                    onChange={(e) => set("og_description", e.target.value)}
                    placeholder="Social share description…"
                    maxLength={200}
                    rows={3}
                  />
                </Field>
                <ImageUploadZone
                  value={form.og_image}
                  onChange={(url) => set("og_image", url)}
                  label="OG Image (1200×630 recommended)"
                />
              </Panel>
            )}
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-5">
          {/* Publish settings */}
          <div
            className="rounded-2xl p-6 space-y-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-sm font-bold text-[var(--text)]">Publish Settings</h3>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all appearance-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>

            <Field label="Author">
              <TextInput
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                placeholder="Author name"
              />
            </Field>

            <Field label="Publish Date">
              <input
                type="date"
                value={form.published_at}
                onChange={(e) => set("published_at", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </Field>
          </div>

          {/* Featured image */}
          {/* Thumbnail — shown in blog listing cards */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <ImageUploadZone
              value={form.thumbnail}
              onChange={(url) => set("thumbnail", url)}
              label="Card Thumbnail"
            />
            <p className="text-xs text-[var(--muted)] mt-2">
              Shown in the blog listing grid. Falls back to Featured Image if empty.
            </p>
          </div>

          {/* Featured hero image */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <ImageUploadZone
              value={form.image}
              onChange={(url) => set("image", url)}
              label="Featured Image (Article Hero)"
            />
            <p className="text-xs text-[var(--muted)] mt-2">
              Large banner shown at the top of the article page.
            </p>
          </div>

          {/* SEO preview */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-sm font-bold text-[var(--text)]">Google Preview</h3>
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs text-[var(--muted)] mb-1 truncate">
                yoursite.com/blog/{form.slug || "post-slug"}
              </p>
              <p
                className="text-sm font-semibold truncate mb-1"
                style={{ color: "#8ab4f8" }}
              >
                {form.meta_title || form.title || "Post Title"}
              </p>
              <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                {form.meta_description || form.description || "Meta description will appear here…"}
              </p>
            </div>
          </div>

          {/* Quick save */}
          <div className="space-y-2">
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: saving ? "rgba(232,255,71,0.5)" : "var(--accent)", color: "#0a0a0f" }}
            >
              <FiSave size={14} />
              {saving ? "Saving…" : isEdit ? "Update Post" : "Publish Post"}
            </button>
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "var(--bg)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
