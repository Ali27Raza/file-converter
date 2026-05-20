import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";

export function BlogArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => {
        if (mounted) setPost(data);
      })
      .catch(() => setPost(null))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [slug]);

  if (loading) return <div className="min-h-screen p-8">Loading...</div>;
  if (!post) return <div className="min-h-screen p-8">Article not found.</div>;

  const siteUrl = (import.meta.env.VITE_SITE_URL || "https://yourwebsite.com").replace(/\/$/, "");
  const canonical = `${siteUrl}/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: [new URL(post.image || "/og-image.png", siteUrl).toString()],
    author: { "@type": "Person", name: post.author || "FileForge" },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    description: post.description,
    mainEntityOfPage: canonical,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };

  return (
    <div className="min-h-screen px-4 py-16 bg-[var(--bg)]">
      <SeoHead
        pathname={`/blog/${post.slug}`}
        title={post.title}
        description={post.description}
        image={post.image}
        keywords={post.keywords}
        jsonLd={[articleSchema, breadcrumbSchema]}
      />

      <div className="max-w-4xl mx-auto border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-8 md:p-10">
        <nav className="text-sm mb-4">
          <Link to="/" className="text-[var(--muted)] mr-2">Home</Link>
          / <Link to="/blog" className="text-[var(--muted)] ml-2">Blog</Link>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] mb-4">{post.title}</h1>
        <p className="text-sm text-[var(--muted)] mb-6">By {post.author} · Published {post.published_at}</p>
        <div className="prose max-w-none text-[var(--muted)]" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}
