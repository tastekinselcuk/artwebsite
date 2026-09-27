/**
 * Client-side SEO helpers for the Vue SPA.
 * Sets document title, meta tags, canonical, hreflang, and JSON-LD.
 */

const SITE_NAME = "Sarpé Atelier";

function getSiteUrl() {
  const fromEnv = import.meta.env.VITE_SITE_URL;
  if (fromEnv) return String(fromEnv).replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://sarpeatelier.com";
}

function upsertMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href, extra = {}) {
  if (!href) return;
  const selector = Object.entries({ rel, ...extra })
    .map(([k, v]) => `[${k}="${v}"]`)
    .join("");
  let el = document.head.querySelector(`link${selector}`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id, data) {
  const scriptId = `ld-json-${id}`;
  let el = document.getElementById(scriptId);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = scriptId;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} [opts.description]
 * @param {string} [opts.path] - pathname starting with /
 * @param {string} [opts.image]
 * @param {string} [opts.locale] - tr | en
 * @param {boolean} [opts.noindex]
 * @param {object|object[]} [opts.jsonLd]
 */
export function applySeo({
  title,
  description,
  path = "/",
  image,
  locale = "tr",
  noindex = false,
  jsonLd,
} = {}) {
  const siteUrl = getSiteUrl();
  const fullTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-default.jpg`;

  document.title = fullTitle;
  document.documentElement.lang = locale === "en" ? "en" : "tr";

  upsertMeta("name", "description", description);
  upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  upsertMeta("name", "author", "Zehra Sarp — Sarpé Atelier");
  upsertMeta("name", "theme-color", "#5a9e9e");

  upsertMeta("property", "og:type", path.startsWith("/rehber/") ? "article" : "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", fullTitle);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", ogImage);
  upsertMeta("property", "og:locale", locale === "en" ? "en_US" : "tr_TR");
  upsertMeta("property", "og:locale:alternate", locale === "en" ? "tr_TR" : "en_US");

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", fullTitle);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", ogImage);

  upsertLink("canonical", url);
  upsertLink("alternate", url, { hreflang: locale === "en" ? "en" : "tr" });
  upsertLink("alternate", url, { hreflang: "x-default" });

  if (Array.isArray(jsonLd)) {
    jsonLd.forEach((block, i) => setJsonLd(String(i), block));
  } else {
    setJsonLd("0", jsonLd || null);
  }
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ArtGallery"],
    name: SITE_NAME,
    url: siteUrl,
    description:
      "Geleneksel Türk ebru sanatı galerisi, ebru çeşitleri bilgisi ve el yapımı ebru eserleri satışı.",
    founder: {
      "@type": "Person",
      name: "Zehra Sarp",
    },
    inLanguage: ["tr", "en"],
    areaServed: "Worldwide",
  };
}

export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: ["tr", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export { SITE_NAME, getSiteUrl };
