type SeoRobots = "index,follow" | "noindex,follow";

type BreadcrumbItem = {
    name: string;
    path: string;
};

type SeoData = {
    title: string;
    description: string;
    path?: string;
    image?: string;
    imageAlt?: string;
    robots?: SeoRobots;
    breadcrumbs?: BreadcrumbItem[];
};

const SITE_URL = "https://ar4n.com";

const DEFAULT_IMAGE = "/assets/thumbnail1.png";
const DEFAULT_IMAGE_ALT = "AR4N Group - Architecture, Interior & Design Build";

const IMAGE_WIDTH = "1200";
const IMAGE_HEIGHT = "630";
const IMAGE_TYPE = "image/png";

function setMeta(
    attribute: "name" | "property",
    key: string,
    value: string
): void {
    let meta = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`
    );

    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
    }

    meta.content = value;
}

function setCanonical(url: string): void {
    let canonical = document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
    );

    if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
    }

    canonical.href = url;
}

function getAbsoluteUrl(path: string): string {
    const url = new URL(path, SITE_URL);

    url.search = "";
    url.hash = "";

    return url.toString();
}

function updateBreadcrumbSchema(
    breadcrumbs: BreadcrumbItem[]
): void {
    const schemaId = "breadcrumb-schema";

    let script = document.getElementById(
        schemaId
    ) as HTMLScriptElement | null;

    if (!breadcrumbs.length) {
        script?.remove();
        return;
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: breadcrumb.name,
            item: getAbsoluteUrl(breadcrumb.path),
        })),
    };

    if (!script) {
        script = document.createElement("script");
        script.id = schemaId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
}

export function updatePageSeo({
    title,
    description,
    path = window.location.pathname,
    image = DEFAULT_IMAGE,
    imageAlt = DEFAULT_IMAGE_ALT,
    robots = "index,follow",
    breadcrumbs = [],
}: SeoData): void {
    const pageUrl = getAbsoluteUrl(path);
    const imageUrl = getAbsoluteUrl(image);

    // Basic SEO
    document.title = title;

    setMeta("name", "description", description);
    setMeta("name", "robots", robots);

    // Canonical URL
    setCanonical(pageUrl);

    // Open Graph
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "AR4N Group");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:image:secure_url", imageUrl);
    setMeta("property", "og:image:type", IMAGE_TYPE);
    setMeta("property", "og:image:width", IMAGE_WIDTH);
    setMeta("property", "og:image:height", IMAGE_HEIGHT);
    setMeta("property", "og:image:alt", imageAlt);

    // Twitter Cards
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);
    setMeta("name", "twitter:image:alt", imageAlt);

    // Breadcrumb structured data
    updateBreadcrumbSchema(breadcrumbs);
}