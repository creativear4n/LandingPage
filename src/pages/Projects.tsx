import { updatePageSeo } from "../utils/seo";
import { useEffect, useState } from "react";

import {
    Link,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";

import {
    getProducts,
    getProjects,
    getImageUrl,
} from "../services/api";

import type {
    ApiProduct,
    ApiProject,
    ApiProjectCategory,
    ApiProjectImage,
    ApiProjectsResponse,
} from "../types";

type CategorySlug =
    | "design"
    | "buildings"
    | "pbg-slf";

type CategoryConfig = {
    apiName: string;
    title: string;
};

type ApiProjectHeroImage = {
    id_product: number;
    hero_image: string | null;
    hero_image_url?: string | null;
};

type ApiPbgProject = {
    id: number;
    id_product?: number | null;
    company_name: string;
    work_area: number | string | null;
    description: string | null;
    logo_path: string | null;
    sort_order?: number;

    product?: {
        id: number;
        name_product: string;
    } | null;
};

type ApiProjectsResponseWithPbg = ApiProjectsResponse & {
    pbg_projects?: ApiPbgProject[];
    project_hero_images?: ApiProjectHeroImage[];
};

const projectCategories: Record<CategorySlug, CategoryConfig> = {
    design: {
        apiName: "desain",
        title: "Design",
    },

    buildings: {
        apiName: "building",
        title: "Buildings",
    },

    "pbg-slf": {
        apiName: "pbg & slf",
        title: "PBG & SLF",
    },
};

type ProjectSeoConfig = {
    title: string;
    description: string;
    robots: "index,follow" | "noindex,follow";
};

const projectSeo: Record<CategorySlug, ProjectSeoConfig> = {
    design: {
        title: "AR4N Group | Portofolio Proyek Arsitektur & Interior Cirebon",
        description:
            "Lihat portofolio proyek desain arsitektur dan interior AR4N Group. Jelajahi hasil perencanaan hunian dan bangunan komersial dengan pendekatan fungsi dan karakter ruang.",
        robots: "index,follow",
    },

    buildings: {
        title: "AR4N Group | Portofolio Proyek Konstruksi & Design Build",
        description:
            "Jelajahi portofolio proyek pembangunan, renovasi, dan design build AR4N Group dengan perhatian pada kualitas pengerjaan dan kebutuhan setiap bangunan.",
        robots: "index,follow",
    },

    "pbg-slf": {
        title: "AR4N Group | Portofolio Pengurusan PBG & SLF",
        description:
            "Informasi proyek pendampingan pengurusan Persetujuan Bangunan Gedung (PBG) dan Sertifikat Laik Fungsi (SLF) oleh AR4N Group.",
        robots: "index,follow",
    },
};

type ProjectData = {
    id: number;
    id_product: number;
    id_project_category: number;
    title: string;
    description: string | null;
    category: ApiProjectCategory | null;
    thumbnail_url: string | null;
    sort_order: number;
    work_area?: number | string | null;
    is_pbg?: boolean;
    thumbnail_path?: string | null;

    images: {
        id: number;
        id_project: number;
        image_path: string;
        image_url: string;
        sort_order: number;
    }[];
};


function isCategorySlug(
    value: string | undefined
): value is CategorySlug {
    return (
        value !== undefined &&
        Object.prototype.hasOwnProperty.call(
            projectCategories,
            value
        )
    );
}

function normalizeProductName(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}

function normalizeSearchText(value: string): string{
    return value
    .normalize("NFKC")
    .toLocaleLowerCase("id-ID")
    .trim()
    .replace(/\s+/g, " ");
}

function findProductByCategory(
    products: ApiProduct[],
    category: CategorySlug,
    config: CategoryConfig
): ApiProduct | null {
    return (
        products.find((item) => {
            const normalizedName = normalizeProductName(
                item.name_product
            );

            if (category === "pbg-slf") {
                const compactName = normalizedName.replace(
                    /[^a-z0-9]/g,
                    ""
                );

                return (
                    compactName.includes("pbg") &&
                    compactName.includes("slf")
                );
            }

            return normalizedName === config.apiName;
        }) ?? null
    );
}

function getCmsMediaUrl(
    path: string | null | undefined
): string | null {
    return getImageUrl(path);
}

function formatWorkArea(
    value: number | string | null | undefined
): string | null {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return null;
    }

    return new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 2,
    }).format(numericValue);
}

