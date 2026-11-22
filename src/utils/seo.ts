type SeoData = {
    title: string;
    description: string;
    path?: string;
    image?: string;
};

const SITE_URL = "https://ar4n.com";

function setMeta(
    attribute: "name" | "property",
    key: string,
    value: string
) {
    let meta = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`
    );

    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
    }

    meta.setAttribute("content", value);
}

export function updatePageSeo({
    title,
    description,
    path,
    image,
}: SeoData) {
    const pageUrl = new URL(
        path || window.location.pathname,
        SITE_URL
    ).toString();

    const imageUrl = new URL(
        image || "/assets/seo/thumbnail1.png",
        SITE_URL
    ).toString();

    document.title = title;

    setMeta("name", "description", description);

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "AR4N Group");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:image", imageUrl);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
    );

    if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
    }

    canonical.href = pageUrl;
}