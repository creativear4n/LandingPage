type SeoRobots = "index,follow" | "noindex,follow";

type BreadcrumbItem = {
    name: string;
    path: string;
};

type SeoService = {
    name: string;
    serviceType: string[];
    description: string;
    areaServed?: string;
};

type SeoProjectItem = {
    name: string;
    path: string;
    image?: string;
};

type SeoProjectCollection = {
    name: string;
    description: string;
    items: SeoProjectItem[];
};

type SeoData = {
    title: string;
    description: string;
    path?: string;
    image?: string;
    imageAlt?: string;
    robots?: SeoRobots;
    breadcrumbs?: BreadcrumbItem[];
    service?: SeoService;
    pageType?: "AboutPage";
};

const SITE_URL = "https://ar4n.com";

const DEFAULT_IMAGE = "/assets/thumbnail1.png";
const DEFAULT_IMAGE_ALT =
    "AR4N Group - Architecture, Interior & Design Build";

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

function removeMeta(
    attribute: "name" | "property",
    key: string
): void {
    document.head
        .querySelector(`meta[${attribute}="${key}"]`)
        ?.remove();
}

function getAbsoluteUrl(path: string): string {
    const url = new URL(path, SITE_URL);

    url.protocol = "https:";
    url.hostname = "ar4n.com";
    url.port = "";

    url.search = "";
    url.hash = "";

    if (url.pathname !== "/") {
        url.pathname = url.pathname.replace(/\/+$/, "");
    }

    return url.toString();
}

function getAbsoluteImageUrl(path: string): string {
    const url = new URL(path, SITE_URL);

    // Upgrade HTTP ke HTTPS hanya untuk domain utama.
    if (
        url.protocol === "http:" &&
        url.hostname === "ar4n.com"
    ) {
        url.protocol = "https:";
    }

    return url.toString();
}

function getImageMimeType(imageUrl: string): string | null {
    const pathname = new URL(imageUrl).pathname.toLowerCase();

    if (pathname.endsWith(".png")) {
        return "image/png";
    }

    if (
        pathname.endsWith(".jpg") ||
        pathname.endsWith(".jpeg")
    ) {
        return "image/jpeg";
    }

    if (pathname.endsWith(".webp")) {
        return "image/webp";
    }

    if (pathname.endsWith(".gif")) {
        return "image/gif";
    }

    if (pathname.endsWith(".avif")) {
        return "image/avif";
    }

    if (pathname.endsWith(".svg")) {
        return "image/svg+xml";
    }

    return null;
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

function updateBreadcrumbSchema(
    breadcrumbs: BreadcrumbItem[]
): void {
    const schemaId = "breadcrumb-schema";

    let script = document.getElementById(
        schemaId
    ) as HTMLScriptElement | null;

    // Hapus schema jika breadcrumb tidak mencukupi.
    if (breadcrumbs.length < 2) {
        script?.remove();
        return;
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",

        itemListElement: breadcrumbs.map(
            (breadcrumb, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: breadcrumb.name,
                item: getAbsoluteUrl(breadcrumb.path),
            })
        ),
    };

    if (!script) {
        script = document.createElement("script");
        script.id = schemaId;
        script.type = "application/ld+json";

        document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
}

function updateServiceSchema(
    service: SeoService | undefined,
    pageUrl: string
): void {
    const schemaId = "service-schema";

    let script = document.getElementById(
        schemaId
    ) as HTMLScriptElement | null;

    if (!service) {
        script?.remove();
        return;
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",

        "@id": `${pageUrl}#service`,

        name: service.name,
        serviceType: service.serviceType,
        description: service.description,

        provider: {
            "@id": `${SITE_URL}/#organization`,
        },

        areaServed:
            service.areaServed ||
            "Cirebon, Jawa Barat, Indonesia",

        url: pageUrl,
    };

    if (!script) {
        script = document.createElement("script");
        script.id = schemaId;
        script.type = "application/ld+json";

        document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
}

function updateAboutPageSchema(
    pageType: "AboutPage" | undefined,
    pageUrl: string,
    title: string,
    description: string
): void {
    const schemaId = "about-page-schema";

    let script = document.getElementById(
        schemaId
    ) as HTMLScriptElement | null;

    if (pageType !== "AboutPage") {
        script?.remove();
        return;
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",

        "@id": `${pageUrl}#aboutpage`,

        name: title,
        description: description,
        url: pageUrl,

        about: {
            "@id": `${SITE_URL}/#organization`,
        },
    };

    if (!script) {
        script = document.createElement("script");
        script.id = schemaId;
        script.type = "application/ld+json";

        document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
}

export function updateProjectCollectionSchema(
    collection: SeoProjectCollection | undefined,
    pagePath: string
): void {
    const pageUrl = getAbsoluteUrl(pagePath);

    const schemaId = "project-collection-schema";

    let script = document.getElementById(
        schemaId
    ) as HTMLScriptElement | null;

    // Hapus schema ketika tidak ada data proyek.
    if (!collection || collection.items.length === 0) {
        script?.remove();
        return;
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",

        "@id": `${pageUrl}#collection`,

        name: collection.name,
        description: collection.description,
        url: pageUrl,

        mainEntity: {
            "@type": "ItemList",

            itemListOrder:
                "https://schema.org/ItemListOrderAscending",

            numberOfItems: collection.items.length,

            itemListElement: collection.items.map(
                (item, index) => ({
                    "@type": "ListItem",

                    position: index + 1,
                    name: item.name,

                    item: {
                        "@type": "WebPage",
                        name: item.name,
                        url: getAbsoluteUrl(item.path),

                        ...(item.image
                            ? {
                                primaryImageOfPage:
                                    getAbsoluteImageUrl(item.image),
                            }
                            : {}),
                    },
                })
            ),
        },
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

    service,
    pageType,
}: SeoData): void {

    const pageUrl = getAbsoluteUrl(path);

    const imageUrl = getAbsoluteImageUrl(image);

    document.title = title;

    setMeta("name", "description", description);

    setMeta("name", "robots", robots);

    setCanonical(pageUrl);

    setMeta("property", "og:type", "website");

    setMeta("property", "og:site_name", "AR4N Group");

    setMeta("property", "og:title", title);

    setMeta("property", "og:description", description);

    setMeta("property", "og:url", pageUrl);

    setMeta("property", "og:image", imageUrl);

    setMeta("property", "og:image:secure_url", imageUrl);

    setMeta("property", "og:image:alt", imageAlt);

    const imageType = getImageMimeType(imageUrl);

    if (imageType) {
        setMeta("property", "og:image:type", imageType);
    } else {
        removeMeta("property", "og:image:type");
    }

    removeMeta("property", "og:image:width");

    removeMeta("property", "og:image:height");

    setMeta(
        "name",
        "twitter:card",
        "summary_large_image"
    );

    setMeta("name", "twitter:title", title);

    setMeta("name", "twitter:description", description);

    setMeta("name", "twitter:image", imageUrl);

    setMeta("name", "twitter:image:alt", imageAlt);

    updateBreadcrumbSchema(breadcrumbs);

    updateServiceSchema(service, pageUrl);

    updateAboutPageSchema(
        pageType,
        pageUrl,
        title,
        description
    );
    updateProjectCollectionSchema(
        undefined,
        pageUrl
    );
}
