import React from "react";
import { Helmet } from "react-helmet-async";

const DEFAULT_SITE_URL = "https://yourwebsite.com";
const DEFAULT_TITLE = "FileForge — Free Online File Converter";
const DEFAULT_DESCRIPTION = "Convert Word, Excel, PowerPoint, PDF, InPage, and images online for free. Fast, secure, and easy file conversion.";
const DEFAULT_IMAGE = "/og-image.png";

function toAbsoluteUrl(siteUrl, pathOrUrl) {
  try {
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    return new URL(pathOrUrl || "/", siteUrl).toString();
  } catch {
    return `${siteUrl}${pathOrUrl || "/"}`;
  }
}

export function SeoHead({
  pathname = "/",
  title,
  description,
  robots = "index,follow",
  image = DEFAULT_IMAGE,
  keywords = [],
  jsonLd = [],
}) {
  const siteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
  const canonical = toAbsoluteUrl(siteUrl, pathname || "/");
  const absoluteImage = toAbsoluteUrl(siteUrl, image);
  const pageTitle = title || DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const orgName = "FileForge";

  const baseSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: orgName,
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: orgName,
      url: siteUrl,
      logo: toAbsoluteUrl(siteUrl, "/favicon.png"),
    },
  ];

  const schemas = [...baseSchemas, ...jsonLd];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />
      )}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={orgName} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={absoluteImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={absoluteImage} />

      {schemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
