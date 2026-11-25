import { useEffect } from "react";
import { X } from "lucide-react";
import type { Project } from "../../types";

interface ProjectModalProps {
    project: Project & {
        thumbnail_url?: string | null;
        thumbnail_path?: string | null;
    };
    onClose: () => void;
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

export default function ProjectModal({
    project,
    onClose,
}: ProjectModalProps) {
    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", closeOnEscape);
        document.body.classList.add("modal-open");

        return () => {
            document.removeEventListener("keydown", closeOnEscape);
            document.body.classList.remove("modal-open");
        };
    }, [onClose]);

    const sortedImages = [...(project.images ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .slice(0, 20);

    const thumbnail =
        project.thumbnail_url ||
        sortedImages[0]?.image_url ||
        null;

    const galleryImages = sortedImages.filter(
        (image) => image.image_url !== thumbnail
    );

    const galleryLayout = getProjectGalleryLayout(
        galleryImages.length
    );

    const categoryName =
        project.category?.name || "Project";

    return (
        <div
            className="project-modal project-modal-home"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            onMouseDown={(event) => {
                if (event.currentTarget === event.target) {
                    onClose();
                }
            }}
        >
            <div className="modal-inner project-modal-inner">
                <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Close project"
                >
                    <X size={23} />
                </button>

                <div className="project-modal-content">
                    <section className="project-modal-hero">
                        <div className="project-modal-information">
                            <div className="project-modal-breadcrumb">
                                <span>AR4N GROUP</span>
                                <span>/</span>
                                <span>PROJECT DETAIL</span>
                            </div>

                            <p className="project-modal-kicker">
                                PROJECT DETAIL /{" "}
                                {categoryName.toUpperCase()}
                            </p>

                            <h2>{project.title}</h2>

                            {project.description && (
                                <p className="project-modal-description">
                                    {project.description}
                                </p>
                            )}
                           
                        </div>

                        <div className="project-modal-featured">
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt={project.title}
                                    loading="eager"
                                    decoding="async"
                                />
                            ) : (
                                <div className="project-modal-placeholder">
                                    Image not available
                                </div>
                            )}

                            <div className="project-modal-featured-overlay">
                                <span>FEATURED PROJECT</span>
                                <strong>{project.title}</strong>
                            </div>

                            <span className="project-modal-featured-number">
                                01
                            </span>
                        </div>
                    </section>

                    <section className="project-modal-gallery">
                        <div className="project-modal-gallery-heading">
                            <div>
                                <h3>Project Gallery</h3>
                            </div>

                            <span>{galleryImages.length} PHOTOS</span>
                        </div>

                        {galleryImages.length > 0 ? (
                            <div className="project-modal-gallery-grid">
                                {galleryImages.map((image, index) => {
                                    const tile = galleryLayout[index];

                                    return (
                                        <figure
                                            className="project-modal-gallery-item"
                                            key={image.id}
                                            style={{
                                                gridColumn: `span ${tile.columns}`,
                                                gridRow: `span ${tile.rows}`,
                                            }}
                                        >
                                            <img
                                                src={image.image_url}
                                                alt={`${project.title} - Photo ${index + 2}`}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </figure>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="project-modal-gallery-empty">
                                Belum ada foto tambahan untuk project ini.
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
