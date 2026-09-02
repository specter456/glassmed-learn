import { useEffect } from "react";

/* ------------------------------------------------------------------ */
/* useHead — sets document.title + meta description + OG tags         */
/* Call at the top of every page component. Pass undefined to skip.    */
/* ------------------------------------------------------------------ */

const SITE_NAME = "GlassMed";
const SITE_URL = "https://glassmed.app"; // update after deployment
const DEFAULT_DESCRIPTION =
  "Interactive medical education platform for NEET aspirants and first-year MBBS students. Learn with glowing anatomy diagrams, spaced repetition flashcards, and clinical case studies.";
const DEFAULT_IMAGE = "/app-icon-512.png";

export interface SEOData {
  title?: string;
  description?: string;
  /** Absolute URL for OG image — defaults to the app icon */
  image?: string;
  /** Canonical path — e.g. "/research/cardiac-cycle" */
  path?: string;
  /** Open Graph type */
  type?: "website" | "article";
  /** Extra keywords for the meta keywords tag */
  keywords?: string;
  /** Whether this page should be indexed by search engines */
  noIndex?: boolean;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"],meta[property="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    if (name.startsWith("og:")) {
      el.setAttribute("property", name);
    } else {
      el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Remove a previously injected SEO tag (used on unmount). */
function removeMeta(name: string) {
  const el = document.querySelector(`meta[name="${name}"],meta[property="${name}"]`);
  el?.remove();
}

/**
 * React hook that manages document title, meta description, Open Graph
 * tags, and canonical link for the current page.
 *
 * Call at the top of each route component:
 * ```tsx
 * useHead({ title: "The Cardiac Cycle | GlassMed", description: "..." });
 * ```
 */
export function useHead(seo?: SEOData) {
  useEffect(() => {
    if (!seo) return;

    // --- Title ---
    const fullTitle = seo.title
      ? `${seo.title} | ${SITE_NAME}`
      : `${SITE_NAME} — Where Medicine Becomes Energetic`;
    document.title = fullTitle;

    // --- Meta description ---
    const desc = seo.description ?? DEFAULT_DESCRIPTION;
    setMeta("description", desc);
    setMeta("keywords", seo.keywords ?? "medical education, NEET, MBBS, flashcards, anatomy, physiology");

    // --- Open Graph ---
    const ogImage = seo.image ?? `${SITE_URL}${DEFAULT_IMAGE}`;
    const ogUrl = seo.path ? `${SITE_URL}${seo.path}` : SITE_URL;
    setMeta("og:type", seo.type ?? "website");
    setMeta("og:title", fullTitle);
    setMeta("og:description", desc);
    setMeta("og:image", ogImage);
    setMeta("og:url", ogUrl);
    setMeta("og:site_name", SITE_NAME);

    // --- Twitter Card ---
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", ogImage);

    // --- Canonical ---
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", ogUrl);

    // --- Robots ---
    if (seo.noIndex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      removeMeta("robots");
    }

    // Cleanup on unmount — restore defaults
    return () => {
      document.title = `${SITE_NAME} — Where Medicine Becomes Energetic`;
      setMeta("description", DEFAULT_DESCRIPTION);
    };
  }, [seo?.title, seo?.description, seo?.path]);
}

/* ------------------------------------------------------------------ */
/* JSON-LD Structured Data generators                                  */
/* ------------------------------------------------------------------ */

export interface StructuredDataProps {
  type: "EducationalOrganization" | "Course" | "Article" | "WebSite";
  data: Record<string, unknown>;
}

/**
 * Injects JSON-LD structured data into the document head.
 * Renders null — no visible output.
 */
export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const scriptId = `jsonld-${type.toLowerCase()}`;
    // Remove existing
    document.getElementById(scriptId)?.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    });
    document.head.appendChild(script);

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [type, data]);

  return null;
}

/* ------------------------------------------------------------------ */
/* Pre-built structured data for common pages                          */
/* ------------------------------------------------------------------ */

export const SITE_STRUCTURED_DATA: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  sameAs: [],
  logo: `${SITE_URL}/app-icon-512.png`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
  },
};

export function articleStructuredData(article: {
  title: string;
  slug: string;
  summary: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    url: `${SITE_URL}/research`,
    about: {
      "@type": "Thing",
      name: article.title,
    },
    educationalLevel: "College",
    genre: "Medical Education",
    keywords: [article.category, article.title, "medical", "education"],
  };
}

export function courseStructuredData(course: {
  title: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `${SITE_URL}/basics`,
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
    },
    educationalLevel: "College",
    teaches: course.title,
    coursePrerequisites: "None — beginner friendly",
  };
}

/* ------------------------------------------------------------------ */
/* Sitemap data                                                        */
/* ------------------------------------------------------------------ */

export const PUBLIC_ROUTES = [
  { path: "/", priority: "1.0", changeFreq: "weekly" },
  { path: "/dashboard", priority: "0.8", changeFreq: "daily" },
  { path: "/flashcards", priority: "0.7", changeFreq: "weekly" },
  { path: "/basics", priority: "0.8", changeFreq: "weekly" },
  { path: "/research", priority: "0.8", changeFreq: "weekly" },
  { path: "/diagrams", priority: "0.7", changeFreq: "monthly" },
  { path: "/game", priority: "0.6", changeFreq: "monthly" },
];

export const SITE = {
  name: SITE_NAME,
  url: SITE_URL,
  defaultDescription: DEFAULT_DESCRIPTION,
};