function normalizeProject(
    project: ApiProject
): ProjectData {
    return {
        id: project.id,

        id_product: Number(
            project.id_product ?? project.product?.id
        ),

        id_project_category: project.id_project_category,

        title: project.title,

        description: project.description,

        category: project.category ?? null,

        thumbnail_url: getCmsMediaUrl(
            project.thumbnail_url ||
            project.thumbnail_path
        ),

        thumbnail_path: project.thumbnail_path ?? null,

        sort_order: project.sort_order ?? 0,

        is_pbg: false,

        images: (project.images ?? [])
            .slice()
            .sort(
                (a, b) => a.sort_order - b.sort_order
            )
            .slice(0, 20)
            .map((image: ApiProjectImage) => ({
                id: image.id,

                id_project: image.id_project,

                image_path: image.image_path,

                image_url:
                    getCmsMediaUrl(
                        image.image_url || image.image_path
                    ) ?? "",

                sort_order: image.sort_order,
            })),
    };
}

function normalizeProjects(
    response: ApiProjectsResponse,
    productId: number
): ProjectData[] {
    return (response.projects ?? [])
        .filter((project) => {
            const currentProductId =
                project.id_product ?? project.product?.id;

            return (
                currentProductId !== null &&
                currentProductId !== undefined &&
                Number(currentProductId) === Number(productId)
            );
        })
        .map(normalizeProject)
        .sort(
            (a, b) => a.sort_order - b.sort_order
        );
}


function normalizePbgProjects(
    response: ApiProjectsResponseWithPbg,
    productId: number
): ProjectData[] {
    return (response.pbg_projects ?? [])
        .filter((project) => {
            const currentProductId =
                project.id_product ?? project.product?.id;

            return (
                currentProductId !== null &&
                currentProductId !== undefined &&
                Number(currentProductId) === Number(productId)
            );
        })
        .map((project) => ({
            id: project.id,

            id_product: Number(
                project.id_product ?? project.product?.id
            ),

            id_project_category: 0,

            title: project.company_name,

            description: project.description ?? null,

            category: null,

            thumbnail_url: getCmsMediaUrl(
                project.logo_path
            ),

            sort_order: project.sort_order ?? 0,

            work_area: project.work_area,

            is_pbg: true,

            images: [],
        }))
        .sort(
            (a, b) => a.sort_order - b.sort_order
        );
}


function normalizeProjectsByCategory(
    response: ApiProjectsResponseWithPbg,
    productId: number,
    category: CategorySlug
): ProjectData[] {
    if (category === "pbg-slf") {
        return normalizePbgProjects(
            response,
            productId
        );
    }

    return normalizeProjects(
        response,
        productId
    );
}


function ProjectsHero({
    image,
    title,
}: {
    image?: string | null;
    title?: string;
}) {
    return (
        <section className="inner-hero projects-hero projects-hero-axiom">
            {image && (
                <img
                    src={image}
                    alt={`AR4N Group ${title}`}
                />
            )}

            <div className="inner-hero-shade" />

            <div className="projects-hero-content">
                <h1>{title}</h1>
            </div>
        </section>
    );
}


function ProjectLoading({
    title,
}: {
    title?: string;
}) {
    return (
        <MainLayout page="works" headerOverlay>
            <ProjectsHero title={title} />

            <main className="projects-loading">
                <span className="projects-spinner" />
                <p>Memuat Projects...</p>
            </main>
        </MainLayout>
    );
}

function ProjectError({
    message,
    title,
}: {
    message: string;
    title?: string;
}) {
    return (
        <MainLayout page="works" headerOverlay>
            <ProjectsHero title={title} />

            <main className="page-width projects-error">
                <h2>Projects belum dapat dimuat</h2>

                <p>{message}</p>

                <button
                    className="outline-button"
                    onClick={() => window.location.reload()}
                >
                    Coba lagi
                </button>
            </main>
        </MainLayout>
    );
}

export default function Projects({
    manageSeo = true,
}: {
    manageSeo?: boolean;
}) {
    const { category } = useParams();

    const [projectHeroImage, setProjectHeroImage] =
        useState<string | null>(null);

    const categoryConfig = isCategorySlug(category)
        ? projectCategories[category]
        : null;

    const [projects, setProjects] = useState<ProjectData[]>([]);

    const [searchQuery, setSearchQuery] = useState("");

    const [product, setProduct] = useState<ApiProduct | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!manageSeo) return;

        if (!isCategorySlug(category)) {
            updatePageSeo({
                title: "Projects | AR4N Group",
                description:
                    "Jelajahi portofolio proyek arsitektur, interior, dan konstruksi AR4N Group.",
                path: category
                    ? `/projects/${category}`
                    : "/projects",
                robots: "noindex,follow",
            });

            return;
        }

        const categoryTitle = projectCategories[category].title;

        updatePageSeo({
            ...projectSeo[category],
            path: `/projects/${category}`,
            breadcrumbs: [
                {
                    name: "Home",
                    path: "/",
                },
                {
                    name: `${categoryTitle} Projects`,
                    path: `/projects/${category}`,
                },
            ],
        });
    }, [category, manageSeo]);

    useEffect(() => {
        let active = true;

        async function loadProjects() {
            if (!isCategorySlug(category)) {
                setLoading(false);
                setProjectHeroImage(null);
                setProduct(null);
                setProjects([]);
                setError("Kategori project tidak ditemukan.");
                return;
            }

            const config = projectCategories[category];

            try {
                setLoading(true);
                setError(null);
                setProjectHeroImage(null);
                setProduct(null);
                setProjects([]);

                const [
                    productsResponse,
                    projectsResponse,
                ] = await Promise.all([
                    getProducts(),
                    getProjects(),
                ]);

                if (!active) return;

                const selectedProduct = findProductByCategory(
                    productsResponse,
                    category,
                    config
                );

                if (!selectedProduct) {
                    throw new Error(
                        `Data kategori ${config.title} belum tersedia di API.`
                    );
                }

                const projectsData =
                    projectsResponse as ApiProjectsResponseWithPbg;

                // Cari Hero Image berdasarkan ID Product
                const selectedHero = (
                    projectsData.project_hero_images ?? []
                ).find(
                    (item) =>
                        Number(item.id_product) ===
                        Number(selectedProduct.id)
                );

                // Gunakan Hero Image dari CMS Project
                setProjectHeroImage(
                    getCmsMediaUrl(
                        selectedHero?.hero_image_url ||
                        selectedHero?.hero_image
                    )
                );

                setProduct(selectedProduct);

                // Ambil project berdasarkan kategori layanan
                setProjects(
                    normalizeProjectsByCategory(
                        projectsData,
                        selectedProduct.id,
                        category
                    )
                );

            } catch (reason) {
                if (!active) return;

                setProjectHeroImage(null);

                setError(
                    reason instanceof Error
                        ? reason.message
                        : "Gagal mengambil data Projects."
                );

            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadProjects();

        return () => {
            active = false;
        };
    }, [category]);

    const filteredProjects = projects.filter((project) => {
        const query = normalizeSearchText(searchQuery);
        const projectName = normalizeSearchText(project.title);

        return projectName.includes(query);
    });

    useEffect(() => {
        const cards = document.querySelectorAll<HTMLElement>(
            ".projects-page-axiom .projects-list-card"
        );

        if (!cards.length) return;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            cards.forEach((card) => {
                card.classList.add("is-visible");
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [filteredProjects, category]);

    if (loading) {
        return (
            <ProjectLoading
                title={categoryConfig?.title}
            />
        );
    }

    if (error) {
        return (
            <ProjectError
                message={error}
                title={categoryConfig?.title}
            />
        );
    }

    if (categoryConfig === null) {
        return (
            <ProjectError
                message="Kategori tidak ditemukan."
            />
        );
    }

    const heroImage = projectHeroImage;

    const isPbgCategory = category === "pbg-slf";

    return (
        <MainLayout page="works" headerOverlay>
            <ProjectsHero
                image={heroImage}
                title={categoryConfig.title}
            />

            <main className="projects-page projects-page-axiom">
                <section className="projects-listing page-width">

                    {/* PAGE HEADING */}

                    <div className="projects-listing-heading">
                        <p className="section-kicker">
                            OUR PORTFOLIO /{" "}
                            {categoryConfig.title.toUpperCase()}
                        </p>

                        <h1>
                            Our
                            <br />
                            Projects
                        </h1>

                        <p className="projects-listing-description">
                            {product?.descriptions ||
                                "Explore our completed projects."}
                        </p>

                        <span className="projects-count">
                            {projects.length} Projects
                        </span>
                    </div>

                    {/* PROJECT SEARCH */}
                    <div className="projects-search-wrapper">
                        <div className="projects-search-box">
                            <Search size={19} className="projects-search-icon" />

                            <input
                                type="search"
                                className="projects-search-input"
                                placeholder="Cari nama project..."
                                value={searchQuery}
                                maxLength={100}
                                autoComplete="off"
                                spellCheck={false}
                                aria-label="Cari project berdasarkan nama"
                                onChange={(event) => {
                                    setSearchQuery(event.target.value.slice(0, 100));
                                }}
                            />

                            {searchQuery.length > 0 && (
                                <button
                                    type="button"
                                    className="projects-search-clear"
                                    onClick={() => setSearchQuery("")}
                                    aria-label="Hapus pencarian"
                                >
                                    <X size={17} />
                                </button>
                            )}
                        </div>

                        <span className="projects-search-result">
                            {filteredProjects.length} dari {projects.length} Projects
                        </span>
                    </div>

                    {/* PROJECT GRID */}

                    {filteredProjects.length > 0 ? (
                        <div
                            className={
                                `projects-list-grid ${
                                    isPbgCategory
                                        ? "projects-list-grid-pbg"
                                        : "projects-list-grid-standard"
                                }`
                            }
                        >
                            {filteredProjects.map((project, index) => {
                                const isPbgProject =
                                    project.is_pbg === true;

                                const workArea = formatWorkArea(
                                    project.work_area
                                );

                                return (
                                    <Link
                                        to={`/projects/${category}/${project.id}`}
                                        className={
                                            `projects-list-card ${
                                                isPbgProject
                                                    ? "projects-list-card-pbg"
                                                    : ""
                                            }`
                                        }
                                        key={project.id}
                                        style={{
                                            animationDelay: `${Math.min(index * 100, 700)}ms`,
                                        }}
                                    >

                                        {/* IMAGE / LOGO */}

                                        <div
                                            className={
                                                `projects-list-image ${
                                                    isPbgProject
                                                        ? "projects-list-image-pbg"
                                                        : ""
                                                }`
                                            }
                                        >
                                            {project.thumbnail_url ? (
                                                <img
                                                    src={project.thumbnail_url}
                                                    alt={project.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            ) : (
                                                <div className="projects-list-placeholder" />
                                            )}

                                            <span className="projects-list-overlay">
                                                <ArrowUpRight size={25} />
                                            </span>
                                        </div>

                                        {/* PROJECT INFORMATION */}

                                        <div className="projects-list-meta">
                                            <span>
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <h2>{project.title}</h2>

                                            {!isPbgProject && project.description?.trim() && (
                                                <p className="projects-list-excerpt">
                                                    {project.description.trim()}
                                                </p>
                                            )}

                                            {isPbgProject && workArea && (
                                                <p className="project-modal-description">
                                                    Luasan Bangunan yang dibuat PBG/SLF:{" "}
                                                    {workArea} m²
                                                </p>
                                            )}

                                            <ArrowUpRight
                                                size={17}
                                                className="projects-list-arrow"
                                            />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="projects-empty">
                            {searchQuery.trim() ? (
                                <>
                                    Project dengan nama "{searchQuery}" tidak ditemukan.
                                    <button
                                        type="button"
                                        className="projects-search-reset"
                                        onClick={() => setSearchQuery("")}
                                        >
                                            Hapus Pencarian
                                        </button>
                                </>
                            ) : (
                                "Belum ada project pada kategori ini"
                            )}
                        </div>
                    )}

                </section>
            </main>
        </MainLayout>
    );
}

export function ProjectDetail() {
    const {
        category,
        projectId,
    } = useParams();

    const location = useLocation();

    const navigate = useNavigate();

    const categoryConfig = isCategorySlug(category)
        ? projectCategories[category]
        : null;

    const [project, setProject] = useState<ProjectData | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const hasValidProject = Boolean(
            project &&
            categoryConfig &&
            projectId &&
            /^\d+$/.test(projectId) &&
            Number(project.id) === Number(projectId)
        );

        const rawDescription = project?.description?.trim();

        updatePageSeo({
            title: project && categoryConfig
                ? `${project.title} | ${categoryConfig.title} Projects | AR4N Group`
                : `${categoryConfig?.title ?? "Projects"} | AR4N Group`,

            description: rawDescription
                ? rawDescription.replace(/\s+/g, " ").slice(0, 160)
                : `Lihat detail proyek ${categoryConfig?.title.toLowerCase() ?? "AR4N Group"}.`,

            path:
                category && projectId
                    ? `/projects/${category}/${projectId}`
                    : "/projects",

            robots: hasValidProject
                ? "index,follow"
                : "noindex,follow",

            image: project?.thumbnail_url || undefined,

            imageAlt: project
                ? `${project.title} - AR4N Group`
                : undefined,

            breadcrumbs:
                hasValidProject && project && categoryConfig
                    ? [
                        {
                            name: "Home",
                            path: "/",
                        },
                        {
                            name: `${categoryConfig.title} Projects`,
                            path: `/projects/${category}`,
                        },
                        {
                            name: project.title,
                            path: `/projects/${category}/${projectId}`,
                        },
                    ]
                    : [],
        });
    }, [category, projectId, project, categoryConfig]);

    useEffect(() => {
        let active = true;

        async function loadProjectDetail() {
            if (
                !isCategorySlug(category) ||
                !projectId ||
                !/^\d+$/.test(projectId)
            ) {
                setLoading(false);
                setError("Project tidak ditemukan.");
                return;
            }

            const config = projectCategories[category];

            try {
                setLoading(true);
                setError(null);

                const [
                    productsResponse,
                    projectsResponse,
                ] = await Promise.all([
                    getProducts(),
                    getProjects(),
                ]);

                if (!active) return;

                const selectedProduct = findProductByCategory(
                    productsResponse,
                    category,
                    config
                );

                if (!selectedProduct) {
                    throw new Error(
                        "Kategori produk tidak ditemukan."
                    );
                }

                const categoryProjects = normalizeProjectsByCategory(
                    projectsResponse as ApiProjectsResponseWithPbg,
                    selectedProduct.id,
                    category
                );

                const selectedProject =
                    categoryProjects.find(
                        (item) =>
                            Number(item.id) === Number(projectId)
                    ) ?? null;

                if (!selectedProject) {
                    throw new Error(
                        "Project tidak ditemukan pada kategori ini."
                    );
                }

                setProject(selectedProject);

            } catch (reason) {
                if (!active) return;

                setError(
                    reason instanceof Error
                        ? reason.message
                        : "Gagal mengambil detail project."
                );

            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadProjectDetail();
        setProject(null);
        return () => {
            active = false;
        };
    }, [category, projectId]);

    const closeModal = () => {
        if  (location.state?.from === "home") {
            navigate("/", {replace: true });
            return;
        }
        if (isCategorySlug(category)) {
            navigate(`/projects/${category}`);
        } else {
            navigate("/projects");
        }
    };

    if (loading) {
        return (
            <>
                <Projects manageSeo={false} />

                <div className="project-modal">
                    <div className="project-modal-inner">
                        <div className="project-modal-content">
                            <div className="project-modal-placeholder">
                                <span className="projects-spinner" />

                                <p>Memuat detail project...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error || !project || !categoryConfig) {
        return (
            <>
                <Projects manageSeo={false} />

                <div
                    className="project-modal"
                    role="dialog"
                    aria-modal="true"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="project-modal-inner">
                        <button
                            className="modal-close"
                            onClick={closeModal}
                            aria-label="Tutup popup"
                        >
                            <X size={24} />
                        </button>

                        <div className="project-modal-content">
                            <h2>Project tidak ditemukan</h2>

                            <p>
                                {error || "Data project tidak tersedia."}
                            </p>

                            <button
                                className="project-modal-back"
                                onClick={closeModal}
                            >
                                <ArrowLeft size={16} />
                                Kembali ke Projects
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Projects manageSeo={false} />

            <ProjectModal
                project={project}
                categoryTitle={categoryConfig.title}
                onClose={closeModal}
            />
        </>
    );
}

type GalleryTileLayout = {
    columns: number;
    rows: number;
};

const PROJECT_GALLERY_LAYOUTS: Record<
    number,
    GalleryTileLayout[]
> = {
    1: [
        { columns: 12, rows: 3 },
    ],

    2: [
        { columns: 6, rows: 2 },
        { columns: 6, rows: 2 },
    ],

    3: [
        { columns: 7, rows: 2 },
        { columns: 5, rows: 2 },
        { columns: 12, rows: 2 },
    ],

    4: [
        { columns: 6, rows: 2 },
        { columns: 6, rows: 2 },
        { columns: 6, rows: 2 },
        { columns: 6, rows: 2 },
    ],

    5: [
        { columns: 7, rows: 2 },
        { columns: 5, rows: 2 },
        { columns: 5, rows: 2 },
        { columns: 7, rows: 2 },
        { columns: 12, rows: 2 },
    ],

    6: [
        { columns: 6, rows: 2 },
        { columns: 6, rows: 2 },
        { columns: 6, rows: 2 },
        { columns: 6, rows: 2 },
        { columns: 6, rows: 2 },
        { columns: 6, rows: 2 },
    ],

    7: [
        { columns: 7, rows: 2 },
        { columns: 5, rows: 2 },
        { columns: 5, rows: 2 },
        { columns: 7, rows: 2 },
        { columns: 4, rows: 2 },
        { columns: 4, rows: 2 },
        { columns: 4, rows: 2 },
    ],

    8: [
        { columns: 5, rows: 3 },
        { columns: 4, rows: 2 },
        { columns: 3, rows: 2 },
        { columns: 4, rows: 2 },
        { columns: 3, rows: 2 },
        { columns: 5, rows: 2 },
        { columns: 7, rows: 3 },
        { columns: 5, rows: 2 },
    ],
};

function getProjectGalleryLayout(
    count: number
): GalleryTileLayout[] {
    const result: GalleryTileLayout[] = [];

    for (let start = 0; start < count; start += 8) {
        const groupCount = Math.min(8, count - start);

        result.push(
            ...PROJECT_GALLERY_LAYOUTS[groupCount]
        );
    }

    return result;
}

function ProjectModal({
    project,
    onClose,
}: {
    project: ProjectData;
    categoryTitle: string;
    onClose: () => void;
}) {
    
    const [lightboxIndex, setLightboxIndex] =
        useState<number | null>(null);

    const isPbgProject = project.is_pbg === true;

    const sortedImages = [...project.images]
        .filter((image) => image.image_url)
        .sort((a, b) => a.sort_order - b.sort_order)
        .slice(0, 20);

    const mainImage =
        project.thumbnail_url ||
        sortedImages[0]?.image_url ||
        null;

    const galleryImages = isPbgProject
        ? []
        : sortedImages.filter(
              (image) => image.image_url !== mainImage
          );

    const galleryLayout = getProjectGalleryLayout(
        galleryImages.length
    );

    const mainImagePath =
    project.thumbnail_path ||
    sortedImages.find(
        (image) => image.image_url === mainImage
    )?.image_path ||
    null;

    const galleryLightboxOffset =
        !isPbgProject && mainImage ? 1 : 0;

    const lightboxImages = [
        ...(!isPbgProject && mainImage
            ? [
                {
                    src: getCmsMediaUrl(mainImagePath) ?? mainImage,
                    alt: `${project.title} - Featured Photo`,
                },
            ]
            : []),

        ...galleryImages.map((image, index) => ({
            src: getCmsMediaUrl(image.image_path) ?? image.image_url,
            alt: `${project.title} - Photo ${index + 2}`,
        })),
    ];

    const activeLightboxImage =
    lightboxIndex !== null
        ? lightboxImages[lightboxIndex] ?? null
        : null;

    const workArea = formatWorkArea(project.work_area);

    // Lock background scrolling while the modal is open.
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    // Keyboard navigation for image preview.
    useEffect(() => {
        const handleKeyboard = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (lightboxIndex !== null) {
                    setLightboxIndex(null);
                } else {
                    onClose();
                }

                return;
            }

            if (
                lightboxIndex === null ||
                lightboxImages.length <= 1
            ) {
                return;
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();

                setLightboxIndex(
                    (lightboxIndex + 1) % lightboxImages.length
                );
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();

                setLightboxIndex(
                    (lightboxIndex - 1 + lightboxImages.length) %
                        lightboxImages.length
                );
            }
        };

        window.addEventListener("keydown", handleKeyboard);

        return () => {
            window.removeEventListener("keydown", handleKeyboard);
        };
    }, [lightboxIndex, lightboxImages.length, onClose]);


    const showPreviousImage = () => {
        setLightboxIndex((current) => {
            if (current === null || lightboxImages.length <= 1) {
                return current;
            }

            return (
                current - 1 + lightboxImages.length
            ) % lightboxImages.length;
        });
    };

    const showNextImage = () => {
        setLightboxIndex((current) => {
            if (current === null || lightboxImages.length <= 1) {
                return current;
            }

            return (current + 1) % lightboxImages.length;
        });
    };

    const canZoomMainImage =
       !isPbgProject && Boolean(mainImage);

    return (
        <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="project-modal-inner">
                <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Tutup project detail"
                >
                    <X size={24} />
                </button>

                <div className="project-modal-content">
                    {/* PROJECT HEADER */}
                    <div className="project-modal-hero">
                        <div className="project-modal-info">
                            <p className="project-modal-kicker">
                                {isPbgProject
                                    ? "COMPANY / PROJECT INFORMATION"
                                    : "PROJECT DETAIL"}
                            </p>

                            <h2>{project.title}</h2>

                            {isPbgProject && workArea && (
                                <p className="project-modal-area">
                                    Luasan Bangunan yang dibuat PBG/SLF:{" "}
                                    <strong>{workArea} m²</strong>
                                </p>
                            )}

                            {project.description?.trim() && (
                                <p className="project-modal-description">
                                    {project.description.trim()}
                                </p>
                            )}
                        </div>

                        {/* FEATURED IMAGE */}
                        <div
                            className={`project-modal-featured ${
                                isPbgProject ? "is-pbg" : ""
                            } ${canZoomMainImage ? "is-zoomable" : ""}`}
                            role={canZoomMainImage ? "button" : undefined}
                            tabIndex={canZoomMainImage ? 0 : undefined}
                            aria-label={
                                canZoomMainImage
                                    ? `Perbesar foto utama ${project.title}`
                                    : undefined
                            }
                            onClick={() => {
                                if (canZoomMainImage) {
                                    setLightboxIndex(0);
                                }
                            }}
                            onKeyDown={(event) => {
                                if (
                                    canZoomMainImage &&
                                    (event.key === "Enter" || event.key === " ")
                                ) {
                                    event.preventDefault();
                                    setLightboxIndex(0);
                                }
                            }}
                        >
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={project.title}
                                />
                            ) : (
                                <div className="project-modal-placeholder">
                                    Image not available
                                </div>
                            )}

                            {!isPbgProject && (
                                <>
                                    <span className="project-modal-featured-number">
                                        01
                                    </span>

                                    <div className="project-modal-featured-overlay">
                                        <span>SELECTED PROJECT</span>
                                        <strong>{project.title}</strong>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* PROJECT GALLERY */}
                    {!isPbgProject && (
                        <section className="project-modal-gallery">
                            <div className="project-modal-gallery-heading">
                                <div>
                                    <p>PROJECT DOCUMENTATION</p>
                                    <h3>Project Gallery</h3>
                                </div>

                                <span>
                                    {galleryImages.length} PHOTOS
                                </span>
                            </div>

                            {galleryImages.length > 0 ? (
                                <div className="project-modal-gallery-grid"> 
                                    {galleryImages.map((image, index) => {
                                        const tile = galleryLayout[index];

                                        const photoNumber =
                                            index + galleryLightboxOffset + 1;

                                        return (
                                            <figure
                                                className="project-modal-gallery-item"
                                                key={image.id}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Perbesar foto ${photoNumber}`}
                                                style={{
                                                    gridColumn: `span ${tile.columns}`,
                                                    gridRow: `span ${tile.rows}`,
                                                    animationDelay: `${Math.min(index * 70, 700)}ms`,
                                                }}
                                                onClick={() =>
                                                    setLightboxIndex(index + galleryLightboxOffset)
                                                }
                                                onKeyDown={(event) => {
                                                    if (
                                                        event.key === "Enter" ||
                                                        event.key === " "
                                                    ) {
                                                        event.preventDefault();
                                                        setLightboxIndex(index + galleryLightboxOffset);
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={image.image_url}
                                                    alt={`${project.title} - Photo ${photoNumber}`}
                                                    loading="lazy"
                                                    decoding="async"
                                                />

                                                <figcaption>
                                                    <span>
                                                        {String(photoNumber).padStart(2, "0")}
                                                    </span>
                                                    <ArrowUpRight size={17} />
                                                </figcaption>
                                            </figure>
                                        );
                                    })}

                                </div>
                            ) : (
                                <div className="project-modal-gallery-empty">
                                    Foto galeri tambahan belum tersedia.
                                </div>
                            )}
                        </section>
                    )}

                    {/* FOOTER */}
                    <div className="project-modal-footer">
                        <button
                            className="project-modal-back"
                            onClick={onClose}
                        >
                            <ArrowLeft size={16} />
                            Back to Projects
                        </button>
                    </div>
                </div>
            </div>

            {/* IMAGE LIGHTBOX */}
            {activeLightboxImage && (
                <div
                    className="project-image-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Preview foto project"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setLightboxIndex(null);
                        }
                    }}
                >
                    <button
                        type="button"
                        className="project-image-lightbox-close"
                        onClick={() => setLightboxIndex(null)}
                        aria-label="Tutup preview gambar"
                    >
                        <X size={23} />
                    </button>

                    {lightboxImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="project-image-lightbox-nav prev"
                                onClick={showPreviousImage}
                                aria-label="Foto sebelumnya"
                            >
                                <ChevronLeft size={30} />
                            </button>

                            <button
                                type="button"
                                className="project-image-lightbox-nav next"
                                onClick={showNextImage}
                                aria-label="Foto berikutnya"
                            >
                                <ChevronRight size={30} />
                            </button>
                        </>
                    )}

                    <figure className="project-image-lightbox-content">
                        <img
                            src={activeLightboxImage.src}
                            alt={activeLightboxImage.alt}
                        />

                        <figcaption>
                            {activeLightboxImage.alt}

                            <span>
                                {(lightboxIndex ?? 0) + 1} /{" "}
                                {lightboxImages.length}
                            </span>
                        </figcaption>
                    </figure>
                </div>
            )}
        </div>
    );
}


